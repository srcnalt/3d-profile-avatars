import React, { useEffect } from 'react';
import { Object3D, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import useEyeBlink from '../utils/useEyeBlink';
import useHeadMovement from '../utils/useHeadMovement';
import { dispose, useGraph } from '@react-three/fiber';
import { correctMaterials, hideHands, isSkinnedMesh } from '../utils/utils';

interface AvatarProps {
  url: string;
  eyeBlink?: boolean;
  headMovement?: boolean;
  onLoaded?: () => void;
}

const position = new Vector3(0, -0.6, 0);

export default function Avatar({
  url,
  eyeBlink,
  headMovement,
  onLoaded,
}: AvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene);

  useEyeBlink(eyeBlink, nodes);
  useHeadMovement(headMovement, nodes);

  useEffect(() => {
    hideHands(nodes);
    correctMaterials(materials);

    if (onLoaded) onLoaded();

    return () => {
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
