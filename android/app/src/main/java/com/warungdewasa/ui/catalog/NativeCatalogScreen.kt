package com.warungdewasa.ui.catalog

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.warungdewasa.ui.components.NativeProductCard

data class CatalogItem(
    val id: String,
    val title: String,
    val price: Long,
    val rating: Float,
    val imageUrl: String,
    val isCodAvailable: Boolean
)

/**
 * Native 2-column catalog screen replacing the PWA's
 * `grid-cols-2 lg:grid-cols-4` CSS grid.
 *
 * Spatial rules:
 *   - Outer screen padding: 16dp
 *   - Inter-card gap: 12dp horizontal & vertical (8dp rhythm)
 *   - LazyVerticalGrid key-tracked for smooth recomposition
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NativeCatalogScreen(
    items: List<CatalogItem>,
    onShopeeClick: (CatalogItem) -> Unit,
    onDirectCodClick: (CatalogItem) -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Warung Dewasa",
                        style = MaterialTheme.typography.titleLarge
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { innerPadding ->
        if (items.isEmpty()) {
            // Empty state — avoids blank screen on first load
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = androidx.compose.ui.Alignment.Center
            ) {
                Text(
                    text = "Produk belum tersedia",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(
                    items = items,
                    key = { it.id }
                ) { item ->
                    NativeProductCard(
                        imageUrl = item.imageUrl,
                        title = item.title,
                        price = item.price,
                        rating = item.rating,
                        isCodMedan = item.isCodAvailable,
                        onShopeeClick = { onShopeeClick(item) },
                        onDirectCodClick = { onDirectCodClick(item) }
                    )
                }
            }
        }
    }
}
