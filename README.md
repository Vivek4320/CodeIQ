# CodeIQ

> Code Smarter. Run Faster.

CodeIQ is a browser-based code editor that lets you write, run, and share code in 12 languages — no setup required.

## 🚀 Features

- **AI Code Completion** — Context-aware suggestions that adapt to your coding style
- **Instant Execution** — Run Python, JavaScript, TypeScript, C++, Java, Go, Rust, and Ruby instantly
- **Auto-saved History** — Every run is versioned automatically
- **Shareable Programs** — Send a link that runs live for anyone
- **7 Game Themes** — Midnight, Cyberpunk, Retro Gaming, Neon Nights, Deep Ocean, Hacker, Light Mode
- **User Authentication** — Email/password signup and login with profile icon

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org) | React framework (App Router) |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling |
| [MySQL (Railway)](https://railway.app) | Database |
| [KeyKing](https://github.com/Malaybhai11/keyking) | Zero-trust AI routing (no API keys) |
| [Lucide React](https://lucide.dev) | Icons |

## 📁 Project Structure

```
CodeIQ/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Login API
│   │   │   ├── signup/route.ts     # Signup API
│   │   │   └── me/route.ts         # Get current user
│   │   └── setup/route.ts          # DB setup endpoint
│   ├── features/page.tsx           # Features page
│   ├── docs/page.tsx               # Documentation page
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles
├── components/
│   ├── landing/
│   │   ├── Hero.tsx                # Hero section
│   │   ├── Features.tsx            # Feature grid
│   │   ├── StickyStory.tsx         # How it works section
│   │   ├── HorizontalCards.tsx     # Scrollable cards
│   │   ├── CTASection.tsx          # Call to action
│   │   ├── MarqueeTicker.tsx       # Language ticker
│   │   ├── Logo.tsx                # SVG logo component
│   │   ├── ThemeContext.tsx         # Theme provider
│   │   ├── ThemeStyle.tsx          # CSS variable injector
│   │   └── theme.ts               # 7 theme definitions
│   ├── Navbar.tsx                  # Shared navbar
│   ├── Footer.tsx                  # Shared footer
│   ├── PageLayout.tsx              # Page wrapper
│   └── AuthContext.tsx             # Auth provider
├── lib/
│   └── db.ts                       # MySQL connection
├── .env.local                      # Environment variables
└── package.json
```

## �� Themes

| Theme | Accent Color |
|-------|-------------|
| 🌙 Midnight | White |
| ���� Cyberpunk | Neon Pink |
| 👾 Retro Gaming | Yellow |
| 💜 Neon Nights | Purple |
| 🌊 Deep Ocean | Cyan |
| 💚 Hacker | Green |
| ☀️ Light Mode | Black |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Railway account (for MySQL database)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/CodeIQ.git

# Navigate to project
cd CodeIQ

# Install dependencies
npm install
```

### Environment Variables

Create `.env.local` file:

```env
DATABASE_URL=mysql://username:password@host:port/database_name

# KeyKing AI — export vault from KeyKing Desktop App (Settings > Export Vault)
KK_VAULT=KK_VAULT_eyJhbGciOiJIUzI1NiIs...
KK_VAULT_PASS=your-vault-password
```

### Database Setup

The app auto-creates the `users` table on first API call. Or manually:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | No |
| `/features` | Features overview | Yes |
| `/docs` | Documentation | Yes |
| `/login` | User login | No |
| `/signup` | User signup | No |

## 🔐 Authentication

- **Email/Password** — Traditional signup and login
- **Validation** — Real-time form validation with error messages
- **Profile Icon** — Shows user initial, click for dropdown with logout
- **Protected Routes** — Features and Docs pages require login

## 📦 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/me` | Get user by email |
| GET | `/api/setup` | Setup/verify database |

## 🚀 Deployment

### Vercel

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) with environment variables.

### Railway

1. Connect GitHub repository
2. Add MySQL database
3. Set `DATABASE_URL` environment variable
4. Deploy

## 📄 License

MIT License

---

Built with ❤️ by Vivek Pankhaniya
