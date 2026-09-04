package com.warungdewasa.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.warungdewasa.ui.theme.LocalExtendedColors

/**
 * RefactoredProductCard — M3 compliant product card.
 *
 * Architectural improvements over NativeProductCard:
 *   - Replaces raw Color(0xFF0F172A) image placeholder with surfaceContainerHighest
 *   - No alpha borders (0x14FFFFFF) — M3 ElevatedCard handles depth via tonal layer
 *   - Tabular numeral feature setting ("tnum") on price prevents layout shift
 *   - Marketplace brand colors (Shopee, Direct COD) sourced from LocalExtendedColors,
 *     surviving dynamic wallpaper color changes without remapping
 *   - 48dp minimum height enforced on both CTA buttons
 *   - minLines = 2 on title anchors all card heights to uniform grid rows
 */
@Composable
fun RefactoredProductCard(
    imageUrl: String,
    title: String,
    price: Long,
    rating: Float,
    isCodMedan: Boolean,
    onShopeeClick: () -> Unit,
    onDirectCodClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val extendedColors = LocalExtendedColors.current

    ElevatedCard(
        modifier = modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.large,   // 16dp — M3 card standard
        colors = CardDefaults.elevatedCardColors(
            // surfaceContainer replaces raw #111827 hardcoded bg
            containerColor = MaterialTheme.colorScheme.surfaceContainer
        ),
        elevation = CardDefaults.elevatedCardElevation(
            defaultElevation = 1.dp,
            pressedElevation = 3.dp
        )
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {

            // ── Image Container ──────────────────────────────────────────────
            // 1:1 aspect ratio preserves grid alignment in LazyVerticalGrid.
            // surfaceContainerHighest replaces raw Color(0xFF0F172A) placeholder.
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .background(MaterialTheme.colorScheme.surfaceContainerHighest)
            ) {
                Image(
                    painter = rememberAsyncImagePainter(model = imageUrl),
                    contentDescription = title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // ── Badge Stack ──────────────────────────────────────────────
                // Positioned at TopStart — 8dp from edges (chip → label role)
                Column(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(8.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    // "OFFICIAL STORE" — primary container badge (8dp shape.small)
                    Surface(
                        shape = MaterialTheme.shapes.small,
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

                    // "COD Medan" — surfaceContainerHighest chip (90% alpha avoids
                    // raw alpha border hack; blur would require GPU compositing layer)
                    if (isCodMedan) {
                        Surface(
                            shape = MaterialTheme.shapes.small,
                            color = MaterialTheme.colorScheme.surfaceContainerHighest
                                .copy(alpha = 0.90f),
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

            // ── Card Body ────────────────────────────────────────────────────
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(0.dp)
            ) {

                // Product Title — 2-line clamp + minLines = 2 anchors card height
                // across grid rows, preventing staggered bottom alignment.
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 2,
                    minLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Price — tabular numerals prevent layout shift on state change.
                    // "tnum" is a standard OpenType feature tag for tabular figures.
                    Text(
                        text = "Rp %,d".format(price).replace(',', '.'),
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontFeatureSettings = "tnum"
                        ),
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.primary
                    )

                    // Rating chip — labelSmall, onSurfaceVariant (muted)
                    Text(
                        text = "⭐ ${"%.1f".format(rating)}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // ── Action Buttons — 48dp minimum touch target ───────────────
                // Shopee: brand color from LocalExtendedColors (not remapped by
                //   dynamic color algorithm, preserving marketplace identity).
                // Direct COD: primary role (emerald or wallpaper-derived).
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onShopeeClick,
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp),
                        shape = RoundedCornerShape(50),   // pill — M3 filled button
                        colors = ButtonDefaults.buttonColors(
                            containerColor = extendedColors.shopee,
                            contentColor   = extendedColors.onShopee
                        ),
                        contentPadding = PaddingValues(horizontal = 4.dp)
                    ) {
                        Text(
                            text = "Shopee",
                            style = MaterialTheme.typography.labelLarge
                        )
                    }

                    Button(
                        onClick = onDirectCodClick,
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp),
                        shape = RoundedCornerShape(50),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor   = MaterialTheme.colorScheme.onPrimary
                        ),
                        contentPadding = PaddingValues(horizontal = 4.dp)
                    ) {
                        Text(
                            text = "Direct COD",
                            style = MaterialTheme.typography.labelLarge
                        )
                    }
                }
            }
        }
    }
}
