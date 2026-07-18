import React, { useState } from 'react';
import { Star, MessageSquareCode, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { Review, WebhookSettings } from '../types';
import { sendDiscordWebhook, getReviewPayload } from '../utils/webhook';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
  webhookSettings: WebhookSettings;
}

export default function ReviewsSection({ reviews, onAddReview, webhookSettings }: ReviewsSectionProps) {
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [productName, setProductName] = useState('RedBull');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const PRODUCTS_TO_RATE = [
    'RedBull',
    'Cheetos',
    'Bauli Moonfils Croissant',
    'Fizz',
    'fevicol',
    'pen blue',
    'pen black',
    'Britannia Milk Bikis',
    "Haldiram's Bhujia Sev",
    'Cadbury Chocobakes',
  ];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !comment) {
      setErrorMsg('Please enter your username and write a review.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const newReview: Review = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      comment,
      rating,
      productName,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      verified: true,
    };

    const payload = getReviewPayload(webhookSettings, newReview, window.location.href);
    const result = await sendDiscordWebhook(webhookSettings, payload);

    if (result.success) {
      setStatus('success');
      onAddReview(newReview);
      setUsername('');
      setComment('');
      setRating(5);
    } else {
      setErrorMsg(result.error || 'Failed to send review to Discord.');
      setStatus('error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="reviews-section-grid">
      {/* Review list */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white font-sans">Recent Customers Reviews</h2>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2" id="reviews-list-container">
          {reviews.map((rev) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={rev.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">{rev.username}</span>
                  <span className="mx-1.5 text-slate-600 text-xs">•</span>
                  <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Product Badge */}
              <span className="inline-block rounded bg-slate-950 px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 border border-slate-800">
                📦 {rev.productName}
              </span>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>

              {rev.verified && (
                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest absolute bottom-4 right-4">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Buyer
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Review Submission form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 h-fit" id="write-review-form-container">
        {status === 'success' ? (
          <div className="text-center py-8 space-y-3" id="review-success-state">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Review Added & Logged!</h3>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              Your verified purchaser review has been added locally and broadcasted as a beautiful Discord star-embed in the server owner's channel!
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 rounded-xl bg-slate-950 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-800"
            >
              Write Another Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4" id="review-submission-form">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                Customer Voice
              </span>
              <h3 className="text-base font-bold text-white mt-1">Submit Your Feedback</h3>
              <p className="text-slate-500 text-xs mt-1">
                Your star ratings and descriptions are securely relayed to our Discord Webhook logging platform.
              </p>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Your Alias</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Aarav99"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                id="review-username-input"
              />
            </div>

            {/* Star Rating Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">Rating Score</label>
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform active:scale-125"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700 hover:text-amber-500/50'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Product Purchased</label>
              <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                id="review-product-select"
              >
                {PRODUCTS_TO_RATE.map((prod) => (
                  <option key={prod} value={prod} className="bg-slate-950">
                    {prod}
                  </option>
                ))}
              </select>
            </div>

            {/* Comments */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Review Comment</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How fresh was the product? Did your delivery arrive superfast?"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
                id="review-comment-textarea"
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] text-red-400 border-l-2 border-red-500 pl-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 py-3 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/15 disabled:opacity-50"
              id="review-submit-btn"
            >
              {status === 'submitting' ? 'Posting to Discord...' : 'Submit Verified Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
