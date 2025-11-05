import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WaveChart = ({ data, colors = ['#6366f1', '#8b5cf6', '#ec4899'], className = "" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 5, 8);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create wave surface
    const planeGeometry = new THREE.PlaneGeometry(10, 10, 50, 50);
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.8,
      wireframe: false,
      side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Get vertices for animation
    const vertices = planeGeometry.attributes.position.array;

    mount.appendChild(renderer.domElement);

    // Animation
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();

      // Animate vertices to create wave effect
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        
        // Create wave pattern based on data
        const wave1 = Math.sin(x * 0.5 + elapsedTime) * 0.5;
        const wave2 = Math.cos(y * 0.5 + elapsedTime * 0.7) * 0.3;
        const wave3 = Math.sin((x + y) * 0.3 + elapsedTime * 1.2) * 0.4;
        
        vertices[i + 2] = wave1 + wave2 + wave3;
      }

      planeGeometry.attributes.position.needsUpdate = true;
      planeGeometry.computeVertexNormals();

      // Rotate scene slowly
      scene.rotation.y = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [data, colors]);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default WaveChart;