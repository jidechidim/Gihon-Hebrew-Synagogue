const fetch = require("node-fetch");
const { clientId, clientSecret, redirectUri, domain } = require("./auth");

exports.handler = async function(event, context) {
  const code = event.queryStringParameters.code;

  if (!code) {
    return {
      statusCode: 400,
      body: "Missing code parameter from Auth0",
    };
  }

  // Exchange code for tokens
  const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await tokenResponse.json();

  if (data.error) {
    return { statusCode: 400, body: JSON.stringify(data) };
  }

  // Normally you’d set a cookie here
  return {
    statusCode: 200,
    body: `Login successful! Access token: ${data.access_token}`,
  };
};
