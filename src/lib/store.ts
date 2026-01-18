import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, SceneType } from './types';

export interface SavedDesign {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  color: string;
  scene: SceneType;
  timestamp: number;
}

interface AppState {
  cart: CartItem[];
  favorites: string[];
  savedDesigns: SavedDesign[];
  isCartOpen: boolean;
  isCinematicMode: boolean;
  activeArProduct: Product | null;
  activeQuickViewProduct: Product | null;
  compareProduct: Product | null;
  activeScene: SceneType;
  
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  toggleCart: (isOpen?: boolean) => void;
  saveDesign: (design: SavedDesign) => void;
  removeDesign: (id: string) => void;
  setArProduct: (product: Product | null) => void;
  setCompareProduct: (product: Product | null) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setScene: (scene: SceneType) => void;
  toggleFavorite: (id: string) => void;
  setCinematicMode: (enabled: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      savedDesigns: [],
      isCartOpen: false,
      isCinematicMode: false,
      activeArProduct: null,
      activeQuickViewProduct: null,
      compareProduct: null,
      activeScene: 'studio',

      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
            isCartOpen: true,
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }], isCartOpen: true };
      }),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),

      toggleCart: (isOpen) => set((state) => ({
        isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen
      })),

      saveDesign: (design) => set((state) => ({ savedDesigns: [...state.savedDesigns, design] })),
      removeDesign: (id) => set((state) => ({ savedDesigns: state.savedDesigns.filter(d => d.id !== id) })),

      setArProduct: (product) => set({ activeArProduct: product }),
      setQuickViewProduct: (product) => set({ activeQuickViewProduct: product }),
      setCompareProduct: (product) => set({ compareProduct: product }),
      setScene: (scene) => set({ activeScene: scene }),

      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((favId) => favId !== id)
          : [...state.favorites, id]
      })),
      setCinematicMode: (enabled) => set({ isCinematicMode: enabled }),
    }),
    {
      name: 'ar-shop-storage',
      partialize: (state) => ({ cart: state.cart, favorites: state.favorites, savedDesigns: state.savedDesigns }),
    }
  )
);