export type UserRole = 'customer' | 'storekeeper';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  assignedStoreId?: string;
  createdAt: string;
}

export interface StoreHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Store {
  id: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  logoColor: string;
  bannerColor: string;
  hours: StoreHours[];
  pickupLeadMinutes: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  speciality: string;
}

export type Category =
  | 'rice-grains'
  | 'dal-pulses'
  | 'spices-masala'
  | 'flour-atta'
  | 'oil-ghee'
  | 'pickles-chutneys'
  | 'snacks-namkeen'
  | 'sweets-mithai'
  | 'dairy'
  | 'beverages'
  | 'puja-items'
  | 'fresh-produce';

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'rice-grains', label: 'Rice & Grains', emoji: '🌾' },
  { value: 'dal-pulses', label: 'Dal & Pulses', emoji: '🫘' },
  { value: 'spices-masala', label: 'Spices & Masala', emoji: '🌶️' },
  { value: 'flour-atta', label: 'Flour & Atta', emoji: '🌿' },
  { value: 'oil-ghee', label: 'Oil & Ghee', emoji: '🫙' },
  { value: 'pickles-chutneys', label: 'Pickles & Chutneys', emoji: '🥒' },
  { value: 'snacks-namkeen', label: 'Snacks & Namkeen', emoji: '🍿' },
  { value: 'sweets-mithai', label: 'Sweets & Mithai', emoji: '🍬' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'beverages', label: 'Beverages', emoji: '🍵' },
  { value: 'puja-items', label: 'Puja Items', emoji: '🪔' },
  { value: 'fresh-produce', label: 'Fresh Produce', emoji: '🥬' },
];

export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  brand: string;
  category: Category;
  description: string;
  emoji: string;
  weightValue: number;
  weightUnit: string;
  tags: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}

export interface StoreProduct {
  id: string;
  productId: string;
  storeId: string;
  price: number; // in paise (1/100 rupee)
  stockQty: number;
  isAvailable: boolean;
  discountPercent?: number;
  lastUpdated: string;
}

export interface CartItem {
  storeProductId: string;
  productId: string;
  storeId: string;
  productName: string;
  storeName: string;
  qty: number;
  unitPrice: number;
  emoji: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  storeProductId: string;
  productName: string;
  emoji: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface PickupSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  label: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  pickupSlot: PickupSlot;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageSender = 'user' | 'ai' | 'keeper';

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: MessageSender;
  senderName: string;
  content: string;
  timestamp: string;
  relatedProductId?: string;
}

export interface ChatSession {
  id: string;
  customerId: string;
  customerName: string;
  storeId?: string;
  messages: ChatMessage[];
  isResolved: boolean;
  createdAt: string;
}

export interface ProductFilters {
  search: string;
  category: Category | '';
  storeId: string;
  inStockOnly: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
}
