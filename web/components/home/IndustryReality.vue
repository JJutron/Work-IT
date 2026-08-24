<script setup>
const factoryPhoto = "/static/home/industry-worker-factory.jpg";
const warehousePhoto = "/static/home/industry-worker-warehouse.jpg";
const formatEokWon = (value) => {
  const jo = Math.floor(value / 10_000);
  const eok = value % 10_000;
  return `${jo}조 ${eok.toLocaleString("ko-KR")}억 원`;
};
const formatManWon = (value) => `${value.toLocaleString("ko-KR")}만 원`;

const sources = [
  {
    label: "고용노동부, 2024년 산업재해 현황",
    href: "https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20250402181",
  },
  {
    label: "고용노동부, 2024년도 산재보험 사업연보",
    href: "https://www.moel.go.kr/info/publict/publictDataView.do?bbs_seq=20251000326",
  },
];

const sectionRef = ref(null);
const photoY = ref(0);
const reduce = useReducedMotion();

onMounted(() => {
  const onScroll = () => {
    if (reduce.value || !sectionRef.value) {
      photoY.value = 0;
      return;
    }
    const rect = sectionRef.value.getBoundingClientRect();
    const span = window.innerHeight + rect.height;
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span));
    const mapped = Math.min(1, progress / 0.45);
    photoY.value = -28 + mapped * 56;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
});
</script>

<template>
  <section
    id="industry-reality"
    ref="sectionRef"
    class="industry-reality border-y border-border bg-paper"
    aria-labelledby="industry-reality-heading"
  >
    <div class="industry-photo-hero">
      <img
        :src="factoryPhoto"
        alt="안전모를 쓰고 산업 현장에서 작업 중인 근로자"
        class="industry-photo-hero-image industry-motion"
        loading="lazy"
        decoding="async"
        :style="reduce ? undefined : { transform: `translateY(${photoY}px) scale(1.06)` }"
      />
      <div class="industry-photo-hero-scrim" aria-hidden="true" />
      <div class="industry-photo-hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2
            id="industry-reality-heading"
            class="text-3xl md:text-[48px] font-extrabold tracking-tight leading-[1.08]"
          >
            산업재해 보상의 현실,
            <br />
            숫자로 살펴봅니다.
          </h2>
        </Reveal>
        <Reveal :delay="70">
          <p class="text-[17px] leading-relaxed max-w-xl">
            산재로 인정받는 사람은 늘고, 산재보험은 수십만 명의 치료와 생계를 지원하고 있습니다.
            공개된 최신 확정 자료인 2024년 통계를 기준으로 살펴봅니다.
          </p>
        </Reveal>
        <a
          class="industry-photo-credit"
          href="https://www.pexels.com/photo/man-in-apron-working-at-factory-19544210/"
          target="_blank"
          rel="noreferrer"
        >
          사진 Hoang NC · Pexels <span aria-hidden="true">↗</span>
          <span class="sr-only"> (새 창)</span>
        </a>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div class="industry-story">
        <Reveal class="industry-scene">
          <div class="industry-scene-copy">
            <h3>
              2024년 한 해,
              <span class="industry-stat-nowrap">
                <ScrollCount :value="142771" />명이
              </span>
              산재로 인정받았습니다.
            </h3>
            <p>
              전년보다 5,975명, 4.4% 늘어난 수치입니다. 사고 발생일이 아니라
              근로복지공단의 산재보상 승인일을 기준으로 집계했습니다.
            </p>
          </div>

          <figure class="industry-days-figure">
            <div class="industry-days-summary">
              <strong>
                하루 평균 약
                <span class="industry-stat-nowrap">
                  <ScrollCount :value="390" :duration="800" />명
                </span>
              </strong>
              <span>2024년 366일 기준</span>
            </div>
            <ChartInView class="industry-people-chart">
              <p class="industry-people-key">사람 모양 1개 ≈ 10명</p>
              <div class="industry-people-field" aria-hidden="true">
                <span v-for="unit in dailyPeopleUnits" :key="unit" :style="{ '--i': unit - 1 }">
                  <svg viewBox="0 0 20 22" focusable="false">
                    <circle cx="10" cy="5" r="3" />
                    <path d="M4.5 19v-4.5c0-3 2.45-5.5 5.5-5.5s5.5 2.5 5.5 5.5V19" />
                  </svg>
                </span>
              </div>
            </ChartInView>
            <figcaption>
              2024년 재해자 142,771명을 윤년 366일로 나눈 단순 평균입니다.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal class="industry-scene industry-scene-reverse">
          <div class="industry-scene-copy">
            <h3>
              <span class="industry-stat-nowrap">
                <ScrollCount :value="405539" />명이
              </span>
              <br />
              산재보험 급여를 받았습니다.
            </h3>
            <p>
              산재보험은 치료비뿐 아니라 쉬는 동안의 생계비, 장해급여와 유족급여도 지원합니다.
              회복 단계와 상황에 따라 여러 종류의 급여를 받을 수 있습니다.
            </p>
          </div>

          <figure class="industry-ledger">
            <dl>
              <Reveal>
                <dt>산재보험 수급자</dt>
                <dd>
                  <span class="industry-stat-nowrap">
                    <ScrollCount :value="405539" />명
                  </span>
                </dd>
              </Reveal>
              <Reveal :delay="60">
                <dt>연간 보험급여</dt>
                <dd>
                  <ScrollCount :value="76333" :formatter="formatEokWon" />
                </dd>
              </Reveal>
            </dl>
            <ChartInView>
              <div class="industry-payout-compare" aria-label="2023년과 2024년 산재보험 지급액 비교">
                <div>
                  <span>2023</span>
                  <i style="width: 95.4%" aria-hidden="true" />
                  <strong>7조 2,849억</strong>
                </div>
                <div>
                  <span>2024</span>
                  <i style="width: 100%" aria-hidden="true" />
                  <strong>7조 6,333억</strong>
                </div>
              </div>
            </ChartInView>
            <figcaption>2024년도 산재보험 사업연보 기준. 수급자와 지급액 모두 연간 합계입니다.</figcaption>
          </figure>
        </Reveal>

        <Reveal as="figure" class="industry-photo-interlude">
          <img
            :src="warehousePhoto"
            alt="창고에서 안전모를 내려놓고 앉아 쉬는 산업현장 근로자"
            loading="lazy"
            decoding="async"
          />
          <div class="industry-photo-interlude-scrim" aria-hidden="true" />
          <blockquote>
            이 숫자 뒤에는
            <br />
            다시 일상으로 돌아가야 할 사람이 있습니다.
          </blockquote>
        </Reveal>

        <Reveal class="industry-average-scene">
          <div class="industry-average-copy">
            <h3>
              1인당 단순 평균은 약
              <span class="industry-stat-nowrap">
                <ScrollCount :value="1882" :formatter="formatManWon" />
              </span>
              입니다.
              <br />
              내가 받을 보상금은 이 금액과 다릅니다.
            </h3>
            <p>
              전체 보험급여를 수급자 수로 나눈 제도 전체의 단순 평균입니다.
              실제 지급액은 평균임금, 치료기간, 장해등급 등에 따라 달라집니다.
            </p>
          </div>

          <figure class="industry-average-figure">
            <div class="industry-equation" aria-label="총 지급액을 수급자 수로 나눈 단순 평균">
              <Reveal as="span">
                <small>총 지급액</small>
                <strong>
                  <ScrollCount :value="76333" :formatter="formatEokWon" />
                </strong>
              </Reveal>
              <b aria-hidden="true">÷</b>
              <Reveal as="span" :delay="60">
                <small>수급자</small>
                <strong class="industry-stat-nowrap">
                  <ScrollCount :value="405539" />명
                </strong>
              </Reveal>
              <b aria-hidden="true">=</b>
              <Reveal as="span" class="industry-equation-result" :delay="120">
                <small>단순 평균</small>
                <strong>
                  약 <ScrollCount :value="1882" :formatter="formatManWon" />
                </strong>
              </Reveal>
            </div>
            <figcaption>
              개인별 지급액을 예측하는 데 사용할 수 없는 참고 통계입니다.
            </figcaption>
          </figure>

          <div class="industry-factors" aria-label="개인 보상액을 결정하는 주요 조건">
            <Reveal>
              <strong>평균임금</strong>
              <span>사고 전 임금을 기준으로 계산합니다.</span>
            </Reveal>
            <Reveal :delay="60">
              <strong>휴업기간</strong>
              <span>치료로 일하지 못한 기간을 반영합니다.</span>
            </Reveal>
            <Reveal :delay="120">
              <strong>장해등급</strong>
              <span>치료 후 남은 장해 정도를 반영합니다.</span>
            </Reveal>
          </div>

          <p class="industry-bridge">
            평균이 아니라, <strong>내 조건으로 계산한 예상 보상금</strong>부터 확인하세요.
          </p>
        </Reveal>
      </div>

      <footer class="industry-sources">
        <p>집계 기준: 2024년 · 근로복지공단 산재보상 승인일 기준</p>
        <ul>
          <li v-for="source in sources" :key="source.href">
            <a :href="source.href" target="_blank" rel="noreferrer">
              {{ source.label }} <span aria-hidden="true">↗</span>
              <span class="sr-only"> (새 창)</span>
            </a>
          </li>
        </ul>
      </footer>
    </div>
  </section>
</template>
