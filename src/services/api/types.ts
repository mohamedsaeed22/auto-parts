// Base API Response Types
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  errors: any[];
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// Auth Types
export interface LoginWithPhoneRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface GoogleLoginRequest {
  google_id: string;
}

export interface CompleteRegistrationRequest {
  name: string;
  email?: string;
  type: "shop" | "workshop";
  manager_name: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  tax_number: string;
  commercial_register?: File;
  latitude: string;
  longitude: string;
  avatar?: File;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  manager_name?: string;
  address?: string;
  city?: string;
  zip?: string;
  state?: string;
  avatar?: File;
  latitude?: string;
  longitude?: string;
}

export interface UpdatePasswordRequest {
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  phone: string;
  commercial_register?: File;
  avatar?: File;
}

export interface ChangeLanguageRequest {
  locale: "ar" | "en";
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone: string;
  type: "shop" | "workshop";
  manager_name: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  tax_number: string;
  latitude: string;
  longitude: string;
  avatar?: string;
  commercial_register?: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  price: string;
  discount_type: "percentage" | "fixed" | null;
  discount_amount: string | null;
  final_price: number;
  discount_info: string;
  brand: Brand | null;
  category: {
    id: number;
    name: string;
    level: number;
    image: string;
    parent: {
      id: number;
      name: string;
    } | null;
  };
  offer: {
    id: number;
    image: string;
    discount_type: "percentage" | "fixed";
    discount_amount: string;
    discount_info: string;
    products_count: number;
  } | null;
  primary_image: string;
  images: string[];
  description: string;
  hover_text: string;
  product_identifier: string;
}

// Product Details Response
export interface ProductDetailsResponse {
  product: Product;
}

export interface ProductsRequest {
  category_id?: number;
  brand_id?: number;
  name?: string;
  min_price?: number;
  max_price?: number;
  product_identifier?: string;
  description?: string;
  search?: string;
  per_page?: number;
  page?: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  image?: string;
  level: number;
  parent_id?: number;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

export interface CategoriesRequest {
  level?: number;
  perPage?: number;
  with_children?: boolean;
}

// Brand Types
export interface Brand {
  id: number;
  name: string;
  image?: string;
  logo?: string; // Keep for backward compatibility
  created_at?: string;
  updated_at?: string;
}

export interface BrandsRequest {
  per_page?: number;
  page?: number;
}

// Cart Types
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon_code?: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface ApplyCouponRequest {
  coupon_code: string;
}

// Wishlist & Favourites Types
export interface ToggleWishlistRequest {
  product_id: number;
}

export interface ToggleFavouriteRequest {
  product_id: number;
}

// Address Types
export interface Address {
  id: number;
  address_type: "home" | "office" | "other";
  name: string;
  phone: string;
  city: string;
  detailed_address: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressRequest {
  address_type: "home" | "office" | "other";
  name: string;
  phone: string;
  city: string;
  detailed_address: string;
  postal_code: string;
  is_default: boolean;
}

export interface UpdateAddressRequest extends CreateAddressRequest {}

// Order Types
export interface Order {
  id: number;
  order_number: string;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled"
    | "refunded";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method:
    | "cash"
    | "credit_card"
    | "paypal"
    | "stripe"
    | "bank_transfer";
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  address: Address;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

export interface CreateOrderRequest {
  payment_method:
    | "cash"
    | "credit_card"
    | "paypal"
    | "stripe"
    | "bank_transfer";
  address_id: number;
  coupon_code?: string;
  notes?: string;
}

export interface OrdersRequest {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export interface OrderStatistics {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_amount: number;
}

// Request Types (Custom Requests)
export interface RequestItem {
  part_name: string;
  quantity: number;
  chassis_number: string;
  part_image_path?: File;
  order_image_path?: File;
  form_image_path?: File;
}

export interface CustomRequest {
  id: number;
  status: "draft" | "pending" | "submitted" | "accepted" | "rejected";
  items: RequestItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateRequestRequest {
  items: RequestItem[];
}

export interface RequestsRequest {
  status?: "draft" | "pending" | "submitted" | "accepted" | "rejected";
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

// Banner & Offer Types
export interface Banner {
  id: number;
  image: string;
  link?: string;
}

export interface Offer {
  id: number;
  image: string;
  discount_type: "percentage" | "fixed";
  discount_amount: string;
  discount_info: string;
  products_count: number;
}

// Section Types
export interface Section {
  id: number;
  title: string;
  type: string;
  content: any;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

// Settings Types
export interface AppSettings {
  app_name: string;
  app_version: string;
  contact_email: string;
  contact_phone: string;
  privacy_policy: string;
  terms_of_service: string;
  refund_policy: string;
  shipping_policy: string;
}

export interface LegalContent {
  privacy_policy: string;
  terms_of_service: string;
  refund_policy: string;
  shipping_policy: string;
}

// Partner Types
export interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
