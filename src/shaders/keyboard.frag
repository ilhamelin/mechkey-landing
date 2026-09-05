// Fragment shader — Anisotropic metal + acrylic refraction effect
uniform float uTime;
uniform float uMetalness;
uniform float uRoughness;
uniform vec3 uColor;
uniform vec3 uAccentColor;
uniform float uRefractionStrength;
uniform sampler2D uMatcap;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;

// ─── Noise ───
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1,0)), f.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
    f.y
  );
}

// ─── GGX Specular (simplified) ───
float GGX(vec3 N, vec3 H, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float denom = (NdotH * NdotH * (a2 - 1.0) + 1.0);
  return a2 / (3.14159 * denom * denom);
}

// ─── Anisotropic brushed metal lines ───
float brushedMetal(vec2 uv, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  vec2 dir = vec2(c, s);
  float lines = noise(vec2(dot(uv, dir) * 120.0, 0.5));
  return smoothstep(0.3, 0.7, lines);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  vec3 L = normalize(vec3(2.0, 4.0, 3.0)); // key light
  vec3 H = normalize(V + L);

  // ─── Matcap-based lighting ───
  vec3 r = reflect(-V, N);
  vec2 matcapUV = vec2(r.x, r.y) * 0.5 + 0.5;

  // ─── Brushed aluminum effect ───
  float brush = brushedMetal(vUv, 0.0);
  float scratchNoise = noise(vUv * 300.0) * 0.05;

  // ─── GGX specular highlight ───
  float spec = GGX(N, H, uRoughness + scratchNoise);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

  // ─── Acrylic refraction (simulated) ───
  vec2 refractedUV = vUv + N.xy * uRefractionStrength * 0.02;
  float refractionNoise = noise(refractedUV * 20.0 + uTime * 0.1) * 0.3;

  // ─── Base color ───
  vec3 color = uColor;

  // Mix in metallic brushed look
  vec3 metalColor = mix(color, vec3(0.9, 0.88, 0.82), uMetalness * brush);

  // Add accent color on edges (fresnel)
  vec3 edgeColor = mix(metalColor, uAccentColor, fresnel * 0.4);

  // Specular highlight
  vec3 finalColor = edgeColor + vec3(spec * (1.0 - uRoughness) * 0.8);

  // Add acrylic shimmer
  finalColor += uAccentColor * refractionNoise * uRefractionStrength;

  // Ambient occlusion approximation from UV edges
  float ao = smoothstep(0.0, 0.1, vUv.x) * smoothstep(0.0, 0.1, vUv.y)
           * smoothstep(1.0, 0.9, vUv.x) * smoothstep(1.0, 0.9, vUv.y);
  finalColor *= (0.7 + 0.3 * ao);

  gl_FragColor = vec4(finalColor, 1.0);
}
