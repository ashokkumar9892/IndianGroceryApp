import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoreProduct } from '../types';
import { STORE_PRODUCTS } from '../data/mockProducts';

interface InventoryStore {
  overrides: StoreProduct[];
  getStoreProducts: (storeId: string) => StoreProduct[];
  getProductInStore: (productId: string, storeId: string) => StoreProduct | undefined;
  updateStoreProduct: (id: string, updates: Partial<StoreProduct>) => void;
  getAllProducts: () => StoreProduct[];
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      overrides: [],

      getAllProducts: () => {
        const { overrides } = get();
        return STORE_PRODUCTS.map(sp => {
          const override = overrides.find(o => o.id === sp.id);
          return override || sp;
        });
      },

      getStoreProducts: (storeId) => {
        return get().getAllProducts().filter(sp => sp.storeId === storeId);
      },

      getProductInStore: (productId, storeId) => {
        return get().getAllProducts().find(sp => sp.productId === productId && sp.storeId === storeId);
      },

      updateStoreProduct: (id, updates) => {
        const { overrides } = get();
        const existing = overrides.find(o => o.id === id);
        const original = STORE_PRODUCTS.find(sp => sp.id === id);
        if (!original) return;

        if (existing) {
          set({ overrides: overrides.map(o => o.id === id ? { ...o, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : o) });
        } else {
          set({ overrides: [...overrides, { ...original, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }] });
        }
      },
    }),
    { name: 'ak_inventory' }
  )
);
