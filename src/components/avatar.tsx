import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { dispose, useGraph } from '@react-three/fiber';
import useBlinkEyes from '../utils/useBlinkEyes';
import useExpressions from '../utils/useExpressions';
import useFaceTracking from '../utils/useFaceTracking';
import useFollowCursor from '../utils/useFollowCursor';
import { AvatarOptions3D, correctMaterials, isSkinnedMesh, Transform } from '../utils/utils';

interface AvatarProps {
  url: string;
  options?: AvatarOptions3D;
  onLoaded?: () => void;
}

const defaultTransform: Transform = {
  position: [0, -0.625, 0],
  rotation: [0, 0.1, 0],
  scale: [1, 1, 1],
} 

export default function Avatar({
  url,
  options,
  onLoaded,
}: AvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene);

  const transform = options?.transform;

  useBlinkEyes(options?.blinkEyes);
  useExpressions(nodes);
  useFollowCursor(options?.followCursor, nodes);
  useFaceTracking(options?.faceTracking, nodes);

  useEffect(() => {
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
    <group {...defaultTransform} {...transform}>
      <primitive object={scene} />
    </group>
  );
}
