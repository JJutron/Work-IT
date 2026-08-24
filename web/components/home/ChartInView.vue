<script setup>
const root = ref(null);
const inView = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      inView.value = true;
      observer.disconnect();
    },
    { threshold: 0.35 },
  );
  if (root.value) observer.observe(root.value);
  onBeforeUnmount(() => observer.disconnect());
});
</script>

<template>
  <div ref="root" :class="{ 'is-inview': inView }">
    <slot />
  </div>
</template>
