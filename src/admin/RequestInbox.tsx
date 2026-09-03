import React, { useState, useEffect } from 'react';
import { SpecialRequest, RequestStatus } from '../lib/types';
import { api } from '../lib/supabase';
import { Phone, CheckCircle2, Clock, XCircle, Search, ArrowUpRight, MessageCircle } from 'lucide-react';

interface RequestInboxProps {
  requests: SpecialRequest[];
  onRefresh: () => void;
}

const STATUS_CONFIG: Record<RequestStatus, { label: string; badge: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Menunggu Tinjauan',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    icon: <Clock className="w-3.5 h-3.5 text-amber-400" />
  },
  sourcing: {
    label: 'Sedang Sourcing',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    icon: <Search className="w-3.5 h-3.5 text-sky-400" />
  },
  fulfilled: {
    label: 'Selesai / Terpenuhi',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
  },
  rejected: {
    label: 'Ditolak / Batal',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />
  }
};

export const RequestInbox: React.FC<RequestInboxProps> = ({ requests, onRefresh }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [localRequests, setLocalRequests] = useState<SpecialRequest[]>(requests);

  useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  const filtered = selectedStatus === 'all' 
    ? localRequests 
    : localRequests.filter(r => r.status === selectedStatus);

  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    const previousRequests = [...localRequests];
    setLocalRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    
    try {
      await api.updateRequestStatus(id, newStatus);
      onRefresh();
    } catch (err) {
      setLocalRequests(previousRequests);
      console.error('Failed to update status', err);
    }
  };

  const openWhatsApp = (phoneOrContact: string, customerName: string, itemDesc: string) => {
    const cleanPhone = phoneOrContact.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Halo ${customerName}, kami dari Official SaltDistribute menindaklanjuti permintaan khusus Anda untuk: "${itemDesc}".`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-white tracking-tight">Inbox Permintaan Produk Khusus</h2>
          <p className="text-xs text-slate-400">Tanggapi permintaan garam custom, tender sak 50kg, dan spesifikasi khusus</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111827] border border-slate-800 overflow-x-auto scrollbar-none no-scrollbar">
          {['all', 'pending', 'sourcing', 'fulfilled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                selectedStatus === st
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'Semua' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#111827] border border-slate-800 rounded-2xl text-slate-400 text-xs">
            Tidak ada permintaan dengan status ini.
          </div>
        ) : (
          filtered.map((req) => {
            const config = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            return (
              <div
                key={req.id}
                className="p-4 sm:p-6 bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl shadow-md flex flex-col justify-between space-y-4 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-white">{req.customer_name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono mt-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{req.contact_info}</span>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${config.badge}`}>
                      {config.icon}
                      <span>{config.label}</span>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-slate-200 leading-relaxed">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Deskripsi Permintaan:
                    </span>
                    {req.item_description}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value as RequestStatus)}
                    aria-label="Ubah Status Permintaan"
                    className="w-full sm:w-auto min-h-[42px] px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs font-bold text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="pending">🟡 Menunggu</option>
                    <option value="sourcing">🔵 Sourcing</option>
                    <option value="fulfilled">🟢 Terpenuhi</option>
                    <option value="rejected">🔴 Ditolak</option>
                  </select>

                  <button
                    onClick={() => openWhatsApp(req.contact_info, req.customer_name, req.item_description)}
                    className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Follow-up WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};


