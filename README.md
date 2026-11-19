# SKY AI FOREX PRO

A browser-first starter project for an Android forex-analysis app and a Cloudflare-hosted admin dashboard.

## Included
- `mobile/`: Expo / React Native Android app starter.
- `cloudflare/worker/`: Cloudflare Worker API starter.
- `cloudflare/dashboard/`: static admin dashboard.
- `.github/workflows/build-android.yml`: GitHub Actions workflow that builds an Android APK.
- `docs/`: setup and security notes.

## Important
This is a starter MVP, not a live trading terminal and not financial advice. The included market values are clearly labelled demo data. Connect a reputable market-data provider before using live prices or signals. No broker orders are placed.

This project does **not** contain malware, hidden surveillance, covert camera/microphone recording, persistence tricks, or Android-security bypasses. Any future camera, microphone, or location feature must be user-initiated, permission-based, and visibly indicated.

## Quick start from a phone browser
1. Open your GitHub repository.
2. Upload the contents of this ZIP (extract it first) into the repository root, preserving folders.
3. Commit to the `main` branch.
4. Open the repository's **Actions** tab and run **Build Android APK** (or push a commit).
5. When the workflow finishes, open its run and download the `sky-ai-forex-pro-apk` artifact.

The workflow builds a debug APK for easy testing. Do not distribute a debug build publicly. For a signed release build, configure Android signing credentials securely.

## Cloudflare Worker
See `cloudflare/worker/README.md`. Deploy with Wrangler or the Cloudflare dashboard. Set a strong `ADMIN_TOKEN` secret. Never put secrets in the mobile app or public dashboard JavaScript.

## Dashboard
The dashboard calls the Worker API. Set the Worker URL in `cloudflare/dashboard/config.js` and set the same admin token only in a secure server-side authentication flow before production. This starter intentionally does not hard-code an admin token in browser code.

## Firebase
Firebase is not required for the starter to run. If you add Firebase, use Firebase Authentication and restrictive Firestore rules. Never ship service-account credentials in the APK.
