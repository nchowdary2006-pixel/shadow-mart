import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, HeartCrack, Sparkles, ShoppingCart } from 'lucide-react';
import { CartItem, OrderDetails, WebhookSettings } from '../types';
import { formatUSD, sendDiscordWebhook, getOrderPayload, isPlaceholderUrl } from '../utils/webhook';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  webhookSettings: WebhookSettings;
  addNotification: (message: string) => void;
}

export const COUPON_DISCOUNTS: Record<string, number> = {
  'HAPPY26': 1,
  'BOSS23': 1,
  'PEC28': 1,
  'GET1OFF': 1,
  'CSE28': 1,
  'GOD28': 3.00,
  'CHENCHU23': 15.00,
  'FREEON49': 5.00,
  'ADDMOREGET20': 4.00,
  'GETMORE47': 1.50,
};

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  webhookSettings,
  addNotification,
}: CartDrawerProps) {
  const [email, setEmail] = useState('');
  const [discordTag, setDiscordTag] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [lastOrderId, setLastOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [webhookSelection, setWebhookSelection] = useState<'default' | 'custom'>(() => {
    if (webhookSettings.url && !isPlaceholderUrl(webhookSettings.url) && webhookSettings.url !== 'https://discord.com/api/webhooks/1527920468399493152/GwofHZ9iiZPtu2lcO4G-iFAJjXM69t3uD4_kr5vDoJCqTjztGWcMO0Y0SghMkdgyuKbX') {
      return 'custom';
    }
    return 'default';
  });

  const [customWebhookUrl, setCustomWebhookUrl] = useState(webhookSettings.url || '');

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [usedCoupons, setUsedCoupons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('used_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = paymentMethod.includes('OFF') ? subtotal * 0.05 : 0;
  const couponDiscount = appliedCoupon ? (COUPON_DISCOUNTS[appliedCoupon] || 1) : 0;
  const totalBeforeDelivery = Math.max(0, subtotal - discount - couponDiscount);

  let deliveryFee = 0;
  if (paymentMethod === 'Cash on Delivery' && cartItems.length > 0) {
    if (totalBeforeDelivery >= 49) {
      deliveryFee = 0;
    } else if (totalBeforeDelivery >= 39) {
      deliveryFee = 10;
    } else {
      deliveryFee = 8;
    }
  }

  const total = totalBeforeDelivery + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!email || !discordTag || !roomNumber || !phoneNumber) {
      setErrorMessage('Please fill in all delivery details including Phone Number.');
      setStatus('error');
      return;
    }

    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setErrorMessage('Phone number must be exactly 10 digits.');
      setStatus('error');
      return;
    }

    if (webhookSelection === 'custom' && !customWebhookUrl) {
      setErrorMessage('Please enter a custom Discord Webhook URL or select the default option.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Generate random 6-character uppercase order ID
    const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setLastOrderId(orderId);

    const orderDetails: OrderDetails = {
      orderId,
      email,
      discordTag,
      roomNumber,
      phoneNumber,
      paymentMethod,
      items: cartItems,
      total,
    };

    const activeWebhookUrl = webhookSelection === 'default'
      ? 'https://discord.com/api/webhooks/1527920468399493152/GwofHZ9iiZPtu2lcO4G-iFAJjXM69t3uD4_kr5vDoJCqTjztGWcMO0Y0SghMkdgyuKbX'
      : customWebhookUrl;

    const activeWebhookSettings = {
      ...webhookSettings,
      url: activeWebhookUrl,
    };

    // Construct Discord Embed Payload
    const payload = getOrderPayload(activeWebhookSettings, orderDetails, window.location.href);

    // Send to Webhook
    const result = await sendDiscordWebhook(activeWebhookSettings, payload);

    if (result.success) {
      if (appliedCoupon) {
        const updatedUsed = [...usedCoupons, appliedCoupon];
        setUsedCoupons(updatedUsed);
        try {
          localStorage.setItem('used_coupons', JSON.stringify(updatedUsed));
        } catch (err) {
          console.error('Failed to save used coupons to localStorage:', err);
        }
        setAppliedCoupon(null);
        setCouponInput('');
      }
      setStatus('success');
      onClearCart();
      setEmail('');
      setDiscordTag('');
      setRoomNumber('');
      setPhoneNumber('');
      addNotification('Order placed successfully!');
    } else {
      setErrorMessage(result.error || 'Failed to process order or webhook dispatch.');
      setStatus('error');
    }
  };

  const PAYMENT_METHODS = [
    'Cash on Delivery',
    'Collect at the Mart',
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          id="cart-backdrop"
        />

        {/* Drawer Slide-in */}
        <div className="absolute inset-y-0 right-0 pl-0 sm:pl-10 max-w-full flex">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col relative"
            id="cart-drawer-panel"
          >
            {/* Top Bar Accent Glow */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-600 to-indigo-400" />

            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">Shopping Cart</h2>
                <span className="rounded-full bg-indigo-950 px-2 py-0.5 text-xs text-indigo-300 border border-indigo-800/30 font-bold">
                  {cartItems.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                id="cart-close-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {status === 'success' ? (
                /* ORDER SUCCESS COMPONENT */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8"
                  id="checkout-success-container"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    Your purchase has been recorded under Order ID:
                  </p>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 font-mono text-indigo-400 font-bold tracking-widest text-lg">
                    #{lastOrderId}
                  </div>
                  <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                    We've instantly dispatched a rich, customized invoice embed directly to the administrator's{' '}
                    <strong className="text-indigo-400">Discord channel</strong> via our webhook engine! Delivery details will follow shortly in your Discord DM.
                  </p>

                  {/* Confirmation email note */}
                  <div className="bg-red-950/30 p-3 rounded-lg text-[10px] text-red-100 border border-red-700/50 w-full max-w-xs">
                    <p>
                      <strong>Note:</strong> The confirmation email will be sent to you within 20 to 40 minutes. 
                      Please check your email; all order details will be sent there. 
                      For any help, please contact <strong>feedback support</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setStatus('idle');
                      onClose();
                    }}
                    className="w-full mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 py-3 text-sm font-bold text-white transition-all shadow-md shadow-indigo-600/10"
                    id="success-continue-btn"
                  >
                    Return to Store
                  </button>
                </motion.div>
              ) : cartItems.length === 0 ? (
                /* EMPTY STATE */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16" id="empty-cart-state">
                  <div className="h-14 w-14 rounded-full bg-slate-950 flex items-center justify-center text-slate-500">
                    <HeartCrack className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                  <p className="text-slate-500 text-xs max-w-xs">
                    Browse our premium gaming assets and add items to your cart to begin your checkout.
                  </p>
                  <button
                    onClick={onClose}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-300 border border-slate-700"
                    id="empty-cart-back-btn"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                /* CART LIST & CHECKOUT FORM */
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4" id="cart-items-list">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Review Items
                    </span>
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-3 rounded-xl border border-slate-800 bg-slate-950/60 relative group overflow-hidden"
                      >
                        <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {formatUSD(item.product.price)} each
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="rounded bg-slate-850 p-1 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
                              id={`minus-qty-btn-${item.product.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-300 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="rounded bg-slate-850 p-1 text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
                              id={`plus-qty-btn-${item.product.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="absolute right-3 top-3 text-slate-600 hover:text-red-400 transition-colors"
                          title="Remove item"
                          id={`remove-cart-item-btn-${item.product.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Checkout Information Form */}
                  <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-800" id="checkout-form">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Delivery details
                    </span>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          id="checkout-email-input"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) {
                              setPhoneNumber(val);
                            }
                          }}
                          placeholder="9846xxxx65"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          minLength={10}
                          className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          id="checkout-phone-input"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={discordTag}
                          onChange={(e) => setDiscordTag(e.target.value)}
                          placeholder="shadow_purchases"
                          className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          id="checkout-discord-input"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Required to verify buyer credentials and trigger DM delivery.
                        </p>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Room Number
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="305"
                          className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          id="checkout-room-number-input"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" id="checkout-webhook-label">
                          Discord Webhook Channel
                        </label>
                        <select
                          value={webhookSelection}
                          onChange={(e) => setWebhookSelection(e.target.value as 'default' | 'custom')}
                          className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none text-slate-200"
                          id="checkout-webhook-select"
                        >
                          <option value="default" className="bg-slate-950 text-white">
                            Default Webhook (GwofHZ9iiZP...)
                          </option>
                          <option value="custom" className="bg-slate-950 text-white">
                            Custom Webhook URL
                          </option>
                        </select>
                        <p className="mt-2 text-[10px] bg-red-950/30 border border-red-500/40 text-red-200 px-2.5 py-1.5 rounded-lg leading-normal">
                          <strong>Note:</strong> do Not change the Webhook link if you change the link the order will be not be received to administrator
                        </p>
                      </div>

                      {webhookSelection === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-1"
                        >
                          <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                            Custom Webhook URL
                          </label>
                          <input
                            type="text"
                            value={customWebhookUrl}
                            onChange={(e) => setCustomWebhookUrl(e.target.value)}
                            placeholder="https://discord.com/api/webhooks/..."
                            className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                            id="checkout-custom-webhook-input"
                          />
                        </motion.div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none text-slate-200"
                          id="checkout-payment-select"
                        >
                          {PAYMENT_METHODS.map((method) => (
                            <option key={method} value={method} className="bg-slate-950 text-white">
                              {method}
                            </option>
                          ))}
                        </select>

                        <AnimatePresence>
                          {paymentMethod === 'Cash on Delivery' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2">
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5 shadow-lg shadow-amber-500/5">
                                  <span className="text-base leading-none">📍</span>
                                  <div>
                                    <strong className="block text-amber-300 font-bold mb-0.5">Delivery Notice</strong>
                                    the mart address will sent on email within 5 to 10 minutes
                                  </div>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200 flex items-start gap-2.5 shadow-lg shadow-emerald-500/5" id="free-delivery-note">
                                  <span className="text-base leading-none">🚚</span>
                                  <div>
                                    <strong className="block text-emerald-300 font-bold mb-0.5">Delivery Promotion</strong>
                                    Buy Above 49.00 Free Delivery
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Coupon Code Input */}
                      <div id="checkout-coupon-container" className="pt-2 border-t border-slate-850">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Apply Coupon Code
                        </label>
                        <div className="flex gap-2 mt-1.5">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value);
                              setCouponError('');
                            }}
                            placeholder="Enter Code"
                            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none uppercase font-mono"
                            id="checkout-coupon-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const code = couponInput.trim().toUpperCase();
                              const validCodes = Object.keys(COUPON_DISCOUNTS);
                              if (usedCoupons.includes(code)) {
                                setCouponError('This coupon code has already been used');
                                setAppliedCoupon(null);
                              } else if (validCodes.includes(code)) {
                                setAppliedCoupon(code);
                                setCouponError('');
                                const discountAmount = COUPON_DISCOUNTS[code] || 1;
                                addNotification(`Coupon ${code} applied successfully (-${formatUSD(discountAmount)})!`);
                              } else {
                                setCouponError('Invalid coupon code');
                                setAppliedCoupon(null);
                              }
                            }}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
                            id="apply-coupon-btn"
                          >
                            Apply
                          </button>
                        </div>
                        {appliedCoupon && (
                          <div className="flex items-center justify-between mt-2 px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-400 animate-fadeIn" id="coupon-applied-badge">
                            <span>Code <strong>{appliedCoupon}</strong> active (-{formatUSD(COUPON_DISCOUNTS[appliedCoupon] || 1)} discount)</span>
                            <button
                              type="button"
                              onClick={() => {
                                setAppliedCoupon(null);
                                setCouponInput('');
                                addNotification('Coupon removed');
                              }}
                              className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                        {couponError && (
                          <p className="mt-1.5 text-[10px] text-red-400 font-medium animate-shake" id="coupon-error-message">
                            {couponError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Summary billing box */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2 mt-4 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatUSD(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Promo Discount (LTC 5%)</span>
                          <span className="font-mono">-{formatUSD(discount)}</span>
                        </div>
                      )}
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400" id="coupon-discount-row">
                          <span>Coupon Discount (-{formatUSD(couponDiscount)})</span>
                          <span className="font-mono">-{formatUSD(couponDiscount)}</span>
                        </div>
                      )}
                      {paymentMethod === 'Cash on Delivery' && cartItems.length > 0 && (
                        <div className="flex justify-between text-amber-400" id="delivery-fee-row">
                          <span>Cash on Delivery Handling Fee</span>
                          <span className="font-mono">
                            {deliveryFee > 0 ? `+${formatUSD(deliveryFee)}` : (
                              <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-400">
                        <span>Gateway Processing</span>
                        <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-sm border-t border-slate-800 pt-2 mt-1">
                        <span>Total Amount</span>
                        <span className="text-indigo-400 font-mono">{formatUSD(total)}</span>
                      </div>
                    </div>

                    {/* Discord notification disclaimer */}
                    <div className="flex items-center gap-2 rounded-lg bg-indigo-950/20 border border-indigo-900/20 p-2.5 text-[10px] text-indigo-300">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                      <span>
                        Completing checkout instantly logs an invoice inside our Discord Channel!
                      </span>
                    </div>

                    {errorMessage && (
                      <p className="text-[11px] text-red-400 border-l-2 border-red-500 pl-2">
                        {errorMessage}
                      </p>
                    )}

                    {/* Actions */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 py-3 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/15 disabled:opacity-50"
                      id="place-order-btn"
                    >
                      {status === 'submitting' ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing Secure Order...
                        </span>
                      ) : (
                        <>
                          Complete Secure Purchase
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>

                    {/* Confirmation email note */}
                    <div className="bg-red-950/30 p-3 rounded-lg text-[10px] text-red-100 border border-red-700/50">
                      <p>
                        <strong>Note:</strong> The confirmation email will be sent to you within 20 to 40 minutes. 
                        Please check your email; all order details will be sent there. 
                        For any help, please contact <strong>feedback support</strong>.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
