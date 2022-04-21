import React, { useEffect, Suspense } from 'react';
import { LinearFilter, Vector2, Vector3 } from 'three';
import { useGLTF, useProgress, Html, Environment, OrbitControls } from '@react-three/drei';
import { useFrame, useThree, useGraph, dispose, Canvas } from '@react-three/fiber';

var blinkTime = 999;
var timeout;
var headMesh;
var morphIndex = 0;

var setNextBlink = function setNextBlink() {
  blinkTime = 0;
  timeout = setTimeout(setNextBlink, Math.random() * 5000 + 2000);
};

function useEyeBlink(enabled, nodes) {
  useEffect(function () {
    if (!enabled) return;
    headMesh = nodes.Wolf3D_Head || nodes.Wolf3D_Avatar;
    var material = headMesh.material;
    material.morphTargets = true;

    if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
      morphIndex = headMesh.morphTargetDictionary.eyesClosed;
    }

    timeout = setTimeout(setNextBlink, 1000);
    return function () {
      clearTimeout(timeout);
    };
  }, [nodes, enabled]);
  useFrame(function (_, delta) {
    if (!enabled) return;

    if (blinkTime < 2 && headMesh.morphTargetInfluences) {
      var value = Math.abs(Math.sin(blinkTime * Math.PI / 2));
      blinkTime += delta * 10;
      headMesh.morphTargetInfluences[morphIndex] = value;
    } else if (headMesh.morphTargetInfluences) {
      headMesh.morphTargetInfluences[morphIndex] = 0;
    }
  });
}

var clamp = function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
var lerp = function lerp(start, end, time) {
  if (time === void 0) {
    time = 0.05;
  }

  return start * (1 - time) + end * time;
};
var mapRange = function mapRange(value, inMin, inMax, outMin, outMax) {
  value = clamp(value, inMin, inMax);
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
var hideHands = function hideHands(nodes) {
  if (nodes.Wolf3D_Hands) {
    nodes.Wolf3D_Hands.visible = false;
  }

  if (nodes.RightHand && nodes.LeftHand) {
    nodes.RightHand.position.set(0, -2, 0);
    nodes.LeftHand.position.set(0, -2, 0);
  }
};
var correctMaterials = function correctMaterials(materials) {
  Object.values(materials).forEach(function (material) {
    // applying LinearFilter to texture to avoid  pixellization
    if (material.map) material.map.minFilter = LinearFilter; // support transparency

    if (material) material.depthWrite = true;
  });
};
var SkinnedMeshType = 'SkinnedMesh';
var isSkinnedMesh = function isSkinnedMesh(node) {
  return node.type === SkinnedMeshType;
};

var rad = Math.PI / 180;
var eyeRotationOffsetX = 90 * rad;
var reset = false;
var timeout$1;
var targetPos = /*#__PURE__*/new Vector2(0, 0);
var currentPos = /*#__PURE__*/new Vector2(0, 0);

var setResetTrue = function setResetTrue() {
  timeout$1 = setTimeout(function () {
    reset = true;
  }, 1000);
};

var setResetFalse = function setResetFalse() {
  clearTimeout(timeout$1);
  reset = false;
};

function useHeadMovement(enabled, nodes) {
  var _useThree = useThree(),
      gl = _useThree.gl;

  useEffect(function () {
    if (!enabled) return;
    gl.domElement.addEventListener('mouseleave', setResetTrue);
    gl.domElement.addEventListener('mouseenter', setResetFalse);
    return function () {
      gl.domElement.removeEventListener('mouseleave', setResetTrue);
      gl.domElement.removeEventListener('mouseenter', setResetFalse);
    };
  }, [gl.domElement, enabled]);
  useFrame(function (state) {
    if (!enabled) return;
    var cameraRotation = Math.abs(state.camera.rotation.z);

    if (!reset && cameraRotation < 0.2) {
      targetPos.x = mapRange(state.mouse.y, -1, 1, 5 * rad, -5 * rad);
      targetPos.y = mapRange(state.mouse.x, -1, 1, -10 * rad, 10 * rad);
    } else {
      targetPos.set(0, 0);
    }

    currentPos.x = lerp(currentPos.x, targetPos.x);
    currentPos.y = lerp(currentPos.y, targetPos.y);
    nodes.Neck.rotation.x = currentPos.x + 0.1;
    nodes.Neck.rotation.y = currentPos.y;
    nodes.Head.rotation.x = currentPos.x * 2;
    nodes.Head.rotation.y = currentPos.y * 2;
    nodes.RightEye.rotation.x = currentPos.x - eyeRotationOffsetX;
    nodes.LeftEye.rotation.x = currentPos.x - eyeRotationOffsetX;
    nodes.RightEye.rotation.z = currentPos.y * 3 + Math.PI;
    nodes.LeftEye.rotation.z = currentPos.y * 3 + Math.PI;
  });
}

var position = /*#__PURE__*/new Vector3(0, -0.6, 0);
function Avatar(_ref) {
  var url = _ref.url,
      eyeBlink = _ref.eyeBlink,
      headMovement = _ref.headMovement,
      onLoaded = _ref.onLoaded;

  var _useGLTF = useGLTF(url),
      scene = _useGLTF.scene;

  var _useGraph = useGraph(scene),
      nodes = _useGraph.nodes,
      materials = _useGraph.materials;

  useEyeBlink(eyeBlink, nodes);
  useHeadMovement(headMovement, nodes);
  useEffect(function () {
    hideHands(nodes);
    correctMaterials(materials);
    if (onLoaded) onLoaded();
    return function () {
      Object.values(materials).forEach(dispose);
      Object.values(nodes).filter(isSkinnedMesh).forEach(dispose);
    };
  }, [materials, nodes, url, onLoaded]);
  return React.createElement("group", {
    position: position
  }, React.createElement("primitive", {
    key: "armature",
    object: nodes.Hips
  }), Object.values(nodes).filter(isSkinnedMesh).map(function (node) {
    return React.createElement("primitive", {
      key: node.name,
      object: node,
      receiveShadow: true,
      castShadow: true
    });
  }));
}

var Loader = function Loader() {
  var _useProgress = useProgress(),
      progress = _useProgress.progress;

  return React.createElement(Html, {
    center: true
  }, progress, " % loaded");
};

var defaultStyle = {
  width: '250px',
  height: '250px',
  backgroundColor: 'orange',
  borderRadius: '100%'
};
function AvatarView(_ref) {
  var url = _ref.url,
      style = _ref.style,
      rotateAvatar = _ref.rotateAvatar,
      eyeBlink = _ref.eyeBlink,
      headMovement = _ref.headMovement,
      _ref$environment = _ref.environment,
      environment = _ref$environment === void 0 ? 'sunset' : _ref$environment,
      fallback = _ref.fallback;
  return React.createElement(Canvas, {
    style: style || defaultStyle,
    camera: {
      fov: 40,
      position: [0, 0, 0.6]
    }
  }, React.createElement(Suspense, {
    fallback: fallback || React.createElement(Loader, null)
  }, environment && React.createElement(Environment, {
    preset: environment
  }), rotateAvatar && React.createElement(OrbitControls, {
    enablePan: false,
    enableZoom: false
  }), React.createElement(Avatar, {
    url: url,
    eyeBlink: eyeBlink,
    headMovement: headMovement
  })));
}

export default AvatarView;
export { Loader };
//# sourceMappingURL=avatar-view.esm.js.map
