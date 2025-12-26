'use client';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

/**
 * Converts a GLB file URL to STL format
 * @param glbUrl - URL of the GLB file to convert
 * @returns Promise<Blob> - STL file as a Blob
 */
export async function convertGLBtoSTL(glbUrl: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(
            glbUrl,
            (gltf) => {
                try {
                    const scene = gltf.scene;

                    // Merge all meshes into one geometry for STL export
                    const geometries: THREE.BufferGeometry[] = [];

                    scene.traverse((child) => {
                        if (child instanceof THREE.Mesh && child.geometry) {
                            // Clone and transform geometry to world coordinates
                            const geometry = child.geometry.clone();
                            child.updateWorldMatrix(true, false);
                            geometry.applyMatrix4(child.matrixWorld);
                            geometries.push(geometry);
                        }
                    });

                    if (geometries.length === 0) {
                        reject(new Error('No meshes found in GLB file'));
                        return;
                    }

                    // Merge all geometries
                    const mergedGeometry = geometries.length === 1
                        ? geometries[0]
                        : mergeBufferGeometries(geometries);

                    if (!mergedGeometry) {
                        reject(new Error('Failed to merge geometries'));
                        return;
                    }

                    // Create a mesh for export
                    const mesh = new THREE.Mesh(mergedGeometry);

                    // Export to STL
                    const exporter = new STLExporter();
                    const stlString = exporter.parse(mesh, { binary: true });

                    // Convert to Blob
                    const blob = new Blob([stlString], { type: 'application/octet-stream' });
                    resolve(blob);

                } catch (error) {
                    reject(error);
                }
            },
            undefined,
            (error: unknown) => {
                const message = error instanceof Error ? error.message : String(error);
                reject(new Error(`Failed to load GLB: ${message}`));
            }
        );
    });
}

/**
 * Simple geometry merger
 */
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
    if (geometries.length === 0) return null;
    if (geometries.length === 1) return geometries[0];

    // Use BufferGeometryUtils if available, otherwise manual merge
    const positions: number[] = [];
    const normals: number[] = [];

    for (const geometry of geometries) {
        const posAttr = geometry.getAttribute('position');
        const normAttr = geometry.getAttribute('normal');

        if (posAttr) {
            for (let i = 0; i < posAttr.count; i++) {
                positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
            }
        }

        if (normAttr) {
            for (let i = 0; i < normAttr.count; i++) {
                normals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
            }
        }
    }

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    if (normals.length > 0) {
        merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    }

    return merged;
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
