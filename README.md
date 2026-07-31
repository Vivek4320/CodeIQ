<div align="center">

# `CodeIQ`

### **Code Smarter. Run Faster.**

A modern, browser-based code editor with AI assistance, live execution, and 12+ language support — all from your browser.

---

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/CodeIQ)

</div>

---

## What is CodeIQ?

CodeIQ is a full-featured online code editor that lets you write, execute, and share code across 12+ programming languages — directly from your browser. No installations. No configurations. Just code.

```
���─────────────────────────────────────────────────────┐
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
| **AI Code Agent** | Context-aware code generation, debugging, and explanation powered by LLMs |
| **Instant Execution** | Run code in real-time with live output — no waiting |
| **Smart Input Detection** | Auto-detects `input()` calls and shows inline input fields |
| **Live Preview** | HTML/CSS editor with instant browser preview |
| **7 Themes** | Midnight, Cyberpunk, Retro Gaming, Neon Nights, Deep Ocean, Hacker, Light Mode |
| **Auto-Save** | Projects saved automatically to database |
| **Shareable Links** | Generate shareable URLs for any code snippet |
| **Admin Panel** | Full dashboard with user management, language config, and analytics |
| **Responsive Design** | Works on desktop, tablet, and mobile devices |

---

## Tech Stack

```
├── Frontend          → Next.js 16, React 19, TypeScript, Tailwind CSS 4
├── Code Editor       → CodeMirror 6 with custom autocomplete
├── Terminal          → xterm.js + node-pty (WebSocket PTY)
├── AI Agent          → KeyKing SDK (Groq, Anthropic, OpenAI routing)
├── Database          → Supabase (PostgreSQL)
├── Auth              → Email/Password + Google OAuth
├── Icons             → Lucide React
└── Deployment        → Vercel / Railway / Docker
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
git clone https://github.com/your-username/CodeIQ.git
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

## Supported Languages

| Language | Local Compiler | Interactive Input | Piston Fallback |
|----------|:--------------:|:-----------------:|:---------------:|
| JavaScript | Node.js | — | ✅ |
| TypeScript | tsx | — | ✅ |
| Python | python | ✅ | ✅ |
| C | gcc | — | ✅ |
| C++ | g++ | — | ✅ |
| Java | javac | — | ✅ |
| Go | go | ✅ | ✅ |
| Rust | rustc | — | ✅ |
| Ruby | ruby | ✅ | ✅ |
| Haskell | stack | — | ✅ |
| HTML | — | — | — |
| CSS | — | — | — |

---

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Import on vercel.com → Deploy
# Set environment variables in Vercel dashboard
```

### Docker

```bash
docker build -t codeiq .
docker run -p 3000:3000 codeiq
```

---

## Security

- ✅ Rate limiting on code execution (30 req/min per IP)
- ✅ Code size limit (50KB max)
- ✅ Google JWT verified server-side
- ✅ Admin panel with separate authentication
- ✅ Java requires login on every execution
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection via React's built-in sanitization

---

## License

MIT © [Vivek Pankhaniya](https://github.com/vivekpankhaniya)

---

<div align="center">

**Built with ❤️ using Next.js, React, and Supabase**

*Write code. Run it instantly. Share it with the world.*

</div>
