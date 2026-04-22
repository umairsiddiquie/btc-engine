### Bootstrap Script

```javascript

// Run once on first deploy

Import { Pinecone } from ‘@pinecone-database/pinecone’;

Import { Neo4j } from ‘neo4j-driver’;



Async function bootstrap() {

  // 1. Create Pinecone index

  Await new Pinecone().createIndex({

    Name: ‘behind-the-chapter’,

    Dimension: 3072,

    Metric: ‘cosine’,

    Spec: { serverless: { cloud: ‘aws’, region: ‘us-east-1’ } }

  });

  

  // 2. Initialize Neo4j schema

  Const driver = Neo4j.driver(process.env.NEO4J_URI, Neo4j.auth.basic(...));

  Await driver.session().run(`

    CREATE CONSTRAINT belief_id IF NOT EXISTS FOR (b:Belief) REQUIRE b.id IS UNIQUE;

    CREATE CONSTRAINT article_id IF NOT EXISTS FOR (a:Article) REQUIRE a.id IS UNIQUE;

  `);

  

  // 3. Seed core beliefs (optional)

  Await seedCoreBeliefs(driver);

}

```



### Migration Strategy

- **v1 → v2**: Add `belief_refs` metadata to existing vectors (backfill via LLM re-analysis)

- **v2 → v3**: Extract beliefs from articles → populate Neo4j graph

- **Always**: Maintain backward compatibility via schema versioning in metadata





## Privacy & Data Governance



- **Embeddings**: Never store raw user input in vector DB — only processed, structured outputs

- **Belief Graph**: All belief updates logged with provenance (which article/agent)

- **Retention**: Short-term memory auto-deletes after 24h; semantic memory retained indefinitely (configurable)

- **Export**: `npm run export:memory` → JSON dump for audit/backup





> Memory is not storage. It is the substrate of learning.  

> Design for retrieval, not just insertion. Optimize for insight continuity, not just speed.

```
