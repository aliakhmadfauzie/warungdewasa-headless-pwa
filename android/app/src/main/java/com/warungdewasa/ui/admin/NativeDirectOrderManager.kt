package com.warungdewasa.ui.admin

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

enum class OrderStatus(val label: String) {
    PENDING("Menunggu Konfirmasi"),
    PROCESSING("Diproses"),
    SHIPPED("Dikirim / Kurir OTW"),
    COMPLETED("Selesai")
}

/**
 * Direct Order Pipeline card component in Jetpack Compose
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NativeOrderPipelineCard(
    orderId: String,
    customerName: String,
    phone: String,
    address: String,
    paymentMethod: String,
    currentStatus: OrderStatus,
    onStatusChange: (OrderStatus) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Customer Header Details
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = customerName,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "📱 $phone",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.secondaryContainer
                ) {
                    Text(
                        text = paymentMethod,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Text(
                text = "📍 $address",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Divider(color = MaterialTheme.colorScheme.outline)

            // Status Stepper Chips
            Text(
                text = "Status Pesanan:",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.SemiBold
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                OrderStatus.values().forEach { step ->
                    val isSelected = currentStatus == step
                    FilterChip(
                        selected = isSelected,
                        onClick = { onStatusChange(step) },
                        label = {
                            Text(
                                text = step.label,
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}
