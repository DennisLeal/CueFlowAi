// Vercel serverless endpoint. Keep GEMINI_API_KEY in Vercel Environment Variables—never in browser code.
export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST to generate a script." });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "CueFlow AI is not connected to Gemini yet. Add GEMINI_API_KEY to the Vercel project environment variables, then redeploy."
    });
  }

  const { topic, scriptType, tone } = req.body ?? {};
  if (typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({ error: "Please enter a video topic or idea first." });
  }

  const lengthGuide: Record<string, string> = {
    "Short Video (30–60 sec)": "30–60 seconds, around 75–150 spoken words",
    "Standard Video (5–8 min)": "5–8 minutes, around 650–1,000 spoken words",
    "Long Video (10–15 min)": "10–15 minutes, around 1,300–1,900 spoken words",
    "Custom Length": "a practical length appropriate to the topic"
  };

  const prompt = `You are CueFlow AI, an expert video scriptwriter and speaking coach.
Write a complete, original script based on this creator's idea:
---
${topic.trim()}
---
Video format: ${scriptType || "Standard Video (5–8 min)"}.
Target duration: ${lengthGuide[scriptType] || lengthGuide["Standard Video (5–8 min)"]}.
Tone: ${tone || "Educational"}.
Requirements:
- Write for a real person speaking naturally to a camera, not an essay.
- Use clear, conversational language, contractions, and varied sentence lengths.
- Start with a compelling [HOOK], then [INTRO], organized [MAIN CONTENT] sections, and a memorable [OUTRO] with a natural call to action.
- Include brief [ON-SCREEN] or [B-ROLL] cues only when they genuinely help the video.
- Make the content specific to the topic; avoid generic filler and repeated ideas.
- Do not invent statistics, citations, guarantees, or personal experiences. Flag uncertain facts briefly rather than presenting them as certain.
- Output only the finished script, with section headings. No preamble or explanation.`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 8192 }
        })
      }
    );
    const data: any = await response.json();
    if (!response.ok) {
      const providerMessage = data?.error?.message || "Gemini request failed.";
      return res.status(response.status === 429 ? 429 : 502).json({ error: providerMessage });
    }
    const text = data?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || "").join("").trim();
    if (!text) return res.status(502).json({ error: "Gemini returned an empty script. Please try again." });
    return res.status(200).json({ script: text, model: "Gemini 2.5 Flash" });
  } catch {
    return res.status(500).json({ error: "Could not reach Gemini. Check your internet connection and try again." });
  }
}
