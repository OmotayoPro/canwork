"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { cn } from "@/lib/cn";
import { DEFAULT_SHADER_SETTINGS, type ShaderSettings } from "./shader-settings";

export type GradientShaderHandle = {
  /** Fire a ripple from a point given in CSS pixels relative to the canvas' top-left corner. */
  ripple: (x: number, y: number) => void;
};

/** Seconds (at speed 1) for one cycle of the in-place churn (turbulence), which runs on a circle in noise space. */
const LOOP_SECONDS = 30;
/** Seconds the ripple stays alive (envelope has fully decayed by then). */
export const RIPPLE_SECONDS = 1.8;
const MAX_DPR = 1.5;

const VERTEX = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec2  uRes;
uniform float uDpr;
uniform float uPhase;      // 0..TAU loop phase
uniform float uTime;       // seconds, for grain only
uniform vec4  uRipple;     // xy: origin (device px, GL coords), z: seconds since start (< 0 = off), w: strength
uniform float uRippleSpeed;

uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uC4;
uniform float uDrift;       // forward distance travelled along the flow (accumulated in JS)
uniform float uWavePhase;   // travelling sine-wave phase (accumulated in JS)
uniform float uWaveAmp, uWaveFreq, uTurbulence;
uniform float uFlowAngle, uScale, uWarp, uVertical, uContrast, uOffset;
uniform float uBands, uBandSharp, uBandStrength, uSheen, uGrain;
uniform float uRibbonCount, uRibbonOpacity, uRibbonAmp, uRibbonFreq, uRibbonSoft;
uniform float uRibbonPhase, uRibbonPos, uRibbonSpacing, uRibbonTilt, uRibbonShadow;
uniform vec3  uRibbonColor;

#define TAU 6.28318530718

// 2D simplex noise — Ashima Arts / Stefan Gustavson (MIT).
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 3; i++) { v += amp * snoise(p); p = r * p * 1.9; amp *= 0.45; }
  return v; // ~[-1, 1]
}

// A point moving on a circle: sampling noise along it makes the animation loop exactly.
vec2 orbit(float phase, float r) { return uTurbulence * r * vec2(cos(uPhase + phase), sin(uPhase + phase)); }

vec3 palette(float t) {
  t = clamp(t, 0.0, 1.0) * 4.0;
  vec3 c = mix(uC0, uC1, smoothstep(0.0, 1.0, clamp(t,       0.0, 1.0)));
  c      = mix(c,   uC2, smoothstep(0.0, 1.0, clamp(t - 1.0, 0.0, 1.0)));
  c      = mix(c,   uC3, smoothstep(0.0, 1.0, clamp(t - 2.0, 0.0, 1.0)));
  c      = mix(c,   uC4, smoothstep(0.0, 1.0, clamp(t - 3.0, 0.0, 1.0)));
  return c;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 fc = gl_FragCoord.xy;

  // ---- Ripple: radial wave packet displacing the field ----
  float glow = 0.0;
  if (uRipple.z >= 0.0) {
    float t = uRipple.z;
    vec2  d = fc - uRipple.xy;
    float dist = length(d);
    float radius = t * uRippleSpeed * uDpr;
    float k = (dist - radius) / (260.0 * uDpr);
    float env = exp(-k * k * 3.0) * exp(-t * 1.9) * uRipple.w;
    float wave = sin((dist - radius) / (30.0 * uDpr));
    vec2 dir = dist > 0.001 ? d / dist : vec2(0.0);
    fc -= dir * wave * env * 48.0 * uDpr;
    glow = max(wave, 0.0) * env;
  }

  vec2 uv = fc / uRes;                       // 0..1, y up
  float aspect = uRes.x / uRes.y;
  // Rotate into flow space: +x points along the flow direction, +y across it.
  float ca = cos(uFlowAngle), sa = sin(uFlowAngle);
  vec2 s = mat2(ca, -sa, sa, ca) * ((uv - 0.5) * vec2(aspect, 1.0));

  // Sinusoidal flow: a wave travelling forward bends the liquid sideways.
  s.y += uWaveAmp * 0.3 * sin(s.x * uWaveFreq * TAU / aspect - uWavePhase);

  // Forward flow: the whole field drifts along +x.
  vec2 p = s * uScale * 0.55; // 0.55: scale 1 ≈ two or three large forms across the hero
  p.x -= uDrift;

  // ---- Liquid field: two levels of domain warping ----
  vec2 q = vec2(fbm(p + orbit(0.0, 0.6)),
                fbm(p + vec2(5.2, 1.3) + orbit(2.1, 0.6)));
  vec2 r = vec2(fbm(p + uWarp * q + vec2(1.7, 9.2) + orbit(4.2, 0.4)),
                fbm(p + uWarp * q + vec2(8.3, 2.8) + orbit(1.0, 0.4)));
  float f = fbm(p + uWarp * r - vec2(uDrift * 0.35, 0.0));

  // ---- Map to the palette ----
  float field = clamp((f * 0.5) * uContrast + 0.5, 0.0, 1.0);
  float t = mix(field, 1.0 - uv.y, uVertical) + uOffset;

  // ---- Liquid-metal banding: contour streaks following the field ----
  float on = step(0.01, uBands);
  float wave = 0.5 + 0.5 * sin((f + length(r) * 0.35) * uBands * TAU * 0.5);
  float crest = pow(wave, uBandSharp);
  t += (wave - 0.5) * uBandStrength * on;

  vec3 col = palette(t);
  col = mix(col, vec3(1.0), crest * uSheen * on);

  // ---- Wavy layer: soft stacked waves, front wave lowest and strongest ----
  // Drawn back to front so nearer waves cover the ones behind them.
  for (int i = 0; i < 6; i++) {
    float li = uRibbonCount - 1.0 - float(i);   // layer index: 0 = front (lowest)
    if (li < 0.0) break;
    float x = uv.x;
    float ph = uRibbonPhase * (1.0 + li * 0.3) + li * 1.9;
    float crest = sin(x * TAU * uRibbonFreq * (1.0 + li * 0.18) + ph)
                + 0.35 * sin(x * TAU * uRibbonFreq * 2.3 + ph * 1.4 + li * 2.7);
    float edge = uRibbonPos + li * uRibbonSpacing + (x - 0.5) * uRibbonTilt + uRibbonAmp * crest / 1.35;
    float soft = max(uRibbonSoft, 0.001);
    float depth = edge - uv.y;                  // > 0 inside (below) the wave
    float inside = smoothstep(-soft, soft, depth);
    // Lightest along the crest, settling to a translucent body deeper in, like light catching a fold.
    float rim = exp(-max(depth, 0.0) / 0.14);
    float layerOpacity = uRibbonOpacity * (1.0 - li * 0.14);
    // A soft shadow just above each crest separates the layers.
    float shadow = (1.0 - inside) * exp(-max(-depth, 0.0) / (soft + 0.05)) * uRibbonShadow * layerOpacity;
    col *= 1.0 - shadow;
    col = mix(col, uRibbonColor, clamp(inside * mix(0.4, 1.0, rim) * layerOpacity, 0.0, 1.0));
  }

  // ---- Ripple glow + grain ----
  col += vec3(0.67, 0.9, 1.0) * glow * 0.32;
  col += (hash(gl_FragCoord.xy + fract(uTime * 7.0)) - 0.5) * uGrain;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * Liquid multi-stop gradient drawn with WebGL: domain-warped noise mapped onto a 5-colour ramp,
 * with optional liquid-metal banding. Settings update live without recompiling.
 * Falls back to a static CSS gradient (on the wrapper) when WebGL is unavailable.
 */
export function GradientShader({
  className,
  settings = DEFAULT_SHADER_SETTINGS,
  ref,
}: {
  className?: string;
  settings?: ShaderSettings;
  ref?: Ref<GradientShaderHandle>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rippleRef = useRef<{ x: number; y: number; start: number } | null>(null);
  const settingsRef = useRef(settings);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    settingsRef.current = settings;
    kickRef.current(); // redraw when paused (reduced motion / speed 0)
  }, [settings]);

  useImperativeHandle(ref, () => ({
    ripple(x, y) {
      rippleRef.current = { x, y, start: performance.now() };
      kickRef.current();
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const loc = {
      res: u("uRes"), dpr: u("uDpr"), phase: u("uPhase"), time: u("uTime"),
      ripple: u("uRipple"), rippleSpeed: u("uRippleSpeed"),
      colors: [u("uC0"), u("uC1"), u("uC2"), u("uC3"), u("uC4")],
      drift: u("uDrift"), wavePhase: u("uWavePhase"), waveAmp: u("uWaveAmp"), waveFreq: u("uWaveFreq"),
      turbulence: u("uTurbulence"),
      flowAngle: u("uFlowAngle"), scale: u("uScale"), warp: u("uWarp"), vertical: u("uVertical"),
      contrast: u("uContrast"), offset: u("uOffset"), bands: u("uBands"), bandSharp: u("uBandSharp"),
      bandStrength: u("uBandStrength"), sheen: u("uSheen"), grain: u("uGrain"),
      ribbonCount: u("uRibbonCount"), ribbonOpacity: u("uRibbonOpacity"), ribbonAmp: u("uRibbonAmp"),
      ribbonFreq: u("uRibbonFreq"), ribbonSoft: u("uRibbonSoft"), ribbonPhase: u("uRibbonPhase"),
      ribbonPos: u("uRibbonPos"), ribbonSpacing: u("uRibbonSpacing"), ribbonTilt: u("uRibbonTilt"), ribbonShadow: u("uRibbonShadow"),
      ribbonColor: u("uRibbonColor"),
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let loopTime = 6; // seconds into the churn loop
    let drift = 0; // forward distance, noise units
    let wavePhase = 0; // radians
    let ribbonPhase = 0; // radians
    let clock = 0;
    let last = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      const s = settingsRef.current;
      const r = rippleRef.current;
      let rippleT = -1;
      if (r) {
        rippleT = (now - r.start) / 1000;
        if (rippleT > RIPPLE_SECONDS) {
          rippleRef.current = null;
          rippleT = -1;
        }
      }
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.dpr, dpr);
      gl.uniform1f(loc.phase, (loopTime / LOOP_SECONDS) * Math.PI * 2);
      gl.uniform1f(loc.drift, drift);
      gl.uniform1f(loc.wavePhase, wavePhase);
      gl.uniform1f(loc.waveAmp, s.waveAmplitude);
      gl.uniform1f(loc.waveFreq, s.waveFrequency);
      gl.uniform1f(loc.turbulence, s.turbulence);
      gl.uniform1f(loc.time, clock);
      gl.uniform4f(loc.ripple, r ? r.x * dpr : 0, r ? canvas.height - r.y * dpr : 0, rippleT, s.rippleStrength);
      gl.uniform1f(loc.rippleSpeed, s.rippleSpeed);
      s.colors.forEach((hex, i) => gl.uniform3fv(loc.colors[i], hexToRgb(hex)));
      gl.uniform1f(loc.flowAngle, (s.flowAngle * Math.PI) / 180);
      gl.uniform1f(loc.scale, s.scale);
      gl.uniform1f(loc.warp, s.warp);
      gl.uniform1f(loc.vertical, s.vertical);
      gl.uniform1f(loc.contrast, s.contrast);
      gl.uniform1f(loc.offset, s.offset);
      gl.uniform1f(loc.bands, s.bands);
      gl.uniform1f(loc.bandSharp, s.bandSharpness);
      gl.uniform1f(loc.bandStrength, s.bandStrength);
      gl.uniform1f(loc.sheen, s.sheen);
      gl.uniform1f(loc.grain, s.grain);
      gl.uniform1f(loc.ribbonCount, s.ribbonCount);
      gl.uniform1f(loc.ribbonOpacity, s.ribbonOpacity);
      gl.uniform1f(loc.ribbonAmp, s.ribbonAmplitude);
      gl.uniform1f(loc.ribbonFreq, s.ribbonFrequency);
      gl.uniform1f(loc.ribbonSoft, s.ribbonSoftness);
      gl.uniform1f(loc.ribbonPhase, ribbonPhase);
      gl.uniform1f(loc.ribbonPos, s.ribbonPosition);
      gl.uniform1f(loc.ribbonSpacing, s.ribbonSpacing);
      gl.uniform1f(loc.ribbonTilt, s.ribbonTilt);
      gl.uniform1f(loc.ribbonShadow, s.ribbonShadow);
      gl.uniform3fv(loc.ribbonColor, hexToRgb(s.ribbonColor));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const moving = () => !reduceMotion.matches && settingsRef.current.speed > 0;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      clock += dt;
      if (moving()) {
        const s = settingsRef.current;
        const t = dt * s.speed;
        loopTime = (loopTime + t) % LOOP_SECONDS;
        // Accumulated (not time × speed) so dragging a slider never makes the field jump.
        drift = (drift + t * s.flowSpeed * 0.25) % 1000;
        wavePhase = (wavePhase + t * s.waveSpeed * Math.PI * 0.5) % (Math.PI * 2);
        // Kept below a large multiple of 2π so float precision holds; the waves' phase multipliers aren't integers.
        ribbonPhase = (ribbonPhase + t * s.ribbonSpeed) % (Math.PI * 2000);
      }
      draw(now);
      canvas.dataset.ready = "true";
      if (visible && (moving() || rippleRef.current !== null)) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    kickRef.current = kick;

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);

    reduceMotion.addEventListener("change", kick);

    resize();
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduceMotion.removeEventListener("change", kick);
      kickRef.current = () => {};
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  const [c0, c1, c2, c3, c4] = settings.colors;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none overflow-hidden", className)}
      // Static fallback, also what shows for the instant before WebGL paints.
      style={{ background: `linear-gradient(180deg, ${c0} 0%, ${c1} 30%, ${c2} 55%, ${c3} 78%, ${c4} 100%)` }}
    >
      <canvas
        ref={canvasRef}
        className="block size-full opacity-0 transition-opacity duration-500 data-[ready=true]:opacity-100"
      />
      {/* Black overlay for text contrast — over the canvas and the CSS fallback alike. */}
      <div className="absolute inset-0 bg-black" style={{ opacity: settings.overlay }} />
    </div>
  );
}
