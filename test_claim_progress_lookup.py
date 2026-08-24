"""홈 진행 조회가 계산 스냅샷을 반영하는지."""
import asyncio

import pytest

pytest.importorskip("supabase")
try:
    from app.services.claim_progress import get_claim_progress_for_user
    from app.services.compensation_service import CompensationService
except ImportError as exc:
    pytest.skip(f"app deps missing: {exc}", allow_module_level=True)


async def _empty_apps(*_args, **_kwargs):
    return []


async def _empty_history(*_args, **_kwargs):
    return []


def test_get_claim_progress_uses_saved_calculation(monkeypatch):
    from app.services.analysis_service import analysis_service

    async def saved_draft(_user_id):
        return {"calculation_date": "2026-01-01", "daily_wage": 100000}

    monkeypatch.setattr(CompensationService, "get_applications_by_user", _empty_apps)
    monkeypatch.setattr(CompensationService, "get_claim_draft", saved_draft)
    monkeypatch.setattr(analysis_service, "get_user_analysis_history", _empty_history)

    result = asyncio.run(get_claim_progress_for_user("user-1"))
    assert result["state"] == "predict_grade"
    assert result["current_step"] == 2
    assert result["steps"][0]["done"] is True


def test_get_claim_progress_without_draft_stays_at_start(monkeypatch):
    from app.services.analysis_service import analysis_service

    async def no_draft(_user_id):
        return None

    monkeypatch.setattr(CompensationService, "get_applications_by_user", _empty_apps)
    monkeypatch.setattr(CompensationService, "get_claim_draft", no_draft)
    monkeypatch.setattr(analysis_service, "get_user_analysis_history", _empty_history)

    result = asyncio.run(get_claim_progress_for_user("user-1"))
    assert result["state"] == "start"
    assert result["current_step"] == 1
    assert result["steps"][0]["done"] is False
