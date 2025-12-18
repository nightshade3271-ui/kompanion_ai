import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
  origin: '*', // Allow all origins for now, restrict in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OAuth backend is running' });
});

// Google OAuth token exchange endpoint
app.post('/api/calendar-token', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: req.body.redirect_uri || 'http://localhost:5173/calendar/callback',
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return res.status(tokenResponse.status).json({
        error: 'Token exchange failed',
        details: errorText
      });
    }

    const tokens = await tokenResponse.json();

    // Return tokens to frontend
    res.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      scope: tokens.scope,
      token_type: tokens.token_type,
    });

  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Token refresh endpoint
app.post('/api/calendar-refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token refresh failed:', errorText);
      return res.status(tokenResponse.status).json({
        error: 'Token refresh failed',
        details: errorText
      });
    }

    const tokens = await tokenResponse.json();

    res.json({
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
      scope: tokens.scope,
      token_type: tokens.token_type,
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});



// --- Email Endpoints ---

import nodemailer from 'nodemailer';
import imaps from 'imap-simple';

// Send Email
app.post('/api/email/send', async (req, res) => {
  try {
    const {
      smtpServer,
      smtpPort,
      smtpUser,
      smtpPassword,
      to,
      subject,
      text
    } = req.body;

    console.log('📧 Email send request received:', {
      smtpServer,
      smtpPort,
      smtpUser: smtpUser ? '***' : undefined,
      to,
      subject
    });

    if (!smtpServer || !smtpUser || !smtpPassword || !to || !subject || !text) {
      console.error('❌ Missing required email parameters');
      return res.status(400).json({ error: 'Missing required email parameters' });
    }

    const port = parseInt(smtpPort) || 587;

    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certs if needed, though less secure
      }
    });

    console.log('📤 Attempting to send email...');
    const info = await transporter.sendMail({
      from: smtpUser,
      to,
      subject,
      text,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    res.json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('❌ Send email error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Check Emails
app.post('/api/email/check', async (req, res) => {
  try {
    const {
      imapServer,
      imapPort,
      imapUser,
      imapPassword,
      limit = 5
    } = req.body;

    if (!imapServer || !imapUser || !imapPassword) {
      return res.status(400).json({ error: 'Missing required IMAP parameters' });
    }

    const config = {
      imap: {
        user: imapUser,
        password: imapPassword,
        host: imapServer,
        port: imapPort || 993,
        tls: true,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false }, // Allow self-signed certs
      },
    };

    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false,
    };

    // Get all messages first to sort/slice (not efficient for huge inboxes but fine for "recent 5")
    // For better performance, we should search by date, but 'ALL' is simplest for now.
    // Let's try to get the last N messages by sequence number if possible, but imap-simple 
    // wraps node-imap. Let's just fetch all headers first or use a date range?
    // Actually, let's just use 'ALL' and fetchOptions.struct to limit data if possible, 
    // but imap-simple fetches everything matching criteria.
    // Optimization: Search for UNSEEN or recent messages? 
    // User asked for "check emails", implying recent ones.
    // Let's stick to 'ALL' but maybe limit by date if we could. 
    // For now, let's just fetch and slice in memory (careful with large inboxes).
    // BETTER: Use delay to get only recent? 
    // Let's use ['1:*'] range if we knew the count.

    // Let's just fetch the last 'limit' messages using sequence numbers if possible.
    // imap-simple doesn't expose sequence fetch easily with search.
    // Let's just search for messages since yesterday?
    const delay = 24 * 3600 * 1000 * 7; // 1 week
    const yesterday = new Date();
    yesterday.setTime(Date.now() - delay);
    const searchCriteriaDate = [['SINCE', yesterday]];

    const messages = await connection.search(searchCriteriaDate, fetchOptions);

    // Sort by date descending
    messages.sort((a, b) => {
      return new Date(b.attributes.date) - new Date(a.attributes.date);
    });

    const recentMessages = messages.slice(0, limit).map(msg => {
      const header = msg.parts.find(part => part.which === 'HEADER');
      const body = msg.parts.find(part => part.which === 'TEXT');

      return {
        from: header.body.from[0],
        subject: header.body.subject[0],
        date: header.body.date[0],
        body: body ? body.body.substring(0, 200) + '...' : '[No text body]', // Truncate body
      };
    });

    connection.end();

    res.json({ messages: recentMessages });

  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Failed to check emails', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`OAuth & Email backend running on port ${PORT}`);
  console.log(`Environment check:`);
  console.log(`- GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing'}`);
  console.log(`- GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing'}`);
});
