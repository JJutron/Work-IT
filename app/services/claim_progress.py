"""
보상 진행 현황.

실제 버튼 경로: 계산 → 장해등급 예측 → 판례 검색 → 신청서.
장해등급은 장해급여 입력을 채우기 위한 단계다. 분석 내역은 다시 보기이다.
신청 제출 이후 심사는 pending / reviewing / approved / rejected / completed 배지로 표시한다.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

CLAIM_STEPS = (
    {
        "id": 1,
        "key": "calculate",
        "label": "계산",
        "href": "/compensation/calculator",
        "hint": "받을 금액을 확인합니다",
    },
    {
        "id": 2,
        "key": "disability",
        "label": "장해등급 예측",
        "href": "/analysis/disability",
        "hint": "예상 등급을 봅니다",
    },
    {
        "id": 3,
        "key": "precedent",
        "label": "판례",
        "href": "/analysis/precedent",
        "hint": "비슷한 판결을 찾습니다",
    },
    {
        "id": 4,
        "key": "apply",
        "label": "신청서",
        "href": "/compensation/apply",
        "hint": "신청서를 제출합니다",
    },
)

APPLICATION_STATUS_META = {
    "pending": {"label": "심사 대기", "token": "pending", "color": "#9cd5fe"},
    "reviewing": {"label": "심사 중", "token": "review", "color": "#f077af"},
    "approved": {"label": "승인", "token": "approved", "color": "#10B981"},
    "rejected": {"label": "반려", "token": "action", "color": "#F59E0B"},
    "completed": {"label": "지급 완료", "token": "approved", "color": "#10B981"},
}

_NEXT_ACTIONS = {
    "start": {"label": "내 보상금 확인하기", "href": "/compensation/calculator"},
    "predict_grade": {"label": "장해등급 예측하기", "href": "/analysis/disability"},
    "analyze": {"label": "판례 찾아보기", "href": "/analysis/precedent"},
    "ready_to_apply": {"label": "신청서 작성하기", "href": "/compensation/apply"},
    "submitted": {"label": "신청 현황 보기", "href": "/compensation/status"},
}

HOME_CTA = {
    "label": "내 보상금 확인하기",
    "href": "/compensation/calculator",
}

_SUMMARIES = {
    "start": "예상 보상금을 확인한 뒤 장해등급과 판례를 살펴보고 신청서를 작성할 수 있습니다.",
    "predict_grade": "예상 보상금을 계산했습니다. 이제 예상 장해등급을 확인하세요.",
    "analyze": "예상 장해등급을 확인했습니다. 비슷한 사고의 판례를 찾아보세요.",
    "ready_to_apply": "판례를 확인했습니다. 이제 신청서를 작성하세요.",
    "submitted": "신청서가 접수되었습니다. 현재 심사 상태를 확인할 수 있습니다.",
}


def decorate_application(application: Dict[str, Any]) -> Dict[str, Any]:
    """신청서에 한국어 심사 상태 라벨을 붙인다."""
    status = application.get("status") or "pending"
    meta = APPLICATION_STATUS_META.get(status, APPLICATION_STATUS_META["pending"])
    decorated = dict(application)
    decorated["status_label"] = meta["label"]
    decorated["status_token"] = meta["token"]
    decorated["status_color"] = meta["color"]
    return decorated


def derive_claim_progress(
    *,
    has_calculation: bool = False,
    analyses: Optional[List[Dict[str, Any]]] = None,
    applications: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """분석·신청 기록으로 현재 플로우 위치를 계산한다."""
    analyses = analyses or []
    applications = [decorate_application(row) for row in (applications or [])]

    has_disability = any(
        (row.get("analysis_type") or "") == "disability_prediction" for row in analyses
    )
    has_precedent = any(
        (row.get("analysis_type") or "precedent_search") != "disability_prediction"
        for row in analyses
    )
    has_application = bool(applications)

    calculate_done = has_calculation or has_disability or has_precedent or has_application
    disability_done = has_disability or has_precedent or has_application
    precedent_done = has_precedent or has_application
    apply_done = has_application

    dones = (calculate_done, disability_done, precedent_done, apply_done)
    completed_count = sum(1 for done in dones if done)

    if apply_done:
        current_step = 4
        state = "submitted"
    elif precedent_done:
        current_step = 4
        state = "ready_to_apply"
    elif disability_done:
        current_step = 3
        state = "analyze"
    elif calculate_done:
        current_step = 2
        state = "predict_grade"
    else:
        current_step = 1
        state = "start"

    steps = [
        {
            **step,
            "done": dones[index],
            "current": (index + 1) == current_step,
        }
        for index, step in enumerate(CLAIM_STEPS)
    ]

    latest_application = applications[0] if applications else None
    application_status = None
    if latest_application:
        application_status = {
            "label": latest_application["status_label"],
            "token": latest_application["status_token"],
            "color": latest_application["status_color"],
            "raw": latest_application.get("status"),
        }

    summary = _SUMMARIES[state]
    if state == "submitted" and application_status:
        summary = f"신청서가 접수되었습니다. 현재 상태는 {application_status['label']}입니다."
        count_label = application_status["label"]
    else:
        count_label = f"{completed_count}/{len(CLAIM_STEPS)} 완료"

    return {
        "steps": steps,
        "current_step": current_step,
        "state": state,
        "summary": summary,
        "completed_count": completed_count,
        "total_steps": len(CLAIM_STEPS),
        "count_label": count_label,
        "connector_pct": int(round(100 * min(completed_count, 3) / 3)),
        "home_cta": dict(HOME_CTA),
        "next_action": dict(_NEXT_ACTIONS[state]),
        "latest_application": latest_application,
        "application_status": application_status,
        "has_application": has_application,
        "has_analysis": has_precedent,
        "has_disability": has_disability,
    }


async def get_claim_progress_for_user(user_id: Optional[str]) -> Dict[str, Any]:
    """로그인 사용자면 계산 스냅샷·분석·신청 이력을 읽어 진행 현황을 만든다."""
    analyses: List[Dict[str, Any]] = []
    applications: List[Dict[str, Any]] = []
    has_calculation = False
    if user_id:
        try:
            from app.services.analysis_service import analysis_service
            from app.services.compensation_service import CompensationService

            applications = await CompensationService.get_applications_by_user(
                user_id, limit=20
            )
            analyses = await analysis_service.get_user_analysis_history(
                user_id, limit=20
            )
            draft = await CompensationService.get_claim_draft(user_id)
            has_calculation = bool(draft)
        except Exception as exc:
            logger.warning("claim progress lookup failed: %s", exc)
            analyses, applications = [], []
            has_calculation = False

    return derive_claim_progress(
        has_calculation=has_calculation,
        analyses=analyses,
        applications=applications,
    )


def serialize_home_user(current_user: Optional[Dict[str, Any]]) -> Optional[Dict[str, str]]:
    """홈 JSON에 넣을 공개 프로필. 이메일·id는 내리지 않는다."""
    if not current_user:
        return None
    username = current_user.get("username") or ""
    user_type = current_user.get("user_type") or "general"
    return {"username": str(username), "user_type": str(user_type)}


def build_home_payload(
    current_user: Optional[Dict[str, Any]],
    claim_progress: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Next.js `/` SSR이 쓰는 홈 페이로드."""
    progress = claim_progress if claim_progress is not None else derive_claim_progress()
    return {
        "user": serialize_home_user(current_user),
        "claim_progress": progress,
    }
