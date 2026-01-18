import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Aero Lounge Chair',
    price: 899,
    category: 'Furniture',
    description: 'Minimalist ergonomic design with premium leather finish.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    color: '#00d4ff'
  },
  {
    id: '2',
    name: 'Nebula Lamp',
    price: 249,
    category: 'Lighting',
    description: 'Ambient lighting solution with smart home integration.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    color: '#c9a962'
  },
  {
    id: '3',
    name: 'Quantum Desk',
    price: 1200,
    category: 'Office',
    description: 'Floating aesthetic desk made from tempered glass and carbon fiber.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
    color: '#ffffff'
  }
];

export const scenes: Record<string, string> = {
  'living-room': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600',
  'studio': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1600',
  'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600'
};