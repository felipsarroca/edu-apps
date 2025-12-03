from pathlib import Path
import json

basic = [
    {
        "id": "eq001",
        "reactants": ["H2", "O2"],
        "products": ["H2O"],
        "coefficients": [2, 1, 2],
        "type": "combustio",
        "level": 1,
        "explanation": "La formaci\u00f3 d'aigua necessita dues mol\u00e8cules d'hidrogen per cada mol\u00e8cula d'oxigen."
    },
    {
        "id": "eq002",
        "reactants": ["Fe", "O2"],
        "products": ["Fe2O3"],
        "coefficients": [4, 3, 2],
        "type": "oxidacio",
        "level": 1,
        "explanation": "Per formar \u00f2xid de ferro(III) calen quatre \u00e0toms de ferro i tres de dioxigen."
    },
    {
        "id": "eq003",
        "reactants": ["C3H8", "O2"],
        "products": ["CO2", "H2O"],
        "coefficients": [1, 5, 3, 4],
        "type": "combustio",
        "level": 1,
        "explanation": "Una combusti\u00f3 completa del prop\u00e0 produeix di\u00f2xid de carboni i aigua."
    },
    {
        "id": "eq004",
        "reactants": ["Na", "Cl2"],
        "products": ["NaCl"],
        "coefficients": [2, 1, 2],
        "type": "sintesi",
        "level": 1,
        "explanation": "Dos \u00e0toms de sodi reaccionen amb una mol\u00e8cula de clor per formar clorur de sodi."
    },
    {
        "id": "eq005",
        "reactants": ["CaCO3"],
        "products": ["CaO", "CO2"],
        "coefficients": [1, 1, 1],
        "type": "descomposicio",
        "level": 1,
        "explanation": "El carbonat de calci es descompon en \u00f2xid de calci i di\u00f2xid de carboni."
    }
]

intermediate = [
    {
        "id": "eq006",
        "reactants": ["Al", "HCl"],
        "products": ["AlCl3", "H2"],
        "coefficients": [2, 6, 2, 3],
        "type": "desplacament_simple",
        "level": 2,
        "explanation": "L'alumini despla\u00e7a l'hidrogen de l'\u00e0cid clorh\u00eddric i forma clorur d'alumini."
    },
    {
        "id": "eq007",
        "reactants": ["KClO3"],
        "products": ["KCl", "O2"],
        "coefficients": [2, 2, 3],
        "type": "descomposicio",
        "level": 2,
        "explanation": "El clorat de potassi es descompon en clorur de potassi i dioxigen."
    },
    {
        "id": "eq008",
        "reactants": ["N2", "H2"],
        "products": ["NH3"],
        "coefficients": [1, 3, 2],
        "type": "sintesi",
        "level": 2,
        "explanation": "El proc\u00e9s Haber-Bosch combina nitrogen i hidrogen per formar amon\u00edac."
    },
    {
        "id": "eq009",
        "reactants": ["AgNO3", "NaCl"],
        "products": ["AgCl", "NaNO3"],
        "coefficients": [1, 1, 1, 1],
        "type": "desplacament_doble",
        "level": 2,
        "explanation": "Es produeix un intercanvi d'ions que genera el precipitat de clorur de plata."
    },
    {
        "id": "eq010",
        "reactants": ["H2SO4", "NaOH"],
        "products": ["Na2SO4", "H2O"],
        "coefficients": [1, 2, 1, 2],
        "type": "neutralitzacio",
        "level": 2,
        "explanation": "Una neutralitzaci\u00f3 entre un \u00e0cid fort i una base forta dona sal i aigua."
    }
]

advanced = [
    {
        "id": "eq102",
        "reactants": ["Fe2+", "MnO4-", "H+"],
        "products": ["Fe3+", "Mn2+", "H2O"],
        "coefficients": [5, 1, 8, 5, 1, 4],
        "type": "oxidacio-reduccio",
        "level": 3,
        "explanation": "El Fe(II) s'oxida a Fe(III) i el Mn(VII) es redueix a Mn(II).",
        "details": {
            "method": "redox",
            "agents": {
                "oxidant": "MnO4-",
                "reductor": "Fe2+"
            },
            "electrons": 5
        }
    }
]

def write_json(path, data):
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

write_json('data/eq_basic.json', basic)
write_json('data/eq_intermediate.json', intermediate)
write_json('data/eq_advanced.json', advanced)
write_json('data/equations_master.json', basic + intermediate + advanced)
write_json(
    'data/reaction_types.json',
    [
        {"id": "combustio", "name": "Combustió"},
        {"id": "oxidacio", "name": "Oxidació"},
        {"id": "neutralitzacio", "name": "Neutralització"},
        {"id": "descomposicio", "name": "Descomposició"},
        {"id": "sintesi", "name": "Síntesi"},
        {"id": "desplacament_simple", "name": "Desplaçament simple"},
        {"id": "desplacament_doble", "name": "Desplaçament doble"},
        {"id": "oxidacio-reduccio", "name": "Oxidació-reducció"},
    ],
)
