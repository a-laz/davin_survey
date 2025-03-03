import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ShootingStarsProps {
  count?: number;
}

const ShootingStars: React.FC<ShootingStarsProps> = ({ count = 50 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const shootingStarsRef = useRef<THREE.Points | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x66FCF1,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Create shooting stars
    const shootingStarsGeometry = new THREE.BufferGeometry();
    const shootingStarsMaterial = new THREE.PointsMaterial({
      color: 0x66FCF1,
      size: 0.2,
      transparent: true,
      opacity: 1,
    });

    const shootingStarsVertices = [];
    const shootingStarsVelocities = [];
    const shootingStarsLifetimes = [];

    for (let i = 0; i < count; i++) {
      // Start position
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      
      // Velocity
      const vx = (Math.random() - 0.5) * 0.3;
      const vy = (Math.random() - 0.5) * 0.3;
      const vz = (Math.random() - 0.5) * 0.3;
      
      // Lifetime
      const lifetime = Math.random() * 100 + 50;
      
      shootingStarsVertices.push(x, y, z);
      shootingStarsVelocities.push(vx, vy, vz);
      shootingStarsLifetimes.push(lifetime);
    }

    shootingStarsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(shootingStarsVertices, 3)
    );
    
    const shootingStars = new THREE.Points(shootingStarsGeometry, shootingStarsMaterial);
    scene.add(shootingStars);
    shootingStarsRef.current = shootingStars;

    // Animation
    const animate = () => {
      if (!shootingStars || !shootingStarsGeometry) return;
      
      const positions = shootingStarsGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Update position
        positions[i3] += shootingStarsVelocities[i3];
        positions[i3 + 1] += shootingStarsVelocities[i3 + 1];
        positions[i3 + 2] += shootingStarsVelocities[i3 + 2];
        
        // Decrease lifetime
        shootingStarsLifetimes[i]--;
        
        // Reset if lifetime is over or out of bounds
        if (
          shootingStarsLifetimes[i] <= 0 ||
          Math.abs(positions[i3]) > 50 ||
          Math.abs(positions[i3 + 1]) > 50 ||
          Math.abs(positions[i3 + 2]) > 50
        ) {
          positions[i3] = (Math.random() - 0.5) * 100;
          positions[i3 + 1] = (Math.random() - 0.5) * 100;
          positions[i3 + 2] = (Math.random() - 0.5) * 100;
          
          shootingStarsVelocities[i3] = (Math.random() - 0.5) * 0.3;
          shootingStarsVelocities[i3 + 1] = (Math.random() - 0.5) * 0.3;
          shootingStarsVelocities[i3 + 2] = (Math.random() - 0.5) * 0.3;
          
          shootingStarsLifetimes[i] = Math.random() * 100 + 50;
        }
      }
      
      shootingStarsGeometry.attributes.position.needsUpdate = true;
      
      // Rotate stars slightly
      if (starsRef.current) {
        starsRef.current.rotation.x += 0.0003;
        starsRef.current.rotation.y += 0.0002;
      }
      
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ShootingStars;