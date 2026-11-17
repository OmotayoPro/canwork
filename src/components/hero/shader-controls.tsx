"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { DEFAULT_SHADER_SETTINGS, SHADER_CONTROLS, type ShaderColors, type ShaderSettings } from "./shader-settings";

const COLOR_LABELS = ["Top", "Upper", "Middle", "Lower", "Bottom"];

/**
 * Floating tweak panel for the hero shader. Dev tool: tune live, then "Copy settings"
 * and paste the JSON into DEFAULT_SHADER_SETTINGS to bake it in.
 */
export function ShaderControls({
  settings,
  onChange,
}: {
  settings: ShaderSettings;
  onChange: (next: ShaderSettings) => void;
}) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof ShaderSettings>(key: K, value: ShaderSettings[K]) => onChange({ ...settings, [key]: value });

  const setColor = (i: number, value: string) => {
    const colors = [...settings.colors] as ShaderColors;
    colors[i] = value;
    set("colors", colors);
  };

  async function copy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-[280px] font-sans text-[12px] text-white">
      <div className="overflow-hidden rounded-xl border border-white/15 bg-[#0b1220]/85 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 font-medium"
        >
          Hero shader
          <span className={cn("text-white/60 transition-transform duration-200", open && "rotate-180")}>▾</span>
        </button>

        {open && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-white/10 px-3 pt-2 pb-3">
            <Section title="Colours">
              <div className="grid grid-cols-5 gap-1.5">
                {settings.colors.map((c, i) => (
                  <label key={i} className="flex flex-col items-center gap-1" title={`${COLOR_LABELS[i]}: ${c}`}>
                    <span className="relative block h-8 w-full overflow-hidden rounded-md ring-1 ring-white/20">
                      <span className="absolute inset-0" style={{ background: c }} />
                      <input
                        type="color"
                        value={c}
                        onChange={(e) => setColor(i, e.target.value)}
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                        aria-label={`${COLOR_LABELS[i]} colour`}
                      />
                    </span>
                    <span className="text-[10px] text-white/50">{COLOR_LABELS[i]}</span>
                  </label>
                ))}
              </div>
            </Section>

            {SHADER_CONTROLS.map((section) => (
              <Section key={section.title} title={section.title}>
                {section.sliders.map((s) => (
                  <label key={s.key} className="flex flex-col gap-1">
                    <span className="flex justify-between text-white/70">
                      {s.label}
                      <span className="text-white tabular-nums">{settings[s.key]}</span>
                    </span>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={settings[s.key]}
                      onChange={(e) => set(s.key, Number(e.target.value))}
                      className="w-full cursor-pointer accent-[#3ac2ff]"
                    />
                  </label>
                ))}
              </Section>
            ))}

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="flex-1 cursor-pointer rounded-lg bg-white px-2 py-1.5 font-medium text-[#0f172a] transition-transform active:scale-[0.97]"
              >
                {copied ? "Copied" : "Copy settings"}
              </button>
              <button
                type="button"
                onClick={() => onChange(DEFAULT_SHADER_SETTINGS)}
                className="cursor-pointer rounded-lg border border-white/20 px-3 py-1.5 font-medium transition-transform active:scale-[0.97]"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-2 flex flex-col gap-2.5 border-t border-white/10 pt-2 first:mt-0 first:border-t-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <span aria-hidden className="text-[10px] font-medium tracking-wider text-white/45 uppercase">
        {title}
      </span>
      {children}
    </fieldset>
  );
}
