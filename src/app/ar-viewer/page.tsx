'use client';
import ARCanvas from '@/components/ar/ARCanvas';
import SceneSelect from '@/components/ar/SceneSelect';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function ARPage() {
  const { activeArProduct, isCinematicMode } = useStore();

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <ARCanvas />

      {/* UI Overlay */}
      {!isCinematicMode && (
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
          <div className="glass-panel px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-gray-300">
              {activeArProduct ? `Placing: ${activeArProduct.name}` : 'Select a product from catalog'}
            </span>
          </div>
          <Link href="/" className="p-3 glass-panel rounded-full hover:bg-white/10">
            <X size={24} />
          </Link>
        </div>
      )}

      {!isCinematicMode && <SceneSelect />}
    </div>
  );
}