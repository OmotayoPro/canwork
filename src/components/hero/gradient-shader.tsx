"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { cn } from "@/lib/cn";

export type GradientShaderHandle = {
  /** Fire a ripple from a point given in CSS pixels relative to the canvas' top-left corner. */
  ripple: (x: number, y: number) => void;
};

/** Seconds for one full cycle of the background motion. Every time term is a whole multiple of this, so it loops seamlessly. */
const LOOP_SECONDS = 24;
/** Seconds the ripple stays alive (envelope has fully decayed by then). */
export const RIPPLE_SECONDS = 1.8;

const VERTEX = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec2  uRes;     // drawing buffer size, device px
uniform float uTime;    // seconds
uniform vec3  uRipple;  // xy: origin (device px, GL coords), z: seconds since start, < 0 = inactive
uniform float uDpr;

#define TAU 6.28318530718
const float LOOP = ${LOOP_SECONDS.toFixed(1)};

// Macro (not a function) so integer literals are accepted — GLSL ES 1.0 has no implicit int→float.
#define rgb(r, g, b) (vec3(r, g, b) / 255.0)

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

// Soft-edged "below this curve" mask.
float below(float y, float edge, float soft) { return 1.0 - smoothstep(edge - soft, edge + soft, y); }

float blob(vec2 p, vec2 c, float k) { vec2 d = p - c; return exp(-dot(d, d) * k); }

void main() {
  vec2 fc = gl_FragCoord.xy;

  // ---- Ripple: a radial wave packet that displaces the field and leaves a soft glow ----
  float glow = 0.0;
  if (uRipple.z >= 0.0) {
    float t = uRipple.z;
    vec2  d = fc - uRipple.xy;
    float dist = length(d);
    float radius = t * 1300.0 * uDpr;              // front speed
    float width  = 260.0 * uDpr;                   // packet width
    float k = (dist - radius) / width;
    float env = exp(-k * k * 3.0) * exp(-t * 1.9); // packet envelope × decay
    float wave = sin((dist - radius) / (30.0 * uDpr));
    vec2 dir = dist > 0.001 ? d / dist : vec2(0.0);
    fc -= dir * wave * env * 48.0 * uDpr;
    glow = max(wave, 0.0) * env;
  }

  vec2  uv = fc / uRes;              // 0..1, y up
  float aspect = uRes.x / uRes.y;
  float x = uv.x * aspect;           // horizontal, in hero-heights
  float y = uv.y;
  vec2  p = vec2(x, y);
  float a = uTime * TAU / LOOP;      // loop phase

  // ---- Base: deep blue sky, brighter towards the bottom ----
  vec3 col = mix(rgb(20, 150, 228), rgb(4, 102, 198), smoothstep(0.30, 0.95, y));

  // Drifting light pools
  col = mix(col, rgb(16, 168, 236), 0.60 * blob(p, vec2(aspect * (0.70 + 0.06 * sin(a)), 0.88 + 0.05 * cos(2.0 * a)), 2.6));
  col = mix(col, rgb(4, 96, 190),   0.45 * blob(p, vec2(aspect * (0.18 + 0.05 * cos(a)), 0.98), 3.5));
  col = mix(col, rgb(118, 204, 242), 0.55 * blob(p, vec2(aspect * (0.62 + 0.07 * cos(a)), 0.46 + 0.05 * sin(2.0 * a)), 6.0));

  // ---- Wave 1: soft high ridge across the sky ----
  float y1 = 0.60 + 0.070 * sin(x * 1.9 + a + 0.5) + 0.035 * sin(x * 3.7 - 2.0 * a);
  col = mix(col, rgb(4, 92, 186), 0.22 * smoothstep(0.0, 0.10, y - y1) * (1.0 - smoothstep(0.10, 0.24, y - y1)));
  col = mix(col, rgb(52, 176, 238), 0.50 * below(y, y1, 0.045));

  // ---- Wave 2: right-hand cyan sheet sweeping up ----
  float y2 = 0.20 + 0.42 * smoothstep(0.45, 1.05, uv.x + 0.04 * sin(a)) + 0.03 * sin(x * 2.6 - a);
  col = mix(col, rgb(36, 182, 242), 0.55 * below(y, y2, 0.012));

  // ---- Wave 3: crisp teal → mint band near the bottom ----
  float y3 = 0.27 + 0.075 * sin(x * 1.5 - a + 1.2) + 0.028 * sin(x * 3.1 + 2.0 * a);
  vec3 teal = mix(rgb(44, 214, 212), rgb(112, 242, 196), blob(p, vec2(aspect * (0.24 + 0.05 * sin(a)), 0.0), 3.0));
  float m3 = below(y, y3, 0.006);
  col = mix(col, teal, 0.85 * m3);
  col += vec3(0.20) * exp(-pow((y - y3) / 0.005, 2.0));                // edge highlight
  col = mix(col, vec3(1.0), 0.22 * m3 * smoothstep(y3, 0.0, y));        // haze to the bottom

  // ---- Wave 4: pale glassy sheet rising on the right ----
  float y4 = -0.10 + 0.40 * smoothstep(0.42, 1.0, uv.x + 0.05 * cos(a)) + 0.025 * sin(x * 2.2 + 2.0 * a);
  float m4 = below(y, y4, 0.008);
  col = mix(col, rgb(176, 232, 252), 0.55 * m4);
  col += vec3(0.25) * exp(-pow((y - y4) / 0.004, 2.0));

  // ---- Ripple glow + dithering ----
  col += rgb(170, 230, 255) * glow * 0.32;
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0 * 1.5;

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

/**
 * Looping gradient-wave background drawn with WebGL.
 * Falls back to a static CSS gradient (on the wrapper) when WebGL is unavailable.
 */
export function GradientShader({ className, ref }: { className?: string; ref?: Ref<GradientShaderHandle> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rippleRef = useRef<{ x: number; y: number; start: number } | null>(null);
  const kickRef = useRef<() => void>(() => {});

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

    // One oversized triangle covers the viewport.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uRipple = gl.getUniformLocation(program, "uRipple");
    const uDpr = gl.getUniformLocation(program, "uDpr");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let time = 4; // start a little into the loop so the first frame isn't the "rest" pose
    let last = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      const r = rippleRef.current;
      let rippleT = -1;
      if (r) {
        rippleT = (now - r.start) / 1000;
        if (rippleT > RIPPLE_SECONDS) {
          rippleRef.current = null;
          rippleT = -1;
        }
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uDpr, dpr);
      gl.uniform3f(uRipple, r ? r.x * dpr : 0, r ? canvas.height - r.y * dpr : 0, rippleT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!reduceMotion.matches) time = (time + dt) % LOOP_SECONDS;
      draw(now);
      canvas.dataset.ready = "true";
      const animating = !reduceMotion.matches || rippleRef.current !== null;
      if (visible && animating) raf = requestAnimationFrame(frame);
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

    const onMotionChange = () => kick();
    reduceMotion.addEventListener("change", onMotionChange);

    resize();
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduceMotion.removeEventListener("change", onMotionChange);
      kickRef.current = () => {};
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden",
        // Static fallback, also what shows for the instant before WebGL paints.
        "bg-[linear-gradient(180deg,#0466c6_0%,#0d8fe0_45%,#3cb6ef_68%,#2cd6d2_78%,#7fe9cf_100%)]",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="block size-full opacity-0 transition-opacity duration-500 data-[ready=true]:opacity-100"
      />
    </div>
  );
}
