# KompanionAI OAuth Backend

A minimal serverless function for secure Google Calendar OAuth token exchange.

## Why This Exists

This tiny backend keeps your Google OAuth Client Secret secure. Your local-first PWA calls this endpoint to exchange authorization codes for access tokens without exposing the secret in the browser.

## Features

- ✅ Single endpoint: `/api/calendar-token`
- ✅ Stateless (no database required)
- ✅ ~120 lines of code
- ✅ Free tier compatible (Render)
- ✅ Handles token exchange and refresh

## Deployment Options

### Option 1: Render (Recommended)

1. **Create New Web Service** on Render.com

2. **Connect Repository** or upload this folder

3. **Configure**:
   - Build Command: (leave empty)
   - Start Command: (leave empty - it's serverless)
   - Add Environment Variables:
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`

4. **Deploy** and get your URL

### Option 2: Railway/Fly.io/Netlify

Similar process - just deploy the `serverless-backend` folder and set environment variables.

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Calendar API**:
   - APIs & Services → Library → Search "Google Calendar API" → Enable
4. Create OAuth Credentials:
   - APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: **Web application**
   - Authorized redirect URIs: Add your PWA URL (e.g., `http://localhost:5173/calendar-callback`)
5. Copy your **Client ID** and **Client Secret**

## API Endpoints

### POST /api/calendar-token

**Exchange authorization code for tokens:**
```json
{
  "action": "exchange",
  "code": "authorization-code-from-google",
  "redirectUri": "http://localhost:5173/calendar-callback"
}
```

**Response:**
```json
{
  "access_token": "ya29.xxx",
  "refresh_token": "1//xxx",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Refresh access token:**
```json
{
  "action": "refresh",
  "refreshToken": "1//xxx"
}
```

**Response:**
```json
{
  "access_token": "ya29.xxx",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

## Security Notes

- ✅ Client Secret never leaves the server
- ✅ CORS enabled (adjust in production)
- ✅ No data storage (stateless)
- ✅ Only handles token exchange

## Cost

- **Render**: Free tier (750 hours/month)
- **Railway**: $5/month credit (free trial)

For a single-user app, free tier is more than enough.

## Testing Locally

```bash
npm install
npm run dev
```

Your endpoint will be available at `http://localhost:3000/api/calendar-token`

## Environment Variables

Create a `.env` file (DO NOT COMMIT):

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Troubleshooting

**"Missing OAuth credentials" error:**
- Check environment variables are set in your deployment platform

**CORS errors:**
- Update `Access-Control-Allow-Origin` in `calendar-token.js` to your PWA domain

**Token exchange failed:**
- Verify redirect URI matches exactly what you configured in Google Console
- Check that Google Calendar API is enabled

## Future Extensions

This backend pattern can be reused for:
- Other Google APIs (Gmail, Drive, etc.)
- Microsoft OAuth
- Any OAuth provider requiring Client Secret
