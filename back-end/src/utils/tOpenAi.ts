export async function tOpenAI(htmlOrText: string, from: string, to: string) {
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content:
            "You are a translator. Preserve HTML tags, class names, inline styles, brand names, model numbers, and units. Output only translated text and don't add comments such as '```html'",
        },
        { role: 'user', content: `Translate from ${from} to ${to}:\n${htmlOrText}` },
      ],
    }),
  });
  const j = await r.json();

  const text = j?.output?.[0]?.content?.[0]?.text ?? j?.choices?.[0]?.message?.content;

  return text || htmlOrText;
}
