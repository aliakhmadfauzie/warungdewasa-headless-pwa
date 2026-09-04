package com.warungdewasa.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.List
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.warungdewasa.ui.admin.AdminDashboardScreen
import com.warungdewasa.ui.admin.OrderItem
import com.warungdewasa.ui.admin.OrderStep
import com.warungdewasa.ui.catalog.NativeCatalogScreen
import com.warungdewasa.ui.catalog.CatalogItem
import com.warungdewasa.ui.theme.WarungDewasaNativeTheme

// ─── Bottom Navigation Destinations ───────────────────────────────────────────
enum class AppDestination(
    val label: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    CATALOG(
        label = "Katalog",
        selectedIcon = Icons.Filled.Home,
        unselectedIcon = Icons.Outlined.Home
    ),
    ORDERS(
        label = "Pesanan",
        selectedIcon = Icons.Filled.ShoppingCart,
        unselectedIcon = Icons.Outlined.ShoppingCart
    ),
    ADMIN(
        label = "Admin",
        selectedIcon = Icons.Filled.List,
        unselectedIcon = Icons.Outlined.List
    )
}

// ─── Root Activity ─────────────────────────────────────────────────────────────
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Edge-to-edge rendering — content draws behind system bars
        enableEdgeToEdge()

        setContent {
            WarungDewasaNativeTheme {
                WarungDewasaApp()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WarungDewasaApp() {
    var currentTab by remember { mutableStateOf(AppDestination.CATALOG) }

    // Placeholder state — replace with ViewModel in production
    val sampleOrders = remember {
        listOf(
            OrderItem(
                id = "ORD-001",
                customerName = "Budi Santoso",
                address = "Jl. Setia Budi No. 12, Medan",
                paymentMethod = "COD",
                currentStep = OrderStep.PENDING
            ),
            OrderItem(
                id = "ORD-002",
                customerName = "Siti Rahayu",
                address = "Jl. Gatot Subroto No. 45, Medan",
                paymentMethod = "Transfer BCA",
                currentStep = OrderStep.PROCESSING
            )
        )
    }

    val sampleCatalog = remember {
        listOf(
            CatalogItem(
                id = "SKU-001",
                title = "Sample Product A",
                price = 150_000L,
                rating = 4.8f,
                imageUrl = "https://via.placeholder.com/300",
                isCodAvailable = true
            ),
            CatalogItem(
                id = "SKU-002",
                title = "Sample Product B",
                price = 89_000L,
                rating = 4.5f,
                imageUrl = "https://via.placeholder.com/300",
                isCodAvailable = true
            )
        )
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.surface,
        bottomBar = {
            // M3 NavigationBar with tonal indicator pill (auto-applied by M3)
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 0.dp // Rely on surface tonal elevation, not shadow
            ) {
                AppDestination.values().forEach { destination ->
                    val isSelected = currentTab == destination
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { currentTab = destination },
                        icon = {
                            Icon(
                                imageVector = if (isSelected) destination.selectedIcon
                                              else destination.unselectedIcon,
                                contentDescription = destination.label
                            )
                        },
                        label = { Text(destination.label) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor   = MaterialTheme.colorScheme.onSecondaryContainer,
                            indicatorColor      = MaterialTheme.colorScheme.secondaryContainer,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        // Crossfade between tabs with a lightweight fade transition
        AnimatedContent(
            targetState = currentTab,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            transitionSpec = {
                fadeIn(animationSpec = tween(180)) togetherWith
                fadeOut(animationSpec = tween(120))
            },
            label = "TabTransition"
        ) { tab ->
            when (tab) {
                AppDestination.CATALOG -> NativeCatalogScreen(
                    items = sampleCatalog,
                    onShopeeClick = { /* TODO: open Shopee URL */ },
                    onDirectCodClick = { /* TODO: open COD order modal */ }
                )
                AppDestination.ORDERS -> AdminDashboardScreen(
                    orders = sampleOrders,
                    onStepSelected = { _, _ -> /* TODO: update order status */ }
                )
                AppDestination.ADMIN -> AdminDashboardScreen(
                    orders = sampleOrders,
                    onStepSelected = { _, _ -> /* TODO: update order status */ }
                )
            }
        }
    }
}
