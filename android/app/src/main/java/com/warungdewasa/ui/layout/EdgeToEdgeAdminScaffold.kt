package com.warungdewasa.ui.layout

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.warungdewasa.ui.motion.bounceClick

// ─────────────────────────────────────────────────────────────────────────────
// EDGE-TO-EDGE ADAPTIVE SCAFFOLD
// ─────────────────────────────────────────────────────────────────────────────
/**
 * EdgeToEdgeAdminScaffold
 *
 * Replaces PWA CSS safe-area workarounds (`padding: env(safe-area-inset-*)`)
 * with Compose WindowInsets-aware layout:
 *
 *   - contentWindowInsets = WindowInsets.safeDrawing
 *     → Content draws behind status and navigation bars (edge-to-edge).
 *     → Scaffold distributes insets to children via innerPadding.
 *
 *   - TopAppBar.windowInsets = WindowInsets.statusBars
 *     → AppBar intrinsically absorbs the status bar height, avoiding double-pad.
 *
 *   - FAB modifier: .navigationBarsPadding()
 *     → FAB floats above the gesture navigation bar on gesture-nav devices.
 *     → Has no effect on 3-button nav devices (zero inset → zero extra padding).
 *
 *   - imePadding() should be applied to scrollable content (LazyColumn, TextField
 *     hosts) inside [content] to shift layout above the software keyboard.
 *
 * Usage:
 *   EdgeToEdgeAdminScaffold(onAddNewProduct = { navController.navigate("add") }) { padding ->
 *       ProductManagerScreen(modifier = Modifier.padding(padding))
 *   }
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EdgeToEdgeAdminScaffold(
    title: String = "Warung Dewasa Admin",
    onAddNewProduct: () -> Unit,
    content: @Composable (PaddingValues) -> Unit
) {
    Scaffold(
        modifier = Modifier.fillMaxSize(),
        // safeDrawing = statusBars + navigationBars + displayCutout
        // Gives Scaffold full knowledge of all system insets so it can
        // correctly position TopAppBar, FAB, and content without overlap.
        contentWindowInsets = WindowInsets.safeDrawing,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleLarge
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    // Default state — no elevation tint on scroll start
                    containerColor = MaterialTheme.colorScheme.surface,
                    // Scrolled state — surfaceContainer adds tonal depth without shadow
                    scrolledContainerColor = MaterialTheme.colorScheme.surfaceContainer
                ),
                // Absorbs status bar height — prevents TopAppBar from rendering
                // behind the status bar on edge-to-edge displays
                windowInsets = WindowInsets.statusBars
            )
        },
        floatingActionButton = {
            // M3 FAB — rounded rectangle (shapes.large = 16dp) per M3 spec.
            // bounceClick wraps the FAB's onClick with spring press feedback
            // (scale 0.96 on touch → snap back on lift) before the click fires.
            FloatingActionButton(
                onClick = {}, // real onClick is consumed by bounceClick's pointerInput
                shape = MaterialTheme.shapes.large,
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                contentColor   = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier
                    .bounceClick { onAddNewProduct() }
                    // navigationBarsPadding ensures FAB does not sit behind the
                    // gesture handle or 3-button nav bar
                    .navigationBarsPadding()
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Tambah Produk"
                )
            }
        }
    ) { innerPadding ->
        // innerPadding is the aggregated inset-aware padding from Scaffold.
        // Pass it to [content] — do NOT re-add safeDrawing or statusBars here,
        // as Scaffold already accounted for them via contentWindowInsets above.
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.surface)
        ) {
            content(innerPadding)
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// KEYBOARD-AWARE CONTENT WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
/**
 * ImeAwareContent — wraps any scrollable list or form that contains a TextField.
 *
 * Applies imePadding() so the software keyboard slides the content up rather
 * than overlapping it. Pair with Scaffold's [innerPadding] for correct stacking.
 *
 * Usage (inside EdgeToEdgeAdminScaffold content lambda):
 *   ImeAwareContent {
 *       LazyColumn { ... }
 *   }
 */
@Composable
fun ImeAwareContent(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            // imePadding shifts the bottom of this box upward by the keyboard height,
            // keeping TextFields and action buttons visible above the IME.
            .imePadding()
    ) {
        content()
    }
}
