export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      redirectUri: process.env.AUTH0_REDIRECT_URI
    })
  };
}