import { CartItem, OrderDetails, CustomTicket, Review, WebhookSettings } from '../types';

// Helper to convert hex color string to integer for Discord Embeds
export function hexToInt(hex: string): number {
  const cleanHex = hex.replace('#', '');
  return parseInt(cleanHex, 16);
}

// Format currency
export function formatUSD(val: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
}

// Generate the payload for a Webhook Test
export function getTestPayload(settings: WebhookSettings, siteUrl: string) {
  return {
    username: settings.botName || 'Shadows Mart Bot',
    avatar_url: settings.botAvatar || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200',
    embeds: [
      {
        title: '🔔 Shadows Mart v5 - Webhook Connected!',
        description: 'Your Discord Webhook has been successfully integrated with **Shadows Mart**.\nThis channel will now receive real-time notifications for orders, custom service requests, and reviews!',
        color: hexToInt(settings.embedColor || '#7c3aed'),
        fields: [
          { name: 'Store Status', value: '🟢 Active & Ready', inline: true },
          { name: 'Environment', value: '🚀 Live Storefront', inline: true },
          { name: 'Platform URL', value: siteUrl || 'https://shadows-mart-5.vercel.app', inline: false }
        ],
        footer: {
          text: 'Shadows Mart Notification Engine • Built for Vercel',
          icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200'
        },
        timestamp: new Date().toISOString()
      }
    ]
  };
}

// Generate the payload for an Order Checkout
export function getOrderPayload(settings: WebhookSettings, order: OrderDetails, siteUrl: string) {
  const itemsList = order.items
    .map(item => `• **${item.product.name}** x${item.quantity} (${formatUSD(item.product.price * item.quantity)})`)
    .join('\n');

  return {
    username: settings.botName || 'Shadows Mart Bot',
    avatar_url: settings.botAvatar || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200',
    embeds: [
      {
        title: `🛒 New Order Placed! [ID: #${order.orderId}]`,
        description: `A customer has just completed a purchase at **Shadows Mart**!`,
        color: hexToInt('#2ecc71'), // Green for success
        fields: [
          { name: 'Buyer Email', value: `\`${order.email}\``, inline: true },
          { name: 'Discord Contact', value: `\`${order.discordTag}\``, inline: true },
          ...(order.roomNumber ? [{ name: 'Room Number', value: `\`${order.roomNumber}\``, inline: true }] : []),
          { name: 'Payment Method', value: `💳 ${order.paymentMethod}`, inline: true },
          { name: 'Items Ordered', value: itemsList || 'No items', inline: false },
          { name: 'Total Price', value: `💰 **${formatUSD(order.total)}**`, inline: true },
          { name: 'Store Link', value: `[Visit Store](${siteUrl || 'https://shadows-mart-5.vercel.app'})`, inline: true }
        ],
        footer: {
          text: 'Shadows Mart Order Logger',
          icon_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200'
        },
        timestamp: new Date().toISOString()
      }
    ]
  };
}

// Generate the payload for a Custom Service Ticket
export function getTicketPayload(settings: WebhookSettings, ticket: CustomTicket, siteUrl: string) {
  return {
    username: settings.botName || 'Shadows Mart Bot',
    avatar_url: settings.botAvatar || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200',
    embeds: [
      {
        title: '✉️ New Custom Service Request Ticket',
        description: 'A customer is requesting a custom account or boosting service!',
        color: hexToInt('#3498db'), // Blue for info/tickets
        fields: [
          { name: 'Discord Contact', value: `\`${ticket.discordTag}\``, inline: true },
          { name: 'Category', value: `⚙️ ${ticket.category}`, inline: true },
          { name: 'Proposed Budget', value: `💰 **${ticket.budget}**`, inline: true },
          { name: 'Requirements & Description', value: ticket.description, inline: false },
          { name: 'Store Link', value: `[Open Store](${siteUrl || 'https://shadows-mart-5.vercel.app'})`, inline: false }
        ],
        footer: {
          text: 'Shadows Mart Ticket Dispatcher',
          icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200'
        },
        timestamp: new Date().toISOString()
      }
    ]
  };
}

// Generate the payload for a Customer Review
export function getReviewPayload(settings: WebhookSettings, review: Review, siteUrl: string) {
  const stars = '⭐'.repeat(review.rating);
  return {
    username: settings.botName || 'Shadows Mart Bot',
    avatar_url: settings.botAvatar || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200',
    embeds: [
      {
        title: '⭐️ New Customer Review Received',
        description: `A customer just submitted a review on **Shadows Mart**!`,
        color: hexToInt('#f1c40f'), // Gold/Yellow for review
        fields: [
          { name: 'Reviewer', value: `\`${review.username}\``, inline: true },
          { name: 'Product Rated', value: `📦 ${review.productName}`, inline: true },
          { name: 'Rating', value: stars, inline: true },
          { name: 'Customer Comment', value: `*"${review.comment}"*`, inline: false },
          { name: 'Verified Purchaser', value: review.verified ? '✅ Yes' : '❌ No', inline: true }
        ],
        footer: {
          text: 'Shadows Mart Feedback Logger',
          icon_url: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=200'
        },
        timestamp: new Date().toISOString()
      }
    ]
  };
}

// Helper to check if a Webhook URL is a placeholder
export function isPlaceholderUrl(url: string | undefined): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('placeholder') ||
    lower.includes('your-fixed-webhook') ||
    lower.includes('12345') ||
    lower.trim() === ''
  );
}

// Send the Webhook Payload (tries server proxy first, then falls back to direct fetch)
export async function sendDiscordWebhook(
  settings: WebhookSettings,
  payload: any
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = isPlaceholderUrl(settings.url) ? '' : settings.url;

  // 1. Try sending through the local server endpoint
  try {
    const response = await fetch('/api/send-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customWebhookUrl: webhookUrl, // Send current custom URL if set on client
        payload,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return { success: true };
    } else if (data.error) {
      return { success: false, error: data.error };
    }
  } catch (err) {
    console.warn('Server proxy failed, trying direct fallback...', err);
  }

  // 2. Client-side direct fallback if server endpoint is not configured/failed
  if (!webhookUrl) {
    return { 
      success: false, 
      error: 'Discord Webhook is not configured. Please open the Admin Panel (Password: 2006) to enter your real Discord Webhook URL, or configure DISCORD_WEBHOOK_URL in your Vercel settings.' 
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 204) {
      return { success: true };
    } else {
      const text = await response.text();
      return { success: false, error: `Discord API returned status ${response.status}: ${text || 'Empty response'}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error occurred while calling Discord Webhook.' };
  }
}
