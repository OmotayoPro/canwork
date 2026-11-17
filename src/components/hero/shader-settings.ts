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

  /** Wavy layer: soft, stacked wave shapes drawn on top of the liquid. 0 turns it off. */
  ribbonCount: number;
  /** Colour of the wave shapes. */
  ribbonColor: string;
  /** Opacity of the front wave; layers behind it fade out gradually. */
  ribbonOpacity: number;
  /** Height of the wave crests, as a fraction of the hero height. */
  ribbonAmplitude: number;
  /** How many crests fit across the hero. */
  ribbonFrequency: number;
  /** Edge blur of each wave, as a fraction of the hero height. */
  ribbonSoftness: number;
  /** How fast the waves roll sideways. */
  ribbonSpeed: number;
  /** Height of the front wave's baseline (0 = bottom of the hero, 1 = top). */
  ribbonPosition: number;
  /** Vertical gap between stacked waves. */
  ribbonSpacing: number;
  /** Tilts the waves (positive = rising to the right). */
  ribbonTilt: number;
  /** Soft shadow above each crest that separates the layers. */
  ribbonShadow: number;

  /** Black overlay on top of everything, to keep white text readable. 0–1. */
  overlay: number;
};

export const DEFAULT_SHADER_SETTINGS: ShaderSettings = {
  colors: ["#0566cf", "#0b84e0", "#2fb0f2", "#4cc6f6", "#43dfd2"],
  speed: 0.8,
  flowAngle: 10,
  flowSpeed: 0.21,
  waveAmplitude: 0.08,
  waveFrequency: 3.05,
  waveSpeed: 0,
  turbulence: 0.05,
  scale: 0.35,
  warp: 0,
  vertical: 0.75,
  contrast: 0.6,
  offset: 0,
  bands: 3,
  bandSharpness: 1,
  bandStrength: 1,
  sheen: 0,
  grain: 0,
  rippleStrength: 1.9,
  rippleSpeed: 400,
  ribbonCount: 3,
  ribbonColor: "#8fdcff",
  ribbonOpacity: 0.55,
  ribbonAmplitude: 0.1,
  ribbonFrequency: 0.6,
  ribbonSoftness: 0.02,
  ribbonSpeed: 0.25,
  ribbonPosition: 0.1,
  ribbonSpacing: 0.2,
  ribbonTilt: 0.4,
  ribbonShadow: 0.25,
  overlay: 0.15,
};

type NumericKey = Exclude<keyof ShaderSettings, "colors" | "ribbonColor">;

export type SliderSpec = { key: NumericKey; label: string; min: number; max: number; step: number };

/** Slider definitions for the controls panel, grouped by section. */
export const SHADER_CONTROLS: { title: string; sliders: SliderSpec[] }[] = [
  {
    title: "Motion",
    sliders: [
      { key: "speed", label: "Speed (master)", min: 0, max: 4, step: 0.05 },
      { key: "flowAngle", label: "Flow direction (°)", min: 0, max: 360, step: 1 },
      { key: "flowSpeed", label: "Forward flow", min: 0, max: 2, step: 0.01 },
      { key: "waveAmplitude", label: "Sine sway", min: 0, max: 1.5, step: 0.01 },
      { key: "waveFrequency", label: "Sine frequency", min: 0.1, max: 6, step: 0.05 },
      { key: "waveSpeed", label: "Sine speed", min: 0, max: 3, step: 0.05 },
      { key: "turbulence", label: "Turbulence", min: 0, max: 1.5, step: 0.01 },
    ],
  },
  {
    title: "Shape",
    sliders: [
      { key: "scale", label: "Scale", min: 0.2, max: 4, step: 0.05 },
      { key: "warp", label: "Liquidity (warp)", min: 0, max: 4, step: 0.05 },
      { key: "vertical", label: "Vertical ramp", min: 0, max: 1, step: 0.01 },
      { key: "contrast", label: "Contrast", min: 0.2, max: 4, step: 0.05 },
      { key: "offset", label: "Palette offset", min: -0.6, max: 0.6, step: 0.01 },
    ],
  },
  {
    title: "Banding",
    sliders: [
      { key: "bands", label: "Bands", min: 0, max: 30, step: 0.5 },
      { key: "bandSharpness", label: "Sharpness", min: 1, max: 40, step: 0.5 },
      { key: "bandStrength", label: "Strength", min: 0, max: 1, step: 0.01 },
      { key: "sheen", label: "Metal sheen", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Wavy layer",
    sliders: [
      { key: "ribbonCount", label: "Layers", min: 0, max: 6, step: 1 },
      { key: "ribbonOpacity", label: "Opacity", min: 0, max: 1, step: 0.01 },
      { key: "ribbonAmplitude", label: "Wave height", min: 0, max: 0.5, step: 0.005 },
      { key: "ribbonFrequency", label: "Crests across", min: 0.1, max: 4, step: 0.05 },
      { key: "ribbonSoftness", label: "Softness", min: 0.002, max: 0.4, step: 0.002 },
      { key: "ribbonSpeed", label: "Roll speed", min: 0, max: 2, step: 0.01 },
      { key: "ribbonPosition", label: "Position", min: -0.3, max: 1.2, step: 0.01 },
      { key: "ribbonSpacing", label: "Layer spacing", min: 0, max: 0.5, step: 0.005 },
      { key: "ribbonTilt", label: "Tilt", min: -1, max: 1, step: 0.01 },
      { key: "ribbonShadow", label: "Shadow", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Finish",
    sliders: [
      { key: "overlay", label: "Black overlay", min: 0, max: 0.8, step: 0.01 },
      { key: "grain", label: "Grain", min: 0, max: 0.2, step: 0.005 },
    ],
  },
  {
    title: "Ripple",
    sliders: [
      { key: "rippleStrength", label: "Strength", min: 0, max: 3, step: 0.05 },
      { key: "rippleSpeed", label: "Speed (px/s)", min: 400, max: 3000, step: 50 },
    ],
  },
];
