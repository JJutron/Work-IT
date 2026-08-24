export type HomeUser = {
  username: string;
  user_type: string;
};

export type ClaimCta = {
  label: string;
  href: string;
};

export type ClaimStep = {
  id: number;
  key: string;
  label: string;
  href: string;
  hint?: string;
  done: boolean;
  current: boolean;
};

export type ApplicationStatus = {
  label: string;
  token: string;
  color: string;
  raw?: string | null;
};

export type ClaimProgressData = {
  steps: ClaimStep[];
  current_step: number;
  state: string;
  summary: string;
  completed_count: number;
  total_steps: number;
  count_label: string;
  connector_pct: number;
  home_cta: ClaimCta;
  next_action: ClaimCta;
  latest_application: Record<string, unknown> | null;
  application_status: ApplicationStatus | null;
  has_application: boolean;
  has_analysis: boolean;
  has_disability?: boolean;
};

export type HomePayload = {
  user: HomeUser | null;
  claim_progress: ClaimProgressData;
};

export const HOME_CTA: ClaimCta = {
  label: "내 보상금 확인하기",
  href: "/compensation/calculator",
};

export const GUEST_CLAIM_PROGRESS: ClaimProgressData = {
  steps: [
    {
      id: 1,
      key: "calculate",
      label: "계산",
      href: "/compensation/calculator",
      hint: "받을 금액을 확인합니다",
      done: false,
      current: true,
    },
    {
      id: 2,
      key: "disability",
      label: "장해등급 예측",
      href: "/analysis/disability",
      hint: "예상 등급을 봅니다",
      done: false,
      current: false,
    },
    {
      id: 3,
      key: "precedent",
      label: "판례",
      href: "/analysis/precedent",
      hint: "비슷한 판결을 찾습니다",
      done: false,
      current: false,
    },
    {
      id: 4,
      key: "apply",
      label: "신청서",
      href: "/compensation/apply",
      hint: "신청서를 제출합니다",
      done: false,
      current: false,
    },
  ],
  current_step: 1,
  state: "start",
  summary: "받을 금액을 먼저 확인하세요. 그다음 장해등급·판결과 신청입니다.",
  completed_count: 0,
  total_steps: 4,
  count_label: "0/4 완료",
  connector_pct: 0,
  home_cta: HOME_CTA,
  next_action: HOME_CTA,
  latest_application: null,
  application_status: null,
  has_application: false,
  has_analysis: false,
};
