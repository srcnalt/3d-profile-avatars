import type { CSSProperties, ReactNode } from 'react';
import type { PresetsType } from '@react-three/drei/helpers/environment-assets';
import React, { Suspense } from 'react';
import Avatar from './components/avatar';
import Loader from './components/loader';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
} from '@react-three/drei';

interface AvatarViewProps {
  url: string;
  eyeBlink?: boolean;
  headMovement?: boolean;
  rotateAvatar?: boolean;
  style?: CSSProperties;
  environment?: PresetsType;
  fallback?: ReactNode;
}

const defaultStyle = {
  width: '250px',
  height: '250px',
  backgroundColor: 'orange',
  borderRadius: '100%',
};

export { Loader };

export default function AvatarView({
  url,
  style,
  rotateAvatar,
  eyeBlink,
  headMovement,
  environment = 'sunset',
  fallback = <Loader />,
}: AvatarViewProps) {
  return (
    <Canvas
      style={style || defaultStyle}
      camera={{ fov: 40, position: [0, 0, 0.6] }}
    >
      <Suspense fallback={fallback || null}>
        {environment && <Environment preset={environment} />}
        {rotateAvatar && <OrbitControls enablePan={false} enableZoom={false} />}
        <Avatar url={url} eyeBlink={eyeBlink} headMovement={headMovement} />
      </Suspense>
    </Canvas>
  );
}
