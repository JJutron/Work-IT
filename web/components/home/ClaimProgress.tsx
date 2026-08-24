"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { ClaimProgressData, ClaimStep } from "@/lib/types";

function stepHint(progress: ClaimProgressData, step: ClaimStep): { hint: string; stamped: boolean } {
  const isCurrent = step.current;
  if (progress.state === "submitted" && step.id === 4 && progress.application_status) {
    return { hint: progress.application_status.label, stamped: true };
  }
  if (step.done && !isCurrent) return { hint: "완료", stamped: false };
  if (isCurrent) return { hint: "지금 여기", stamped: false };
  return { hint: "대기", stamped: false };
}

function paintDone(card: Element) {
  card.setAttribute("data-done", "true");
  card.setAttribute("data-current", "false");
  card.removeAttribute("aria-current");
  const dot = card.querySelector(".station-dot");
  if (dot) {
    dot.classList.add("is-done");
    dot.classList.remove("is-current");
  }
  const label = card.querySelector(".claim-step-label");
  const hint = card.querySelector(".claim-step-hint");
  if (label) {
    label.classList.remove("text-muted", "text-accent", "font-semibold");
    label.classList.add("font-medium", "text-ink");
  }
  if (hint) {
    hint.className = "claim-step-hint mt-1 block text-xs text-muted";
    hint.textContent = "완료";
  }
}

function paintCurrent(card: Element) {
  card.setAttribute("data-current", "true");
  card.setAttribute("aria-current", "step");
  const dot = card.querySelector(".station-dot");
  if (dot) {
    dot.classList.add("is-current", "is-done");
  }
  const label = card.querySelector(".claim-step-label");
  const hint = card.querySelector(".claim-step-hint");
  if (label) {
    label.classList.remove("text-muted");
    label.classList.add("font-semibold", "text-accent");
  }
  if (hint) {
    hint.className = "claim-step-hint is-now";
    hint.textContent = "지금 여기";
  }
}

export default function ClaimProgress({ progress }: { progress: ClaimProgressData }) {
  const steps = progress.steps;
  const hideContinue = progress.state === "start" || progress.state === "submitted";

  useEffect(() => {
    const root = document.getElementById("home-claim-progress");
    if (!root || root.getAttribute("data-state") === "submitted") return;

    let draft: { q?: string; date?: string; injury?: string; disability_grade?: string } = {};
    try {
      draft = JSON.parse(sessionStorage.getItem("sanzero_claim") || "{}") as typeof draft;
    } catch {
      return;
    }
    const hasCalc = Boolean(draft.q || draft.date || draft.injury);
    const hasGrade = Boolean(draft.disability_grade);
    if (!hasCalc && !hasGrade) return;

    const paintRail = (after: string) => {
      root.querySelectorAll(`[data-rail-after="${after}"]`).forEach((rail) => {
        rail.classList.remove("bg-[#CDD4DC]");
        rail.classList.add("bg-accent");
      });
    };
    const setCopy = (summary: string, count: string, href: string, continueLabel: string, footerLabel: string) => {
      const countEl = document.getElementById("home-claim-progress-count");
      if (countEl) countEl.textContent = count;
      const summaryEl = document.getElementById("home-claim-progress-summary");
      if (summaryEl) summaryEl.textContent = summary;
      const footerCopy = document.getElementById("home-footer-copy");
      if (footerCopy) footerCopy.textContent = summary;
      const wrap = document.getElementById("home-claim-progress-continue-wrap");
      const cont = document.getElementById("home-claim-progress-continue");
      if (wrap) wrap.classList.remove("hidden");
      if (cont) {
        cont.setAttribute("href", href);
        cont.textContent = continueLabel;
      }
      const footer = document.getElementById("home-footer-cta");
      if (footer) {
        footer.setAttribute("href", href);
        footer.textContent = footerLabel;
      }
    };

    if (hasCalc || hasGrade) {
      root.querySelectorAll('[data-step="1"]').forEach(paintDone);
      paintRail("1");
    }
    if (hasGrade) {
      root.querySelectorAll('[data-step="2"]').forEach(paintDone);
      paintRail("2");
    }

    const current = Number(root.getAttribute("data-current") || "1");
    if (hasGrade && current <= 2) {
      root.querySelectorAll('[data-step="3"]').forEach(paintCurrent);
      root.setAttribute("data-current", "3");
      root.setAttribute("data-completed", "2");
      root.style.setProperty("--docket-fill", "66%");
      setCopy(
        "예상 장해등급을 확인했습니다. 비슷한 사고의 판례를 찾아보세요.",
        "2/4 완료",
        "/analysis/precedent",
        "비슷한 판례 찾아보기 →",
        "비슷한 판례 찾아보기",
      );
      return;
    }
    if (hasCalc && current === 1) {
      root.querySelectorAll('[data-step="2"]').forEach(paintCurrent);
      root.setAttribute("data-current", "2");
      root.setAttribute("data-completed", "1");
      root.style.setProperty("--docket-fill", "33%");
      setCopy(
        "예상 보상금을 계산했습니다. 이제 예상 장해등급을 확인하세요.",
        "1/4 완료",
        "/analysis/disability",
        "장해등급 예측하기 →",
        "장해등급 예측하기",
      );
    }
  }, []);

  return (
    <section className="relative z-20 -mt-14 sm:-mt-16 mb-4 sm:mb-6" aria-labelledby="progress-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sz-enter bg-white border border-border px-5 sm:px-8 py-6 sm:py-7">
          <div
            id="home-claim-progress"
            className="claim-progress-board claim-docket"
            data-current={progress.current_step}
            data-state={progress.state}
            data-completed={progress.completed_count}
            style={{ ["--docket-fill"]: `${progress.connector_pct}%` } as CSSProperties}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h2 id="progress-heading" className="text-base font-bold tracking-tight text-ink leading-snug min-w-0">
                내 보상금, 지금 어디까지 왔나요
              </h2>
              <a
                href="/compensation/status"
                className="shrink-0 text-sm text-muted hover:text-ink underline-offset-4 hover:underline whitespace-nowrap pt-0.5"
              >
                신청 현황 →
              </a>
            </div>
            <p className="text-sm text-muted mb-6 leading-relaxed max-w-xl">
              <span id="home-claim-progress-summary">{progress.summary}</span>
              {progress.count_label && progress.state !== "submitted" ? (
                <>
                  <span className="text-[#CDD4DC]" aria-hidden="true">
                    {" "}
                    ·{" "}
                  </span>
                  <span id="home-claim-progress-count" className="font-mono text-xs tabular-nums tracking-wide">
                    {progress.count_label}
                  </span>
                </>
              ) : null}
            </p>

            <div className="claim-docket-track">
            <div className="claim-docket-line" aria-hidden="true">
              <div id="home-claim-progress-fill" className="claim-docket-fill" />
            </div>

            <ol className="claim-docket-stations">
              {steps.map((step, index) => {
                const { hint, stamped } = stepHint(progress, step);
                const isLast = index === steps.length - 1;
                return (
                  <li key={step.id} className={`relative ${isLast ? "" : "pb-5 md:pb-0"}`}>
                    {!isLast ? (
                      <span
                        className={`claim-docket-rail md:hidden absolute left-[4px] top-3 bottom-0 w-px ${
                          step.done ? "bg-accent" : "bg-[#CDD4DC]"
                        }`}
                        data-rail-after={step.id}
                        aria-hidden="true"
                      />
                    ) : null}
                    <a
                      href={step.href}
                      data-step={step.id}
                      data-done={step.done ? "true" : "false"}
                      data-current={step.current ? "true" : "false"}
                      aria-current={step.current ? "step" : undefined}
                      className="claim-step-card group flex md:flex-col items-start md:items-center gap-3 md:gap-0 min-h-11 md:min-h-0 text-left md:text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                    >
                      <span
                        className={`claim-step-marker station-dot mt-0.5 md:mt-0 ${
                          step.current ? "is-current" : step.done ? "is-done" : ""
                        }`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 md:mt-4">
                        <span
                          className={`claim-step-label block text-sm ${
                            step.current
                              ? "font-semibold text-accent"
                              : step.done
                                ? "font-medium text-ink"
                                : "font-medium text-muted"
                          }`}
                        >
                          {step.label}
                          {step.current ? <span className="sr-only"> (현재 단계)</span> : null}
                        </span>
                        {stamped ? (
                          <span className={`claim-step-hint claim-stamp${step.current ? " is-now" : ""}`}>
                            {hint}
                          </span>
                        ) : (
                          <span
                            className={`claim-step-hint mt-1 block text-xs ${
                              step.current ? "is-now" : "text-muted"
                            }`}
                          >
                            {hint}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
            </div>

            <p
              id="home-claim-progress-continue-wrap"
              className={`mt-6 ${hideContinue ? "hidden" : ""}`}
            >
              <a
                id="home-claim-progress-continue"
                href={progress.next_action.href}
                className="chapter-link inline-flex items-center min-h-11 text-sm font-semibold text-accent hover:text-[#1d4ed8] underline-offset-4 hover:underline"
              >
                {progress.next_action.label} <span className="chapter-arrow ml-1" aria-hidden="true">→</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
