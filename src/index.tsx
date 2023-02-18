import React, { Suspense } from 'react';
import Avatar from './components/avatar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AvatarOptions2D, AvatarOptions3D, AvatarType, CameraOptions } from './utils/utils';

interface AvatarViewProps {
  url: string;
  type?: AvatarType;
  style?: React.CSSProperties;
  options2d?: AvatarOptions2D;
  options3d?: AvatarOptions3D;
  onLoaded?: () => void;
}

const defaultStyle: React.CSSProperties = {
  width: '250px',
  height: '250px',
  overflow: 'hidden',
  borderRadius: '100%',
  backgroundColor: 'orange'
};

const defaultCamera: CameraOptions = {
  fov: 40, 
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
  position: [0, 0, 0.5]
}

export default function AvatarView({
  url,
  type,
  style,
  options3d,
  options2d,
  onLoaded,
}: AvatarViewProps) {

  const guid = url.substring(url.lastIndexOf("/") + 1).split(".")[0];
  const image = `https://api.readyplayer.me/v1/avatars/${guid}.png?cacheControl=true`

  const generateImageTransform = () => {
    const scale = options2d?.scale ? `scale(${options2d.scale.toString()}) ` : "";
    const translate = options2d?.position ? `translate(${(options2d.position as number[]).join("px, ")}px) ` : "";
    return scale + translate;
  }

  return (
    <div id={guid} style={{...defaultStyle, ...style}}>
      {
        (type == '2D') ?
          <img src={image} 
            style={{
              width: "100%", 
              height: "100%", 
              transform: generateImageTransform(),
            }} 
            onLoad={onLoaded}/>
        :
        <Canvas camera={{...defaultCamera, ...options3d?.camera}}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight intensity={0.5} position={[1, 1, 1]} />
            <pointLight intensity={0.5} position={[1, 1, 1]} color="purple" /> 
            <pointLight intensity={0.5} position={[-1, -1, 1]} color="green" />
            {options3d?.orbitControl && <OrbitControls enablePan={false} enableZoom={false} />}
            <Avatar url={url} options={options3d} onLoaded={onLoaded}/>
          </Suspense>
        </Canvas>
      }
    </div>
  );
}
