"""Dependency-free smoke validation for this static website."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1]

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
    p = LocalReferenceParser()
    p.feed(html_file.read_text(encoding="utf-8"))
    for tag, key, val in p.links:
        u = urlsplit(val)
        if u.scheme or u.netloc or val.startswith(("mailto:", "tel:")):
            continue
        if u.path in ("", "/"):
            if u.fragment and u.fragment not in p.ids and u.path == "":
                issues.append(f"{html_file.name}: missing id #{u.fragment}")
            continue
        path = (ROOT / unquote(u.path).lstrip("/")) if u.path.startswith("/") else (html_file.parent / unquote(u.path))
        if not path.is_file():
            issues.append(f"{html_file.name}: {key}={val} points to missing file")

if issues:
    print("\n".join(issues), file=sys.stderr)
    raise SystemExit(1)
print("Static links, anchor targets and local assets are valid.")
