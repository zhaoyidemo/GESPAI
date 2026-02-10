"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import {
  brainVertexShader,
  brainFragmentShader,
  floatVertexShader,
  floatFragmentShader,
  lineVertexShader,
  lineFragmentShader,
  kawaseBlurVertexShader,
  kawaseBlurFragmentShader,
  compositeFragmentShader,
} from "./brain-shaders";
import { useMouseParallax } from "./use-mouse-parallax";

interface BrainSceneProps {
  scrollProgress: number;
  className?: string;
}

// ── 粒子颜色 ──
const COLOR_BLUE = new THREE.Color(0x5b6af0);
const COLOR_PURPLE = new THREE.Color(0x8b5cf6);
const COLOR_LIGHT_BLUE = new THREE.Color(0x60a5fa);
const COLOR_LIGHT_PURPLE = new THREE.Color(0xc084fc);

function getParticleCount() {
  if (typeof window === "undefined") return 800;
  const w = window.innerWidth;
  if (w < 1024) return 600;
  return 1200;
}

// ── Generate cluster positions (four groups for pain-point section) ──
function generateClusterPosition(index: number, total: number): THREE.Vector3 {
  const group = index % 4;
  const offsets = [
    new THREE.Vector3(-2.5, 1.2, 0),
    new THREE.Vector3(2.5, 1.2, 0),
    new THREE.Vector3(-2.5, -1.2, 0),
    new THREE.Vector3(2.5, -1.2, 0),
  ];
  const center = offsets[group];
  const r = 0.5 + Math.random() * 0.5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(
    center.x + r * Math.sin(phi) * Math.cos(theta),
    center.y + r * Math.sin(phi) * Math.sin(theta),
    center.z + r * Math.cos(phi)
  );
}

// ── Generate compact sphere position ──
function generateSpherePosition(): THREE.Vector3 {
  const r = 0.8 + Math.random() * 0.4;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

export default function BrainScene({ scrollProgress, className }: BrainSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const brainGroupRef = useRef<THREE.Group | null>(null);
  const brainMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const floatMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const lineMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const lineGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const frameIdRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock());
  const scrollRef = useRef(0);
  const fpsRef = useRef<number[]>([]);
  const degradedRef = useRef(false);

  // Post-processing refs
  const composerSceneRef = useRef<THREE.Scene | null>(null);
  const composerCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const blurTargetHRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const blurTargetVRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const blurMaterialHRef = useRef<THREE.ShaderMaterial | null>(null);
  const blurMaterialVRef = useRef<THREE.ShaderMaterial | null>(null);
  const compositeMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const quadRef = useRef<THREE.Mesh | null>(null);

  // Internal neuron positions for synapse lines
  const neuronPositionsRef = useRef<Float32Array | null>(null);

  const { mouseRef, update: updateMouse } = useMouseParallax(0.05);

  // Sync scroll prop to ref
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  // ── Compute morph progress from scroll ──
  const getMorphProgress = useCallback((scroll: number) => {
    // 0-15%: brain (morph=0)
    // 20-50%: clusters (morph 0→0.5)
    // 50-60%: back to center (morph 0.5→0.25)
    // 60-75%: sphere (morph 0.25→1.0)
    // 85-100%: expand / explode
    if (scroll < 0.15) return 0;
    if (scroll < 0.20) return ((scroll - 0.15) / 0.05) * 0.5 * 0.1; // ease into cluster
    if (scroll < 0.50) return 0.05 + ((scroll - 0.20) / 0.30) * 0.45;
    if (scroll < 0.60) return 0.5 - ((scroll - 0.50) / 0.10) * 0.25;
    if (scroll < 0.75) return 0.25 + ((scroll - 0.60) / 0.15) * 0.75;
    return 1.0;
  }, []);

  const getPulseIntensity = useCallback((scroll: number) => {
    if (scroll >= 0.15 && scroll <= 0.20) {
      return ((scroll - 0.15) / 0.05);
    }
    if (scroll >= 0.85 && scroll <= 0.95) {
      return ((scroll - 0.85) / 0.10);
    }
    return 0;
  }, []);

  const getBreathScale = useCallback((scroll: number) => {
    if (scroll < 0.15) return 1.0;
    if (scroll >= 0.15 && scroll <= 0.20) {
      return 1.0 + ((scroll - 0.15) / 0.05) * 2.0;
    }
    return 0.5;
  }, []);

  // ── Create brain particles ──
  const createBrainParticles = useCallback((scene: THREE.Scene, group: THREE.Group) => {
    const count = getParticleCount();
    const shellCount = Math.floor(count * 0.53);   // ~640
    const neuronCount = Math.floor(count * 0.17);   // ~200
    const floatingCount = count - shellCount - neuronCount; // ~360
    const totalBrain = shellCount + neuronCount;

    // Arrays for brain particles (shell + neurons)
    const positions = new Float32Array(totalBrain * 3);
    const colors = new Float32Array(totalBrain * 3);
    const sizes = new Float32Array(totalBrain);
    const phases = new Float32Array(totalBrain);
    const brightness = new Float32Array(totalBrain);
    const targetClusters = new Float32Array(totalBrain * 3);
    const targetSpheres = new Float32Array(totalBrain * 3);

    // ── Shell particles (Icosahedron vertices + noise) ──
    const icoGeom = new THREE.IcosahedronGeometry(1.5, 4);
    const icoPositions = icoGeom.attributes.position;
    const icoCount = Math.min(shellCount, icoPositions.count);

    for (let i = 0; i < shellCount; i++) {
      const i3 = i * 3;
      const srcIdx = i % icoCount;

      positions[i3] = icoPositions.getX(srcIdx);
      positions[i3 + 1] = icoPositions.getY(srcIdx);
      positions[i3 + 2] = icoPositions.getZ(srcIdx);

      // Color: gradient blue → purple based on Y position
      const t = (positions[i3 + 1] + 1.5) / 3.0;
      const color = new THREE.Color().lerpColors(COLOR_BLUE, COLOR_PURPLE, t);
      // Occasional bright particles
      if (Math.random() < 0.1) {
        color.lerp(Math.random() < 0.5 ? COLOR_LIGHT_BLUE : COLOR_LIGHT_PURPLE, 0.5);
      }
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = 0.15 + Math.random() * 0.15;
      phases[i] = Math.random() * Math.PI * 2;
      brightness[i] = 0.5 + Math.random() * 0.5;

      // Cluster target
      const ct = generateClusterPosition(i, totalBrain);
      targetClusters[i3] = ct.x;
      targetClusters[i3 + 1] = ct.y;
      targetClusters[i3 + 2] = ct.z;

      // Sphere target
      const st = generateSpherePosition();
      targetSpheres[i3] = st.x;
      targetSpheres[i3 + 1] = st.y;
      targetSpheres[i3 + 2] = st.z;
    }

    icoGeom.dispose();

    // ── Internal neuron nodes ──
    const neuronPosData = new Float32Array(neuronCount * 3);
    for (let i = 0; i < neuronCount; i++) {
      const idx = shellCount + i;
      const i3 = idx * 3;
      const ni3 = i * 3;

      const r = Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      neuronPosData[ni3] = x;
      neuronPosData[ni3 + 1] = y;
      neuronPosData[ni3 + 2] = z;

      const t2 = Math.random();
      const color2 = new THREE.Color().lerpColors(COLOR_BLUE, COLOR_PURPLE, t2);
      colors[i3] = color2.r;
      colors[i3 + 1] = color2.g;
      colors[i3 + 2] = color2.b;

      sizes[idx] = 0.1 + Math.random() * 0.1;
      phases[idx] = Math.random() * Math.PI * 2;
      brightness[idx] = 0.6 + Math.random() * 0.4;

      const ct2 = generateClusterPosition(idx, totalBrain);
      targetClusters[i3] = ct2.x;
      targetClusters[i3 + 1] = ct2.y;
      targetClusters[i3 + 2] = ct2.z;

      const st2 = generateSpherePosition();
      targetSpheres[i3] = st2.x;
      targetSpheres[i3 + 1] = st2.y;
      targetSpheres[i3 + 2] = st2.z;
    }

    neuronPositionsRef.current = neuronPosData;

    // ── Brain geometry ──
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aBrightness", new THREE.BufferAttribute(brightness, 1));
    geometry.setAttribute("aTargetCluster", new THREE.BufferAttribute(targetClusters, 3));
    geometry.setAttribute("aTargetSphere", new THREE.BufferAttribute(targetSpheres, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader: brainVertexShader,
      fragmentShader: brainFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseRadius: { value: 1.5 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMorphProgress: { value: 0 },
        uPulseIntensity: { value: 0 },
        uBreathScale: { value: 1.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    brainMaterialRef.current = material;

    const points = new THREE.Points(geometry, material);
    group.add(points);

    // ── Synapse lines ──
    const linePositions: number[] = [];
    const lineOpacities: number[] = [];
    const threshold = 0.7;

    for (let i = 0; i < neuronCount; i++) {
      for (let j = i + 1; j < neuronCount; j++) {
        const dx = neuronPosData[i * 3] - neuronPosData[j * 3];
        const dy = neuronPosData[i * 3 + 1] - neuronPosData[j * 3 + 1];
        const dz = neuronPosData[i * 3 + 2] - neuronPosData[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold) {
          linePositions.push(
            neuronPosData[i * 3], neuronPosData[i * 3 + 1], neuronPosData[i * 3 + 2],
            neuronPosData[j * 3], neuronPosData[j * 3 + 1], neuronPosData[j * 3 + 2]
          );
          const op = 1.0 - dist / threshold;
          lineOpacities.push(op, op);
        }
      }
    }

    if (linePositions.length > 0) {
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute("aOpacity", new THREE.Float32BufferAttribute(lineOpacities, 1));
      lineGeometryRef.current = lineGeometry;

      const lineMaterial = new THREE.ShaderMaterial({
        vertexShader: lineVertexShader,
        fragmentShader: lineFragmentShader,
        uniforms: {
          uPulseIntensity: { value: 0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      lineMaterialRef.current = lineMaterial;

      const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(lineSegments);
    }

    // ── Floating particles ──
    const fPositions = new Float32Array(floatingCount * 3);
    const fSizes = new Float32Array(floatingCount);
    const fPhases = new Float32Array(floatingCount);
    const fSpeeds = new Float32Array(floatingCount);

    for (let i = 0; i < floatingCount; i++) {
      const r2 = 1.8 + Math.random() * 2.5;
      const theta2 = Math.random() * Math.PI * 2;
      const phi2 = Math.acos(2 * Math.random() - 1);
      fPositions[i * 3] = r2 * Math.sin(phi2) * Math.cos(theta2);
      fPositions[i * 3 + 1] = r2 * Math.sin(phi2) * Math.sin(theta2);
      fPositions[i * 3 + 2] = r2 * Math.cos(phi2);
      fSizes[i] = 0.04 + Math.random() * 0.08;
      fPhases[i] = Math.random() * Math.PI * 2;
      fSpeeds[i] = 0.1 + Math.random() * 0.3;
    }

    const fGeometry = new THREE.BufferGeometry();
    fGeometry.setAttribute("position", new THREE.BufferAttribute(fPositions, 3));
    fGeometry.setAttribute("aSize", new THREE.BufferAttribute(fSizes, 1));
    fGeometry.setAttribute("aPhase", new THREE.BufferAttribute(fPhases, 1));
    fGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(fSpeeds, 1));

    const fMaterial = new THREE.ShaderMaterial({
      vertexShader: floatVertexShader,
      fragmentShader: floatFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uScrollProgress: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    floatMaterialRef.current = fMaterial;

    const floatPoints = new THREE.Points(fGeometry, fMaterial);
    group.add(floatPoints);

    return { geometry, fGeometry };
  }, []);

  // ── Post processing ──
  const setupPostProcessing = useCallback((renderer: THREE.WebGLRenderer, width: number, height: number) => {
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
    renderTargetRef.current = renderTarget;

    const blurTargetH = new THREE.WebGLRenderTarget(width / 2, height / 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    blurTargetHRef.current = blurTargetH;

    const blurTargetV = new THREE.WebGLRenderTarget(width / 2, height / 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    blurTargetVRef.current = blurTargetV;

    const composerScene = new THREE.Scene();
    composerSceneRef.current = composerScene;
    const composerCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    composerCameraRef.current = composerCamera;

    const quadGeometry = new THREE.PlaneGeometry(2, 2);

    const blurMaterialH = new THREE.ShaderMaterial({
      vertexShader: kawaseBlurVertexShader,
      fragmentShader: kawaseBlurFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new THREE.Vector2(width / 2, height / 2) },
        uOffset: { value: 1.5 },
        uDirection: { value: 0 },
      },
    });
    blurMaterialHRef.current = blurMaterialH;

    const blurMaterialV = new THREE.ShaderMaterial({
      vertexShader: kawaseBlurVertexShader,
      fragmentShader: kawaseBlurFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new THREE.Vector2(width / 2, height / 2) },
        uOffset: { value: 1.5 },
        uDirection: { value: 1 },
      },
    });
    blurMaterialVRef.current = blurMaterialV;

    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: kawaseBlurVertexShader,
      fragmentShader: compositeFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        tBlur: { value: null },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTime: { value: 0 },
        uVignetteIntensity: { value: 1.0 },
        uChromaticAberration: { value: 0.002 },
        uDarken: { value: 0 },
      },
    });
    compositeMaterialRef.current = compositeMaterial;

    const quad = new THREE.Mesh(quadGeometry, compositeMaterial);
    quadRef.current = quad;
    composerScene.add(quad);
  }, []);

  // ── Resize handler ──
  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!container || !renderer || !camera) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);

    if (renderTargetRef.current) renderTargetRef.current.setSize(w, h);
    if (blurTargetHRef.current) blurTargetHRef.current.setSize(w / 2, h / 2);
    if (blurTargetVRef.current) blurTargetVRef.current.setSize(w / 2, h / 2);
    if (blurMaterialHRef.current) blurMaterialHRef.current.uniforms.uResolution.value.set(w / 2, h / 2);
    if (blurMaterialVRef.current) blurMaterialVRef.current.uniforms.uResolution.value.set(w / 2, h / 2);
    if (compositeMaterialRef.current) compositeMaterialRef.current.uniforms.uResolution.value.set(w, h);
  }, []);

  // ── Main setup ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06060f);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const group = new THREE.Group();
    scene.add(group);
    brainGroupRef.current = group;

    const { geometry: brainGeom, fGeometry: floatGeom } = createBrainParticles(scene, group);
    setupPostProcessing(renderer, w, h);

    let lastFrameTime = performance.now();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // FPS tracking for auto-degrade
      const now = performance.now();
      const dt = now - lastFrameTime;
      lastFrameTime = now;
      const fps = 1000 / dt;
      fpsRef.current.push(fps);
      if (fpsRef.current.length > 60) fpsRef.current.shift();

      // Auto-degrade: 5 consecutive frames < 30fps
      if (!degradedRef.current && fpsRef.current.length >= 5) {
        const last5 = fpsRef.current.slice(-5);
        if (last5.every((f) => f < 30)) {
          degradedRef.current = true;
          // Disable post-processing on degradation
        }
      }

      const elapsed = clockRef.current.getElapsedTime();
      const scroll = scrollRef.current;

      updateMouse();

      const morphProgress = getMorphProgress(scroll);
      const pulseIntensity = getPulseIntensity(scroll);
      const breathScale = getBreathScale(scroll);

      // Update brain material
      if (brainMaterialRef.current) {
        const u = brainMaterialRef.current.uniforms;
        u.uTime.value = elapsed;
        u.uScrollProgress.value = scroll;
        u.uMouse.value.set(mouseRef.current.x * 3, mouseRef.current.y * 2);
        u.uMorphProgress.value = morphProgress;
        u.uPulseIntensity.value = pulseIntensity;
        u.uBreathScale.value = breathScale;
      }

      // Update float material
      if (floatMaterialRef.current) {
        floatMaterialRef.current.uniforms.uTime.value = elapsed;
        floatMaterialRef.current.uniforms.uScrollProgress.value = scroll;
      }

      // Update line material
      if (lineMaterialRef.current) {
        lineMaterialRef.current.uniforms.uPulseIntensity.value = pulseIntensity;
      }

      // Brain group rotation — mouse tracking
      if (brainGroupRef.current) {
        const targetRotY = mouseRef.current.x * 0.26; // ±15°
        const targetRotX = mouseRef.current.y * -0.17; // ±10°
        brainGroupRef.current.rotation.y += (targetRotY + elapsed * 0.08 - brainGroupRef.current.rotation.y) * 0.05;
        brainGroupRef.current.rotation.x += (targetRotX - brainGroupRef.current.rotation.x) * 0.05;
      }

      // Darken post-processing based on scroll
      const darken = scroll > 0.75 ? ((scroll - 0.75) / 0.1) : 0;

      // ── Render pipeline ──
      if (!degradedRef.current && renderTargetRef.current) {
        renderer.setRenderTarget(renderTargetRef.current);
        renderer.render(scene, camera);

        if (blurMaterialHRef.current && blurTargetHRef.current && quadRef.current) {
          blurMaterialHRef.current.uniforms.tDiffuse.value = renderTargetRef.current.texture;
          quadRef.current.material = blurMaterialHRef.current;
          renderer.setRenderTarget(blurTargetHRef.current);
          renderer.render(composerSceneRef.current!, composerCameraRef.current!);
        }

        if (blurMaterialVRef.current && blurTargetVRef.current && quadRef.current && blurTargetHRef.current) {
          blurMaterialVRef.current.uniforms.tDiffuse.value = blurTargetHRef.current.texture;
          quadRef.current.material = blurMaterialVRef.current;
          renderer.setRenderTarget(blurTargetVRef.current);
          renderer.render(composerSceneRef.current!, composerCameraRef.current!);
        }

        if (compositeMaterialRef.current && quadRef.current && blurTargetVRef.current) {
          compositeMaterialRef.current.uniforms.tDiffuse.value = renderTargetRef.current.texture;
          compositeMaterialRef.current.uniforms.tBlur.value = blurTargetVRef.current.texture;
          compositeMaterialRef.current.uniforms.uTime.value = elapsed;
          compositeMaterialRef.current.uniforms.uDarken.value = Math.min(darken, 1);
          quadRef.current.material = compositeMaterialRef.current;
          renderer.setRenderTarget(null);
          renderer.render(composerSceneRef.current!, composerCameraRef.current!);
        }
      } else {
        // Direct render when degraded
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
      }
    };

    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("resize", handleResize);

      brainGeom.dispose();
      floatGeom.dispose();
      lineGeometryRef.current?.dispose();
      brainMaterialRef.current?.dispose();
      floatMaterialRef.current?.dispose();
      lineMaterialRef.current?.dispose();
      blurMaterialHRef.current?.dispose();
      blurMaterialVRef.current?.dispose();
      compositeMaterialRef.current?.dispose();
      renderTargetRef.current?.dispose();
      blurTargetHRef.current?.dispose();
      blurTargetVRef.current?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [createBrainParticles, setupPostProcessing, handleResize, updateMouse, getMorphProgress, getPulseIntensity, getBreathScale, mouseRef]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 ${className || ""}`}
    />
  );
}
