"""Double Submit Cookie CSRF 검증."""
from unittest.mock import Mock

from app.utils.security import SecurityManager


def test_csrf_accepts_matching_cookie_and_form():
    request = Mock()
    request.cookies = {"csrf_token": "same-token"}
    request.headers = {}
    assert SecurityManager.verify_csrf_token(request, "same-token") is True


def test_csrf_rejects_mismatched_form_token():
    request = Mock()
    request.cookies = {"csrf_token": "same-token"}
    request.headers = {}
    assert SecurityManager.verify_csrf_token(request, "other-token") is False


def test_csrf_rejects_missing_cookie():
    request = Mock()
    request.cookies = {}
    request.headers = {}
    assert SecurityManager.verify_csrf_token(request, "same-token") is False


def test_csrf_accepts_matching_header():
    request = Mock()
    request.cookies = {"csrf_token": "same-token"}
    request.headers = {"X-CSRFToken": "same-token"}
    assert SecurityManager.verify_csrf_token(request, None) is True
