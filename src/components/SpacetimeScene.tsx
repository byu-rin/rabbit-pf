import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createBinaryTreeStructure } from './DotShapes';

interface Particle {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  originalPosition: THREE.Vector3;
  shapeType: 'bottle' | 'rabbit' | 'tree';
  depth: number;
}

export const SpacetimeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const worldRef = useRef<CANNON.World | null>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // ========== SCENE SETUP ==========
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    // ========== CAMERA ==========
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // ========== RENDERER ==========
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ========== LIGHTING ==========
    const ambientLight = new THREE.AmbientLight(0x555555, 0.8); // Dark gray ambient
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5a8e, 0.6);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    // ========== PHYSICS WORLD ==========
    const world = new CANNON.World();
    world.gravity.set(0, -0.5, 0);
    world.defaultContactMaterial.friction = 0.5;
    worldRef.current = world;

    // ========== CREATE DOT SHAPES IN BINARY TREE ==========
    const binaryTreeStructures = createBinaryTreeStructure();
    const particles: Particle[] = [];

    binaryTreeStructures.forEach((structure) => {
      structure.shape.positions.forEach((pos) => {
        // Create dot geometry
        const geometry = new THREE.SphereGeometry(0.25, 4, 4);
        const material = new THREE.MeshStandardMaterial({
          color: structure.shape.color,
          emissive: structure.shape.color,
          metalness: 0.4,
          roughness: 0.6,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(pos);
        mesh.castShadow = true;
        scene.add(mesh);

        // Create physics body
        const body = new CANNON.Body({
          mass: 0.1,
          shape: new CANNON.Sphere(0.25),
          linearDamping: 0.4,
          angularDamping: 0.4,
        });
        body.position.copy(pos as any);
        world.addBody(body);

        particles.push({
          mesh,
          body,
          originalPosition: pos.clone(),
          shapeType: structure.shape.type,
          depth: structure.depth,
        });
      });
    });

    particlesRef.current = particles;

    // ========== SCROLL HANDLER ==========
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = docHeight > 0 ? scrollTop / docHeight : 0;
    };

    window.addEventListener('scroll', handleScroll);

    // ========== ANIMATION LOOP ==========
    let animationId: number;
    let frameCount = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      frameCount++;

      // Step physics simulation
      world.step(1 / 60);

      // Update particles with dark gray animation effects
      particles.forEach((particle, index) => {
        // Sync mesh with physics body
        particle.mesh.position.copy(particle.body.position as any);
        particle.mesh.quaternion.copy(particle.body.quaternion as any);

        // Dark gray animation - opacity pulsing based on depth
        const depthFactor = 1 - particle.depth * 0.2;
        const pulse = Math.sin(frameCount * 0.02 + index * 0.1) * 0.3 + 0.7;
        (particle.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
          pulse * depthFactor * 0.6;

        // Scale animation based on shape type
        const baseScale = 0.8;
        let scaleMultiplier = 1;

        if (particle.shapeType === 'bottle') {
          scaleMultiplier = 0.9 + Math.sin(frameCount * 0.015 + index * 0.05) * 0.1;
        } else if (particle.shapeType === 'rabbit') {
          scaleMultiplier = 0.85 + Math.sin(frameCount * 0.02 + index * 0.08) * 0.15;
        } else if (particle.shapeType === 'tree') {
          scaleMultiplier = 1 + Math.sin(frameCount * 0.01 + index * 0.03) * 0.05;
        }

        particle.mesh.scale.set(baseScale * scaleMultiplier, baseScale * scaleMultiplier, baseScale * scaleMultiplier);

        // Color oscillation in dark gray spectrum
        const grayValue = 0.4 + Math.sin(frameCount * 0.01 + index * 0.05) * 0.15;
        const color = (particle.mesh.material as THREE.MeshStandardMaterial).color;
        if (particle.shapeType === 'bottle') {
          color.setRGB(grayValue * 0.6, grayValue * 0.8, grayValue * 0.8);
        } else if (particle.shapeType === 'rabbit') {
          color.setRGB(grayValue * 0.9, grayValue * 0.85, grayValue * 0.8);
        } else {
          color.setRGB(grayValue * 0.7, grayValue * 0.8, grayValue * 0.65);
        }
      });

      // ========== CAMERA MOVEMENT THROUGH SPACETIME ==========
      const targetCameraZ = 50 - scrollProgressRef.current * 150;
      const targetCameraY = scrollProgressRef.current * 100 - 50;
      const targetCameraX = Math.sin(scrollProgressRef.current * Math.PI) * 30;

      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

      camera.lookAt(0, 0, -50);

      // ========== PARTICLE INTERACTIONS ==========
      const cameraPosition = camera.position;
      particles.forEach((particle, index) => {
        const dirToCamera = new THREE.Vector3().subVectors(cameraPosition, particle.mesh.position);
        const distance = dirToCamera.length();

        // Repulsive force from camera
        if (distance < 100) {
          const forceStrength = (100 - distance) * 0.002;
          particle.body.applyForce(
            new CANNON.Vec3(dirToCamera.x * forceStrength, dirToCamera.y * forceStrength, dirToCamera.z * forceStrength * 0.5),
            particle.body.position
          );
        }

        // Gravity towards center
        const centerDistance = particle.originalPosition.length();
        if (centerDistance > 1) {
          const gravityStrength = 0.0001;
          const dirToCenter = new THREE.Vector3().subVectors(
            new THREE.Vector3(),
            particle.mesh.position
          );
          particle.body.applyForce(
            new CANNON.Vec3(
              dirToCenter.x * gravityStrength,
              dirToCenter.y * gravityStrength,
              dirToCenter.z * gravityStrength
            ),
            particle.body.position
          );
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // ========== RESIZE HANDLER ==========
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ========== CLEANUP ==========
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
  );
};
