<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Content Collection Test</h1>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <p class="mb-2">Found {{ posts?.length || 0 }} blog posts</p>
      
      <div class="mb-6">
        <h2 class="text-xl font-bold mb-2">Blog Post Preview:</h2>
        <div v-if="posts && posts.length" class="border p-4 rounded mb-4">
          <h3 class="font-bold">{{ posts[0].title }}</h3>
          <p class="text-gray-500 mb-2">{{ formatDate(posts[0].date) }}</p>
          <div v-if="posts[0].body && posts[0].body.value">
            <p class="mb-2"><strong>Raw body value:</strong></p>
            <pre class="bg-gray-800 p-2 rounded overflow-auto text-sm mb-4">{{ JSON.stringify(posts[0].body.value, null, 2) }}</pre>
            
            <p class="mb-2"><strong>Content excerpt:</strong></p>
            <p>{{ posts[0].body.value[0][2].substring(0, 150) }}...</p>
          </div>
        </div>
      </div>
      
      <details>
        <summary class="cursor-pointer font-bold mb-2">Show Raw Data</summary>
        <pre class="bg-gray-800 p-2 rounded overflow-auto text-sm">{{ JSON.stringify(posts, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
const { data: posts, pending, error } = await useLazyAsyncData('collection-test', () =>
  queryCollection('blog').all()
)

console.log('Collection test data:', posts)
console.log('Collection test error:', error)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
