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
        : null
    })
  };
};
