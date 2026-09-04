package com.warungdewasa.ui.motion

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.Spring
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput

// ─────────────────────────────────────────────────────────────────────────────
// M3 SPRING MOTION COMPOSITE TOKENS
// Maps M3 expressive motion spec to Compose spring animationSpec params.
// Used by all interactive surfaces — cards, FABs, chips, swipe items.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `spatial.expressive.fast` — Item insertions, swipe-dismiss confirmations.
 * Damping ~0.8 · Duration ~350ms equivalent.
 * Allows a small natural overshoot, appropriate for appearing elements.
 */
val SpringSpatialFast = spring<Float>(
    dampingRatio = 0.8f,
    stiffness    = 400f
)

/**
 * `spatial.expressive.default` — Modal bottom sheet expand/collapse.
 * Damping ~0.7 · Duration ~500ms equivalent.
 * Moderate bounce for full-screen layout transitions.
 */
val SpringSpatialDefault = spring<Float>(
    dampingRatio = 0.7f,
    stiffness    = 300f
)

/**
 * `effects.expressive.fast` — Button/card press feedback scale.
 * Damping = 1.0 (critically damped, NoBouncy) · Duration ~150ms equivalent.
 * No overshoot — clean, crisp haptic-style response for micro-interactions.
 */
val SpringEffectsFast = spring<Float>(
    dampingRatio = Spring.DampingRatioNoBouncy,
    stiffness    = Spring.StiffnessMedium  // 400f — matches effects.expressive.fast
)

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE MODIFIERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * bounceClick — M3 expressive press feedback for any touchable surface.
 *
 * Replaces CSS `transition: transform 0.15s ease` with spring physics.
 * The scale animates DOWN on finger contact and snaps BACK on lift or cancel,
 * using SpringEffectsFast (critically damped, no visual overshoot).
 *
 * Usage:
 *   Card(modifier = Modifier.bounceClick { viewModel.onProductTap(item) })
 *
 * @param scaleDownFactor Target scale on press (default 0.96 → 4% shrink)
 * @param onClick         Action to invoke on confirmed tap
 */
fun Modifier.bounceClick(
    scaleDownFactor: Float = 0.96f,
    onClick: () -> Unit
): Modifier = composed {
    var isPressed by remember { mutableStateOf(false) }

    val scale by animateFloatAsState(
        targetValue   = if (isPressed) scaleDownFactor else 1f,
        animationSpec = SpringEffectsFast,
        label         = "BounceClickScale"
    )

    this
        .graphicsLayer {
            scaleX = scale
            scaleY = scale
        }
        .pointerInput(onClick) {
            // awaitEachGesture restarts gesture detection after each complete gesture,
            // preventing pointer state from leaking across multiple taps.
            awaitEachGesture {
                awaitFirstDown(requireUnconsumed = false)
                isPressed = true
                val upOrCancel = waitForUpOrCancellation()
                isPressed = false
                // Only fire onClick if the gesture ended cleanly (finger lifted)
                if (upOrCancel != null) onClick()
            }
        }
        // Invisible interactionSource — visual feedback is handled by graphicsLayer scale,
        // not the default ripple, to avoid double-layered press states.
        .clickable(
            interactionSource = remember { MutableInteractionSource() },
            indication        = null,
            onClick           = {}   // no-op; real click handled in pointerInput above
        )
}

/**
 * pressScale — Lightweight variant for non-clickable surfaces that still need
 * spring scale feedback driven by an external boolean (e.g., SwipeToDismiss
 * drag handles or ModalBottomSheet drag chips).
 *
 * Usage:
 *   Box(modifier = Modifier.pressScale(isDragging))
 */
fun Modifier.pressScale(
    isPressed: Boolean,
    scaleDownFactor: Float = 0.97f
): Modifier = composed {
    val scale by animateFloatAsState(
        targetValue   = if (isPressed) scaleDownFactor else 1f,
        animationSpec = SpringSpatialFast,
        label         = "PressScaleSpring"
    )

    this.graphicsLayer {
        scaleX = scale
        scaleY = scale
    }
}
