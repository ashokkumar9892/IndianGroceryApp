import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderItem, OrderStatus, PickupSlot } from '../types';

interface OrderStore {
  orders: Order[];
  placeOrder: (params: {
    customerId: string;
    customerName: string;
    storeId: string;
    storeName: string;
    items: OrderItem[];
    pickupSlot: PickupSlot;
    specialInstructions?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  getCustomerOrders: (customerId: string) => Order[];
  getStoreOrders: (storeId: string) => Order[];
  getOrder: (orderId: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: (params) => {
        const total = params.items.reduce((sum, i) => sum + i.subtotal, 0);
        const order: Order = {
          id: `ORD-${Date.now()}`,
          customerId: params.customerId,
          customerName: params.customerName,
          storeId: params.storeId,
          storeName: params.storeName,
          items: params.items,
          status: 'pending',
          totalAmount: total,
          pickupSlot: params.pickupSlot,
          specialInstructions: params.specialInstructions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(o =>
            o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        });
      },

      cancelOrder: (orderId) => {
        set({
          orders: get().orders.map(o =>
            o.id === orderId ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() } : o
          ),
        });
      },

      getCustomerOrders: (customerId) =>
        get().orders.filter(o => o.customerId === customerId).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),

      getStoreOrders: (storeId) =>
        get().orders.filter(o => o.storeId === storeId).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),

      getOrder: (orderId) => get().orders.find(o => o.id === orderId),
    }),
    { name: 'ak_orders' }
  )
);
