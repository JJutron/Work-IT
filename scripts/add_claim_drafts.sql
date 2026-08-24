-- 로그인 사용자 최신 계산 스냅샷. 홈 진행 현황의 has_calculation 에 쓴다.
-- Supabase SQL Editor에서 실행.

CREATE TABLE IF NOT EXISTS claim_drafts (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE claim_drafts DISABLE ROW LEVEL SECURITY;
