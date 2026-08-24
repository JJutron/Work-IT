<script setup>
const props = defineProps({
  delay: { type: Number, default: 0 },
  as: { type: String, default: "div" },
});

const root = ref(null);
const shown = ref(false);
const reduce = useReducedMotion();

onMounted(() => {
  if (reduce.value) {
    shown.value = true;
    return;
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      shown.value = true;
      observer.disconnect();
    },
    { threshold: 0.18 },
  );
  if (root.value) observer.observe(root.value);
  onBeforeUnmount(() => observer.disconnect());
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="reveal-motion"
    :class="{ 'is-revealed': shown || reduce }"
    :style="{ transitionDelay: reduce ? '0ms' : `${delay}ms` }"
  >
    <slot />
  </component>
</template>
