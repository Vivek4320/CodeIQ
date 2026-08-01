<div align="center">

# ⟨/⟩ CodeIQ

### **Code Smarter. Run Faster.**

A modern, browser-based code editor with AI-powered code completion, live execution, 12+ language support, and a premium multi-theme UI — built for developers who ship fast.

<br>

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## What is CodeIQ?

CodeIQ is a full-featured online code editor that lets you write, execute, and share code across 12+ programming languages — directly from your browser. No installations. No configurations. Just code.

<br>

```
 +-----------------------------------------------------+
 |  // Write code                                      |
 |  console.log("Hello, World!");                      |
 |                                                     |
 |  // Run instantly                                   |
 |  > Output: Hello, World!                            |
 |                                                     |
 |  // Share with anyone                               |
 |  https://codeiq.dev/share/abc123                    |
 +-----------------------------------------------------+
```

---

## Highlights

> Built with **Next.js 16**, **React 19**, **TypeScript 5**, and **Supabase** — deployed on **Vercel**.

| | Feature | What it does |
|---|---------|-------------|
| 1 | **12 Languages** | JavaScript, TypeScript, Python, C, C++, Java, Go, Rust, Ruby, Haskell, HTML, CSS |
| 2 | **AI Code Agent** | Context-aware code generation, debugging, and explanation via KeyKing SDK |
| 3 | **AI Completion** | Real-time inline suggestions that adapt to your code context |
| 4 | **Instant Execution** | JS/TS in VM sandbox, others via Piston API — output in under a second |
| 5 | **Smart Input** | Auto-detects `input()` calls and shows inline input fields |
| 6 | **Live Preview** | HTML/CSS editor with instant browser preview |
| 7 | **7 Themes** | Midnight, Cyberpunk, Retro Gaming, Neon Nights, Deep Ocean, Hacker, Light Mode |
| 8 | **Auto-Save** | Projects saved automatically to Supabase database |
| 9 | **Shareable Links** | Generate shareable URLs for any code snippet |
| 10 | **Admin Panel** | Full dashboard with user management, language config, and analytics |
| 11 | **PWA** | Installable as a native app — works offline with service worker |
| 12 | **Mobile Nav** | Bottom navigation bar (Instagram/WhatsApp style) on mobile |
| 13 | **Custom Cursor** | Animated `< >` code bracket cursor with AI orbit ring |
| 14 | **Animations** | Page transitions, scroll animations, hover micro-interactions |
| 15 | **Responsive** | Fully responsive — desktop, tablet, and mobile with optimized layouts |

---

## Supported Languages

| Language | Execution | Input | Status |
|----------|:---------:|:-----:|:------:|
| JavaScript | Live (VM) | - | Active |
| TypeScript | Live (VM) | - | Active |
| Python | Piston API | Yes | Active |
| C | Piston API | - | Active |
| C++ | Piston API | - | Active |
| Java | Piston API | - | Active (Login required) |
| Go | Piston API | Yes | Active |
| Rust | Piston API | - | Active |
| Ruby | Piston API | Yes | Active |
| Haskell | Piston API | - | Active |
| HTML | Live Preview | - | Active |
| CSS | Live Preview | - | Active |

---

## AI Agent

The built-in AI agent can:

- **Write code** from natural language descriptions
- **Fix bugs** — analyzes your code, finds issues, and fixes them
- **Explain code** — step-by-step breakdowns in plain language
- **Run & verify** — executes code to confirm it actually works

```
 +--------------------------------------+
 |  CodeIQ Agent                 python |
 +--------------------------------------+
 |  User: Fix the bug in this code      |
 |                                      |
 |  > Run code                   done   |
 |                                      |
 |  Found the issue: `nums` was being   |
 |  shadowed by the loop variable.      |
 |                                      |
 |  def find_max(nums):                 |
 |      maximum = nums[0]              |
 |      for num in nums[1:]:           |
 |          if num > maximum:           |
 |              maximum = num           |
 |      return maximum                  |
 |                                      |
 |  > Output: 9                         |
 +--------------------------------------+
```

---

## Themes

| | Theme | Accent | Vibe |
|---|-------|--------|------|
| | **Midnight** | White | Clean dark with white accents |
| | **Cyberpunk** | Neon Pink | Neon pink on deep purple |
| | **Retro Gaming** | Yellow | Yellow on navy blue |
| | **Neon Nights** | Purple | Purple on dark blue |
| | **Deep Ocean** | Cyan | Cyan on dark teal |
| | **Hacker** | Green | Green on black |
| | **Light Mode** | Dark | Clean white with black text |

---

## Security

- Rate limiting on code execution (50 req/min per IP)
- Code size limit (50KB max)
- Google JWT verified server-side
- Admin panel with separate authentication
- Java requires login on every execution
- SQL injection prevention (parameterized queries)
- XSS protection via React's built-in sanitization
- KeyKing zero-trust AI routing (no raw API keys)
- VM sandboxing for JavaScript/TypeScript execution

---

## Performance

- Next.js 16 with Turbopack
- Lazy-loaded components (AgentPanel, LandingSections)
- CodeMirror 6 with line wrapping
- Service worker for offline caching
- PWA manifest for native app feel
- Optimized loading screen (~1.2s)

---

## Getting Started

```bash
# Clone
git clone https://github.com/vivekpankhaniya/CodeIQ.git
cd CodeIQ

# Install
npm install

# Run
npm run dev
```

Open **http://localhost:3000**

---

## Deployment

| Platform | Command | Cost |
|----------|---------|------|
| **Vercel** | `vercel deploy` | Free |
| **Railway** | `railway up` | $5/mo free credit |
| **Docker** | `docker run -p 3000:3000 codeiq` | Free |

---

## License

MIT © [Vivek Pankhaniya](https://github.com/vivekpankhaniya)

---

<div align="center">

**Built with Next.js 16, React 19, and Supabase**

*Write code. Run it instantly. Share it with the world.*

</div>
