/**
 * Serverless function for Google Calendar OAuth token exchange
 * Keeps Client Secret secure on the server
 * 
 * Deploy to Vercel, Render, or any serverless platform
 * 
 * Environment Variables Required:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 */

export default async function handler(req, res) {
  // Enable CORS for your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, redirectUri, action } = req.body;

  // Validate environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ 
      error: 'Server configuration error: Missing OAuth credentials' 
    });
  }

  try {
    if (action === 'exchange') {
      // Exchange authorization code for tokens
      if (!code || !redirectUri) {
        return res.status(400).json({ error: 'Missing code or redirectUri' });
      }

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        return res.status(400).json({ 
          error: 'Token exchange failed', 
          details: tokenData 
        });
      }

      return res.status(200).json({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
      });

    } else if (action === 'refresh') {
      // Refresh access token
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Missing refreshToken' });
      }

      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        return res.status(400).json({ 
          error: 'Token refresh failed', 
          details: refreshData 
        });
      }

      return res.status(200).json({
        access_token: refreshData.access_token,
        expires_in: refreshData.expires_in,
        token_type: refreshData.token_type,
      });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('OAuth error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
