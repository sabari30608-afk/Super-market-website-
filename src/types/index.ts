export type CategoryName =
  | 'Fruits'
  | 'Vegetables'
  | 'Groceries'
  | 'Foods'
  | 'Beverages'
  | 'Snacks';

export interface Product {
  id: string;
  name: string;
  category: CategoryName;
  price: number;
  unit: string; // e.g. "kg", "liter", "pack", "bottle", "bar", "jar"
  stock: number;
  initialStock: number;
  image: string;
  description: string;
  origin?: string;
  rating?: number;
  organic?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  subtotal: number;
}

export interface Invoice {
  orderId: string;
  date: string;
  customerName: string;
  customerRole: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number; // 5% GST
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  storeName: string;
  gstin: string;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: 'java' | 'sql' | 'xml' | 'html' | 'css' | 'javascript' | 'json';
  category: 'Java Backend' | 'Database' | 'Frontend' | 'Build Config';
  description: string;
  content: string;
}
