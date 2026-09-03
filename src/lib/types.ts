export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
export type NoteType = 'usage_tip' | 'personal_review' | 'recommendation';
export type RequestStatus = 'pending' | 'sourcing' | 'fulfilled' | 'rejected';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  stock_status: StockStatus;
  shopee_url: string;
  tokopedia_url: string;
  created_at: string;
  merchant_notes?: MerchantNote[];
}

export interface MerchantNote {
  id: string;
  product_id: string;
  note_type: NoteType;
  content: string;
  created_at: string;
}

export type DeliveryMethod = 'cod_medan' | 'expedition' | 'pickup';
export type DirectOrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
export type PaymentCategory = 'cod' | 'bank_transfer' | 'ewallet' | 'qris';
export type PaymentChannel = 'cash' | 'bca' | 'mandiri' | 'gopay' | 'shopeepay' | 'ovo' | 'dana' | 'qris';

export interface DirectOrder {
  id: string;
  order_number: string;
  product_id: string;
  product_title: string;
  product_price: number;
  product_image_url: string;
  product_category: string;
  quantity: number;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  customer_wa: string;
  delivery_method: DeliveryMethod;
  delivery_address: string;
  location_lat?: number;
  location_lng?: number;
  payment_category: PaymentCategory;
  payment_channel: PaymentChannel;
  receipt_image_url?: string;
  notes?: string;
  status: DirectOrderStatus;
  created_at: string;
}

export interface SpecialRequest {
  id: string;
  customer_name: string;
  contact_info: string;
  item_description: string;
  status: RequestStatus;
  merchant_reply?: string;
  created_at: string;
}
