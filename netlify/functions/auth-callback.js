// netlify/functions/auth-callback.js
exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
  if (!code) {
    return { statusCode: 400, body: "No code provided" };
  }

  // Redirect to auth.js function to exchange code for token
  return {
    statusCode: 302,
    headers: {
      Location: `/.netlify/functions/auth?code=${code}`
    }
  };
};
