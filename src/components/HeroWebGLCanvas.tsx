import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroWebGLCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting (Neutral Slate Dark)
    const ambientLight = new THREE.AmbientLight(0x0F172A, 2.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x34D399, 4, 20); // Mint Accent
    pointLight1.position.set(4, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x006C4C, 5, 20); // Emerald Primary
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x0EA5E9, 2, 15); // Subtle Sky Blue
    pointLight3.position.set(0, 4, 2);
    scene.add(pointLight3);

    // 3. Organic Distorted Emerald Sphere (Custom Shader Material with Simplex Wave)
    const sphereGeometry = new THREE.IcosahedronGeometry(1.6, 64);
    
    // Custom Shader with Simplex Noise Distortion
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0x006C4C) }, // Deep Emerald
        uColorB: { value: new THREE.Color(0x34D399) }, // Mint Highlight
        uColorC: { value: new THREE.Color(0x0A1A14) }, // Deep Forest
        uDistort: { value: 0.35 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uDistort;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vNoise;

        // Simplex 3D noise approximation
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
          i = mod(i, 289.0 );
          vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          float noise = snoise(position * 1.5 + vec3(uTime * 0.35));
          vNoise = noise;
          
          vec3 newPos = position + normal * (noise * uDistort);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vNoise;

        void main() {
          // Fresnel Edge Highlight
          vec3 viewDirection = normalize(-vPosition);
          float fresnel = 1.0 - max(dot(viewDirection, vNormal), 0.0);
          fresnel = pow(fresnel, 2.5);

          // Color blend based on noise & normal
          vec3 baseColor = mix(uColorC, uColorA, (vNoise + 1.0) * 0.5);
          vec3 finalColor = mix(baseColor, uColorB, fresnel * 0.85);

          gl_FragColor = vec4(finalColor, 0.85);
        }
      `,
      transparent: true,
      wireframe: false
    });

    const organicSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    organicSphere.position.set(2.2, 0, 0); // Positioned to the right of hero text
    scene.add(organicSphere);

    // 4. 500 Floating Salt Crystal Particles using THREE.InstancedMesh (60 FPS Performance)
    const PARTICLE_COUNT = 500;
    const crystalGeometry = new THREE.OctahedronGeometry(0.065, 0);
    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x6EE7B7,
      emissive: 0x006C4C,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      ior: 1.5,
      transparent: true,
      opacity: 0.85
    });

    const instancedMesh = new THREE.InstancedMesh(crystalGeometry, crystalMaterial, PARTICLE_COUNT);
    scene.add(instancedMesh);

    // Store particle base positions and velocities
    const dummy = new THREE.Object3D();
    const particleData: Array<{
      basePos: THREE.Vector3;
      currPos: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      scale: number;
    }> = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 1.8 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) * 0.7;

      const pos = new THREE.Vector3(x, y, z);
      const scale = 0.5 + Math.random() * 0.9;

      particleData.push({
        basePos: pos.clone(),
        currPos: pos.clone(),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        scale
      });

      dummy.position.copy(pos);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;

    // 5. Interactive Mouse Raycasting & Repulsion Interaction
    const mouse3D = new THREE.Vector3(999, 999, 0);
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(-999, -999);

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      mouseNorm.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNorm, camera);
      raycaster.ray.intersectPlane(mousePlane, mouse3D);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop (Locked 60 FPS)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Update sphere noise time & rotation
      sphereMaterial.uniforms.uTime.value = elapsedTime;
      organicSphere.rotation.y = elapsedTime * 0.15;
      organicSphere.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

      // Update floating crystal particles with dispersion physics
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particleData[i];

        // Orbit oscillation
        const floatY = Math.sin(elapsedTime * 0.8 + i) * 0.15;
        const floatX = Math.cos(elapsedTime * 0.6 + i) * 0.1;

        const targetPos = p.basePos.clone().add(new THREE.Vector3(floatX, floatY, 0));

        // Repulsion from mouse cursor
        const dist = mouse3D.distanceTo(p.currPos);
        const repelRadius = 2.2;

        if (dist < repelRadius) {
          const repelDir = p.currPos.clone().sub(mouse3D).normalize();
          const repelForce = (1.0 - dist / repelRadius) * 1.5;
          targetPos.add(repelDir.multiplyScalar(repelForce));
        }

        // Smooth interpolation back to position
        p.currPos.lerp(targetPos, 0.08);

        dummy.position.copy(p.currPos);
        dummy.rotation.x += p.rotSpeed.x;
        dummy.rotation.y += p.rotSpeed.y;
        dummy.rotation.z += p.rotSpeed.z;
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // 8. Proper WebGL Memory Disposal on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      sphereGeometry.dispose();
      sphereMaterial.dispose();
      crystalGeometry.dispose();
      crystalMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-0 overflow-hidden"
    />
  );
};
