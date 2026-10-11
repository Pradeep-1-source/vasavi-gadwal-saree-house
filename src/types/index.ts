export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  email: string;
  house_number: string;
  building_name?: string;
  street: string;
  locality: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default?: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id?: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_id: string;
  category_name?: string;
  fabric: string;
  colour: string;
  saree_length: string; // e.g., '6.2 Meters (including blouse)'
  blouse_details: string; // e.g., 'Attached Unstitched Blouse Piece'
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  created_at?: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Refunded';

export type PaymentStatus = 
  | 'Pending' 
  | 'Paid' 
  | 'Failed' 
  | 'Refunded';

export interface OrderItem {
  id: string;
  order_id?: string;
  product_id: string;
  product_name_snapshot: string;
  product_image_snapshot: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string; // e.g., 'VGSH-2025-0104'
  user_id: string;
  user_email?: string;
  user_name?: string;
  address_snapshot: Address;
  subtotal: number;
  delivery_charge: number; // ₹100
  discount_amount: number;
  total_amount: number;
  payment_provider: 'whatsapp' | 'phonepe_upi' | 'razorpay' | 'cash_on_delivery' | 'test_mode' | string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  tracking_number?: string;
  tracking_carrier?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  product_id: string;
  product_name?: string;
  rating: number; // 1 to 5
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

export interface SiteSettings {
  id?: string;
  delivery_charge: number; // Default 100
  free_delivery_threshold?: number; // Optional threshold e.g. 15000
  support_phone: string; // 7660833168
  whatsapp_number: string; // 917660833168
  announcement_bar: string;
  is_announcement_enabled: boolean;
}
