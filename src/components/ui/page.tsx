'use client';
import { products } from '@/lib/data';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useStore();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Your Favorites</h1>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-6">No favorites yet.</p>
          <Link href="/" className="text-primary hover:underline">Browse Catalog</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteProducts.map((product, i) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={i} 
            />
          ))}
        </div>
      )}
    </main>
  );
}