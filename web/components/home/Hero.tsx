"use client";

import { motion, useReducedMotion } from "framer-motion";
import SanzeroMark from "@/components/brand/SanzeroMark";
import type { ClaimCta } from "@/lib/types";
import { durationTap } from "@/lib/motion";

export default function Hero({ cta }: { cta: ClaimCta }) {
  const reduce = useReducedMotion();

  return (
    <section className="hero-stage">
      <div className="hero-stage-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hero-banner">
          <div className="hero-lockup">
            <div className="hero-frame text-ink" aria-hidden="true">
              <SanzeroMark variant="frame" />
            </div>
            <div className="hero-copy-panel">
              <h1 className="hero-title text-ink font-extrabold tracking-tight leading-[1.08] mb-4">
                <span className="hero-title-line">혹시,</span>
                <span className="hero-title-line">못 받은 보상금</span>
                <span className="hero-title-line">있으신가요?</span>
              </h1>
              <p className="hero-lead text-muted leading-relaxed mb-6">
                사고 내용과 평균임금을 입력하면
                <br />
                예상 보상금을 확인할 수 있습니다.
              </p>
              <motion.a
                id="home-hero-cta"
                href={cta.href}
                className="hero-cta hero-cta-stamp inline-flex items-center justify-center min-h-12 sm:min-h-14 px-8 sm:px-10 py-3 sm:py-4 bg-ink hover:bg-[#0e0d0c] text-surface font-bold text-base sm:text-lg tracking-tight"
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={{ duration: durationTap, ease: "easeOut" }}
              >
                {cta.label}
              </motion.a>
              <p className="hero-support-note">장해등급을 몰라도 시작할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
