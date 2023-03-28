import React from "react";
import { Options2D } from "../types";

interface ImageContentProps {
  url: string,
  options?: Options2D,
  onLoaded?: () => void
}

export default function ImageContent({ url, options, onLoaded }:ImageContentProps): JSX.Element 
{
  const guid = url.substring(url.lastIndexOf("/") + 1).split(".")[0];
  const url2D = `https://api.readyplayer.me/v1/avatars/${guid}.png?cacheControl=true`

  const generateImageTransform = () => {
      const scale = options?.scale ? `scale(${options.scale.toString()}) ` : "";
      const translate = options?.position ? `translate(${(options.position as number[]).join("px, ")}px) ` : "";
      return scale + translate;
  }
      
  return <img src={url2D} style={{ width: "100%", height: "100%", transform: generateImageTransform() }} onLoad={onLoaded}/>
}