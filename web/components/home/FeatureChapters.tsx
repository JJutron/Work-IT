"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { durationEnter, easeOutQuint, fadeUp, fadeUpShort } from "@/lib/motion";

type Capability = {
  title: string;
  body: string;
  icon: ReactNode;
};

type Chapter = {
  id: string;
  badge: string;
  title: string;
  href: string;
  link: string;
  reverse: boolean;
  demo: {
    poster: string;
    webp: string;
    gif: string;
    alt: string;
  };
  caps: Capability[];
};

function CapIcon({ children }: { children: ReactNode }) {
  return (
    <span className="feature-cap-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

const chapters: Chapter[] = [
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
      {
        title: "휴업급여",
        body: "평균임금의 70%로 예상 휴업급여를 계산합니다.",
        icon: (
          <>
            <rect x="4" y="5" width="16" height="15" />
            <path d="M8 3v4M16 3v4M4 10h16" />
          </>
        ),
      },
      {
        title: "장해급여",
        body: "장해등급을 모르면 예측 결과로 계산할 수 있습니다.",
        icon: (
          <>
            <path d="M12 3.5 20 7v6.5c0 4.2-3.4 7.6-8 8.5-4.6-.9-8-4.3-8-8.5V7z" />
            <circle cx="12" cy="12" r="2.5" />
          </>
        ),
      },
      {
        title: "유족급여",
        body: "사망 사고라면 예상 유족급여도 함께 계산합니다.",
        icon: (
          <>
            <circle cx="9" cy="8" r="2.5" />
            <circle cx="16" cy="9" r="2" />
            <path d="M4 19c.4-3 2.6-5 5-5s4.6 2 5 5" />
            <path d="M14 19c.2-2.2 1.4-3.6 3-3.6 1.4 0 2.5 1 2.8 2.6" />
          </>
        ),
      },
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
      {
        title: "장해등급",
        body: "장해 내용을 바탕으로 예상 등급을 확인하고 장해급여 계산에 반영합니다.",
        icon: (
          <>
            <path d="M5 19V10M12 19V5M19 19v-7" />
          </>
        ),
      },
      {
        title: "유사 판례",
        body: "사고 경위와 장해가 비슷한 판례를 찾습니다.",
        icon: (
          <>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </>
        ),
      },
      {
        title: "유리·불리",
        body: "판결이 근로자에게 유리했는지 확인합니다.",
        icon: (
          <>
            <path d="M12 4v16" />
            <path d="M7 9h5l2-3 3 8H7z" />
            <path d="M12 15h5l-2 3-3-8" />
          </>
        ),
      },
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
      {
        title: "신청서",
        body: "계산한 내용을 바탕으로 신청서를 작성합니다.",
        icon: (
          <>
            <path d="M7 3.5h7.5L20 9v11.5H7z" />
            <path d="M14.5 3.5V9H20" />
            <path d="M10 13h6M10 17h4" />
          </>
        ),
      },
      {
        title: "진행 현황",
        body: "접수, 심사, 승인 상태를 한곳에서 확인합니다.",
        icon: (
          <>
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <path d="M7 12h3M14 12h3" />
          </>
        ),
      },
      {
        title: "상담",
        body: "혼자 판단하기 어려운 내용은 전문가에게 상담할 수 있습니다.",
        icon: (
          <>
            <path d="M5 6.5h14v9H9l-4 3.5V6.5z" />
          </>
        ),
      },
    ],
  },
];

function FeatureDemo({
  poster,
  webp,
  gif,
  alt,
}: {
  poster: string;
  webp: string;
  gif: string;
  alt: string;
}) {
  return (
    <div className="feature-stage feature-stage-media">
      <picture>
        <source srcSet={poster} media="(prefers-reduced-motion: reduce)" />
        <source srcSet={webp} type="image/webp" />
        <img src={gif} alt={alt} width={960} height={720} />
      </picture>
    </div>
  );
}

export default function FeatureChapters() {
  const reduce = useReducedMotion();

  return (
    <section id="features" className="bg-surface" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-20 md:pb-28">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16 md:mb-24"
          initial={reduce ? false : fadeUp.hidden}
          whileInView={fadeUp.visible}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0 : durationEnter, ease: easeOutQuint }}
        >
          <h2 id="features-heading" className="text-3xl md:text-[40px] font-extrabold tracking-tight text-ink leading-[1.1] mb-4">
            내 조건으로 받을 금액부터 확인하세요.
          </h2>
          <p className="text-muted text-[17px] leading-relaxed">
            보상금을 계산한 뒤 장해등급과 판례를 확인하고, 신청서까지 이어서 작성할 수 있습니다.
          </p>
        </motion.div>

        <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
          {chapters.map((chapter) => (
            <article
              key={chapter.id}
              id={chapter.id}
              className={`flex flex-col items-center gap-10 lg:gap-16 ${chapter.reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              aria-labelledby={`chapter-${chapter.id}`}
            >
              <motion.div
                className="w-full lg:w-1/2"
                initial={reduce ? false : fadeUp.hidden}
                whileInView={fadeUp.visible}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduce ? 0 : durationEnter, ease: easeOutQuint }}
              >
                <FeatureDemo {...chapter.demo} />
              </motion.div>

              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={reduce ? false : fadeUp.hidden}
                  whileInView={fadeUp.visible}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: reduce ? 0 : durationEnter, ease: easeOutQuint }}
                >
                  <p className="feature-badge mb-4">{chapter.badge}</p>
                  <h3
                    id={`chapter-${chapter.id}`}
                    className="text-2xl md:text-[32px] font-extrabold tracking-tight text-ink leading-tight mb-8"
                  >
                    {chapter.title}
                  </h3>
                </motion.div>

                <motion.ul
                  className="space-y-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
                  }}
                >
                  {chapter.caps.map((cap) => (
                    <motion.li
                      key={cap.title}
                      className="flex gap-4 items-start text-left"
                      variants={reduce ? undefined : fadeUpShort}
                      transition={{ duration: durationEnter, ease: easeOutQuint }}
                    >
                      <CapIcon>{cap.icon}</CapIcon>
                      <div>
                        <h4 className="font-semibold text-ink text-base mb-1">{cap.title}</h4>
                        <p className="text-sm md:text-[15px] text-muted leading-relaxed">{cap.body}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>

                <a
                  href={chapter.href}
                  className="chapter-link inline-flex items-center min-h-11 mt-8 text-sm font-semibold text-accent hover:text-[#1d4ed8] underline-offset-4 hover:underline"
                >
                  {chapter.link} <span className="chapter-arrow ml-1" aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
