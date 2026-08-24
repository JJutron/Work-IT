"use client";

import {
  animate as animateValue,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, type HTMLAttributes } from "react";
import Reveal from "@/components/motion/Reveal";
import { durationEnter, easeOutQuint } from "@/lib/motion";

const dailyPeopleUnits = Array.from({ length: 39 }, (_, index) => index + 1);
const formatNumber = (value: number) => value.toLocaleString("ko-KR");
const formatEokWon = (value: number) => {
  const jo = Math.floor(value / 10_000);
  const eok = value % 10_000;
  return `${jo}조 ${eok.toLocaleString("ko-KR")}억 원`;
};
const formatManWon = (value: number) => `${value.toLocaleString("ko-KR")}만 원`;

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

function ChartInView({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div
      ref={ref}
      className={`${className ?? ""} ${inView ? "is-inview" : ""}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

function ScrollCount({
  value,
  formatter = formatNumber,
  className,
  duration = 1.05,
}: {
  value: number;
  formatter?: (value: number) => string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const count = useMotionValue(reduce ? value : 0);
  const display = useTransform(count, (latest) => formatter(Math.round(latest)));

  useEffect(() => {
    if (reduce) {
      count.set(value);
      return;
    }
    if (!inView) return;
    count.set(0);
    const controls = animateValue(count, value, {
      duration,
      ease: easeOutQuint,
    });
    return () => controls.stop();
  }, [count, duration, inView, reduce, value]);

  const finalLabel = formatter(value);

  return (
    <span className="industry-count">
      <motion.span ref={ref} className={className} aria-hidden="true">
        {display}
      </motion.span>
      <span className="industry-count-label">{finalLabel}</span>
    </span>
  );
}

export default function IndustryReality() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 0.45], [-28, 28]);
  const enterTransition = { duration: reduce ? 0 : durationEnter, ease: easeOutQuint };

  return (
    <section
      ref={sectionRef}
      id="industry-reality"
      className="industry-reality border-y border-border bg-paper"
      aria-labelledby="industry-reality-heading"
    >
      <div className="industry-photo-hero">
        <motion.img
          src="/static/home/industry-worker-factory.jpg"
          alt="안전모를 쓰고 산업 현장에서 작업 중인 근로자"
          className="industry-photo-hero-image industry-motion"
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { y: photoY, scale: 1.06 }}
        />
        <div className="industry-photo-hero-scrim" aria-hidden="true" />
        <div className="industry-photo-hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="industry-motion"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={enterTransition}
          >
            <h2
              id="industry-reality-heading"
              className="text-3xl md:text-[48px] font-extrabold tracking-tight leading-[1.08]"
            >
              산업재해 보상의 현실,
              <br />
              숫자로 살펴봅니다.
            </h2>
          </motion.div>
          <motion.div
            className="industry-motion"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ ...enterTransition, delay: reduce ? 0 : 0.07 }}
          >
            <p className="text-[17px] leading-relaxed max-w-xl">
              산재로 인정받는 사람은 늘고, 산재보험은 수십만 명의 치료와 생계를 지원하고 있습니다.
              공개된 최신 확정 자료인 2024년 통계를 기준으로 살펴봅니다.
            </p>
          </motion.div>
          <a
            className="industry-photo-credit"
            href="https://www.pexels.com/photo/man-in-apron-working-at-factory-19544210/"
            target="_blank"
            rel="noreferrer"
          >
            사진 Hoang NC · Pexels <span aria-hidden="true">↗</span>
            <span className="sr-only"> (새 창)</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="industry-story">
          <Reveal className="industry-scene">
            <div className="industry-scene-copy">
              <h3>
                2024년 한 해,{" "}
                <span className="industry-stat-nowrap">
                  <ScrollCount value={142_771} className="tabular-nums" />명이
                </span>{" "}
                산재로 인정받았습니다.
              </h3>
              <p>
                전년보다 5,975명, 4.4% 늘어난 수치입니다. 사고 발생일이 아니라
                근로복지공단의 산재보상 승인일을 기준으로 집계했습니다.
              </p>
            </div>

            <figure className="industry-days-figure">
              <div className="industry-days-summary">
                <strong>
                  하루 평균 약{" "}
                  <span className="industry-stat-nowrap">
                    <ScrollCount value={390} className="tabular-nums" duration={0.8} />명
                  </span>
                </strong>
                <span>2024년 366일 기준</span>
              </div>
              <ChartInView className="industry-people-chart">
                <p className="industry-people-key">사람 모양 1개 ≈ 10명</p>
                <div className="industry-people-field" aria-hidden="true">
                  {dailyPeopleUnits.map((unit) => (
                    <span key={unit} style={{ ["--i" as string]: unit - 1 }}>
                      <svg viewBox="0 0 20 22" focusable="false">
                        <circle cx="10" cy="5" r="3" />
                        <path d="M4.5 19v-4.5c0-3 2.45-5.5 5.5-5.5s5.5 2.5 5.5 5.5V19" />
                      </svg>
                    </span>
                  ))}
                </div>
              </ChartInView>
              <figcaption>
                2024년 재해자 142,771명을 윤년 366일로 나눈 단순 평균입니다.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="industry-scene industry-scene-reverse">
            <div className="industry-scene-copy">
              <h3>
                <span className="industry-stat-nowrap">
                  <ScrollCount value={405_539} className="tabular-nums" />명이
                </span>
                <br />
                산재보험 급여를 받았습니다.
              </h3>
              <p>
                산재보험은 치료비뿐 아니라 쉬는 동안의 생계비, 장해급여와 유족급여도 지원합니다.
                회복 단계와 상황에 따라 여러 종류의 급여를 받을 수 있습니다.
              </p>
            </div>

            <figure className="industry-ledger">
              <dl>
                <motion.div
                  className="industry-motion"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={enterTransition}
                >
                  <dt>산재보험 수급자</dt>
                  <dd>
                    <span className="industry-stat-nowrap">
                      <ScrollCount value={405_539} className="tabular-nums" />명
                    </span>
                  </dd>
                </motion.div>
                <motion.div
                  className="industry-motion"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ ...enterTransition, delay: reduce ? 0 : 0.06 }}
                >
                  <dt>연간 보험급여</dt>
                  <dd>
                    <ScrollCount value={76_333} formatter={formatEokWon} className="tabular-nums" />
                  </dd>
                </motion.div>
              </dl>
              <ChartInView
                className="industry-payout-compare"
                aria-label="2023년과 2024년 산재보험 지급액 비교"
              >
                <div>
                  <span>2023</span>
                  <i style={{ width: "95.4%" }} aria-hidden="true" />
                  <strong>7조 2,849억</strong>
                </div>
                <div>
                  <span>2024</span>
                  <i style={{ width: "100%" }} aria-hidden="true" />
                  <strong>7조 6,333억</strong>
                </div>
              </ChartInView>
              <figcaption>2024년도 산재보험 사업연보 기준. 수급자와 지급액 모두 연간 합계입니다.</figcaption>
            </figure>
          </Reveal>

          <motion.figure
            className="industry-photo-interlude industry-motion"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={enterTransition}
          >
            <motion.img
              src="/static/home/industry-worker-warehouse.jpg"
              alt="창고에서 안전모를 내려놓고 앉아 쉬는 산업현장 근로자"
              loading="lazy"
              decoding="async"
              initial={reduce ? false : { scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: reduce ? 0 : 0.7, ease: easeOutQuint }}
            />
            <div className="industry-photo-interlude-scrim" aria-hidden="true" />
            <blockquote>
              이 숫자 뒤에는
              <br />
              다시 일상으로 돌아가야 할 사람이 있습니다.
            </blockquote>
          </motion.figure>

          <Reveal className="industry-average-scene">
            <div className="industry-average-copy">
              <h3>
                1인당 단순 평균은 약{" "}
                <span className="industry-stat-nowrap">
                  <ScrollCount value={1_882} formatter={formatManWon} className="tabular-nums" />
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

            <figure className="industry-average-figure">
              <div className="industry-equation" aria-label="총 지급액을 수급자 수로 나눈 단순 평균">
                <motion.span
                  className="industry-motion"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.75 }}
                  transition={enterTransition}
                >
                  <small>총 지급액</small>
                  <strong>
                    <ScrollCount value={76_333} formatter={formatEokWon} className="tabular-nums" />
                  </strong>
                </motion.span>
                <b aria-hidden="true">÷</b>
                <motion.span
                  className="industry-motion"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.75 }}
                  transition={{ ...enterTransition, delay: reduce ? 0 : 0.06 }}
                >
                  <small>수급자</small>
                  <strong className="industry-stat-nowrap">
                    <ScrollCount value={405_539} className="tabular-nums" />명
                  </strong>
                </motion.span>
                <b aria-hidden="true">=</b>
                <motion.span
                  className="industry-equation-result industry-motion"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.75 }}
                  transition={{ ...enterTransition, delay: reduce ? 0 : 0.12 }}
                >
                  <small>단순 평균</small>
                  <strong>
                    약 <ScrollCount value={1_882} formatter={formatManWon} className="tabular-nums" />
                  </strong>
                </motion.span>
              </div>
              <figcaption>
                개인별 지급액을 예측하는 데 사용할 수 없는 참고 통계입니다.
              </figcaption>
            </figure>

            <div className="industry-factors" aria-label="개인 보상액을 결정하는 주요 조건">
              <motion.div
                className="industry-motion"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={enterTransition}
              >
                <strong>평균임금</strong>
                <span>사고 전 임금을 기준으로 계산합니다.</span>
              </motion.div>
              <motion.div
                className="industry-motion"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ ...enterTransition, delay: reduce ? 0 : 0.06 }}
              >
                <strong>휴업기간</strong>
                <span>치료로 일하지 못한 기간을 반영합니다.</span>
              </motion.div>
              <motion.div
                className="industry-motion"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ ...enterTransition, delay: reduce ? 0 : 0.12 }}
              >
                <strong>장해등급</strong>
                <span>치료 후 남은 장해 정도를 반영합니다.</span>
              </motion.div>
            </div>

            <p className="industry-bridge">
              평균이 아니라, <strong>내 조건으로 계산한 예상 보상금</strong>부터 확인하세요.
            </p>
          </Reveal>
        </div>

        <footer className="industry-sources">
          <p>집계 기준: 2024년 · 근로복지공단 산재보상 승인일 기준</p>
          <ul>
            {sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer">
                  {source.label} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (새 창)</span>
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </section>
  );
}
