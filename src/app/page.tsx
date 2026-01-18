'use client';
import { products } from '@/lib/data';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import QuickViewModal from '@/components/ui/QuickViewModal';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <QuickViewModal />
      <section className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Living</span>
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Experience furniture in your space before you buy. 
          Augmented Reality visualization for the modern home.
        </p>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search furniture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-64 glass-panel p-6 rounded-2xl sticky top-24 z-10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Filter size={20} className="text-primary" /> Categories
          </h3>
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                className={`
                  px-4 py-2 rounded-lg text-left transition-all whitespace-nowrap
                  ${(selectedCategory === category) || (category === 'All' && !selectedCategory)
                    ? 'bg-primary text-black font-bold' 
                    : 'hover:bg-white/10 text-gray-400 hover:text-white'}
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product, i) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={i} 
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
                No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}