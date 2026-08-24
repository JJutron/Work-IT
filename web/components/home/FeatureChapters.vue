<script setup>
const chapters = [
  {
    id: "calculate",
    badge: "계산",
    title: "예상 보상금부터 계산합니다",
    href: "/compensation/calculator",
    link: "보상금 계산하기",
    reverse: false,
    demo: {
      poster: "/static/home/feature-calculate.jpg",
      webp: "/static/home/feature-calculate.webp",
      gif: "/static/home/feature-calculate.gif",
      alt: "보상금 계산기에서 사고 정보와 평균임금을 입력하는 화면",
    },
    caps: [
      { title: "휴업급여", body: "평균임금의 70%로 예상 휴업급여를 계산합니다.", icon: "calendar" },
      { title: "장해급여", body: "장해등급을 모르면 예측 결과로 계산할 수 있습니다.", icon: "shield" },
      { title: "유족급여", body: "사망 사고라면 예상 유족급여도 함께 계산합니다.", icon: "people" },
    ],
  },
  {
    id: "precedent",
    badge: "분석",
    title: "장해등급을 예측하고, 비슷한 판례를 찾습니다",
    href: "/analysis/disability",
    link: "장해등급 예측하기",
    reverse: true,
    demo: {
      poster: "/static/home/feature-analyze.jpg",
      webp: "/static/home/feature-analyze.webp",
      gif: "/static/home/feature-analyze.gif",
      alt: "유사 판례 검색에 사고 경위를 넣고 판결을 찾는 화면",
    },
    caps: [
      { title: "장해등급", body: "장해 내용을 바탕으로 예상 등급을 확인하고 장해급여 계산에 반영합니다.", icon: "bars" },
      { title: "유사 판례", body: "사고 경위와 장해가 비슷한 판례를 찾습니다.", icon: "search" },
      { title: "유리·불리", body: "판결이 근로자에게 유리했는지 확인합니다.", icon: "scale" },
    ],
  },
  {
    id: "apply",
    badge: "신청",
    title: "신청부터 심사 결과까지 확인합니다",
    href: "/compensation/apply",
    link: "지금 신청서 작성하기",
    reverse: false,
    demo: {
      poster: "/static/home/feature-apply.jpg",
      webp: "/static/home/feature-apply.webp",
      gif: "/static/home/feature-apply.gif",
      alt: "산재 보상 신청서와 진행 현황 화면",
    },
    caps: [
      { title: "신청서", body: "계산한 내용을 바탕으로 신청서를 작성합니다.", icon: "file" },
      { title: "진행 현황", body: "접수, 심사, 승인 상태를 한곳에서 확인합니다.", icon: "dots" },
      { title: "상담", body: "혼자 판단하기 어려운 내용은 전문가에게 상담할 수 있습니다.", icon: "chat" },
    ],
  },
];
</script>

<template>
  <section id="features" class="bg-surface" aria-labelledby="features-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-20 md:pb-28">
      <Reveal class="text-center max-w-2xl mx-auto mb-16 md:mb-24">
        <h2 id="features-heading" class="text-3xl md:text-[40px] font-extrabold tracking-tight text-ink leading-[1.1] mb-4">
          내 조건으로 받을 금액부터 확인하세요.
        </h2>
        <p class="text-muted text-[17px] leading-relaxed">
          보상금을 계산한 뒤 장해등급과 판례를 확인하고, 신청서까지 이어서 작성할 수 있습니다.
        </p>
      </Reveal>

      <div class="flex flex-col gap-20 md:gap-28 lg:gap-32">
        <article
          v-for="chapter in chapters"
          :id="chapter.id"
          :key="chapter.id"
          class="flex flex-col items-center gap-10 lg:gap-16"
          :class="chapter.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'"
          :aria-labelledby="`chapter-${chapter.id}`"
        >
          <Reveal class="w-full lg:w-1/2">
            <div class="feature-stage feature-stage-media">
              <picture>
                <source :srcset="chapter.demo.poster" media="(prefers-reduced-motion: reduce)" />
                <source :srcset="chapter.demo.webp" type="image/webp" />
                <img :src="chapter.demo.gif" :alt="chapter.demo.alt" width="960" height="720" />
              </picture>
            </div>
          </Reveal>

          <div class="w-full lg:w-1/2">
            <Reveal>
              <p class="feature-badge mb-4">{{ chapter.badge }}</p>
              <h3
                :id="`chapter-${chapter.id}`"
                class="text-2xl md:text-[32px] font-extrabold tracking-tight text-ink leading-tight mb-8"
              >
                {{ chapter.title }}
              </h3>
            </Reveal>

            <ul class="space-y-6">
              <li
                v-for="(cap, index) in chapter.caps"
                :key="cap.title"
                class="flex gap-4 items-start text-left"
              >
                <Reveal :delay="index * 60">
                  <div class="flex gap-4 items-start">
                    <CapIcon :name="cap.icon" />
                    <div>
                      <h4 class="font-semibold text-ink text-base mb-1">{{ cap.title }}</h4>
                      <p class="text-sm md:text-[15px] text-muted leading-relaxed">{{ cap.body }}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            </ul>

            <a
              :href="chapter.href"
              class="chapter-link inline-flex items-center min-h-11 mt-8 text-sm font-semibold text-accent hover:text-[#1d4ed8] underline-offset-4 hover:underline"
            >
              {{ chapter.link }} <span class="chapter-arrow ml-1" aria-hidden="true">→</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
