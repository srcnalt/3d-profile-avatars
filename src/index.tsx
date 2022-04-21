import React, { Suspense } from 'react';
import Avatar from './components/avatar';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

interface AvatarViewProps {
  url: string;
  eyeBlink?: boolean;
  headMovement?: boolean;
  rotateAvatar?: boolean;
  style?: React.CSSProperties;
  environment?: string;
  fallback?: ReactNode;
}

const defaultStyle = {
  width: '250px',
  height: '250px',
  backgroundColor: 'orange',
  borderRadius: '100%',
};

export default function AvatarView({
  url,
  style,
  rotateAvatar,
  eyeBlink,
  headMovement,
  environment = 'sunset',
  fallback,
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
