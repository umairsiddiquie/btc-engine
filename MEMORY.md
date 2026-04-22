```markdown

# 🧠 Memory System Specification



## Three-Tier Architecture



```mermaid

Graph TD

    A[Short-term: Redis/JSON] |Frequent access| B[Semantic: Vector DB]

    B |Thematic aggregation| C[World Model: Belief Graph]

    C |Confidence-weighted| D[Topic Generation / Publishing]

```





## Tier 1: Short-term Memory (Execution Context)



**Purpose**: Cache for current pipeline run



**Implementation**:

- Redis hash: `btc:run:{trace_id}`

- TTL: 24 hours

- Stores: raw input, agent outputs, intermediate states



**Use Cases**:

- Retry recovery (re-run Architect without re-ingesting)

- Debugging (inspect Analyst → Architect handoff)

- Human-in-the-loop editing (pause pipeline, modify draft)





## Tier 2: Semantic Memory (Vector DB)



### Schema Design (Pinecone)



```javascript

// Vector: text-embedding-3-large (3072 dimensions)

{

  Id: “art_7f3a9b2c”, // article UUID

  Values: Float32Array(3072),

  Metadata: {

    // Core content

    Title: “Multitasking Is a Beautiful Lie”,

    Abstract: “string”,

    Themes: [“cognitive illusion”, “productivity myth”],

    

    // Quality metrics

    Novelty_score: 7.2,

    Depth_score: 8.1,

    Word_count: 1240,

    

    // Cognitive context

    Belief_refs: [“belief_attention_finite”, “belief_cognitive_load”],

    Tensions_resolved: [“tension_efficiency_vs_depth”],

    

    // Temporal

    Published_at: “2026-04-22T14:30:00Z”,

    Last_reflected: “2026-04-22T14:35:00Z”,

    

    // Provenance

    Input_source: “github_pr_42”,

    Agent_versions: {

      Analyst: “v2.1”,

      Architect: “v1.8”

    }

  }

}

```



### Index Configuration



```javascript

// Pinecone index spec

{

  Name: “behind-the-chapter”,

  Dimension: 3072,

  Metric: “cosine”,

  Spec: {

    Serverless: {

      Cloud: “aws”,

      Region: “us-east-1”

    }

  },

  metadataConfig: {

    indexed: [“themes”, “belief_refs”, “novelty_score”] // for filtering

  }

}

```



### Retrieval Strategies



#### 1. Thematic Recall (Pre-Analyst)

```javascript

Async function getThematicContext(keywords, { topK = 5 }) {

  Const query = keywords.join(‘ ‘);

  Const embedding = await embed(query);

  

  Return await pinecone.query({

    Vector: embedding,

    topK,

    filter: { novelty_score: { $gte: 6.0 } }, // avoid shallow repeats

    includeMetadata: true

  });

}

```



#### 2. Belief-Aware Retrieval (Pre-Publish)

```javascript

Async function getBeliefContext(requiredBeliefs) {

  // Fetch articles that engage with these beliefs

  Const results = await pinecone.query({

    Vector: [0,0,0...], // dummy vector — metadata filter only

    Filter: {

      Belief_refs: { $in: requiredBeliefs },

      Confidence: { $gte: 0.7 } // only stable beliefs

    },

    topK: 10

  });

  

  // Enrich with belief confidence from WorldModel

  Return results.matches.map(m => ({

    ...m.metadata,

    Belief_confidence: worldModel.getConfidence(m.metadata.belief_refs)

  }));

}

```



#### 3. Gap Detection (Pre-TopicGen)

```javascript

Async function findSemanticGaps(exploredThemes, { radius = 0.3 }) {

  // 1. Get centroid of explored themes

  Const exploredEmbeddings = await Promise.all(

    exploredThemes.map(t => embed(t))

  );

  Const centroid = averageVector(exploredEmbeddings);

  

  // 2. Query for low-density regions

  Const sparse = await pinecone.query({

    Vector: centroid,

    topK: 100,

    includeMetadata: true

  });

  

  // 3. Filter for low-frequency themes

  Return sparse.matches

    .filter(m => m.metadata.theme_frequency < 3)

    .map(m => m.metadata.themes)

    .flat()

    .filter((v, i, a) => a.indexOf(v) === i); // unique

}

```





## Tier 3: World Model (Belief Graph)



### Schema (Neo4j-style)



```cypher

// Nodes

(:Belief {

  Id: “belief_attention_finite”,

  Statement: “Human attention is a finite cognitive resource”,

  Confidence: 0.91,

  Status: “stable”,

  Created_at: timestamp(),

  Last_updated: timestamp()

})



(:Article {

  Id: “art_7f3a9b2c”,

  Title: “Multitasking Is a Beautiful Lie”

})



ce(beliefId, evidence, direction) {

  Const delta = direction === ‘support’ ? 0.05 : -0.08;

  

  Await db.run(`

    MATCH (b:Belief {id: $id})

    SET b.confidence = b.confidence + $delta,

        b.last_updated = timestamp(),

        b.status = CASE 

          WHEN b.confidence + $delta >= 0.8 THEN ‘stable’

          WHEN b.confidence + $delta <= 0.3 THEN ‘weakened’

          ELSE b.status

        END

  `, { id: beliefId, delta });

  

  // Propagate to related beliefs (simple diffusion)

  Await db.run(`

    MATCH (b:Belief {id: $id})-[:RELATED_TO]->(related)

    SET related.confidence = related.confidence + ($delta * 0.2)

  `, { id: beliefId, delta });

}

```



#### Query Publishable Beliefs

```javascript

Async function getPublishableBeliefs({ minConfidence = 0.75, minSupport = 3 } = {}) {

  Return await db.run(`

    MATCH (b:Belief)

    WHERE b.confidence >= $minConfidence

    AND size((:Article)-[:SUPPORTS]->(b)) >= $minSupport

    AND b.status = ‘stable’

    RETURN b {

      .id, .statement, .confidence,

      Support_count: size((:Article)-[:SUPPORTS]->(b)),

      Challenge_count: size((:Article)-[CHALLENGES]->(b))

    }

    ORDER BY b.confidence DESC

  `, { minConfidence, minSupport });

}

```
