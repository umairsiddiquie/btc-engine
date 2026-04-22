

### 5. Debate Engine (`src/debate/engine.js`)

```javascript

Export async function runDebate(architectOutput, { maxRounds = 3 } = {}) {

  Let current = architectOutput;

  

  For (let round = 1; round <= maxRounds; round++) {

    Const [advocate, skeptic] = await Promise.all([

      runAdvocate(current),

      runSkeptic(current)

    ]);

    

    Const resolution = await runSynthesizer({

      Original: current,

      Advocate,

      Skeptic,

      Round

    });

    

    // Check for convergence

    If (resolution.confidence_delta < 0.05) break;

    Current = resolution.refined;

  }

  

  Return current;

}

```
