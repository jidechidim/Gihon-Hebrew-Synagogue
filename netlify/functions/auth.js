const querystring = require("querystring");

const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const redirectUri = process.env.AUTH0_REDIRECT_URI;

function authUrl() {
  const qs = querystring.stringify({
    client_id: clientId,
    response_type: "code",
    scope: "openid profile email",
    redirect_uri: redirectUri,
  });
  return `https://${domain}/authorize?${qs}`;
}

module.exports = { authUrl, domain, clientId, clientSecret, redirectUri };
