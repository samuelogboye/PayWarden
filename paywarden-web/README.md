# PayWarden Web

Production-ready React + TypeScript web application for PayWarden wallet management.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with JWT tokens
- 💰 **Wallet Management** - View balance and transaction history
- 💳 **Paystack Deposits** - Add funds via Paystack payment gateway
- 💸 **Transfers** - Send money to other PayWarden wallets
- 🔑 **API Key Management** - Create and manage API keys with permissions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast & Optimized** - Code splitting, lazy loading, and caching
- 🧪 **Testing** - Comprehensive test suite with Vitest
- 🐳 **Docker Ready** - Production-grade containerization
- 🔄 **CI/CD** - GitHub Actions workflow

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **React Hook Form + Zod** - Form handling and validation
- **Vitest** - Unit testing framework
- **Docker** - Containerization
- **Nginx** - Production web server

## Prerequisites

- Node.js 18+ and npm
- PayWarden API running on `http://localhost:8080`
- Google OAuth Client ID

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
   ```

3. **Get Google OAuth Client ID**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000` to authorized JavaScript origins
   - Copy the Client ID to your `.env` file

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
paywarden-web/
├── src/
│   ├── components/       # Reusable components
│   │   └── ui/          # Base UI components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities and API client
│   ├── stores/          # Zustand stores
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── index.html           # HTML template
```

## Available Scripts

### Development

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Testing

```bash
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key | No (Sprint 3) |

## Building for Production

### Standard Build

```bash
npm run build
```

The built files will be in the `dist/` directory. Serve using any static file server.

### Docker Build

```bash
docker build -t paywarden-web \
  --build-arg VITE_API_BASE_URL=https://api.paywarden.com/api \
  --build-arg VITE_GOOGLE_CLIENT_ID=your_client_id \
  --build-arg VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxx \
  .
```

### Run Docker Container

```bash
docker run -p 80:80 paywarden-web
```

The app will be available at `http://localhost`

## Testing

The project uses Vitest for unit testing. Tests are located next to the files they test:

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

## Performance Optimizations

- ⚡ **Code Splitting** - Routes are lazy loaded
- 📦 **Manual Chunks** - Vendor libraries split into separate chunks
- 💾 **Caching** - React Query caches API responses
- 🎨 **SVG Icons** - Scalable vector graphics for icons
- 🌲 **Tree Shaking** - Unused code eliminated during build
- 🗜️ **Minification** - Production builds are minified with Terser

## Troubleshooting

**Google OAuth not working:**
- Ensure `VITE_GOOGLE_CLIENT_ID` is set correctly
- Check authorized JavaScript origins in Google Console
- Clear browser cache and cookies

**API calls failing:**
- Ensure backend API is running on `http://localhost:8080`
- Check CORS settings on backend
- Verify `VITE_API_BASE_URL` is correct

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure you have Node.js 20+

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved
