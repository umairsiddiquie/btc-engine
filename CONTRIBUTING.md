```markdown

# Contributing to Behind the Chapter Engine



Thank you for interest in evolving this cognitive system. Contributions that enhance **rigor, transparency, or adaptability** are especially welcome.



## 🧭 Contribution Guidelines



### Before You Start

1. Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) and [`AGENTS.md`](./AGENTS.md)

2. Ensure your idea aligns with the core principle:  

   > *”Controlled disagreement + delayed consensus produces depth, not hallucinated certainty.”*

3. Open a [discussion](https://github.com/umairsiddiquie/btc-engine/discussions) for major changes



### Code Contributions

- Follow existing patterns: structured JSON outputs, Zod validation, epistemic role clarity

- Add tests for new agents or memory operations

- Update documentation (this repo values cognitive transparency)



### Prompt Engineering

- Never make prompts “more obedient” — make them more precise

- Include schema enforcement in all agent prompts

- Test prompts against edge cases (contradictory input, sparse evidence)



### Memory & Belief Systems

- Vector schema changes require migration scripts

- Belief update logic must be auditable (log all confidence deltas)

- Never delete contradiction records — archive with resolution status



## 🧪 Testing Your Changes



```bash

# 1. Unit tests

Npm test



# 2. Agent output validation

Npm run validate:agents



# 3. Cognitive consistency check

Npm run audit:beliefs



# 4. End-to-end dry run

Node src/orchestrator.js –input ./samples/test.md –dry-run –log-level=debug

```



## 📝 Pull Request Process



1. Fork and create a feature branch: `git checkout -b feat/your-idea`

2. Make changes with clear commit messages:  

   `feat(analyst): add subtext extraction for implicit assumptions`  

   `fix(memory): prevent embedding cache leak in vector-store.js`

3. Update documentation if behavior changes

4. Ensure all tests pass

5. Submit PR with:

   - Summary of cognitive impact (how does this improve rigor/depth?)

   - Test evidence (novelty/depth scores before/after if applicable)

   - Migration notes if schema changes



## 🧠 Cognitive Contribution Areas



We especially need help with:



| Area | Challenge | Desired Outcome |

|------|-----------|----------------|

| **Debate Resolution** | Current synthesizer is rule-based | Learnable resolution policies (RL?) |

| **Belief Propagation** | Simple linear diffusion | Graph neural net for belief influence |

| **Novelty Detection** | Cosine similarity to recent | Multi-hop theme graph traversal |

| **Human-in-the-Loop** | Basic draft editing | Interactive belief refinement UI |

| **Cross-Domain Synthesis** | Keyword-based | Embedding-space analogy detection |



## 🚫 What We Won’t Accept



- Prompts that encourage hallucination or overconfidence

- Agents that bypass schema validation

- Memory operations that delete contradiction records

- Features that prioritize speed over epistemic rigor

- Changes that make the system less transparent or auditable



## 🌱 Getting Help



- [Discussions](https://github.com/umairsiddiquie/btc-engine/discussions): Ideas, questions

- [Issues](https://github.com/umairsiddiquie/btc-engine/issues): Bugs, feature requests

- Email: umair.siddiquie@gmail.com (for sensitive cognitive design discussions)





> This system is a tool for structured thinking — not a replacement for human judgment.  

> Contribute to make it more rigorous, not more autonomous.

```
