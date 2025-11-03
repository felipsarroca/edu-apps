const API_ENDPOINT = '/.netlify/functions/analyze';

export async function analitzaAmbIA(enunciat) {
  try {
    const resposta = await fetch(API_ENDPOINT, {
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
