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
**Webhook Handler** (`src/api/gateway.js`):

```javascript

App.post(‘/webhook/github’, authenticate, async (req, res) => {

  Const { pr_number, input_path, options } = req.body;

  

  // Fetch PR content

  Const input = await github.getPRContent(pr_number);

  

  // Enqueue pipeline

  Await queue.add(‘pipeline’, { input, options }, {

    jobId: `pr-${pr_number}`,

    removeOnComplete: { age: 86400 } // Keep 24h

  });

  

  Res.status(202).json({ status: ‘queued’, job_id: `pr-${pr_number}` });

});

```





## Step 5: Monitoring & Observability



### Logging (Winston + Loki)



```javascript

// src/utils/logger.js

Import winston from ‘winston’;



Export const logger = winston.createLogger({

  Format: winston.format.combine(

    Winston.format.timestamp(),

    Winston.format.errors({ stack: true }),

    Winston.format.json()

  ),

  Transports: [

    New winston.transports.File({ filename: ‘output/logs/error.log’, level: ‘error’ }),

    New winston.transports.File({ filename: ‘output/logs/combined.log’ }),

    New winston.transports.Http({ 

      Host: ‘loki’, 

      Port: 3100, 

      Path: ‘/loki/api/v1/push’,

      Format: winston.format.json()

    })

  ]

});

```



### Metrics (Prometheus)



```javascript

// src/utils/metrics.js

Import client from ‘prom-client’;



Export const metrics = {

  agentDuration: new client.Histogram({

    name: ‘agent_execution_duration_seconds’,

    labelNames: [‘agent’, ‘status’],

    buckets: [0.1, 0.5, 1, 2, 5, 10]

  }),

  noveltyScore: new client.Histogram({

    name: ‘article_novelty_score’,

    labelNames: [‘topic_cluster’],

    buckets: [1,2,3,4,5,6,7,8,9,10]

  }),

  beliefConfidence: new client.Gauge({

    name: ‘belief_confidence_level’,

    labelNames: [‘belief_id’, ‘status’]

  })

};



// Expose endpoint

App.get(‘/metrics’, async (req, res) => {

  Res.set(‘Content-Type’, client.register.contentType);

  Res.end(await client.register.metrics());

});

```



### Dashboard (Grafana)



Pre-built dashboard JSON included in `monitoring/grafana-dashboard.json`:

- Pipeline latency heatmap

- Novelty/depth score distributions over time

- Belief confidence evolution graph

- Debate resolution success rate

## Step 6: Backup & Disaster Recovery



### Daily Backup Script (`scripts/backup.js`)

```javascript

Import { dump } from ‘redis’;

Import { Pinecone } from ‘@pinecone-database/pinecone’;



Async function backup() {

  Const timestamp = new Date().toISOString().split(‘T’)[0];

  

  // 1. Redis queue state

  Const redisDump = await dump(process.env.REDIS_URL);

  Await s3.upload(`backups/redis-${timestamp}.rdb`, redisDump);

  

  // 2. Pinecone index metadata (not vectors — recreate from articles)

  Const index = new Pinecone().Index(process.env.PINECONE_INDEX);

  Const metadata = await index.describeIndexStats();

  Await s3.upload(`backups/pinecone-meta-${timestamp}.json`, metadata);

  

  // 3. World Model (Neo4j)

  Await neo4j.backup(`backups/world-model-${timestamp}.dump`);

  

  Logger.info(`Backup completed: ${timestamp}`);

}

```



### Restore Procedure

1. Provision new infrastructure

2. Restore Neo4j dump → World Model

3. Re-ingest published articles → rebuild Pinecone index (idempotent)

4. Restore Redis queue state (optional — pending jobs can be re-triggered)





## Step 7: Security Hardening



### API Gateway Security

```javascript

// src/api/gateway.js

Import rateLimit from ‘express-rate-limit’;

Import helmet from ‘helmet’;



App.use(helmet()); // Security headers



App.use(‘/api’, rateLimit({

  windowMs: 15 * 60 * 1000, // 15 min

  max: 10, // 10 requests per window

  message: ‘Too many pipeline triggers — please space out requests’

}));



// Webhook authentication

Export function authenticate(req, res, next) {

  Const token = req.headers[‘authorization’]?.replace(‘Bearer ‘, ‘’);

  If (token !== process.env.BTC_WEBHOOK_TOKEN) {

    Return res.status(401).json({ error: ‘Unauthorized’ });

  }

  Next();

}

```



### LLM Prompt Injection Defense

- All user input is sanitized before inclusion in prompts

- System prompts are immutable (loaded from config, not user input)

- Output schema validation catches hallucinated fields



### Data Isolation

- Multi-tenant ready: prefix Redis keys + Pinecone namespaces by `org_id`

- Environment separation: `PINECONE_INDEX=behind-the-chapter-prod` vs `-dev`





## Troubleshooting



| Symptom | Likely Cause | Fix |

| Pipeline hangs at “Analyst” | LLM timeout / rate limit | Check `OPENAI_API_KEY`; increase `timeout` in orchestrator |

| Low novelty scores | Memory retrieval too broad | Tighten `minNovelty` filter in `vector-store.js` |

| Belief confidence drifts | Contradiction Engine not triggered | Verify `debate_enabled: true` in options |

| WordPress publish fails | Auth or CORS issue | Test MCP plugin endpoint manually; check `WORDPRESS_URL` |

| High memory usage | Vector embedding cache leak | Add TTL to Redis embedding cache (`src/utils/embeddings.js`) |



### Diagnostic Commands

```bash

# Check queue depth

Redis-cli LLEN btc-queue



# Test vector retrieval

Node -e “import(‘./src/memory/vector-store.js’).then(m => m.default.retrieve(‘attention’, {topK:1}).then(console.log))”



# Validate belief graph

Cypher-shell -u neo4j -p $NEO4J_PASSWORD “MATCH (b:Belief) RETURN b.id, b.confidence LIMIT 10”



# Dry-run pipeline (no publish)

Node src/orchestrator.js –input ./test.md –dry-run –log-level=debug

```





## Upgrading Versions



The system follows semantic versioning for cognitive behavior:



- **v4.x → v5.x**: Cognitive Architecture Layer (hypothesis → belief updates)

  - Migration: Run `scripts/migrate-beliefs.js` to extract beliefs from v4 articles

  - Breaking: Publisher now only outputs beliefs with confidence ≥ 0.75 (configurable)



-	**Minor versions**: New agents or memory features (backward compatible)



Always test upgrades in staging first:

```bash

# Staging deploy

Kubectl apply -f k8s/ --namespace=btc-staging



# Run validation suite

Npm run test:cognitive -- --staging

```





> Deployment is not the end. It is the beginning of learning.  

> Monitor belief evolution, not just uptime. The system’s intelligence grows only if you let it reflect.

```
