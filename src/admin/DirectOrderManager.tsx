import React, { useState, useEffect } from 'react';
import { DirectOrder, DirectOrderStatus } from '../lib/types';
import { api } from '../lib/supabase';
import { 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink, 
  Search, 
  RefreshCw,
  Package,
  Calendar,
  CreditCard,
  Wallet,
  Building2,
  QrCode,
  Banknote,
  ImageIcon,
  X,
  Eye
} from 'lucide-react';

interface DirectOrderManagerProps {
  onRefresh?: () => void;
}

const STATUS_BADGES: Record<DirectOrderStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Menunggu Konfirmasi',
    bg: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    icon: <Clock className="w-3.5 h-3.5 text-amber-400" />
  },
  confirmed: {
    label: 'Dikonfirmasi',
    bg: 'bg-sky-500/10 border-sky-500/30',
    text: 'text-sky-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
  },
  shipping: {
    label: 'Sedang Dikirim',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
    text: 'text-indigo-400',
    icon: <Truck className="w-3.5 h-3.5 text-indigo-400" />
  },
  completed: {
    label: 'Selesai / Terkirim',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
  },
  cancelled: {
    label: 'Dibatalkan',
    bg: 'bg-rose-500/10 border-rose-500/30',
    text: 'text-rose-400',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />
  }
};

export const DirectOrderManager: React.FC<DirectOrderManagerProps> = ({ onRefresh }) => {
  const [orders, setOrders] = useState<DirectOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | DirectOrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDirectOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load direct orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: DirectOrderStatus) => {
    try {
      await api.updateDirectOrderStatus(orderId, newStatus);
      await loadOrders();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      order.order_number.toLowerCase().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_phone.includes(query) ||
      order.product_title.toLowerCase().includes(query) ||
      order.delivery_address.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-md">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <span>Manajemen Pesanan Langsung & COD Medan</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola pesanan kurir COD, pembayaran E-Wallet/Transfer, dan bukti resi transfer
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor pesanan, nama pembeli, no HP, atau alamat..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'pending', 'confirmed', 'shipping', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap capitalize cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Grid */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">Tidak Ada Pesanan Ditemukan</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Belum ada pesanan langsung yang sesuai dengan filter pencarian ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = STATUS_BADGES[order.status] || STATUS_BADGES.pending;
            const waChatUrl = `https://wa.me/${order.customer_wa.replace(/\D/g, '')}?text=${encodeURIComponent(
              `Halo Kak ${order.customer_name}, ini dari Warung Dewasa Abang Dugem mengenai pesanan *${order.order_number}* (${order.product_title}).`
            )}`;
            const mapUrl = order.location_lat && order.location_lng 
              ? `https://www.google.com/maps?q=${order.location_lat},${order.location_lng}`
              : `https://www.google.com/maps/search/${encodeURIComponent(order.delivery_address)}`;

            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-[#161F30] border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-4"
              >
                {/* Order Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                      {order.order_number}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      order.delivery_method === 'cod_medan'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : order.delivery_method === 'expedition'
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {order.delivery_method === 'cod_medan' ? 'COD Medan' : order.delivery_method === 'expedition' ? 'Ekspedisi' : 'Pick-up'}
                    </span>
                  </div>
                </div>

                {/* Order Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  {/* Item Summary */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <img
                      src={order.product_image_url}
                      alt={order.product_title}
                      className="w-14 h-14 object-cover rounded-lg bg-slate-800 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                        {order.product_category}
                      </span>
                      <h5 className="font-bold text-white line-clamp-1">{order.product_title}</h5>
                      <div className="text-slate-300">
                        {order.quantity} x {formatRupiah(order.product_price)}
                      </div>
                      <div className="font-display font-extrabold text-sm text-white">
                        Total: {formatRupiah(order.total_price)}
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Data Pembeli
                    </span>
                    <div className="font-bold text-white text-sm">{order.customer_name}</div>
                    <div className="text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.customer_phone}</span>
                    </div>
                    <a
                      href={waChatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all active:scale-95 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Chat WhatsApp Pembeli</span>
                    </a>
                  </div>

                  {/* Payment Channel & Attached Receipt */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Metode Pembayaran
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-slate-800 text-emerald-400 border border-slate-700">
                        {order.payment_channel || (order.payment_category === 'cod' ? 'COD Tunai' : 'Online')}
                      </span>
                    </div>

                    {order.receipt_image_url ? (
                      <button
                        type="button"
                        onClick={() => setPreviewReceiptUrl(order.receipt_image_url!)}
                        className="min-h-[40px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-500/40 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
                      >
                        <ImageIcon className="w-4 h-4 text-sky-400" />
                        <span>Lihat Bukti Transfer</span>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 block">
                        {order.payment_category === 'cod' ? 'Bayar saat kurir tiba' : 'Belum upload struk'}
                      </span>
                    )}
                  </div>

                  {/* Address & OpenStreetMap Pin */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Titik Pengiriman / COD
                    </span>
                    <div className="text-slate-200 text-xs line-clamp-2 leading-relaxed">
                      {order.delivery_address}
                    </div>
                    {order.notes && (
                      <div className="text-[11px] text-amber-300/90 italic">
                        &quot;Catatan: {order.notes}&quot;
                      </div>
                    )}
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-500/40 font-bold text-xs transition-all active:scale-95 shadow-xs"
                    >
                      <MapPin className="w-4 h-4 text-sky-400" />
                      <span>Buka Titik Peta</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                  <div className="text-xs font-bold text-slate-400">
                    Ubah Status Pesanan:
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                        className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Konfirmasi Pesanan
                      </button>
                    )}

                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'shipping')}
                        className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Kirim Kurir / COD
                      </button>
                    )}

                    {order.status === 'shipping' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Tandai Selesai / Terkirim
                      </button>
                    )}

                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-rose-400 hover:text-rose-200 font-bold text-xs border border-slate-700 transition-all active:scale-95 cursor-pointer"
                      >
                        Batalkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Receipt Image Preview Modal */}
      {previewReceiptUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewReceiptUrl(null)}
        >
          <div 
            className="relative max-w-lg w-full bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Bukti Transfer Pembeli</span>
              </h4>
              <button
                onClick={() => setPreviewReceiptUrl(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-black/60 border border-slate-800 max-h-[70vh] flex items-center justify-center">
              <img
                src={previewReceiptUrl}
                alt="Bukti Transfer Pelanggan"
                className="w-full h-auto object-contain max-h-[65vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
