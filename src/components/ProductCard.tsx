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

  // Map product review counts from video for high fidelity
  const getReviewCount = (id: string) => {
    switch (id) {
      case 'redbull': return 120;
      case 'cheetos': return 105;
      case 'bauli': return 100;
      default: return 110;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg hover:border-slate-300"
      id={`product-card-${product.id}`}
    >
      {/* Product Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center p-4 mb-4">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Category Name */}
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
        {product.category}
      </span>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1 truncate">
        {product.name}
      </h3>

      {/* Rating Stars & Reviews */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-500 font-sans">
          ({getReviewCount(product.id)})
        </span>
      </div>

      {/* Price */}
      <div className="text-lg font-black text-slate-950 font-sans mb-1">
        {formatUSD(product.price)}
      </div>

      {/* Qty Available */}
      <div className="text-xs font-semibold text-emerald-600 mb-4">
        {isOutOfStock ? (
          <span className="text-rose-500 font-bold">Out of Stock</span>
        ) : (
          `Qty Available: ${product.stock} items`
        )}
      </div>

      {/* Action Add To Cart Button */}
      <button
        onClick={() => onAddToCart(product)}
        disabled={isOutOfStock}
        className="mt-auto w-full rounded-xl bg-[#ffc107] hover:bg-[#e0a800] active:bg-[#c69500] disabled:bg-slate-100 disabled:text-slate-400 py-3 text-xs font-black text-slate-900 transition-colors shadow-sm disabled:cursor-not-allowed uppercase tracking-wider"
        id={`add-to-cart-btn-${product.id}`}
      >
        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
      </button>
    </motion.div>
  );
}
