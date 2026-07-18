import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser for API request bodies
  app.use(express.json());

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
