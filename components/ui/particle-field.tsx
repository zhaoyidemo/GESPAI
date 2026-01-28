"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface ParticleFieldProps {
  className?: string;
}

// 配色方案 - 灵感来自 unseen.co
const COLORS = {
  cyan: new THREE.Color(0x00f5ff),
  magenta: new THREE.Color(0xff00ff),
  purple: new THREE.Color(0x8b5cf6),
  green: new THREE.Color(0x00ff88),
  blue: new THREE.Color(0x3b82f6),
};

const COLOR_ARRAY = Object.values(COLORS);

// 顶点着色器 - 波浪运动 + 鼠标距离影响
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute vec3 aColor;
  attribute vec3 aOriginalPosition;
  attribute float aPhase;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // 波浪运动
    float wave = sin(pos.x * 0.5 + uTime * 0.5 + aPhase) * 0.3;
    wave += cos(pos.y * 0.3 + uTime * 0.3 + aPhase * 0.5) * 0.2;
    pos.z += wave;

    // 计算与鼠标的距离
    vec2 mouseDir = pos.xy - uMouse;
    float mouseDist = length(mouseDir);

    // 斥力效果
    float repulsion = smoothstep(uMouseRadius, 0.0, mouseDist);
    vec2 repulsionDir = normalize(mouseDir + 0.001);
    pos.xy += repulsionDir * repulsion * 2.0;

    // 粒子大小随距离变化
    float sizeMultiplier = 1.0 + repulsion * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 粒子大小
    gl_PointSize = aSize * sizeMultiplier * uPixelRatio * (300.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 50.0);

    vColor = aColor;
    vAlpha = 0.6 + repulsion * 0.4;
  }
`;

// 片段着色器 - 软边圆形 + 发光效果
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // 软边圆形
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);

    // 平滑边缘
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

    // 发光效果
    float glow = exp(-dist * 3.0) * 0.5;

    vec3 finalColor = vColor + vColor * glow;

    gl_FragColor = vec4(finalColor, alpha * vAlpha);
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
  uniform int uDirection; // 0 = horizontal, 1 = vertical

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

  // 色彩分级
  vec3 colorGrade(vec3 color) {
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));

    // 暗部偏蓝紫
    vec3 shadows = vec3(0.1, 0.05, 0.2);
    // 高光偏青色
    vec3 highlights = vec3(0.0, 0.3, 0.4);

    vec3 graded = mix(shadows, highlights, luminance);
    return color + graded * 0.15;
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // 色差
    float aberration = uChromaticAberration * dist;
    vec2 offset = center * aberration;

    float r = texture2D(tDiffuse, vUv + offset).r;
    float g = texture2D(tDiffuse, vUv).g;
    float b = texture2D(tDiffuse, vUv - offset).b;

    vec3 color = vec3(r, g, b);

    // 混合模糊层（发光效果）
    vec3 blur = texture2D(tBlur, vUv).rgb;
    color += blur * 0.5;

    // 色彩分级
    color = colorGrade(color);

    // 暗角
    float vignette = 1.0 - dist * uVignetteIntensity;
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;

    // 轻微噪点
    float noise = fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
    color += (noise - 0.5) * 0.02;

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
    if (typeof window === "undefined") return 1500;
    const width = window.innerWidth;
    if (width < 640) return 800;
    if (width < 1024) return 1500;
    return 2500;
  }, []);

  const createParticles = useCallback((scene: THREE.Scene, count: number) => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 随机位置在视野范围内
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10 - 5;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      // 随机颜色
      const color = COLOR_ARRAY[Math.floor(Math.random() * COLOR_ARRAY.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // 随机大小
      sizes[i] = Math.random() * 0.5 + 0.2;

      // 随机相位
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aOriginalPosition", new THREE.BufferAttribute(originalPositions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseRadius: { value: 3.0 },
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
    // 渲染目标
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

    // 后处理场景
    const composerScene = new THREE.Scene();
    composerSceneRef.current = composerScene;

    const composerCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    composerCameraRef.current = composerCamera;

    const quadGeometry = new THREE.PlaneGeometry(2, 2);

    // 水平模糊材质
    const blurMaterialH = new THREE.ShaderMaterial({
      vertexShader: kawaseBlurVertexShader,
      fragmentShader: kawaseBlurFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new THREE.Vector2(width / 2, height / 2) },
        uOffset: { value: 2.0 },
        uDirection: { value: 0 },
      },
    });
    blurMaterialHRef.current = blurMaterialH;

    // 垂直模糊材质
    const blurMaterialV = new THREE.ShaderMaterial({
      vertexShader: kawaseBlurVertexShader,
      fragmentShader: kawaseBlurFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new THREE.Vector2(width / 2, height / 2) },
        uOffset: { value: 2.0 },
        uDirection: { value: 1 },
      },
    });
    blurMaterialVRef.current = blurMaterialV;

    // 组合材质
    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: kawaseBlurVertexShader,
      fragmentShader: compositeFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        tBlur: { value: null },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTime: { value: 0 },
        uVignetteIntensity: { value: 1.2 },
        uChromaticAberration: { value: 0.003 },
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

    // 转换为标准化设备坐标
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

    // 更新后处理渲染目标
    if (renderTargetRef.current) {
      renderTargetRef.current.setSize(width, height);
    }
    if (blurTargetHRef.current) {
      blurTargetHRef.current.setSize(width / 2, height / 2);
    }
    if (blurTargetVRef.current) {
      blurTargetVRef.current.setSize(width / 2, height / 2);
    }

    // 更新着色器分辨率
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

    // 场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // 深色背景
    sceneRef.current = scene;

    // 相机
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;
    cameraRef.current = camera;

    // 渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 创建粒子
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

      // 更新着色器 uniform
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsed;
        materialRef.current.uniforms.uMouse.value.set(
          mouseRef.current.x * 10,
          mouseRef.current.y * 7.5
        );
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

      // 最终组合渲染
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

    // 事件监听
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);

    // 清理
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
