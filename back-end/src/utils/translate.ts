const BASE = 'https://translate.googleapis.com/translate_a/single';

type Opts = { userAgent?: string };

function pickTranslated(body: any): string | null {
  try {
    if (!Array.isArray(body) || !Array.isArray(body[0])) {
      return null;
    }

    return body[0].map((s: any) => (Array.isArray(s) ? s[0] : '')).join('');
  } catch {
    return null;
  }
}

function splitForTranslate(s: string, max = 4500): string[] {
  const parts: string[] = [];
  let i = 0;

  while (i < s.length) {
    let end = Math.min(i + max, s.length);

    if (end < s.length) {
      const ws = s.lastIndexOf(' ', end);

      if (ws > i + 1000) {
        end = ws;
      }
    }

    parts.push(s.slice(i, end));
    i = end;
  }

  return parts;
}

async function translateChunk(text: string, from: string, to: string, ua?: string): Promise<string> {
  const url = `${BASE}?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(
    to,
  )}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url, { headers: ua ? { 'User-Agent': ua } : {} });

  if (!res.ok) {
    throw new Error(`gtx ${res.status}`);
  }

  const body = await res.json();
  const translated = pickTranslated(body);

  if (!translated) {
    throw new Error('Translation not found');
  }

  return translated;
}

async function t(text?: string | null, from = 'uk', to = 'ru', opts: Opts = {}): Promise<string> {
  if (!text || !text.trim() || from === to) {
    return text ?? '';
  }

  const chunks = splitForTranslate(text);
  const out: string[] = [];

  for (const chunk of chunks) {
    try {
      out.push(await translateChunk(chunk, from, to, opts.userAgent));
    } catch (e) {
      console.error('translate error:', e);
      out.push(chunk);
    }

    await new Promise(r => setTimeout(r, 120));
  }

  return out.join('');
}
