export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  color: string; // For the 3D placeholder
}

export interface CartItem extends Product {
  quantity: number;
}

export type SceneType = 'living-room' | 'studio' | 'office';