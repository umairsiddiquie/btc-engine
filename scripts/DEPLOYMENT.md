```markdown

# 🚀 Production Deployment Guide



## Prerequisites



| Service | Purpose | Managed Option | Self-Hosted |

|---------|---------|---------------|-------------|

| **Redis** | Queue (BullMQ) | Upstash, Redis Cloud | Docker, AWS ElastiCache |

| **Pinecone** | Semantic Memory | Pinecone Serverless | Weaviate, Qdrant |

| **PostgreSQL** | Structured Metadata (optional) | Supabase, Neon | Docker, RDS |

| **WordPress** | Publishing Target | WP Engine, Kinsta | Self-hosted + MCP plugin |

| **LLM API** | Agent Reasoning | OpenAI, Anthropic | Local LLM (Ollama) + fallback |





## Step 1: Environment Setup



```bash

# Clone & install

Git clone https://github.com/umairsiddiquie/btc-engine.git

Cd btc-engine

Npm ci



# Copy environment template

Cp .env.example .env



# Edit .env (see README for full list)

# Critical: Set at minimum:

# - OPENAI_API_KEY

# - PINECONE_API_KEY + PINECONE_INDEX

# - REDIS_URL

# - WORDPRESS_APP_PASSWORD

```





## Step 2: Local Development (Docker)



```yaml

# docker-compose.yml

Version: ‘3.8’



Services:

  Redis:

    Image: redis:7-alpine

    Ports: [6379:6379]

    Command: redis-server –appendonly yes



  App:

    Build: .

    Ports: [3000:3000]

    Environment:

      - REDIS_URL=redis://redis:6379

      - NODE_ENV=development

    Depends_on: [redis]

    Volumes:

-	./output:/app/output # Persist generated articles



  # Optional: Local vector DB

  Weaviate:

    Image: semitechnologies/weaviate:latest

    Ports: [8080:8080]

    Environment:

      QUERY_DEFAULTS_LIMIT: 25

      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: ‘true’

      PERSISTENCE_DATA_PATH: ‘/var/lib/weaviate’

```



```bash

# Start stack

Docker-compose up -d



# Run pipeline locally

Node src/orchestrator.js –input ./samples/research-note.md –local-memory



# View logs

Docker-compose logs -f app

```





## Step 3: Production Deployment (Kubernetes Example)



### 3.1 Build Container



```dockerfile

# Dockerfile

FROM node:18-alpine



WORKDIR /app



# Install dependencies

COPY package*.json ./

RUN npm ci –only=production



# Copy source

COPY src/ ./src/

COPY config/ ./config/

COPY .env.production ./.env



# Health check

HEALTHCHECK –interval=30s –timeout=10s \

  CMD node src/utils/healthcheck.js



CMD [“node”, “src/orchestrator.js”, “—daemon”]

```



### 3.2 Kubernetes Manifests (`k8s/`)



```yaml

# k8s/deployment.yaml

apiVersion: apps/v1

kind: Deployment

metadata: { name: btc-engine }

spec:

  replicas: 3

  selector: { matchLabels: { app: btc-engine } }

  template:

    metadata: { labels: { app: btc-engine } }

    spec:

      containers:

-	Name: engine

        Image: ghcr.io/umairsiddiquie/btc-engine:v4.2

        Ports: [{ containerPort: 3000 }]

        envFrom:

-	secretRef: { name: btc-secrets }

        resources:

          requests: { memory: “512Mi”, cpu: “250m” }

          limits: { memory: “2Gi”, cpu: “1000m” }

        livenessProbe:

          httpGet: { path: /health, port: 3000 }

          initialDelaySeconds: 30

```



```yaml

# k8s/queue-scaling.yaml (KEDA)

apiVersion: keda.sh/v1alpha1

kind: ScaledObject

metadata: { name: btc-workers }

spec:

  scaleTargetRef: { name: btc-engine }

  minReplicaCount: 2

  maxReplicaCount: 10

  triggers:

-	type: redis

    metadata:

      address: {{ .REDIS_URL }}

      listName: btc-queue

      listLength: “10” # Scale when 10+ jobs queued

```



### 3.3 Secrets Management



```bash

# Create Kubernetes secret

Kubectl create secret generic btc-secrets \

  --from-literal=openai-api-key=$OPENAI_API_KEY \

  --from-literal=pinecone-api-key=$PINECONE_API_KEY \

  --from-literal=wordpress-app-password=$WP_APP_PASSWORD \

  --dry-run=client -o yaml | kubectl apply -f –

```





## Step 4: GitHub Actions Integration



The pipeline triggers on PRs:



```yaml

# .github/workflows/pipeline.yml (excerpt)

On:

  Pull_request:

    Types: [opened, synchronize]

    Paths: [‘input/**’, ‘research/**’]



Jobs:

  Cognitive-pipeline:

    Runs-on: ubuntu-latest

    Steps:

-	uses: actions/checkout@v4

    

-	name: Trigger BTC Engine



      run: |

        curl -X POST ${{ secrets.BTC_ENGINE_WEBHOOK }} \

          -H “Authorization: Bearer ${{ secrets.BTC_WEBHOOK_TOKEN }}” \

          -H “Content-Type: application/json” \

          -d ‘{

            “pr_number”: ${{ github.event.pull_request.number }},

            “input_path”: “input/pr-${{ github.event.pull_request.number }}.md”,

            “options”: {

              “debate_enabled”: true,

              “min_novelty”: 6.0

            }

          }’

```
