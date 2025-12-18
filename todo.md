# KompanionAI (KAI) - Echo Model - Project TODO

## Architecture: Local-First PWA
- [x] IndexedDB storage layer for local memory (replaces MySQL)
- [x] Local-only operation (no server/backend needed)
- [x] PWA manifest for installability
- [x] Service worker for offline support
- [x] Data export/import for backup

## Core Infrastructure
- [x] IndexedDB schema for memory system (core, notebook, experience, conversation, contact, mental_health)
- [x] Token management system with 85% threshold and auto-purge
- [x] Local settings storage (API keys, model preferences) in IndexedDB

## UI/UX Design
- [x] Dark theme implementation with custom color palette
- [x] Logo integration (Silicon with Soul branding)
- [x] Gruppo/Montserrat font integration via Google Fonts
- [x] Mobile-responsive layout
- [x] Chat interface with message history
- [x] Code rendering in chat messages (markdown support)
- [x] Settings panel/page

## AI Integration
- [x] OpenRouter API integration
- [x] Support for 4 pre-defined AI models
- [x] Custom model input option
- [x] User API key management in settings
- [x] Memory context injection into prompts
- [x] Conversation persisten## Memory Management
- [x] Memory viewing and editing interface
- [x] Core memory section
- [x] Notebook section
- [x] Experience section
- [x] Conversation section
- [x] Contact section
- [x] Mental health/journey section
- [x] Token usage display

## Advanced AI Capabilities
- [x] DuckDuckGo web search integration
- [x] Memory search functionality
- [x] Image generation (via OpenRouter)
- [x] Tools page for accessing advanced features
- [ ] File upload functionality (local storage)
- [ ] File download functionality
- [ ] Email sending capability
- [ ] Email receiving capability (IMAP)
- [ ] Calendar integration (generic or Google OAuth)

## Voice & Audio
- [x] Text-to-speech (TTS) implementation
- [x] Microphone input (voice recording)
- [x] Mic mute/unmute toggle
- [x] Web Speech API integrationy Management
- [ ] Core memory (persistent identity)
- [ ] Notebook memory (long-term notes)
- [ ] Experience memory (shared history)
- [ ] Conversation memory (recent chat)
- [ ] Contact memory (people/relationships)
- [ ] Mental health memory (emotional journey tracking)
- [ ] Token counting and limit enforcement
- [ ] Auto-purge with mental health preservation

## Testing & Quality
- [ ] Vitest tests for all tRPC procedures
- [ ] Error handling for API failures
- [ ] Loading states for all async operations
- [ ] Empty states for chat and memory views

## Deployment & Delivery
- [ ] Final checkpoint creation
- [ ] Source code packaging for download
- [ ] Documentation for local deployment


## Bug Fixes
- [x] Add first-time user onboarding to guide to Settings
- [x] Improve API key error messaging with actionable link
- [x] Check API key before allowing chat submission

## Email Configuration
- [x] Add IMAP settings fields to Settings page
- [x] Update IndexedDB schema to store IMAP configuration
- [ ] Add validation for email settings

## Google Calendar OAuth Integration
- [x] Add OAuth credential fields to Settings (Client ID, Backend URL)
- [x] Update IndexedDB schema to store OAuth tokens
- [x] Implement OAuth authorization flow
- [x] Implement token exchange and refresh
- [x] Create Google Calendar API library
- [x] Add calendar event reading functionality
- [x] Add calendar event creation functionality
- [x] Add calendar UI in Tools page
- [x] Create serverless backend for secure token exchange
- [x] Add OAuth callback handler page
- [ ] Enable AI to create calendar events from chat

## Autonomous AI Assistant (Function Calling)
- [x] Design function calling architecture
- [x] Define all tool schemas for OpenRouter
- [x] Implement function call handler in chat
- [x] Add visual feedback for function execution

### Calendar Functions
- [x] create_calendar_event - Create events from natural language
- [x] view_upcoming_events - Show upcoming events

### Memory Management Functions
- [x] save_to_core_memory - Save core identity information
- [x] save_to_notebook - Save notes and ideas
- [x] save_to_experience - Save shared experiences
- [x] save_to_contacts - Save contact information
- [x] save_to_journey - Save emotional journey notes
- [x] search_memory - Search across all memories

### Search Functions
- [x] search_web - DuckDuckGo web search
- [x] search_memory - Search personal memories

### Image Functions
- [x] generate_image - Create images from descriptions

### File Functions
- [x] save_conversation - Save chat history to file
- [ ] create_text_file - Create downloadable text files

## Bug Fixes (Priority)
- [x] Fix mic timing - too fast (added continuous listening with interim results)
- [x] Add automatic TTS for AI responses
- [x] Fix image generation (use black-forest-labs/flux-1.1-pro via OpenRouter)

## OAuth Security Fix (CRITICAL)
- [x] Remove OAuth credentials from user Settings (security vulnerability)
- [x] Hardcode Google Client ID in frontend
- [x] Fix Render backend OAuth implementation
- [ ] Test complete OAuth flow with proper security
