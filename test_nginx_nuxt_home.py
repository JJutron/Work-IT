from pathlib import Path
import json


ROOT = Path(__file__).resolve().parent


def test_nginx_sends_home_and_assets_to_nuxt():
    conf = (ROOT / "nginx.conf").read_text(encoding="utf-8")
    assert "location /_nuxt/" in conf
    assert "location /_next/" not in conf
    assert "upstream sanzero_nuxt" in conf
    assert "server nuxt:3000" in conf
    assert "proxy_pass http://sanzero_nuxt;" in conf


def test_compose_runs_nuxt_not_next():
    compose = (ROOT / "docker-compose.yml").read_text(encoding="utf-8")
    assert "\n  nuxt:\n" in compose
    assert "container_name: sanzero-nuxt" in compose
    assert "container_name: sanzero-next" not in compose
    assert "FASTAPI_INTERNAL_URL: http://web:8000" in compose


def test_web_package_is_nuxt():
    pkg = json.loads((ROOT / "web" / "package.json").read_text(encoding="utf-8"))
    assert "nuxt" in pkg["dependencies"]
    assert "next" not in pkg.get("dependencies", {})
    assert "next" not in pkg.get("devDependencies", {})


def test_nginx_sends_home_and_assets_to_nuxt():
    conf = (ROOT / "nginx.conf").read_text(encoding="utf-8")
    assert "location /_nuxt/" in conf
    assert "location /_next/" not in conf
    assert "upstream sanzero_nuxt" in conf
    assert "server nuxt:3000" in conf
    assert "proxy_pass http://sanzero_nuxt;" in conf


def test_compose_runs_nuxt_not_next():
    compose = (ROOT / "docker-compose.yml").read_text(encoding="utf-8")
    assert "\n  nuxt:\n" in compose
    assert "container_name: sanzero-nuxt" in compose
    assert "container_name: sanzero-next" not in compose
    assert "FASTAPI_INTERNAL_URL: http://web:8000" in compose
