// netlify/functions/analyze.js
exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return cors(200, {});
    }

    if (event.httpMethod !== 'POST') {
      return cors(405, { error: 'Method Not Allowed' });
    }

    const body = safeJson(event.body);
    const enunciat = body?.enunciat;
    const prompt = body?.prompt;
    const userText = (prompt ?? enunciat ?? '').toString().trim();

    if (!userText) {
      return cors(400, { error: 'Falta "enunciat" o "prompt"' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return cors(500, { error: 'Falta GEMINI_API_KEY al servidor' });
    }

    const apiVersion = (process.env.GEMINI_API_VERSION || 'v1beta').trim();
    const model = (process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest').trim();
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction =
      'Ets un analista de problemes de cinemàtica. A partir del text, ' +
      'extreu i normalitza els mòbils descrits en un JSON estricte amb aquest esquema: ' +
      '{"mobils":[{"nom":string opcional, "tipus":"MRU|MRUA|CAIGUDA|TIR_VERTICAL|TIR_PARABOLIC", "v0":number opcional, "a":number opcional, "s0":number opcional, "t":number opcional, "g":number opcional, "angle":number opcional}]}. ' +
      'Respon ÚNICAMENT el JSON sense comentaris ni text addicional. ' +
      'Unitats: v0 en m/s, a en m/s^2, s0 en m, t en s, g≈9.81 si s’escau, angle en graus.';

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemInstruction },
            { text: userText }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log('Gemini status', response.status, 'body', text.slice(0, 300));

    if (!response.ok) {
      let hint = undefined;
      if (response.status === 404) {
        hint = 'Model o versió no disponible. Prova GEMINI_MODEL=gemini-1.5-flash-latest i GEMINI_API_VERSION=v1beta.';
      }
      return cors(response.status, {
        error: 'Gemini error',
        details: text,
        hint,
        model,
        apiVersion
      });
    }

    const data = safeJson(text);
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.output_text ??
      '';

    const parsed = parseModelJson(output);
    if (!parsed || !Array.isArray(parsed.mobils)) {
      return cors(422, {
        error: 'Format de sortida invàlid',
        details: 'No s’ha pogut trobar un JSON vàlid amb "mobils".'
      });
    }

    const cleaned = sanitizeMobils(parsed.mobils);
    return cors(200, { data: { mobils: cleaned } });
  } catch (error) {
    console.error(error);
    return cors(500, {
      error: 'Error intern',
      details: String(error)
    });
  }
};

function cors(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

function safeJson(text) {
  try {
    return JSON.parse(text ?? 'null');
  } catch {
    return null;
  }
}

function parseModelJson(outputText) {
  if (!outputText || typeof outputText !== 'string') return null;
  // intent 1: direct parse
  let obj = safeJson(outputText);
  if (obj && typeof obj === 'object') return obj;
  // intent 2: code fences ```json ... ```
  const fenceMatch = outputText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    obj = safeJson(fenceMatch[1]);
    if (obj && typeof obj === 'object') return obj;
  }
  // intent 3: find first JSON object
  const firstBrace = outputText.indexOf('{');
  const lastBrace = outputText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const slice = outputText.slice(firstBrace, lastBrace + 1);
    obj = safeJson(slice);
    if (obj && typeof obj === 'object') return obj;
  }
  return null;
}

function sanitizeMobils(mobils) {
  const allowedTypes = new Set(['MRU', 'MRUA', 'CAIGUDA', 'TIR_VERTICAL', 'TIR_PARABOLIC']);
  return mobils
    .filter((m) => m && typeof m === 'object')
    .map((m, idx) => {
      const tipus = String((m.tipus ?? '')).toUpperCase();
      const tipusValid = allowedTypes.has(tipus) ? tipus : 'MRU';
      const nom = m.nom ? String(m.nom) : `Mòbil ${idx + 1}`;
      const toNum = (v, d = undefined) => {
        if (v === undefined || v === null || v === '') return d;
        const str = String(v).replace(',', '.');
        const n = Number(str);
        return Number.isFinite(n) ? n : d;
      };

      const out = {
        nom,
        tipus: tipusValid
      };
      const maybe = {
        v0: toNum(m.v0),
        a: toNum(m.a),
        s0: toNum(m.s0),
        t: toNum(m.t),
        g: toNum(m.g),
        angle: toNum(m.angle)
      };
      for (const k of Object.keys(maybe)) {
        if (maybe[k] !== undefined) out[k] = maybe[k];
      }
      return out;
    });
}
