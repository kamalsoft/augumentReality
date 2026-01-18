'use client';
import { useParams } from 'next/navigation';
import { products } from '@/lib/data';
import { useStore } from '@/lib/store';
import ModelView from '@/components/ar/ModelView';
import { motion } from 'framer-motion';
import { ShoppingBag, Box, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, setArProduct } = useStore();
  const product = products.find(p => p.id === id);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
        <ArrowLeft size={20} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[70vh]">
        {/* Left: 3D Preview */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-3xl overflow-hidden relative"
        >
          <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur px-3 py-1 rounded-full text-xs text-white/70">
            Interactive 3D Preview
          </div>
          <ModelView color={product.color} />
        </motion.div>

        {/* Right: Details */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-primary mb-8">${product.price}</p>
          <p className="text-gray-400 leading-relaxed mb-10 text-lg">
            {product.description}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
            <Link
              href="/ar-viewer"
              onClick={() => setArProduct(product)}
              className="flex-1 glass-panel border border-primary/30 text-primary font-bold py-4 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <Box size={20} /> View in Room
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}