<template>
  <section class="connect-section">
    <div class="connect-content">
      <h2 class="connect-title">Let's Connect</h2>
      <p class="connect-text">
        Got a project in mind or just want to say hello? Feel free to reach out.
      </p>
      <a href="mailto:mail@satrio.dev" class="connect-email">
        mail@satrio.dev
      </a>
    </div>
  </section>
</template>

<style scoped>
.connect-section {
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
}

.connect-content {
  text-align: center;
}

.connect-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.connect-text {
  font-size: 1rem;
  color: var(--color-text-body);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.connect-email {
  display: inline-block;
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-primary);
  transition: opacity 0.15s ease;
}

.connect-email:hover {
  opacity: 0.8;
}
</style>
