// Theme selection: data-theme on <html>. No attribute = GitHub following the
// OS; that is the default and needs no JS at all. Apps with a switcher use
// these, plus bootstrapSnippet() inlined in index.html so the saved theme is
// applied before first paint.

export const THEMES = ["auto", "github-light", "github-dark", "monokai"] as const
export type ThemeId = (typeof THEMES)[number]

export const DENSITIES = ["default", "touch"] as const
export type Density = (typeof DENSITIES)[number]

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && (THEMES as readonly string[]).includes(v)
}

/** "auto" removes the attribute; anything else sets it. */
export function applyTheme(theme: ThemeId, root: HTMLElement = document.documentElement): void {
  if (theme === "auto") root.removeAttribute("data-theme")
  else root.setAttribute("data-theme", theme)
}

export function applyDensity(density: Density, root: HTMLElement = document.documentElement): void {
  if (density === "default") root.removeAttribute("data-density")
  else root.setAttribute("data-density", density)
}

/** The stored theme, or `fallback`. Storage can throw (private mode, some webviews). */
export function getTheme(key: string, fallback: ThemeId = "auto"): ThemeId {
  try {
    const stored = localStorage.getItem(key)
    if (isThemeId(stored)) return stored
  } catch {
    // Unavailable storage: the fallback is the answer.
  }
  return fallback
}

/** Persist (best effort) and apply. */
export function setTheme(key: string, theme: ThemeId): void {
  try {
    localStorage.setItem(key, theme)
  } catch {
    // Persistence is best-effort; still apply for this session.
  }
  applyTheme(theme)
}

/**
 * A self-contained script body for a `<script>` in `<head>`, before any
 * stylesheet: applies the stored theme with no flash. Mirrors getTheme +
 * applyTheme; tests/theme.test.ts runs both against the same cases.
 */
export function bootstrapSnippet(key: string, fallback: ThemeId = "auto"): string {
  const k = JSON.stringify(key)
  const f = JSON.stringify(fallback)
  const ids = JSON.stringify(THEMES)
  return `(function(){var t=${f};try{var s=localStorage.getItem(${k});if(${ids}.indexOf(s)>=0)t=s}catch(e){}if(t!=="auto")document.documentElement.setAttribute("data-theme",t)})();`
}
