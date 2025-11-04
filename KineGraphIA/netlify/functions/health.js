exports.handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      ok: true,
      hasKey: !!process.env.GEMINI_API_KEY,
      keySample: process.env.GEMINI_API_KEY
        ? process.env.GEMINI_API_KEY.slice(0, 6) + '...'
        : null,
      apiVersion: process.env.GEMINI_API_VERSION || 'v1',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
    })
  };
};
