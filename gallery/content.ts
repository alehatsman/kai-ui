// Sample content for the markdown / code demos, shared by all three columns.
// Markdown arrives as renderer output (HTML), exactly as an app would hand it
// over; highlighted code arrives as runs of [hljs class | null, text].

export type Run = readonly [cls: string | null, text: string]

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** One line's runs as markup: what a highlighter's output looks like. */
export const runsHtml = (runs: readonly Run[]) =>
  runs.map(([cls, text]) => (cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text))).join("")

export const HL_LINES: readonly (readonly Run[])[] = [
  [
    ["hljs-keyword", "export"],
    [null, " "],
    ["hljs-keyword", "function"],
    [null, " "],
    ["hljs-title function_", "pageList"],
    [null, "("],
    ["hljs-params", "current: number, last: number"],
    [null, ") {"],
  ],
  [
    [null, "  "],
    ["hljs-comment", "// 1 … 3 4 [5] 6 7 … 12"],
  ],
  [
    [null, "  "],
    ["hljs-keyword", "const"],
    [null, " out: ("],
    ["hljs-built_in", "number"],
    [null, " | "],
    ["hljs-literal", "null"],
    [null, ")[] = []"],
  ],
  [],
  [
    [null, "  "],
    ["hljs-keyword", "return"],
    [null, " out."],
    ["hljs-title function_", "concat"],
    [null, "("],
    ["hljs-string", '"…"'],
    [null, ", "],
    ["hljs-number", "12"],
    [null, ")"],
  ],
  [[null, "}"]],
]

export const SNIPPET_LINES: readonly string[] = [
  "func (s *Store) Get(id string) (*Run, error) {",
  "\trow := s.db.QueryRow(`SELECT * FROM runs WHERE id = ?`, id)",
  "\tvar r Run",
  "\tif err := row.Scan(&r.ID, &r.State); err != nil {",
  '\t\treturn nil, fmt.Errorf("get run %s: %w", id, err)',
  "\t}",
  "\treturn &r, nil",
  "}",
]

/** The highlighted sample as markup, for a `<code>` element. */
export const HL_BLOCK_HTML = HL_LINES.map(runsHtml).join("\n")

export const CODE_BLOCK_HTML = `<pre class="code-block"><code>${HL_BLOCK_HTML}</code></pre>`

export const MARKDOWN_HTML = `<h1>Release notes</h1>
<p>kai-ui styles <strong>rendered</strong> markdown. It never parses it: the app keeps its renderer and wraps the output in <code>.markdown-body</code>. See <a href="#content">the spec</a>.</p>
<h2>What changed</h2>
<ul>
<li>Markdown body, code block, syntax colours</li>
<li>CodeSnippet with a focus range
<ul><li>nested lists stay tight</li></ul>
</li>
</ul>
<ol><li>Install</li><li>Import <code>kai-ui/css</code></li></ol>
<blockquote><p>Colour only — highlighting inherits the surface it sits on.</p></blockquote>
<h3>Tokens</h3>
<table><thead><tr><th>Token</th><th>Role</th></tr></thead><tbody><tr><td><code>--hl-keyword</code></td><td>keywords, tags</td></tr><tr><td><code>--code-bg</code></td><td>code surface</td></tr></tbody></table>
<pre><code class="hljs">${HL_BLOCK_HTML}</code></pre>
<hr>
<p>Diff scopes: <span class="hljs-addition">+ added</span> <span class="hljs-deletion">- removed</span></p>`
