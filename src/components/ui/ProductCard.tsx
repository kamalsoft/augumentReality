'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Box, Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { setArProduct, favorites, toggleFavorite, setQuickViewProduct } = useStore();
  const isFavorite = favorites.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative glass-panel rounded-2xl overflow-hidden"
    >
      <div className="aspect-square relative overflow-hidden bg-gray-900">
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <Heart 
            size={20} 
            className={isFavorite ? "fill-primary text-primary" : "text-white"} 
          />
        </button>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={() => setQuickViewProduct(product)}
            className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-primary transition-colors"
          >
            Quick View
          </button>
          <Link
            href="/ar-viewer"
            onClick={() => setArProduct(product)}
            className="bg-black/50 backdrop-blur text-white px-4 py-2 rounded-full hover:bg-black transition-colors flex items-center gap-2"
          >
            <Box size={16} /> AR View
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-primary text-xs uppercase tracking-widest font-bold mb-1">{product.category}</p>
            <h3 className="text-xl font-medium">{product.name}</h3>
          </div>
          <span className="text-lg font-light">${product.price}</span>
        </div>
      </div>
    </motion.div>
  );
}