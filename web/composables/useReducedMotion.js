export function useReducedMotion() {
  const reduce = useState("reduce-motion", () => false);

  onMounted(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduce.value = media.matches;
    const onChange = (event) => {
      reduce.value = event.matches;
    };
    media.addEventListener("change", onChange);
    onBeforeUnmount(() => media.removeEventListener("change", onChange));
  });

  return reduce;
}
