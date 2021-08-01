import { Nodes } from './utils';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial, SkinnedMesh } from 'three';

let blinkTime: number = 999;
let timeout: NodeJS.Timeout;

let headMesh: SkinnedMesh;
let morphIndex: number = 0;

const setNextBlink = () => {
  blinkTime = 0;
  timeout = setTimeout(setNextBlink, Math.random() * 5000 + 2000);
};

export default function useEyeBlink(
  enabled: boolean | undefined,
  nodes: Nodes
) {
  useEffect(() => {
    if (!enabled) return;

    headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar) as SkinnedMesh;

    const material = headMesh.material as MeshStandardMaterial;
    material.morphTargets = true;

    if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
      morphIndex = headMesh.morphTargetDictionary.eyesClosed;
    }

    timeout = setTimeout(setNextBlink, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [nodes, enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;

    if (blinkTime < 2 && headMesh.morphTargetInfluences) {
      let value = Math.abs(Math.sin((blinkTime * Math.PI) / 2));
      blinkTime += delta * 10;
      headMesh.morphTargetInfluences[morphIndex] = value;
    } else if (headMesh.morphTargetInfluences) {
      headMesh.morphTargetInfluences[morphIndex] = 0;
    }
  });
}
