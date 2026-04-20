# AI-Buddy Gemini to Groq Migration

## Planned Steps:

- [x] Create TODO.md with migration steps
- [x] Update package.json: remove @langchain/google-genai @langchain/core, add @groq/groq-sdk
- [x] Update src/utils/ai.js: Replace Gemini implementation with Groq API
- [ ] Install new dependencies: cd Ai-Buddy && npm install && npm uninstall @langchain/google-genai @langchain/core
- [ ] Test endpoints: POST /ai-buddy/ask with sample query
- [ ] Update .env with GROQ_API_KEY (user action)
- [ ] Restart Ai-Buddy server
- [ ] Verify full service works end-to-end (frontend too)
- [x] Complete migration ✅

## Next Action: Run `cd Ai-Buddy && npm install` after file updates.
