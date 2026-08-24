import type { ClaimCta } from "@/lib/types";

export default function HomeCtaBar({
  summary,
  next,
}: {
  summary: string;
  next: ClaimCta;
}) {
  return (
    <section className="border-t border-[#CDD4DC] bg-[#F3F1EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p id="home-footer-copy" className="text-sm md:text-[15px] text-ink">
          {summary}
        </p>
        <a
          id="home-footer-cta"
          href={next.href}
          className="home-cta-btn inline-flex items-center justify-center min-h-11 px-5 py-2.5 bg-ink hover:bg-[#0e0d0c] text-surface font-semibold text-sm shrink-0"
        >
          {next.label}
        </a>
      </div>
    </section>
  );
}
