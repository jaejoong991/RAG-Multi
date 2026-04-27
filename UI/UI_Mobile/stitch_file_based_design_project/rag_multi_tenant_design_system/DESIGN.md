---
name: RAG Multi-Tenant Design System
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3c3742'
  surface-container-lowest: '#100d16'
  surface-container-low: '#1d1a24'
  surface-container: '#221e28'
  surface-container-high: '#2c2833'
  surface-container-highest: '#37333e'
  on-surface: '#e8dfee'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e8dfee'
  inverse-on-surface: '#332f39'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ffb784'
  on-tertiary: '#4f2500'
  tertiary-container: '#a15100'
  on-tertiary-container: '#ffe0cd'
  error: '#EF4444'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#15121b'
  on-background: '#e8dfee'
  surface-variant: '#37333e'
  background-deep: '#0A0F1E'
  surface-card: '#111827'
  accent-gradient: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)'
  success: '#10B981'
  warning: '#F59E0B'
  border-glass: rgba(255, 255, 255, 0.06)
  sidebar-active: rgba(124, 58, 237, 0.1)
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  code:
    fontFamily: monospace
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  sidebar-width: 260px
  header-height: 64px
  container-padding: 24px
  gutter: 16px
---

# RAG Multi-Tenant — UI/UX Design Specification

> **Tool:** https://stitch.withgoogle.com
> **Paste the Design System Context as prefix to EVERY prompt.**

---

## Design System Context

```
Design system: Dark mode SaaS dashboard. Color palette: deep navy background (#0A0F1E), card surfaces (#111827), accent gradient purple-to-blue (#7C3AED → #3B82F6), success green (#10B981), warning amber (#F59E0B), error red (#EF4444). Typography: Inter font family. Border radius: 12px for cards, 8px for inputs. Subtle glassmorphism on cards with 1px border rgba(255,255,255,0.06). Spacing: 8px grid system.
```

---

## Screen 1: Shared Layout (Sidebar + Header)

```
Design a SaaS admin dashboard layout with a collapsible left sidebar and top header bar.

SIDEBAR (width: 260px, dark navy #0A0F1E):
- Top: Logo "RAG Platform" with a purple hexagon icon
- Navigation sections with small uppercase gray labels:
  Section "MAIN":
  - Dashboard (grid icon)
  - Documents (file-text icon)
  - Conversations (message-circle icon)  
  - Playground (terminal icon)
  Section "CONFIGURE":
  - Bot Settings (sliders icon)
  - Widget (palette icon)
  - Embed Code (code icon)
  Section "INSIGHTS":
  - Analytics (bar-chart icon)
  Section "ACCOUNT":
  - Team (users icon)
  - API Keys (key icon)
  - Billing (credit-card icon)
  - Settings (gear icon)
- Active item has a purple-blue gradient left border and subtle purple background tint
- Bottom: User avatar circle, name "Jeff Gunawan", email truncated, and a logout icon

HEADER (height: 64px, surface #111827):
- Left: Breadcrumb trail "Dashboard > Documents"
- Center: Global search bar with magnifying glass icon, placeholder "Search documents, conversations..."
- Right: Notification bell icon with red dot badge, tenant name "Acme Corp" with a dropdown chevron

Content area: Show a placeholder grid with text "Page Content" in center. Background: #0A0F1E.
```

---

## Screen 2: Login Page

```
Design a premium SaaS login page. Split layout.

LEFT HALF (60%): Dark gradient background (#0A0F1E to #1E1B4B). Center content:
- Logo "RAG Platform" with purple hexagon icon, large
- Tagline: "AI-Powered Knowledge Base for Your Business"
- 3 small feature pills below: "Multi-Tenant" "Multi-LLM" "Enterprise Ready"
- Subtle animated mesh gradient in background (decorative circles with purple/blue glow)

RIGHT HALF (40%): Darker card surface (#111827) full height. Center a form card:
- Title: "Welcome back"
- Subtitle: "Sign in to your account"
- Email input field with mail icon
- Password input field with lock icon and show/hide toggle
- "Remember me" checkbox and "Forgot password?" link on same row
- Primary button: "Sign In" with purple-blue gradient, full width
- Divider "or"
- "Sign in with Google" button (outline style)
- Bottom text: "Don't have an account? Get Started"
```

---

## Screen 3: Registration Page

```
Design a SaaS registration page. Same split layout as login.

LEFT HALF: Same branding as login page.

RIGHT HALF: Form card with:
- Title: "Create your workspace"
- Subtitle: "Start your 14-day free trial"
- Fields (stacked):
  - "Workspace Name" (input, placeholder: "Acme Corp")
  - "Your Name" (input)
  - "Work Email" (input)
  - "Password" (input with strength meter bar below — 4 segments)
- Checkbox: "I agree to the Terms of Service and Privacy Policy"
- Primary button: "Create Account" purple-blue gradient, full width
- Bottom text: "Already have an account? Sign In"
- Small text: "No credit card required"
```

---

## Screen 4: Tenant Dashboard (Home)

```
Design a SaaS dashboard home page inside the sidebar layout.

TOP ROW — 4 stat cards in a grid:
1. "Total Queries" — value "12,847" — green up arrow "+12.5% vs last month" — chart sparkline
2. "Documents" — value "34" — "5 processing" in amber badge
3. "Conversations" — value "892" — green up arrow "+8.3%"
4. "Token Usage" — circular progress ring 67% filled purple — "67,240 / 100,000 tokens"

MIDDLE ROW — 2 cards side by side:
LEFT CARD (60%): "Query Volume" — Area chart with purple gradient fill, showing last 30 days. X-axis: dates. Y-axis: query count. Smooth curve.
RIGHT CARD (40%): "Top Questions" — List of 5 items. Each row: rank number, question text truncated, query count badge. Example: "1. What is your return policy? — 234"

BOTTOM ROW — 2 cards:
LEFT CARD: "Recent Conversations" — Table with columns: Session ID (truncated), First Message, Messages Count, Time (relative "2h ago"). 5 rows. Each row clickable.
RIGHT CARD: "System Status" — 4 status rows with green dots: "API Server — Operational", "RAG Engine — Operational", "Vector DB — Operational", "LLM Provider — Operational"
```

---

## Screen 5: Documents Page

```
Design a document management page for a RAG knowledge base system.

HEADER ROW:
- Page title: "Knowledge Base Documents"
- Subtitle: "34 documents · 12,450 chunks indexed"
- Right side: "Upload Documents" primary button (purple gradient) with upload-cloud icon

UPLOAD ZONE (shown when button clicked or always visible as a dashed border area):
- Dashed border rectangle, subtle purple tint on hover
- Center icon: cloud-upload large
- Text: "Drag & drop files here, or click to browse"
- Subtext: "Supports PDF, TXT, DOCX, CSV — Max 50MB per file"

TABLE below:
Columns: Checkbox | File Name (with file-type icon) | Type | Size | Chunks | Status | Uploaded By | Date | Actions
Sample rows:
1. 📄 "product-catalog-2024.pdf" | PDF | 4.2MB | 142 | Green badge "Indexed" | Jeff G. | Apr 23, 2024 | ⋯ menu
2. 📄 "faq-document.txt" | TXT | 24KB | 8 | Green badge "Indexed" | Sarah M. | Apr 22, 2024 | ⋯ menu
3. 📄 "pricing-guide.pdf" | PDF | 1.8MB | — | Amber badge "Processing" with spinner | Jeff G. | Apr 24, 2024 | ⋯ menu
4. 📄 "returns-policy.docx" | DOCX | 156KB | — | Red badge "Failed" | Jeff G. | Apr 24, 2024 | ⋯ menu

FILTER BAR above table: Search input "Filter documents..." | Status dropdown (All, Indexed, Processing, Failed) | Sort dropdown

PAGINATION at bottom: "Showing 1-10 of 34" | Page buttons
```

---

## Screen 6: Chat Playground Page

```
Design a chat playground page for testing a RAG chatbot with a knowledge base.

SPLIT LAYOUT:

LEFT PANEL (65%) — Chat Interface:
- Header: "Chat Playground" with a green dot "Connected" badge and "Clear Chat" ghost button
- Chat area (scrollable, dark background):
  - Bot message bubble (left, surface card): "Hello! I'm your AI assistant. Ask me anything about your knowledge base."
  - User message bubble (right, purple-blue gradient): "What is the return policy?"
  - Bot message bubble (left): Response text with a "Sources" collapsible section below showing 2 source cards: document name, page number, relevance score percentage, snippet preview
  - Typing indicator (3 animated dots)
- Input bar at bottom: text input "Ask a question..." with send button (purple), attach file button, and a microphone icon

RIGHT PANEL (35%) — Configuration:
- Card "Model Settings":
  - Provider dropdown: "OpenAI" (showing OpenAI, Gemini, Anthropic, Ollama options)
  - Model dropdown: "gpt-4o-mini"
  - Temperature slider: 0.0 to 1.0, current value 0.3
  - Max tokens input: 1024
- Card "System Prompt":
  - Textarea with current prompt text, editable
  - "Reset to Default" small link
- Card "Retrieval Settings":
  - "Top K Results" slider: 1-10, current 4
  - "Similarity Threshold" slider: 0.0-1.0, current 0.7
- Card "Response Info" (updates per message):
  - Tokens used: "342 in / 256 out"
  - Latency: "1.2s"
  - Cost: "$0.0012"
  - Sources found: "4"
```

---

## Screen 7: Conversations Page

```
Design a conversations history page showing end-user chat sessions.

LEFT PANEL (35%) — Conversation List:
- Search bar: "Search conversations..."
- Filter chips: "All" (active), "Today", "This Week", "This Month"
- Scrollable list of conversation cards. Each card:
  - Session ID (monospace, truncated): "sess_a8f2...3d1e"
  - First message preview: "What is your return policy for..."
  - Message count badge: "12 messages"
  - Timestamp: "2 hours ago"
  - Active card has purple left border and subtle highlight

RIGHT PANEL (65%) — Conversation Detail:
- Header: Session ID, date "Apr 24, 2024 2:34 PM", duration "8 min", metadata button
- Full chat thread displayed:
  - User messages (right, outlined card)
  - Bot messages (left, surface card) with source references as small tags below
- Each bot message has small metadata: latency "1.1s", tokens "234", cost "$0.001"
- Bottom bar: "Export Conversation" button, "Delete" red button
```

---

## Screen 8: Analytics Page

```
Design an analytics dashboard for a tenant's RAG chatbot usage.

TOP ROW — 4 metric cards:
1. "Total Queries" — "12,847" — "+12.5% vs last month" green arrow — sparkline
2. "Avg Response Time" — "1.3s" — "-8% vs last month" green arrow
3. "Resolution Rate" — "89%" — circular progress ring
4. "Total Cost" — "$47.23" — "+15% vs last month" amber arrow

SECOND ROW — Full-width line chart card:
- Title: "Query Volume Over Time"
- Toggle tabs: "7 Days" "30 Days" "90 Days" (30 Days active)
- Smooth line chart, purple gradient fill, with data points on hover

THIRD ROW — 2 cards:
LEFT (50%): "Top Questions" — Horizontal bar chart. Top 10 questions with counts. Purple bars.
RIGHT (50%): "Unanswered Questions" — Table showing questions where bot replied "I don't know". Columns: Question | Frequency | Last Asked. Call-to-action: "These indicate gaps in your knowledge base"

FOURTH ROW — 2 cards:
LEFT: "Response Quality Distribution" — Donut chart with segments: Excellent (green), Good (blue), Fair (amber), Poor (red). Legend below.
RIGHT: "Token Usage Breakdown" — Stacked bar chart by day. Two colors: Input tokens (purple) and Output tokens (blue).
```

---

## Screen 9: Bot Settings Page

```
Design a bot configuration settings page.

PAGE TITLE: "Bot Configuration"

CARD 1 — "AI Model":
- Provider select: Radio cards layout (not dropdown). 4 options in a 2x2 grid:
  - OpenAI card (logo, "GPT-4o-mini, GPT-4o", green "Active" badge)
  - Google Gemini card (logo, "Gemini Flash, Gemini Pro")
  - Anthropic card (logo, "Claude Sonnet, Claude Haiku")
  - Ollama card (logo, "Self-hosted models", "Free" badge)
- Model select dropdown below active provider
- Temperature slider: 0 to 1 with labels "Precise" on left, "Creative" on right
- Max output tokens: number input

CARD 2 — "System Prompt":
- Large textarea (8 rows) with monospace font
- Character count "234 / 2000"
- "Reset to Default" and "Test Prompt" buttons below
- Tip callout: "This prompt defines your bot's personality and instructions"

CARD 3 — "Retrieval Settings":
- Top K Results: slider 1-10 with value label
- Similarity Threshold: slider with value 0.0-1.0
- Chunk Size: dropdown (500, 1000, 1500, 2000)
- Chunk Overlap: dropdown (100, 200, 300)

CARD 4 — "Response Behavior":
- Toggle switches with labels:
  - "Include source citations in responses" (ON)
  - "Fallback to general knowledge when no match found" (OFF)
  - "Enable conversation memory (multi-turn)" (ON)
  - "Stream responses in real-time" (ON)

BOTTOM: "Save Changes" primary button, "Discard" ghost button
```

---

## Screen 10: Widget Customization Page

```
Design a chat widget customization page with live preview.

SPLIT LAYOUT:

LEFT (55%) — Settings:
CARD "Appearance":
- "Widget Title" input: "AI Assistant"
- "Welcome Message" input: "Hi! How can I help you today?"
- "Primary Color" color picker: showing purple #7C3AED
- "Position" radio: "Bottom Right" | "Bottom Left"
- "Button Size" radio: "Small" | "Medium" | "Large"
- "Avatar" image uploader with current avatar preview circle
- "Theme" toggle: "Light" | "Dark" | "Auto"

CARD "Behavior":
- "Initial State" radio: "Closed" | "Open"  
- "Show after delay" input: "3 seconds"
- "Suggested Questions" — 3 input fields for pre-written suggestions
  - "What is your return policy?"
  - "How do I track my order?"
  - "+ Add question" button
- "Powered by badge" toggle (ON for free plan, forced)

RIGHT (45%) — Live Preview:
- A mock website background (gray placeholder)
- In the bottom-right corner, a fully rendered chat widget:
  - Floating action button (purple circle with chat icon)
  - Expanded chat window above it showing:
    - Header bar with avatar, title "AI Assistant", minimize button
    - Welcome message bubble
    - Suggested question chips below
    - Input field "Type your message..."
  - Widget updates in real-time as settings change on the left
```

---

## Screen 11: Embed Code Page

```
Design an embed code page where tenants get their installation snippet.

PAGE TITLE: "Install Chat Widget"
SUBTITLE: "Add the AI assistant to your website in under 2 minutes"

STEP INDICATOR (horizontal stepper, 3 steps):
Step 1: "Copy Code" (active, purple)
Step 2: "Paste in Website"
Step 3: "Verify Installation"

CARD — "Your Embed Code":
- Dark code block with syntax highlighting:
  <script
    src="https://widget.ragplatform.com/v1/loader.js"
    data-api-key="tk_live_xxxxxxxxxxxxxxxxxx"
    data-theme="dark"
    data-position="bottom-right">
  </script>
- "Copy to Clipboard" button with check animation on click
- "Regenerate API Key" red outlined button with warning tooltip

CARD — "Installation Guides" (tabs):
- Tab "HTML" — Simple paste instructions with code block
- Tab "React/Next.js" — useEffect code example
- Tab "WordPress" — Plugin instructions
- Tab "Shopify" — Theme editor instructions

CARD — "Test Installation":
- Input field: "Enter your website URL"
- "Verify" button
- Status: Green check "Widget detected and working!" or Red X "Widget not found"

CARD — "API Key":
- Current key displayed (masked): "tk_live_xxxx...xxxx"
- "Show" toggle, "Copy" button, "Regenerate" button
- Created date, last used date
```

---

## Screen 12: Team Management Page

```
Design a team management page for inviting and managing team members.

PAGE TITLE: "Team Members"
SUBTITLE: "3 members · 2 roles"
RIGHT: "Invite Member" primary button with user-plus icon

CARD — "Pending Invitations" (collapsible, shown if invitations exist):
- Row: email "sarah@acme.com" | Role "Member" | Sent "2 days ago" | "Resend" link | "Revoke" red link

TABLE — "Active Members":
Columns: Avatar | Name | Email | Role (badge) | Status | Joined | Actions
Rows:
1. Avatar | "Jeff Gunawan" | jeff@acme.com | Admin (purple badge) | Active (green dot) | Jan 15 | ⋯ (cannot remove self)
2. Avatar | "Sarah Miller" | sarah@acme.com | Member (gray badge) | Active | Feb 3 | ⋯ (Change Role, Remove)
3. Avatar | "David Chen" | david@acme.com | Member (gray badge) | Active | Mar 10 | ⋯

INVITE MODAL (triggered by button):
- Title: "Invite Team Member"
- Email input
- Role select: "Admin" | "Member" with role descriptions below
  - Admin: "Full access to all features including billing and settings"
  - Member: "Can manage documents and view conversations"
- "Send Invitation" button, "Cancel" button
```

---

## Screen 13: API Keys Page

```
Design an API keys management page.

PAGE TITLE: "API Keys"
SUBTITLE: "Manage keys for widget embed and API access"
RIGHT: "Create New Key" primary button with key icon

CARD — "Active Keys":
TABLE:
Columns: Name | Key (masked) | Type | Created | Last Used | Status | Actions
Rows:
1. "Production Widget" | "tk_live_xxxx...3d1e" | Widget (purple badge) | Jan 15 | 2 min ago | Active (green) | Copy | Revoke
2. "Staging Widget" | "tk_test_xxxx...8f2a" | Widget (blue badge) | Feb 3 | 3 days ago | Active | Copy | Revoke
3. "API Integration" | "tk_api_xxxx...9c4b" | API (amber badge) | Mar 10 | Never | Active | Copy | Revoke

CARD — "Revoked Keys" (collapsible):
- Grayed out rows of previously revoked keys with revocation date

CREATE MODAL:
- "Key Name" input
- "Key Type" radio: "Widget Key" | "API Key"
- "Environment" radio: "Production" | "Staging"
- "Create Key" button
- After creation: Show full key ONCE with warning "Copy this key now. You won't be able to see it again."
```

---

## Screen 14: Billing Page

```
Design a billing and subscription page for a SaaS product.

TOP CARD — "Current Plan":
- Plan name: "Pro Plan" with purple badge
- Price: "$49/month" 
- Renewal date: "May 24, 2024"
- Usage bar: "3,240 / 5,000 queries used" (64% filled, purple progress bar)
- Storage bar: "124MB / 500MB" (25% filled)
- Documents bar: "34 / 50 documents"
- Two buttons: "Upgrade Plan" (primary), "Manage Subscription" (outline)

CARD — "Plan Comparison" (3 columns):
FREE: $0/mo — 100 queries, 5 docs, 10MB, GPT-4o-mini only — "Downgrade" gray button
PRO (current): $49/mo — highlighted with purple border — 5,000 queries, 50 docs, 500MB, Multiple models — "Current Plan" disabled button
BUSINESS: $149/mo — 25,000 queries, 200 docs, 5GB, All models + priority — "Upgrade" primary button

CARD — "Usage This Month":
- Bar chart showing daily query usage over current billing period
- Cost breakdown table: "Queries: $38.40" | "Embedding: $5.20" | "Overage: $0.00" | "Total: $43.60"

CARD — "Invoice History":
- Table: Date | Invoice # | Amount | Status (Paid green badge) | PDF download icon
- 5 sample rows
```

---

## Screen 15: Super Admin — Tenants List

```
Design a super admin tenant management page showing all tenants on the platform.

HEADER: "Tenant Management" — Subtitle: "10 active tenants"
RIGHT: "Create Tenant" primary button, "Export" outline button

STAT ROW — 4 small cards:
1. "Total Tenants" — "12" (10 active, 2 suspended)
2. "Total Revenue" — "$1,247/mo"
3. "Platform Queries" — "45,230 this month"
4. "Total Documents" — "342 across all tenants"

TABLE:
Columns: Tenant Name | Plan | Status | Queries (this month) | Documents | Storage Used | MRR | Created | Actions
Sample rows:
1. "Acme Corp" with small logo | Pro (purple badge) | Active (green) | 3,240 | 34 | 124MB | $49 | Jan 15 | ⋯
2. "TechStart Inc" | Business (blue badge) | Active | 12,400 | 89 | 2.1GB | $149 | Feb 3 | ⋯
3. "LocalShop" | Free (gray badge) | Active | 82 | 3 | 4MB | $0 | Mar 20 | ⋯
4. "OldCorp" | Pro | Suspended (red badge) | 0 | 12 | 56MB | $0 | Dec 1 | ⋯

Row click opens a slide-over panel with tenant details, usage charts, and action buttons (Suspend, Delete, Impersonate).

FILTER BAR: Search | Plan dropdown | Status dropdown | Sort by dropdown
```

---

## Screen 16: Super Admin — Platform Analytics

```
Design a super admin platform-wide analytics dashboard.

TOP ROW — 5 metric cards:
1. "Active Tenants" — "10" — "+2 this month"
2. "Total Queries" — "45,230" — "+22% vs last month"
3. "Platform Uptime" — "99.97%"
4. "MRR" — "$1,247" — "+$198 vs last month" green arrow
5. "Churn Rate" — "0%" — green

CHART ROW 1:
LEFT (60%): "Revenue Growth" — Line chart over 6 months, purple line, showing MRR trend
RIGHT (40%): "Tenant Distribution by Plan" — Donut chart: Free 4, Pro 5, Business 3

CHART ROW 2:
LEFT (50%): "Query Volume by Tenant" — Stacked area chart, each tenant a different color
RIGHT (50%): "New Tenants Over Time" — Bar chart, monthly signups

TABLE — "Tenant Health Overview":
Columns: Tenant | Plan | Health Score | Queries (7d trend sparkline) | Docs | Last Active | Risk
Risk column: Green "Healthy", Amber "Low Usage", Red "At Risk"
```

---

## Screen 17: Super Admin — Cost Monitor

```
Design a super admin LLM cost monitoring dashboard.

TOP ROW — 4 metric cards:
1. "Total LLM Cost (This Month)" — "$347.82" — "+18% vs last month" amber arrow
2. "Total Tokens" — "4.2M" — input: 2.8M, output: 1.4M
3. "Avg Cost Per Query" — "$0.0023"
4. "Revenue / Cost Ratio" — "3.6x" green — "$1,247 revenue vs $347 cost"

CHART 1 — Full width:
"Cost Over Time" — Stacked area chart, 30 days. Stacks by provider (OpenAI blue, Gemini green, Anthropic orange). Total line overlaid.

CHART 2 — Two cards side by side:
LEFT: "Cost By Tenant" — Horizontal bar chart. Top 10 tenants by cost. Purple bars.
RIGHT: "Cost By Provider" — Donut chart. OpenAI 72%, Gemini 18%, Anthropic 8%, Ollama 2% (free).

TABLE — "Detailed Cost Log":
Columns: Tenant | Provider | Model | Queries | Tokens In | Tokens Out | Cost | Date
Filterable by tenant, provider, date range.
Pagination at bottom.
```

---

## Usage Instructions

1. Open https://stitch.withgoogle.com
2. **Always paste the Design System Context first** as prefix
3. Paste one screen prompt at a time
4. Iterate with follow-up prompts to refine
5. Export designs for development reference
