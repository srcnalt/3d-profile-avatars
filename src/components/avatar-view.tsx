import React from 'react';
import { Options2D, Options3D, Type } from '../types';
import ImageContent from './image-content';
import ModelContent from './model-content';

interface AvatarViewProps {
  type: Type;
  url: string;
  style?: React.CSSProperties;
  options2D?: Options2D;
  options3D?: Options3D;
  onLoaded?: () => void;
  onFailed?: () => void;
  fallback?: React.ReactNode;
}

const defaultStyle: React.CSSProperties = {
  width: '250px',
  height: '250px',
  overflow: 'hidden',
  borderRadius: '100%',
  backgroundColor: 'orange',
};

export default function AvatarView({ type, url, style, options3D, options2D, onLoaded, onFailed, fallback }: AvatarViewProps) 
{    
  return (
    <div style={{...defaultStyle, ...style}}>
      {type == '3D' && <ModelContent url={url} options={options3D} onLoaded={onLoaded} onFailed={onFailed} fallback={fallback} />}
      {type == '2D' && <ImageContent url={url} options={options2D} onLoaded={onLoaded} onFailed={onFailed} fallback={fallback} />}
    </div>
  );
}
