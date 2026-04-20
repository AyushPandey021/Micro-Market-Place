# AI-Buddy Service Fix - TODO

## Current Status: 🚀 Starting Implementation

### Completed: ✅

- [x] Diagnosed root cause: Invalid `@groq/groq-sdk` dependency + import crash

### Completed: ✅

- [x] Step 1: Update package.json (remove invalid dep)

### In Progress: ⏳

- [ ] Step 1: Update package.json (remove invalid dep)
- [x] Step 2: Rewrite ai.js with keyword parsing fallback (no AI)
- [ ] Step 3: Clean install dependencies
- [ ] Step 4: Verify server startup
- [ ] Step 5: Test health endpoints

### Pending: 🔄

- [ ] Add real AI integration (OpenAI/Groq later)
- [ ] Integration tests with other services

**Next: package.json edit → npm install → server start**
