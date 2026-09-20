# ♻️ Circular Tech as part of 1m1b Internship

## AI-Powered Circular IT Asset Management Platform

Circular Tech is an AI-powered circular resource intelligence and decision-support platform designed for institutions managing physical IT assets such as **laptops, monitors, projectors, and printers**.

The platform helps organizations track their IT assets, analyze their condition and usage using AI, generate lifecycle recommendations, match available resources with departmental requirements, and estimate financial and environmental impact.

### Core Lifecycle

**Track → Analyze → Recommend → Match → Measure → Human Decision**

---

## 🎯 Problem Statement

Institutions often manage hundreds or thousands of IT assets, but traditional asset management mainly focuses on inventory tracking.

This can result in:

- Usable equipment remaining unused.
- Departments purchasing new equipment while suitable assets already exist internally.
- Aging assets requiring decisions about repair, refurbishment, reuse, recycling, or replacement.
- Limited visibility into the financial and environmental benefits of asset reuse.
- AI-generated recommendations requiring transparency and human oversight.

Circular Tech addresses these challenges by combining **IT asset management, AI-powered lifecycle analysis, resource matching, impact measurement, and responsible AI** into a unified platform.

---

## 💡 Solution

Circular Tech provides a centralized platform for managing the complete lifecycle of institutional IT assets.

### Key Capabilities

- Centralized IT asset registry
- Asset condition and lifecycle tracking
- AI-powered asset analysis
- Lifecycle recommendations
- Department resource requests
- Available asset matching
- Financial impact estimation
- Environmental impact estimation
- AI transparency and audit logging
- Human oversight for important decisions

---

# 🏗️ System Architecture

```text
                         👤 USER
                           │
                           ▼
              ┌────────────────────────┐
              │        FRONTEND         │
              │        Next.js          │
              │        React             │
              │        Tailwind CSS      │
              │                          │
              │  • Dashboard             │
              │  • Asset Registry        │
              │  • Analyze Asset         │
              │  • Resource Matching     │
              │  • Impact Dashboard      │
              │  • Responsible AI        │
              └────────────┬─────────────┘
                           │
                           │ REST API
                           ▼
              ┌────────────────────────┐
              │         BACKEND         │
              │    Express + TypeScript │
              │                         │
              │  • Asset APIs           │
              │  • Request APIs         │
              │  • AI Decision Engine   │
              │  • Impact Calculations  │
              │  • Audit Logging        │
              │  • Validation           │
              └────────────┬─────────────┘
                           │
                 ┌─────────┴──────────┐
                 │                    │
                 ▼                    ▼
       ┌──────────────────┐   ┌──────────────────┐
       │   MongoDB Atlas  │   │    OpenRouter    │
       │                  │   │                  │
       │ • Assets         │   │    LLM / AI      │
       │ • Recommendations│   │    Analysis      │
       │ • Requests       │   │                  │
       │ • Impact Records │   └──────────────────┘
       │ • Audit Logs     │
       │ • Maintenance    │
       │ • Knowledge Docs │
       └──────────────────┘
```

---

# 🔄 Application Flow

```text
                    START
                      │
                      ▼
             Register IT Asset
                      │
                      ▼
          Store Asset in MongoDB
                      │
                      ▼
             User Selects Asset
                      │
                      ▼
             Click "Analyze"
                      │
                      ▼
            Backend Retrieves Data
                      │
                      ▼
                 AI Analysis
                      │
                      ▼
          Generate Recommendation
                      │
                      ▼
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
   AI Recommendation          Human Review
        │                           │
        └─────────────┬─────────────┘
                      ▼
             Lifecycle Action
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
      REPAIR       REUSE        REDEPLOY
        │             │             │
        ├───────┬─────┴──────┬──────┤
        ▼       ▼            ▼
   REFURBISH  RECYCLE     REPLACE
                      │
                      ▼
              Resource Matching
                      │
                      ▼
          Match Available Assets
          With Department Needs
                      │
                      ▼
              Impact Calculation
                      │
                      ▼
       Financial + Environmental
                 Metrics
                      │
                      ▼
                  Audit Log
                      │
                      ▼
                     END
```

---

# 🤖 AI Decision Engine

When a user selects an asset and triggers analysis, Circular Tech retrieves the relevant asset information from MongoDB and sends it to the AI engine.

The AI considers:

- Asset category
- Condition
- Reported issue
- Usage status
- Lifecycle status

The AI generates a structured lifecycle recommendation.

### Lifecycle Decisions

| Decision | Description |
|---|---|
| `REPAIR` | Minor repair can allow continued use |
| `REFURBISH` | Deeper refurbishment is required |
| `REUSE` | Asset can continue to be used |
| `REDEPLOY` | Asset can be moved to another department |
| `RECYCLE` | Asset should be responsibly recycled |
| `REPLACE` | Asset should be replaced |
| `NEEDS_REVIEW` | Human expert review is required |

### AI Recommendation Information

Each recommendation can include:

- Decision
- Confidence
- Reasons
- Evidence
- Alternatives
- Assumptions
- Safety notes
- Human review requirement

---

# ♻️ Resource Matching

Circular Tech allows departments to submit resource requirements and identifies suitable available assets.

### Example

```text
Department A
     │
     │ Unused Laptop
     ▼
Circular Tech
     │
     │ Intelligent Matching
     ▼
Department B
     │
     │ Requires Laptop
     ▼
Laptop Redeployed
```

The matching process considers:

1. Asset category
2. Asset availability
3. Asset condition
4. Required specifications
5. Compatibility

The goal is to improve the utilization of existing resources and reduce unnecessary procurement.

---

# 📊 Impact Measurement

Circular Tech calculates estimated impact metrics based on asset lifecycle decisions.

| Metric | Description |
|---|---|
| **Assets Circulated** | Assets reused or redeployed |
| **Procurement Avoided** | Estimated replacement cost avoided |
| **Cost Difference** | Difference between replacement and maintenance costs |
| **Waste Avoided** | Estimated mass of equipment kept in circulation |
| **Life Extension** | Estimated additional useful life |

> **Note:** Impact values are estimates based on project assumptions and are not presented as verified carbon claims.

---

# 🛡️ Responsible AI

Circular Tech incorporates responsible AI principles into the decision-making workflow.

### Transparency
AI recommendations expose their reasoning, assumptions, evidence, and confidence.

### Human Oversight
AI does not autonomously approve critical disposal, purchasing, or hazardous repair decisions.

### Safety
Assets marked as unsafe require human review.

### Privacy
Only necessary asset information is used for AI analysis.

### Auditability
AI-related actions and decisions are recorded in audit logs.

### Uncertainty
The system can use `NEEDS_REVIEW` rather than making an unsupported decision.

---

# 🗄️ Database

Circular Tech uses **MongoDB Atlas** with Mongoose.

### Main Collections

```text
assets
recommendations
resourcerequests
impactrecords
auditlogs
maintenancerecords
knowledgedocuments
```

### Synthetic Demo Dataset

The seed data currently contains:

- 20 Assets
- 8 Maintenance Records
- 3 Resource Requests
- 3 Recommendations
- 3 Impact Records
- 5 Knowledge Documents
- 3 Audit Records

---

# 🧰 Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express.js
- TypeScript
- REST APIs
- CORS
- dotenv

### Database

- MongoDB Atlas
- Mongoose

### AI

- OpenRouter
- LLM-based AI analysis
- AI lifecycle decision engine

---

# 📁 Project Structure

```text
CIRCULAR-TECH/
│
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   ├── openRouterService.ts
│   │   │   └── decisionEngine.ts
│   │   │
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── db.ts
│   │   ├── config.ts
│   │   ├── app.ts
│   │   ├── index.ts
│   │   └── seed.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   │
│   └── package.json
│
├── ai/
│   └── prompt templates
│
├── data/
│   └── seed datasets
│
├── knowledge-base/
│
├── .env.example
├── README.md
└── netlify.toml
```

---

# ⚙️ Required Configuration

Copy:

```text
backend/.env.example
```

to:

```text
backend/.env
```

Then configure:

```env
MONGODB_URI=your_mongodb_atlas_uri
AI_API_KEY=your_openrouter_key
AI_MODEL=your_openrouter_model
```

## MongoDB Atlas

Add the machine's public IP address to:

```text
MongoDB Atlas
      ↓
Network Access
      ↓
IP Access List
```

For development, the project can use:

```text
0.0.0.0/0
```

This allows connections from any IPv4 address at the network-access level.

> For production deployments, restrict access to the required server or deployment IP addresses whenever possible.

---

# 🚀 Running the Project

## 1. Clone the Repository

```powershell
git clone <repository-url>
cd circular-tech
```

## 2. Configure Environment Variables

Create:

```text
backend/.env
```

from:

```text
backend/.env.example
```

Add:

```env
MONGODB_URI=your_mongodb_atlas_uri
AI_API_KEY=your_openrouter_key
AI_MODEL=your_openrouter_model
```

Make sure the machine's public IP is allowed in MongoDB Atlas Network Access.

---

## 3. Start the Backend

Open **Terminal 1**:

```powershell
cd backend

npm install

npm run seed

npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## 4. Start the Frontend

Open **Terminal 2**:

```powershell
cd frontend

npm install

Copy-Item .env.example .env.local

npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

Open the application in your browser:

```text
http://localhost:3000
```

---

# 🧪 Validation

## Backend

```powershell
cd backend

npm run typecheck

npm test
```

## Frontend

```powershell
cd frontend

npm run lint

npm run build
```

---

# 🔌 API Endpoints

### Health

```text
GET /api/health
```

### Assets

```text
GET    /api/assets
GET    /api/assets/:id
POST   /api/assets
PUT    /api/assets/:id
DELETE /api/assets/:id
POST   /api/assets/:id/analyze
```

### Resource Requests

```text
GET  /api/requests
POST /api/requests
GET  /api/requests/:id
POST /api/requests/:id/match
```

### Recommendations

```text
GET  /api/recommendations/:id
POST /api/recommendations/:id/approve
POST /api/recommendations/:id/reject
```

### Impact

```text
GET /api/impact
```

### Audit

```text
GET /api/audit
```

### Responsible AI

```text
GET /api/responsible-ai
```

---

# 🔐 Security

Never commit credentials or API keys to the repository.

Do not commit:

```text
.env
.env.local
```

If credentials were previously exposed or committed, rotate them before continuing.

---


# 🔮 Future Scope

Future versions of Circular Tech can extend the platform with:

- RAG-based knowledge retrieval
- Agentic AI workflows
- Document ingestion and embeddings
- Vector database integration
- Authentication and role-based access
- Real institutional asset datasets
- Predictive maintenance
- Advanced asset health prediction
- Enterprise asset management integrations

---

# 🌱 Vision

Circular Tech aims to help institutions move from a linear IT asset lifecycle:

```text
BUY → USE → DISCARD
```

towards a circular lifecycle:

```text
BUY
  ↓
USE
  ↓
ANALYZE
  ↓
REPAIR / REFURBISH
  ↓
REUSE / REDEPLOY
  ↓
RECYCLE
  ↓
RESPONSIBLE RESOURCE MANAGEMENT
```

---

## ♻️ Circular Tech

### Making Every IT Asset Count.

