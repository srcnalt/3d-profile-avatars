import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { clamp, damp, dampEuler, Nodes } from './utils';
import { Euler, Matrix4, Quaternion, SkinnedMesh } from 'three';

let faceMesh: FaceMesh;
let headMesh: SkinnedMesh;

const matrix = new Matrix4();
let targetRotation = new Quaternion();

let targetEuler = new Euler();
let currentEuler = new Euler();

let targetMouth = 0;
let currentMouth = 0;
let mouthOpenMorphIndex = -1;
let jawOpenMorphIndex = -1;

let targetSmile = 0;
let currentSmile = 0;
let mouthSmileMorphIndex = -1;

let targetRightEye = 0;
let currentRightEye = 0;
let eyeBlinkRightMorphIndex = -1;
let eyeSquintRightMorphIndex = -1;

let targetLeftEye = 0;
let currentLeftEye = 0;
let eyeBlinkLeftMorphIndex = -1;
let eyeSquintLeftMorphIndex = -1;

export default function useFaceTracking(enabled: boolean | undefined, nodes: Nodes) {
  const initFaceTracking = async () => {
    const video = document.createElement('video');

    const camera = new Camera(video, {
      onFrame: async () => {
        if (faceMesh) {
          await faceMesh.send({ image: video });
        }
      },
      width: 1280,
      height: 720,
    });
    camera.start();

    if (faceMesh == null) {
      faceMesh = new FaceMesh({
        locateFile: file => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        enableFaceGeometry: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      faceMesh.onResults(onResults);
      await faceMesh.initialize();
    }
  };

  function setMorphIndices() {
    headMesh = (nodes.Wolf3D_Head || nodes.Wolf3D_Avatar) as SkinnedMesh;
    
    mouthOpenMorphIndex = headMesh?.morphTargetDictionary!['mouthOpen'];
    jawOpenMorphIndex = headMesh?.morphTargetDictionary!['jawOpen'];

    mouthSmileMorphIndex = headMesh?.morphTargetDictionary!['mouthSmile'];

    eyeBlinkRightMorphIndex = headMesh?.morphTargetDictionary!['eyeBlinkRight'];
    eyeSquintRightMorphIndex = headMesh?.morphTargetDictionary!['eyeSquintRight'];

    eyeBlinkLeftMorphIndex = headMesh?.morphTargetDictionary!['eyeBlinkLeft'];
    eyeSquintLeftMorphIndex = headMesh?.morphTargetDictionary!['eyeSquintLeft'];
  }

  function onResults(results: Results) {
    if (results.multiFaceGeometry.length > 0) {
      const data = results.multiFaceGeometry[0].getPoseTransformMatrix();

      const m = data.getPackedDataList();
      matrix.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
      targetRotation.setFromRotationMatrix(matrix);

      // mouth
      const mouthUp = results.multiFaceLandmarks[0][12].y;
      const mouthDown = results.multiFaceLandmarks[0][15].y;
      targetMouth = Math.min((Math.abs(mouthUp - mouthDown) - 0.01) / 0.05, 0.7);

      // smile
      const mouthLeft = results.multiFaceLandmarks[0][292].y;
      const mouthRight = results.multiFaceLandmarks[0][62].y;
      targetSmile = 1 - clamp(Math.abs(mouthUp - (mouthLeft + mouthRight) / 2 - 0.001) / 0.01, 0, 1);

      // right eye
      const rightEyeUp = results.multiFaceLandmarks[0][386].y;
      const rightEyeDown = results.multiFaceLandmarks[0][374].y;
      targetRightEye = 1 - clamp((Math.abs(rightEyeUp - rightEyeDown) - 0.015) * 200, 0, 1);

      // left eye
      const leftEyeUp = results.multiFaceLandmarks[0][159].y;
      const leftEyeDown = results.multiFaceLandmarks[0][145].y;
      targetLeftEye = 1 - clamp((Math.abs(leftEyeUp - leftEyeDown) - 0.015) * 200, 0, 1);
    }
  }

  useEffect(() => {
    if (!enabled) return;
    setMorphIndices();
    initFaceTracking();
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const e = new Euler().setFromQuaternion(targetRotation);
    targetEuler = new Euler(-e.x, e.y, e.z);

    dampEuler(currentEuler, targetEuler, 5, delta);

    nodes.Head.setRotationFromEuler(currentEuler);

    if (headMesh && headMesh.morphTargetInfluences) {
      currentMouth = damp(currentMouth, targetMouth, 10, delta);
      headMesh.morphTargetInfluences[mouthOpenMorphIndex] = currentMouth;
      headMesh.morphTargetInfluences[jawOpenMorphIndex] = currentMouth;

      currentSmile = damp(currentSmile, targetSmile, 10, delta);
      headMesh.morphTargetInfluences[mouthSmileMorphIndex] = currentSmile;

      currentRightEye = damp(currentRightEye, targetRightEye, 10, delta);
      headMesh.morphTargetInfluences[eyeBlinkRightMorphIndex] = currentRightEye;
      headMesh.morphTargetInfluences[eyeSquintRightMorphIndex] = currentRightEye;

      currentLeftEye = damp(currentLeftEye, targetLeftEye, 10, delta);
      headMesh.morphTargetInfluences[eyeBlinkLeftMorphIndex] = currentLeftEye;
      headMesh.morphTargetInfluences[eyeSquintLeftMorphIndex] = currentLeftEye;
    }
  });
}
