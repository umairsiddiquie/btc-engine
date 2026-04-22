#### Theme Graph

```javascript

// Neo4j-style adjacency for theme relationships

Export class ThemeGraph {

  Constructor(db) { this.db = db; }

  

  Async addArticle(article) {

    // Create article node

    Await this.db.run(`

      CREATE (a:Article {id: $id, title: $title})

      SET a.published = timestamp()

    `, { id: article.id, title: article.title });

    

    // Link themes

    For (const theme of article.themes) {

      Await this.db.run(`

        MERGE (t:Theme {name: $theme})

        MERGE (a)-[:CONTAINS]->(t)

      `, { theme, id: article.id });

    }

  }

  

  Async findGaps(exploredThemes) {

    // Find high-centrality themes not yet connected to explored set

    Return await this.db.run(`

      MATCH (t:Theme)

      WHERE NOT t.name IN $explored

      WITH t, size((t)<-[:CONTAINS]-()) as frequency

      ORDER BY frequency DESC

      LIMIT 10

      RETURN t.name, frequency

    `, { explored: exploredThemes });

  }

}

```
