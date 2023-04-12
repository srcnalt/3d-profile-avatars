import Avatar from './avatar';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Camera, Options3D } from '../types';
import { OrbitControls } from '@react-three/drei';
import { ErrorBoundary } from './error-boundary';

interface ModelContentProps {
  url: string;
  options?: Options3D;
  onLoaded?: () => void;
  onFailed?: () => void;
  fallback?: React.ReactNode;
}

const defaultCamera: Camera = {
  fov: 40,
  near: 0.001,
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  position: [0, 0, 0.5]
}

export default function ModelContent({ url, options, onLoaded, onFailed, fallback }: ModelContentProps) {
  return (
    <ErrorBoundary fallback={fallback} onError={onFailed}>
      <Canvas camera={{...defaultCamera, ...options?.camera}}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight intensity={0.5} position={[1, 1, 1]} />
          <pointLight intensity={0.1} position={[-1, 1, 1]} color="white" /> 
          {options?.orbitControl && <OrbitControls enablePan={false} enableZoom={false} />}
          <Avatar url={url} options={options} onLoaded={onLoaded}/>
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}
