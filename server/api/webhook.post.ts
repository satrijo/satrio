import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('GITHUB_WEBHOOK_SECRET not configured')
    throw createError({
      statusCode: 500,
      statusMessage: 'Webhook not configured'
    })
  }

  // Verify GitHub signature
  const signature = getHeader(event, 'x-hub-signature-256')
  const body = await readRawBody(event)

  if (!signature || !body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing signature or body'
    })
  }

  const hmac = crypto.createHmac('sha256', webhookSecret)
  const digest = 'sha256=' + hmac.update(body).digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid signature'
    })
  }

  // Parse payload
  const payload = JSON.parse(body)
  const eventType = getHeader(event, 'x-github-event')

  console.log(`GitHub webhook received: ${eventType}`)

  // Only handle push events to main branch
  if (eventType === 'push' && payload.ref === 'refs/heads/main') {
    // Check if content files changed
    const contentChanged = payload.commits?.some((commit: any) => {
      const files = [...(commit.added || []), ...(commit.modified || []), ...(commit.removed || [])]
      return files.some((file: string) => file.startsWith('content/'))
    })

    if (contentChanged) {
      console.log('Content changed, triggering rebuild...')
      
      // Write trigger file for external rebuild script
      // The rebuild script watches this file
      try {
        const fs = await import('fs').then(m => m.promises)
        await fs.writeFile('/tmp/rebuild-trigger', Date.now().toString())
        console.log('Rebuild trigger written')
      } catch (err) {
        console.error('Failed to write trigger:', err)
      }

      return { status: 'rebuild_triggered', contentChanged: true }
    }

    return { status: 'no_content_changes', contentChanged: false }
  }

  return { status: 'ignored', eventType }
})
