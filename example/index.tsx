import React = require('react');
import { createRoot } from 'react-dom';
import AvatarView from './..';
import {AvatarOptions2D, AvatarOptions3D} from './../src/utils/utils'

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

const options3D: AvatarOptions3D = {
  blinkEyes: true,
  followCursor: false,
  orbitControl: false,
  faceTracking: false,
  transform: {
    rotation: [0, -0.2, 0]
  },
  camera: {
    scale: [2, 2, 2]
  }
}

const options2D: AvatarOptions2D = {
  scale: [1.5, 1.5],
  position: [0, 10]
}

root.render(
  <div>
    <AvatarView
      type="3D"
      url="https://models.readyplayer.me/61069da5616490e7e2ebc787.glb?useHands=false"
      style={{ width: '500px', height: '500px', backgroundColor: "orange", borderRadius: "100%" }}
      options2d={options2D}
      options3d={options3D}
    />
  </div>
);
