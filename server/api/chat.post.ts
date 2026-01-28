export default defineEventHandler(async (event) => {
  // Try multiple ways to get the API key (for Netlify compatibility)
  const config = useRuntimeConfig(event)
  
  // Netlify Functions use process.env directly
  const apiKey = process.env.API_AI_KEY 
    || process.env.NUXT_API_AI_KEY 
    || config.apiAiKey

  if (!apiKey) {
    console.error('AI API Key not found in any source')
    throw createError({
      statusCode: 500,
      statusMessage: 'AI service not configured'
    })
  }

  let body
  try {
    body = await readBody(event)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body'
    })
  }
  
  const { messages, articleContext } = body

  if (!messages || !Array.isArray(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Messages array is required'
    })
  }

  // Truncate article content to prevent token overflow
  const maxContentLength = 6000
  const truncatedContent = articleContext?.content 
    ? articleContext.content.substring(0, maxContentLength) 
    : 'Tidak tersedia'

  // Build system prompt with article context
  const systemPrompt = `Kamu adalah AI assistant yang membantu user memahami artikel blog. 
Jawab pertanyaan user berdasarkan konteks artikel berikut dengan bahasa yang mudah dipahami.
Jika pertanyaan tidak berkaitan dengan artikel, tetap jawab dengan ramah tapi ingatkan bahwa kamu fokus membantu memahami artikel ini.

=== KONTEKS ARTIKEL ===
Judul: ${articleContext?.title || 'Tidak tersedia'}
Kategori: ${articleContext?.category || 'Tidak tersedia'}
Bahasa Artikel: ${articleContext?.language || 'Tidak tersedia'}

Isi Artikel:
${truncatedContent}
=== END KONTEKS ===

Instruksi:
- Jawab dengan bahasa yang sama dengan pertanyaan user (Indonesia/English)
- Berikan penjelasan yang jelas dan mudah dipahami
- Gunakan contoh jika diperlukan
- Jika ada kode dalam artikel, jelaskan dengan detail jika ditanya`
  
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10) // Limit conversation history to last 10 messages
  ]

  try {
    const response = await fetch('https://inference.canopywave.io/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'zai/glm-4.7',
        messages: fullMessages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: true
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI API Error:', response.status, errorText)
      throw createError({
        statusCode: response.status,
        statusMessage: `AI API Error: ${errorText}`
      })
    }

    // Set headers for streaming
    setResponseHeaders(event, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for nginx/proxies
    })

    // Return the stream directly
    return sendStream(event, response.body as ReadableStream)
  } catch (error: unknown) {
    const err = error as Error
    console.error('AI Chat Error:', err.message)
    
    // Check if it's already a createError
    if ('statusCode' in err) {
      throw err
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to get AI response'
    })
  }
})
