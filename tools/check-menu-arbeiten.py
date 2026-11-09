#!/usr/bin/env python3
"""Bricht ab, wenn ein Menü den Eintrag „Arbeiten“ enthält.

Geprüft werden Links in nav, header und footer. Der verbotene Eintrag ist
der Text „Arbeiten“ oder ein Link auf werbeclips.html#clips mit diesem Text.
Eigenständige Demo-Navigationen unter referenzen/ und vorschau/orbit/ bleiben
außen vor: dort heißt eine eigene Sektion so, das ist nicht das Menü von
PROJEKT EX.
"""
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_PREFIXES = ("referenzen/", "vorschau/orbit/")


class MenuScan(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.hits = []
        self.href = None
        self.buf = []

    def handle_starttag(self, tag, attrs):
        self.stack.append(tag)
        if tag == "a" and any(t in ("nav", "header", "footer") for t in self.stack):
            self.href = dict(attrs).get("href", "")
            self.buf = []

    def handle_endtag(self, tag):
        if tag == "a" and self.href is not None:
            text = " ".join("".join(self.buf).split())
            href = self.href
            if text == "Arbeiten":
                self.hits.append(href or "(ohne href)")
            self.href = None
            self.buf = []
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        if self.href is not None:
            self.buf.append(data)


def main():
    bad = []
    for path in ROOT.rglob("*.html"):
        rel = path.relative_to(ROOT).as_posix()
        if rel.startswith(SKIP_PREFIXES) or "/.git/" in f"/{rel}":
            continue
        parser = MenuScan()
        try:
            parser.feed(path.read_text(encoding="utf-8", errors="replace"))
        except Exception as exc:
            bad.append(f"{rel}: Parserfehler {exc}")
            continue
        for href in parser.hits:
            bad.append(f"{rel}: Menüeintrag „Arbeiten“ ({href})")
    for path in ROOT.rglob("*.js"):
        rel = path.relative_to(ROOT).as_posix()
        if rel.startswith(SKIP_PREFIXES) or "node_modules/" in rel:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if "werbeclips.html#clips" in text and "Arbeiten" in text:
            bad.append(f"{rel}: Skript setzt den Menüeintrag Arbeiten")
    if bad:
        print("Menüprüfung fehlgeschlagen. „Arbeiten“ darf nicht im Menü stehen:", file=sys.stderr)
        for line in bad:
            print(f"  {line}", file=sys.stderr)
        return 1
    print("Menüprüfung in Ordnung: kein Eintrag „Arbeiten“.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
