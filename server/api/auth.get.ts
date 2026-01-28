export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)

  const clientId = process.env.GITHUB_CLIENT_ID || config.githubClientId
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || config.githubClientSecret

  // Step 1: Redirect to GitHub OAuth
  if (!query.code) {
    const redirectUri = `https://satrio.dev/api/auth/callback`
    const scope = 'repo,user'
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
    
    return sendRedirect(event, authUrl)
  }

  // Step 2: Exchange code for token
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

  // Step 3: Return token to Decap CMS
  const script = `
    <script>
      (function() {
        function receiveMessage(e) {
          console.log("receiveMessage %o", e);
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}',
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  `

  return new Response(script, {
    headers: { 'Content-Type': 'text/html' }
  })
})
