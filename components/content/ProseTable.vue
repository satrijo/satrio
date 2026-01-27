<template>
  <div class="table-wrapper">
    <table>
      <slot />
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 2rem 0;
}

.table-wrapper table {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  margin: 0;
}
</style>
