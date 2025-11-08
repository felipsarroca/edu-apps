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

    const preferApiVersion = (process.env.GEMINI_API_VERSION || 'v1').trim();
    const preferModel = (process.env.GEMINI_MODEL || 'gemini-1.5-flash').trim();

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

    const attempts = buildAttempts(preferApiVersion, preferModel);

    let lastError = null;
    for (const attempt of attempts) {
      const url = `https://generativelanguage.googleapis.com/${attempt.apiVersion}/models/${attempt.model}:generateContent?key=${apiKey}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const text = await response.text();
        console.log('Gemini status', attempt.apiVersion, attempt.model, response.status, text.slice(0, 200));
        if (!response.ok) {
          lastError = { status: response.status, body: text, attempt };
          if (response.status === 404 || response.status === 400) continue;
          // altres errors no val la pena reintentar
          break;
        }
        const data = safeJson(text);
        const output =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ??
          data?.candidates?.[0]?.output_text ??
          '';
        const parsed = parseModelJson(output);
        if (parsed && Array.isArray(parsed.mobils)) {
          const cleaned = sanitizeMobils(parsed.mobils);
          return cors(200, { data: { mobils: cleaned } });
        }
        lastError = { status: 422, body: 'Invalid JSON from model', attempt };
      } catch (err) {
        lastError = { status: 500, body: String(err), attempt };
      }
    }

    const hint = 'Revisa GEMINI_MODEL/GEMINI_API_VERSION. Models habituals: gemini-1.5-flash o gemini-pro. L’API v1 és obligatòria per als models 1.5.';
    return cors(lastError?.status || 500, {
      error: 'Gemini error',
      details: lastError?.body || 'Error desconegut',
      hint,
      attempts
    });
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

function buildAttempts(preferVersion, preferModel) {
  const queue = [];
  const seen = new Set();
  const push = (version, model) => {
    const attempt = normalizeCombination(version, model);
    const key = `${attempt.apiVersion}::${attempt.model}`;
    if (seen.has(key)) return;
    seen.add(key);
    queue.push(attempt);
  };

  push(preferVersion, preferModel);
  push(preferVersion, 'gemini-1.5-flash');
  push('v1', 'gemini-1.5-flash');
  push('v1', 'gemini-1.5-flash-latest');
  push('v1', 'gemini-1.5-pro-latest');
  push('v1beta', 'gemini-pro');

  return queue;
}

function normalizeCombination(version, model) {
  const safeModel = (model || 'gemini-1.5-flash').trim();
  let safeVersion = (version || '').trim();
  if (!safeVersion) {
    safeVersion = /gemini-pro/.test(safeModel) ? 'v1beta' : 'v1';
  }

  const isOnePointFive = /gemini-1\.5/i.test(safeModel);
  const isProFamily = /gemini-pro/i.test(safeModel) && !isOnePointFive;

  if (isOnePointFive && safeVersion.startsWith('v1beta')) {
    safeVersion = 'v1';
  }
  if (isProFamily && safeVersion.startsWith('v1')) {
    safeVersion = 'v1beta';
  }

  return { apiVersion: safeVersion, model: safeModel };
}
