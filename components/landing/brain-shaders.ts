// brain-shaders.ts — GESP AI 超算大脑 GLSL 着色器

// ── 大脑粒子 顶点着色器 ──
export const brainVertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uPixelRatio;
  uniform float uMorphProgress;
  uniform float uPulseIntensity;
  uniform float uBreathScale;

  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aBrightness;
  attribute vec3 aTargetCluster;
  attribute vec3 aTargetSphere;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vBrightness;
  varying float vDistToCenter;

  // simplex noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;

    // simplex noise distortion on brain shell
    float noiseVal = snoise(pos * 0.8 + uTime * 0.15) * 0.3;
    vec3 brainPos = pos + normalize(pos) * noiseVal;

    // breath / pulse scaling
    float breath = 1.0 + sin(uTime * 1.5) * 0.03 * uBreathScale;
    brainPos *= breath;

    // pulse effect
    float pulse = sin(uTime * 3.0 + length(pos) * 2.0) * uPulseIntensity * 0.15;
    brainPos += normalize(pos) * pulse;

    // morph targets based on scroll
    // 0.0 = brain, 0.5 = clusters, 1.0 = sphere
    vec3 morphedPos;
    if (uMorphProgress < 0.5) {
      float t = uMorphProgress * 2.0;
      morphedPos = mix(brainPos, aTargetCluster, t);
    } else {
      float t = (uMorphProgress - 0.5) * 2.0;
      morphedPos = mix(aTargetCluster, aTargetSphere, t);
    }

    // mouse repulsion
    vec2 mouseDir = morphedPos.xy - uMouse;
    float mouseDist = length(mouseDir);
    float repulsion = smoothstep(uMouseRadius, 0.0, mouseDist) * 0.8;
    vec2 repulsionDir = normalize(mouseDir + 0.001);
    morphedPos.xy += repulsionDir * repulsion;

    // subtle drift
    float drift = snoise(vec3(morphedPos.xy * 0.3, uTime * 0.1 + aPhase)) * 0.05;
    morphedPos += normalize(morphedPos + 0.001) * drift;

    vec4 mvPosition = modelViewMatrix * vec4(morphedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // point size
    float sizeMultiplier = 1.0 + repulsion * 0.3 + pulse * 0.5;
    gl_PointSize = aSize * sizeMultiplier * uPixelRatio * (180.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 20.0);

    vColor = aColor;
    vBrightness = aBrightness * (1.0 + pulse * 2.0);
    vAlpha = 0.5 + aBrightness * 0.5;
    vDistToCenter = length(morphedPos);
  }
`;

// ── 大脑粒子 片段着色器 ──
export const brainFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vBrightness;
  varying float vDistToCenter;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);

    if (r > 1.0) discard;

    float falloff = 1.0 - sqrt(r);
    float core = exp(-r * 8.0);
    float halo = exp(-r * 3.0) * 0.4;
    float brightness = (core + halo + falloff * 0.2) * vBrightness;

    vec3 coreColor = vec3(1.0);
    vec3 finalColor = mix(vColor, coreColor, core * 0.5);

    float alpha = brightness * vAlpha * falloff;

    gl_FragColor = vec4(finalColor * brightness, alpha);
  }
`;

// ── 飘浮粒子 顶点着色器 ──
export const floatVertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uScrollProgress;

  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // orbital motion
    float angle = uTime * aSpeed + aPhase;
    float radius = length(pos.xy);
    pos.x += cos(angle) * 0.3;
    pos.y += sin(angle * 0.7) * 0.3;
    pos.z += sin(angle * 0.5 + aPhase) * 0.2;

    // expand with scroll
    pos *= 1.0 + uScrollProgress * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = aSize * uPixelRatio * (100.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.3, 8.0);

    // twinkle
    float twinkle = sin(uTime * 2.0 + aPhase * 6.28) * 0.3 + 0.7;
    vAlpha = twinkle * 0.4;
  }
`;

// ── 飘浮粒子 片段着色器 ──
export const floatFragmentShader = `
  varying float vAlpha;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    float falloff = exp(-r * 4.0);
    vec3 color = vec3(0.6, 0.7, 1.0);

    gl_FragColor = vec4(color * falloff, vAlpha * falloff);
  }
`;

// ── 连线着色器 ──
export const lineVertexShader = `
  attribute float aOpacity;
  varying float vOpacity;

  void main() {
    vOpacity = aOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const lineFragmentShader = `
  uniform float uPulseIntensity;
  varying float vOpacity;

  void main() {
    vec3 baseColor = vec3(1.0);
    float alpha = vOpacity * (0.06 + uPulseIntensity * 0.12);
    gl_FragColor = vec4(baseColor, alpha);
  }
`;

// ── Kawase Blur 着色器（复用 particle-field 模式）──
export const kawaseBlurVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const kawaseBlurFragmentShader = `
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

// ── 后处理组合着色器 ──
export const compositeFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform sampler2D tBlur;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uVignetteIntensity;
  uniform float uChromaticAberration;
  uniform float uDarken;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);

    // chromatic aberration
    float aberration = uChromaticAberration * dist * dist;
    vec2 offset = center * aberration;

    float r = texture2D(tDiffuse, vUv + offset).r;
    float g = texture2D(tDiffuse, vUv).g;
    float b = texture2D(tDiffuse, vUv - offset * 0.5).b;

    vec3 color = vec3(r, g, b);

    // bloom from blur
    vec3 blur = texture2D(tBlur, vUv).rgb;
    color += blur * 0.4;

    // vignette
    float vignette = 1.0 - dist * dist * uVignetteIntensity;
    vignette = clamp(vignette, 0.0, 1.0);
    color *= vignette;

    // darken for scroll sections
    color *= (1.0 - uDarken * 0.3);

    // subtle noise
    float noise = hash(vUv + uTime * 0.01) * 0.015 - 0.0075;
    color += noise;

    gl_FragColor = vec4(color, 1.0);
  }
`;
