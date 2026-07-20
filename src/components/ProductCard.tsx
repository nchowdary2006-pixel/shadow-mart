import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star } from 'lucide-react';
import { formatUSD } from '../utils/webhook';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onQuickBuy }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isAppyFizz = product.id === 'appy-fizz';
  const isBhujiaSev = product.id === 'bhujia-sev';

  // Map product review counts from video for high fidelity
  const getReviewCount = (id: string) => {
    switch (id) {
      case 'redbull': return 120;
      case 'cheetos': return 105;
      case 'bauli': return 100;
      default: return 110;
    }
  };

  const cardClasses = isAppyFizz
    ? "group relative flex flex-col overflow-hidden rounded-2xl border-2 border-rose-500/80 bg-rose-950/20 p-3 sm:p-5 transition-all shadow-lg shadow-rose-500/20"
    : isBhujiaSev
    ? "group relative flex flex-col overflow-hidden rounded-2xl border-2 border-amber-500/80 bg-amber-950/20 p-3 sm:p-5 transition-all shadow-lg shadow-amber-500/20"
    : "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 transition-all hover:shadow-lg hover:border-slate-300";

  const imgContainerClasses = isAppyFizz
    ? "relative h-32 sm:h-48 w-full overflow-hidden rounded-xl bg-rose-950/40 flex items-center justify-center p-2 sm:p-4 mb-3 sm:mb-4 opacity-50 filter grayscale"
    : isBhujiaSev
    ? "relative h-32 sm:h-48 w-full overflow-hidden rounded-xl bg-amber-950/40 flex items-center justify-center p-2 sm:p-4 mb-3 sm:mb-4 opacity-50 filter grayscale"
    : `relative h-32 sm:h-48 w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center p-2 sm:p-4 mb-3 sm:mb-4 ${isOutOfStock ? 'opacity-60' : ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cardClasses}
      id={`product-card-${product.id}`}
    >
      {/* Product Image */}
      <div className={imgContainerClasses}>
        {product.isLimitedTimeOffer && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-rose-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full uppercase tracking-wider z-10">
            {product.offerPercentage}% Off
          </div>
        )}
        {isOutOfStock && (
          <div className={`absolute top-2 left-2 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full uppercase tracking-wider z-10 ${isAppyFizz ? 'bg-rose-600 animate-pulse' : isBhujiaSev ? 'bg-amber-600 animate-pulse' : 'bg-slate-800'}`}>
            Unavailable
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Category Name & Offer */}
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isAppyFizz ? 'text-rose-400' : isBhujiaSev ? 'text-amber-400' : 'text-slate-400'}`}>
          {product.category}
        </span>
        {product.isLimitedTimeOffer && (
          <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-500 animate-pulse hidden sm:inline">
            Limited!
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`text-xs sm:text-base font-bold tracking-tight mb-1 truncate ${isAppyFizz ? 'text-rose-200' : isBhujiaSev ? 'text-amber-200' : 'text-slate-800'}`}>
        {product.name}
      </h3>

      {/* Rating Stars & Reviews */}
      <div className="flex items-center gap-1 sm:gap-1.5 mb-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                i < 4 ? 'fill-amber-400 text-amber-400' : isAppyFizz ? 'text-rose-950/50' : isBhujiaSev ? 'text-amber-950/50' : 'text-slate-200'
              }`}
            />
          ))}
        </div>
        <span className={`text-[10px] sm:text-xs font-semibold font-sans ${isAppyFizz ? 'text-rose-400' : isBhujiaSev ? 'text-amber-400' : 'text-slate-500'}`}>
          ({getReviewCount(product.id)})
        </span>
      </div>

      {/* Price */}
      <div className={`text-sm sm:text-lg font-black font-sans mb-1 ${isAppyFizz ? 'text-rose-100' : isBhujiaSev ? 'text-amber-100' : 'text-slate-950'}`}>
        {formatUSD(product.price)}
      </div>

      {/* Qty Available */}
      <div className="text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4">
        {isOutOfStock ? (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${isAppyFizz ? 'bg-rose-500/10 text-rose-400' : isBhujiaSev ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Sold Out
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            isAppyFizz 
              ? 'bg-rose-500/10 text-rose-300' 
              : isBhujiaSev 
              ? 'bg-amber-500/10 text-amber-300' 
              : product.stock <= 2
              ? 'bg-amber-50 text-amber-700 border border-amber-100'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              product.stock <= 2 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
            }`}></span>
            {product.stock} In Stock
          </span>
        )}
      </div>

      {/* Action Add To Cart Button */}
      <button
        onClick={() => onAddToCart(product)}
        disabled={isOutOfStock}
        className={`mt-auto w-full rounded-xl py-2 sm:py-3 text-[10px] sm:text-xs font-black transition-colors shadow-sm disabled:cursor-not-allowed uppercase tracking-wider ${
          isAppyFizz
            ? 'bg-rose-950/80 border border-rose-800 text-rose-400 disabled:opacity-50'
            : isBhujiaSev
            ? 'bg-amber-950/80 border border-amber-800 text-amber-400 disabled:opacity-50'
            : 'bg-[#ffc107] hover:bg-[#e0a800] active:bg-[#c69500] disabled:bg-slate-100 disabled:text-slate-400 text-slate-900'
        }`}
        id={`add-to-cart-btn-${product.id}`}
      >
        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
      </button>
    </motion.div>
  );
}
