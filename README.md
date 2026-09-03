# ClearWrite

**Write clearly. Sound like you.**

ClearWrite is an AI-first communication assistant focused on grammar, clarity, tone and workplace writing across emails and conversations.

## V2

V2 expands the V1 prototype into a more complete email and conversation workflow:

- Email and Conversation modes
- Optional email subject field
- Grammar correction
- One-click Improve rewrite
- Shorten action
- Professional, Formal, Friendly and Assertive tones
- Copy improved text
- Copy email with subject
- Character and word counts
- Example content for both modes
- Responsive, accessible interface
- No provider API keys in the frontend

The current build remains a browser-only demo layer. It is deliberately structured so a secure AI backend can be connected later without moving provider credentials into client-side code.

## Roadmap

- **V1:** Core grammar correction UI
- **V2:** Email + conversation modes, tone controls and polished workflows
- **V3:** Context-aware replies and side-by-side changes
- **V4:** Personal writing profile and workplace style controls
- **V5:** Browser extension for Gmail, Outlook, Teams and Slack workflows

## Local development

No build step is required. Open `index.html` in a browser or serve the repository with any static web server.

## Deployment

The project is designed for GitHub Pages as a static frontend. Future AI requests should go through a secure server/API boundary. **Never place an AI provider API key in `app.js`, HTML, CSS or other client-side assets.**

## License

To be defined.
