import React, { Suspense } from 'react';
import Avatar from './components/avatar';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

interface AvatarViewProps {
  url: string;
  style: React.CSSProperties;
}

export function AvatarView({ url, style }: AvatarViewProps) {
  return (
    <Canvas style={style} camera={{ fov: 40, position: [0, 0, 0.6] }}>
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <OrbitControls enablePan={false} enableZoom={false} />
        <Avatar url={url} />
      </Suspense>
    </Canvas>
  );
}
