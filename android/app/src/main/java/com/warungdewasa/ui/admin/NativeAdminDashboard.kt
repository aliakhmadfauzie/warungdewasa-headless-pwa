package com.warungdewasa.ui.admin

import androidx.compose.foundation.BorderStroke
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
import androidx.compose.ui.text.style.TextOverflow
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
