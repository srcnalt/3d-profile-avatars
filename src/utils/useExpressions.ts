import { Nodes } from './utils';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { SkinnedMesh } from 'three';
import { AnimEvent, OnAnimPlayed } from '../events/anim-event';

let current: any[] = [];
let headMesh: SkinnedMesh;
let duration: number = Number.POSITIVE_INFINITY;

const anims = {
  blink: [
    {
      morphTarget: 'eyesClosed',
      morphTargetIndex: -1,
      offset: 0,
      duration: 0.2,
    },
    {
      morphTarget: 'eyeSquintLeft',
      morphTargetIndex: -1,
      offset: 0,
      duration: 0.2,
    },
    {
      morphTarget: 'eyeSquintRight',
      morphTargetIndex: -1,
      offset: 0,
      duration: 0.2,
    },
  ],
  angry: [
    {
      morphTarget: 'browDownLeft',
      morphTargetIndex: -1,
      offset: 0,
      duration: 1,
    },
    {
      morphTarget: 'browDownRight',
      morphTargetIndex: -1,
      offset: 0,
      duration: 1,
    },
    {
      morphTarget: 'mouthFrownLeft',
      morphTargetIndex: -1,
      offset: 0.2,
      duration: 0.8,
    },
    {
      morphTarget: 'mouthFrownRight',
      morphTargetIndex: -1,
      offset: 0.2,
      duration: 0.8,
    },
    {
      morphTarget: 'eyeSquintLeft',
      morphTargetIndex: -1,
      offset: 0,
      duration: 1,
    },
    {
      morphTarget: 'eyeSquintRight',
      morphTargetIndex: -1,
      offset: 0,
      duration: 1,
    },
  ],
};

function update(delta: number) {
  if (headMesh?.morphTargetInfluences && current.length > 0) {
    duration += delta;

    for (let index = 0; index < current.length; index++) {
      const section = current[index];

      if (duration < section.duration + section.offset) {
        if (duration > section.offset) {
          const pivot = ((duration - section.offset) / section.duration) * Math.PI;
          const value = Math.sin(pivot);
          headMesh.morphTargetInfluences[section.morphTargetIndex] = value;
        }
      } else if (duration > 1) {
        headMesh.morphTargetInfluences[section.morphTargetIndex] = 0;
        current = [];
      }
    }
  }
}

function resetTime(event: OnAnimPlayed) {
  if (event.detail) {
    duration = 0;
    current = anims[event.detail.name];

    if (headMesh.morphTargetDictionary) {
      for (let index = 0; index < current.length; index++) {
        current[index].morphTargetIndex = headMesh.morphTargetDictionary[current[index].morphTarget];
      }
    }
  }
}

export default function useExpressions(nodes: Nodes) {
  useEffect(() => {
    headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar) as SkinnedMesh;
    AnimEvent.subscribe(['blink', 'angry'], resetTime);

    return () => {
      AnimEvent.unsubscribe(['blink', 'angry'], resetTime);
    };
  }, [nodes]);

  useFrame((_, delta) => {
    update(delta);
  });
}
