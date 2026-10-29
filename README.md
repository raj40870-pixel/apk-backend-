# ⚙️ APKify Backend — Native Android Cloud Compilation Engine

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Android SDK](https://img.shields.io/badge/Android_SDK-API_34-3DDC84?logo=android&logoColor=white)](https://developer.android.com/studio)

The backend compilation engine and RESTful API service for **APKify Builder**. This service powers automated, headless compilation of Website URLs, raw HTML/JS code, and multi-file ZIP web packages into signed, production-ready Android APK binaries.

---

## 🔗 Connected Services & Repositories

* **🌐 Live Web Application:** [apkify-builder.vercel.app](https://apkify-builder.vercel.app)
* **💻 Frontend Client Repository:** [apkify-builder](https://github.com/raj40870-pixel/apkify-builder)
* **⚙️ Backend Compiler Repository:** [apk-backend-](https://github.com/raj40870-pixel/apk-backend-)

---

## ⚡ Core Engine Architecture

```
Client Build Request (URL / ZIP / HTML)
         │
         ▼
[Express Server: Auth & 14-Day Quota Verification]
         │
         ▼
[Adm-Zip Extraction & Pre-Validation]
         │
         ▼
[Native Android Scaffolding Engine]
  ├── Injects App Name, Package ID, Custom App Icon
  └── Configures AndroidManifest.xml & Gradle Build Files
         │
         ▼
[OpenJDK 17 + Android SDK 34 Command-Line Tools]
  └── Headless Gradle Build: ./gradlew assembleRelease
         │
         ▼
[Chunked Streaming Response: 0% ──> 100%]
         │
         ▼
[Binary Saved to /apks with 7-Day Safety Vault Lifecycle]
```

---

## ✨ Features & Capabilities

### 1. 🏗️ Headless Android Compilation Pipeline
* Built on **Node.js 20** containerized with **OpenJDK 17** and **Android SDK Command-line Tools** (`platform-tools`, `platforms;android-34`, `build-tools;34.0.0`).
* Dynamically scaffolds a native Android project with high-performance WebView settings, hardware acceleration, pull-to-refresh, and local asset caching.
* Executes `./gradlew assembleRelease` headlessly and signs the output `.apk` binary.

### 2. 📡 Real-Time Progress Streaming
* Uses HTTP chunked transfer encoding (`Transfer-Encoding: chunked`) to stream real-time progress percentages (0% -> 100%) and stages (`Reading package`, `Injecting manifest`, `Compiling native APK`, `Finalizing binary`) directly to the client browser.

### 3. 🗄️ 7-Day Admin Safety Vault & Soft-Delete Engine
* **User-Side Soft Delete:** When users delete a build from their history, it is instantly hidden from their dashboard.
* **Encrypted Admin Retention:** The physical `.apk` file is preserved for 7 days in the Safety Vault, allowing administrators to inspect suspicious builds for policy compliance or restore accidentally deleted apps with a single click.
* **Auto-Purge Cron:** An automated background interval job runs hourly to unlink expired binaries from the filesystem and update database statuses to `Expired`, preventing server disk exhaustion.

### 4. 🎁 14-Day Credit Replenishment & Quota System
* Validates user plan tiers and credit balances before dispatching compiler tasks.
* Automatically refills Free Tier accounts back to 3 credits every 14 days from their last refill timestamp.

### 5. 🛡️ User Moderation & Security
* JWT bearer token authentication with BcryptJS password hashing.
* Admin moderation endpoints: 24-hour temporary timeout suspensions, permanent bans, unbans, and quota management.

---

## 🔌 API Reference

### 🔐 Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user account & dispatch verification |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & live credit count |
| `POST` | `/api/auth/forgot-password` | Send password reset OTP |
| `POST` | `/api/auth/reset-password` | Verify OTP and set new password |

### 🔨 Build & History Routes (`/api`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/build-apk` | Start streaming compilation for URL, ZIP, or HTML |
| `GET` | `/api/builds` | Fetch active build history for authenticated user |
| `DELETE` | `/api/builds` | Bulk soft-delete builds to 7-Day Admin Safety Vault |
| `DELETE` | `/api/builds/:id` | Soft-delete individual build to Safety Vault |
| `GET` | `/apks/:filename` | Public static download endpoint for compiled APKs |

### 👑 Admin Control Routes (`/api/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | High-level telemetry: users, builds, storage, health |
| `GET` | `/api/admin/users` | Retrieve registered users with plan & moderation status |
| `PUT` | `/api/admin/users/:id/suspend-24h` | Impose a 24-hour temporary building suspension |
| `PUT` | `/api/admin/users/:id/ban` | Permanently ban a malicious user |
| `PUT` | `/api/admin/users/:id/unban` | Reactivate a suspended or banned account |
| `PUT` | `/api/admin/users/:id/credits` | Manually adjust a user's credit quota |
| `GET` | `/api/admin/builds` | View complete build registry (including 7-day vault) |
| `POST` | `/api/admin/builds/:id/restore` | 1-click restore a deleted build to user dashboard |
| `DELETE` | `/api/admin/builds/:id` | Permanently wipe build record & physical APK file |
| `POST` | `/api/admin/builds/cleanup` | Smart purge broken/expired records |

---

## 🛠️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
PORT=10000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/apkify?retryWrites=true&w=majority

# Android & Java Paths (configured automatically in Docker)
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ANDROID_HOME=/opt/android-sdk
ANDROID_SDK_ROOT=/opt/android-sdk

# Optional Email Service for OTPs
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🐳 Docker & Cloud Deployment

### 1. Build Docker Image
```bash
docker build -t apkify-backend .
```

### 2. Run Locally in Container
```bash
docker run -p 10000:10000 --env-file .env.local apkify-backend
```

### 3. Deploy to Google Cloud Run
Deploying the Android compiler requires at least 2 vCPUs, 4GB RAM, and an extended request timeout for compilation:

```bash
gcloud run deploy apkify-backend \
  --source . \
  --region us-central1 \
  --memory 4Gi \
  --cpu 2 \
  --timeout 600 \
  --allow-unauthenticated
```

---

## 📄 License
This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
