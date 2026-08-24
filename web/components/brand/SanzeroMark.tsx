const SHIELD_PATH =
  "M16 3.5 L27 8.2 V16.8 C27 23.1 22.3 28.2 16 29.5 C9.7 28.2 5 23.1 5 16.8 V8.2 Z";
const S_PATH =
  "M14.2 16.5 C14.2 14.9 15.2 14.2 16.6 14.2 C17.9 14.2 18.8 14.8 18.8 15.8 C18.8 16.7 18.1 17.1 16.8 17.4 L15.4 17.8 C13.8 18.2 12.9 18.9 12.9 20.4 C12.9 22.2 14.4 23.3 16.7 23.3 C18.7 23.3 20.1 22.4 20.6 21";

export default function SanzeroMark({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "frame";
  className?: string;
}) {
  if (variant === "frame") {
    return (
      <svg
        className={className ?? "hero-frame-svg"}
        viewBox="4.1 2.2 23.8 28"
        fill="none"
        aria-hidden="true"
        overflow="visible"
      >
        <path
          className="hero-frame-draw"
          d={SHIELD_PATH}
          stroke="currentColor"
          strokeWidth="0.18"
          strokeLinejoin="miter"
          strokeMiterlimit={12}
        />
        <g transform="translate(16 16.5) scale(0.955) translate(-16 -16.5)">
          <path
            className="hero-frame-draw hero-frame-draw-inner"
            d={SHIELD_PATH}
            stroke="currentColor"
            strokeWidth="0.12"
            opacity="0.42"
            strokeLinejoin="miter"
            strokeMiterlimit={12}
          />
        </g>
      </svg>
    );
  }

  return (
    <svg className={className ?? "w-8 h-8 text-ink shrink-0"} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d={SHIELD_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" strokeMiterlimit={8} />
      <circle cx="16" cy="16.5" r="5.2" stroke="currentColor" strokeWidth="1.5" />
      <path d={S_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
