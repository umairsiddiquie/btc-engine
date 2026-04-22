### 4. Memory Services



#### Vector Store (`vector-store.js`)

```javascript

Import { Pinecone } from ‘@pinecone-database/pinecone’;



Export class VectorMemory {

  Constructor(indexName) {

    This.index = new Pinecone().Index(indexName);

  }

  

  Async store(article) {

    Const embedding = await embed(article.title + ‘ ‘ + article.abstract);

    Await this.index.upsert([{

      Id: article.id,

      Values: embedding,

      Metadata: {

        Themes: article.themes,

        Novelty_score: article.novelty_score,

        Belief_refs: article.belief_refs,

        Published_at: new Date().toISOString()

      }

    }]);

  }

  

  Async retrieve(query, { topK = 5, minNovelty = 6.0 } = {}) {

    Const queryEmbedding = await embed(query);

    Const results = await this.index.query({

      Vector: queryEmbedding,

      topK,

      filter: { novelty_score: { $gte: minNovelty } },

      includeMetadata: true

    });

    Return results.matches.map(m => m.metadata);

  }

}

```
