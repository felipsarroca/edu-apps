"""Actualitza la còpia pública de les marques vigents per al joc."""

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
config = (ROOT / "config.js").read_text(encoding="utf-8")
match = re.search(r'GOOGLE_SCRIPT_URL\s*=\s*"([^"]+)"', config)
if not match:
    raise SystemExit("Falta GOOGLE_SCRIPT_URL")

with urllib.request.urlopen(match.group(1) + "?callback=quizTaulaSync", timeout=30) as response:
    text = response.read().decode("utf-8")
prefix, suffix = "quizTaulaSync(", ");"
if not text.startswith(prefix) or not text.endswith(suffix):
    raise SystemExit("Resposta inesperada d'Apps Script")
payload = json.loads(text[len(prefix):-len(suffix)])
if not isinstance(payload.get("entries"), list):
    raise SystemExit("No hi ha cap llista de marques vàlida")

(ROOT / "leaderboard.json").write_text(
    json.dumps({"entries": payload["entries"]}, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
