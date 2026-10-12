#!/usr/bin/env python3
"""
Copy the shared header (with menus) and footer into every page.

You only need this when you change the menu or footer. Edit
_tools/partials/header.html or _tools/partials/footer.html, then run from the
repository root:

    python3 _tools/update-layout.py

Each page keeps everything outside these markers:
    <!-- site-header:start --> ... <!-- site-header:end -->
    <!-- site-footer:start --> ... <!-- site-footer:end -->

The script also marks the current page in the menu (aria-current="page") and
underlines the menu section it belongs to. Python 3 standard library only.
Folders starting with "_" are not published by GitHub Pages.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "_tools" / "partials"

HEADER_RE = re.compile(r"<!-- site-header:start -->.*?<!-- site-header:end -->", re.S)
FOOTER_RE = re.compile(r"<!-- site-footer:start -->.*?<!-- site-footer:end -->", re.S)
ITEM_RE = re.compile(r'(<li class="nav-item" data-section="[^"]+">)(.*?)(</li><!-- /nav-item -->)', re.S)


def header_for(page_name: str, header: str) -> str:
    """Return the header with the current page and its menu section marked."""
    target = f'href="{page_name}"'

    def mark(match):
        open_tag, body, close_tag = match.groups()
        if f"<a {target}>" in body:
            body = body.replace(f"<a {target}>", f'<a {target} aria-current="page">', 1)
            body = body.replace('class="nav-button"', 'class="nav-button is-current"', 1)
        return open_tag + body + close_tag

    return ITEM_RE.sub(mark, header)


def main() -> int:
    header = (PARTIALS / "header.html").read_text(encoding="utf-8").strip()
    footer = (PARTIALS / "footer.html").read_text(encoding="utf-8").strip()
    changed = 0
    for page in sorted(ROOT.glob("*.html")):
        html = page.read_text(encoding="utf-8")
        if "<!-- site-header:start -->" not in html:
            print(f"skipped (no markers): {page.name}")
            continue
        new = HEADER_RE.sub(
            lambda m: "<!-- site-header:start -->\n" + header_for(page.name, header) + "\n<!-- site-header:end -->",
            html,
        )
        new = FOOTER_RE.sub(lambda m: "<!-- site-footer:start -->\n" + footer + "\n<!-- site-footer:end -->", new)
        if new != html:
            page.write_text(new, encoding="utf-8")
            changed += 1
            print(f"updated: {page.name}")
    print(f"done, {changed} page(s) updated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
