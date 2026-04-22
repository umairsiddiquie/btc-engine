# 📦 Behind the Chapter Engine — Complete Repository Package



A deployable blueprint for **`btc-engine`**: a research-to-publication intelligence system with memory, critique, adaptive reasoning, and collective cognition.





## 🗂️ Repository Structure



```

Btc-engine/

├── README.md

├── ARCHITECTURE.md

├── AGENTS.md

├── MEMORY.md

├── DEPLOYMENT.md

├── CONTRIBUTING.md

├── LICENSE

├── .env.example

├── docker-compose.yml

├── Dockerfile

├── package.json

├── .github/

│   └── workflows/

│       └── pipeline.yml

├── config/

│   ├── pinecone.js

│   ├── wordpress.js

│   └── agents.js

├── src/

│   ├── orchestrator.js

│   ├── agents/

│   │   ├── ingestor.js

│   │   ├── analyst.js

│   │   ├── architect.js

│   │   ├── critic.js

│   │   ├── publisher.js

│   │   ├── reflector.js

│   │   ├── advocate.js

│   │   ├── skeptic.js

│   │   ├── topic-generator.js

│   │   ├── hypothesis-generator.js

│   │   ├── contradiction-engine.js

│   │   └── belief-update.js

│   ├── memory/

│   │   ├── vector-store.js

│   │   ├── theme-graph.js

│   │   └── world-model.js

│   ├── debate/

│   │   ├── engine.js

│   │   └── resolution.js

│   ├── utils/

│   │   ├── logger.js

│   │   ├── error-handler.js

│   │   ├── scoring.js

│   │   └── embeddings.js

│   └── api/

│       ├── gateway.js

│       └── wordpress-mcp.js

├── tests/

│   ├── agents.test.js

│   ├── memory.test.js

│   └── pipeline.test.js

└── docs/

    ├── prompt-templates/

    ├── schema-examples/

    └── cognitive-dashboard-spec.md

```





## 📄 README.md



```markdown

# 🔭 Behind the Chapter Engine



	A structured intellectual production system — not content automation, but adaptive cognition with memory, critique, and narrative synthesis.



**System Name**: Behind the Chapter Engine  

**Purpose**: Transform raw research into insight-driven, publish-ready narratives  

**Core Advantage**: Interpretation > Summarization  

**License**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)  

**Author**: [Umair Abbas Siddiquie](https://github.com/umairsiddiquie)





## 🧠 What This Is (And Isn’t)



| ❌ Not This | ✅ But This |

| A blog generator | A research-to-publication intelligence system |

| Linear automation | Adaptive cognition with memory & critique |

| Static prompts | Epistemic agents with defined reasoning roles |

| One-off articles | Evolving world model with confidence scoring |

| Single-agent pipeline | Collective intelligence with structured disagreement |





## 🚀 Quick Start



```bash

# 1. Clone & install

Git clone https://github.com/umairsiddiquie/btc-engine.git

Cd btc-engine

Npm install



# 2. Configure environment

Cp .env.example .env

# Edit .env with your API keys



# 3. Run locally (Docker)

Docker-compose up



# 4. Trigger pipeline via GitHub PR

# Or test locally:

Node src/orchestrator.js –input ./samples/research-note.md

```





## 🏗️ System Architecture



```

INPUT (PR / Notes / Docs)

        ↓

[API Gateway]

        ↓

[Orchestrator + Queue (BullMQ/Redis)]

        ↓

│  Agent Pipeline (Sequential │

│  + Parallel with Debate)    │

        ↓

[Semantic Memory: Pinecone/Weaviate]

        ↓

[Theme Graph + World Model]

        ↓

[WordPress MCP API / Export]

        ↓

Published Article + Reflection Update

```



### Core Layers



1. **Execution Layer**: GitHub Actions + BullMQ queue system for reliability

2. **Agent Layer**: 12+ specialized agents with epistemic roles

3. **Memory Layer**: Vector DB + Theme Graph + Belief World Model

4. **Adaptive Layer**: Reflection, Debate Engine, Autonomous Topic Generator

5. **Cognitive Layer**: Hypothesis formation → Contradiction testing → Belief updates

6. **Collective Layer**: Multi-agent society with consensus/conflict resolution





## 🤖 Agent Registry



| Agent | Role | Output Schema |

| `Ingestor` | Structure chaos → JSON | `{key_ideas, claims, evidence, keywords}` |

| `Analyst` | Expose hidden structure | `{claims, subtext, assumptions, tensions, conceptual_reframe}` |

| `Architect` | Build intellectual narrative | `{title, abstract, sections[]}` |

| `Critic` | Stress-test arguments | `{weaknesses, gaps, shallow_sections, opportunities}` |

| `Publisher` | Precision WordPress-ready output | HTML with H2/H3, no fluff |

| `Reflector` | Self-evaluate novelty/depth | `{novelty_score, depth_score, missed_dimensions}` |

| `Advocate/Skeptic` | Pre-publication debate | Structured argument/counter-argument |

| `TopicGenerator` | Autonomous gap detection | `{topics[], type: gap|depth|contrarian|synthesis}` |

| `HypothesisGenerator` | Form testable models | `{hypotheses[], assumptions, predictions}` |

| `ContradictionEngine` | Reality-filter hypotheses | `{contradictions, weakened_hypotheses}` |

| `BeliefUpdate` | Maintain evolving world model | `{belief, confidence, evidence[], status}` |



➤ Full prompt definitions: [`AGENTS.md`](./AGENTS.md)





## 🧠 Memory System



### Three-Tier Memory Architecture



```mermaid

Graph LR

    A[Short-term: JSON/Redis]  B[Semantic: Pinecone Embeddings]

    B  C[World Model: Belief Graph + Confidence]

```



### Vector Schema (Pinecone)



```javascript

{

  Id: “article_<uuid>”,

  Values: [0.123, -0.456, ...], // text-embedding-3-large (3072-dim)

  Metadata: {

    Title: “Multitasking Is a Beautiful Lie”,

    Themes: [“cognitive illusion”, “productivity myth”],

    Novelty_score: 7.2,

    Depth_score: 8.1,

    Published_at: “2026-04-22”,

    Belief_refs: [“belief_attention_finite”, “belief_cognitive_load”]

  }

}

```



➤ Memory implementation details: [`MEMORY.md`](./MEMORY.md)





## ⚙️ Production Deployment



### Requirements



- Node.js 18+

- Redis (for BullMQ queue)

- Pinecone or Weaviate (vector DB)

- PostgreSQL (optional, for structured metadata)

- WordPress instance with REST API + MCP plugin



### Environment Variables (`.env`)



```env

# LLM Providers

OPENAI_API_KEY=sk-...

ANTHROPIC_API_KEY=sk-ant-...



# Vector Memory

PINECONE_API_KEY=pc-...

PINECONE_INDEX=behind-the-chapter

PINECONE_ENVIRONMENT=us-east1-gcp



# Queue & Orchestration

REDIS_URL=redis://localhost:6379

QUEUE_CONCURRENCY=5



# Publishing

WORDPRESS_URL=https://your-site.com

WORDPRESS_USERNAME=editor

WORDPRESS_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx



# Logging & Monitoring

LOG_LEVEL=info

SENTRY_DSN=https://...@sentry.io/...



# Cognitive Parameters

MIN_NOVELTY_SCORE=6.0

MIN_DEPTH_SCORE=7.0

CONSENSUS_THRESHOLD=0.75

MAX_DEBATE_ROUNDS=3

```



➤ Full deployment guide: [`DEPLOYMENT.md`](./DEPLOYMENT.md)





## 🔄 Pipeline Workflow (GitHub Actions)



```yaml

# .github/workflows/pipeline.yml

Name: Behind the Chapter Pipeline



On:

  Pull_request:

    Types: [opened, synchronize]

  Workflow_dispatch:

    Inputs:

      Input_path:

        Description: ‘Path to research input’

        Required: true

        Default: ‘input/research-note.md’



Jobs:

  Cognitive-pipeline:

    Runs-on: ubuntu-latest

    Timeout-minutes: 30

    

    Services:

      Redis:

        Image: redis:7-alpine

        Ports: [6379:6379]

    

    Steps:

-	Uses: actions/checkout@v4

      

-	Name: Setup Node



        Uses: actions/setup-node@v4

        With: { node-version: ‘18’, cache: ‘npm’ }

      

-	Name: Install dependencies

        Run: npm ci

        

-	Name: Run orchestrator

        Env:

          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

          PINECONE_API_KEY: ${{ secrets.PINECONE_API_KEY }}

          WORDPRESS_APP_PASSWORD: ${{ secrets.WORDPRESS_APP_PASSWORD }}

        Run: node src/orchestrator.js –pr ${{ github.event.pull_request.number }}

        

-	Name: Upload artifacts

        Uses: actions/upload-artifact@v4

        With:

          Name: pipeline-output

          Path: output/

```





## 📊 Cognitive Dashboard (UI Spec)



The system includes a real-time dashboard for monitoring and intervention:



### Panels



1. **Pipeline Flow**: Live agent execution status (pending/running/done)

2. **Insight Graph**: Theme network visualization (D3.js force-directed)

3. **Memory Explorer**: Search/embedding-based recall of past insights

4. **Debate Viewer**: Advocate vs. Skeptic argument trees

5. **Belief Map**: Confidence-scored concept nodes with evolution timeline

6. **Topic Intelligence**: Ranked topic candidates with novelty/depth scores

7. **Draft Editor**: Human-in-the-loop refinement pre-publish



➤ Dashboard spec: [`docs/cognitive-dashboard-spec.md`](./docs/cognitive-dashboard-spec.md)





## 🧪 Testing & Quality



```bash

# Run unit tests

Npm test



# Run integration tests (requires Redis + Pinecone mock)

Npm run test:integration



# Validate agent outputs against schema

Npm run validate:agents



# Cognitive consistency check

Npm run audit:beliefs

```



### Key Metrics Tracked



| Metric | Target | Purpose |

| Novelty Score | ≥ 6.0/10 | Avoid idea repetition |

| Depth Score | ≥ 7.0/10 | Ensure conceptual rigor |

| Contradiction Resolution Rate | ≥ 80% | Maintain logical coherence |

| Belief Stability Index | Track over time | Measure worldview maturation |

| Topic Acceptance Rate | Human-approved / generated | Calibrate autonomy |





## 🌱 Evolution Roadmap



```mermaid

Graph LR

    A[v1: Linear Pipeline]  B[v2: + Semantic Memory]

    B  C[v3: + Debate Engine]

    C  D[v4: + Autonomous Topic Gen]

    D  E[v5: Cognitive Architecture Layer]

    E  F[v6: Collective Intelligence]

    F  G[∞: Self-Modifying Epistemic System]

```



**Current**: v4.2 — Adaptive Intelligence with Autonomous Topic Discovery  

**Next**: v5.0 — Cognitive Architecture Layer (hypothesis → belief updates)





## 🤝 Contributing



We welcome contributions that enhance:

- Agent reasoning depth (prompt engineering + eval frameworks)

- Memory retrieval accuracy (embedding strategies, re-ranking)

- Debate resolution algorithms (consensus modeling)

- UI/UX for cognitive transparency



➤ Guidelines: [`CONTRIBUTING.md`](./CONTRIBUTING.md)





## ⚠️ Ethical Guardrails



This system is powerful. To prevent drift into confident misinformation:



✅ **Enforce**:

- Structured JSON outputs with schema validation

- Mandatory Critic + Skeptic presence in pipeline

- Confidence scoring with uncertainty propagation

- Human approval gate for publication (configurable)



❌ **Never**:

- Publish beliefs with confidence < 0.6 without disclaimer

- Allow agents to self-modify core reasoning rules without audit

- Suppress contradiction storage for “cleaner” output



	*”The power is not in any single agent. It is in controlled disagreement + delayed consensus.”*





## 📜 License



© 2026 Umair Abbas Siddiquie  

Released under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)  

You are free to share, adapt, and build upon this work — with attribution.





> **Final Reality Check**:  

> If implemented with discipline, this is no longer a content tool.  

> It is a **structured thinking entity** — a system that doesn’t just process information, but forms, tests, and revises beliefs over time.  

> Use it to amplify rigor, not replace judgment.

```
