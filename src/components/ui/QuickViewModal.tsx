'use client';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Box } from 'lucide-react';
import Link from 'next/link';
import ModelView from '@/components/ar/ModelView';

export default function QuickViewModal() {
  const { activeQuickViewProduct, setQuickViewProduct, addToCart, setArProduct } = useStore();

  return (
    <AnimatePresence>
      {activeQuickViewProduct && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto max-w-4xl h-fit max-h-[90vh] bg-[#1a1a2e] border border-white/10 rounded-3xl z-[70] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
             <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

            {/* Left: Image/3D */}
            <div className="w-full md:w-1/2 bg-gray-900 relative h-[300px] md:h-auto">
               <ModelView color={activeQuickViewProduct.color} />
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <div className="mb-auto">
                <p className="text-primary text-sm uppercase tracking-widest font-bold mb-2">{activeQuickViewProduct.category}</p>
                <h2 className="text-3xl font-bold mb-4">{activeQuickViewProduct.name}</h2>
                <p className="text-2xl text-primary mb-6">${activeQuickViewProduct.price}</p>
                <p className="text-gray-400 leading-relaxed mb-8">
                  {activeQuickViewProduct.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button 
                  onClick={() => {
                    addToCart(activeQuickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} /> Add to Cart
                </button>
                <div className="flex gap-3">
                    <Link
                    href={`/product/${activeQuickViewProduct.id}`}
                    className="flex-1 glass-panel border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center"
                    >
                    Full Details
                    </Link>
                    <Link
                    href="/ar-viewer"
                    onClick={() => {
                        setArProduct(activeQuickViewProduct);
                        setQuickViewProduct(null);
                    }}
                    className="flex-1 glass-panel border border-primary/30 text-primary font-bold py-3 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                    >
                    <Box size={20} /> AR View
                    </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}