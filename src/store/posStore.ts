import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: number;
  sku: string;
  name: string;
  price: number;
  qty: number;
  stock: number;
  unit: string;
  category: string;
  icon?: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  icon?: string;
}

interface PosState {
  cart: CartItem[];
  searchQuery: string;
  selectedCategory: string;
  addToCart: (product: Product) => void;
  removeOne: (id: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      cart: [],
      searchQuery: '',
      selectedCategory: 'All',

      addToCart: (product) => {
        const { cart } = get();
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
          if (existing.qty < product.stock) {
            set({
              cart: cart.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
              ),
            });
          }
        } else {
          if (product.stock > 0) {
            set({
              cart: [
                ...cart,
                {
                  id: product.id,
                  sku: product.sku,
                  name: product.name,
                  price: product.price,
                  qty: 1,
                  stock: product.stock,
                  unit: product.unit,
                  category: product.category,
                  icon: product.icon,
                },
              ],
            });
          }
        }
      },

      removeOne: (id) => {
        const { cart } = get();
        const existing = cart.find((item) => item.id === id);
        if (existing && existing.qty > 1) {
          set({
            cart: cart.map((item) =>
              item.id === id ? { ...item, qty: item.qty - 1 } : item
            ),
          });
        } else {
          get().removeItem(id);
        }
      },

      removeItem: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, qty) => {
        const { cart } = get();
        set({
          cart: cart.map((item) =>
            item.id === id ? { ...item, qty: Math.min(qty, item.stock) } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    }),
    {
      name: 'tb-pos-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
