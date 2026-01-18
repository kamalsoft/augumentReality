'use client';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, addToCart } = useStore();
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a1a2e] border-l border-white/10 z-50 p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light">Your Cart</h2>
              <button onClick={() => toggleCart(false)} className="p-2 hover:bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 h-[60vh]">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center glass-panel p-4 rounded-xl">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-primary">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeFromCart(item.id)}><Minus size={16} /></button>
                      <span className="text-sm">{item.quantity}</span>
                      <button onClick={() => addToCart(item)}><Plus size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#1a1a2e] border-t border-white/10">
              <div className="flex justify-between text-xl mb-4">
                <span>Total</span>
                <span className="font-bold text-primary">${total}</span>
              </div>
              <button className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors">
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}