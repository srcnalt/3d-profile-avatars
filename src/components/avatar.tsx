import React, { useEffect } from 'react';
import { Object3D, Vector3 } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { useGLTF } from '@react-three/drei';
import useHeadMovement from '../utils/useHeadMovement';
import { dispose, useGraph, useLoader } from '@react-three/fiber';
import { correctMaterials, hideHands, isSkinnedMesh } from '../utils/utils';

interface AvatarProps {
  url: string;
  reset?: boolean;
  onLoaded?: () => void;
}

const position = new Vector3(0, -0.6, 0);

export default function Avatar({ url, onLoaded }: AvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene);

  hideHands(nodes);
  useHeadMovement(nodes);
  correctMaterials(materials);

  useEffect(() => {
    if (onLoaded) onLoaded();

    return () => {
      useLoader.clear(GLTFLoader, url);

      Object.values(materials).forEach(dispose);

      Object.values(nodes)
        .filter(isSkinnedMesh)
        .forEach(dispose);
    };
  }, [materials, nodes, url, onLoaded]);

  return (
    <group position={position}>
      <primitive key="armature" object={nodes.Hips} />
      {Object.values(nodes)
        .filter(isSkinnedMesh)
        .map((node: Object3D) => (
          <primitive key={node.name} object={node} receiveShadow castShadow />
        ))}
    </group>
  );
}
