# Security baseline

- No stealth recording or covert data collection.
- Camera, microphone, and location features are excluded from this starter.
- Never commit API keys, Firebase service-account files, admin tokens, signing keys, or passwords.
- Use least-privilege Firebase rules and authenticated server-side authorization.
- Treat market signals as unverified decision support until tested against reliable data.
- The Worker admin route requires a secret token; do not expose that token in frontend code.
