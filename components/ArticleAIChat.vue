<template>
  <div class="ai-chat-container">
    <!-- Toggle Button -->
    <div class="chat-toggle-wrapper">
      <!-- Pulse ring animation -->
      <span v-if="!isOpen && !hasInteracted" class="pulse-ring"></span>
      <span v-if="!isOpen && !hasInteracted" class="pulse-ring delay"></span>
      
      <button 
        @click="toggleChat" 
        class="chat-toggle-btn"
        :class="{ 'is-open': isOpen }"
        title="AI Assistant - Tanya tentang artikel ini"
      >
        <Icon :name="isOpen ? 'mdi:close' : 'mdi:robot-happy'" class="w-6 h-6" />
        <span v-if="!isOpen" class="ai-sparkle">✨</span>
      </button>
      
      <!-- Floating label hint -->
      <Transition name="hint-fade">
        <div v-if="!isOpen && showHint && !hasInteracted" class="chat-hint">
          <span>{{ hintText }}</span>
          <button @click="dismissHint" class="hint-close">×</button>
        </div>
      </Transition>
    </div>

    <!-- Chat Panel -->
    <Transition name="chat-slide">
      <div 
        v-if="isOpen" 
        ref="chatPanelRef"
        class="chat-panel"
        :class="{ 'is-maximized': isMaximized, 'is-resizing': isResizing }"
        :style="panelStyle"
      >
        <!-- Resize Handle -->
        <div 
          v-if="!isMaximized"
          class="resize-handle resize-handle-top"
          @mousedown="startResize($event, 'top')"
        ></div>
        <div 
          v-if="!isMaximized"
          class="resize-handle resize-handle-left"
          @mousedown="startResize($event, 'left')"
        ></div>
        <div 
          v-if="!isMaximized"
          class="resize-handle resize-handle-corner"
          @mousedown="startResize($event, 'corner')"
        ></div>

        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-info">
            <Icon name="mdi:robot-happy-outline" class="w-5 h-5 text-primary" />
            <span class="chat-header-title">AI Assistant</span>
          </div>
          <div class="chat-header-actions">
            <button @click="resetSize" class="header-btn" title="Reset size" v-if="!isDefaultSize">
              <Icon name="mdi:arrow-collapse" class="w-4 h-4" />
            </button>
            <button @click="toggleMaximize" class="header-btn" :title="isMaximized ? 'Restore' : 'Maximize'">
              <Icon :name="isMaximized ? 'mdi:window-restore' : 'mdi:window-maximize'" class="w-4 h-4" />
            </button>
            <button @click="clearHistory" class="header-btn" title="Clear chat history">
              <Icon name="mdi:delete-outline" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="chat-messages">
          <!-- Welcome message -->
          <div v-if="messages.length === 0" class="welcome-message">
            <Icon name="mdi:lightbulb-outline" class="w-8 h-8 text-primary mb-2" />
            <p class="welcome-title">{{ welcomeTitle }}</p>
            <p class="welcome-subtitle">{{ welcomeSubtitle }}</p>
            <div class="suggestion-chips">
              <button 
                v-for="suggestion in suggestions" 
                :key="suggestion"
                @click="sendMessage(suggestion)"
                class="suggestion-chip"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Chat messages -->
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            class="message"
            :class="msg.role"
          >
            <div class="message-avatar">
              <Icon 
                :name="msg.role === 'user' ? 'mdi:account' : 'mdi:robot-outline'" 
                class="w-4 h-4" 
              />
            </div>
            <div class="message-content">
              <div class="message-bubble" v-html="formatMessage(msg.content)"></div>
            </div>
          </div>

          <!-- Streaming response -->
          <div v-if="isStreaming" class="message assistant">
            <div class="message-avatar">
              <Icon name="mdi:robot-outline" class="w-4 h-4" />
            </div>
            <div class="message-content">
              <div class="message-bubble" v-html="formatMessage(streamingContent)"></div>
              <span class="typing-indicator">
                <span></span><span></span><span></span>
              </span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input-container">
          <textarea
            ref="inputRef"
            v-model="inputMessage"
            @keydown.enter.exact.prevent="sendMessage()"
            placeholder="Ketik pertanyaan..."
            class="chat-input"
            rows="1"
            :disabled="isStreaming"
          ></textarea>
          <button 
            @click="sendMessage()" 
            class="send-btn"
            :disabled="!inputMessage.trim() || isStreaming"
          >
            <Icon name="mdi:send" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  articleTitle: string
  articleContent: string
  articleCategory?: string
  articleLanguage?: string
  articleSlug: string
}

const props = defineProps<Props>()

const isOpen = ref(false)
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isStreaming = ref(false)
const streamingContent = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const chatPanelRef = ref<HTMLElement | null>(null)

// Hint & interaction state
const showHint = ref(false)
const hasInteracted = ref(false)
const hintStorageKey = 'ai-chat-hint-dismissed'

// Show hint after delay
onMounted(() => {
  // Check if user already dismissed hint
  if (localStorage.getItem(hintStorageKey)) {
    hasInteracted.value = true
  } else {
    setTimeout(() => {
      showHint.value = true
    }, 3000) // Show after 3 seconds
  }
})

function dismissHint() {
  showHint.value = false
  hasInteracted.value = true
  localStorage.setItem(hintStorageKey, 'true')
}

// Localized text based on article language
const isIndonesian = computed(() => props.articleLanguage === 'indonesian')

const hintText = computed(() => 
  isIndonesian.value ? 'Ada pertanyaan? Tanya AI!' : 'Have questions? Ask AI!'
)

const welcomeTitle = computed(() => 
  isIndonesian.value ? 'Ada yang kurang jelas?' : 'Need clarification?'
)

const welcomeSubtitle = computed(() => 
  isIndonesian.value 
    ? 'Tanya saya tentang artikel ini, saya akan bantu jelaskan!' 
    : 'Ask me about this article, I\'ll help explain!'
)

// Resize state
const DEFAULT_WIDTH = 380
const DEFAULT_HEIGHT = 500
const MIN_WIDTH = 300
const MIN_HEIGHT = 350
const MAX_WIDTH = 800
const MAX_HEIGHT = 800

const panelWidth = ref(DEFAULT_WIDTH)
const panelHeight = ref(DEFAULT_HEIGHT)
const isMaximized = ref(false)
const isResizing = ref(false)
const resizeType = ref<'top' | 'left' | 'corner' | null>(null)
const resizeStartX = ref(0)
const resizeStartY = ref(0)
const resizeStartWidth = ref(0)
const resizeStartHeight = ref(0)

const isDefaultSize = computed(() => 
  panelWidth.value === DEFAULT_WIDTH && panelHeight.value === DEFAULT_HEIGHT
)

const panelStyle = computed(() => {
  if (isMaximized.value) return {}
  return {
    width: `${panelWidth.value}px`,
    height: `${panelHeight.value}px`
  }
})

function startResize(e: MouseEvent, type: 'top' | 'left' | 'corner') {
  e.preventDefault()
  isResizing.value = true
  resizeType.value = type
  resizeStartX.value = e.clientX
  resizeStartY.value = e.clientY
  resizeStartWidth.value = panelWidth.value
  resizeStartHeight.value = panelHeight.value
  
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e: MouseEvent) {
  if (!isResizing.value) return
  
  const deltaX = resizeStartX.value - e.clientX
  const deltaY = resizeStartY.value - e.clientY
  
  if (resizeType.value === 'left' || resizeType.value === 'corner') {
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, resizeStartWidth.value + deltaX))
    panelWidth.value = newWidth
  }
  
  if (resizeType.value === 'top' || resizeType.value === 'corner') {
    const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, resizeStartHeight.value + deltaY))
    panelHeight.value = newHeight
  }
}

function stopResize() {
  isResizing.value = false
  resizeType.value = null
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

function toggleMaximize() {
  isMaximized.value = !isMaximized.value
}

function resetSize() {
  panelWidth.value = DEFAULT_WIDTH
  panelHeight.value = DEFAULT_HEIGHT
  isMaximized.value = false
}

// Storage key based on article slug
const storageKey = computed(() => `ai-chat-${props.articleSlug}`)

// Suggested questions
const suggestions = computed(() => {
  if (props.articleLanguage === 'indonesian') {
    return [
      'Jelaskan poin utama artikel ini',
      'Apa kesimpulan dari artikel?',
      'Berikan contoh praktis'
    ]
  }
  return [
    'Explain the main points',
    'What is the conclusion?',
    'Give me practical examples'
  ]
})

// Load chat history from localStorage
onMounted(() => {
  const saved = localStorage.getItem(storageKey.value)
  if (saved) {
    try {
      messages.value = JSON.parse(saved)
    } catch {
      messages.value = []
    }
  }
})

// Save chat history to localStorage
watch(messages, (newMessages) => {
  localStorage.setItem(storageKey.value, JSON.stringify(newMessages))
}, { deep: true })

// Auto scroll to bottom
watch([messages, streamingContent], () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasInteracted.value = true
    showHint.value = false
    nextTick(() => inputRef.value?.focus())
  }
}

function clearHistory() {
  messages.value = []
  localStorage.removeItem(storageKey.value)
}

function formatMessage(content: string): string {
  if (!content) return ''
  
  // Simple markdown-like formatting
  return content
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Line breaks
    .replace(/\n/g, '<br>')
}

async function sendMessage(text?: string) {
  const message = text || inputMessage.value.trim()
  if (!message || isStreaming.value) return

  // Add user message
  messages.value.push({ role: 'user', content: message })
  inputMessage.value = ''
  
  // Start streaming
  isStreaming.value = true
  streamingContent.value = ''

  try {
    // Truncate article content to prevent request size issues
    const truncatedContent = props.articleContent?.substring(0, 6000) || ''
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value.slice(-10).map(m => ({ role: m.role, content: m.content })),
        articleContext: {
          title: props.articleTitle,
          content: truncatedContent,
          category: props.articleCategory,
          language: props.articleLanguage
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Chat API error:', response.status, errorText)
      
      // Parse error message for better user feedback
      let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi.'
      if (response.status === 500) {
        if (errorText.includes('not configured')) {
          errorMessage = 'AI service belum dikonfigurasi. Hubungi admin.'
        } else {
          errorMessage = 'Server sedang bermasalah. Silakan coba beberapa saat lagi.'
        }
      } else if (response.status === 429) {
        errorMessage = 'Terlalu banyak request. Silakan tunggu sebentar.'
      }
      
      throw new Error(errorMessage)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) throw new Error('No reader available')

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
         const trimmedLine = line.trim()
         if (!trimmedLine || !trimmedLine.startsWith('data: ')) {
           continue
         }
         
         const data = trimmedLine.slice(6).trim()
         if (data === '[DONE]') {
           continue
         }
         
         try {
           const parsed = JSON.parse(data)
           const content = parsed.choices?.[0]?.delta?.content
           if (content && typeof content === 'string') {
             streamingContent.value += content
           }
         } catch (error) {
           // Log for debugging but don't break stream
           console.debug('Failed to parse stream chunk:', data, error)
         }
       }
    }

    // Add assistant message
    if (streamingContent.value) {
      messages.value.push({ role: 'assistant', content: streamingContent.value })
    } else {
      // No content received - might be a streaming issue
      messages.value.push({ 
        role: 'assistant', 
        content: 'Maaf, tidak ada respons dari AI. Silakan coba lagi.' 
      })
    }
  } catch (error) {
    console.error('Chat error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Maaf, terjadi kesalahan. Silakan coba lagi.'
    messages.value.push({ 
      role: 'assistant', 
      content: errorMessage 
    })
  } finally {
    isStreaming.value = false
    streamingContent.value = ''
  }
}
</script>

<style scoped>
.ai-chat-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
}

/* Toggle Wrapper */
.chat-toggle-wrapper {
  position: relative;
}

/* Pulse Ring Animation */
.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  animation: pulse-ring 2s ease-out infinite;
}

.pulse-ring.delay {
  animation-delay: 1s;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 0;
  }
}

/* Floating Hint */
.chat-hint {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-card);
  box-shadow: 0 4px 20px rgba(56, 189, 248, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: var(--color-text-heading);
  animation: hint-bounce 2s ease-in-out infinite;
}

.chat-hint::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-primary);
  border-bottom: 1px solid var(--color-primary);
  transform: rotate(45deg);
}

.hint-close {
  margin-left: 0.25rem;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.hint-close:hover {
  color: var(--color-text-heading);
}

@keyframes hint-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: all 0.3s ease;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Toggle Button */
.chat-toggle-btn {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(56, 189, 248, 0.4);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(56, 189, 248, 0.5);
}

.chat-toggle-btn.is-open {
  background: var(--color-surface-elevated);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Sparkle Emoji */
.ai-sparkle {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 14px;
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(15deg);
    opacity: 0.8;
  }
}

/* Chat Panel */
.chat-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 2rem);
  height: 500px;
  max-height: calc(100vh - 150px);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  transition: width 0.15s ease, height 0.15s ease;
}

.chat-panel.is-resizing {
  transition: none;
  user-select: none;
}

.chat-panel.is-maximized {
  position: fixed;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  width: auto !important;
  height: auto !important;
  max-width: none;
  max-height: none;
  border-radius: var(--radius-card);
}

/* Resize Handles */
.resize-handle {
  position: absolute;
  z-index: 10;
}

.resize-handle-top {
  top: 0;
  left: 20px;
  right: 20px;
  height: 6px;
  cursor: ns-resize;
}

.resize-handle-left {
  left: 0;
  top: 20px;
  bottom: 20px;
  width: 6px;
  cursor: ew-resize;
}

.resize-handle-corner {
  top: 0;
  left: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
}

.resize-handle:hover {
  background: rgba(56, 189, 248, 0.2);
}

.resize-handle-corner:hover {
  border-radius: var(--radius-card) 0 0 0;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--color-surface-elevated);
  border-bottom: 1px solid var(--color-border);
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chat-header-title {
  font-weight: 600;
  color: var(--color-text-heading);
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.header-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--color-text-muted);
  transition: all 0.2s;
}

.header-btn:hover {
  background: var(--color-surface);
  color: var(--color-text-body);
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Welcome */
.welcome-message {
  text-align: center;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-title {
  font-weight: 600;
  color: var(--color-text-heading);
  margin-bottom: 0.25rem;
}

.welcome-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.suggestion-chip {
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  color: var(--color-text-body);
  transition: all 0.2s;
  cursor: pointer;
}

.suggestion-chip:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-background);
}

/* Message */
.message {
  display: flex;
  gap: 0.75rem;
  max-width: 90%;
}

.message.user {
  flex-direction: row-reverse;
  align-self: flex-end;
}

.message.assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.message.user .message-avatar {
  background: var(--color-primary);
  color: var(--color-background);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  word-break: break-word;
}

.message.user .message-bubble {
  background: var(--color-primary);
  color: var(--color-background);
  border-bottom-right-radius: 0.25rem;
}

.message.assistant .message-bubble {
  background: var(--color-surface-elevated);
  color: var(--color-text-body);
  border-bottom-left-radius: 0.25rem;
}

.message-bubble :deep(code) {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: ui-monospace, monospace;
}

.message-bubble :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.message-bubble :deep(pre code) {
  background: none;
  padding: 0;
}

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--color-text-muted);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* Input */
.chat-input-container {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  color: var(--color-text-body);
  font-size: 0.9375rem;
  resize: none;
  max-height: 120px;
  font-family: inherit;
}

.chat-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.chat-input::placeholder {
  color: var(--color-text-muted);
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animation */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s ease;
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Mobile */
@media (max-width: 640px) {
  .ai-chat-container {
    bottom: 1rem;
    right: 1rem;
  }

  .chat-toggle-btn {
    width: 50px;
    height: 50px;
  }

  .chat-panel {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100% !important;
    max-width: 100%;
    height: calc(100vh - 60px) !important;
    max-height: none;
    border-radius: var(--radius-card) var(--radius-card) 0 0;
  }

  .chat-panel.is-maximized {
    top: 0;
    border-radius: 0;
  }

  /* Hide resize handles on mobile */
  .resize-handle {
    display: none;
  }
}
</style>
