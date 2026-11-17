"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SHADER_SETTINGS, type ShaderSettings } from "./shader-settings";

const SETTINGS_KEY = "canwork:hero-shader";

/**
 * Hero shader settings, tweakable via the controls panel (shown in dev, or with ?shader in the URL).
 * Tweaks are kept in localStorage so every page with the shader picks them up.
 */
export function useShaderSettings() {
  const [settings, setSettings] = useState<ShaderSettings>(DEFAULT_SHADER_SETTINGS);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const enabled =
      process.env.NODE_ENV === "development" || new URLSearchParams(window.location.search).has("shader");
    if (!enabled) return;
    let saved: ShaderSettings | null = null;
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) saved = { ...DEFAULT_SHADER_SETTINGS, ...JSON.parse(raw) };
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only state after mount
    setShowControls(true);
    if (saved) setSettings(saved);
  }, []);

  const update = (next: ShaderSettings) => {
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  return { settings, update, showControls };
}
