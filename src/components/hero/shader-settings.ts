export type ShaderColors = [string, string, string, string, string];

export type ShaderSettings = {
  /** Five gradient stops, mapped from the top of the hero (first) to the bottom (last). */
  colors: ShaderColors;
  /** Master motion multiplier. 0 freezes everything. */
  speed: number;
  /** Direction the liquid flows in, in degrees (0 = left → right, 90 = bottom → top). */
  flowAngle: number;
  /** How fast the liquid drifts forward along the flow angle. 0 = no drift. */
  flowSpeed: number;
  /** Sideways sway of a sine wave travelling along the flow. 0 = no wave. */
  waveAmplitude: number;
  /** How many wave crests fit across the hero. */
  waveFrequency: number;
  /** How fast the sine wave travels forward. */
  waveSpeed: number;
  /** In-place churning of the liquid, on top of the directional motion. */
  turbulence: number;
  /** Zoom of the liquid field. Higher = smaller, busier shapes. */
  scale: number;
  /** Domain-warp strength. Higher = more liquid / swirly. */
  warp: number;
  /** How much the colours follow a straight top→bottom ramp (1) vs. the liquid field (0). */
  vertical: number;
  /** Spreads the field across more of the palette. */
  contrast: number;
  /** Shifts the whole palette up or down. */
  offset: number;
  /** Number of liquid-metal bands. 0 turns banding off. */
  bands: number;
  /** How tight each band's crest is. */
  bandSharpness: number;
  /** How far the bands push colours along the palette. */
  bandStrength: number;
  /** White metallic highlight on band crests. */
  sheen: number;
  /** Film grain. */
  grain: number;
  /** Ripple displacement multiplier. */
  rippleStrength: number;
  /** Ripple front speed, CSS px per second. */
  rippleSpeed: number;
};

export const DEFAULT_SHADER_SETTINGS: ShaderSettings = {
  colors: ["#0458be", "#0b8ee3", "#3cc2f4", "#2cd9cf", "#8af2cc"],
  speed: 0.8,
  flowAngle: 10,
  flowSpeed: 0.21,
  waveAmplitude: 0.08,
  waveFrequency: 3.05,
  waveSpeed: 0,
  turbulence: 0.05,
  scale: 0.35,
  warp: 0,
  vertical: 0.04,
  contrast: 0.2,
  offset: -0.1,
  bands: 3,
  bandSharpness: 1,
  bandStrength: 1,
  sheen: 0,
  grain: 0,
  rippleStrength: 1.9,
  rippleSpeed: 400,
};
