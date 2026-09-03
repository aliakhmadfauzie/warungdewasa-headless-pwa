import { createClient } from '@supabase/supabase-js';
import { Product, MerchantNote, SpecialRequest, StockStatus, RequestStatus, DirectOrder, DirectOrderStatus } from './types';
import { POPPERS_PRODUCTS } from './catalogData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial Catalog from poppers.id (121 Verified SKU)
const INITIAL_PRODUCTS: Product[] = POPPERS_PRODUCTS;

const STORAGE_KEYS = {
  PRODUCTS: 'poppers_catalog_v4',
  SPECIAL_REQUESTS: 'poppers_special_requests_v4',
  DIRECT_ORDERS: 'poppers_direct_orders_v1'
};

const getLocalProducts = (): Product[] => {
  const cached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

const getLocalRequests = (): SpecialRequest[] => {
  const cached = localStorage.getItem(STORAGE_KEYS.SPECIAL_REQUESTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback
    }
  }
  const defaults: SpecialRequest[] = [
    {
      id: 'req-1',
      customer_name: 'David Pratama',
      contact_info: '+6281298765432',
      item_description: 'Mencari Rush Ultra Strong 30ml 5 botol pengiriman instan same-day ke Jakarta Selatan.',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];
  localStorage.setItem(STORAGE_KEYS.SPECIAL_REQUESTS, JSON.stringify(defaults));
  return defaults;
};

const getLocalDirectOrders = (): DirectOrder[] => {
  const cached = localStorage.getItem(STORAGE_KEYS.DIRECT_ORDERS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback
    }
  }
  const defaults: DirectOrder[] = [
    {
      id: 'dir-1',
      order_number: 'DIR-MDN-8821',
      product_id: 'pop-1',
      product_title: 'GOLD RUSH Premium Edition 10ml',
      product_price: 285000,
      product_image_url: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-104-768x768.jpg',
      product_category: 'Poppers & Aroma',
      quantity: 2,
      total_price: 570000,
      customer_name: 'Budi Santoso',
      customer_phone: '081234567890',
      customer_wa: '081234567890',
      delivery_method: 'cod_medan',
      delivery_address: 'Jl. Gatot Subroto No. 45, Medan Petisah, Kota Medan',
      location_lat: 3.5898,
      location_lng: 98.6654,
      payment_category: 'cod',
      payment_channel: 'cash',
      notes: 'Mohon hubungi via WhatsApp sebelum antar, bayar pas kurir sampai.',
      status: 'pending',
      created_at: new Date(Date.now() - 1800000).toISOString()
    }
  ];
  localStorage.setItem(STORAGE_KEYS.DIRECT_ORDERS, JSON.stringify(defaults));
  return defaults;
};

// Unified Data Services (Supabase with Local Offline Fallback)
export const api = {
  async getProducts(): Promise<Product[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, merchant_notes(*)')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Product[];
    }
    return getLocalProducts();
  },

  async saveProduct(product: Partial<Product> & { title: string }): Promise<Product> {
    if (supabase) {
      if (product.id) {
        const { data, error } = await supabase
          .from('products')
          .update(product)
          .eq('id', product.id)
          .select('*, merchant_notes(*)')
          .single();
        if (!error && data) return data as Product;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([product])
          .select('*, merchant_notes(*)')
          .single();
        if (!error && data) return data as Product;
      }
    }
    const current = getLocalProducts();
    if (product.id) {
      const index = current.findIndex(p => p.id === product.id);
      if (index !== -1) {
        current[index] = { ...current[index], ...product } as Product;
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(current));
        return current[index];
      }
    }
    const created: Product = {
      ...product,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      stock_status: product.stock_status || 'in_stock',
      price: product.price || 0,
      description: product.description || '',
      category: product.category || 'Lainnya',
      image_url: product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
      shopee_url: product.shopee_url || '',
      tokopedia_url: product.tokopedia_url || ''
    };
    current.unshift(created);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(current));
    return created;
  },

  async updateStockStatus(productId: string, stock_status: StockStatus): Promise<void> {
    if (supabase) {
      await supabase.from('products').update({ stock_status }).eq('id', productId);
    }
    const current = getLocalProducts();
    const target = current.find(p => p.id === productId);
    if (target) {
      target.stock_status = stock_status;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(current));
    }
  },

  async addMerchantNote(
    productIdOrNote: string | Omit<MerchantNote, 'id' | 'created_at'>,
    maybeNote?: Partial<MerchantNote> & { content: string }
  ): Promise<MerchantNote> {
    const note: Omit<MerchantNote, 'id' | 'created_at'> =
      typeof productIdOrNote === 'string'
        ? {
            product_id: productIdOrNote,
            note_type: maybeNote?.note_type || 'usage_tip',
            content: maybeNote!.content
          }
        : productIdOrNote;

    if (supabase) {
      const { data, error } = await supabase
        .from('merchant_notes')
        .insert([note])
        .select()
        .single();
      if (!error && data) return data as MerchantNote;
    }
    const created: MerchantNote = {
      ...note,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    const current = getLocalProducts();
    const product = current.find(p => p.id === note.product_id);
    if (product) {
      if (!product.merchant_notes) product.merchant_notes = [];
      product.merchant_notes.unshift(created);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(current));
    }
    return created;
  },

  async deleteMerchantNote(productId: string, noteId: string): Promise<void> {
    if (supabase) {
      await supabase.from('merchant_notes').delete().eq('id', noteId);
    }
    const current = getLocalProducts();
    const product = current.find(p => p.id === productId);
    if (product && product.merchant_notes) {
      product.merchant_notes = product.merchant_notes.filter(n => n.id !== noteId);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(current));
    }
  },

  async getSpecialRequests(): Promise<SpecialRequest[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('special_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as SpecialRequest[];
    }
    return getLocalRequests();
  },

  async submitSpecialRequest(req: Omit<SpecialRequest, 'id' | 'status' | 'created_at'>): Promise<SpecialRequest> {
    if (supabase) {
      const { data, error } = await supabase
        .from('special_requests')
        .insert([{ ...req, status: 'pending' }])
        .select()
        .single();
      if (!error && data) return data as SpecialRequest;
    }
    const created: SpecialRequest = {
      ...req,
      id: crypto.randomUUID(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    const current = getLocalRequests();
    current.unshift(created);
    localStorage.setItem(STORAGE_KEYS.SPECIAL_REQUESTS, JSON.stringify(current));
    return created;
  },

  async updateRequestStatus(requestId: string, status: RequestStatus, reply?: string): Promise<void> {
    if (supabase) {
      await supabase.from('special_requests').update({ status, merchant_reply: reply }).eq('id', requestId);
    }
    const current = getLocalRequests();
    const target = current.find(r => r.id === requestId);
    if (target) {
      target.status = status;
      if (reply) target.merchant_reply = reply;
      localStorage.setItem(STORAGE_KEYS.SPECIAL_REQUESTS, JSON.stringify(current));
    }
  },

  // Direct Orders with Seller (COD Medan & Express Courier)
  async getDirectOrders(): Promise<DirectOrder[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('direct_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as DirectOrder[];
    }
    return getLocalDirectOrders();
  },

  async createDirectOrder(order: Omit<DirectOrder, 'id' | 'order_number' | 'status' | 'created_at'>): Promise<DirectOrder> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `DIR-MDN-${randomSuffix}`;

    if (supabase) {
      const { data, error } = await supabase
        .from('direct_orders')
        .insert([{ ...order, order_number: orderNumber, status: 'pending' }])
        .select()
        .single();
      if (!error && data) return data as DirectOrder;
    }

    const created: DirectOrder = {
      ...order,
      id: crypto.randomUUID(),
      order_number: orderNumber,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const current = getLocalDirectOrders();
    current.unshift(created);
    localStorage.setItem(STORAGE_KEYS.DIRECT_ORDERS, JSON.stringify(current));
    return created;
  },

  async updateDirectOrderStatus(orderId: string, status: DirectOrderStatus): Promise<void> {
    if (supabase) {
      await supabase.from('direct_orders').update({ status }).eq('id', orderId);
    }
    const current = getLocalDirectOrders();
    const target = current.find(o => o.id === orderId);
    if (target) {
      target.status = status;
      localStorage.setItem(STORAGE_KEYS.DIRECT_ORDERS, JSON.stringify(current));
    }
  }
};
