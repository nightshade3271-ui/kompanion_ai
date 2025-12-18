/**
 * Application configuration
 * OAuth credentials are hardcoded here for security
 * Client Secret is NEVER exposed - it stays server-side only
 */

export const OAUTH_CONFIG = {
  // Google OAuth Client ID (public, safe to expose)
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1025148281520-fs8aoq77d4vqjv2n5uojhe1h76j7iuro.apps.googleusercontent.com',

  // OAuth backend URL (local development)
  OAUTH_BACKEND_URL: import.meta.env.VITE_OAUTH_BACKEND_URL || 'http://localhost:3000',

  // OAuth scopes for Google Calendar
  GOOGLE_SCOPES: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ].join(' '),

  // Redirect URI for OAuth callback
  REDIRECT_URI: `${window.location.origin}/calendar/callback`,
};
