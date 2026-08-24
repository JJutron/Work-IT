"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import SanzeroMark from "@/components/brand/SanzeroMark";
import type { HomeUser } from "@/lib/types";
import { durationExit, easeOutQuint } from "@/lib/motion";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export default function Header({ user }: { user: HomeUser | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    function onDocClick(event: Event) {
      const dropdown = document.getElementById("user-dropdown");
      const button = document.getElementById("user-menu-button");
      const target = event.target as Node;
      if (dropdown && button && !button.contains(target) && !dropdown.contains(target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function handleLogout(event: ReactMouseEvent) {
    event.preventDefault();
    if (!confirm("정말 로그아웃 하시겠습니까?")) return;
    setMenuOpen(false);
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrf_token"),
        },
      });
      if (response.ok) {
        window.location.href = "/auth/login";
      } else {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    } catch {
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  }

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16">
          <a href="/" className="flex items-center space-x-3 shrink-0 z-10 min-w-0">
            <SanzeroMark variant="icon" />
            <span className="flex flex-col justify-center min-w-0">
              <span className="text-lg font-bold tracking-tight text-ink leading-none">SANZERO</span>
              <span className="mt-1 text-[11px] text-muted tracking-tight leading-none whitespace-nowrap">산업재해 보상 서비스</span>
            </span>
          </a>

          <nav className="hidden md:flex absolute inset-x-0 justify-center items-center space-x-8" aria-label="주요 메뉴">
            <a href="/compensation/calculator" className="nav-link text-sm font-medium text-muted hover:text-ink">보상금 계산기</a>
            <a href="/compensation/status" className="nav-link text-sm font-medium text-muted hover:text-ink">보상 진행 현황</a>
            <a href="/analysis/precedent" className="nav-link text-sm font-medium text-muted hover:text-ink">판례 분석</a>
          </nav>

          <div className="flex items-center space-x-3 ml-auto shrink-0 z-10">
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-button"
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
                >
                  <div className="w-8 h-8 bg-ink text-surface rounded-full flex items-center justify-center">
                    <span className="font-medium text-xs">{(user.username[0] || "?").toUpperCase()}</span>
                  </div>
                  <span className="hidden md:block text-ink font-medium">{user.username}</span>
                  <svg
                    className="w-4 h-4 text-muted"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    style={{
                      transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: reduce ? "none" : "transform 200ms var(--ease-out-quint, cubic-bezier(0.23, 1, 0.32, 1))",
                    }}
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <AnimatePresence>
                  {menuOpen ? (
                    <motion.div
                      id="user-dropdown"
                      className="absolute right-0 mt-2 w-48 bg-surface rounded-lg border border-border py-1 z-50"
                      initial={reduce ? false : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
                      transition={{ duration: reduce ? 0 : durationExit, ease: easeOutQuint }}
                    >
                      <a href="/auth/profile" className="block px-4 py-2 text-sm text-ink hover:bg-surface">프로필 관리</a>
                      <hr className="my-1 border-border" />
                      <button type="button" onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-ink hover:bg-surface">
                        로그아웃
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <motion.a
                href="/auth/login"
                className="bg-ink text-surface px-5 py-2 rounded-none text-sm font-medium hover:opacity-90"
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                로그인
              </motion.a>
            )}

            <button
              type="button"
              className="md:hidden p-2 text-muted hover:text-ink rounded-md"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="메뉴 열기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.nav
              id="mobile-menu"
              className="md:hidden border-t border-border py-3 space-y-1"
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : durationExit, ease: easeOutQuint }}
            >
              <a href="/compensation/calculator" className="block px-2 py-2 text-sm text-ink">보상금 계산기</a>
              <a href="/compensation/status" className="block px-2 py-2 text-sm text-ink">보상 진행 현황</a>
              <a href="/analysis/precedent" className="block px-2 py-2 text-sm text-ink">판례 분석</a>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
