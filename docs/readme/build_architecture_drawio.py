#!/usr/bin/env python3
"""Build README architecture .drawio with brand logos from drawio-skill."""

from __future__ import annotations

import base64
import json
import subprocess
import sys
import urllib.request
import xml.sax.saxutils as sax
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent
LOGO_DIR = OUT_DIR / "logos"
SKILL_AIICONS = Path.home() / ".cursor/skills/drawio-skill/skills/drawio-skill/scripts/aiicons.py"
STYLE = (
    "shape=image;html=1;verticalLabelPosition=bottom;verticalAlign=top;"
    "imageAspect=0;aspect=fixed;fontSize=12;fontColor=#191817;fontStyle=0;image="
)
SIMPLE = {
    "nginx": ("nginx", "#009639"),
    "nuxt": ("nuxtdotjs", "#00DC82"),
    "vue": ("vuedotjs", "#4FC08D"),
    "fastapi": ("fastapi", "#009688"),
    "python": ("python", "#3776AB"),
    "docker": ("docker", "#2496ED"),
    "tensorflow": ("tensorflow", "#FF6F00"),
    "chrome": ("googlechrome", "#4285F4"),
    "htmx": ("htmx", "#3366CC"),
    "tailwind": ("tailwindcss", "#06B6D4"),
    "supabase": ("supabase", "#3FCF8E"),
    "postgresql": ("postgresql", "#4169E1"),
}


def tint_svg(svg: bytes, color: str) -> bytes:
    svg = svg.replace(b'width="1em"', b'width="24"').replace(b'height="1em"', b'height="24"')
    for old in (b'fill="#000"', b'fill="#000000"', b'fill="currentColor"', b"fill='#000'"):
        svg = svg.replace(old, f'fill="{color}"'.encode())
    if b"fill=" not in svg:
        svg = svg.replace(b"<path ", f'<path fill="{color}" '.encode(), 1)
    return svg


def fetch_simple_svg(slug: str, color: str) -> bytes:
    urls = (
        f"https://cdn.jsdelivr.net/npm/simple-icons/icons/{slug}.svg",
        f"https://cdn.simpleicons.org/{slug}",
    )
    req_headers = {"User-Agent": "sanzero-drawio-build/1.0"}
    last_error = None
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=req_headers)
            return tint_svg(urllib.request.urlopen(req, timeout=20).read(), color)
        except Exception as exc:  # noqa: BLE001
            last_error = exc
    raise RuntimeError(f"could not fetch icon {slug}: {last_error}")


def data_uri(svg: bytes) -> str:
    return "data:image/svg+xml," + base64.b64encode(svg).decode()


def from_aiicons(query: str) -> str:
    proc = subprocess.run(
        [sys.executable, str(SKILL_AIICONS), query, "--embed", "--json", "--size", "56"],
        capture_output=True,
        text=True,
        check=True,
    )
    rows = json.loads(proc.stdout)
    style = rows[0]["style"]
    return style.split("image=", 1)[1]


def save_data_uri(name: str, uri: str) -> None:
    if not uri.startswith("data:"):
        return
    payload = uri.split(",", 1)[1]
    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    (LOGO_DIR / f"{name}.svg").write_bytes(base64.b64decode(payload))


def esc(value: str) -> str:
    return sax.escape(value, {"\"": "&quot;"})


def cell(cid: str, value: str, style: str, x: int, y: int, w: int, h: int, parent: str = "1") -> str:
    return (
        f'        <mxCell id="{esc(cid)}" value="{esc(value)}" '
        f'style="{esc(style)}" vertex="1" parent="{esc(parent)}">\n'
        f'          <mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" />\n'
        f"        </mxCell>\n"
    )


def edge(eid: str, source: str, target: str, label: str = "", extra: str = "", points: list[tuple[int, int]] | None = None) -> str:
    style = (
        "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;"
        "endArrow=block;endSize=8;strokeColor=#191817;fontSize=11;fontColor=#6e6a64;"
        "labelBackgroundColor=#FDFDFD;"
        + extra
    )
    if points:
        pts = "".join(f'<mxPoint x="{x}" y="{y}" />' for x, y in points)
        geo = f'<mxGeometry relative="1" as="geometry"><Array as="points">{pts}</Array></mxGeometry>'
    else:
        geo = '<mxGeometry relative="1" as="geometry" />'
    return (
        f'        <mxCell id="{esc(eid)}" value="{esc(label)}" style="{esc(style)}" '
        f'edge="1" parent="1" source="{esc(source)}" target="{esc(target)}">\n'
        f"          {geo}\n"
        f"        </mxCell>\n"
    )


def logo_style(image: str) -> str:
    return STYLE + image


def main() -> None:
    images: dict[str, str] = {}
    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    for name, (slug, color) in SIMPLE.items():
        svg = fetch_simple_svg(slug, color)
        (LOGO_DIR / f"{name}.svg").write_bytes(svg)
        images[name] = data_uri(svg)

    images["nvidia"] = from_aiicons("nvidia")
    images["huggingface"] = from_aiicons("huggingface")
    save_data_uri("nvidia", images["nvidia"])
    save_data_uri("huggingface", images["huggingface"])

    mark_svg = (OUT_DIR / "sanzero-mark.svg").read_bytes()
    images["sanzero"] = data_uri(mark_svg)

    lane = (
        "swimlane;startSize=36;horizontal=1;container=1;collapsible=0;"
        "whiteSpace=wrap;html=1;fillColor=#FDFDFD;strokeColor=#CDD4DC;"
        "fontColor=#191817;fontStyle=1;fontSize=13;rounded=0;"
    )
    title = (
        "text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;"
        "fontSize=20;fontStyle=1;fontColor=#191817;"
    )
    sub = (
        "text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;"
        "fontSize=12;fontColor=#6e6a64;"
    )

    parts: list[str] = []
    parts.append(cell("mark", "", logo_style(images["sanzero"]), 40, 8, 40, 40))
    parts.append(cell("title", "산재ON 런타임", title, 92, 12, 400, 32))
    parts.append(
        cell(
            "subtitle",
            "브라우저는 Nginx만 본다. 홈은 Nuxt, 실무 화면은 FastAPI+Jinja. 데이터와 LLM은 서버에서만.",
            sub,
            40,
            48,
            1100,
            24,
        )
    )

    parts.append(cell("lane-client", "Client", lane, 40, 90, 1240, 150))
    parts.append(
        cell("browser", "Browser", logo_style(images["chrome"]), 572, 42, 72, 80, "lane-client")
    )

    parts.append(cell("lane-edge", "Edge", lane, 40, 270, 1240, 170))
    parts.append(
        cell("nginx", "Nginx :80", logo_style(images["nginx"]), 562, 50, 90, 90, "lane-edge")
    )
    parts.append(
        cell("docker", "Compose", logo_style(images["docker"]), 1100, 50, 80, 80, "lane-edge")
    )

    parts.append(cell("lane-app", "App", lane, 40, 470, 1240, 220))
    parts.append(
        cell("vue", "Vue 3", logo_style(images["vue"]), 80, 70, 64, 80, "lane-app")
    )
    parts.append(
        cell("nuxt", "Nuxt 3  :3000&#xa;홈 /  · /_nuxt/", logo_style(images["nuxt"]), 190, 50, 90, 100, "lane-app")
    )
    parts.append(
        cell(
            "fastapi",
            "FastAPI  :8000&#xa;Jinja2",
            logo_style(images["fastapi"]),
            700,
            50,
            90,
            100,
            "lane-app",
        )
    )
    parts.append(
        cell("python", "Python 3.13", logo_style(images["python"]), 830, 70, 64, 80, "lane-app")
    )
    parts.append(
        cell("htmx", "HTMX", logo_style(images["htmx"]), 940, 70, 56, 72, "lane-app")
    )
    parts.append(
        cell("tailwind", "Tailwind", logo_style(images["tailwind"]), 1040, 70, 56, 72, "lane-app")
    )

    parts.append(cell("lane-data", "Data  ·  server-only", lane, 40, 720, 600, 220))
    parts.append(
        cell(
            "supabase",
            "Supabase&#xa;Auth · Storage",
            logo_style(images["supabase"]),
            40,
            50,
            90,
            100,
            "lane-data",
        )
    )
    parts.append(
        cell(
            "postgres",
            "Postgres&#xa;pgvector 384",
            logo_style(images["postgresql"]),
            280,
            50,
            90,
            100,
            "lane-data",
        )
    )

    parts.append(cell("lane-ai", "AI", lane, 680, 720, 600, 220))
    parts.append(
        cell("nvidia", "NVIDIA NIM&#xa;Llama 3.3", logo_style(images["nvidia"]), 30, 50, 90, 100, "lane-ai")
    )
    parts.append(
        cell("hf", "HuggingFace&#xa;SBERT", logo_style(images["huggingface"]), 220, 50, 90, 100, "lane-ai")
    )
    parts.append(
        cell("tf", "TensorFlow&#xa;장해등급 DNN", logo_style(images["tensorflow"]), 410, 50, 90, 100, "lane-ai")
    )

    down = "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
    parts.append(edge("e-browser-nginx", "browser", "nginx", extra=down))
    parts.append(
        edge(
            "e-nginx-nuxt",
            "nginx",
            "nuxt",
            "= /  ·  /_nuxt/",
            extra="exitX=0.25;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;",
        )
    )
    parts.append(
        edge(
            "e-nginx-fa",
            "nginx",
            "fastapi",
            "그 외",
            extra="exitX=0.75;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;",
        )
    )
    parts.append(
        edge(
            "e-nuxt-fa",
            "nuxt",
            "fastapi",
            "SSR /api/home",
            extra="exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;",
        )
    )
    parts.append(
        edge(
            "e-fa-sb",
            "fastapi",
            "supabase",
            extra="exitX=0.35;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;",
            points=[(785, 700), (125, 700)],
        )
    )
    parts.append(
        edge(
            "e-fa-ai",
            "fastapi",
            "nvidia",
            extra="exitX=0.65;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;",
            points=[(785, 700), (755, 700)],
        )
    )

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="drawio" version="26.0.0">
  <diagram id="sanzero-runtime" name="Runtime">
    <mxGraphModel dx="1400" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="1060" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
{''.join(parts)}      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""
    out = OUT_DIR / "architecture.drawio"
    out.write_text(xml, encoding="utf-8")
    print("wrote", out)


if __name__ == "__main__":
    main()
