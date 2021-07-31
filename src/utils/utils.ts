import { LinearFilter, Material, Object3D } from 'three';

export interface Nodes {
  [name: string]: Object3D;
}

export interface Materials {
  [name: string]: Material;
}

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start: number, end: number, time: number = 0.05) => {
  return start * (1 - time) + end * time;
};

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  value = clamp(value, inMin, inMax);
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const hideHands = (nodes: Nodes) => {
  if (nodes.Wolf3D_Hands) {
    nodes.Wolf3D_Hands.visible = false;
  }

  if (nodes.RightHand && nodes.LeftHand) {
    nodes.RightHand.position.set(0, -2, 0);
    nodes.LeftHand.position.set(0, -2, 0);
  }
};

export const correctMaterials = (materials: Materials) => {
  Object.values(materials).forEach((material: any) => {
    // applying LinearFilter to texture to avoid  pixellization
    if (material.map) material.map.minFilter = LinearFilter;

    // support transparency
    if (material) material.depthWrite = true;
  });
};

const SkinnedMeshType = 'SkinnedMesh';
export const isSkinnedMesh = (node: Object3D) => {
  return node.type === SkinnedMeshType;
};
