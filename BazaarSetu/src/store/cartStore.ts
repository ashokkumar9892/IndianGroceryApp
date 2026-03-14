import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (storeProductId: string) => void;
  updateQty: (storeProductId: string, qty: number) => void;
  clearCart: () => void;
  clearStoreCart: (storeId: string) => void;
  getItemCount: () => number;
  getStoreItems: (storeId: string) => CartItem[];
  getStoreTotal: (storeId: string) => number;
  getGrandTotal: () => number;
  getStoreIds: () => string[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get();
        const existing = items.find(i => i.storeProductId === newItem.storeProductId);
        if (existing) {
          set({ items: items.map(i => i.storeProductId === newItem.storeProductId ? { ...i, qty: i.qty + 1 } : i) });
        } else {
          set({ items: [...items, { ...newItem, qty: 1 }] });
        }
      },

      removeItem: (storeProductId) => {
        set({ items: get().items.filter(i => i.storeProductId !== storeProductId) });
      },

      updateQty: (storeProductId, qty) => {
        if (qty <= 0) {
          get().removeItem(storeProductId);
          return;
        }
        set({ items: get().items.map(i => i.storeProductId === storeProductId ? { ...i, qty } : i) });
      },

      clearCart: () => set({ items: [] }),

      clearStoreCart: (storeId) => {
        set({ items: get().items.filter(i => i.storeId !== storeId) });
      },

      getItemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      getStoreItems: (storeId) => get().items.filter(i => i.storeId === storeId),

      getStoreTotal: (storeId) =>
        get().items.filter(i => i.storeId === storeId).reduce((sum, i) => sum + i.unitPrice * i.qty, 0),

      getGrandTotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),

      getStoreIds: () => [...new Set(get().items.map(i => i.storeId))],
    }),
    { name: 'bs_cart' }
  )
);
