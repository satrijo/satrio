export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.apiAiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API_AI_KEY not configured'
    })
  }

  const body = await readBody(event)
  const { messages, articleContext } = body

  if (!messages || !Array.isArray(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Messages array is required'
    })
  }

  // Build system prompt with article context
  const systemPrompt = `Kamu adalah AI assistant yang membantu user memahami artikel blog. 
Jawab pertanyaan user berdasarkan konteks artikel berikut dengan bahasa yang mudah dipahami.
Jika pertanyaan tidak berkaitan dengan artikel, tetap jawab dengan ramah tapi ingatkan bahwa kamu fokus membantu memahami artikel ini.

=== KONTEKS ARTIKEL ===
Judul: ${articleContext?.title || 'Tidak tersedia'}
Kategori: ${articleContext?.category || 'Tidak tersedia'}
Bahasa Artikel: ${articleContext?.language || 'Tidak tersedia'}

Isi Artikel:
${articleContext?.content || 'Tidak tersedia'}
=== END KONTEKS ===

Instruksi:
- Jawab dengan bahasa yang sama dengan pertanyaan user (Indonesia/English)
- Berikan penjelasan yang jelas dan mudah dipahami
- Gunakan contoh jika diperlukan
- Jika ada kode dalam artikel, jelaskan dengan detail jika ditanya`

  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ]

  // Set headers for streaming
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

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
      throw createError({
        statusCode: response.status,
        statusMessage: `AI API Error: ${errorText}`
      })
    }

    // Return the stream directly
    return sendStream(event, response.body as ReadableStream)
  } catch (error: unknown) {
    const err = error as Error
    console.error('AI Chat Error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to get AI response'
    })
  }
})
