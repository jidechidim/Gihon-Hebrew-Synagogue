// netlify/functions/auth-login.js
export async function handler(event, context) {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = process.env.AUTH0_REDIRECT_URI;

  const url = `https://${domain}/authorize?` +
    `response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email`;

  return {
    statusCode: 302,
    headers: { Location: url },
  };
}