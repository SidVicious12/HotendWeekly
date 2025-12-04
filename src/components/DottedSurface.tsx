'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points[];
    animationId: number;
    count: number;
  } | null>(null);

  // Wait for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    let animationId = 0;
    let renderer: THREE.WebGLRenderer | null = null;

    // Small delay to ensure layout is complete
    const initTimeout = setTimeout(() => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const width = rect.width || window.innerWidth / 2;
      const height = rect.height || window.innerHeight;
      
      if (width === 0 || height === 0) return;

      const SEPARATION = 80;
      const AMOUNTX = 60;
      const AMOUNTY = 60;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
      camera.position.set(0, 300, 600);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff, 0);
      container.appendChild(renderer.domElement);

      const positions: number[] = [];
      const colors: number[] = [];
      const geometry = new THREE.BufferGeometry();

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
          const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
          positions.push(x, 0, z);
          colors.push(0.15, 0.15, 0.2);
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Add lighting for 3D model
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0x6366f1, 1, 500);
      pointLight.position.set(-100, 150, 100);
      scene.add(pointLight);

      const pointLight2 = new THREE.PointLight(0x06b6d4, 1, 500);
      pointLight2.position.set(100, 100, -100);
      scene.add(pointLight2);

      // Load 3D model
      let model: THREE.Group | null = null;
      const loader = new GLTFLoader();
      
      loader.load(
        '/models/skull.glb',
        (gltf) => {
          model = gltf.scene;
          
          // Center and scale the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Scale to fit nicely
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 150 / maxDim;
          model.scale.setScalar(scale);
          
          // Center the model
          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale + 100;
          model.position.z = -center.z * scale - 150;
          
          // Apply metallic material to all meshes
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                metalness: 0.8,
                roughness: 0.2,
              });
            }
          });
          
          scene.add(model);
        },
        (progress) => {
          console.log('Loading model:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          console.log('Model not found yet - add skull.glb to /public/models/');
        }
      );

      let count = 0;
      const localRenderer = renderer;

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Animate dots
        const positionAttribute = geometry.attributes.position;
        const positionsArray = positionAttribute.array as Float32Array;

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            const index = i * 3;
            positionsArray[index + 1] =
              Math.sin((ix + count) * 0.3) * 50 +
              Math.sin((iy + count) * 0.5) * 50;
            i++;
          }
        }
        positionAttribute.needsUpdate = true;

        // Rotate 3D model if loaded
        if (model) {
          model.rotation.y += 0.008;
        }

        localRenderer.render(scene, camera);
        count += 0.1;
      };

      const handleResize = () => {
        const w = container.clientWidth || window.innerWidth / 2;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        localRenderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);
      animate();

      sceneRef.current = { scene, camera, renderer: localRenderer, particles: [points], animationId, count };
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (animationId) cancelAnimationFrame(animationId);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            (object.material as THREE.PointsMaterial).dispose();
          }
        });
        sceneRef.current.renderer.dispose();
        if (container && sceneRef.current.renderer.domElement.parentNode === container) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
      }
      window.removeEventListener('resize', () => {});
    };
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 w-full h-full', className)}
      style={{ zIndex: 0 }}
      {...props}
    />
  );
}
