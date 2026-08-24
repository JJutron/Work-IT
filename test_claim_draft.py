"""계산 스냅샷 저장·조회."""
import asyncio

import pytest

pytest.importorskip("supabase")
try:
    from app.services.compensation_service import CompensationService
except ImportError as exc:
    pytest.skip(f"app deps missing: {exc}", allow_module_level=True)


class _Result:
    def __init__(self, data):
        self.data = data


class _Query:
    def __init__(self, store):
        self.store = store
        self._user_id = None
        self._row = None

    def upsert(self, row, on_conflict="user_id"):
        self.store[row["user_id"]] = row
        self._row = row
        return self

    def select(self, *_cols):
        return self

    def eq(self, _key, value):
        self._user_id = value
        return self

    def limit(self, _n):
        return self

    def execute(self):
        if self._row is not None:
            return _Result([self._row])
        row = self.store.get(self._user_id)
        return _Result([row] if row else [])


class _FakeSupabase:
    def __init__(self):
        self.store = {}

    def table(self, _name):
        return _Query(self.store)


def test_save_claim_draft_skips_empty_user():
    assert asyncio.run(CompensationService.save_claim_draft("", {"daily_wage": 1})) is False


def test_get_claim_draft_skips_empty_user():
    assert asyncio.run(CompensationService.get_claim_draft("")) is None


def test_save_and_get_claim_draft_roundtrip(monkeypatch):
    fake = _FakeSupabase()
    monkeypatch.setattr("app.services.compensation_service.supabase", fake)

    payload = {"calculation_date": "2026-01-01", "daily_wage": 120000}
    assert asyncio.run(CompensationService.save_claim_draft("user-1", payload)) is True
    loaded = asyncio.run(CompensationService.get_claim_draft("user-1"))
    assert loaded["daily_wage"] == 120000
    assert loaded["calculation_date"] == "2026-01-01"
