import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const InteractiveGlobe = ({ data = [], className = "" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(3, 32, 32);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.9,
      shininess: 100
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add data points
    data.forEach((point, index) => {
      const phi = (90 - point.lat) * (Math.PI / 180);
      const theta = (point.lon + 180) * (Math.PI / 180);

      const x = -(3 * Math.sin(phi) * Math.cos(theta));
      const y = 3 * Math.cos(phi);
      const z = 3 * Math.sin(phi) * Math.sin(theta);

      const pointGeometry = new THREE.SphereGeometry(0.1 + (point.intensity * 0.1), 16, 16);
      const pointMaterial = new THREE.MeshPhongMaterial({
        color: point.color || 0xff4444,
        emissive: point.color || 0xff4444,
        emissiveIntensity: 0.5
      });

      const dataPoint = new THREE.Mesh(pointGeometry, pointMaterial);
      dataPoint.position.set(x, y, z);
      scene.add(dataPoint);
    });

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(3.1, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x6366f1) },
        viewVector: { value: camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    mount.appendChild(renderer.domElement);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event) => {
      isDragging = true;
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      globe.rotation.y += deltaMove.x * 0.01;
      globe.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousedown', handleMouseDown);
    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseup', handleMouseUp);
    mount.addEventListener('mouseleave', handleMouseUp);

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging) {
        globe.rotation.y += 0.002;
      }

      glow.rotation.x = globe.rotation.x;
      glow.rotation.y = globe.rotation.y;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      mount.removeChild(renderer.domElement);
      mount.removeEventListener('mousedown', handleMouseDown);
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseup', handleMouseUp);
      mount.removeEventListener('mouseleave', handleMouseUp);
      renderer.dispose();
    };
  }, [data]);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full cursor-grab active:cursor-grabbing ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

export default InteractiveGlobe;