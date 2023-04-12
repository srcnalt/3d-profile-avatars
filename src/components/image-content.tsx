import React from "react";
import { Options2D } from "../types";
import { ErrorBoundary } from "./error-boundary";

interface ImageContentProps {
  url: string;
  options?: Options2D;
  onLoaded?: () => void;
  onFailed?: () => void;
  fallback?: React.ReactNode;
}

export default function ImageContent({ url, options, onLoaded, onFailed, fallback }:ImageContentProps): JSX.Element 
{
  const guid = url.substring(url.lastIndexOf("/") + 1).split(".")[0];
  const url2D = `https://api.readyplayer.me/v1/avatars/${guid}.png?cacheControl=true`

  const generateImageTransform = () => {
      const scale = options?.scale ? `scale(${options.scale.toString()}) ` : "";
      const translate = options?.position ? `translate(${(options.position as number[]).join("px, ")}px) ` : "";
      return scale + translate;
  }
      
  return <ErrorBoundary fallback={fallback} onError={onFailed}>
    <img src={url2D} style={{ width: "100%", height: "100%", transform: generateImageTransform() }} onLoad={onLoaded}/>
  </ErrorBoundary> 
}
