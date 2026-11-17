export type ShaderColors = [string, string, string, string, string];

export type ShaderSettings = {
  /** Five gradient stops, mapped from the top of the hero (first) to the bottom (last). */
  colors: ShaderColors;
  /** Motion speed multiplier. 0 freezes the flow. */
  speed: number;
  /** Rotates the flow field, in degrees. */
  flowAngle: number;
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
  speed: 1,
  flowAngle: 20,
  scale: 0.8,
  warp: 1.1,
  vertical: 0.55,
  contrast: 1.5,
  offset: 0,
  bands: 3,
  bandSharpness: 3,
  bandStrength: 0.16,
  sheen: 0.1,
  grain: 0.03,
  rippleStrength: 1,
  rippleSpeed: 1300,
};

type NumericKey = Exclude<keyof ShaderSettings, "colors">;

export type SliderSpec = { key: NumericKey; label: string; min: number; max: number; step: number };

/** Slider definitions for the controls panel, grouped by section. */
export const SHADER_CONTROLS: { title: string; sliders: SliderSpec[] }[] = [
  {
    title: "Motion",
    sliders: [
      { key: "speed", label: "Speed", min: 0, max: 4, step: 0.05 },
      { key: "flowAngle", label: "Flow angle", min: 0, max: 360, step: 1 },
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
    title: "Finish",
    sliders: [{ key: "grain", label: "Grain", min: 0, max: 0.2, step: 0.005 }],
  },
  {
    title: "Ripple",
    sliders: [
      { key: "rippleStrength", label: "Strength", min: 0, max: 3, step: 0.05 },
      { key: "rippleSpeed", label: "Speed (px/s)", min: 400, max: 3000, step: 50 },
    ],
  },
];
