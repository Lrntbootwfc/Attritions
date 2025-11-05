import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const AnimatedPieChart = ({ data, colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'], className = "" }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00000000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    // Create pie chart
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    data.forEach((item, index) => {
      const percentage = item.value / total;
      const angle = percentage * Math.PI * 2;
      
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.arc(0, 0, 3, currentAngle, currentAngle + angle, false);
      shape.lineTo(0, 0);

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 10
      });

      const material = new THREE.MeshPhongMaterial({ 
        color: colors[index % colors.length],
        transparent: true,
        opacity: 0.9,
        shininess: 100
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI / 6; // Tilt for better view
      scene.add(mesh);

      currentAngle += angle;
    });

    mount.appendChild(renderer.domElement);

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      scene.rotation.y += 0.005;
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

export default AnimatedPieChart;