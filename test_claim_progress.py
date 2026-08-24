"""보상 진행 현황은 계산 → 장해등급 → 판례 → 신청서 순이다.

장해등급 예측은 장해급여 입력을 채우기 위한 필수 정거장이다.
분석 내역(/analysis/history)은 다시 보기이지 단계가 아니다.
"""
from app.services.claim_progress import derive_claim_progress

HOME_CTA = {
    "label": "내 보상금 확인하기",
    "href": "/compensation/calculator",
}


def test_guest_starts_at_calculator():
    progress = derive_claim_progress()
    assert [step["label"] for step in progress["steps"]] == [
        "계산",
        "장해등급 예측",
        "판례",
        "신청서",
    ]
    assert [step["href"] for step in progress["steps"]] == [
        "/compensation/calculator",
        "/analysis/disability",
        "/analysis/precedent",
        "/compensation/apply",
    ]
    assert [step["done"] for step in progress["steps"]] == [False, False, False, False]
    assert progress["current_step"] == 1
    assert progress["completed_count"] == 0
    assert progress["count_label"] == "0/4 완료"
    assert progress["home_cta"] == HOME_CTA
    assert progress["next_action"] == HOME_CTA
    assert progress["steps"][0]["current"] is True


def test_calculation_only_moves_to_disability():
    progress = derive_claim_progress(has_calculation=True)
    assert progress["steps"][0]["done"] is True
    assert progress["steps"][1]["current"] is True
    assert progress["current_step"] == 2
    assert progress["count_label"] == "1/4 완료"
    assert progress["next_action"]["href"] == "/analysis/disability"
    assert progress["next_action"]["label"] == "장해등급 예측하기"


def test_disability_prediction_moves_to_precedent():
    progress = derive_claim_progress(
        analyses=[{"id": "d", "status": "completed", "analysis_type": "disability_prediction"}]
    )
    assert progress["steps"][0]["done"] is True
    assert progress["steps"][1]["done"] is True
    assert progress["steps"][2]["done"] is False
    assert progress["current_step"] == 3
    assert progress["next_action"]["href"] == "/analysis/precedent"
    assert progress["next_action"]["label"] == "판례 찾아보기"


def test_precedent_search_ready_to_apply():
    progress = derive_claim_progress(
        analyses=[{"id": "a", "status": "completed", "analysis_type": "precedent_search"}]
    )
    assert [step["done"] for step in progress["steps"]] == [True, True, True, False]
    assert progress["current_step"] == 4
    assert progress["next_action"]["href"] == "/compensation/apply"
    assert progress["next_action"]["label"] == "신청서 작성하기"


def test_application_completes_flow_and_shows_review_status():
    progress = derive_claim_progress(
        applications=[{"id": "1", "status": "pending", "injury_type": "골절"}]
    )
    assert all(step["done"] for step in progress["steps"])
    assert progress["current_step"] == 4
    assert progress["has_application"] is True
    assert progress["application_status"]["label"] == "심사 대기"
    assert progress["next_action"]["href"] == "/compensation/status"
    assert progress["next_action"]["label"] == "신청 현황 보기"
    assert progress["home_cta"] == HOME_CTA
    assert progress["completed_count"] == 4
    assert progress["count_label"] == "심사 대기"
    assert "심사 대기" in progress["summary"]


def test_reviewing_and_approved_status_labels():
    reviewing = derive_claim_progress(applications=[{"status": "reviewing"}])
    approved = derive_claim_progress(applications=[{"status": "approved"}])
    completed = derive_claim_progress(applications=[{"status": "completed"}])
    rejected = derive_claim_progress(applications=[{"status": "rejected"}])
    assert reviewing["application_status"]["label"] == "심사 중"
    assert approved["application_status"]["label"] == "승인"
    assert completed["application_status"]["label"] == "지급 완료"
    assert rejected["application_status"]["label"] == "반려"


def test_disability_sets_has_disability_not_precedent():
    progress = derive_claim_progress(
        analyses=[{"id": "d", "analysis_type": "disability_prediction"}]
    )
    assert progress["has_disability"] is True
    assert progress["has_analysis"] is False
    assert progress["state"] == "analyze"


def test_precedent_without_disability_still_skips_grade_step():
    """장해가 없으면 판례로 건너뛸 수 있다. 앞 단계는 완료로 본다."""
    progress = derive_claim_progress(
        analyses=[{"id": "a", "analysis_type": "precedent_search"}]
    )
    assert progress["has_disability"] is False
    assert progress["has_analysis"] is True
    assert [step["done"] for step in progress["steps"]] == [True, True, True, False]


def test_home_cta_always_starts_calculator():
    cases = [
        {},
        {"has_calculation": True},
        {"analyses": [{"id": "a", "status": "completed", "analysis_type": "precedent_search"}]},
        {"applications": [{"status": "pending"}]},
    ]
    for kwargs in cases:
        progress = derive_claim_progress(**kwargs)
        assert progress["home_cta"] == HOME_CTA


def test_progress_summary_and_current_flags():
    start = derive_claim_progress()
    assert "예상 보상금" in start["summary"]

    after_calc = derive_claim_progress(has_calculation=True)
    assert after_calc["completed_count"] == 1
    assert "장해" in after_calc["summary"]

    after_grade = derive_claim_progress(
        analyses=[{"id": "d", "analysis_type": "disability_prediction"}]
    )
    assert after_grade["completed_count"] == 2
    assert "판례" in after_grade["summary"]


def test_decorate_application_adds_korean_status():
    from app.services.claim_progress import decorate_application

    row = decorate_application({"status": "reviewing", "injury_type": "염좌"})
    assert row["status_label"] == "심사 중"
    assert row["status_token"] == "review"
    assert row["injury_type"] == "염좌"


def test_home_payload_guest_has_null_user_and_calculator_cta():
    from app.services.claim_progress import build_home_payload

    payload = build_home_payload(None)
    assert payload["user"] is None
    assert payload["claim_progress"]["home_cta"] == HOME_CTA
    assert payload["claim_progress"]["current_step"] == 1


def test_home_payload_user_exposes_username_and_type_only():
    from app.services.claim_progress import build_home_payload

    payload = build_home_payload(
        {"username": "kuka", "user_type": "admin", "email": "secret@example.com", "user_id": "abc"}
    )
    assert payload["user"] == {"username": "kuka", "user_type": "admin"}
    assert "email" not in payload["user"]
    assert "user_id" not in payload["user"]


def test_home_payload_keeps_home_cta_after_submit():
    from app.services.claim_progress import build_home_payload, derive_claim_progress

    progress = derive_claim_progress(applications=[{"status": "pending"}])
    payload = build_home_payload({"username": "worker", "user_type": "general"}, progress)
    assert payload["claim_progress"]["home_cta"] == HOME_CTA
    assert payload["claim_progress"]["has_application"] is True


def test_api_home_guest_json():
    import pytest

    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient
    from app.main import app

    response = TestClient(app).get("/api/home")
    assert response.status_code == 200
    body = response.json()
    assert body["user"] is None
    assert body["claim_progress"]["home_cta"] == HOME_CTA
    assert [step["label"] for step in body["claim_progress"]["steps"]] == [
        "계산",
        "장해등급 예측",
        "판례",
        "신청서",
    ]
