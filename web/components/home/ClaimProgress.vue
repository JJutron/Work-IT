<script setup>
const props = defineProps({
  progress: { type: Object, required: true },
});

function stepHint(progress, step) {
  if (progress.state === "submitted" && step.id === 4 && progress.application_status) {
    return { hint: progress.application_status.label, stamped: true };
  }
  if (step.done && !step.current) return { hint: "완료", stamped: false };
  if (step.current) return { hint: "지금 여기", stamped: false };
  return { hint: "대기", stamped: false };
}

const hideContinue = computed(() => {
  const state = props.progress?.state;
  return state === "start" || state === "submitted";
});

const fillStyle = computed(() => ({
  "--docket-fill": `${props.progress?.connector_pct ?? 0}%`,
}));
</script>

<template>
  <section class="relative z-20 -mt-14 sm:-mt-16 mb-4 sm:mb-6" aria-labelledby="progress-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="sz-enter bg-white border border-border px-5 sm:px-8 py-6 sm:py-7">
        <div
          id="home-claim-progress"
          class="claim-progress-board claim-docket"
          :data-current="progress.current_step"
          :data-state="progress.state"
          :data-completed="progress.completed_count"
          :style="fillStyle"
        >
          <div class="flex items-start justify-between gap-3 mb-1">
            <h2 id="progress-heading" class="text-base font-bold tracking-tight text-ink leading-snug min-w-0">
              내 보상금, 지금 어디까지 왔나요
            </h2>
            <a
              href="/compensation/status"
              class="shrink-0 text-sm text-muted hover:text-ink underline-offset-4 hover:underline whitespace-nowrap pt-0.5"
            >
              신청 현황 →
            </a>
          </div>
          <p class="text-sm text-muted mb-6 leading-relaxed max-w-xl">
            <span id="home-claim-progress-summary">{{ progress.summary }}</span>
            <template v-if="progress.count_label && progress.state !== 'submitted'">
              <span class="text-[#CDD4DC]" aria-hidden="true"> · </span>
              <span id="home-claim-progress-count" class="font-mono text-xs tabular-nums tracking-wide">
                {{ progress.count_label }}
              </span>
            </template>
          </p>

          <div class="claim-docket-track">
            <div class="claim-docket-line" aria-hidden="true">
              <div id="home-claim-progress-fill" class="claim-docket-fill" />
            </div>

            <ol class="claim-docket-stations">
              <li
                v-for="(step, index) in progress.steps"
                :key="step.id"
                class="relative"
                :class="{ 'pb-5 md:pb-0': index !== progress.steps.length - 1 }"
              >
                <span
                  v-if="index !== progress.steps.length - 1"
                  class="claim-docket-rail md:hidden absolute left-[4px] top-3 bottom-0 w-px"
                  :class="step.done ? 'bg-accent' : 'bg-[#CDD4DC]'"
                  :data-rail-after="step.id"
                  aria-hidden="true"
                />
                <a
                  :href="step.href"
                  :data-step="step.id"
                  :data-done="step.done ? 'true' : 'false'"
                  :data-current="step.current ? 'true' : 'false'"
                  :aria-current="step.current ? 'step' : undefined"
                  class="claim-step-card group flex md:flex-col items-start md:items-center gap-3 md:gap-0 min-h-11 md:min-h-0 text-left md:text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  <span
                    class="claim-step-marker station-dot mt-0.5 md:mt-0"
                    :class="{ 'is-current': step.current, 'is-done': !step.current && step.done }"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 md:mt-4">
                    <span
                      class="claim-step-label block text-sm"
                      :class="step.current ? 'font-semibold text-accent' : step.done ? 'font-medium text-ink' : 'font-medium text-muted'"
                    >
                      {{ step.label }}
                      <span v-if="step.current" class="sr-only"> (현재 단계)</span>
                    </span>
                    <span
                      v-if="stepHint(progress, step).stamped"
                      class="claim-step-hint claim-stamp"
                      :class="{ 'is-now': step.current }"
                    >
                      {{ stepHint(progress, step).hint }}
                    </span>
                    <span
                      v-else
                      class="claim-step-hint mt-1 block text-xs"
                      :class="step.current ? 'is-now' : 'text-muted'"
                    >
                      {{ stepHint(progress, step).hint }}
                    </span>
                  </span>
                </a>
              </li>
            </ol>
          </div>

          <p
            id="home-claim-progress-continue-wrap"
            class="mt-6"
            :class="{ hidden: hideContinue }"
          >
            <a
              id="home-claim-progress-continue"
              :href="progress.next_action.href"
              class="chapter-link inline-flex items-center min-h-11 text-sm font-semibold text-accent hover:text-[#1d4ed8] underline-offset-4 hover:underline"
            >
              {{ progress.next_action.label }} <span class="chapter-arrow ml-1" aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
