"""로그인 폼 CSRF: 쿠키와 폼 값이 같아야 한다."""
import pytest

pytest.importorskip("fastapi")
try:
    from fastapi.testclient import TestClient
    from app.main import app
except ImportError as exc:
    pytest.skip(f"app deps missing: {exc}", allow_module_level=True)


def test_login_page_sets_matching_csrf_cookie_and_field():
    client = TestClient(app)
    response = client.get("/auth/login")
    assert response.status_code == 200
    cookie = response.cookies.get("csrf_token")
    assert cookie
    assert f'name="csrf_token" value="{cookie}"' in response.text


def test_login_rejects_mismatched_csrf():
    client = TestClient(app)
    page = client.get("/auth/login")
    cookie = page.cookies.get("csrf_token")
    assert cookie
    response = client.post(
        "/auth/login/form",
        data={
            "email": "workit.user@ajou.ac.kr",
            "password": "wrong-password",
            "csrf_token": "not-the-cookie",
        },
    )
    assert response.status_code == 200
    assert "보안 토큰이 유효하지 않습니다." in response.text
    assert response.cookies.get("access_token") is None


def test_login_rejects_missing_csrf_field():
    client = TestClient(app)
    client.get("/auth/login")
    response = client.post(
        "/auth/login/form",
        data={"email": "workit.user@ajou.ac.kr", "password": "wrong-password"},
    )
    assert response.status_code == 422


def test_login_matching_csrf_is_not_security_error():
    client = TestClient(app)
    page = client.get("/auth/login")
    cookie = page.cookies.get("csrf_token")
    assert cookie
    response = client.post(
        "/auth/login/form",
        data={
            "email": "nobody@example.invalid",
            "password": "not-a-real-password-1!",
            "csrf_token": cookie,
        },
    )
    assert "보안 토큰이 유효하지 않습니다." not in response.text
    assert response.status_code in (200, 302, 401)
