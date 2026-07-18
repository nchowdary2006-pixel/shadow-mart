import React, { useState, useEffect } from 'react';
import { Settings, Check, AlertCircle, Sparkles, Send, ShieldCheck, RefreshCw } from 'lucide-react';
import { WebhookSettings } from '../types';
import { sendDiscordWebhook, getTestPayload } from '../utils/webhook';
import { motion, AnimatePresence } from 'motion/react';

interface WebhookConfigProps {
  settings: WebhookSettings;
  onSave: (settings: WebhookSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function WebhookConfig({ settings, onSave, isOpen, onClose }: WebhookConfigProps) {
  const [url, setUrl] = useState(settings.url);
  const [botName, setBotName] = useState(settings.botName);
  const [botAvatar, setBotAvatar] = useState(settings.botAvatar);
  const [embedColor, setEmbedColor] = useState(settings.embedColor);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'testing'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [serverConfigured, setServerConfigured] = useState(false);

  // Check if webhook is pre-configured in server .env
  useEffect(() => {
    fetch('/api/webhook-status')
      .then(res => res.json())
      .then(data => {
        if (data.configuredOnServer) {
          setServerConfigured(true);
        }
      })
      .catch(err => console.warn('Failed to fetch server webhook status:', err));
  }, []);

  const handleSave = () => {
    onSave({ url, botName, botAvatar, embedColor });
    setStatus({
      type: 'success',
      message: 'Settings saved to browser storage successfully!',
    });
    setTimeout(() => {
      setStatus({ type: 'idle', message: '' });
    }, 3000);
  };

  const handleTestWebhook = async () => {
    if (!url && !serverConfigured) {
      setStatus({
        type: 'error',
        message: 'Please provide a valid Webhook URL or make sure it is set on the server.',
      });
      return;
    }

    setStatus({ type: 'testing', message: 'Dispatching test embed payload...' });

    const testPayload = getTestPayload(
      { url, botName, botAvatar, embedColor },
      window.location.href
    );

    const result = await sendDiscordWebhook({ url, botName, botAvatar, embedColor }, testPayload);

    if (result.success) {
      setStatus({
        type: 'success',
        message: '🔔 Success! Test notification sent to your Discord channel.',
      });
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Failed to send webhook.',
      });
    }
  };

  const COLORS = [
    { name: 'Purple', hex: '#7c3aed' },
    { name: 'Green', hex: '#2ecc71' },
    { name: 'Blue', hex: '#3498db' },
    { name: 'Yellow', hex: '#f1c40f' },
    { name: 'Red', hex: '#e74c3c' },
    { name: 'Pink', hex: '#ec4899' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          id="webhook-config-backdrop"
        />

        {/* Content Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-indigo-500/10"
          id="webhook-config-modal"
        >
          {/* Neon Glow Header Bar */}
          <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400" />

          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-indigo-400 animate-spin-slow" />
              <h2 className="text-xl font-bold tracking-tight text-white font-sans">
                Discord Webhook Config
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              id="webhook-close-btn"
            >
              ✕
            </button>
          </div>

          <div className="space-y-5">
            {/* Status indicators */}
            {serverConfigured && (
              <div className="flex items-center gap-2 rounded-xl bg-indigo-950/20 border border-indigo-800/20 p-3 text-indigo-300 text-xs">
                <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>
                  <strong>Server Connected:</strong> A Discord webhook has been pre-configured in your backend <code>.env</code> file. You don\'t need to specify one here unless you want to override it!
                </span>
              </div>
            )}

            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Discord Webhook URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none"
                id="webhook-url-input"
              />
              <p className="text-[11px] text-slate-500">
                Create a webhook in your Discord Channel Settings → Integrations → Webhooks and paste it here.
              </p>
            </div>

            {/* Advanced customizer */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Bot Appearance Customizer</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bot Username</label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="Shadows Mart Bot"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                    id="webhook-bot-name-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Embed Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={embedColor}
                      onChange={(e) => setEmbedColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border border-slate-850 bg-transparent"
                      id="webhook-color-picker"
                    />
                    <input
                      type="text"
                      value={embedColor}
                      onChange={(e) => setEmbedColor(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Bot Avatar URL</label>
                <input
                  type="text"
                  value={botAvatar}
                  onChange={(e) => setBotAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                  id="webhook-bot-avatar-input"
                />
              </div>

              {/* Quick Colors Selector */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setEmbedColor(c.hex)}
                    className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Status alerts */}
            {status.message && (
              <div
                className={`flex gap-2 rounded-xl p-3 text-xs ${
                  status.type === 'success'
                    ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300'
                    : status.type === 'error'
                    ? 'bg-rose-950/50 border border-rose-500/30 text-rose-300'
                    : 'bg-slate-950 border border-slate-800 text-indigo-300'
                }`}
              >
                {status.type === 'success' ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : status.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                ) : (
                  <RefreshCw className="h-4 w-4 shrink-0 text-indigo-400 animate-spin" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={status.type === 'testing'}
                className="flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-3 text-xs font-semibold text-indigo-300 transition-all hover:border-indigo-500/60 disabled:opacity-50"
                id="webhook-test-btn"
              >
                <Send className="h-3.5 w-3.5" />
                Send Test Embed
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-4 py-3 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/15"
                id="webhook-save-btn"
              >
                <Check className="h-4 w-4" />
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
