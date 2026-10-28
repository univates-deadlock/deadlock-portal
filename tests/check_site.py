"""Dependency-free smoke validation for this static website."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
CSS_URL_PATTERN = re.compile(r"""url\(\s*['"]?([^'")]+)['"]?\s*\)""")


class LocalReferenceParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes:
            self.ids.add(attributes["id"])
        for key in ("href", "src"):
            val = attributes.get(key)
            if val:
                self.links.append((tag, key, val))


issues = []
for html_file in (ROOT / "index.html", ROOT / "404.html"):
    parser = LocalReferenceParser()
    parser.feed(html_file.read_text(encoding="utf-8"))
    for tag, key, val in parser.links:
        parsed = urlsplit(val)
        if parsed.scheme or parsed.netloc or val.startswith(("mailto:", "tel:")):
            continue
        if parsed.path in ("", "/"):
            if parsed.fragment and parsed.fragment not in parser.ids and parsed.path == "":
                issues.append(f"{html_file.name}: missing id #{parsed.fragment}")
            continue
        path = (
            ROOT / unquote(parsed.path).lstrip("/")
            if parsed.path.startswith("/")
            else html_file.parent / unquote(parsed.path)
        )
        if not path.is_file():
            issues.append(f"{html_file.name}: {key}={val} points to missing file")

for css_file in sorted((ROOT / "css").rglob("*.css")):
    for raw_url in CSS_URL_PATTERN.findall(css_file.read_text(encoding="utf-8")):
        parsed = urlsplit(raw_url)
        if parsed.scheme or parsed.netloc or raw_url.startswith("data:"):
            continue
        path = (
            ROOT / unquote(parsed.path).lstrip("/")
            if parsed.path.startswith("/")
            else (css_file.parent / unquote(parsed.path)).resolve()
        )
        if not path.is_file():
            rel_css = css_file.relative_to(ROOT)
            issues.append(f"{rel_css}: url({raw_url}) points to missing file")

if issues:
    print("\n".join(issues), file=sys.stderr)
    raise SystemExit(1)
print("Static links, anchor targets, stylesheets and local assets are valid.")
