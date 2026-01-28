"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface ParticleFieldProps {
  className?: string;
}

// 宇宙星空配色 - 恒星色谱
const STAR_COLORS = {
  // 蓝白色恒星（O/B型，最热）
  blueWhite: new THREE.Color(0xcad7ff),
  // 白色恒星（A型）
  white: new THREE.Color(0xf8f7ff),
  // 黄白色恒星（F型）
  yellowWhite: new THREE.Color(0xfff4ea),
  // 黄色恒星（G型，如太阳）
  yellow: new THREE.Color(0xffd2a1),
  // 橙色恒星（K型）
  orange: new THREE.Color(0xffcc6f),
  // 红色恒星（M型，最冷）
  red: new THREE.Color(0xffb56c),
  // 蓝色星云
  nebula: new THREE.Color(0x4a6cf0),
};

const STAR_COLOR_ARRAY = Object.values(STAR_COLORS);

// 顶点着色器 - 星空波动 + 鼠标交互
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aBrightness;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vBrightness;

  void main() {
    vec3 pos = position;

    // 缓慢的宇宙漂移
    float drift = sin(pos.x * 0.1 + uTime * 0.1 + aPhase) * 0.05;
    drift += cos(pos.y * 0.08 + uTime * 0.08 + aPhase * 0.7) * 0.03;
    pos.z += drift;

    // 计算与鼠标的距离
    vec2 mouseDir = pos.xy - uMouse;
    float mouseDist = length(mouseDir);

    // 斥力效果 - 星星被推开
    float repulsion = smoothstep(uMouseRadius, 0.0, mouseDist);
    vec2 repulsionDir = normalize(mouseDir + 0.001);
    pos.xy += repulsionDir * repulsion * 1.5;

    // 星星闪烁
    float twinkle = sin(uTime * 2.0 + aPhase * 10.0) * 0.3 + 0.7;

    // 粒子大小
    float sizeMultiplier = 1.0 + repulsion * 0.3;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 基于距离的大小衰减
    gl_PointSize = aSize * sizeMultiplier * twinkle * uPixelRatio * (250.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 30.0);

    vColor = aColor;
    vBrightness = aBrightness * twinkle;
    vAlpha = 0.4 + repulsion * 0.4 + aBrightness * 0.3;
  }
`;

// 片段着色器 - 星星发光效果
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vBrightness;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);

    // 星星核心
    float core = 1.0 - smoothstep(0.0, 0.15, dist);

    // 柔和的光晕
    float halo = exp(-dist * 4.0) * 0.6;

    // 微弱的外层光芒
    float glow = exp(-dist * 2.0) * 0.2;

    float alpha = (core + halo + glow) * vAlpha;

    // 核心更亮，边缘带颜色
    vec3 coreColor = vec3(1.0, 1.0, 1.0);
    vec3 finalColor = mix(vColor, coreColor, core * 0.5) * vBrightness;

    gl_FragColor = vec4(finalColor, alpha);
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

// 后处理组合着色器 - 宇宙色调
const compositeFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform sampler2D tBlur;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uVignetteIntensity;
  uniform float uChromaticAberration;

  varying vec2 vUv;

  // 宇宙色彩分级
  vec3 colorGrade(vec3 color) {
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));

    // 暗部偏深蓝/紫色（宇宙深空）
    vec3 shadows = vec3(0.02, 0.02, 0.08);
    // 中间调偏蓝
    vec3 midtones = vec3(0.05, 0.08, 0.15);
    // 高光保持星星本色
    vec3 highlights = vec3(0.1, 0.15, 0.2);

    vec3 graded = mix(shadows, midtones, smoothstep(0.0, 0.3, luminance));
    graded = mix(graded, highlights, smoothstep(0.3, 0.8, luminance));

    return color + graded * 0.3;
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // 轻微色差
    float aberration = uChromaticAberration * dist;
    vec2 offset = center * aberration;

    float r = texture2D(tDiffuse, vUv + offset).r;
    float g = texture2D(tDiffuse, vUv).g;
    float b = texture2D(tDiffuse, vUv - offset).b;

    vec3 color = vec3(r, g, b);

    // 混合模糊层（星光发散效果）
    vec3 blur = texture2D(tBlur, vUv).rgb;
    color += blur * 0.4;

    // 宇宙色彩分级
    color = colorGrade(color);

    // 暗角 - 宇宙边缘
    float vignette = 1.0 - dist * uVignetteIntensity;
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;

    // 轻微胶片噪点
    float noise = fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
    color += (noise - 0.5) * 0.015;

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

  // 后处理相关
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
    if (width < 640) return 1500;
    if (width < 1024) return 3000;
    return 5000; // 桌面端 5000 颗星星
  }, []);

  const createParticles = useCallback((scene: THREE.Scene, count: number) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const brightness = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 球形分布 - 更像宇宙空间
      const radius = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6; // 压扁一点
      positions[i3 + 2] = radius * Math.cos(phi) - 8;

      // 星星颜色 - 基于恒星色谱
      const colorIndex = Math.floor(Math.random() * STAR_COLOR_ARRAY.length);
      const color = STAR_COLOR_ARRAY[colorIndex];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // 星星大小分布 - 大部分是小星星，少数亮星
      const sizeRand = Math.random();
      if (sizeRand > 0.98) {
        sizes[i] = 0.8 + Math.random() * 0.4; // 2% 亮星
      } else if (sizeRand > 0.9) {
        sizes[i] = 0.4 + Math.random() * 0.3; // 8% 中等星
      } else {
        sizes[i] = 0.1 + Math.random() * 0.25; // 90% 小星星
      }

      // 随机相位（用于闪烁）
      phases[i] = Math.random() * Math.PI * 2;

      // 亮度
      brightness[i] = 0.5 + Math.random() * 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aBrightness", new THREE.BufferAttribute(brightness, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseRadius: { value: 2.5 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
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

    if (renderTargetRef.current) {
      renderTargetRef.current.setSize(width, height);
    }
    if (blurTargetHRef.current) {
      blurTargetHRef.current.setSize(width / 2, height / 2);
    }
    if (blurTargetVRef.current) {
      blurTargetVRef.current.setSize(width / 2, height / 2);
    }

    if (blurMaterialHRef.current) {
      blurMaterialHRef.current.uniforms.uResolution.value.set(width / 2, height / 2);
    }
    if (blurMaterialVRef.current) {
      blurMaterialVRef.current.uniforms.uResolution.value.set(width / 2, height / 2);
    }
    if (compositeMaterialRef.current) {
      compositeMaterialRef.current.uniforms.uResolution.value.set(width, height);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 场景 - 深邃宇宙背景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020208); // 极深的蓝黑色
    sceneRef.current = scene;

    // 相机
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
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

    // 设置后处理
    setupPostProcessing(renderer, width, height);

    // 动画循环
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const elapsed = clockRef.current.getElapsedTime();

      // 平滑鼠标跟随
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // 更新着色器
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsed;
        materialRef.current.uniforms.uMouse.value.set(
          mouseRef.current.x * 8,
          mouseRef.current.y * 6
        );
      }

      // 缓慢旋转星空
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.02;
        particlesRef.current.rotation.x = Math.sin(elapsed * 0.01) * 0.05;
      }

      // 渲染到纹理
      if (renderTargetRef.current) {
        renderer.setRenderTarget(renderTargetRef.current);
        renderer.render(scene, camera);
      }

      // 水平模糊
      if (blurMaterialHRef.current && blurTargetHRef.current && quadRef.current && renderTargetRef.current) {
        blurMaterialHRef.current.uniforms.tDiffuse.value = renderTargetRef.current.texture;
        quadRef.current.material = blurMaterialHRef.current;
        renderer.setRenderTarget(blurTargetHRef.current);
        renderer.render(composerSceneRef.current!, composerCameraRef.current!);
      }

      // 垂直模糊
      if (blurMaterialVRef.current && blurTargetVRef.current && quadRef.current && blurTargetHRef.current) {
        blurMaterialVRef.current.uniforms.tDiffuse.value = blurTargetHRef.current.texture;
        quadRef.current.material = blurMaterialVRef.current;
        renderer.setRenderTarget(blurTargetVRef.current);
        renderer.render(composerSceneRef.current!, composerCameraRef.current!);
      }

      // 最终组合
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
      style={{ touchAction: "none" }}
    />
  );
}
