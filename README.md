<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://images.unsplash.com/photo-1504711434969-e33886168d3c?w=1200&h=475&fit=crop" />
</div>

# BYLDaily — Beyond Your Labels Daily

A digital media platform focused on culture, entertainment, lifestyle, and news across Africa.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Auth**: Firebase Authentication (Email/Password + Google)
- **Backend**: Convex (schema, queries, mutations)
- **Deployment**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → **Sign-in method** → Enable **Email/Password** and **Google**
3. Copy your Firebase config from Project Settings → General → Your apps → Web app
4. Create `.env.local` in the project root:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

## Convex

This project uses Convex as its backend. To set up Convex locally:

```bash
npx convex dev
```

This will prompt you to create a Convex account and project, then generate the `convex/_generated/` files needed for type-safe queries.

### Seed Data



### Admin Access

To grant admin privileges to a user, run this in the Convex dashboard or via the CLI:

```bash
npx convex run --args '{email: "admin@example.com"}'
```

Then set the `admin` custom claim for that user in Firebase.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import the repo in Vercel
3. Set the **Framework Preset** to **Vite**
4. Add Firebase environment variables in Vercel's dashboard for **Production**, **Preview**, and **Development** (see `.env.example`)
   - Prefer the `VITE_FIREBASE_*` names below.
   - If your Vercel project already has `FIREBASE_*` names without `VITE_`, the build maps those public web config values too.
   - Existing `VITE_FIREBASE_AUTHDOMAIN`, `VITE_FIREBASE_STORAGEBUCKET`, and `VITE_FIREBASE_MESSAGINGSENDER_ID` variables are also supported for compatibility.
   - After changing Vercel environment variables, redeploy. Existing builds keep the old values.
5. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_CONVEX_URL` | Convex deployment URL (auto-configured) |
