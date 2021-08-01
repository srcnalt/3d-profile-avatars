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
}: AvatarViewProps) {
  return (
    <Canvas
      style={style || defaultStyle}
      camera={{ fov: 40, position: [0, 0, 0.6] }}
    >
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        {rotateAvatar && <OrbitControls enablePan={false} enableZoom={false} />}
        <Avatar url={url} eyeBlink={eyeBlink} headMovement={headMovement} />
      </Suspense>
    </Canvas>
  );
}
