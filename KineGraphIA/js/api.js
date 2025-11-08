const DEFAULT_ENDPOINT = 'https://kinegraphia.netlify.app/.netlify/functions/analyze';
const LOCAL_MATCHER = /(?:localhost|127\.0\.0\.1|\.netlify\.app)$/i;

const API_ENDPOINT = (() => {
  try {
    const cfg = typeof window !== 'undefined' ? window.KG_CONFIG : null;
    const ep = cfg?.apiEndpoint;
    if (typeof ep === 'string' && ep.trim()) return ep.trim();
    if (typeof window !== 'undefined') {
      const origin = window.location?.origin ?? '';
      if (LOCAL_MATCHER.test(origin)) {
        return `${origin.replace(/\/$/, '')}/.netlify/functions/analyze`;
      }
    }
  } catch {}
  return DEFAULT_ENDPOINT;
})();

try {
  const isFallback = API_ENDPOINT === DEFAULT_ENDPOINT;
  console.log('[api.js] endpoint', API_ENDPOINT, isFallback ? '(fallback)' : '');
} catch {}

export async function analitzaAmbIA(enunciat) {
  try {
    const resposta = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enunciat })
    });

    if (!resposta.ok) {
      let errText = '';
      try { errText = await resposta.text(); } catch {}
      console.warn('[api.js] Error HTTP', resposta.status, errText?.slice?.(0, 300));
      return null;
    }

    const payload = await resposta.json();
    // Preferit: { data: { mobils: [...] } }
    const dades = payload?.data;
    if (dades && Array.isArray(dades.mobils)) return dades;
    // Fallback: { output: "...json..." }
    if (typeof payload?.output === 'string') {
      const parsed = parseModelJson(payload.output);
      if (parsed && Array.isArray(parsed.mobils)) {
        return { mobils: parsed.mobils };
      }
    }
    return null;
  } catch (error) {
    console.warn('[api.js] Error de xarxa o parseig', error);
    return null;
  }
}

console.log('[api.js] carregat');

function parseModelJson(outputText) {
  if (!outputText || typeof outputText !== 'string') return null;
  try { const o = JSON.parse(outputText); if (o && typeof o === 'object') return o; } catch {}
  const fence = outputText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence) {
    try { const o = JSON.parse(fence[1]); if (o && typeof o === 'object') return o; } catch {}
  }
  const first = outputText.indexOf('{');
  const last = outputText.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    const slice = outputText.slice(first, last + 1);
    try { const o = JSON.parse(slice); if (o && typeof o === 'object') return o; } catch {}
  }
  return null;
}
