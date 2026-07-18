// Vercel serverless function to check status of webhook in environment
export default function handler(req: any, res: any) {
  res.status(200).json({
    configuredOnServer: !!process.env.DISCORD_WEBHOOK_URL,
  });
}
