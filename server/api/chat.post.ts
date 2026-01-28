// Helper function to convert async iterable to ReadableStream
function readableStreamFromAsyncIterable(iterable: AsyncIterable<string>): ReadableStream<Uint8Array> {
  const iterator = iterable[Symbol.asyncIterator]()
  
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await iterator.next()
        
        if (done) {
          controller.close()
        } else {
          const encoded = new TextEncoder().encode(value)
          controller.enqueue(encoded)
        }
      } catch (error) {
        controller.error(error)
      }
    }
  })
}

export default defineEventHandler(async (event) => {
  // Try multiple ways to get the API key (for Netlify compatibility)
  const config = useRuntimeConfig(event);

  // Netlify Functions use process.env directly
  const apiKey =
    process.env.API_AI_KEY || process.env.NUXT_API_AI_KEY || config.apiAiKey;

  const urlInference = process.env.URL_INFERENCE;
  const modelName = process.env.MODEL_NAME;

  if (!apiKey) {
    console.error("AI API Key not found in any source");
    throw createError({
      statusCode: 500,
      statusMessage: "AI service not configured",
    });
  }

  let body;
  try {
    body = await readBody(event);
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }

  const { messages, articleContext } = body;

  if (!messages || !Array.isArray(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Messages array is required",
    });
  }

  // Truncate article content to prevent token overflow
  const maxContentLength = 6000;
  const truncatedContent = articleContext?.content
    ? articleContext.content.substring(0, maxContentLength)
    : "Tidak tersedia";

  // Build system prompt with article context
  const systemPrompt = `Kamu adalah AI assistant yang membantu user memahami artikel blog. 
Jawab pertanyaan user berdasarkan konteks artikel berikut dengan bahasa yang mudah dipahami.
Jika pertanyaan tidak berkaitan dengan artikel, tetap jawab dengan ramah tapi ingatkan bahwa kamu fokus membantu memahami artikel ini.

=== KONTEKS ARTIKEL ===
Judul: ${articleContext?.title || "Tidak tersedia"}
Kategori: ${articleContext?.category || "Tidak tersedia"}
Bahasa Artikel: ${articleContext?.language || "Tidak tersedia"}

Isi Artikel:
${truncatedContent}
=== END KONTEKS ===

Instruksi:
- Jawab dengan bahasa yang sama dengan pertanyaan user (Indonesia/English)
- Berikan penjelasan yang jelas dan mudah dipahami
- Gunakan contoh jika diperlukan
- Jika ada kode dalam artikel, jelaskan dengan detail jika ditanya`;

  const fullMessages = [
    { role: "system", content: systemPrompt },
    ...messages.slice(-10), // Limit conversation history to last 10 messages
  ];

  try {
     console.log('Starting AI chat request...', { modelName, urlInference });
     
     // Add timeout for provider request (60 seconds)
     const controller = new AbortController();
     const timeoutId = setTimeout(() => {
       controller.abort();
       console.error('AI provider request timeout');
     }, 60000); // 60 seconds timeout

     const response = await fetch(
       urlInference || "https://api.zai.chat/v1/chat/completions",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${apiKey}`,
         },
         signal: controller.signal,
         body: JSON.stringify({
           model: modelName || "gpt-3.5-turbo",
           messages: fullMessages,
           max_tokens: 1000,
           temperature: 0.7,
           stream: true,
           top_p: 0.9,
         }),
       },
     );

     clearTimeout(timeoutId);

     if (!response.ok) {
       const errorText = await response.text();
       console.error("AI API Error:", response.status, errorText);
       throw createError({
         statusCode: response.status,
         statusMessage: `AI API Error: ${errorText}`,
       });
     }
     
     console.log('AI provider response received, starting stream...');

    // Set headers for streaming
    setResponseHeaders(event, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for nginx/proxies
    });

    // Parse and re-stream to ensure proper encoding & formatting
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8', { fatal: false }); // Handle invalid UTF-8 gracefully
    
    if (!reader) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to get response stream"
      });
    }

    let buffer = '';
    let chunkCount = 0;
    
    return sendStream(event, 
      readableStreamFromAsyncIterable(
        (async function* streamEvents() {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                console.log(`Stream ended. Total chunks: ${chunkCount}`);
                break;
              }
              
              chunkCount++;
              // Decode chunk with proper UTF-8 handling
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;
              console.log(`Chunk ${chunkCount}: ${chunk.length} bytes`);
              
              // Process complete lines
              const lines = buffer.split('\n');
              buffer = lines.pop() || ''; // Keep incomplete line in buffer
              
              for (const line of lines) {
                if (line.trim() === '' || !line.startsWith('data: ')) {
                  continue;
                }
                
                const data = line.slice(6).trim();
                
                // Validate before yielding
                if (data === '[DONE]') {
                  yield 'data: [DONE]\n\n';
                  continue;
                }
                
                // Validate JSON structure
                try {
                  JSON.parse(data); // Validate structure
                  yield `data: ${data}\n\n`;
                } catch (e) {
                  console.error('Invalid JSON in stream:', data);
                  // Skip malformed JSON, don't corrupt stream
                  continue;
                }
              }
            }
            
            // Flush remaining buffer if it contains valid data
            if (buffer.trim().startsWith('data: ')) {
              const data = buffer.slice(6).trim();
              try {
                if (data !== '[DONE]') JSON.parse(data);
                yield `data: ${data}\n\n`;
              } catch (e) {
                // Ignore malformed data at end
              }
            }
          } finally {
            // Ensure final marker
            yield 'data: [DONE]\n\n';
          }
        })()
      )
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("AI Chat Error:", err.message);

    // Check if it's already a createError
    if ("statusCode" in err) {
      throw err;
    }

    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to get AI response",
    });
  }
});
