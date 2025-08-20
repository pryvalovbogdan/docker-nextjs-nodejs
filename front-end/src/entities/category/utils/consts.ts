export const emeraldHtmlStyles = `
.emerald-html {
  --eh-emerald: #036753;
  --eh-emerald-600: #045D45;
  --eh-emerald-700: #024E42;
  --eh-black: #0b0b0b;
  --eh-text: #1f2937;         /* gray-800 */
  --eh-subtext: #4b5563;      /* gray-600 */
  --eh-border: #e5e7eb;       /* gray-200 */
  --eh-surface: #ffffff;
  --eh-muted: #f9fafb;        /* gray-50 */
  --eh-shadow: 0 4px 10px rgba(0,0,0,0.08);

  color: var(--eh-text);
  background: var(--eh-surface);
  border-radius: 12px;
  box-shadow: var(--eh-shadow);
  overflow: hidden;
}

.emerald-html .eh-body {
  padding: 20px;
  font-size: 16px;
  line-height: 1.8;
}

.emerald-html h1,
.emerald-html h2,
.emerald-html h3,
.emerald-html h4,
.emerald-html h5,
.emerald-html h6 {
  color: var(--eh-text);
  font-weight: 800;
  margin: 18px 0 10px;
  line-height: 1.25;
}
.emerald-html h1 { font-size: 28px; }
.emerald-html h2 { font-size: 24px; }
.emerald-html h3 { font-size: 20px; }

/* Paragraphs & emphasis */
.emerald-html p {
  margin: 12px 0;
  color: var(--eh-text);
  font-size: 17px;
}
.emerald-html strong, .emerald-html b { font-weight: 700; }
.emerald-html em, .emerald-html i { font-style: italic; }

/* Lists — centered dot/number and text in a single flex row */
.emerald-html ul,
.emerald-html ol {
  margin: 12px 0;
  padding-left: 0;
}

.emerald-html ul li,
.emerald-html ol li {
  display: flex;
  align-items: center;      /* centers marker + multi-line text block vertically */
  gap: 12px;
  list-style: none;
  padding: 12px 14px;
  border-bottom: 1px solid var(--eh-border);
  background: var(--eh-muted);
  color: var(--eh-black);
}

.emerald-html ul li:last-child,
.emerald-html ol li:last-child {
  border-bottom: none;
}

/* Bullet dot flows inline with text */
.emerald-html ul li::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--eh-emerald);   /* accent keeps emerald */
  flex: 0 0 10px;                  /* fixed size, no shrink */
}

/* Numbered list marker inline + centered */
.emerald-html ol { counter-reset: eh-ol; }
.emerald-html ol li::before {
  counter-increment: eh-ol;
  content: counter(eh-ol) ".";
  display: inline-block;
  min-width: 1.5em;               /* room for double digits */
  text-align: center;
  font-weight: 700;
  color: var(--eh-subtext);       /* neutral color (no emerald text) */
  flex: 0 0 1.5em;
}

/* Table */
.emerald-html table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  border: 1px solid var(--eh-border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--eh-shadow);
  font-size: 16px;
}
.emerald-html th,
.emerald-html td {
  padding: 12px 14px;
  border: 1px solid var(--eh-border);
  text-align: left;
  vertical-align: top;
}
.emerald-html th {
  background: rgba(3, 103, 83, 0.8);
  color: #fff;
  font-weight: 800;
}
.emerald-html tr:nth-child(even) td {
  background: #f6faf9;
}

/* Links (neutral text color, subtle underline accent) */
.emerald-html a {
  color: var(--eh-text);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px solid rgba(3,103,83,0.25); /* emerald accent underline */
  transition: color .2s ease, border-color .2s ease;
}
.emerald-html a:hover {
  color: var(--eh-black);
  border-color: rgba(0,0,0,0.35);
  text-decoration: none;
}

/* Code & pre */
.emerald-html code {
  background: #eef7f5;
  color: var(--eh-black);
  padding: 2px 6px;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.95em;
}
.emerald-html pre {
  background: #eef7f5;
  border: 1px solid var(--eh-border);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
}

/* Blockquote (emerald border accent only) */
.emerald-html blockquote {
  border-left: 4px solid var(--eh-emerald);
  background: #f2fbf8;
  padding: 12px 16px;
  margin: 14px 0;
  color: var(--eh-subtext);
}

/* Media */
.emerald-html img {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  margin: 12px auto;
}
.emerald-html iframe {
  width: 100%;
  height: 360px;
  display: block;
  margin: 14px auto;
  border: 0;
  border-radius: 8px;
}

/* Rules */
.emerald-html hr {
  border: none;
  height: 2px;
  background: var(--eh-emerald);  /* accent line */
  margin: 18px 0;
  opacity: 0.8;
}

/* Short (clamped) variant */
.emerald-html.eh-short .eh-body {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--eh-lines, 8);
  overflow: hidden;
}

@media (max-width: 768px) {
  .emerald-html .eh-body { padding: 16px; font-size: 15px; }
  .emerald-html h1 { font-size: 24px; }
  .emerald-html h2 { font-size: 20px; }
  .emerald-html h3 { font-size: 18px; }
  .emerald-html iframe { height: 240px; }
  
  
  .emerald-html table {
    display: block;                  
    overflow-x: auto;               
    -webkit-overflow-scrolling: touch;
  }
  .emerald-html th,
  .emerald-html td {
    padding: 10px 8px;          
    font-size: 14px;
  }
  
  @media (max-width: 420px) {
   .emerald-html th:nth-child(1),
   .emerald-html td:nth-child(1) { min-width: 140px; }
  }
}
`;
