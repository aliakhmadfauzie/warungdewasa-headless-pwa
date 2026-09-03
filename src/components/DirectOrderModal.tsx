import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, DeliveryMethod, PaymentCategory, PaymentChannel } from '../lib/types';
import { api } from '../lib/supabase';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  User, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Minus, 
  Plus, 
  Loader2, 
  Navigation,
  CreditCard,
  Wallet,
  QrCode,
  Banknote,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Trash2,
  LocateFixed,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface DirectOrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: () => void;
}

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

interface OsmSearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

const MEDAN_PRESETS = [
  { name: 'Medan Petisah / Gatot Subroto', lat: 3.5898, lng: 98.6654 },
  { name: 'Medan Baru / Iskandar Muda', lat: 3.5750, lng: 98.6580 },
  { name: 'Medan Barat / Kesawan', lat: 3.5952, lng: 98.6722 },
  { name: 'Medan Sunggal / Setiabudi', lat: 3.5620, lng: 98.6250 },
  { name: 'Medan Amplas / SM Raja', lat: 3.5350, lng: 98.7050 },
  { name: 'Medan Tembung / Aksara', lat: 3.5980, lng: 98.7120 }
];

interface PaymentOption {
  id: PaymentChannel;
  category: PaymentCategory;
  name: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  badgeBg: string;
  logo: React.ReactNode;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'gopay',
    category: 'ewallet',
    name: 'GoPay',
    provider: 'Gojek / GoTo',
    accountNumber: '081260889901',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#00AA13]/15 text-[#00AA13] border-[#00AA13]/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#00AA13] text-white flex items-center justify-center font-black text-xs shadow-sm">
        GP
      </div>
    )
  },
  {
    id: 'shopeepay',
    category: 'ewallet',
    name: 'ShopeePay',
    provider: 'Shopee Official',
    accountNumber: '081260889901',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#EE4D2D]/15 text-[#FF5722] border-[#EE4D2D]/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center font-black text-xs shadow-sm">
        SP
      </div>
    )
  },
  {
    id: 'ovo',
    category: 'ewallet',
    name: 'OVO',
    provider: 'OVO Payment',
    accountNumber: '081260889901',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#4C3299]/20 text-[#A78BFA] border-[#4C3299]/40',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#4C3299] text-white flex items-center justify-center font-black text-xs shadow-sm">
        OVO
      </div>
    )
  },
  {
    id: 'dana',
    category: 'ewallet',
    name: 'DANA',
    provider: 'DANA Indonesia',
    accountNumber: '081260889901',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#118EEA]/15 text-[#38BDF8] border-[#118EEA]/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#118EEA] text-white flex items-center justify-center font-black text-xs shadow-sm">
        DANA
      </div>
    )
  },
  {
    id: 'bca',
    category: 'bank_transfer',
    name: 'BCA (Bank Central Asia)',
    provider: 'Transfer Antar Bank / VA',
    accountNumber: '8280912831',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#005EAA]/15 text-[#60A5FA] border-[#005EAA]/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#005EAA] text-white flex items-center justify-center font-black text-xs shadow-sm">
        BCA
      </div>
    )
  },
  {
    id: 'mandiri',
    category: 'bank_transfer',
    name: 'Bank Mandiri',
    provider: 'Transfer Antar Bank / Livin',
    accountNumber: '1080019283712',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#003D79]/20 text-[#93C5FD] border-[#003D79]/40',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#003D79] text-white flex items-center justify-center font-black text-xs shadow-sm">
        MDR
      </div>
    )
  },
  {
    id: 'qris',
    category: 'qris',
    name: 'QRIS Universal',
    provider: 'Scan Semua M-Banking & E-Wallet',
    accountNumber: 'NMID: ID102438920192',
    accountName: 'SALTDISTRIBUTE STORE',
    badgeBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
        QR
      </div>
    )
  }
];

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  // Order state
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWa, setCustomerWa] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('cod_medan');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  // Payment states
  const [paymentCategory, setPaymentCategory] = useState<PaymentCategory>('cod');
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('cash');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [copiedAccountNumber, setCopiedAccountNumber] = useState(false);

  // Map & Location states
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState<OsmSearchResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isGettingGeolocation, setIsGettingGeolocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: 3.5952,
    lng: 98.6722 // Default Medan City Center
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<{ orderNumber: string; waUrl: string } | null>(null);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Body scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerWa('');
      setSameAsPhone(true);
      setDeliveryMethod('cod_medan');
      setPaymentCategory('cod');
      setPaymentChannel('cash');
      setReceiptImage(null);
      setDeliveryAddress('');
      setLocationQuery('');
      setNotes('');
      setOrderSuccessData(null);
      setSelectedCoords({ lat: 3.5952, lng: 98.6722 });
    }
  }, [isOpen]);

  // Update payment category when delivery method changes
  useEffect(() => {
    if (deliveryMethod === 'expedition') {
      if (paymentCategory === 'cod') {
        setPaymentCategory('ewallet');
        setPaymentChannel('gopay');
      }
    }
  }, [deliveryMethod]);

  // Geolocation handler (My Current Location)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung deteksi lokasi (Geolocation).');
      return;
    }

    setIsGettingGeolocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedCoords({ lat: latitude, lng: longitude });

        try {
          // Reverse geocode with free OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { 'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8' } }
          );

          if (res.ok) {
            const data = await res.json();
            const displayName = data.display_name || `Lokasi GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setLocationQuery(displayName);
            setDeliveryAddress(displayName);
          }
        } catch {
          const fallback = `Lokasi GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocationQuery(fallback);
          setDeliveryAddress(fallback);
        } finally {
          setIsGettingGeolocation(false);
        }
      },
      (err) => {
        setIsGettingGeolocation(false);
        alert(`Gagal mengambil lokasi GPS: ${err.message}. Pastikan izin lokasi aktif.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Debounced Free OpenStreetMap Nominatim Geocoding Search
  const handleLocationInputChange = (text: string) => {
    setLocationQuery(text);
    setDeliveryAddress(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!text.trim() || text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearchingLocation(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text.includes('Medan') ? text : `${text}, Medan`
        )}&countrycodes=id&limit=5&addressdetails=1`;

        const res = await fetch(endpoint, {
          headers: { 'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8' }
        });

        if (res.ok) {
          const data: OsmSearchResult[] = await res.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch (err) {
        console.error('OSM Geocoding Error:', err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);
  };

  const handleSelectSuggestion = (item: OsmSearchResult) => {
    setLocationQuery(item.display_name);
    setDeliveryAddress(item.display_name);
    setSelectedCoords({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    });
    setShowSuggestions(false);
  };

  const handleSelectPreset = (preset: typeof MEDAN_PRESETS[0]) => {
    setLocationQuery(preset.name);
    setDeliveryAddress(`${preset.name}, Kota Medan`);
    setSelectedCoords({
      lat: preset.lat,
      lng: preset.lng
    });
    setShowSuggestions(false);
  };

  // Handle Receipt Upload
  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\D/g, ''));
    setCopiedAccountNumber(true);
    setTimeout(() => setCopiedAccountNumber(false), 2000);
  };

  if (!isOpen || !product) return null;

  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  const formatRupiah = (val: number) => rupiahFormatter.format(val);

  const activePaymentOption = PAYMENT_OPTIONS.find(p => p.id === paymentChannel);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      alert('Mohon lengkapi Nama, Nomor Telepon, dan Alamat Pengiriman.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalWa = sameAsPhone ? customerPhone : (customerWa || customerPhone);

      const createdOrder = await api.createDirectOrder({
        product_id: product.id,
        product_title: product.title,
        product_price: product.price,
        product_image_url: product.image_url,
        product_category: product.category,
        quantity,
        total_price: totalPrice,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_wa: finalWa,
        delivery_method: deliveryMethod,
        delivery_address: deliveryAddress,
        location_lat: selectedCoords.lat,
        location_lng: selectedCoords.lng,
        payment_category: paymentCategory,
        payment_channel: paymentChannel,
        receipt_image_url: receiptImage || undefined,
        notes
      });

      // Construct formatted WhatsApp message
      const deliveryMethodLabel = 
        deliveryMethod === 'cod_medan' 
          ? 'COD (Bayar di Tempat - Area Medan)' 
          : deliveryMethod === 'expedition' 
          ? 'Ekspedisi Reguler (JNE/J&T/SiCepat)' 
          : 'Ambil di Tempat (Pick-up Point Medan)';

      const paymentMethodLabel = 
        paymentCategory === 'cod'
          ? 'COD (Tunai saat kurir tiba)'
          : activePaymentOption
          ? `${activePaymentOption.name} (${activePaymentOption.accountNumber})`
          : 'Transfer Online';

      const mapLink = `https://maps.google.com/?q=${selectedCoords.lat},${selectedCoords.lng}`;

      const waMessage = 
`*PESANAN LANGSUNG (DIRECT CHECKOUT / COD)*
No. Pesanan: *${createdOrder.order_number}*
Tanggal: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}

*PRODUK DIPESAN:*
• Produk: ${product.title}
• Kategori: ${product.category}
• Jumlah: ${quantity} item
• Harga Satuan: ${formatRupiah(product.price)}
• *TOTAL HARGA: ${formatRupiah(totalPrice)}*

*METODE PEMBAYARAN:*
• Pilihan: *${paymentMethodLabel}*
${receiptImage ? '• Status Bukti Transfer: *Sudah Dilampirkan di Aplikasi*' : '• Status Bukti Transfer: *Akan dikirim di chat ini*'}

*DATA PENERIMA & LOKASI:*
• Nama Lengkap: ${customerName}
• No. HP / Telp: ${customerPhone}
• No. WhatsApp: ${finalWa}
• *Metode Pengiriman:* ${deliveryMethodLabel}
• *Alamat / Titik Pengiriman:* ${deliveryAddress}
• Titik Koordinat: ${mapLink}
${notes ? `• Catatan Khusus: ${notes}\n` : ''}
Mohon konfirmasi ketersediaan stok dan jadwal pengiriman segera. Terima kasih!`;

      const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

      setOrderSuccessData({
        orderNumber: createdOrder.order_number,
        waUrl
      });

      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      console.error('Error submitting direct order:', err);
      alert('Gagal mengirim pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-direct-order-title"
    >
      {/* Semi-transparent dark blur backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Form Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full sm:max-w-2xl bg-[#111827] border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] z-10"
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#111827] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-direct-order-title" className="font-display text-sm sm:text-base font-bold text-white">
                Pesan Langsung ke Seller (Bisa COD & E-Wallet)
              </h3>
              <p className="text-[11px] text-slate-400">
                Pengiriman Cepat, Privasi Terjamin & Konfirmasi Otomatis via WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Form"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {orderSuccessData ? (
            /* Order Success Screen */
            <div className="py-8 px-4 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                  {orderSuccessData.orderNumber}
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-2">
                  Pesanan Berhasil Dicatat!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Data pesanan dan pembayaran Anda telah tersimpan di sistem. Klik tombol di bawah untuk langsung membuka WhatsApp dan konfirmasi jadwal pengiriman dengan admin seller.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <a
                  href={orderSuccessData.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Buka WhatsApp Sekarang</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            /* Order Entry Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Section 1: Item Detail & Quantity Calculator */}
              <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-900 border border-slate-700 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {product.category}
                    </span>
                    <h4 className="font-display text-sm font-bold text-white line-clamp-1">
                      {product.title}
                    </h4>
                    <div className="text-xs font-semibold text-slate-300">
                      {formatRupiah(unitPrice)} <span className="text-slate-500 font-normal">/ item</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-display text-sm font-bold text-white px-2 min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(20, quantity + 1))}
                      disabled={quantity >= 20}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Pembelian</span>
                    <span className="font-display text-base font-extrabold text-white">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Buyer Personal Details */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Data Kontak Pembeli</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      Nama Lengkap <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      Nomor Telepon / HP <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* WhatsApp Checkbox */}
                <div className="pt-1">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => setSameAsPhone(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-[#0B0F19]"
                    />
                    <span>Nomor WhatsApp sama dengan Nomor Telepon di atas</span>
                  </label>

                  {!sameAsPhone && (
                    <div className="mt-2 space-y-1 animate-fade-in">
                      <label className="text-xs font-medium text-slate-300">
                        Nomor WhatsApp Khusus <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerWa}
                        onChange={(e) => setCustomerWa(e.target.value)}
                        placeholder="Contoh: 081298765432"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Delivery Methods */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span>Pilihan Metode Pengiriman</span>
                  </div>
                </div>

                {/* 3 Delivery Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: COD Medan */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('cod_medan')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                      deliveryMethod === 'cod_medan'
                        ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-md'
                        : 'bg-[#161F30] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold text-emerald-400">COD Medan</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-slate-950">
                        Populer
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      Bayar tunai di tempat saat kurir tiba di Medan.
                    </p>
                  </button>

                  {/* Option 2: Ekspedisi Reguler */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('expedition')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                      deliveryMethod === 'expedition'
                        ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-md'
                        : 'bg-[#161F30] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold text-sky-400">Ekspedisi Reguler</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      Kirim ke seluruh Indonesia (JNE/J&T).
                    </p>
                  </button>

                  {/* Option 3: Ambil Sendiri */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                      deliveryMethod === 'pickup'
                        ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-md'
                        : 'bg-[#161F30] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold text-amber-400">Ambil di Hub</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      Ambil di titik pick-up point Medan.
                    </p>
                  </button>
                </div>

                {/* COD Specific Notice Banner */}
                {deliveryMethod === 'cod_medan' && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 animate-fade-in">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-200 leading-relaxed">
                      <strong className="text-emerald-400 font-bold block mb-0.5">Khusus Area Kota Medan & Sekitarnya:</strong>
                      Layanan COD berlaku untuk wilayah Medan Petisah, Medan Barat, Medan Baru, Medan Sunggal, Medan Amplas, Medan Helvetia, dan Deli Serdang terdekat. Pengiriman kurir langsung same-day.
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Location & Map with "My Current Location" & No-Scroll-Trap Map */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Lokasi & Alamat Pengiriman</span>
                  </div>

                  {/* "My Current Location" GPS Button */}
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingGeolocation}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isGettingGeolocation ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <LocateFixed className="w-3.5 h-3.5" />
                    )}
                    <span>Lokasi Saya Saat Ini</span>
                  </button>
                </div>

                {/* Search Autocomplete Input */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={locationQuery}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    placeholder="Ketik nama jalan, kecamatan, atau patokan di Medan (contoh: Jl. Gatot Subroto)..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all"
                  />
                  {isSearchingLocation && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />
                  )}

                  {/* Autocomplete Dropdown List */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-30 max-h-48 overflow-y-auto divide-y divide-slate-800">
                      {suggestions.map((item) => (
                        <div
                          key={item.place_id}
                          onClick={() => handleSelectSuggestion(item)}
                          className="p-3 hover:bg-slate-800/90 text-xs text-slate-200 cursor-pointer flex items-start gap-2.5 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-relaxed">{item.display_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Medan Area Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400">Pilih Area Cepat Medan:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {MEDAN_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 transition-colors cursor-pointer active:scale-95"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* OpenStreetMap View (Scroll Zoom Trapping Removed) */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-inner group">
                  {/* Iframe with scroll wheel trap disabled */}
                  <iframe
                    title="OpenStreetMap Location"
                    className="w-full h-full border-0 pointer-events-none"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCoords.lng - 0.012}%2C${selectedCoords.lat - 0.012}%2C${selectedCoords.lng + 0.012}%2C${selectedCoords.lat + 0.012}&layer=mapnik&marker=${selectedCoords.lat}%2C${selectedCoords.lng}`}
                  />
                  {/* Floating Coordinates & Address Tag */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-[10px] text-slate-300 border border-white/10 pointer-events-none">
                    <span className="truncate max-w-[220px]">
                      📍 {deliveryAddress || 'Area Kota Medan'}
                    </span>
                    <span className="font-mono text-emerald-400">
                      {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Detail Address Textarea */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Alamat Lengkap / Patokan Rumah / Gang <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, nomor gang, atau patokan terdekat..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Section 5: Payment Methods with Logos & Account Details */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Metode Pembayaran</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-normal normal-case">
                    Konfirmasi Instan
                  </span>
                </div>

                {/* Payment Category Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* COD (Only if COD Medan / Pickup) */}
                  {deliveryMethod !== 'expedition' && (
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentCategory('cod');
                        setPaymentChannel('cash');
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        paymentCategory === 'cod'
                          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-xs'
                          : 'bg-[#161F30] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      <span className="text-[11px] font-bold">Bayar Tunai / COD</span>
                    </button>
                  )}

                  {/* E-Wallet */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentCategory('ewallet');
                      setPaymentChannel('gopay');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentCategory === 'ewallet'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-xs'
                        : 'bg-[#161F30] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold">E-Wallet (GoPay dll)</span>
                  </button>

                  {/* Transfer Bank */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentCategory('bank_transfer');
                      setPaymentChannel('bca');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentCategory === 'bank_transfer'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-xs'
                        : 'bg-[#161F30] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-sky-400" />
                    <span className="text-[11px] font-bold">Transfer Bank</span>
                  </button>

                  {/* QRIS */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentCategory('qris');
                      setPaymentChannel('qris');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentCategory === 'qris'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-xs'
                        : 'bg-[#161F30] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-rose-400" />
                    <span className="text-[11px] font-bold">QRIS Instant</span>
                  </button>
                </div>

                {/* Sub-channel Selection for E-Wallet or Bank */}
                {paymentCategory === 'ewallet' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-in">
                    {PAYMENT_OPTIONS.filter(p => p.category === 'ewallet').map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentChannel(opt.id)}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                          paymentChannel === opt.id
                            ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.logo}
                        <span className="text-xs font-bold">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {paymentCategory === 'bank_transfer' && (
                  <div className="grid grid-cols-2 gap-2 animate-fade-in">
                    {PAYMENT_OPTIONS.filter(p => p.category === 'bank_transfer').map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentChannel(opt.id)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                          paymentChannel === opt.id
                            ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.logo}
                        <div className="text-left">
                          <span className="text-xs font-bold block">{opt.name}</span>
                          <span className="text-[10px] text-slate-400">{opt.provider}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Account Details Callout Card with 1-Click Copy */}
                {activePaymentOption && paymentCategory !== 'cod' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#161F30] to-slate-900 border border-slate-700 shadow-md space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {activePaymentOption.logo}
                        <div>
                          <h5 className="text-xs font-bold text-white">{activePaymentOption.name}</h5>
                          <p className="text-[10px] text-slate-400">{activePaymentOption.provider}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${activePaymentOption.badgeBg}`}>
                        Official Verified
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          {paymentCategory === 'ewallet' ? 'Nomor E-Wallet / HP:' : paymentCategory === 'qris' ? 'ID Transaksi:' : 'Nomor Rekening:'}
                        </span>
                        <div className="font-mono text-sm sm:text-base font-extrabold text-emerald-400 tracking-wider mt-0.5">
                          {activePaymentOption.accountNumber}
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          a/n <strong className="text-white">{activePaymentOption.accountName}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyAccount(activePaymentOption.accountNumber)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer active:scale-95 shadow-sm"
                      >
                        {copiedAccountNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-300" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* QR Code Graphic for QRIS */}
                    {paymentCategory === 'qris' && (
                      <div className="p-4 rounded-xl bg-white text-slate-900 text-center space-y-2 max-w-[200px] mx-auto shadow-lg">
                        <QrCode className="w-32 h-32 mx-auto text-slate-950" />
                        <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-700">
                          Scan QRIS Warung Dewasa
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Attached Receipt Pop-up / Upload Component */}
                {paymentCategory !== 'cod' && (
                  <div className="space-y-2 p-3.5 rounded-2xl bg-[#161F30] border border-slate-800 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Lampirkan Bukti Transfer (Opsional / Rekomendasi):</span>
                      </label>
                      <span className="text-[10px] text-slate-400">JPG, PNG</span>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptFileChange}
                      className="hidden"
                    />

                    {receiptImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-900/90 p-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={receiptImage}
                            alt="Bukti Transfer"
                            className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                          />
                          <div>
                            <span className="text-xs font-bold text-emerald-400 block">
                              ✓ Bukti Transfer Terlampir
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Akan dikirim langsung bersama ringkasan pesanan
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setReceiptImage(null)}
                          className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Hapus Bukti Transfer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-900/60 hover:bg-slate-900 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Upload Foto Struk / Screenshot Bukti Transfer</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Section 6: Special Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Catatan Khusus Pengiriman (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Tolong bungkus tidak tembus pandang / antar setelah jam 17:00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Privacy Guarantee Pill */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Kemasan Polos, Diskrit & Rahasia. Nama isi produk tidak dicantumkan di resi.</span>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-display font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/50 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Pesanan...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Kirim Pesanan ke WhatsApp & Seller ({formatRupiah(totalPrice)})</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
