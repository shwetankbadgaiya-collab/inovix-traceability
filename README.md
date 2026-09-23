# INOVIX – Low-Cost IoT Blockchain Nodes for Farm-to-Fork Traceability

> **"Making Every Food Journey Visible, Verifiable & Affordable"**

INOVIX is an end-to-end, production-grade Farm-to-Fork Traceability Platform integrating **IoT telemetry**, **permissioned blockchain verification**, **real-time WebSocket updates**, and **public QR verification** across the food supply chain.

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |   ESP32 / IoT Nodes   |
                                  | (Temp, Humidity, GPS) |
                                  +-----------+-----------+
                                              | HTTP POST / Telemetry
                                              v
+-------------------+             +-----------------------+
|  React + TS SPA   | <=========> |   Node.js / Express   |
|   (Vite Port 3000)|  REST & WS  |     (Port 5000)       |
+---------+---------+             +-----------+-----------+
          |                                   |
          | Public URL                        | Prisma ORM
          v                                   v
+-------------------+             +-----------------------+
| Public QR Verify  |             |  SQLite / PostgreSQL  |
| (/verify/:token)  |             |    (dev.db / prod)    |
+-------------------+             +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  | Development Blockchain|
                                  |  Ledger & Hash Engine |
                                  +-----------------------+
```

### Supply Chain Lifecycle
$$\text{FARM} \longrightarrow \text{COLLECTION} \longrightarrow \text{PROCESSING} \longrightarrow \text{WAREHOUSE} \longrightarrow \text{TRANSPORT} \longrightarrow \text{RETAIL} \longrightarrow \text{CONSUMER}$$

---

## 🚀 Key Features

1. **Full-Stack REST Architecture**: Express + TypeScript backend with 30+ endpoints handling batches, nodes, blockchain, alerts, users, analytics, and verification.
2. **Database with Prisma ORM**: Relational schema across 9 core models with foreign keys, constraints, and audit logging. Defaults to SQLite for zero-config hackathon usage; easily switchable to PostgreSQL via `DATABASE_URL`.
3. **True Authentication & RBAC**: Real JWT tokens with `bcryptjs` password hashing and server-enforced role-based access control across 9 stakeholder roles:
   - `FARMER`, `COLLECTION_CENTER`, `PROCESSOR`, `WAREHOUSE`, `LOGISTICS`, `RETAILER`, `CONSUMER`, `REGULATOR`, `ADMIN`
4. **Interactive IoT Simulator**: Backend simulation engine generating continuous, realistic environmental telemetry (temperature drift, humidity fluctuation, battery consumption, GPS routing) and broadcasting via Socket.IO.
5. **Intelligent Alert Engine**: Server-side threshold monitoring (`HIGH_TEMPERATURE`, `LOW_TEMPERATURE`, `HIGH_HUMIDITY`, `LOW_BATTERY`, `CONNECTIVITY_LOST`) with acknowledge and resolve workflows.
6. **Development Blockchain Ledger**: Cryptographically generated SHA-256 transaction hashes (`0x...`), block sequencing, and pending $\to$ verified state transitions.
7. **Public QR Verification Portal**: Consumer-facing verification page (`/verify/:token` and `/verify/:batchId`) providing full batch origin, timeline, handling organizations, and blockchain proof with zero private farmer data exposure.

---

## 📦 Project Structure

```
inovix/
├── server/                     # Backend API Server
│   ├── prisma/
│   │   ├── schema.prisma       # 9 Prisma models with relations
│   │   └── seed.ts             # Comprehensive database seeder
│   ├── src/
│   │   ├── config/             # DB & Environment configuration
│   │   ├── controllers/        # Express controllers (auth, batch, iot, etc.)
│   │   ├── middleware/         # JWT auth, RBAC authorization, Zod validation
│   │   ├── routes/             # API routes
│   │   ├── services/           # AlertEngine, BlockchainService, IoTSimulator
│   │   ├── websocket/          # Socket.IO event handler
│   │   ├── app.ts              # Express application configuration
│   │   └── index.ts            # Server entrypoint (Port 5000)
│   ├── .env                    # Active environment settings
│   └── .env.example            # Environment template
│
├── src/                        # Frontend Application (React + Vite)
│   ├── components/
│   │   ├── layout/             # Sidebar, Navbar, MobileNav, PublicLayout
│   │   └── ui/                 # Reusable UI components (Cards, Badges, Modals)
│   ├── contexts/               # Real AuthContext (JWT) & DemoContext
│   ├── pages/
│   │   ├── public/             # Landing, HowItWorks, Tech, Verify, Login
│   │   └── dashboard/          # Batches, BatchDetail, IoT, Blockchain, Alerts, Analytics
│   ├── services/               # API service abstractions calling backend
│   └── App.tsx                 # Client routing & ProtectedRoute
└── package.json
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+ (tested on Node.js v22.18.0)
- npm v9+

### 2. Start Backend Server
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 3. Start Frontend App
```bash
# In the root inovix directory:
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🔑 Demo Credentials

All demo accounts share the password: `demo123`

| Role | Email | Organization |
|---|---|---|
| **Farmer** | `farmer@demo.inovix.com` | Patel Farms |
| **Collection Centre** | `collector@demo.inovix.com` | AgriCollect MP |
| **Food Processor** | `processor@demo.inovix.com` | Verma Foods Processing |
| **Warehouse** | `warehouse@demo.inovix.com` | Central Warehousing |
| **Logistics** | `logistics@demo.inovix.com` | Singh Logistics |
| **Retailer** | `retailer@demo.inovix.com` | Gupta Fresh Mart |
| **Consumer** | `consumer@demo.inovix.com` | Individual |
| **Regulator** | `regulator@demo.inovix.com` | FSSAI Quality Board |
| **Admin** | `admin@demo.inovix.com` | INOVIX Platform Ops |

*Quick login buttons for each role are available directly on the login page.*

---

## 🌐 API Reference

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Authenticate with email/password
- `POST /api/auth/demo-login` – 1-click role authentication
- `GET /api/auth/me` – Current authenticated user details

### Batches & Traceability
- `GET /api/batches` – List batches (role-scoped)
- `POST /api/batches` – Create batch with auto-generated ID (`INV-2026-XXX`)
- `GET /api/batches/:id` – Detailed batch information with journey & sensor history
- `POST /api/batches/:id/advance` – Advance batch stage with RBAC enforcement
- `GET /api/batches/:id/timeline` – Supply chain event logs

### IoT & Telemetry
- `GET /api/iot/nodes` – List IoT sensor nodes with latest readings
- `GET /api/iot/nodes/:id` – Node status & historical readings
- `POST /api/iot/readings` – Ingest sensor readings (triggers alert engine)
- `POST /api/iot/simulate` – Start/stop automated IoT simulation

### Blockchain
- `GET /api/blockchain/events` – List immutable event ledger
- `GET /api/blockchain/stats` – Blockchain anchoring stats

### Alerts
- `GET /api/alerts` – List threshold breach alerts
- `PUT /api/alerts/:id/acknowledge` – Acknowledge alert
- `PUT /api/alerts/:id/resolve` – Resolve alert

### QR & Public Verification
- `POST /api/qr/generate/:batchId` – Generate QR token & DataURL
- `GET /api/verify/:token` – **Public endpoint** (no auth required) returning sanitized journey and blockchain verification status

---

## 🧪 Verification & Test Results

The platform has passed all 17 automated end-to-end test scenarios:
- ✅ User Registration & JWT Authentication
- ✅ Role-Based Access Control (403 on unauthorized actions)
- ✅ Protected Route Blocking (401 on missing tokens)
- ✅ Batch Creation (`INV-2026-XXX`) with database verification
- ✅ Supply Chain Stage Progression (`FARM` $\to$ `RETAIL`)
- ✅ IoT Telemetry Ingestion & Live Socket.IO Broadcast
- ✅ Anomaly Detection & Alert Engine Triggering
- ✅ Blockchain Event Anchoring with Cryptographic Hashes
- ✅ Public Consumer QR Verification with Sanitized Data
