// Vercel serverless function API proxy
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { customWebhookUrl, payload } = req.body;
    
    // Check if the custom webhook URL is empty or a placeholder
    const isPlaceholder = !customWebhookUrl || 
      customWebhookUrl.toLowerCase().includes('placeholder') ||
      customWebhookUrl.toLowerCase().includes('your-fixed-webhook') ||
      customWebhookUrl.toLowerCase().includes('12345');

    const cleanCustomUrl = isPlaceholder ? '' : customWebhookUrl;
    
    // Prioritize server-side env variable, fall back to client custom webhook, and finally to the fixed default webhook
    const targetUrl = process.env.DISCORD_WEBHOOK_URL || cleanCustomUrl || 'https://discord.com/api/webhooks/1527920468399493152/GwofHZ9iiZPtu2lcO4G-iFAJjXM69t3uD4_kr5vDoJCqTjztGWcMO0Y0SghMkdgyuKbX';

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        error: 'Discord Webhook is not configured. Please open the Admin Panel (Password: 2006) to enter your real Discord Webhook URL, or configure DISCORD_WEBHOOK_URL in Vercel settings.'
      });
    }

    // Send POST request to Discord Webhook
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
        error: `Discord API returned status ${response.status}: ${text}`
      });
    }
  } catch (error: any) {
    console.error('Error in Vercel API send-webhook:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
}
