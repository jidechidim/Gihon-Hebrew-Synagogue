const { authUrl } = require("./auth");

exports.handler = async function(event, context) {
  return {
    statusCode: 302,
    headers: {
      Location: authUrl(), // Redirect to Auth0 login
      "Cache-Control": "no-cache",
    },
  };
};
