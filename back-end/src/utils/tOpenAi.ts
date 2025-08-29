export async function tOpenAI(htmlOrText: string, from: string, to: string) {
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // cost-effective; choose your model
      input: [
        {
          role: 'system',
          content:
            "You are a translator. Preserve HTML tags, class names, inline styles, brand names, model numbers, and units. Output only translated text and don't add comments",
        },
        { role: 'user', content: `Translate from ${from} to ${to}:\n${htmlOrText}` },
      ],
    }),
  });
  const j = await r.json();
  // Pull the text from the first output item (Responses API)
  const text = j?.output?.[0]?.content?.[0]?.text ?? j?.choices?.[0]?.message?.content; // fallback if shape differs

  return text || htmlOrText;
}
