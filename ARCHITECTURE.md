```markdown

# 🏗️ System Architecture Specification



## High-Level Data Flow



```mermaid

Flowchart TD

    A[Input: PR/Notes/Docs]  B[API Gateway]

    B  C[Orchestrator]

    C  D[Queue: BullMQ + Redis]

    

    Subgraph AgentPipeline [Agent Execution Layer]

        D  E[Ingestor]

        E  F[Analyst]

        F  G[Memory Lookup]

        G  H[Architect]

        H  I[Critic]

        I  J{Pass?}

        J |No| K[Re-Architect Loop]

        K  H

        J |Yes| L[Debate Engine?]

        L |Yes| M[Advocate vs Skeptic]

        M  N[Synthesizer]

        N  O[Publisher]

        L |No| O

    End

    

    O  P[WordPress MCP / Export]

    O  Q[Reflector Agent]

    Q  R[Update Semantic Memory]

    R  S[Update Theme Graph]

    S  T[Update World Model]

    T  U[Autonomous Topic Generator]

    U  V[Next Research Agenda]

```
