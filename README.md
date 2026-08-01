<div align="center">

```
  ██████╗ ██████��╗███╗   ██╗██╗██████╗ ██████��� ███████╗
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
┌─────────────────────────────────────────────────────┐
│  // Write code                                      │
│  console.log("Hello, World!");                      │
│                                                     │
│  // Run instantly                                   │
│  ▶ Output: Hello, World!                            │
│                                                     │
│  // Share with anyone                               │
│  🔗 https://codeiq.dev/share/abc123                 │
└─────────────────────────────────────────────────────┘
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Language Support** | 12 languages: JavaScript, TypeScript, Python, C, C++, Java, Go, Rust, Ruby, Haskell, HTML, CSS |
| **AI Code Agent** | Context-aware code generation, debugging, and explanation powered by KeyKing SDK |
| **AI Code Completion** | Real-time inline suggestions via KeyKing — adapts to your code context |
| **Instant Execution** | Run code in real-time — JS/TS in VM sandbox, others via Piston API |
| **Smart Input Detection** | Auto-detects `input()` calls and shows inline input fields |
| **Live Preview** | HTML/CSS editor with instant browser preview |
| **7 Themes** | Midnight, Cyberpunk, Retro Gaming, Neon Nights, Deep Ocean, Hacker, Light Mode |
| **Auto-Save** | Projects saved automatically to database |
| **Shareable Links** | Generate shareable URLs for any code snippet |
| **Admin Panel** | Full dashboard with user management, language config, and analytics |
| **PWA Support** | Installable as a native app — works offline with service worker |
| **Bottom Navigation** | Mobile-first bottom nav bar (Instagram/WhatsApp style) |
| **Custom Cursor** | Animated `< >` code bracket cursor with AI orbit ring |
| **Page Transitions** | Smooth fade/slide transitions between routes |
| **Scroll Animations** | 6 animation types: fadeUp, fadeIn, scaleUp, slideLeft, slideRight, blur |
| **Responsive Design** | Fully responsive — desktop, tablet, and mobile with optimized layouts |

---

## Supported Languages

| Language | Execution Mode | Interactive Input |
|----------|:--------------:|:-----------------:|
| JavaScript | Live (VM sandbox) | — |
| TypeScript | Live (VM sandbox) | — |
| Python | Piston API | ✅ |
| C | Piston API | — |
| C++ | Piston API | — |
| Java | Piston API (login required) | — |
| Go | Piston API | ✅ |
| Rust | Piston API | — |
| Ruby | Piston API | ✅ |
| Haskell | Piston API | — |
| HTML | Live preview | — |
| CSS | Live preview | — |

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

## Themes

| Theme | Accent | Description |
|-------|--------|-------------|
| **Midnight** | ⬜ White | Clean dark with white accents |
| **Cyberpunk** | 🩷 Neon Pink | Neon pink on deep purple |
| **Retro Gaming** | 🟡 Yellow | Yellow on navy blue |
| **Neon Nights** | 🟣 Purple | Purple on dark blue |
| **Deep Ocean** | 🔵 Cyan | Cyan on dark teal |
| **Hacker** | 🟢 Green | Green on black |
| **Light Mode** | ⬛ Dark | Clean white with black text |

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
