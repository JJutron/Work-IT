<script setup>
const props = defineProps({
  value: { type: Number, required: true },
  formatter: { type: Function, default: null },
  duration: { type: Number, default: 1050 },
  digitClass: { type: String, default: "tabular-nums" },
});

const formatNumber = (value) => value.toLocaleString("ko-KR");
const format = computed(() => props.formatter || formatNumber);
const display = ref(format.value(0));
const finalLabel = computed(() => format.value(props.value));
const reduce = useReducedMotion();
const root = ref(null);

function easeOutQuint(t) {
  return 1 - (1 - t) ** 5;
}

onMounted(() => {
  if (reduce.value) {
    display.value = finalLabel.value;
    return;
  }

  let started = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      observer.disconnect();
      const start = performance.now();
      const from = 0;
      const to = props.value;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / props.duration);
        display.value = format.value(Math.round(from + (to - from) * easeOutQuint(t)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    { threshold: 0.35 },
  );
  if (root.value) observer.observe(root.value);
  onBeforeUnmount(() => observer.disconnect());
});
</script>

<template>
  <span class="industry-count">
    <span ref="root" :class="digitClass" aria-hidden="true">{{ display }}</span>
    <span class="industry-count-label">{{ finalLabel }}</span>
  </span>
</template>
