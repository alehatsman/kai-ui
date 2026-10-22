// A terminal (xterm.js) colour theme from the current kai-ui tokens. xterm
// takes colour strings, not var(), so the values are read computed. The
// returned object is xterm's ITheme shape; kai-ui does not depend on xterm.

const ANSI = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"] as const
type Ansi = (typeof ANSI)[number]
type BrightAnsi = `bright${Capitalize<Ansi>}`

export type TerminalTheme = {
  background: string
  foreground: string
  cursor: string
  cursorAccent: string
  selectionBackground: string
} & Record<Ansi | BrightAnsi, string>

const cap = <S extends string>(s: S) => (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<S>

/** Read the theme now. Call again after a theme change (see onThemeChange). */
export function terminalTheme(root: HTMLElement = document.documentElement): TerminalTheme {
  const css = getComputedStyle(root)
  const v = (name: string) => css.getPropertyValue(name).trim()
  const theme = {
    background: v("--code-bg"),
    foreground: v("--code-fg"),
    cursor: v("--fg"),
    cursorAccent: v("--code-bg"),
    selectionBackground: v("--accent-muted"),
  } as TerminalTheme
  for (const c of ANSI) {
    theme[c] = v(`--ansi-${c}`)
    theme[`bright${cap(c)}`] = v(`--ansi-bright-${c}`)
  }
  return theme
}

/**
 * Call `cb` whenever the rendered theme may have changed: `data-theme` on
 * <html> changes, or the OS flips light/dark (which matters while no
 * data-theme is set). Returns a cleanup.
 */
export function onThemeChange(
  cb: () => void,
  root: HTMLElement = document.documentElement
): () => void {
  const observer = new MutationObserver(cb)
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] })
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  media.addEventListener("change", cb)
  return () => {
    observer.disconnect()
    media.removeEventListener("change", cb)
  }
}
