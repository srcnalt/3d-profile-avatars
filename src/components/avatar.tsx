import { Object3D } from "three"
import React, { useEffect } from "react"
import { GLTFLoader } from "three-stdlib"
import { useGLTF } from "@react-three/drei"
import useHeadMovement from "../utils/useHeadMovement"
import { correctMaterials, hideHands } from "../utils/utils"
import { dispose, useGraph, useLoader } from "@react-three/fiber"

interface AvatarProps {
  url: string
  reset?: boolean
  onLoaded?: () => void
}

export default function Avatar({ url, onLoaded }: AvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes, materials } = useGraph(scene)

  hideHands(nodes)
  useHeadMovement(nodes)
  correctMaterials(materials)

  useEffect(() => {
    if (onLoaded) onLoaded()

    return () => {
      useLoader.clear(GLTFLoader, url)
      Object.values(materials).forEach(dispose)
      Object.values(nodes).filter((node: Object3D) => node.type === "SkinnedMesh").forEach(dispose)
    }
  }, [scene])

  return <group position={[0, -0.6, 0]} >
    <primitive key="armature" object={nodes.Hips} />
    {
      Object.values(nodes)
        .filter((node: Object3D) => node.type === "SkinnedMesh")
        .map((node: Object3D) => <primitive key={node.name} object={node} receiveShadow castShadow />)
    }
  </group>
}
