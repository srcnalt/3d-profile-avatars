import { Euler, Vector2, Vector3 } from '@react-three/fiber';

export type Type = '3D' | '2D';

export type Quality = 'high' | 'medium' | 'low';

export type Transform = {
  position?: Vector3;
  rotation?: Euler;
  scale?: Vector3;
};

export type Options3D = {
  quality?: Quality;
  camera?: Camera;
  transform?: Transform;
  blinkEyes?: boolean;
  followCursor?: boolean;
  orbitControl?: boolean;
  faceTracking?: boolean;
};

export type Options2D = {
  scale?: Vector2;
  position?: Vector2;
};

export type Camera = {
  fov?: number;
  far?: number;
  near?: number;
  position?: Vector3;
  rotation?: Euler;
  scale?: Vector3;
};
