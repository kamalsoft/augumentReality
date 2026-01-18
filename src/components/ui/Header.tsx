'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ShoppingBag, Box } from 'lucide-react';

export default function Header() {
  const { cart, toggleCart } = useStore();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wider">
          <Box className="text-primary" />
          <span>AR<span className="text-gray-400">VISION</span></span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-primary transition-colors">Catalog</Link>
          <Link href="/favorites" className="hover:text-primary transition-colors">Favorites</Link>
          <Link href="/ar-viewer" className="hover:text-primary transition-colors">AR Studio</Link>
        </nav>

        <button 
          onClick={() => toggleCart(true)}
          className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ShoppingBag size={20} />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </motion.header>
  );
}