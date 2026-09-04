package com.warungdewasa.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.warungdewasa.ui.theme.ShopeeOrange

/**
 * Native Android 1:1 Aspect Ratio Product Card component
 * Grounded in Material 3 Tonal Elevation & Ergonomic 8dp Spatial Grid
 */
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
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        border = CardDefaults.outlinedCardBorder().takeIf { 
            MaterialTheme.colorScheme.outline != Color.Transparent 
        }
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // 1:1 Aspect Ratio Image Container
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

                // Native Badge Overlay Stack
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

            // Card Body Content (8dp & 12dp Spatial Padding)
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

                // Dual Marketplace CTAs (Minimum 44dp Touch Targets)
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
