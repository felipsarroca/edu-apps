const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

const SYSTEM_PROMPT = `Analitza el següent enunciat de cinemàtica i retorna exclusivament un JSON amb el format:
{
  "mobils": [
    {
      "nom": "text",
      "tipus": "MRU | MRUA | CAIGUDA | TIR_VERTICAL | TIR_PARABOLIC",
      "v0": number,
      "a": number,
      "s0": number,
      "t": number,
      "g": number | opcional,
      "angle": number | opcional
    }
  ]
}

Indica només els camps necessaris. Fes servir metres, segons i m/s.
Si l'enunciat no és clar, proposa valors raonables i indica la teva decisió al resum (camp opcional "nota").
Retorna únicament la serialització JSON sense text extra.`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Mètode no permès' })
    };
  }

  let enunciat;
  try {
    const body = JSON.parse(event.body || '{}');
    enunciat = body?.enunciat?.toString().trim();
  } catch {
    enunciat = null;
  }

  if (!enunciat) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Cal proporcionar un enunciat' })
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Falta la clau GEMINI_API_KEY' })
    };
  }

  try {
    const resposta = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              { text: `Enunciat: ${enunciat}` }
            ]
          }
        ]
      })
    });

    if (!resposta.ok) {
      const errorText = await resposta.text();
      console.error('[analyze] Error Gemini', errorText);
      return {
        statusCode: resposta.status,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Error en la crida a Gemini' })
      };
    }

    const payload = await resposta.json();
    const text =
      payload?.candidates?.[0]?.content?.parts?.[0]?.text ??
      payload?.candidates?.[0]?.output_text ??
      '';

    const parsed = extreuJSON(text);
    if (!parsed || !Array.isArray(parsed.mobils)) {
      return {
        statusCode: 502,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Resposta invàlida de la IA' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ data: parsed })
    };
  } catch (error) {
    console.error('[analyze] Error inesperat', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Error intern del servidor' })
    };
  }
};

function extreuJSON(text) {
  if (!text) return null;
  const net = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  try {
    return JSON.parse(net);
  } catch {
    try {
      const inici = net.indexOf('{');
      const fi = net.lastIndexOf('}');
      if (inici >= 0 && fi >= 0) {
        return JSON.parse(net.slice(inici, fi + 1));
      }
    } catch {
      return null;
    }
    return null;
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
