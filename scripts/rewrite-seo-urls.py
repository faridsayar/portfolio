#!/usr/bin/env python3
# NOTE: One-off maintenance script — rewrites formaa.no .html URLs in HTML to extensionless
# routes that match .htaccess (fixes Search Console “alternate page with canonical” / 404s).

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def transform_stripped_path(noext: str) -> str:
    """noext: path starting with /, without .html (e.g. /oss or /category/x/y)."""
    if noext == "/index":
        return "/"
    m = re.match(r"^/innsikt-([a-z0-9-]+)$", noext)
    if m:
        return f"/innsikt/{m.group(1)}"
    m = re.match(r"^/prosjekt-([a-z0-9-]+)$", noext)
    if m:
        return f"/prosjekter/{m.group(1)}"
    if noext == "/advanced-project":
        return "/prosjekter"
    if noext == "/innsikt":
        return "/innsikt"
    if noext.startswith("/category/"):
        return noext
    return noext


def transform_path_with_html_suffix(path: str) -> str:
    """path: absolute path on host, may include ?query and/or #fragment; ends with .html before query/fragment."""
    if ".." in path:
        return path
    hash_part = ""
    if "#" in path:
        path, _, frag = path.partition("#")
        hash_part = f"#{frag}"
    q = ""
    if "?" in path:
        path, _, qs = path.partition("?")
        q = f"?{qs}"
    if not path.endswith(".html"):
        return path + q + hash_part
    noext = path[:-5]
    new_base = transform_stripped_path(noext)
    return new_base + q + hash_part


def rewrite_https_formaa(match: str) -> str:
    if not match.startswith("https://formaa.no"):
        return match
    suffix = match[len("https://formaa.no") :]
    if ".html" not in suffix:
        return match
    # Only rewrite if .html is part of the path (not e.g. asset name — none today)
    path_end = len(suffix)
    for sep in ("#", "?"):
        if sep in suffix:
            path_end = min(path_end, suffix.index(sep))
    path_part = suffix[:path_end]
    if not path_part.endswith(".html"):
        return match
    new_suffix = transform_path_with_html_suffix(suffix)
    return f"https://formaa.no{new_suffix}"


HTTPS_FORMAA_RE = re.compile(r"https://formaa\.no[^\s\"'<>]*?\.html[^\s\"'<>]*")

# Root-relative hrefs like /foo.html or /a/b.html (not ../ relative).
ROOT_REL_RE = re.compile(
    r"(?<=[=\"'])(/[a-z0-9][a-z0-9_./-]*\.html)(\?[^\"']*)?(\#[^\"']*)?(?=[\"'])"
)

# JSON-in-HTML: href=\"/path.html\" (backslash-escaped quotes in string literals).
ESCAPED_HREF_RE = re.compile(r'(href=\\")(/[a-z0-9][a-z0-9_./-]*\.html)(\\")')


def rewrite_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text

    text = HTTPS_FORMAA_RE.sub(lambda m: rewrite_https_formaa(m.group(0)), text)

    def rr(m: re.Match[str]) -> str:
        full = m.group(0)
        p = m.group(1) + (m.group(2) or "") + (m.group(3) or "")
        return transform_path_with_html_suffix(p)

    text = ROOT_REL_RE.sub(rr, text)

    text = ESCAPED_HREF_RE.sub(
        lambda m: m.group(1) + transform_path_with_html_suffix(m.group(2)) + m.group(3),
        text,
    )

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for html in sorted(ROOT.rglob("*.html")):
        if "node_modules" in html.parts:
            continue
        if rewrite_file(html):
            changed.append(html.relative_to(ROOT))
    for p in changed:
        print(p)
    print(f"Updated {len(changed)} files.", file=sys.stderr)


if __name__ == "__main__":
    main()
