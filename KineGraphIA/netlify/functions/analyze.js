// netlify/functions/analyze.js
exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return cors(200, {});
    }

    if (event.httpMethod !== 'POST') {
      return cors(405, { error: 'Method Not Allowed' });
    }

    const { prompt } = JSON.parse(event.body ?? '{}');
    if (!prompt) {
      return cors(400, { error: 'Falta "prompt"' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return cors(500, { error: 'Falta GEMINI_API_KEY al servidor' });
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log('Gemini status', response.status, 'body', text.slice(0, 300));

    if (!response.ok) {
      return cors(response.status, {
        error: 'Gemini error',
        details: text
      });
    }

    const data = JSON.parse(text);
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.output_text ??
      '';

    return cors(200, { output });
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
