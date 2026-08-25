import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  generateBottle,
  generateRabbit,
  generateTree,
  generateLattice,
  generateField,
  toFloat32,
  edgesToFloat32,
  reseed,
  rng,
  type Cloud,
} from './geometry';

/* ============================================================
   GenerativeWorld — the living 4D dot-space.
   The camera flies through it on scroll (with inertia); the
   mouse parallaxes the whole field. Objects (bottle, rabbit,
   tree) assemble out of scattered dots as the camera nears
   their depth. Everything is monochrome grayscale.
   ============================================================ */

const POINT_VERT = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aSeed;
  uniform float uTime;
  uniform float uAssemble;
  uniform float uSize;
  varying float vB;
  void main() {
    vec3 home = position;
    // gentle 4D hyper-rotation (bounded oscillation -> shape breathes
    // through the 4th dimension yet stays recognizable)
    float w = (aSeed - 0.5) * 4.0;
    float ang = 0.30 * sin(uTime * 0.25 + aSeed * 6.2831);
    float c = cos(ang), s = sin(ang);
    home.x = home.x * c - w * s;
    home.z = home.z * c - w * s * 0.6;
    home *= 1.0 + 0.02 * sin(uTime * 1.5 + aSeed * 10.0);
    vec3 pos = mix(aScatter, home, uAssemble);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (300.0 / max(1.0, -mv.z)) * (0.45 + 0.55 * uAssemble);
    vB = mix(0.08, 0.88, uAssemble) + 0.10 * sin(uTime * 2.0 + aSeed * 18.0);
  }
`;

const POINT_FRAG = /* glsl */ `
  varying float vB;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(vec3(clamp(vB, 0.0, 1.0)), a);
  }
`;

const FIELD_VERT = /* glsl */ `
  attribute float aW;
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  varying float vB;
  void main() {
    vec3 p = position;
    // living dust: slow organic 4D-ish drift keyed off the w coordinate
    vec3 disp;
    disp.x = sin(uTime * 0.30 + aSeed * 30.0 + p.z * 0.02);
    disp.y = cos(uTime * 0.24 + aSeed * 20.0 + p.x * 0.02);
    disp.z = sin(uTime * 0.20 + aSeed * 10.0 + p.y * 0.02);
    disp *= (1.5 + 3.0 * aSeed) * (0.6 + 0.4 * aW);
    vec3 pos = p + disp;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (240.0 / max(1.0, -mv.z));
    vB = 0.09 + aSeed * 0.20 + 0.07 * sin(uTime + aSeed * 25.0);
  }
`;

const FIELD_FRAG = /* glsl */ `
  varying float vB;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    if (length(uv) > 0.5) discard;
    gl_FragColor = vec4(vec3(clamp(vB, 0.0, 1.0)), 0.9);
  }
`;

interface ObjectLayer {
  material: THREE.ShaderMaterial;
  mesh: THREE.Points;
  assembleAt: number; // scroll progress at which this object is fully formed
  spin: number;
}

export const GenerativeWorld: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── renderer / scene / camera ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080a, 0.0016);

    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 6, 55);

    const lineMat = new THREE.LineBasicMaterial({ color: 0x3a3a42, transparent: true, opacity: 0.32 });
    const lineMatFaint = new THREE.LineBasicMaterial({ color: 0x2a2a30, transparent: true, opacity: 0.22 });

    const objectLayers: ObjectLayer[] = [];
    const disposables: Array<{ dispose: () => void }> = [renderer, lineMat, lineMatFaint];

    // ── helper: build an assembling point-object at an anchor ──
    const buildObject = (
      cloud: Cloud,
      dx: number,
      dy: number,
      dz: number,
      size: number,
      assembleAt: number,
      spin = 0,
    ) => {
      // points stay centered at local origin; the mesh is placed at the anchor,
      // so it can spin around its own centre.
      const positions = toFloat32(cloud.points);
      const n = cloud.points.length;
      const scatter = new Float32Array(n * 3);
      const seed = new Float32Array(n);
      reseed(Math.round(Math.abs(dx * 13 + dz * 7)) + 5);
      for (let i = 0; i < n; i++) {
        const rad = 26 + rng() * 55;
        const th = rng() * Math.PI * 2;
        const ph = Math.acos(2 * rng() - 1);
        scatter[i * 3 + 0] = positions[i * 3] + rad * Math.sin(ph) * Math.cos(th);
        scatter[i * 3 + 1] = positions[i * 3 + 1] + rad * Math.cos(ph);
        scatter[i * 3 + 2] = positions[i * 3 + 2] + rad * Math.sin(ph) * Math.sin(th) * 0.6;
        seed[i] = rng();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
      const mat = new THREE.ShaderMaterial({
        vertexShader: POINT_VERT,
        fragmentShader: POINT_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: 0 },
          uSize: { value: size },
        },
      });
      const points = new THREE.Points(geo, mat);
      points.position.set(dx, dy, dz);
      points.frustumCulled = false;
      scene.add(points);
      disposables.push(geo, mat);
      objectLayers.push({ material: mat, mesh: points, assembleAt, spin });

      // edges (branches / structure) ride with the same transform
      if (cloud.edges.length) {
        const eg = new THREE.BufferGeometry();
        eg.setAttribute('position', new THREE.BufferAttribute(edgesToFloat32(cloud.edges), 3));
        const lines = new THREE.LineSegments(eg, lineMat);
        lines.frustumCulled = false;
        points.add(lines); // child of points (local coords) so it spins together
        disposables.push(eg);
      }
      return points;
    };

    // ── ambient dust field (parallax depth, GPU 4D drift) ──
    const field = generateField(reduceMotion ? 900 : 1700);
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute('position', new THREE.BufferAttribute(field.positions, 3));
    fieldGeo.setAttribute('aW', new THREE.BufferAttribute(field.w, 1));
    fieldGeo.setAttribute('aSeed', new THREE.BufferAttribute(field.seed, 1));
    const fieldMat = new THREE.ShaderMaterial({
      vertexShader: FIELD_VERT,
      fragmentShader: FIELD_FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uSize: { value: 1.9 } },
    });
    const fieldPoints = new THREE.Points(fieldGeo, fieldMat);
    fieldPoints.frustumCulled = false;
    scene.add(fieldPoints);
    disposables.push(fieldGeo, fieldMat);

    // ── the binary lattice spine (data -> structure) ──
    const lattice = generateLattice(5, -34);
    const latGeo = new THREE.BufferGeometry();
    latGeo.setAttribute('position', new THREE.BufferAttribute(edgesToFloat32(lattice.edges), 3));
    const latLines = new THREE.LineSegments(latGeo, lineMatFaint);
    latLines.frustumCulled = false;
    scene.add(latLines);
    disposables.push(latGeo);
    buildObject({ points: lattice.points, edges: [] }, 0, 0, 0, 2.6, 0.06);

    // ── the three procedural objects, each in its own clean depth zone ──
    // assembleAt = the scroll progress where the camera frames each one.
    buildObject(generateBottle(), -14, 2, -250, 5.0, 0.38, 0.12);
    buildObject(generateTree(6), 16, -4, -370, 4.0, 0.58, 0.08);
    buildObject(generateRabbit(), -4, 1, -490, 5.0, 0.76, 0.15);

    // ── shared, inertial input ──
    const target = { scroll: 0, mx: 0, my: 0 };
    const smooth = { scroll: 0, mx: 0, my: 0 };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.scroll = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onPointer = (e: PointerEvent) => {
      target.mx = (e.clientX / window.innerWidth) * 2 - 1;
      target.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer);
    window.addEventListener('resize', onResize);
    onScroll();

    const clock = new THREE.Clock();
    let raf = 0;
    const lookTarget = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const dt = Math.min(0.05, clock.getDelta());
      // inertia toward targets (camera glides; mouse a touch looser)
      const kCam = 1 - Math.pow(0.00004, dt);
      const kMouse = 1 - Math.pow(0.002, dt);
      smooth.scroll += (target.scroll - smooth.scroll) * kCam;
      smooth.mx += (target.mx - smooth.mx) * kMouse;
      smooth.my += (target.my - smooth.my) * kMouse;

      // camera flies down -Z through the space, parallax by mouse
      camera.position.z = 55 - smooth.scroll * 615;
      camera.position.x = smooth.mx * 16;
      camera.position.y = 6 - smooth.my * 12;
      lookTarget.set(smooth.mx * 8, 3 - smooth.my * 5, camera.position.z - 70);
      camera.lookAt(lookTarget);

      // drive time + per-object assembly + slow self-rotation
      fieldMat.uniforms.uTime.value = t;
      for (const layer of objectLayers) {
        layer.material.uniforms.uTime.value = t;
        // assembly is driven directly by scroll (ramps up before framing,
        // then stays formed) so it never depends on camera inertia
        const a = Math.min(1, Math.max(0, (target.scroll - (layer.assembleAt - 0.18)) / 0.16));
        layer.material.uniforms.uAssemble.value = a * a * (3 - 2 * a); // smoothstep
        if (layer.spin) layer.mesh.rotation.y = t * layer.spin;
      }

      latLines.rotation.z = Math.sin(t * 0.04) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      disposables.forEach((d) => d.dispose());
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  );
};
