# ClearWrite

**Write clearly. Sound professional.**

ClearWrite is an AI-first writing assistant focused on grammar, clarity, and workplace communication across emails and conversations.

## V1

The first release is a polished browser-based prototype with:

- Email and Conversation modes
- Grammar correction
- Professional rewriting
- Concise rewriting
- Formal and friendly tones
- One-click copy
- Responsive UI
- No API keys in the frontend

The current V1 uses a lightweight browser-side correction layer so the interface can be deployed and tested without a backend. The production AI layer will be added behind a secure server/API boundary in a later version.

## Product roadmap

- **V1:** Grammar correction + core writing UI
- **V2:** AI-powered email and conversation rewriting
- **V3:** Context-aware replies and side-by-side changes
- **V4:** Personal writing profile and workplace style controls
- **V5:** Browser extension for Gmail, Outlook, Teams, and Slack workflows

## Local development

No build step is required for V1. Open `index.html` in a browser, or serve the repository with any static web server.

## Deployment

The project is designed to work with GitHub Pages as a static frontend. Any future AI API should remain server-side; do not place provider API keys in client-side JavaScript.

## License

To be defined.
