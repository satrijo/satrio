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
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}

.table-wrapper table {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  table-layout: auto;
}

.table-wrapper :deep(thead) {
  background-color: var(--color-surface);
}

.table-wrapper :deep(th) {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-heading);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.table-wrapper :deep(td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-body);
}

.table-wrapper :deep(tr:last-child td) {
  border-bottom: none;
}

.table-wrapper :deep(tr:hover) {
  background-color: var(--color-surface);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .table-wrapper {
    margin: 1.5rem 0;
  }
  
  .table-wrapper table {
    font-size: 0.8125rem;
  }
  
  .table-wrapper :deep(th),
  .table-wrapper :deep(td) {
    padding: 0.5rem 0.75rem;
  }
}
</style>
