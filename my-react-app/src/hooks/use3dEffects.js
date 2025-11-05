import { useState, useEffect, useRef } from 'react';

// Hook for floating animation
export const useFloatingAnimation = (speed = 1) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef();

  useEffect(() => {
    let time = 0;

    const animate = () => {
      time += 0.01 * speed;
      
      const x = Math.sin(time) * 10;
      const y = Math.cos(time * 0.7) * 8;
      
      setPosition({ x, y });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  return position;
};

// Hook for parallax effect
export const useParallax = (intensity = 0.5) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth - 0.5) * intensity;
      const y = (clientY / window.innerHeight - 0.5) * intensity;
      
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity]);

  return offset;
};

// Hook for 3D tilt effect
export const use3DTilt = (intensity = 10) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (event) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = (event.clientX - left) / width - 0.5;
      const y = (event.clientY - top) / height - 0.5;
      
      setRotation({
        x: -y * intensity,
        y: x * intensity
      });
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return [rotation, elementRef];
};

// Hook for particle system
export const useParticles = (count = 50) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + 100) % 100,
        y: (particle.y + particle.vy + 100) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [count]);

  return particles;
};