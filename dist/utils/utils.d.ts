import { Material, Object3D } from 'three';
export interface Nodes {
    [name: string]: Object3D;
}
export interface Materials {
    [name: string]: Material;
}
export declare const clamp: (value: number, min: number, max: number) => number;
export declare const lerp: (start: number, end: number, time?: number) => number;
export declare const mapRange: (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => number;
export declare const hideHands: (nodes: Nodes) => void;
export declare const correctMaterials: (materials: Materials) => void;
export declare const isSkinnedMesh: (node: Object3D) => boolean;
