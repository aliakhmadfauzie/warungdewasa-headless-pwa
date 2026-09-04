package com.warungdewasa.ui.admin

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter

data class ManagedProduct(
    val id: String,
    val title: String,
    val category: String,
    val price: Long,
    val stockCount: Int,
    val imageUrl: String
)

/**
 * Native Mobile Product Manager Screen
 * Replaces web <table> rows with ergonomic LazyColumn cards,
 * swipe-to-dismiss gestures, M3 FilterChip category carousel,
 * and M3 OutlinedTextField search bar.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductManagerScreen(
    products: List<ManagedProduct>,
    categories: List<String>,
    onProductClick: (ManagedProduct) -> Unit,
    onDeleteProduct: (ManagedProduct) -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Semua") }

    // Derived filtered list — avoids redundant recompositions
    val filteredProducts = remember(products, searchQuery, selectedCategory) {
        products.filter { product ->
            (selectedCategory == "Semua" || product.category == selectedCategory) &&
            product.title.contains(searchQuery, ignoreCase = true)
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Katalog Produk",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // M3 Native Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Cari produk atau SKU...") },
                leadingIcon = {
                    Icon(Icons.Default.Search, contentDescription = "Cari")
                },
                singleLine = true,
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Horizontal Category FilterChip Carousel
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(listOf("Semua") + categories) { category ->
                    val isSelected = category == selectedCategory
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = category },
                        label = {
                            Text(
                                text = category,
                                style = MaterialTheme.typography.labelMedium
                            )
                        },
                        shape = RoundedCornerShape(8.dp),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primary,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimary,
                            containerColor = MaterialTheme.colorScheme.surfaceVariant,
                            labelColor = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }
            }

            // Count label
            Text(
                text = "${filteredProducts.size} produk ditemukan",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
            )

            // Adaptive Product List — replaces web <table>/<tbody>
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(
                    items = filteredProducts,
                    key = { it.id }
                ) { product ->
                    SwipeableProductItem(
                        product = product,
                        onClick = { onProductClick(product) },
                        onDelete = { onDeleteProduct(product) }
                    )
                }
            }
        }
    }
}

/**
 * Swipe-to-Dismiss product card with:
 *   - Animated red delete background on swipe left
 *   - Thumbnail image (64dp square, 12dp radius)
 *   - Title, price, category chip, stock indicator
 *   - Edit IconButton CTA (minimum 48dp touch target)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SwipeableProductItem(
    product: ManagedProduct,
    onClick: () -> Unit,
    onDelete: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = { value ->
            if (value == SwipeToDismissBoxValue.EndToStart) {
                onDelete()
                true
            } else {
                false
            }
        }
    )

    SwipeToDismissBox(
        state = dismissState,
        modifier = modifier,
        enableDismissFromStartToEnd = false,
        backgroundContent = {
            // Animated delete background (surfaceVariant → error color)
            val bgColor by animateColorAsState(
                targetValue = if (dismissState.targetValue == SwipeToDismissBoxValue.EndToStart) {
                    MaterialTheme.colorScheme.error
                } else {
                    MaterialTheme.colorScheme.surfaceVariant
                },
                label = "SwipeBgColor"
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .clip(RoundedCornerShape(16.dp))
                    .background(bgColor)
                    .padding(horizontal = 20.dp),
                contentAlignment = Alignment.CenterEnd
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Hapus Produk",
                    tint = MaterialTheme.colorScheme.onError
                )
            }
        }
    ) {
        // Product Item Card
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            ),
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onClick() }
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Thumbnail: 64dp × 64dp, 12dp radius
                Image(
                    painter = rememberAsyncImagePainter(model = product.imageUrl),
                    contentDescription = product.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(64.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF0F172A))
                )

                // Product Metadata Column
                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = product.title,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )

                    Text(
                        text = "Rp %,d".format(product.price).replace(',', '.'),
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.primary
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Category chip (secondaryContainer)
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = MaterialTheme.colorScheme.secondaryContainer,
                            contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                        ) {
                            Text(
                                text = product.category,
                                style = MaterialTheme.typography.labelSmall,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }

                        // Stock badge — green when safe, error red when low
                        val stockColor = if (product.stockCount > 5) {
                            MaterialTheme.colorScheme.primary
                        } else {
                            MaterialTheme.colorScheme.error
                        }
                        Text(
                            text = "Stok: ${product.stockCount}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = stockColor
                        )
                    }
                }

                // Edit IconButton (48dp touch target via default IconButton sizing)
                IconButton(onClick = onClick) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "Edit Produk",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}
