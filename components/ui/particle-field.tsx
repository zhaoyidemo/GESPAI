"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface ParticleFieldProps {
  className?: string;
}

// 真实恒星色谱 - 基于黑体辐射温度
const STAR_COLORS = {
  // O型 (30000K+) - 蓝色
  blue: new THREE.Color(0x9bb0ff),
  // B型 (10000-30000K) - 蓝白色
  blueWhite: new THREE.Color(0xaabfff),
  // A型 (7500-10000K) - 白色
  white: new THREE.Color(0xcad7ff),
  // F型 (6000-7500K) - 黄白色
  yellowWhite: new THREE.Color(0xf8f7ff),
  // G型 (5200-6000K) - 黄色（太阳）
  yellow: new THREE.Color(0xfff4ea),
  // K型 (3700-5200K) - 橙色
  orange: new THREE.Color(0xffd2a1),
  // M型 (<3700K) - 红色
  red: new THREE.Color(0xffcc6f),
};

const STAR_COLOR_ARRAY = Object.values(STAR_COLORS);

// 顶点着色器
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aBrightness;
  attribute float aLayer;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vBrightness;

  void main() {
    vec3 pos = position;

    // 不同层次的星星有不同的运动速度
    float layerSpeed = 0.02 + aLayer * 0.01;

    // 极其缓慢的宇宙漂移
    float drift = sin(pos.x * 0.05 + uTime * layerSpeed + aPhase) * 0.02;
    drift += cos(pos.y * 0.04 + uTime * layerSpeed * 0.8 + aPhase * 0.7) * 0.015;
    pos.z += drift;

    // 计算与鼠标的距离（只影响近处的星星）
    vec2 mouseDir = pos.xy - uMouse;
    float mouseDist = length(mouseDir);

    // 斥力效果 - 近处星星被推开更多
    float repulsion = smoothstep(uMouseRadius, 0.0, mouseDist) * (1.0 - aLayer * 0.5);
    vec2 repulsionDir = normalize(mouseDir + 0.001);
    pos.xy += repulsionDir * repulsion * 1.2;

    // 星星闪烁 - 不同相位
    float twinkleSpeed = 1.5 + aPhase * 0.5;
    float twinkle = sin(uTime * twinkleSpeed + aPhase * 6.28) * 0.15 + 0.85;
    twinkle *= sin(uTime * 0.7 + aPhase * 3.14) * 0.1 + 0.9;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 粒子大小 - 考虑距离衰减和闪烁
    float sizeMultiplier = 1.0 + repulsion * 0.2;
    gl_PointSize = aSize * sizeMultiplier * twinkle * uPixelRatio * (200.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 25.0);

    vColor = aColor;
    vBrightness = aBrightness * twinkle;
    vAlpha = (0.3 + aBrightness * 0.5) * (1.0 - aLayer * 0.3);
  }
`;

// 片段着色器 - 修复方块感，使用圆形衰减
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vBrightness;

  void main() {
    // 计算到中心的距离
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);

    // 圆形裁剪 - 超出圆形范围直接丢弃
    if (r > 1.0) {
      discard;
    }

    // 平滑的径向衰减 - 中心亮，边缘暗
    float falloff = 1.0 - sqrt(r);

    // 星星核心（更亮的中心点）
    float core = exp(-r * 8.0);

    // 柔和光晕
    float halo = exp(-r * 3.0) * 0.4;

    // 组合亮度
    float brightness = (core + halo + falloff * 0.2) * vBrightness;

    // 核心偏白，边缘保持星星本色
    vec3 coreColor = vec3(1.0);
    vec3 finalColor = mix(vColor, coreColor, core * 0.6);

    // 最终透明度 - 边缘完全透明
    float alpha = brightness * vAlpha * falloff;

    gl_FragColor = vec4(finalColor * brightness, alpha);
  }
`;

// Kawase Blur 着色器
const kawaseBlurVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const kawaseBlurFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform vec2 uResolution;
  uniform float uOffset;
  uniform int uDirection;

  varying vec2 vUv;

  void main() {
    vec2 texelSize = 1.0 / uResolution;
    vec4 color = vec4(0.0);

    vec2 offset = uDirection == 0
      ? vec2(uOffset * texelSize.x, 0.0)
      : vec2(0.0, uOffset * texelSize.y);

    color += texture2D(tDiffuse, vUv - offset * 2.0) * 0.0625;
    color += texture2D(tDiffuse, vUv - offset) * 0.25;
    color += texture2D(tDiffuse, vUv) * 0.375;
    color += texture2D(tDiffuse, vUv + offset) * 0.25;
    color += texture2D(tDiffuse, vUv + offset * 2.0) * 0.0625;

    gl_FragColor = color;
  }
`;

// 后处理组合着色器
const compositeFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform sampler2D tBlur;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uVignetteIntensity;
  uniform float uChromaticAberration;

  varying vec2 vUv;

  // 简单的噪声函数
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // 轻微色差
    float aberration = uChromaticAberration * dist * dist;
    vec2 offset = center * aberration;

    float r = texture2D(tDiffuse, vUv + offset).r;
    float g = texture2D(tDiffuse, vUv).g;
    float b = texture2D(tDiffuse, vUv - offset * 0.5).b;

    vec3 color = vec3(r, g, b);

    // 混合模糊层（星光散射）
    vec3 blur = texture2D(tBlur, vUv).rgb;
    color += blur * 0.3;

    // 暗角
    float vignette = 1.0 - dist * dist * uVignetteIntensity;
    vignette = clamp(vignette, 0.0, 1.0);
    color *= vignette;

    // 极轻微的噪点（模拟传感器噪声）
    float noise = hash(vUv + uTime * 0.01) * 0.02 - 0.01;
    color += noise;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function ParticleField({ className }: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameIdRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock());

  // 后处理
  const composerSceneRef = useRef<THREE.Scene | null>(null);
  const composerCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const blurTargetHRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const blurTargetVRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const blurMaterialHRef = useRef<THREE.ShaderMaterial | null>(null);
  const blurMaterialVRef = useRef<THREE.ShaderMaterial | null>(null);
  const compositeMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const quadRef = useRef<THREE.Mesh | null>(null);

  const getParticleCount = useCallback(() => {
    if (typeof window === "undefined") return 3000;
    const width = window.innerWidth;
    if (width < 640) return 2000;
    if (width < 1024) return 4000;
    return 6000;
  }, []);

  const createParticles = useCallback((scene: THREE.Scene, count: number) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const brightness = new Float32Array(count);
    const layers = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 三层分布：近景、中景、远景
      const layer = Math.random();
      layers[i] = layer;

      let radius: number;
      let baseSize: number;

      if (layer < 0.2) {
        // 20% 近景星星 - 更大更亮
        radius = 3 + Math.random() * 5;
        baseSize = 0.3 + Math.random() * 0.4;
      } else if (layer < 0.6) {
        // 40% 中景星星
        radius = 6 + Math.random() * 8;
        baseSize = 0.15 + Math.random() * 0.25;
      } else {
        // 40% 远景星星 - 密集的小星星
        radius = 10 + Math.random() * 15;
        baseSize = 0.05 + Math.random() * 0.15;
      }

      // 球形分布
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5; // 压扁成椭球
      positions[i3 + 2] = radius * Math.cos(phi) - 10;

      // 恒星颜色分布（符合真实比例）
      const colorRand = Math.random();
      let color: THREE.Color;
      if (colorRand < 0.02) {
        color = STAR_COLORS.blue; // 2% O型蓝星（稀有）
      } else if (colorRand < 0.05) {
        color = STAR_COLORS.blueWhite; // 3% B型
      } else if (colorRand < 0.1) {
        color = STAR_COLORS.white; // 5% A型
      } else if (colorRand < 0.2) {
        color = STAR_COLORS.yellowWhite; // 10% F型
      } else if (colorRand < 0.35) {
        color = STAR_COLORS.yellow; // 15% G型（太阳型）
      } else if (colorRand < 0.55) {
        color = STAR_COLORS.orange; // 20% K型
      } else {
        color = STAR_COLORS.red; // 45% M型（最常见）
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // 大小 - 少数亮星
      const sizeRand = Math.random();
      if (sizeRand > 0.995) {
        sizes[i] = baseSize * 3; // 0.5% 特亮星
      } else if (sizeRand > 0.98) {
        sizes[i] = baseSize * 2; // 1.5% 亮星
      } else if (sizeRand > 0.9) {
        sizes[i] = baseSize * 1.3; // 8% 中亮星
      } else {
        sizes[i] = baseSize; // 90% 普通星
      }

      phases[i] = Math.random() * Math.PI * 2;
      brightness[i] = 0.4 + Math.random() * 0.6;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aBrightness", new THREE.BufferAttribute(brightness, 1));
    geometry.setAttribute("aLayer", new THREE.BufferAttribute(layers, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseRadius: { value: 2.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    materialRef.current = material;

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    return particles;
  }, []);

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
        uOffset: { value: 1.0 },
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
        uOffset: { value: 1.0 },
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
        uVignetteIntensity: { value: 0.8 },
        uChromaticAberration: { value: 0.001 },
      },
    });
    compositeMaterialRef.current = compositeMaterial;

    const quad = new THREE.Mesh(quadGeometry, compositeMaterial);
    quadRef.current = quad;
    composerScene.add(quad);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent | TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    mouseRef.current.targetX = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.targetY = -((clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;

    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    if (renderTargetRef.current) renderTargetRef.current.setSize(width, height);
    if (blurTargetHRef.current) blurTargetHRef.current.setSize(width / 2, height / 2);
    if (blurTargetVRef.current) blurTargetVRef.current.setSize(width / 2, height / 2);
    if (blurMaterialHRef.current) blurMaterialHRef.current.uniforms.uResolution.value.set(width / 2, height / 2);
    if (blurMaterialVRef.current) blurMaterialVRef.current.uniforms.uResolution.value.set(width / 2, height / 2);
    if (compositeMaterialRef.current) compositeMaterialRef.current.uniforms.uResolution.value.set(width, height);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 场景 - 纯黑背景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // 相机
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 5;
    cameraRef.current = camera;

    // 渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 创建星星
    const particleCount = getParticleCount();
    createParticles(scene, particleCount);

    // 后处理
    setupPostProcessing(renderer, width, height);

    // 动画
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const elapsed = clockRef.current.getElapsedTime();

      // 平滑鼠标跟随
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsed;
        materialRef.current.uniforms.uMouse.value.set(
          mouseRef.current.x * 6,
          mouseRef.current.y * 4
        );
      }

      // 极缓慢旋转
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.008;
        particlesRef.current.rotation.x = Math.sin(elapsed * 0.005) * 0.02;
      }

      // 渲染管线
      if (renderTargetRef.current) {
        renderer.setRenderTarget(renderTargetRef.current);
        renderer.render(scene, camera);
      }

      if (blurMaterialHRef.current && blurTargetHRef.current && quadRef.current && renderTargetRef.current) {
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

      if (compositeMaterialRef.current && quadRef.current && renderTargetRef.current && blurTargetVRef.current) {
        compositeMaterialRef.current.uniforms.tDiffuse.value = renderTargetRef.current.texture;
        compositeMaterialRef.current.uniforms.tBlur.value = blurTargetVRef.current.texture;
        compositeMaterialRef.current.uniforms.uTime.value = elapsed;
        quadRef.current.material = compositeMaterialRef.current;
        renderer.setRenderTarget(null);
        renderer.render(composerSceneRef.current!, composerCameraRef.current!);
      }
    };

    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }

      if (renderTargetRef.current) renderTargetRef.current.dispose();
      if (blurTargetHRef.current) blurTargetHRef.current.dispose();
      if (blurTargetVRef.current) blurTargetVRef.current.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [createParticles, getParticleCount, handleMouseMove, handleResize, setupPostProcessing]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className || ""}`}
      style={{ touchAction: "none", pointerEvents: "none" }}
    />
  );
}
