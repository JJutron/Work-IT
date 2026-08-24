<script setup>
defineProps({
  name: { type: String, required: true },
});
</script>

<template>
  <span class="feature-cap-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <template v-if="name === 'calendar'">
        <rect x="4" y="5" width="16" height="15" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </template>
      <template v-else-if="name === 'shield'">
        <path d="M12 3.5 20 7v6.5c0 4.2-3.4 7.6-8 8.5-4.6-.9-8-4.3-8-8.5V7z" />
        <circle cx="12" cy="12" r="2.5" />
      </template>
      <template v-else-if="name === 'people'">
        <circle cx="9" cy="8" r="2.5" />
        <circle cx="16" cy="9" r="2" />
        <path d="M4 19c.4-3 2.6-5 5-5s4.6 2 5 5" />
        <path d="M14 19c.2-2.2 1.4-3.6 3-3.6 1.4 0 2.5 1 2.8 2.6" />
      </template>
      <template v-else-if="name === 'bars'">
        <path d="M5 19V10M12 19V5M19 19v-7" />
      </template>
      <template v-else-if="name === 'search'">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </template>
      <template v-else-if="name === 'scale'">
        <path d="M12 4v16" />
        <path d="M7 9h5l2-3 3 8H7z" />
        <path d="M12 15h5l-2 3-3-8" />
      </template>
      <template v-else-if="name === 'file'">
        <path d="M7 3.5h7.5L20 9v11.5H7z" />
        <path d="M14.5 3.5V9H20" />
        <path d="M10 13h6M10 17h4" />
      </template>
      <template v-else-if="name === 'dots'">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
        <path d="M7 12h3M14 12h3" />
      </template>
      <template v-else-if="name === 'chat'">
        <path d="M5 6.5h14v9H9l-4 3.5V6.5z" />
      </template>
    </svg>
  </span>
</template>
