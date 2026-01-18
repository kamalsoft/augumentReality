'use client';
import { motion } from 'framer-motion';
import { scenes } from '@/lib/data';
import { useStore } from '@/lib/store';
import { SceneType } from '@/lib/types';

export default function SceneSelect() {
  const { activeScene, setScene } = useStore();

  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20 px-6 overflow-x-auto">
      {Object.keys(scenes).map((sceneKey) => (
        <motion.button
          key={sceneKey}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setScene(sceneKey as SceneType)}
          className={`
            relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all
            ${activeScene === sceneKey ? 'border-primary' : 'border-transparent opacity-70'}
          `}
        >
          <img 
            src={scenes[sceneKey]} 
            alt={sceneKey} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-[10px] uppercase font-bold tracking-wider">{sceneKey}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}