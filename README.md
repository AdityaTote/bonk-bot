# 🤖 Bonk Bot

<div align="center">
  <h3>🚀 A Powerful Solana Wallet Management & Transaction Bot</h3>
  <p>Seamlessly manage crypto wallets with automated features and secure blockchain integration</p>
  
  ![Solana](https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
</div>

---

## ✨ Features

### 🔐 **Automatic Wallet Creation**

On signup, a secure Solana wallet (public/private key pair) is generated and stored safely with enterprise-grade encryption.

### ⛓️ **Blockchain Integration**

Powered by Solana Web3.js for fast and reliable on-chain transactions with minimal fees and lightning-fast confirmations.

### 🚀 **Backend APIs**

Built with Hono and deployed on Cloudflare Workers for unmatched scalability, performance, and global edge distribution.

### 🗄️ **Database Layer**

Uses Turso + SQLite + Drizzle ORM for secure key management, transaction tracking, and data persistence.

### 🎨 **Modern Frontend**

Developed with TanStack Start for a responsive, smooth, and delightful user experience.

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center"><strong>Frontend</strong></td>
    <td>🔥 TanStack Start + React + TypeScript</td>
  </tr>
  <tr>
    <td align="center"><strong>Backend</strong></td>
    <td>⚡ Hono (Cloudflare Workers)</td>
  </tr>
  <tr>
    <td align="center"><strong>Database</strong></td>
    <td>🗃️ Turso (SQLite + Drizzle ORM)</td>
  </tr>
  <tr>
    <td align="center"><strong>Blockchain</strong></td>
    <td>🌐 Solana Web3.js</td>
  </tr>
  <tr>
    <td align="center"><strong>Styling</strong></td>
    <td>🎨 TailwindCSS + Radix UI</td>
  </tr>
  <tr>
    <td align="center"><strong>State Management</strong></td>
    <td>🐻 Zustand + TanStack Query</td>
  </tr>
  <tr>
    <td align="center"><strong>Authentication</strong></td>
    <td>🔒 JWT + bcryptjs</td>
  </tr>
  <tr>
    <td align="center"><strong>Validation</strong></td>
    <td>✅ Zod</td>
  </tr>
</table>

---

## 📁 Project Structure

```
bonk-bot/
├── 📱 apps/
│   ├── 🖥️ web/              # Frontend application
│   │   ├── src/
│   │   │   ├── components/   # UI components
│   │   │   ├── routes/       # Page routes
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── store/        # State management
│   │   │   └── lib/          # Utilities & API
│   │   └── package.json
│   └── 🔧 server/            # Backend API
│       ├── src/
│       │   ├── routes/       # API endpoints
│       │   ├── services/     # Business logic
│       │   ├── middlewares/  # Custom middleware
│       │   ├── lib/          # Database & utilities
│       │   └── types/        # Type definitions
│       └── package.json
├── 📦 package.json           # Root configuration
└── 🔧 turbo.json            # Turborepo config
```

---

## 🚀 Quick Start

### Prerequisites

- 📋 **Node.js** >= 18
- 🧊 **Bun** >= 1.2.18
- 🔑 **Cloudflare Account** (for deployment)
- 🗄️ **Turso Database** (for production)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AdityaTote/bonk-bot.git
   cd bonk-bot
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment files
   cp apps/server/.env.example apps/server/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. **Configure your environment**
   - Add your database connection string
   - Set up Solana RPC endpoints
   - Configure JWT secrets

### Development

```bash
# 🔥 Start all applications in development mode
bun run dev

# 🎯 Start specific application
bun run dev --filter=web    # Frontend only
bun run dev --filter=server # Backend only
```

### Building

```bash
# 🏗️ Build all applications
bun run build

# 🎯 Build specific application
bun run build --filter=web
bun run build --filter=server
```

---

## 🔧 Configuration

### Database Setup

1. **Generate database migrations**

   ```bash
   cd apps/server
   bun run drizzle:generate
   ```

2. **Apply migrations**
   ```bash
   bun run drizzle:migrate
   ```

### Deployment

#### Backend (Cloudflare Workers)

```bash
cd apps/server
bun run deploy
```

#### Frontend (Cloudflare Pages)

```bash
cd apps/web
bun run build
bun run deploy
```

---

## 🎯 API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Create new account with wallet
- `POST /api/v1/auth/signin` - User authentication
- `GET /api/v1/auth/me` - Get user profile

### Transactions

- `POST /api/v1/transactions/send` - Send SOL tokens
- `GET /api/v1/transactions/history` - Transaction history

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- 🌐 [Solana](https://solana.com/) for the blazing-fast blockchain
- ⚡ [Hono](https://hono.dev/) for the lightweight web framework
- 🔥 [TanStack](https://tanstack.com/) for amazing React tools
- ☁️ [Cloudflare](https://cloudflare.com/) for edge computing
- 🗄️ [Turso](https://turso.tech/) for the distributed SQLite

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/AdityaTote">Aditya Tote</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
