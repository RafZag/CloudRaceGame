import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

export function useOptionalTexture(textureUrl) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!textureUrl) {
      setTexture(null);
      return;
    }

    const loader = new THREE.TextureLoader();
    let disposed = false;
    let loadedTexture = null;

    loader.load(
      textureUrl,
      (nextTexture) => {
        if (disposed) {
          nextTexture.dispose();
          return;
        }

        nextTexture.colorSpace = THREE.SRGBColorSpace;
        nextTexture.flipY = false;
        loadedTexture = nextTexture;
        setTexture(nextTexture);
      },
      undefined,
      () => {
        if (!disposed) {
          setTexture(null);
        }
      },
    );

    return () => {
      disposed = true;
      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, [textureUrl]);

  return texture;
}

export function useWorldModelScene(scene, { tint = '#00ff00', map = undefined, roughness, metalness } = {}) {
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      if (child.geometry && child.geometry.isGeometry) {
        child.geometry = new THREE.BufferGeometry().fromGeometry(child.geometry);
      }

      child.castShadow = true;
      child.receiveShadow = true;

      const materials = Array.isArray(child.material) ? child.material : [child.material];

      const nextMaterials = materials.map((material) => {
        if (!material) {
          return material;
        }

        const nextMaterial = material.clone();

        if (nextMaterial.color && tint != null) {
          nextMaterial.color.set(tint);
        }

        if ('roughness' in nextMaterial && roughness != null) {
          nextMaterial.roughness = roughness;
        }

        if ('metalness' in nextMaterial && metalness != null) {
          nextMaterial.metalness = metalness;
        }

        if (map !== undefined) {
          nextMaterial.map = map || null;
        }

        nextMaterial.needsUpdate = true;
        return nextMaterial;
      });

      child.material = Array.isArray(child.material) ? nextMaterials : nextMaterials[0];
    });
  }, [clonedScene, tint, map, roughness, metalness]);

  return clonedScene;
}
