# 📐 Warung Dewasa - Dashboard Layouts & Component Specs

This document contains key XML/UI screen files, dashboard layouts, component anatomical specs, and design guidelines for both the **Merchant Admin Dashboard** and **Storefront PWA UI**.

---

## 📑 Table of Contents
1. [Merchant Admin Dashboard (`src/admin/AdminDashboard.tsx`)](#1-merchant-admin-dashboard-srcadminadmindashboardtsx)
2. [Product Manager Component (`src/admin/ProductManager.tsx`)](#2-product-manager-component-srcadminproductmanagertsx)
3. [Direct Orders & COD Pipeline (`src/admin/DirectOrderManager.tsx`)](#3-direct-orders--cod-pipeline-srcadmindirectordermanagertsx)
4. [Shopee 1:1 Product Card Layout (`src/components/ProductCard.tsx`)](#4-shopee-11-product-card-layout-srccomponentsproductcardtsx)
5. [Direct Order Checkout Modal (`src/components/DirectOrderModal.tsx`)](#5-direct-order-checkout-modal-srccomponentsdirectordermodaltsx)
6. [Component Design Guidelines & Grid Specifications](#6-component-design-guidelines--grid-specifications)

---

## 1. Merchant Admin Dashboard (`src/admin/AdminDashboard.tsx`)

### Layout Overview & Key Features
- **Header Banner**: Session identity, status pill (`Admin Aktif`), store preview link (`Lihat Toko`), and session logout button.
- **Bento Box KPI Grid**: Asymmetric priority layout with a 2-column dominant hero card for urgent actionable metrics (`Pesanan COD & Kurir Medan`) featuring emerald glow border, icon container, and micro-pulsing status badge (`animate-pulse`), alongside dedicated SKU, Ready Stock ratio, and unread request tiles.
- **Interactive Analytics**:
  - **SVG Donut Chart**: Health meter showing percentage of inventory ready for instant delivery.
  - **Category Share Bar Chart**: Visual breakdown of SKU count per product category.
- **Swipeable Navigation Tabs**: 44px+ touch targets for mobile admin view (`Katalog Produk`, `Pesanan COD & Kurir`, `Inbox Request`, `Database & Offline`).

```tsx
// Bento Box KPI Grid Snippet (AdminDashboard.tsx)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Urgent Action Bento: Direct Orders (Hero span, gradient glow & pulsing alert) */}
  <div
    onClick={() => setActiveTab('direct_orders')}
    className="col-span-1 sm:col-span-2 relative p-5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#161F30] border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 shadow-card cursor-pointer group flex flex-col justify-between overflow-hidden"
  >
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <Truck className="w-6 h-6" />
      </div>
      {pendingDirectOrders > 0 ? (
        <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-amber-400 text-slate-950 font-black rounded-full shadow-md animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
          {pendingDirectOrders} Perlu Dikirim
        </span>
      ) : (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
          Semua Terkirim
        </span>
      )}
    </div>

    <div className="mt-4">
      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
        Pesanan COD & Kurir Medan
      </span>
      <div className="font-display text-2xl sm:text-3xl font-black text-white mt-0.5 flex items-baseline gap-2">
        <span className="tabular-nums">{directOrders.length}</span>
        <span className="text-xs text-emerald-400/90 font-medium">pesanan aktif</span>
      </div>
    </div>
  </div>

  {/* Ready Stock */}
  <div className="p-5 rounded-2xl bg-surface-1 border border-white/5 shadow-card flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <span className="text-[10px] text-teal-400/80 font-bold px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
        {totalProducts > 0 ? Math.round((inStock / totalProducts) * 100) : 0}% Siap Kirim
      </span>
    </div>
    <div className="mt-4">
      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
        Ready Stock
      </span>
      <div className="font-display text-2xl sm:text-3xl font-black text-teal-400 mt-0.5 flex items-baseline gap-1.5">
        <span className="tabular-nums">{inStock}</span>
        <span className="text-xs text-slate-400 font-normal">/ {totalProducts} SKU</span>
      </div>
    </div>
  </div>

  {/* Inbox Requests */}
  <div
    onClick={() => setActiveTab('requests')}
    className="p-5 rounded-2xl bg-surface-1 border border-white/5 hover:border-indigo-500/40 transition-all shadow-card cursor-pointer flex flex-col justify-between group"
  >
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        <Clock className="w-6 h-6" />
      </div>
      {pendingRequests > 0 ? (
        <span className="px-2 py-0.5 text-[11px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 rounded-full">
          {pendingRequests} Unread
        </span>
      ) : (
        <span className="text-[10px] text-slate-500 font-medium">Kotak Masuk</span>
      )}
    </div>
    <div className="mt-4">
      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
        Inbox Request
      </span>
      <div className="font-display text-2xl sm:text-3xl font-black text-indigo-400 mt-0.5 flex items-baseline gap-1.5">
        <span className="tabular-nums">{pendingRequests}</span>
        <span className="text-xs text-slate-400 font-normal">permintaan</span>
      </div>
    </div>
  </div>
</div>
```

---

## 2. Product Manager Component (`src/admin/ProductManager.tsx`)

### Layout Highlights
- **Product Operations Toolbar**: Search bar, category filter, and modal triggers (`Tambah Produk Baru`, `Update Massal Stock`).
- **Responsive Admin Table**: Dense rows with thumbnail image preview, price tag, category pill, stock state controller, and action buttons (`Edit`, `Merchant Notes`, `Hapus`).

```tsx
// Product Table Header & Row Layout
<div className="overflow-x-auto rounded-xl border border-slate-800">
  <table className="w-full text-left text-xs text-slate-300">
    <thead className="bg-[#111827] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
      <tr>
        <th className="p-3">Produk</th>
        <th className="p-3">Kategori</th>
        <th className="p-3">Harga</th>
        <th className="p-3">Status Stok</th>
        <th className="p-3 text-right">Aksi</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-800 bg-[#0B0F19]">
      {/* Dynamic Product Row Mapping */}
    </tbody>
  </table>
</div>
```

---

## 3. Direct Orders & COD Pipeline (`src/admin/DirectOrderManager.tsx`)

### Layout Highlights
- **Status Stepper Workflow**: Pipeline tracking with 4 discrete order states:
  1. `Menunggu Konfirmasi` (Amber warning)
  2. `Diproses` (Sky blue info)
  3. `Dikirim / Kurir OTW` (Emerald active)
  4. `Selesai` (Green verified check)
- **Customer Identity & Map Location Card**: Pre-formatted customer recipient details, OpenStreetMap pin link, selected payment method (COD / Transfer / E-Wallet), and uploaded payment proof thumbnail preview.

```tsx
// Status Stepper Layout (DirectOrderManager.tsx)
<div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
  {STATUS_STEPS.map((step) => (
    <button
      key={step.id}
      onClick={() => updateOrderStatus(order.id, step.id)}
      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
        order.status === step.id
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'text-slate-400 hover:bg-slate-800'
      }`}
    >
      {step.label}
    </button>
  ))}
</div>
```

---

## 4. Shopee 1:1 Product Card Layout (`src/components/ProductCard.tsx`)

### Layout Specs
- **Square 1:1 Image Ratio**: Product images locked to `aspect-square` with `object-cover` and zero image distortion.
- **Liquid-Glass Badges & Scrim**:
  - Official Shop Ribbon (Emerald badge with `backdrop-blur-md`).
  - COD Medan badge (`Zap` icon + `COD Medan` in `bg-[#0B0F19]/80 backdrop-blur-md`).
  - Stock indicator badge (`Ready`, `Stok Terbatas`, `Habis`, or `Pre-Order`).
  - Out of stock liquid-glass overlay (`bg-slate-950/75 backdrop-blur-sm` with `Stok Habis` pill).
- **Product Title**: Clamped to 2 lines (`line-clamp-2`) for visual alignment across grid columns with high-contrast slate-200.
- **Price Tag**: Highlighted in `Outfit/display` font with IDR rupiah formatting.
- **Ergonomic Action Hierarchy (44–48px Touch Targets)**:
  - **Primary Action (Full Width)**: Dominant `Pesan Cepat (COD)` CTA button (`min-h-[44px] sm:min-h-[48px]`, emerald-to-teal gradient, active:scale-[0.98]).
  - **Secondary Action Row**: Direct marketplace buttons for Shopee (`#EE4D2D`) and Tokopedia (`#03AC0E`) with `min-h-[40px] sm:min-h-[44px]`.

```tsx
// Ergonomic Product Card Anatomy (ProductCard.tsx)
<div className="group relative rounded-2xl bg-md-surface-container border border-md-outline-variant hover:border-emerald-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-card hover:shadow-card-hover">
  {/* 1:1 Aspect Ratio Image Area with Liquid-Glass Overlay Badges */}
  <div className="relative aspect-square w-full overflow-hidden bg-md-surface-container-highest cursor-pointer select-none">
    <img
      src={product.image_url}
      alt={product.title}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
    />

    {/* Top Badges Stack */}
    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
      <span className="px-2 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-600/90 text-white rounded-lg shadow-sm backdrop-blur-md flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-200" />
        <span>Official</span>
      </span>

      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-xs backdrop-blur-md bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
        Ready
      </span>
    </div>

    {/* Out of Stock Liquid Glass Overlay */}
    {isOutOfStock && (
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3">
        <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 border border-rose-500/40 rounded-full shadow-lg">
          Stok Habis
        </span>
      </div>
    )}
  </div>

  {/* Card Content & Action Area */}
  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-3">
    <h3 className="font-sans text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
      {product.title}
    </h3>

    <div className="flex items-baseline justify-between pt-1">
      <div className="tabular-nums font-display text-sm sm:text-base font-black text-emerald-400">
        Rp {product.price.toLocaleString('id-ID')}
      </div>
      <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
        <Star className="w-3 h-3 fill-current" /> 4.9
      </span>
    </div>

    {/* Action Controls - Ergonomically Sized & Weighted */}
    <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
      {/* Primary Action Button (Direct COD / Fast Checkout) */}
      <button className="w-full min-h-[44px] sm:min-h-[48px] rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md active:scale-[0.98] flex items-center justify-center gap-2">
        <ShoppingBag className="w-4 h-4" />
        <span>Pesan Cepat (COD)</span>
      </button>

      {/* Secondary Marketplace Row (Shopee + Tokopedia) */}
      <div className="grid grid-cols-2 gap-2">
        <button className="min-h-[40px] sm:min-h-[44px] px-2.5 rounded-xl bg-[#EE4D2D]/10 text-[#EE4D2D] border border-[#EE4D2D]/30 active:scale-95 flex items-center justify-center gap-1 font-bold text-xs">
          <span>Shopee</span>
        </button>
        <button className="min-h-[40px] sm:min-h-[44px] px-2.5 rounded-xl bg-[#03AC0E]/10 text-[#03AC0E] border border-[#03AC0E]/30 active:scale-95 flex items-center justify-center gap-1 font-bold text-xs">
          <span>Tokopedia</span>
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## 5. Direct Order Checkout Modal (`src/components/DirectOrderModal.tsx`)

### Layout Specs
- **Glassmorphic Modal Container**: Level 3 modal backdrop (`rgba(17, 24, 39, 0.95)` with `backdrop-filter: blur(20px)`).
- **Address Autocomplete Bar**: Real-time location lookup using OpenStreetMap Nominatim API with instant pin selection.
- **Payment Method Selection**: Interactive cards for COD Medan, QRIS, Bank Transfer, and E-Wallets with file attachment input for payment proof receipts.

---

## 6. Component Design Guidelines & Grid Specifications

### Catalog Responsive Grid Breakdown
- **Mobile Feed (under 640px)**: 2 columns (`grid-cols-2 gap-3`).
- **Tablet / Small Laptop (640px - 1024px)**: 3 to 4 columns (`grid-cols-3 md:grid-cols-4 gap-4`).
- **Desktop High Density (1024px+)**: 5 columns (`lg:grid-cols-5 gap-4.5`).

### Accessibility & Interaction Standards
1. **Touch Target Size**: All interactive buttons, tabs, and inputs maintain a minimum `48px` or `44px` height with `active:scale-95` tap feedback.
2. **WCAG AAA Contrast**: Dark mode text uses `#FFFFFF` or `#CBD5E1` against `#111827` surfaces to exceed 7:1 contrast ratios.
3. **Optimized Animations**: Entrance effects use compositor-threaded CSS keyframes with `will-change: transform` to protect core Web Vitals (LCP/INP).

---

## 7. Native Jetpack Compose Layout Implementations

### A. Native Product Card (`NativeProductCard.kt`)

```kotlin
@Composable
fun NativeProductCard(
    imageUrl: String,
    title: String,
    price: Long,
    rating: Float,
    isCodMedan: Boolean,
    onShopeeClick: () -> Unit,
    onDirectCodClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp), // M3 Medium-Large Radius
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        border = CardDefaults.outlinedCardBorder().takeIf { 
            MaterialTheme.colorScheme.outline != Color.Transparent 
        }
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // 1:1 Locked Ratio Image Container
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1.0f)
                    .background(Color(0xFF0F172A))
            ) {
                Image(
                    painter = rememberAsyncImagePainter(model = imageUrl),
                    contentDescription = title,
                    contentScale = ContentScale.Cover,
                    modifier = Modifier.fillMaxSize()
                )

                // Native Badge Stack
                Column(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(8.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.primary,
                        contentColor = MaterialTheme.colorScheme.onPrimary
                    ) {
                        Text(
                            text = "OFFICIAL STORE",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Black,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    if (isCodMedan) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surface.copy(alpha = 0.85f),
                            contentColor = MaterialTheme.colorScheme.primary
                        ) {
                            Text(
                                text = "🚀 COD Medan",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }
            }

            // Content Body with 8dp Grid Padding
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp)
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Rp %,d".format(price).replace(',', '.'),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.primary
                    )

                    Text(
                        text = "⭐ $rating",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Action Targets with minimum 44-48dp height ergonomics
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onShopeeClick,
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp),
                        shape = RoundedCornerShape(50),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = ShopeeOrange,
                            contentColor = Color.White
                        ),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = "Shopee",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Button(
                        onClick = onDirectCodClick,
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp),
                        shape = RoundedCornerShape(50),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = MaterialTheme.colorScheme.onPrimary
                        ),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = "Direct COD",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
```

### B. Native Admin Dashboard & Order Pipeline (`NativeAdminDashboard.kt`)

```kotlin
package com.warungdewasa.ui.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

// Order Pipeline Status Step Definition
enum class OrderStep(val id: String, val label: String) {
    PENDING("pending", "Menunggu"),
    PROCESSING("processing", "Diproses"),
    SHIPPED("shipped", "Dikirim"),
    COMPLETED("completed", "Selesai")
}

data class OrderItem(
    val id: String,
    val customerName: String,
    val address: String,
    val paymentMethod: String,
    val currentStep: OrderStep
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(
    totalSku: Int = 124,
    readyStock: Int = 98,
    codOrders: Int = 12,
    newOrdersBadge: Int = 3,
    inboxRequests: Int = 5,
    orders: List<OrderItem>,
    onStepSelected: (orderId: String, step: OrderStep) -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Merchant Admin",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // KPI Metrics: 2x2 Mobile Ergonomic Grid
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        KpiTile(
                            title = "TOTAL SKU",
                            value = totalSku.toString(),
                            icon = Icons.Default.ShoppingCart,
                            iconTint = Color(0xFF0EA5E9), // Sky Blue Semantic
                            modifier = Modifier.weight(1f)
                        )
                        KpiTile(
                            title = "READY STOCK",
                            value = readyStock.toString(),
                            icon = Icons.Default.CheckCircle,
                            iconTint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        KpiTile(
                            title = "COD / KURIR",
                            value = codOrders.toString(),
                            badgeCount = newOrdersBadge,
                            icon = Icons.Default.DateRange,
                            iconTint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.weight(1f)
                        )
                        KpiTile(
                            title = "INBOX REQUEST",
                            value = inboxRequests.toString(),
                            icon = Icons.Default.Info,
                            iconTint = Color(0xFF818CF8), // Indigo Semantic
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            item {
                Text(
                    text = "Pesanan COD & Kurir",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            // Refactored Direct Order Manager Cards
            items(orders) { order ->
                OrderPipelineCard(
                    order = order,
                    onStepSelected = { step -> onStepSelected(order.id, step) }
                )
            }
        }
    }
}

/**
 * Native M3 KPI Metric Tile refactored from AdminDashboard.tsx
 */
@Composable
fun KpiTile(
    title: String,
    value: String,
    icon: ImageVector,
    iconTint: Color,
    modifier: Modifier = Modifier,
    badgeCount: Int = 0
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(
                        color = iconTint.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(12.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconTint,
                    modifier = Modifier.size(24.dp)
                )
            }

            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = value,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    if (badgeCount > 0) {
                        Surface(
                            shape = RoundedCornerShape(50),
                            color = Color(0xFFF59E0B), // Amber Semantic
                            contentColor = Color(0xFF0B0F19)
                        ) {
                            Text(
                                text = "$badgeCount Baru",
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Native Direct Order Card with Mobile Touch-Optimized Stepper Pipeline
 */
@Composable
fun OrderPipelineCard(
    order: OrderItem,
    onStepSelected: (OrderStep) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        border = BorderStroke(1.dp, Color(0x14FFFFFF))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header Row: Customer Name & Payment Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = order.customerName,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = order.address,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFF10B981).copy(alpha = 0.15f),
                    border = BorderStroke(1.dp, Color(0xFF10B981).copy(alpha = 0.3f))
                ) {
                    Text(
                        text = order.paymentMethod,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF34D399),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            // Segmented Pipeline Stepper (Touch height strictly >= 44dp)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        color = Color(0xFF0B0F19),
                        shape = RoundedCornerShape(14.dp)
                    )
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                OrderStep.values().forEach { step ->
                    val isSelected = order.currentStep == step
                    
                    val activeBg = when (step) {
                        OrderStep.PENDING -> Color(0xFFF59E0B)
                        OrderStep.PROCESSING -> Color(0xFF0EA5E9)
                        OrderStep.SHIPPED -> Color(0xFF10B981)
                        OrderStep.COMPLETED -> Color(0xFF059669)
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp) // Meets accessibility standard
                            .background(
                                color = if (isSelected) activeBg else Color.Transparent,
                                shape = RoundedCornerShape(10.dp)
                            )
                            .clickable { onStepSelected(step) },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = step.label,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium,
                            color = if (isSelected) Color(0xFF0B0F19) else Color(0xFF94A3B8)
                        )
                    }
                }
            }
        }
    }
}
```

