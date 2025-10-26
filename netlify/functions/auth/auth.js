// netlify/functions/auth/auth.js

import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { code } = JSON.parse(event.body);

    // 🔒 Credentials from Netlify environment variables
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    const redirectUri = process.env.AUTH0_REDIRECT_URI;

    // Use URLSearchParams for x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    const response = await fetch(`https://${domain}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error, description: data.error_description }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: data.access_token,
        id_token: data.id_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
      }),
    };
  } catch (error) {
    console.error("Auth0 Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};