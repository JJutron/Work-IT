"""Export logged-in feature HTML via TestClient. No session cookies are written."""

from pathlib import Path
from urllib.parse import urlparse

from fastapi.testclient import TestClient

from app.main import app
from app.utils.security import DEMO_USER, get_current_user, require_auth

OUT = Path(__file__).resolve().parents[1] / "app/static/home/frames/html"
BASE = "http://127.0.0.1:8000"


def fake_user():
    return dict(DEMO_USER)


app.dependency_overrides[require_auth] = fake_user
app.dependency_overrides[get_current_user] = fake_user


def dump(client: TestClient, name: str, response) -> None:
    html = response.text
    if "<head>" in html:
        html = html.replace("<head>", f'<head><base href="{BASE}/">', 1)
    path = OUT / f"{name}.html"
    path.write_text(html, encoding="utf-8")
    print("wrote", path.name, response.status_code)


def csrf(client: TestClient) -> str:
    token = client.cookies.get("csrf_token")
    if token:
        return token
    page = client.get("/auth/login")
    return page.cookies.get("csrf_token") or ""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    client = TestClient(app)

    dump(client, "calculate", client.get("/compensation/calculator"))
    dump(client, "disability", client.get("/analysis/disability"))
    dump(client, "precedent", client.get("/analysis/precedent"))
    dump(client, "apply", client.get("/compensation/apply"))
    dump(client, "status", client.get("/compensation/status"))

    token = csrf(client)
    posted = client.post(
        "/analysis/disability",
        data={
            "csrf_token": token,
            "accident_type": "4",
            "gender": "1",
            "age_group": "3",
            "industry_type": "2",
            "body_part": "7",
            "injury_type": "1",
            "treatment_period": "3",
            "장해_내용": "작업 중 프레스 기계에 손가락이 끼여 절단되었습니다.",
        },
        follow_redirects=False,
    )
    location = posted.headers.get("location") or "/analysis/disability/results"
    result = client.get(location)
    parsed = urlparse(location)
    query = parsed.query
    if query and "<head>" in result.text:
        html = result.text.replace(
            "<head>",
            f'<head><base href="{BASE}/"><script>history.replaceState(null,"","/analysis/disability/results?{query}");</script>',
            1,
        )
        path = OUT / "disability-result.html"
        path.write_text(html, encoding="utf-8")
        print("wrote", path.name, result.status_code, query)
    else:
        dump(client, "disability-result", result)


if __name__ == "__main__":
    main()
