# APKify Builder - Backend API & Cloud Engine

Production backend and automated 24/7 GitHub Actions cloud build engine for **APKify Builder**.

## Architecture
- **API Server:** Express.js on Google AI Studio (`https://apkify-builder.ai.studio`)
- **Cloud Build Engine:** GitHub Actions (`.github/workflows/build-apk.yml`) with 16GB RAM and pre-installed Android 34 SDK
