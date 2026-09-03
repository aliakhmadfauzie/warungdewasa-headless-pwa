import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LiquidRippleImageProps {
  src: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

export const LiquidRippleImage: React.FC<LiquidRippleImageProps> = ({
  src,
  alt = 'Product Image',
  className = '',
  aspectRatio = 'aspect-[4/3]'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 225;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Texture Loader with CORS
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    let texture: THREE.Texture | null = null;
    let material: THREE.ShaderMaterial | null = null;
    const geometry = new THREE.PlaneGeometry(2, 2);

    const mouse = new THREE.Vector2(0.5, 0.5);
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    let hoverStrength = 0;
    let targetHoverStrength = 0;

    textureLoader.load(
      src,
      (loadedTexture) => {
        texture = loadedTexture;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // 3. Custom Vertex & Fragment Shader for Liquid Ripple & Refraction
        material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uMouse: { value: mouse },
            uHover: { value: 0 },
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(width, height) },
            uImageResolution: {
              value: new THREE.Vector2(
                loadedTexture.image.width || width,
                loadedTexture.image.height || height
              )
            }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexture;
            uniform vec2 uMouse;
            uniform float uHover;
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec2 uImageResolution;
            varying vec2 vUv;

            void main() {
              // Aspect ratio cover calculation
              vec2 ratio = vec2(
                min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
                min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
              );
              vec2 uv = vec2(
                vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
              );

              // Liquid Wave Ripple Simulation
              float dist = distance(vUv, uMouse);
              float wave = sin(dist * 28.0 - uTime * 4.5) * exp(-dist * 4.0) * uHover;
              vec2 rippleOffset = normalize(vUv - uMouse + 0.0001) * wave * 0.04;

              // Refractive Chromatic Aberration (RGB Dispersion)
              float r = texture2D(uTexture, uv + rippleOffset * 1.25).r;
              float g = texture2D(uTexture, uv + rippleOffset).g;
              float b = texture2D(uTexture, uv + rippleOffset * 0.75).b;

              // Emerald sheen highlight on crest of wave
              float sheen = smoothstep(0.015, 0.035, abs(wave)) * uHover;
              vec3 color = vec3(r, g, b) + vec3(0.0, 0.12, 0.08) * sheen;

              gl_FragColor = vec4(color, 1.0);
            }
          `
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        setIsLoaded(true);
      },
      undefined,
      () => {
        // Fallback for CORS or image load error
        setIsLoaded(false);
      }
    );

    // 4. Mouse Event Listeners for Ripple Trigger
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const handleMouseEnter = () => {
      targetHoverStrength = 1.0;
    };

    const handleMouseLeave = () => {
      targetHoverStrength = 0.0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 5. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      if (material) {
        material.uniforms.uResolution.value.set(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation of mouse and hover states
      mouse.lerp(targetMouse, 0.1);
      hoverStrength += (targetHoverStrength - hoverStrength) * 0.08;

      if (material) {
        material.uniforms.uTime.value = elapsedTime;
        material.uniforms.uMouse.value.copy(mouse);
        material.uniforms.uHover.value = hoverStrength;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup & WebGL Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      if (material) material.dispose();
      if (texture) texture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${aspectRatio} ${className}`}
    >
      {/* Standard Image Fallback for SSR / Initial load */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
    </div>
  );
};
