export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="푸터">
          <a href="/compensation/calculator" className="nav-link hover:text-ink">보상금 계산기</a>
          <a href="/analysis/precedent" className="nav-link hover:text-ink">판례 분석</a>
          <a href="/auth/login" className="nav-link hover:text-ink">로그인</a>
          <a href="/lawyers/search" className="nav-link hover:text-ink">전문가 상담</a>
        </nav>
        <p className="text-xs text-muted">© 2026 SANZERO. 산업안전보건공단 1644-4544 · 고용노동부 1350</p>
      </div>
    </footer>
  );
}
