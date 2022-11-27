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
  camera?: Object;
  showHands?: boolean;
}

const defaultStyle = {
  width: '250px',
  height: '250px',
  backgroundColor: 'orange',
  borderRadius: '100%',
};
const defaultCamera = 
  { fov: 40, position: [0, 0, 0.6] }

export default function AvatarView({
  url,
  style,
  rotateAvatar,
  eyeBlink,
  headMovement,
  camera,
  showHands
}: AvatarViewProps) {
  return (
    <Canvas
      style={style || defaultStyle}
      camera={camera || defaultCamera}
    >
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        {rotateAvatar && <OrbitControls enablePan={false} enableZoom={false} />}
        <Avatar url={url} eyeBlink={eyeBlink} headMovement={headMovement} showHands={showHands} />
      </Suspense>
    </Canvas>
  );
}
