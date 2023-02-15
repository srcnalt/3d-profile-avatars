import { Nodes } from './utils';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { BlinkEvent } from '../events/blink-event';
import { SkinnedMesh } from 'three';

let blinkTime = Number.POSITIVE_INFINITY;
let timeout: NodeJS.Timeout;

let headMesh: SkinnedMesh;
let morphIndex: number = 0;

function update(delta: number) {
  if(headMesh.morphTargetInfluences){
    if (blinkTime < 2) {
      let value = Math.abs(Math.sin((blinkTime * Math.PI) / 2));
      blinkTime += delta * 10;
      headMesh.morphTargetInfluences[morphIndex] = value;
    } else {
      headMesh.morphTargetInfluences[morphIndex] = 0;
    }
  }
}

function triggerBlink() {
  clearTimeout(timeout);
  blinkTime = 0;
}

export default function useEyeBlink(
  enabled: boolean | undefined,
  nodes: Nodes
) {
  useEffect(() => {
    if (!enabled) return;

    headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar) as SkinnedMesh;

    if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
      morphIndex = headMesh.morphTargetDictionary.eyesClosed;
    }

    BlinkEvent.subscribe(triggerBlink);

    return () => {
      BlinkEvent.unsubscribe(triggerBlink);
      clearTimeout(timeout);
    };
  }, [nodes, enabled]);

  useFrame((_, delta) => {
    if (enabled) update(delta);
  });
}
