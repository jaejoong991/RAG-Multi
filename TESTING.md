# QA Testing List

## 1. Authentication & Tenant Isolation
- [x] **TC-01**: User can register a new workspace. (Ready) ✓ unit tested
- [x] **TC-02**: User can log in with valid credentials. (Ready) ✓ unit tested
- [x] **TC-03**: User cannot access documents from another tenant (Isolation Test). (Ready) ✓ unit tested
- [x] **TC-04**: JWT tokens expire correctly and require refresh. ✓ unit tested

## 2. Document Management
- [ ] **TC-05**: Upload PDF, TXT, and DOCX files to MinIO. (Ready) ⚠️ requires Docker
- [ ] **TC-06**: Verify file size limit enforcement (50MB). (Ready) ⚠️ requires Docker
- [x] **TC-07**: Document indexing pipeline (parse → chunk → embed → store). (Ready) ✓ unit tested
- [x] **TC-08**: Document deletion removes vectors and chunks. ✓ unit tested

## 3. RAG Engine & Chat
- [x] **TC-09**: Chat Playground returns response based on uploaded documents. (Ready) ✓ unit tested
- [x] **TC-10**: Sources are correctly cited with relevance scores. (Ready) ✓ unit tested
- [x] **TC-11**: Multi-LLM provider switching (OpenAI, Gemini, etc.). (Ready) ✓ unit tested
- [x] **TC-12**: Temperature and Max Tokens settings affect output correctly. (Ready) ✓ unit tested

## 4. UI/UX (Mobile & Desktop)
- [ ] **TC-13**: Sidebar/Nav is responsive across screen sizes. (Ready) ⚠️ requires running frontend
- [ ] **TC-14**: Dark mode consistency across all pages. (Ready) ⚠️ requires running frontend
- [ ] **TC-15**: Dashboard stats update in real-time or on refresh. (Ready) ⚠️ requires running frontend

## 5. Super Admin
- [ ] **TC-16**: Super Admin can see list of all tenants. (Ready) ⚠️ requires running services
- [ ] **TC-17**: Super Admin can view platform-wide cost analytics. (Ready) ⚠️ requires running services
- [ ] **TC-18**: Suspend/Reactivate tenant account functionality. ⚠️ requires running services

## 6. Billing & Payments
- [x] **TC-19**: Checkout session redirects to Stripe. (Ready) ✓ unit tested
- [x] **TC-20**: Webhook updates tenant plan on successful payment. (Ready) ✓ unit tested
- [x] **TC-21**: Quota enforcement blocks queries if limit exceeded. (Ready) ✓ unit tested
