function getApiEndpoint() {
  try {
    const cfg = (typeof window !== 'undefined' && window.KG_CONFIG) ? window.KG_CONFIG : null;
    const ep = cfg?.apiEndpoint;
    if (typeof ep === 'string' && ep.trim()) return ep.trim();
  } catch {}
  return '/.netlify/functions/analyze';
}

export async function analitzaAmbIA(enunciat) {
  try {
    const resposta = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enunciat })
    });

    if (!resposta.ok) {
      console.warn('[api.js] Error HTTP', resposta.status);
      return null;
    }

    const payload = await resposta.json();
    const dades = payload?.data;
    if (!dades || !Array.isArray(dades.mobils)) {
      return null;
    }
    return dades;
  } catch (error) {
    console.warn('[api.js] Error de xarxa o parseig', error);
    return null;
  }
}

console.log('[api.js] carregat');
