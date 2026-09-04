package com.warungdewasa.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ─────────────────────────────────────────────────────────────────────────────
// 1. CUSTOM BRAND EXTENSION TOKEN
//    Marketplace colors (Shopee, Tokopedia) live outside the M3 palette so they
//    survive dynamic wallpaper color schemes without being remapped by the
//    tonal palette algorithm. Consumed via LocalExtendedColors.current.
// ─────────────────────────────────────────────────────────────────────────────
@Immutable
data class ExtendedMarketplaceColors(
    val shopee: Color        = Color(0xFFEE4D2D),
    val onShopee: Color      = Color.White,
    val tokopedia: Color     = Color(0xFF03AC0E),
    val onTokopedia: Color   = Color.White,
    val amberBadge: Color    = Color(0xFFF59E0B),  // "RESMI" warning badges
    val onAmberBadge: Color  = Color(0xFF0B0F19)
)

val LocalExtendedColors = staticCompositionLocalOf { ExtendedMarketplaceColors() }

// ─────────────────────────────────────────────────────────────────────────────
// 2. REFERENCE TOKENS (ref layer)
//    Raw color values — never used directly in components. Only the sys-layer
//    color scheme assignments below reference these.
// ─────────────────────────────────────────────────────────────────────────────

// Emerald brand palette
private val Emerald10  = Color(0xFF00261B)
private val Emerald20  = Color(0xFF003825)
private val Emerald30  = Color(0xFF00523A)
private val Emerald40  = Color(0xFF006C4C)  // Light primary
private val Emerald80  = Color(0xFF34D399)  // Dark primary (mint)
private val Emerald90  = Color(0xFFA7F3D0)
private val Emerald95  = Color(0xFFD1FAE5)
private val Emerald99  = Color(0xFFF8FAF9)

// Slate neutral palette
private val Slate05    = Color(0xFF070A11)
private val Slate08    = Color(0xFF0B0F19)  // Dark canvas
private val Slate10    = Color(0xFF0F1524)
private val Slate15    = Color(0xFF111827)  // Dark surface container
private val Slate20    = Color(0xFF161F30)  // Dark surfaceVariant
private val Slate30    = Color(0xFF1B2438)  // Dark surfaceContainerHigh
private val Slate40    = Color(0xFF25314C)  // Dark surfaceContainerHighest
private val Slate60    = Color(0xFF64748B)  // Light onSurfaceVariant
private val Slate70    = Color(0xFF8A938C)
private val Slate80    = Color(0xFF94A3B8)  // Dark onSurfaceVariant
private val Slate90    = Color(0xFFCBD5E1)
private val Slate95    = Color(0xFFE2E8F0)
private val Slate98    = Color(0xFFF1F5F9)  // Light surfaceContainerHigh
private val Slate99    = Color(0xFFF8FAF9)
private val SlateWhite = Color(0xFFFFFFFF)

// Secondary teal-green palette
private val Teal40     = Color(0xFF4C6356)
private val Teal80     = Color(0xFFB3CCBC)
private val Teal90     = Color(0xFFCEE9D8)
private val TealDark20 = Color(0xFF092015)
private val TealDark30 = Color(0xFF1E352A)
private val TealDark40 = Color(0xFF354C3F)

// Tertiary teal-blue palette
private val Blue40     = Color(0xFF3D6373)
private val Blue80     = Color(0xFFA5CCDF)
private val Blue90     = Color(0xFFC1E8FB)
private val BlueDark10 = Color(0xFF001F2A)
private val BlueDark20 = Color(0xFF073544)
private val BlueDark30 = Color(0xFF244C5B)

// Error palette
private val Red40      = Color(0xFFBA1A1A)
private val Red80      = Color(0xFFFFB4AB)
private val Red90      = Color(0xFFFFDAD6)
private val RedDark10  = Color(0xFF410002)
private val RedDark20  = Color(0xFF690005)
private val RedDark30  = Color(0xFF93000A)

// ─────────────────────────────────────────────────────────────────────────────
// 3. SYSTEM COLOR SCHEMES (sys layer)
//    Full 28-role M3 color scheme — no role left unmapped.
//    Surface container ladder replaces web glassmorphism z-levels.
// ─────────────────────────────────────────────────────────────────────────────
private val WarungLightColorScheme = lightColorScheme(
    // Primary — Emerald brand
    primary              = Emerald40,
    onPrimary            = SlateWhite,
    primaryContainer     = Emerald95,
    onPrimaryContainer   = Emerald10,
    // Secondary — Muted teal (supporting UI chrome)
    secondary            = Teal40,
    onSecondary          = SlateWhite,
    secondaryContainer   = Teal90,
    onSecondaryContainer = TealDark20,
    // Tertiary — Teal-blue (info badges, highlights)
    tertiary             = Blue40,
    onTertiary           = SlateWhite,
    tertiaryContainer    = Blue90,
    onTertiaryContainer  = BlueDark10,
    // Error — Red (delete swipe, stock warnings)
    error                = Red40,
    onError              = SlateWhite,
    errorContainer       = Red90,
    onErrorContainer     = RedDark10,
    // Surface hierarchy (replaces CSS z-index + backdrop-filter ladder)
    surface                  = Slate99,         // Base canvas
    onSurface                = Color(0xFF191C1A),
    surfaceVariant           = Color(0xFFDBE5DE),
    onSurfaceVariant         = Color(0xFF404944),
    surfaceContainerLowest   = SlateWhite,      // Sheets dragged to top
    surfaceContainerLow      = Color(0xFFF2F5F3),
    surfaceContainer         = Color(0xFFECEFED), // Default card bg
    surfaceContainerHigh     = Slate98,         // Elevated cards
    surfaceContainerHighest  = Color(0xFFE0E4E1), // Image placeholders
    // Outline (no raw alpha borders — use semantic roles)
    outline              = Color(0xFF707973),   // Interactive dividers
    outlineVariant       = Color(0xFFBFC9C2),   // Decorative separators
    // Inverse
    inverseSurface       = Color(0xFF2D312E),
    inverseOnSurface     = Color(0xFFF0F1EC),
    inversePrimary       = Emerald80
)

private val WarungDarkColorScheme = darkColorScheme(
    // Primary — Mint on dark
    primary              = Emerald80,
    onPrimary            = Emerald20,
    primaryContainer     = Emerald30,
    onPrimaryContainer   = Emerald90,
    // Secondary
    secondary            = Teal80,
    onSecondary          = TealDark30,
    secondaryContainer   = TealDark40,
    onSecondaryContainer = Teal90,
    // Tertiary
    tertiary             = Blue80,
    onTertiary           = BlueDark20,
    tertiaryContainer    = BlueDark30,
    onTertiaryContainer  = Blue90,
    // Error
    error                = Red80,
    onError              = RedDark20,
    errorContainer       = RedDark30,
    onErrorContainer     = Red90,
    // Surface hierarchy (dark z-levels replace glassmorphism blur stacks)
    surface                  = Slate08,         // #0B0F19 — base canvas
    onSurface                = Color(0xFFE1E3DF),
    surfaceVariant           = Slate20,         // #161F30 — variant containers
    onSurfaceVariant         = Color(0xFFC0C9C2),
    surfaceContainerLowest   = Slate05,         // #070A11 — deepest trough
    surfaceContainerLow      = Slate10,         // #0F1524
    surfaceContainer         = Slate15,         // #111827 — default card bg
    surfaceContainerHigh     = Slate30,         // #1B2438 — elevated cards
    surfaceContainerHighest  = Slate40,         // #25314C — image placeholders
    // Outline (no raw 0x14FFFFFF borders)
    outline              = Slate70,
    outlineVariant       = Color(0xFF404944),
    // Inverse
    inverseSurface       = Color(0xFFE1E3DF),
    inverseOnSurface     = Color(0xFF2D312E),
    inversePrimary       = Emerald40
)

// ─────────────────────────────────────────────────────────────────────────────
// 4. TYPOGRAPHY SCALE (15 M3 type roles)
//    Currency values use `fontFeatureSettings = "tnum"` at usage site.
//    LineHeightStyle.Trim eliminates excess leading on display text.
// ─────────────────────────────────────────────────────────────────────────────
val WarungTypography = Typography(
    // Display — large KPI metric values on admin dashboard
    headlineLarge = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Black,
        fontSize      = 32.sp,
        lineHeight    = 40.sp,
        letterSpacing = (-0.5).sp,
        lineHeightStyle = LineHeightStyle(
            alignment = LineHeightStyle.Alignment.Center,
            trim      = LineHeightStyle.Trim.Both
        )
    ),
    headlineMedium = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Black,
        fontSize      = 28.sp,
        lineHeight    = 36.sp,
        letterSpacing = (-0.3).sp
    ),
    // Metric counts, admin tile figures
    headlineSmall = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Bold,
        fontSize      = 24.sp,
        lineHeight    = 32.sp,
        letterSpacing = 0.sp,
        lineHeightStyle = LineHeightStyle(
            alignment = LineHeightStyle.Alignment.Bottom,
            trim      = LineHeightStyle.Trim.Both
        )
    ),
    // TopAppBar, screen titles
    titleLarge = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Bold,
        fontSize      = 22.sp,
        lineHeight    = 28.sp,
        letterSpacing = 0.sp
    ),
    // Product price tags — pair with fontFeatureSettings("tnum") at usage site
    titleMedium = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.SemiBold,
        fontSize      = 16.sp,
        lineHeight    = 24.sp,
        letterSpacing = 0.15.sp
    ),
    titleSmall = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.SemiBold,
        fontSize      = 14.sp,
        lineHeight    = 20.sp,
        letterSpacing = 0.1.sp
    ),
    // Product title body text (2-line clamped)
    bodyLarge = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Normal,
        fontSize      = 16.sp,
        lineHeight    = 24.sp,
        letterSpacing = 0.5.sp
    ),
    bodyMedium = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Normal,
        fontSize      = 14.sp,
        lineHeight    = 20.sp,
        letterSpacing = 0.25.sp
    ),
    bodySmall = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Normal,
        fontSize      = 12.sp,
        lineHeight    = 16.sp,
        letterSpacing = 0.4.sp
    ),
    // CTA buttons (Shopee, Direct COD) — always 48dp height minimum
    labelLarge = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Bold,
        fontSize      = 14.sp,
        lineHeight    = 20.sp,
        letterSpacing = 0.1.sp
    ),
    // FilterChip labels, category pills
    labelMedium = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.SemiBold,
        fontSize      = 12.sp,
        lineHeight    = 16.sp,
        letterSpacing = 0.5.sp
    ),
    // Timestamps, stock counts, "Admin Aktif" badge text
    labelSmall = TextStyle(
        fontFamily    = FontFamily.SansSerif,
        fontWeight    = FontWeight.Medium,
        fontSize      = 11.sp,
        lineHeight    = 16.sp,
        letterSpacing = 0.5.sp
    )
)

// ─────────────────────────────────────────────────────────────────────────────
// 5. SHAPE SCALE
//    Maps web border-radius conventions to 5 discrete M3 shape slots.
//    Components reference shapes via MaterialTheme.shapes.small, etc.
// ─────────────────────────────────────────────────────────────────────────────
val WarungShapes = Shapes(
    extraSmall = RoundedCornerShape(4.dp),   // Dense chips, inner badges
    small      = RoundedCornerShape(8.dp),   // FilterChip, category pills
    medium     = RoundedCornerShape(12.dp),  // Thumbnails, input fields
    large      = RoundedCornerShape(16.dp),  // Product cards, order cards
    extraLarge = RoundedCornerShape(28.dp)   // FAB, bottom sheets, dialogs
)

// ─────────────────────────────────────────────────────────────────────────────
// 6. ROOT THEME COMPOSABLE
//    Provides: M3 MaterialTheme + CompositionLocal for extended brand colors.
//    All screens must be wrapped in WarungDewasaTheme at the Activity level.
// ─────────────────────────────────────────────────────────────────────────────
@Composable
fun WarungDewasaTheme(
    darkTheme: Boolean    = isSystemInDarkTheme(),
    // Android 12+ (API 31+) dynamic wallpaper color extraction
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else           dynamicLightColorScheme(context)
        }
        darkTheme -> WarungDarkColorScheme
        else      -> WarungLightColorScheme
    }

    // Provide extended marketplace brand tokens alongside M3 scheme
    CompositionLocalProvider(
        LocalExtendedColors provides ExtendedMarketplaceColors()
    ) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography  = WarungTypography,
            shapes      = WarungShapes,
            content     = content
        )
    }
}
