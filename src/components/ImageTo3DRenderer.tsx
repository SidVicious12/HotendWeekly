'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

type ImageTo3DRendererProps = {
  imageUrl: string;
  className?: string;
  heightScale?: number;
  enableDownload?: boolean;
};

const BASE_THICKNESS = 0.028;
const DISPLACEMENT_INTENSITY = 0.65;
const RELIEF_RESOLUTION = 256;
const RELIEF_HEIGHT_LEVELS = 6;
const MIN_RELIEF_DEPTH = 0.1;
const MAX_RELIEF_DEPTH = 1.0;
const BLUR_RADIUS = 1;

export function ImageTo3DRenderer({
  imageUrl,
  className,
  heightScale = 0.18,
  enableDownload = true
}: ImageTo3DRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(1.2, 0.9, 1.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enablePan = false;
    controls.minDistance = 0.6;
    controls.maxDistance = 3;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(2, 3, 4);
    keyLight.castShadow = true;
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(-3, 2, -2);

    scene.add(ambientLight, keyLight, rimLight);

    const group = new THREE.Group();
    group.rotation.x = -0.15;
    scene.add(group);
    modelGroupRef.current = group;

    // Only append if canvas doesn't already exist
    if (!container.querySelector('canvas')) {
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
    } else {
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    let animationFrame: number;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    const cleanup = () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const material = child.material;
          if (Array.isArray(material)) {
            material.forEach((mat) => mat.dispose());
          } else {
            material.dispose();
          }
        }
      });
      // Remove canvas element properly
      if (container && renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };

    return cleanup;
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !modelGroupRef.current || !containerRef.current) {
      return;
    }

    setIsReady(false);
    const group = modelGroupRef.current;

    // Clear previous meshes
    for (let i = group.children.length - 1; i >= 0; i -= 1) {
      const child = group.children[i];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        const material = child.material;
        if (Array.isArray(material)) {
          material.forEach((mat) => mat.dispose());
        } else {
          material.dispose();
        }
      }
    }

    const loader = new THREE.TextureLoader();

    loader.load(
      imageUrl,
      (texture) => {
        const targetSize = RELIEF_RESOLUTION;
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.drawImage(texture.image as CanvasImageSource, 0, 0, targetSize, targetSize);
        const imageData = ctx.getImageData(0, 0, targetSize, targetSize);

        // Apply Gaussian blur to height data for smoother relief
        const blurredData = new Float32Array(targetSize * targetSize);
        let minLuminance = Number.POSITIVE_INFINITY;
        let maxLuminance = Number.NEGATIVE_INFINITY;

        for (let y = 0; y < targetSize; y++) {
          for (let x = 0; x < targetSize; x++) {
            let sum = 0;
            let count = 0;

            for (let dy = -BLUR_RADIUS; dy <= BLUR_RADIUS; dy++) {
              for (let dx = -BLUR_RADIUS; dx <= BLUR_RADIUS; dx++) {
                const nx = Math.min(Math.max(x + dx, 0), targetSize - 1);
                const ny = Math.min(Math.max(y + dy, 0), targetSize - 1);
                const idx = (ny * targetSize + nx) * 4;
                const r = imageData.data[idx];
                const g = imageData.data[idx + 1];
                const b = imageData.data[idx + 2];
                const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                sum += luminance;
                count++;
              }
            }

            const averaged = sum / count;
            blurredData[y * targetSize + x] = averaged;
            if (averaged < minLuminance) minLuminance = averaged;
            if (averaged > maxLuminance) maxLuminance = averaged;
          }
        }

        const luminanceRange = maxLuminance - minLuminance || 1;
        const normalizedData = new Float32Array(targetSize * targetSize);
        for (let i = 0; i < blurredData.length; i += 1) {
          const normalized = (blurredData[i] - minLuminance) / luminanceRange;
          const inverted = Math.pow(1 - normalized, 1.12);
          const quantized =
            Math.round(inverted * (RELIEF_HEIGHT_LEVELS - 1)) / (RELIEF_HEIGHT_LEVELS - 1);
          const remapped =
            MIN_RELIEF_DEPTH + (MAX_RELIEF_DEPTH - MIN_RELIEF_DEPTH) * quantized;
          normalizedData[i] = remapped;
        }

        const displacementScale = heightScale * DISPLACEMENT_INTENSITY;
        const displacementMap = new THREE.DataTexture(
          normalizedData,
          targetSize,
          targetSize,
          THREE.RedFormat,
          THREE.FloatType
        );
        displacementMap.needsUpdate = true;
        displacementMap.minFilter = THREE.LinearFilter;
        displacementMap.magFilter = THREE.LinearFilter;

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = rendererRef.current!.capabilities.getMaxAnisotropy();

        const geometry = new THREE.PlaneGeometry(
          1,
          1,
          Math.max(1, targetSize - 1),
          Math.max(1, targetSize - 1)
        );
        geometry.center();

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          displacementMap,
          displacementScale,
          displacementBias: -MIN_RELIEF_DEPTH * displacementScale,
          metalness: 0.0,
          roughness: 0.7,
          flatShading: true
        });

        const relief = new THREE.Mesh(geometry, material);
        relief.castShadow = true;
        relief.receiveShadow = true;

        const baseMaterial = new THREE.MeshStandardMaterial({
          color: 0xf1f1f4,
          roughness: 0.9,
          metalness: 0.05
        });
        const baseGeometry = new THREE.BoxGeometry(1.02, 1.02, BASE_THICKNESS);
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.z = -BASE_THICKNESS / 2;
        base.receiveShadow = true;

        group.add(base);
        group.add(relief);

        setIsReady(true);
      },
      undefined,
      () => {
        setIsReady(false);
      }
    );
  }, [imageUrl, heightScale]);

  const handleDownload = () => {
    if (!modelGroupRef.current) return;
    const exporter = new STLExporter();
    const stlData = exporter.parse(modelGroupRef.current);
    const blob = new Blob([stlData], { type: 'model/stl' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hotend-weekly-model.stl';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="h-full w-full rounded-2xl bg-white shadow-inner overflow-hidden relative"
      >
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 text-gray-500 text-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-200 border-t-purple-500 mb-3" />
            Generating relief preview...
          </div>
        )}
      </div>
      {enableDownload && (
        <button
          type="button"
          onClick={handleDownload}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
        >
          Download printable STL
        </button>
      )}
    </div>
  );
}

export default ImageTo3DRenderer;
