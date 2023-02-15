import React = require('react');
import { createRoot } from 'react-dom';
import AvatarView from './..';
import { BlinkEvent } from '../src/events/blink-event';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <div>
    <AvatarView
      url="https://d1a370nemizbjq.cloudfront.net/d50e8927-9576-48c5-9f02-4e96aff0736b.glb"
      style={{ width: '300px', height: '300px' }}
      rotateAvatar
      eyeBlink
      headMovement
    />
    <button onClick={BlinkEvent.dispatch}>Blink</button>
  </div>
);
