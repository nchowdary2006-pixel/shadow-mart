import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Helper to validate that a URL is a legitimate Discord Webhook URL to prevent Server-Side Request Forgery (SSRF)
function isValidDiscordWebhook(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    const allowedHosts = [
      'discord.com',
      'discordapp.com',
      'ptb.discord.com',
      'canary.discord.com'
    ];
    if (!allowedHosts.includes(parsed.hostname.toLowerCase())) {
      return false;
    }
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    // Path must start with api/webhooks/ followed by webhook ID and token (at least 4 parts)
    if (pathParts[0] !== 'api' || pathParts[1] !== 'webhooks' || pathParts.length < 4) {
      return false;
    }
    // Webhook ID (snowflake) must be purely numeric
    if (!/^\d+$/.test(pathParts[2])) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set secure HTTP headers with Helmet. 
  // Disable frameguard and CSP to preserve functionality within the AI Studio iframe environment.
  app.use(helmet({
    frameguard: false,
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  }));

  // JSON parser with body size limit to prevent oversized request denial of service
  app.use(express.json({ limit: '10kb' }));

  // Set up API rate-limiting to prevent server abuse and spamming of Discord webhooks
  const webhookLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // Limit each IP to 30 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many checkout attempts or webhook requests from this IP. Please try again after 15 minutes.'
    }
  });

  // Apply rate limiter specifically to API endpoints
  app.use('/api/', webhookLimiter);

  // API endpoint to proxy Discord Webhook calls
  app.post('/api/send-webhook', async (req, res) => {
    try {
      const { customWebhookUrl, payload } = req.body;
      
      // Check if the custom webhook URL is empty or a placeholder
      const isPlaceholder = !customWebhookUrl || 
        customWebhookUrl.toLowerCase().includes('placeholder') ||
        customWebhookUrl.toLowerCase().includes('your-fixed-webhook') ||
        customWebhookUrl.toLowerCase().includes('12345');

      const cleanCustomUrl = isPlaceholder ? '' : customWebhookUrl;

      // Determine target webhook URL: prioritizes server env variable for security,
      // and falls back to user custom URL from client settings, and finally the fixed default webhook.
      const targetUrl = process.env.DISCORD_WEBHOOK_URL || cleanCustomUrl || 'https://discord.com/api/webhooks/1527920468399493152/GwofHZ9iiZPtu2lcO4G-iFAJjXM69t3uD4_kr5vDoJCqTjztGWcMO0Y0SghMkdgyuKbX';

      if (!targetUrl) {
        return res.status(400).json({
          success: false,
          error: 'Discord Webhook is not configured. Please open the Admin Panel (Password: 2006) to enter your real Discord Webhook URL, or configure DISCORD_WEBHOOK_URL in your environment variables.'
        });
      }

      // STRICT SECURITY VALIDATION: Prevent SSRF by ensuring the target URL is a valid Discord webhook URL
      if (!isValidDiscordWebhook(targetUrl)) {
        return res.status(400).json({
          success: false,
          error: 'Security Error: The specified URL is not a valid Discord Webhook URL. Webhook dispatch has been blocked.'
        });
      }

      // Basic payload validation
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Invalid payload schema provided.'
        });
      }

      // Dispatch POST request to Discord Webhook API
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 204) {
        return res.status(200).json({ success: true, message: 'Webhook message sent successfully!' });
      } else {
        const text = await response.text();
        return res.status(response.status).json({
          success: false,
          error: `Discord API returned status ${response.status}: ${text || 'Empty response'}`
        });
      }
    } catch (error: any) {
      console.error('Error in send-webhook API proxy:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An internal server error occurred while forwarding the webhook.'
      });
    }
  });

  // Check Webhook configuration status
  app.get('/api/webhook-status', (req, res) => {
    res.json({
      configuredOnServer: true, // Always true as we have a robust fallback fixed webhook active
    });
  });

  // Vite development vs production asset serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shadows Mart server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Shadows Mart server:', err);
});
