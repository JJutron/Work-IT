import type { Metadata } from "next";
import type { ReactNode } from "react";
import MotionProvider from "@/components/motion/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SANZERO - 정당한 보상, 처음부터",
  description: "AI 기반 산업재해 보상 서비스. 예상 보상금부터 확인하고 분석·신청까지 이어갑니다.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          본문으로 건너뛰기
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
