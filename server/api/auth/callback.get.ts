export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)

  const clientId = process.env.GITHUB_CLIENT_ID || config.githubClientId
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || config.githubClientSecret

  if (!query.code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing code parameter'
    })
  }

  // Exchange code for token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: query.code
    })
  })

  const tokenData = await tokenResponse.json()

  if (tokenData.error) {
    throw createError({
      statusCode: 400,
      statusMessage: tokenData.error_description || 'OAuth error'
    })
  }

  // Return token to Decap CMS via postMessage
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OAuth Callback</title>
</head>
<body>
  <script>
    (function() {
      function receiveMessage(e) {
        console.log("receiveMessage", e);
        window.opener.postMessage(
          'authorization:github:success:{"token":"${tokenData.access_token}","provider":"github"}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
        window.close();
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>
  `

  setResponseHeader(event, 'Content-Type', 'text/html')
  return html
})
