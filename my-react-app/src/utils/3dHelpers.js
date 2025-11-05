import * as THREE from 'three';

// Color utilities
export const colorPalettes = {
  corporate: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
  pastel: ['#93c5fd', '#c4b5fd', '#fbcfe8', '#fde68a', '#a7f3d0'],
  vibrant: ['#ef4444', '#f59e0b', '#84cc16', '#06b6d4', '#8b5cf6']
};

export const getColorFromPalette = (index, palette = 'corporate') => {
  const colors = colorPalettes[palette] || colorPalettes.corporate;
  return colors[index % colors.length];
};

// Math utilities for 3D
export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// 3D geometry helpers
export const createExtrudedShape = (points, depth = 1, bevel = true) => {
  const shape = new THREE.Shape();
  
  if (points.length > 0) {
    shape.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    shape.lineTo(points[0].x, points[0].y);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: bevel,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 8
  });

  return geometry;
};

// Data conversion for 3D
export const convertTo3DData = (data, key) => {
  return data.map((item, index) => ({
    value: item[key],
    angle: (index / data.length) * Math.PI * 2,
    color: getColorFromPalette(index),
    ...item
  }));
};

// Camera animation helpers
export const animateCamera = (camera, targetPosition, targetLookAt, duration = 1000) => {
  const startPosition = camera.position.clone();
  const startLookAt = new THREE.Vector3();
  camera.getWorldDirection(startLookAt);

  const startTime = Date.now();

  const animate = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const ease = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPosition, targetPosition, ease);
    
    const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, ease);
    camera.lookAt(currentLookAt);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
};

// Responsive 3D scene setup
export const setupResponsiveScene = (mount, camera, renderer) => {
  const handleResize = () => {
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  handleResize();
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
};