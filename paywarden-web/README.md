# PayWarden Web - Frontend Application

Modern React + TypeScript wallet management application for PayWarden.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **React Router** - Navigation
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client
- **Google OAuth** - Authentication

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

## Features Implemented (Sprint 1)

✅ Google OAuth authentication
✅ JWT token management
✅ Protected routes
✅ Persistent auth state
✅ Axios interceptors for auth
✅ Tailwind CSS setup
✅ Base UI components (Button, Input, Card)
✅ Responsive layout
✅ Error handling
✅ Toast notifications

## Coming Soon

- 📊 Wallet balance display (Sprint 2)
- 💸 Deposit functionality (Sprint 3)
- 🔄 Transfer funds (Sprint 4)
- 🔑 API key management (Sprint 5)
- ✨ Testing and optimization (Sprint 6)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key | No (Sprint 3) |

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
- Ensure you have Node.js 18+

## License

MIT
