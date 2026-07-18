import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  CupSoda,
  Cookie,
  PenTool,
  Search,
  Settings,
  ShoppingCart,
  Zap,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Github,
  Bell,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Product, CartItem, Review, WebhookSettings } from './types';
import { CATEGORIES, INITIAL_PRODUCTS, INITIAL_REVIEWS } from './data';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import WebhookConfig from './components/WebhookConfig';
import ReviewsSection from './components/ReviewsSection';
import FaqSection from './components/FaqSection';
import { motion, AnimatePresence } from 'motion/react';
import { isPlaceholderUrl } from './utils/webhook';

const LOCAL_STORAGE_WEBHOOK_KEY = 'shadows_mart_webhook_settings';

export default function App() {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter state
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Webhook settings state
  const [webhookSettings, setWebhookSettings] = useState<WebhookSettings>({
    url: '',
    botName: 'Shadows Mart Bot',
    botAvatar: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200',
    embedColor: '#4f46e5', // Indigo color for the theme
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverConfigured, setServerConfigured] = useState(false);

  // Live activity feed for Sidebar
  const [liveActivity, setLiveActivity] = useState([
    { id: '1', user: 'User_728', item: 'Netflix UHD (1 Month)', timeAgo: '2 minutes ago' },
    { id: '2', user: 'Kryptic', item: 'Discord Nitro Boost', timeAgo: '14 minutes ago' },
    { id: '3', user: 'vortex_god', item: '2016 Roblox Account', timeAgo: '28 minutes ago' }
  ]);

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Load webhook settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_WEBHOOK_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Force indigo as default embed color for professional polish if it is empty or purple
        if (parsed.embedColor === '#7c3aed') {
          parsed.embedColor = '#4f46e5';
        }
        setWebhookSettings(parsed);
      } catch (err) {
        console.error('Failed to parse local storage webhook settings:', err);
      }
    }

    // Check if the server already has a Discord Webhook configured in .env
    fetch('/api/webhook-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.configuredOnServer) {
          setServerConfigured(true);
        }
      })
      .catch((err) => console.warn('Failed to fetch server webhook status:', err));
  }, []);

  // Periodic update of live activities to make sidebar incredibly alive!
  useEffect(() => {
    const users = ['alpha_gamer', 'nexus_prime', 'shadow_hustler', 'cyber_ghost', 'neon_rider', 'krypton_99', 'renegade_0', 'pixel_pioneer', 'glitch_matrix'];
    const items = ['Spotify Premium (1 Month)', 'Netflix UHD Account', 'Discord Nitro (3 Month Promo)', 'Steam ₹1,500 Wallet Card', 'Valorant 1000 VP Code', '2016 Roblox registration badged account'];
    
    const interval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setLiveActivity(prev => [
        { id: Date.now().toString(), user: randomUser, item: randomItem, timeAgo: 'Just now' },
        ...prev.slice(0, 2).map(act => {
          if (act.timeAgo === 'Just now') return { ...act, timeAgo: '1 minute ago' };
          if (act.timeAgo.includes('minute')) {
            const mins = parseInt(act.timeAgo);
            return { ...act, timeAgo: `${mins + 1} minutes ago` };
          }
          return act;
        })
      ]);
    }, 20000); // add a new purchase every 20 seconds

    return () => clearInterval(interval);
  }, []);

  // Save webhook settings helper
  const handleSaveWebhookSettings = (newSettings: WebhookSettings) => {
    setWebhookSettings(newSettings);
    localStorage.setItem(LOCAL_STORAGE_WEBHOOK_KEY, JSON.stringify(newSettings));
  };

  const handleOpenAdminPanel = () => {
    if (isAdminUnlocked) {
      setIsConfigOpen(true);
    } else {
      setIsPasswordModalOpen(true);
      setAdminPasswordInput('');
      setPasswordError('');
    }
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === '2006') {
      setIsAdminUnlocked(true);
      setIsPasswordModalOpen(false);
      setIsConfigOpen(true);
      setAdminPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Invalid admin password. Access denied.');
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prevCart;
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleQuickBuy = (product: Product) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // Webhook Tester for Sidebar
  const handleTestConnection = async () => {
    if (testStatus === 'testing') return;
    if (!webhookSettings.url && !serverConfigured) {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3000);
      handleOpenAdminPanel(); // Open settings to configure it
      return;
    }

    setTestStatus('testing');
    
    const testPayload = {
      username: webhookSettings.botName || 'Shadows Mart Bot',
      avatar_url: webhookSettings.botAvatar || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200',
      embeds: [
        {
          title: '⚡ Shadows Mart - Sidebar verified!',
          description: 'Connection ping test executed successfully from the **Shadows Mart Left Sidebar**!',
          color: 5195245, // Indigo color #4f46e5 in decimal
          fields: [
            { name: 'Server Status', value: '🟢 Operational', inline: true },
            { name: 'Active Theme', value: '✨ Professional Polish', inline: true },
            { name: 'Integrations', value: 'Vercel, Node, and Discord API ready', inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    try {
      const response = await fetch('/api/send-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customWebhookUrl: webhookSettings.url,
          payload: testPayload
        })
      });
      const data = await response.json();
      if (data.success) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch {
      setTestStatus('error');
    }
    
    setTimeout(() => {
      setTestStatus('idle');
    }, 3000);
  };

  // Get total quantity in cart
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products based on search & active category
  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Category Icon renderer
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className="h-4 w-4" />;
      case 'CupSoda':
        return <CupSoda className="h-4 w-4" />;
      case 'Cookie':
        return <Cookie className="h-4 w-4" />;
      case 'PenTool':
        return <PenTool className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  // Webhook configuration status indicator badge
  const isWebhookConnected = (!!webhookSettings.url && !isPlaceholderUrl(webhookSettings.url)) || serverConfigured;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-600/30 selection:text-indigo-300 flex flex-col overflow-x-hidden" id="app-root-container">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Colored Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-slate-900/20 blur-[100px] pointer-events-none" />

      {/* Professional Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900 flex-shrink-0" id="store-header">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white uppercase font-sans">
              SHADOWS<span className="text-indigo-500 font-black">MART</span>
              <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 align-middle normal-case font-mono">v5</span>
            </span>
          </div>

          {/* Webhook connection indicator & Config & Basket Actions */}
          <div className="flex items-center gap-3">
            {/* Discord webhook status badge */}
            <div
              onClick={handleOpenAdminPanel}
              className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 text-[10px] font-mono uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors"
              title="Click to configure Discord integrations"
              id="header-webhook-status-badge"
            >
              <span className={`relative flex h-2 w-2`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isWebhookConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isWebhookConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </span>
              <span className="text-slate-200">
                Webhook: {isWebhookConnected ? 'Active' : 'Offline'}
              </span>
            </div>

            {/* Admin Panel button (replaces config icon with cleaner styling) */}
            <button
              onClick={handleOpenAdminPanel}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-indigo-500/15"
              id="config-trigger-btn"
            >
              Admin Panel
            </button>

            {/* Shopping Basket Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-1.5 text-xs font-bold text-white transition-all"
              id="header-cart-btn"
            >
              <ShoppingCart className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-black text-white font-mono">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Structural Layout (Sidebar + Content Panel) */}
      <div className="flex-1 flex overflow-hidden max-w-[1400px] w-full mx-auto" id="store-main-layout">
        
        {/* Left Sidebar - Hidden on mobile, beautiful on desktop */}
        <aside className="hidden lg:flex w-64 bg-slate-900/40 border-r border-slate-800/80 p-6 flex-col gap-8 flex-shrink-0 overflow-y-auto">
          {/* Categories Sidebar List */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Categories</h3>
            <ul className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-slate-800 text-white border border-slate-700/80 shadow-sm shadow-indigo-500/5'
                          : 'text-slate-400 hover:bg-slate-800/30 hover:text-white border border-transparent'
                      }`}
                      id={`sidebar-cat-btn-${cat.id}`}
                    >
                      <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                        {renderCategoryIcon(cat.icon)}
                      </span>
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Live Activity Feed */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Live Activity</h3>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {liveActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="text-xs flex flex-col gap-0.5 border-l-2 border-indigo-500/20 pl-3 py-0.5"
                  >
                    <span className="text-slate-300 font-medium">{activity.user} purchased</span>
                    <span className="text-indigo-400 font-semibold text-[11px]">{activity.item}</span>
                    <span className="text-slate-500 text-[10px]">{activity.timeAgo}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Discord Webhook Status Quick Card */}
          <div className="mt-auto p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Discord Webhook</p>
            <code className="text-[9px] block truncate text-slate-400 bg-black/40 p-2 rounded border border-slate-800">
              {webhookSettings.url || (serverConfigured ? 'env.DISCORD_WEBHOOK_URL' : 'https://discord.com/api/webhooks/12345...')}
            </code>
            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="w-full text-[9px] font-bold uppercase tracking-widest py-1.5 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors disabled:opacity-50"
            >
              {testStatus === 'testing' ? 'Testing...' : testStatus === 'success' ? '⚡ Connected!' : testStatus === 'error' ? '❌ Config Error' : 'Test Connection'}
            </button>
          </div>
        </aside>

        {/* Right Panel - Scrollable Content Area */}
        <section className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-950 flex flex-col gap-8">
          
          {/* Notification Alerts */}
          <AnimatePresence>
            {!isWebhookConnected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-rose-500/20 bg-rose-950/15 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                id="webhook-alert-banner"
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Bell className="h-5 w-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Discord Integration Recommended!</h3>
                    <p className="text-xs text-rose-300/80 mt-1 max-w-2xl leading-relaxed">
                      This shadows-mart clone features real, interactive Discord Webhook connectivity. Link your Discord channel to instantly receive gorgeously formatted rich embeds for purchase receipts, custom support tickets, and star ratings!
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleOpenAdminPanel}
                  className="shrink-0 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white transition-colors border border-rose-500"
                  id="alert-banner-config-btn"
                >
                  Configure Webhook
                </button>
              </motion.div>
            )}


          </AnimatePresence>


          <section className="space-y-6" id="marketplace-browser-section">
            
            {/* Title Block */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Daily Groceries & Essentials</h1>
                <p className="text-xs text-slate-400 mt-1">Superfast home delivery with live Discord webhook logs</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-medium text-slate-400">
                  Sorted by: <span className="text-white">Popularity</span>
                </span>
              </div>
            </div>

            {/* Controls Bar: Search & Category Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              
              {/* Category horizontal selector scrollable - Visible ONLY on mobile so mobile users can still search categories! */}
              <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none" id="category-filter-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap border ${
                      activeCategory === cat.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/15'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                    id={`cat-btn-${cat.id}`}
                  >
                    {renderCategoryIcon(cat.icon)}
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Live Search Input */}
              <div className="relative w-full md:w-80" id="search-input-wrapper">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drinks, snacks, stationery..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none"
                  id="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                    id="search-clear-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" id="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickBuy={handleQuickBuy}
                  />
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-slate-500 space-y-2" id="no-products-state">
                  <HelpCircle className="h-8 w-8 mx-auto text-slate-600" />
                  <h4 className="text-slate-300 font-bold text-sm">No items match your criteria</h4>
                  <p className="text-xs max-w-xs mx-auto">Try checking your spelling or selection category to locate matching grocery items.</p>
                </div>
              )}
            </div>
          </section>

          {/* REVIEWS & FAQ DOUBLE ROW */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4" id="reviews-faq-section-row">
            <div className="lg:col-span-2">
              <ReviewsSection
                reviews={reviews}
                onAddReview={handleAddReview}
                webhookSettings={webhookSettings}
              />
            </div>
            <div>
              <FaqSection />
            </div>
          </section>
        </section>
      </div>

      {/* FOOTER STATUS BAR - Pure Professional Polish layout */}
      <footer className="h-8 bg-indigo-600 flex items-center justify-between px-6 flex-shrink-0 text-[10px] text-white font-semibold shadow-inner" id="store-footer">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-[10px] text-white font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            Server Status: Online
          </div>
          <div className="hidden sm:block text-[10px] text-indigo-100 uppercase tracking-widest">Total Sales: 14,204</div>
        </div>
        <div className="text-[10px] text-indigo-100 italic">
          Integration provided by Shadows Mart Deploy Engine v1.0.4
        </div>
      </footer>

      {/* ADMIN PASSWORD DIALOG */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              id="password-modal-backdrop"
            />

            {/* Content Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-indigo-500/5"
              id="admin-password-modal"
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 left-0 h-1 w-full bg-indigo-600" />

              <div className="flex justify-end">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  id="password-close-btn"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col items-center text-center pb-2">
                <div className="h-12 w-12 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white">Admin Authentication</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Access to the Webhook Config panel is restricted. Please enter the passcode to proceed.
                </p>
              </div>

              <form onSubmit={handleVerifyPassword} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <label htmlFor="admin-passcode-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Enter Passcode
                  </label>
                  <input
                    id="admin-passcode-input"
                    type="password"
                    placeholder="••••"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    autoFocus
                    className="w-full text-center text-xl font-mono tracking-[0.5em] rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-700 transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-rose-500 font-medium text-center"
                    id="password-error-msg"
                  >
                    {passwordError}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 py-3 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/15"
                  id="password-submit-btn"
                >
                  Verify & Access
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WEBHOOK CUSTOMIZER DIALOG */}
      <WebhookConfig
        settings={webhookSettings}
        onSave={handleSaveWebhookSettings}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

      {/* SHOPPING CART OVERLAY DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        webhookSettings={webhookSettings}
      />
    </div>
  );
}
