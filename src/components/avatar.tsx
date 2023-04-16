import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useGraph } from '@react-three/fiber';
import { correctMaterials  } from '../utils/utils';
import { Options3D, Quality, Transform } from '../types';

import useBlinkEyes from '../utils/useBlinkEyes';
import useExpressions from '../utils/useExpressions';
import useFollowCursor from '../utils/useFollowCursor';
import useFaceTracking from '../utils/useFaceTracking';
// import useFaceTracking from '../utils/useFaceTracking';

interface AvatarProps {
  url: string;
  options?: Options3D;
  onLoaded?: () => void;
}

const defaultTransform: Transform = {
  position: [0, -0.625, 0],
  rotation: [0, 0.1, 0],
  scale: [1, 1, 1],
} 

const blendshapes = [
  'ARKit'
]

export default function Avatar({ url, options, onLoaded }: AvatarProps) {
  const transform = options?.transform;
  
  const quality: Quality = options?.quality ? options.quality : 'medium';
  const url3D = `${url}?useHands=false&quality=${quality}&morphTargets=${blendshapes.join(',')}`

  const { scene } = useGLTF(url3D);

  const { nodes, materials } = useGraph(scene);

  useBlinkEyes(options?.blinkEyes);
  useExpressions(nodes);
  useFollowCursor(options?.followCursor, nodes);
  useFaceTracking(options?.faceTracking, nodes);
  
  useEffect(() => {
    correctMaterials(materials);

    if (onLoaded) onLoaded();

  }, [materials, nodes, url, onLoaded]);

  return (
    <group {...defaultTransform} {...transform}>
      <primitive object={scene} />
    </group>
  );
}
