### 3. Agent Services

Each agent:

- Accepts structured JSON input

- Calls LLM with role-specific prompt + schema enforcement

- Validates output against Zod schema

- Logs inputs/outputs to Winston



Example: `src/agents/analyst.js`

```javascript

Import { z } from ‘zod’;

Import { callLLM } from ‘../utils/llm.js’;

Import { AnalystOutputSchema } from ‘../schemas/analyst.js’;



Export async function runAnalyst(input, context = {}) {

  Const prompt = buildAnalystPrompt(input, {

    pastInsights: context.semanticResults,

    themeGraph: context.themeContext

  });

  

  Const raw = await callLLM(prompt, {

    Model: ‘gpt-4o’,

    Response_format: { type: ‘json_object’ }

  });

  

  Return AnalystOutputSchema.parse(raw); // Throws on invalid

}

```
