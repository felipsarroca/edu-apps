# SPDX-License-Identifier: AGPL-3.0-or-later
"""Genera time_bank.json: les 144 hores de rellotge (1-12 h, minuts de 5 en 5).

Cada hora té el text en el sistema tradicional de quarts («quarts») i, quan
escau, la forma amb «menys» («menys»). Executa: python scripts/genera_banc.py
"""
import json
from pathlib import Path

NOMS = {1: "una", 2: "dues", 3: "tres", 4: "quatre", 5: "cinc", 6: "sis",
        7: "set", 8: "vuit", 9: "nou", 10: "deu", 11: "onze", 12: "dotze"}


def seg(h):
    return h % 12 + 1


def article(h):
    """«la una» (no s'apostrofa quan és l'hora) i «les dues», «les tres»..."""
    return "la una" if h == 1 else f"les {NOMS[h]}"


def de(h):
    """«d'una», «d'onze», «de dues»..."""
    nom = NOMS[h]
    return f"d'{nom}" if nom[0] in "uo" else f"de {nom}"


QUARTS = {15: "un quart", 30: "dos quarts", 45: "tres quarts"}


def text_quarts(h, m):
    s = seg(h)
    if m == 0:
        return f"{article(h)} en punt"
    if m in (5, 10):
        return f"{article(h)} i {'cinc' if m == 5 else 'deu'}"
    base = {15: 15, 20: 15, 25: 15, 30: 30, 35: 30, 40: 30, 45: 45, 50: 45, 55: 45}[m]
    extra = m - base
    afegit = "" if extra == 0 else (" i cinc" if extra == 5 else " i deu")
    return f"{QUARTS[base]}{afegit} {de(s)}"


def text_menys(h, m):
    s = seg(h)
    if m in (50, 55):
        return f"{article(s)} menys {'deu' if m == 50 else 'cinc'}"
    if m in (5, 10, 20, 25, 35, 40):
        base = {5: 15, 10: 15, 20: 30, 25: 30, 35: 45, 40: 45}[m]
        falta = "deu" if base - m == 10 else "cinc"
        return f"{QUARTS[base]} menys {falta} {de(s)}"
    return None


def etiquetes(m):
    if m == 0:
        return ["en_punt"]
    if m in (15, 30, 45):
        return ["quarts"] + (["dos_quarts"] if m == 30 else [])
    return ["min5"]


banc = []
for h in range(1, 13):
    for m in range(0, 60, 5):
        banc.append({
            "id": f"t_{h:02d}{m:02d}",
            "h": h,
            "m": m,
            "digital": f"{h}:{m:02d}",
            "quarts": text_quarts(h, m),
            "menys": text_menys(h, m),
            "tags": etiquetes(m),
        })

desti = Path(__file__).resolve().parent.parent / "time_bank.json"
desti.write_text(json.dumps(banc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(len(banc), "hores ->", desti)
