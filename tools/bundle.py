"""index.html と css/js を1ファイルにまとめる（Claudeのアーティファクト用）。

使い方: python3 tools/bundle.py 出力先.html
GitHub Pages ではこのスクリプトは不要。index.html がそのまま動く。
"""
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "css/style.css").read_text(encoding="utf-8")
html = html.replace('<link rel="stylesheet" href="css/style.css">', f"<style>\n{css}</style>")
srcs = re.findall(r'<script src="([^"]+)" defer></script>\n?', html)
html = re.sub(r'<script src="[^"]+" defer></script>\n?', "", html)
js = "\n".join((root / s).read_text(encoding="utf-8") for s in srcs)
html = html.replace("</body>", f"<script>\n{js}</script>\n</body>")
Path(sys.argv[1]).write_text(html, encoding="utf-8")
print(f"{len(srcs)} scripts -> {sys.argv[1]}")
