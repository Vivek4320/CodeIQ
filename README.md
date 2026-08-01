<div align="center">

```
  ██████╗ ███████╗███╗   ██╗██╗██████╗ ██████╗ ███████╗
 ██╔════╝ ██╔════╝████╗  ██║██║██╔══██╗██╔══██╗██╔════╝
 ╚█████╗  █████╗  ██╔██╗ ██║██║██████╔╝██████╔╝█████╗
  ╚═══██╗ ██╔══╝  ██║╚██╗██║██║██╔═══╝ ██╔══██╗██╔══╝
 ██████╔╝ ███████╗██║ ╚████║██║██║     ██║  ██║███████╗
 ╚═════╝  ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝
```

### **Code Smarter. Run Faster.**

A full-stack, browser-based code editor with AI-powered code completion, live execution, 12+ language support, and a premium multi-theme UI — built for developers who ship fast.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vivekpankhaniya/CodeIQ)

</div>

---

## What is CodeIQ?

CodeIQ is a full-featured online code editor that lets you write, execute, and share code across 12+ programming languages — directly from your browser. No installations. No configurations. Just code.

```
┌���────────────────────────────────────────────────────┐
│  // Write code                                      │
│  console.log("Hello, World!");                      │
│                                                     │
│  // Run instantly                                   │
│  ▶ Output: Hello, World!                            │
│                                                     │
│  // Share with anyone                               │
│  🔗 https://codeiq.app/share/abc123                 │
└─────────────────────────────────────────────────────┘
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Language Support** | 12 languages: JavaScript, TypeScript, Python, C, C++, Java, Go, Rust, Ruby, Haskell, HTML, CSS |
| **AI Code Agent** | Context-aware code generation, debugging, and explanation powered by KeyKing SDK (Groq, OpenAI routing) |
| **AI Code Completion** | Real-time inline suggestions via KeyKing — adapts to your code context |
| **Instant Execution** | Run code in real-time with live output — JS/TS in VM sandbox, others via Piston API |
| **Smart Input Detection** | Auto-detects `input()` calls and shows inline input fields |
| **Live Preview** | HTML/CSS editor with instant browser preview |
| **7 Themes** | Midnight, Cyberpunk, Retro Gaming, Neon Nights, Deep Ocean, Hacker, Light Mode |
| **Auto-Save** | Projects saved automatically to Supabase database |
| **Shareable Links** | Generate shareable URLs for any code snippet |
| **Admin Panel** | Full dashboard with user management, language config, and analytics |
| **PWA Support** | Installable as a native app — works offline |
| **Bottom Navigation** | Mobile-first bottom nav bar (Instagram-style) |
| **Custom Cursor** | Animated `< >` code bracket cursor with AI orbit ring |
| **Page Transitions** | Smooth fade/slide transitions between routes |
| **Scroll Animations** | 6 animation types: fadeUp, fadeIn, scaleUp, slideLeft, slideRight, blur |
| **Responsive Design** | Fully responsive — desktop, tablet, and mobile |

---

## Tech Stack

```
├── Frontend          → Next.js 16, React 19, TypeScript 5
├── Styling           → Tailwind CSS 4, inline styles
├── Code Editor       → CodeMirror 6 with AI autocomplete
├── Terminal          → xterm.js + node-pty (WebSocket PTY)
├── AI Agent          → KeyKing SDK (Groq → OpenAI routing)
├── AI Completion     → KeyKing SDK (llama-3.3-70b-versatile → gpt-4o-mini)
├── Database          → Supabase (PostgreSQL)
├── Auth              → Email/Password + Google OAuth
├── Code Execution    → Piston API / Local compilers / VM sandbox
├── Icons             → Lucide React
├── PWA               → Service Worker + Web App Manifest
├── Deployment        → Vercel / Railway / Docker
└── Testing           → Custom test suite (test_all.mjs)
```

---

## Supported Languages

| Language | Local Compiler | Piston API | Interactive Input | Execution Mode |
|----------|:--------------:|:----------:|:-----------------:|:--------------:|
| JavaScript | Node.js VM | ✅ | — | Live (VM sandbox) |
| TypeScript | tsx | ✅ | — | Live (VM sandbox) |
| Python | python | ✅ | ✅ | Piston API |
| C | gcc | ✅ | — | Piston API |
| C++ | g++ | ✅ | — | Piston API |
| Java | javac | ✅ | — | Piston API (login required) |
| Go | go | ✅ | ✅ | Piston API |
| Rust | rustc | ✅ | — | Piston API |
| Ruby | ruby | ✅ | ✅ | Piston API |
| Haskell | stack | ✅ | — | Piston API |
| HTML | — | — | — | Live preview |
| CSS | — | — | — | Live preview |

---

## AI Agent — CodeIQ

The built-in AI agent can:

- **Write code** from natural language descriptions
- **Fix bugs** — analyzes your code, finds issues, and fixes them
- **Explain code** — step-by-step breakdowns in plain language
- **Run & verify** — executes code to confirm it actually works

```
┌──────────────────────────────────────┐
│  🤖 CodeIQ Agent              python │
├──────────────────────────────────────┤
│  💬 User: Fix the bug in this code   │
│                                      │
│  ✓ Run code                   done   │
│                                      │
│  Found the issue — `nums` was being  │
│  shadowed by the loop variable.     │
│                                      │
│  def find_max(nums):                 │
│      maximum = nums[0]              │
│      for num in nums[1:]:           │
│          if num > maximum:           │
│              maximum = num           │
│      return maximum                  │
│                                      │
│  ✓ Output: 9                         │
└──────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

```bash
node -v    # 18+
npm -v     # 9+
```

### Installation

```bash
# Clone the repo
git clone https://github.com/vivekpankhaniya/CodeIQ.git
cd CodeIQ

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...

# KeyKing AI (Zero-Trust LLM routing)
KK_VAULT=KK_VAULT_...
KK_VAULT_PASS=...

# Piston API (code execution)
PISTON_API_URL=https://emkc.org/api/v2
```

---

## Deployment

### Vercel (Recommended — Free)

```bash
# Push to GitHub
git push origin main

# Import on vercel.com → Deploy
# Set environment variables in Vercel dashboard
```

### Railway (Full-Stack — $5/mo free credit)

```bash
# Deploy Piston for code execution
railway login
railway init
railway add --image ghcr.io/engineer-man/piston
railway up
```

### Docker

```bash
docker build -t codeiq .
docker run -p 3000:3000 codeiq
```

### Docker Compose

```bash
docker-compose up -d
```

---

## Project Structure

```
CodeIQ/
├��─ app/                          # Next.js App Router
│   ├── admin/                    # Admin panel
│   │   ├── analytics/page.tsx
│   │   ├── feedback/page.tsx
│   │   ├── languages/page.tsx
│   │   ├── login/page.tsx
│   │   ├── users/page.tsx
│   │   └── page.tsx
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin APIs
│   │   ├── agent/                # AI Agent chat
│   │   ├── ai-complete/          # AI code completion
│   │   ├── auth/                 # Authentication
│   │   ├── execute/              # Code execution
│   │   ├── feedback/             # User feedback
│   │   ├── languages/            # Language config
│   │   ├── preview/              # HTML/CSS preview
│   │   ├── projects/             # Project CRUD
│   │   ├── runs/                 # Run history
│   │   ├── setup/                # DB setup
│   │   └── share/                # Share links
│   ├── dashboard/page.tsx        # User dashboard
│   ├── docs/page.tsx             # Documentation
│   ├── editor/page.tsx           # Code editor
│   ├── features/page.tsx         # Features page
│   ├── login/page.tsx            # Login
│   ├── signup/page.tsx           # Sign up
│   ├── preview/[id]/page.tsx     # Shared preview
│   ├── share/[id]/page.tsx       # Shared code view
│   ├── not-found.tsx             # 404 page
│   ├── layout.tsx                # Root layout + PWA
│   └── globals.css               # Global styles + animations
├── components/
│   ├── editor/                   # Editor components
│   │   ├── CodeEditor.tsx        # CodeMirror 6 wrapper
│   │   ├── EditorToolbar.tsx     # Language selector + Run
│   │   ├── OutputPanel.tsx       # Output display
│   │   ├── AgentPanel.tsx        # AI chat interface
│   │   ├── Terminal.tsx          # xterm.js terminal
│   │   └── LanguageSelector.tsx  # Language dropdown
│   ├── landing/                  # Landing page sections
│   │   ├── Hero.tsx              # Hero with code mockup
│   │   ├── Features.tsx          # Feature cards
│   │   ├── AIAgentShowcase.tsx   # AI demo
│   │   ├── HorizontalCards.tsx   # Stats cards
│   │   ├── StickyStory.tsx       # How it works
│   │   ├── FAQ.tsx               # FAQ accordion
│   │   ├── MarqueeTicker.tsx     # Language ticker
│   │   ├── AnimateIn.tsx         # Scroll animations
│   │   ├── theme.ts              # 7 theme definitions
│   │   └── ThemeContext.tsx       # Theme provider
│   ├── AuthContext.tsx           # Auth provider
│   ├── CustomCursor.tsx          # Animated cursor
│   ├── Navbar.tsx                # Top nav + mobile bottom bar
│   ├── Footer.tsx                # Footer
│   ├── PageTransition.tsx        # Route transitions
│   ├── PWARegister.tsx           # Service worker
│   ├── PWAInstall.tsx            # Install prompt
│   └── Toast.tsx                 # Toast notifications
├── lib/
│   ├── db.ts                     # Supabase client
│   ├── keyking.ts                # KeyKing AI SDK
│   ├── admin-auth.ts             # Admin auth
│   └── agent-tools.ts            # AI agent tools
├── hooks/
│   └── useMediaQuery.ts          # Responsive hooks
├── public/
│   ��── icons/                    # PWA icons
│   ├── sw.js                     # Service worker
│   └── manifest.json             # PWA manifest
├── data/
│   └── web-projects/             # Pre-built templates
├── server.ts                     # WebSocket PTY server
├── ws-server.ts                  # WebSocket server
├── Dockerfile                    # Docker config
├── docker-compose.yml            # Docker Compose
└── test_all.mjs                  # Language test suite
```

---

## Security

- ✅ Rate limiting on code execution (50 req/min per IP)
- ✅ Code size limit (50KB max)
- ✅ Google JWT verified server-side
- ✅ Admin panel with separate authentication
- ✅ Java requires login on every execution
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection via React's built-in sanitization
- ✅ KeyKing zero-trust AI routing (no raw API keys)
- ✅ VM sandboxing for JavaScript/TypeScript execution

---

## Performance

- ⚡ Next.js 16 with Turbopack
- ⚡ Lazy-loaded components (AgentPanel, LandingSections)
- ⚡ CodeMirror 6 with line wrapping
- ⚡ Service worker for offline caching
- ⚡ PWA manifest for native app feel
- ⚡ Optimized loading screen (~1.2s)

---

## License

MIT © [Vivek Pankhaniya](https://github.com/vivekpankhaniya)

---

<div align="center">

**Built with ❤️ using Next.js 16, React 19, and Supabase**

*Write code. Run it instantly. Share it with the world.*

</div>
