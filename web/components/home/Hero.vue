<script setup>
defineProps({
  cta: { type: Object, required: true },
});
</script>

<template>
  <section class="hero-stage">
    <div class="hero-stage-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="hero-banner">
        <div class="hero-lockup">
          <div class="hero-frame text-ink" aria-hidden="true">
            <SanzeroMark variant="frame" />
          </div>
          <div class="hero-copy-panel">
            <h1 class="hero-title text-ink font-extrabold tracking-tight leading-[1.08] mb-4">
              <span class="hero-title-line">혹시,</span>
              <span class="hero-title-line">못 받은 보상금</span>
              <span class="hero-title-line">있으신가요?</span>
            </h1>
            <p class="hero-lead text-muted leading-relaxed mb-6">
              사고 내용과 평균임금을 입력하면
              <br />
              예상 보상금을 확인할 수 있습니다.
            </p>
            <a
              id="home-hero-cta"
              :href="cta.href"
              class="hero-cta hero-cta-stamp inline-flex items-center justify-center min-h-12 sm:min-h-14 px-8 sm:px-10 py-3 sm:py-4 bg-ink hover:bg-[#0e0d0c] text-surface font-bold text-base sm:text-lg tracking-tight"
            >
              {{ cta.label }}
            </a>
            <p class="hero-support-note">장해등급을 몰라도 시작할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
