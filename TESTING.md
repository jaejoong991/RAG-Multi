# QA Testing List

## 1. Authentication & Tenant Isolation
- [ ] **TC-01**: User can register a new workspace. (Ready)
- [ ] **TC-02**: User can log in with valid credentials. (Ready)
- [ ] **TC-03**: User cannot access documents from another tenant (Isolation Test). (Ready)
- [ ] **TC-04**: JWT tokens expire correctly and require refresh.

## 2. Document Management
- [ ] **TC-05**: Upload PDF, TXT, and DOCX files to MinIO. (Ready)
- [ ] **TC-06**: Verify file size limit enforcement (50MB). (Ready)
- [ ] **TC-07**: Document indexing pipeline (parse → chunk → embed → store). (Ready)
- [ ] **TC-08**: Document deletion removes vectors and chunks.

## 3. RAG Engine & Chat
- [ ] **TC-09**: Chat Playground returns response based on uploaded documents. (Ready)
- [ ] **TC-10**: Sources are correctly cited with relevance scores. (Ready)
- [ ] **TC-11**: Multi-LLM provider switching (OpenAI, Gemini, etc.). (Ready)
- [ ] **TC-12**: Temperature and Max Tokens settings affect output correctly. (Ready)

## 4. UI/UX (Mobile & Desktop)
- [ ] **TC-13**: Sidebar/Nav is responsive across screen sizes. (Ready)
- [ ] **TC-14**: Dark mode consistency across all pages. (Ready)
- [ ] **TC-15**: Dashboard stats update in real-time or on refresh. (Ready)

## 5. Super Admin
- [ ] **TC-16**: Super Admin can see list of all tenants. (Ready)
- [ ] **TC-17**: Super Admin can view platform-wide cost analytics. (Ready)
- [ ] **TC-18**: Suspend/Reactivate tenant account functionality.

## 6. Billing & Payments
- [ ] **TC-19**: Checkout session redirects to Stripe. (Ready)
- [ ] **TC-20**: Webhook updates tenant plan on successful payment. (Ready)
- [ ] **TC-21**: Quota enforcement blocks queries if limit exceeded. (Ready)
