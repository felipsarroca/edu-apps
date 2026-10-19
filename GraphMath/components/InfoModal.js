import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { THEMES, COLORS } from "../constants.js";
import { prepareExpression, splitInlineDomain } from "../services/mathService.js";
// Crea elements sense haver d'escollir entre jsx i jsxs a cada línia
const h = (type, props, ...children) => {
  const { key, ...rest } = props || {};
  if (children.length === 0) return jsx(type, rest, key);
  if (children.length === 1) return jsx(type, { ...rest, children: children[0] }, key);
  return jsxs(type, { ...rest, children }, key);
};
const [BLUE, RED, GREEN, ORANGE, VIOLET] = COLORS;
const TAB_KEY = "grapher-help-tab";
// ---------- Il·lustracions ----------
// Coordenades matemàtiques: x entre −3,75 i 3,75; y entre −2,25 i 2,25
const sx = (x) => 80 + 20 * x;
const sy = (y) => 50 - 20 * y;
const plot = (f, a, b, keep = () => true, n = 90) => {
  let d = "";
  let pen = false;
  for (let i = 0; i <= n; i++) {
    const x = a + (b - a) * i / n;
    const y = f(x);
    if (!Number.isFinite(y) || Math.abs(y) > 3 || !keep(x, y)) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
    pen = true;
  }
  return d;
};
const Curve = ({ d, color, dashed, width = 2.5, opacity = 1 }) => h("path", { d, fill: "none", stroke: color, strokeWidth: width, strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: dashed ? "5 4" : void 0, opacity });
const Dot = ({ x, y, color, open }) => h("circle", { cx: sx(x), cy: sy(y), r: 3.6, fill: open ? "white" : color, stroke: color, strokeWidth: 2 });
const Label = ({ x, y, text, color, anchor = "middle" }) => h("text", { x: sx(x), y: sy(y), fill: color || "currentColor", fontSize: 9, fontWeight: 700, textAnchor: anchor, fontFamily: "sans-serif" }, text);
const Figure = ({ children, caption }) => h(
  "figure",
  { className: "flex flex-col items-center" },
  h(
    "svg",
    { viewBox: "0 0 160 100", className: "w-full max-w-[180px] h-auto rounded-lg border border-current/10", style: { background: "rgba(148,163,184,0.10)" }, role: "img", "aria-label": caption || "Il·lustració" },
    h(
      "g",
      { stroke: "currentColor", strokeWidth: 1, opacity: 0.45 },
      h("line", { x1: 4, y1: 50, x2: 156, y2: 50 }),
      h("line", { x1: 80, y1: 4, x2: 80, y2: 96 })
    ),
    children
  ),
  caption && h("figcaption", { className: "text-xs mt-1 text-center opacity-75" }, caption)
);
const cubic = (x) => 0.3 * x ** 3 - 0.9 * x;
const ILLUSTRATIONS = {
  funcio: () => h(
    Figure,
    { caption: "y = x²/2 − 1,5" },
    h(Curve, { d: plot((x) => x * x / 2 - 1.5, -3.5, 3.5), color: BLUE }),
    h(Dot, { x: -Math.sqrt(3), y: 0, color: BLUE }),
    h(Dot, { x: Math.sqrt(3), y: 0, color: BLUE }),
    h(Dot, { x: 0, y: -1.5, color: BLUE }),
    h(Label, { x: 0.35, y: -1.95, text: "V", color: BLUE, anchor: "start" })
  ),
  equacio: () => h(
    Figure,
    { caption: "Solucions sobre l'eix X" },
    h(Curve, { d: plot((x) => x * x / 2 - 1.5, -3.5, 3.5), color: BLUE, dashed: true, opacity: 0.45 }),
    h(Dot, { x: -Math.sqrt(3), y: 0, color: BLUE }),
    h(Dot, { x: Math.sqrt(3), y: 0, color: BLUE }),
    h(Label, { x: -Math.sqrt(3), y: 0.4, text: "x₁", color: BLUE }),
    h(Label, { x: Math.sqrt(3), y: 0.4, text: "x₂", color: BLUE })
  ),
  inequacio1: () => h(
    Figure,
    { caption: "x > 1" },
    h("line", { x1: sx(1), y1: 50, x2: sx(3.6), y2: 50, stroke: ORANGE, strokeWidth: 5, strokeLinecap: "round" }),
    h(Dot, { x: 1, y: 0, color: ORANGE, open: true }),
    h(Label, { x: 1, y: 0.45, text: "1", color: ORANGE })
  ),
  regio: () => h(
    Figure,
    { caption: "y > x/2 − 0,5" },
    h("path", { d: `M${sx(-3.75)} ${sy(-2.375)} L${sx(3.75)} ${sy(1.375)} L${sx(3.75)} 4 L${sx(-3.75)} 4 Z`, fill: GREEN, opacity: 0.22 }),
    h(Curve, { d: plot((x) => x / 2 - 0.5, -3.75, 3.75), color: GREEN, dashed: true })
  ),
  circumferencia: () => h(
    Figure,
    { caption: "Centre i radi" },
    h("circle", { cx: sx(0.5), cy: sy(0.3), r: 32, fill: "none", stroke: VIOLET, strokeWidth: 2.5 }),
    h(Dot, { x: 0.5, y: 0.3, color: VIOLET }),
    h("line", { x1: sx(0.5), y1: sy(0.3), x2: sx(0.5) + 32, y2: sy(0.3), stroke: VIOLET, strokeWidth: 1.5, strokeDasharray: "3 3" }),
    h(Label, { x: 1.3, y: 0.45, text: "r", color: VIOLET })
  ),
  sistema: () => h(
    Figure,
    { caption: "La solució és el punt de tall" },
    h(Curve, { d: plot((x) => x + 0.5, -3.75, 3.75), color: BLUE }),
    h(Curve, { d: plot((x) => -0.5 * x + 2, -3.75, 3.75), color: RED }),
    h(Dot, { x: 1, y: 1.5, color: "currentColor" }),
    h(Label, { x: 1.25, y: 1.85, text: "(1, 1,5)", anchor: "start" })
  ),
  interval: () => h(
    Figure,
    { caption: "−1 < x < 1,5" },
    h("rect", { x: sx(-1), y: 4, width: sx(1.5) - sx(-1), height: 92, fill: ORANGE, opacity: 0.2 }),
    h("line", { x1: sx(-1), y1: 4, x2: sx(-1), y2: 96, stroke: ORANGE, strokeWidth: 1.5, strokeDasharray: "4 3" }),
    h("line", { x1: sx(1.5), y1: 4, x2: sx(1.5), y2: 96, stroke: ORANGE, strokeWidth: 1.5, strokeDasharray: "4 3" })
  ),
  forat: () => h(
    Figure,
    { caption: "Punt buit: la funció no hi existeix" },
    h(Curve, { d: plot((x) => 0.6 * x + 0.3, -3.75, 3.75), color: RED }),
    h(Dot, { x: 1, y: 0.9, color: RED, open: true })
  ),
  asimptota: () => h(
    Figure,
    { caption: "Asímptotes x = 1 i y = 0,8" },
    h("line", { x1: sx(1), y1: 4, x2: sx(1), y2: 96, stroke: VIOLET, strokeWidth: 1.5, strokeDasharray: "5 4" }),
    h("line", { x1: 4, y1: sy(0.8), x2: 156, y2: sy(0.8), stroke: VIOLET, strokeWidth: 1.5, strokeDasharray: "5 4" }),
    h(Curve, { d: plot((x) => 0.6 / (x - 1) + 0.8, -3.75, 0.97, void 0, 120), color: VIOLET }),
    h(Curve, { d: plot((x) => 0.6 / (x - 1) + 0.8, 1.03, 3.75, void 0, 120), color: VIOLET })
  ),
  parametres: () => h(
    Figure,
    { caption: "y = a·x² − 1,5 amb a = 0,25; 0,5; 1" },
    [0.25, 0.5, 1].map((a, i) => h(Curve, { key: a, d: plot((x) => a * x * x - 1.5, -3.75, 3.75), color: BLUE, opacity: 0.35 + i * 0.3 }))
  ),
  tracador: () => h(
    Figure,
    { caption: "El punter segueix la corba" },
    h(Curve, { d: plot((x) => 1.2 * Math.sin(x), -3.75, 3.75), color: GREEN }),
    h(Dot, { x: 1.2, y: 1.2 * Math.sin(1.2), color: GREEN }),
    h("rect", { x: sx(1.2) + 6, y: sy(1.12) - 20, width: 58, height: 15, rx: 4, fill: "white", stroke: GREEN }),
    h("text", { x: sx(1.2) + 35, y: sy(1.12) - 9.5, fontSize: 8, textAnchor: "middle", fill: "#111827", fontFamily: "monospace" }, "(1,2; 1,12)")
  ),
  extrems: () => h(
    Figure,
    { caption: "Màxim i mínim relatius" },
    h(Curve, { d: plot(cubic, -3.2, 3.2), color: BLUE }),
    h(Dot, { x: -1, y: 0.6, color: BLUE }),
    h(Dot, { x: 1, y: -0.6, color: BLUE }),
    h(Label, { x: -1, y: 0.95, text: "Màx", color: BLUE }),
    h(Label, { x: 1, y: -1.25, text: "Mín", color: BLUE })
  ),
  creixement: () => h(
    Figure,
    { caption: "Creix (verd) i decreix (vermell)" },
    h(Curve, { d: plot(cubic, -3.2, 3.2, (x) => x <= -1 || x >= 1), color: GREEN }),
    h(Curve, { d: plot(cubic, -1, 1), color: RED })
  ),
  signe: () => h(
    Figure,
    { caption: "Positiva (verd) i negativa (vermell)" },
    h(Curve, { d: plot((x) => x * x / 2 - 1, -3.5, 3.5, (x, y) => y >= 0), color: GREEN }),
    h(Curve, { d: plot((x) => x * x / 2 - 1, -1.42, 1.42), color: RED })
  ),
  periodiques: () => h(
    Figure,
    { caption: "x = kπ (k ∈ ℤ)" },
    h(Curve, { d: plot((x) => 1.2 * Math.sin(x), -3.75, 3.75), color: GREEN }),
    [-Math.PI, 0, Math.PI].map((x) => h(Dot, { key: x, x, y: 0, color: GREEN }))
  )
};
const Ill = ({ name }) => ILLUSTRATIONS[name]();
// ---------- Peces de contingut ----------
const Code = ({ children }) => h("code", { className: "font-mono text-[0.92em] px-1.5 py-0.5 rounded bg-slate-500/15 whitespace-nowrap" }, children);
const Icon = ({ name, className = "" }) => h("i", { className: `fa-solid ${name} ${className}` });
const P = ({ children, className = "" }) => h("p", { className: `leading-relaxed ${className}` }, children);
const H3 = ({ children }) => h("h3", { className: "font-bold text-lg mt-5 mb-2 first:mt-0" }, children);
const Tip = ({ children, icon = "fa-lightbulb", color = "text-amber-400" }) => h(
  "div",
  { className: "flex gap-3 items-start p-3 rounded-lg bg-slate-500/10 text-sm leading-relaxed my-3" },
  h(Icon, { name: `${icon} ${color} mt-0.5` }),
  h("div", null, children)
);
// Desplegable natiu, accessible amb teclat
const Fold = ({ title, icon, children, open }) => h(
  "details",
  { className: "group rounded-lg border border-slate-500/25 mb-2 overflow-hidden", open },
  h(
    "summary",
    { className: "flex items-center gap-2 cursor-pointer select-none px-3 py-2 font-semibold hover:bg-slate-500/10 list-none [&::-webkit-details-marker]:hidden" },
    icon && h(Icon, { name: `${icon} w-5 text-center opacity-70` }),
    h("span", { className: "flex-1" }, title),
    h(Icon, { name: "fa-chevron-down text-xs opacity-60 transition-transform group-open:rotate-180" })
  ),
  h("div", { className: "px-3 pb-3 pt-1 text-sm leading-relaxed" }, children)
);
const Try = ({ expr, onTry, label }) => onTry ? h(
  "button",
  { type: "button", onClick: () => onTry(expr), className: "inline-flex flex-shrink-0 whitespace-nowrap items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors", title: "Afegeix aquest exemple a la gràfica" },
  h(Icon, { name: "fa-play text-[0.7em]" }),
  label || "Prova-ho"
) : null;
const Table = ({ head, rows }) => h(
  "div",
  { className: "overflow-x-auto -mx-1" },
  h(
    "table",
    { className: "w-full text-sm border-collapse" },
    h("thead", null, h("tr", { className: "text-left text-xs uppercase tracking-wide opacity-70" }, head.map((c, i) => h("th", { key: i, className: "py-1.5 px-1 font-semibold" }, c)))),
    h("tbody", null, rows.map((row, i) => h("tr", { key: i, className: "border-t border-slate-500/20 align-top" }, row.map((c, j) => h("td", { key: j, className: `py-1.5 px-1 ${j === 0 ? "font-semibold" : ""}` }, c)))))
  )
);
const Steps = ({ items }) => h("ol", { className: "space-y-3" }, items.map(([title, text], i) => h(
  "li",
  { key: i, className: "flex gap-3" },
  h("span", { className: "flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold flex items-center justify-center" }, i + 1),
  h("div", { className: "text-sm leading-relaxed pt-0.5" }, h("strong", null, title), " ", text)
)));
// Fitxa d'un tipus d'expressió: il·lustració, exemple i botó per provar-lo
const KindCard = ({ fig, title, example, children, onTry }) => h(
  "div",
  { className: "rounded-lg border border-slate-500/25 p-3 flex flex-col sm:flex-row gap-3" },
  h("div", { className: "sm:w-40 flex-shrink-0" }, h(Ill, { name: fig })),
  h(
    "div",
    { className: "flex-1 text-sm leading-relaxed" },
    h("div", { className: "font-bold text-base" }, title),
    h("div", { className: "my-1 flex flex-wrap items-center gap-2" }, h(Code, null, Array.isArray(example) ? example.join("  ;  ") : example), h(Try, { expr: example, onTry })),
    children
  )
);
// ---------- Temes de l'ajuda ----------
const TOPICS = [
  {
    id: "inici",
    icon: "fa-rocket",
    title: "Primers passos",
    keywords: "començar afegir editor targeta inici",
    render: ({ onTry }) => h(
      React.Fragment,
      null,
      h(P, { className: "mb-4" }, "La graficadora dibuixa funcions, equacions, inequacions i sistemes, i n'explica les característiques: talls, vèrtex, extrems, creixement, asímptotes... Comença així:"),
      h(Steps, { items: [
        ["Prem «+ Afegir».", "S'obre l'editor."],
        ["Escriu l'expressió", "amb el teclat de l'ordinador o amb el de l'editor. A sota veuràs si s'ha entès (✓ verd) o què cal corregir (en vermell), i una previsualització ben escrita."],
        ["Prem «Afegeix a la gràfica» o Retorn.", "La vista s'ajusta sola perquè se'n vegin els punts importants."],
        ["Explora-la.", h(React.Fragment, null, "Passa el ratolí (o el dit) per sobre de la corba per llegir-ne coordenades i obre ", h(Icon, { name: "fa-circle-info text-blue-500" }), " a la seva targeta per veure'n l'estudi complet.")]
      ] }),
      h(H3, null, "Prova-ho ara"),
      h(
        "div",
        { className: "flex flex-wrap gap-2" },
        h(Try, { expr: "y = x^2 - 2x - 3", onTry, label: "Una paràbola" }),
        h(Try, { expr: "x^2 - 5x + 6 = 0", onTry, label: "Una equació" }),
        h(Try, { expr: ["2x + 3y = 7", "x - y = 1"], onTry, label: "Un sistema" }),
        h(Try, { expr: "y = a(x - h)^2 + k", onTry, label: "Amb paràmetres" })
      ),
      h(H3, null, "Les parts de la pantalla"),
      h(Table, { head: ["Zona", "Què hi trobes"], rows: [
        ["Capçalera", h(React.Fragment, null, h(Icon, { name: "fa-bars" }), " panell lateral · «+ Afegir» · ", h(Icon, { name: "fa-floppy-disk" }), " desa la imatge · ", h(Icon, { name: "fa-sliders" }), " vista · ", h(Icon, { name: "fa-sun" }), " tema · ", h(Icon, { name: "fa-circle-info" }), " aquesta ajuda")],
        ["Gràfica", h(React.Fragment, null, "Es mou arrossegant. A la cantonada: ", h(Icon, { name: "fa-plus" }), " ", h(Icon, { name: "fa-minus" }), " zoom, ", h(Icon, { name: "fa-expand" }), " ajusta la vista, ", h(Icon, { name: "fa-house" }), " vista inicial.")],
        ["Panell lateral", "Paràmetres (si n'hi ha) i una targeta per a cada funció, equació o sistema."]
      ] }),
      h(Tip, { icon: "fa-floppy-disk", color: "text-blue-500" }, "Tot es desa automàticament en aquest navegador: funcions, paràmetres i opcions de vista. Quan hi tornis, ho trobaràs tal com ho vas deixar.")
    )
  },
  {
    id: "escriure",
    icon: "fa-keyboard",
    title: "Com s'escriu",
    keywords: "notació sintaxi potència arrel fracció valor absolut sinus cosinus logaritme exponencial pi coma decimal teclat parèntesis",
    render: () => h(
      React.Fragment,
      null,
      h(P, { className: "mb-3" }, "Pots escriure com ho faries a mà. L'editor entén aquestes formes:"),
      h(Table, { head: ["Què", "S'escriu", "Exemple"], rows: [
        ["Potència", h(React.Fragment, null, h(Code, null, "^"), " o ", h(Code, null, "²"), " ", h(Code, null, "³")), h(Code, null, "x^2   2^x   x^(1/3)")],
        ["Producte", "Sense signe, o amb · o *", h(Code, null, "2x   3(x+1)   2·x")],
        ["Fracció", h(React.Fragment, null, h(Code, null, "/"), " amb parèntesis"), h(Code, null, "(x+1)/(x−2)")],
        ["Arrels", h(React.Fragment, null, h(Code, null, "sqrt"), ", ", h(Code, null, "√"), ", ", h(Code, null, "∛"), ", ", h(Code, null, "cbrt")), h(Code, null, "√(x+4)   ∛(x)")],
        ["Valor absolut", h(React.Fragment, null, h(Code, null, "| |"), " o ", h(Code, null, "abs")), h(Code, null, "|x − 2|")],
        ["Trigonometria", h(React.Fragment, null, h(Code, null, "sin"), " (o sen), ", h(Code, null, "cos"), ", ", h(Code, null, "tan"), " (o tg), ", h(Code, null, "arcsin"), "..."), h(Code, null, "2sin(x)")],
        ["Logaritmes", h(React.Fragment, null, h(Code, null, "ln"), " (neperià), ", h(Code, null, "log"), " (base 10)"), h(Code, null, "log(x, 2)")],
        ["Exponencial", h(React.Fragment, null, h(Code, null, "e^"), " o ", h(Code, null, "exp")), h(Code, null, "e^(−x)")],
        ["Constants", h(React.Fragment, null, h(Code, null, "π"), " (o pi) i ", h(Code, null, "e")), h(Code, null, "y = πx")],
        ["Decimals", "Amb coma o amb punt", h(Code, null, "2,5x   2.5x")],
        ["Desigualtats", h(React.Fragment, null, h(Code, null, "<  >  ≤  ≥"), " (o <=, >=)"), h(Code, null, "y ≥ x² − 1")],
        ["Nom de funció", h(React.Fragment, null, h(Code, null, "f(x) ="), ", ", h(Code, null, "g(x) ="), "..."), h(Code, null, "f(x) = 3x − 1")],
        ["Domini restringit", "Després d'una coma o d'un punt i coma", h(Code, null, "y = x², −2 < x < 2")],
        ["Arrodoniments", h(React.Fragment, null, h(Code, null, "floor"), ", ", h(Code, null, "ceil"), ", ", h(Code, null, "round")), h(Code, null, "y = floor(x)")]
      ] }),
      h(Tip, { icon: "fa-triangle-exclamation", color: "text-orange-500" }, "Compte amb els parèntesis: ", h(Code, null, "1/x − 2"), " no és el mateix que ", h(Code, null, "1/(x − 2)"), ", ni ", h(Code, null, "sin x^2"), " és el mateix que ", h(Code, null, "(sin x)^2"), ". Mira la previsualització per comprovar que s'ha entès el que volies."),
      h(Tip, null, "Les funcions trigonomètriques treballen en ", h("strong", null, "radiants"), ": ", h(Code, null, "sin(π/2) = 1"), "."),
      h(H3, null, "El teclat de l'editor"),
      h(Table, { head: ["Color", "Tecles"], rows: [
        [h("span", { className: "text-green-600" }, "Verd"), "Variables i constants: x, y, π"],
        [h("span", { className: "text-violet-500" }, "Lila"), "Plantilles: x², xⁿ, √, fracció, |□|, eˣ. Si tens text seleccionat, el fiquen a dins."],
        [h("span", { className: "text-amber-500" }, "Groc"), "Relacions: =, <, >, ≤, ≥"],
        [h("span", { className: "text-sky-500" }, "Blau"), "Operacions i parèntesis"],
        [h("span", { className: "text-rose-500" }, "Rosa"), "Mou el cursor (← →), esborra i buida el camp"]
      ] }),
      h(P, { className: "text-sm mt-2" }, "El botó «Més funcions» desplega sin, cos, tan, ln, log, ∛, e i x⁻¹. Les tecles de funció ja escriuen el parèntesi i deixen el cursor a dins.")
    )
  },
  {
    id: "tipus",
    icon: "fa-shapes",
    title: "Què pots representar",
    keywords: "funció equació inequació regió recta circumferència corba interval sistema",
    render: ({ onTry }) => h(
      "div",
      { className: "space-y-3" },
      h(KindCard, { fig: "funcio", title: "Funció", example: "y = x^2/2 - 1,5", onTry }, "Dibuixa la gràfica i en fa l'estudi complet: domini, talls, vèrtex, extrems, creixement, signe i asímptotes."),
      h(KindCard, { fig: "equacio", title: "Equació amb una incògnita", example: "x^2 - 5x + 6 = 0", onTry }, "Marca les solucions sobre l'eix X. Es dibuixa, discontínua, la corba auxiliar y = (1r membre − 2n membre): les solucions són on talla l'eix."),
      h(KindCard, { fig: "inequacio1", title: "Inequació amb una incògnita", example: "2x - 2 > 0", onTry }, "Pinta l'interval solució sobre l'eix X. Un punt buit vol dir que l'extrem no hi entra (< o >); un punt ple, que sí (≤ o ≥)."),
      h(KindCard, { fig: "regio", title: "Inequació amb dues incògnites", example: "y > x/2 - 0,5", onTry }, "Pinta la regió del pla que la compleix. Si la vora no hi entra (< o >), es dibuixa discontínua."),
      h(KindCard, { fig: "circumferencia", title: "Corbes i rectes en forma general", example: "x^2 + y^2 = 9", onTry }, "Circumferències (n'indica el centre i el radi), el·lipses, rectes com 2x + 3y = 7 sense haver d'aïllar la y, o corbes x = g(y)."),
      h(KindCard, { fig: "interval", title: "Interval", example: "-1 < x < 1,5", onTry }, "Pinta la franja vertical corresponent. Útil per assenyalar una zona de la gràfica."),
      h(KindCard, { fig: "sistema", title: "Sistema d'equacions", example: ["2x + 3y = 7", "x - y = 1"], onTry }, "Cada equació amb el seu color i el punt solució marcat. Vegeu el tema «Sistemes».")
    )
  },
  {
    id: "grafica",
    icon: "fa-up-down-left-right",
    title: "La gràfica",
    keywords: "moure zoom arrossegar pessigar coordenades punter traçar ajustar vista quadrícula escala eix y descarregar imatge tema pissarra",
    render: () => h(
      React.Fragment,
      null,
      h(Table, { head: ["Per...", "Amb ratolí", "En pantalla tàctil"], rows: [
        ["Desplaçar-te", "Arrossega", "Arrossega amb un dit (lluny de les corbes)"],
        ["Apropar o allunyar", h(React.Fragment, null, "Roda del ratolí o ", h(Icon, { name: "fa-plus" }), " ", h(Icon, { name: "fa-minus" })), "Pessiga amb dos dits"],
        ["Llegir coordenades", "Passa el punter per sobre de la corba", "Toca la corba i llisca-hi el dit"],
        ["Veure-ho tot", h(React.Fragment, null, h(Icon, { name: "fa-expand" }), " ajusta la vista a les funcions"), "Igual"],
        ["Tornar a començar", h(React.Fragment, null, h(Icon, { name: "fa-house" }), " vista inicial (i escala ×1)"), "Igual"]
      ] }),
      h(H3, null, "Seguir la corba"),
      h(
        "div",
        { className: "flex flex-col sm:flex-row gap-4 items-start" },
        h("div", { className: "sm:w-44 flex-shrink-0" }, h(Ill, { name: "tracador" })),
        h(
          "div",
          { className: "text-sm leading-relaxed space-y-2" },
          h("p", null, "El punter s'enganxa a la corba més propera i mostra el punt ", h(Code, null, "(x; y)"), " amb el color de la funció."),
          h("p", null, "Avança per valors rodons de x segons el zoom (de 0,1 en 0,1 amb el zoom normal; de 0,5 en 0,5 o d'1 en 1 si t'allunyes), i la y es calcula exactament en aquell valor. Així és fàcil aturar-se a x = 4 i llegir-ne el valor exacte."),
          h("p", null, "Prop d'un punt destacat (arrels, vèrtex, tall de sistemes...) el punter s'hi enganxa i en mostra l'etiqueta.")
        )
      ),
      h(H3, null, h(React.Fragment, null, "El menú de vista ", h(Icon, { name: "fa-sliders text-base opacity-70" }))),
      h("ul", { className: "list-disc pl-5 text-sm space-y-1 leading-relaxed" },
        h("li", null, h("strong", null, "Quadrícula, nombres dels eixos i etiquetes dels punts:"), " amaga el que no calgui per tenir una gràfica neta (per exemple, per demanar a l'alumnat que llegeixi les coordenades)."),
        h("li", null, h("strong", null, "Escala de l'eix Y:"), " estira o encongeix només l'eix vertical. Amb ×0,1 caben funcions que creixen molt (y = 50x, y = 2ˣ); amb ×10 es veuen bé variacions petites. Quan l'escala no és ×1, apareix un avís a dalt a l'esquerra de la gràfica.")
      ),
      h(Tip, null, "En afegir o editar una funció, la vista s'ajusta sola, i si cal també tria una escala de l'eix Y adequada. Si et perds, prem ", h(Icon, { name: "fa-expand" }), "."),
      h(H3, null, "Imatge i aspecte"),
      h("ul", { className: "list-disc pl-5 text-sm space-y-1 leading-relaxed" },
        h("li", null, h(Icon, { name: "fa-floppy-disk" }), " descarrega la gràfica en PNG a alta resolució (tres o quatre vegades la de la pantalla), amb la llegenda de les expressions. Queda nítida en un document, una presentació, el Classroom o imprès."),
        h("li", null, h(Icon, { name: "fa-sun" }), " canvia el tema: clar, fosc, pissarra i alt contrast (el més llegible amb un projector).")
      )
    )
  },
  {
    id: "estudi",
    icon: "fa-magnifying-glass-chart",
    title: "Estudi de la funció",
    keywords: "informació domini talls arrels vèrtex eix simetria màxim mínim extrems creixement decreixement monotonia signe positiva negativa asímptota forat discontinuïtat periòdica mostra",
    render: () => h(
      React.Fragment,
      null,
      h(P, { className: "mb-3" }, "Prem ", h(Icon, { name: "fa-circle-info text-blue-500" }), " a la targeta d'una funció per obrir-ne l'estudi. Les dades s'actualitzen soles quan mous un paràmetre."),
      h(Tip, { icon: "fa-location-dot", color: "text-blue-500" }, "Al costat de molts apartats hi ha el botó ", h("span", { className: "font-semibold" }, "«Mostra»"), ": destaca aquell element a la gràfica (eix de simetria, talls, extrems o asímptotes). El vèrtex de les paràboles i el pendent de les rectes ja surten marcats; si no els vols, prem «A la gràfica» per amagar-los."),
      h(Fold, { title: "Domini", icon: "fa-arrows-left-right" }, "Valors de x per als quals la funció existeix. Per exemple, ", h(Code, null, "y = 1/(x − 2)"), " té domini ℝ − {2} i ", h(Code, null, "y = √x"), ", [0, +∞). Si has restringit el domini, s'hi indica."),
      h(Fold, { title: "Talls amb els eixos", icon: "fa-crosshairs" }, h("div", { className: "flex flex-col sm:flex-row gap-3" }, h("div", { className: "sm:w-40 flex-shrink-0" }, h(Ill, { name: "funcio" })), h("div", null, "El tall amb l'eix Y és f(0). Els talls amb l'eix X (arrels) són les solucions de f(x) = 0. Els valors exactes es mostren com a fraccions o múltiples de π; els aproximats, amb ≈."))),
      h(Fold, { title: "Vèrtex i eix de simetria", icon: "fa-v" }, "En les paràboles. El vèrtex és el punt més baix (o més alt) i l'eix de simetria és la recta vertical que hi passa. El vèrtex es marca a la gràfica automàticament (V) i també apareix a la targeta. Se'n mostren, a més, el discriminant i el tipus d'arrels."),
      h(Fold, { title: "Pendent de les rectes", icon: "fa-stairs" }, "En les funcions lineals i afins (y = mx + n) s'indica el pendent m i l'ordenada a l'origen n. A la gràfica es dibuixa automàticament el triangle del pendent: quant puja (o baixa) la recta quan avança cap a la dreta. El pendent també apareix a la targeta."),
      h(Fold, { title: "Màxims i mínims relatius", icon: "fa-mountain" }, h("div", { className: "flex flex-col sm:flex-row gap-3" }, h("div", { className: "sm:w-40 flex-shrink-0" }, h(Ill, { name: "extrems" })), h("div", null, "Punts on la funció passa de créixer a decréixer (màxim) o al revés (mínim). Amb «Mostra» apareixen marcats com a «Màx» i «Mín»."))),
      h(Fold, { title: "Creixement", icon: "fa-arrow-trend-up" }, h("div", { className: "flex flex-col sm:flex-row gap-3" }, h("div", { className: "sm:w-40 flex-shrink-0" }, h(Ill, { name: "creixement" })), h("div", null, "Intervals on la funció creix i on decreix, escrits en notació d'intervals: ", h(Code, null, "(−∞, −1) ∪ (1, +∞)"), "."))),
      h(Fold, { title: "Signe", icon: "fa-plus-minus" }, h("div", { className: "flex flex-col sm:flex-row gap-3" }, h("div", { className: "sm:w-40 flex-shrink-0" }, h(Ill, { name: "signe" })), h("div", null, "Intervals on f(x) > 0 (la gràfica és per sobre de l'eix X) i on f(x) < 0 (per sota). És la base per resoldre inequacions."))),
      h(Fold, { title: "Asímptotes", icon: "fa-grip-lines-vertical" }, h("div", { className: "flex flex-col sm:flex-row gap-3" }, h("div", { className: "sm:w-40 flex-shrink-0" }, h(Ill, { name: "asimptota" })), h("div", null, "Rectes a les quals la gràfica s'acosta indefinidament. Les verticals (x = a) apareixen on la funció «s'escapa» a l'infinit; les horitzontals (y = b), quan x → +∞ o x → −∞."))),
      h(Fold, { title: "Discontinuïtat evitable (forat)", icon: "fa-circle-dot" }, h("div", { className: "flex flex-col sm:flex-row gap-3" }, h("div", { className: "sm:w-40 flex-shrink-0" }, h(Ill, { name: "forat" })), h("div", null, "En ", h(Code, null, "y = (x² − 4)/(x − 2)"), " la funció no existeix a x = 2, però a prop s'acosta a 4. La gràfica hi mostra un punt buit a (2, 4)."))),
      h(Fold, { title: "Arrels periòdiques", icon: "fa-wave-square" }, h("div", { className: "flex flex-col sm:flex-row gap-3" }, h("div", { className: "sm:w-40 flex-shrink-0" }, h(Ill, { name: "periodiques" })), h("div", null, "Les funcions trigonomètriques tenen infinites arrels. Se'n mostren unes quantes properes a 0 (… −π, 0, π, 2π …) i la forma general, per exemple ", h(Code, null, "x = kπ (k ∈ ℤ)"), "."))),
      h(Fold, { title: "Explicacions", icon: "fa-lightbulb" }, "Quan una equació no té solució, té infinites solucions o una funció no talla l'eix X, una línia amb una bombeta ", h(Icon, { name: "fa-lightbulb text-amber-400" }), " n'explica el motiu (per exemple, que el discriminant és negatiu)."),
      h(Tip, { icon: "fa-circle-exclamation", color: "text-slate-400" }, "L'estudi és numèric: les arrels i els extrems es busquen entre x = −100 i x = 100. Fora d'aquest interval, o en funcions molt estranyes, pot no trobar-los tots.")
    )
  },
  {
    id: "parametres",
    icon: "fa-sliders",
    title: "Paràmetres i animació",
    keywords: "paràmetre lliscador slider animar animació play a b c k m n família",
    render: ({ onTry }) => h(
      React.Fragment,
      null,
      h(
        "div",
        { className: "flex flex-col sm:flex-row gap-4 items-start mb-3" },
        h("div", { className: "sm:w-44 flex-shrink-0" }, h(Ill, { name: "parametres" })),
        h(
          "div",
          { className: "text-sm leading-relaxed space-y-2" },
          h("p", null, "Si escrius una lletra que no és x ni y, es converteix en un ", h("strong", null, "paràmetre"), " i a dalt del panell lateral apareix un lliscador per canviar-ne el valor. La gràfica i l'estudi s'actualitzen a l'instant."),
          h("p", null, "Lletres disponibles: ", h(Code, null, "a b c d h k m n p q r s t u v w"), ". Si dues funcions fan servir la mateixa lletra, comparteixen lliscador.")
        )
      ),
      h(Table, { head: ["Control", "Què fa"], rows: [
        ["Lliscador", "Canvia el valor del paràmetre."],
        [h(Icon, { name: "fa-play" }), "Anima el paràmetre: va i ve sol entre el mínim i el màxim. Prem-lo de nou per aturar-lo."],
        [h(Icon, { name: "fa-gear" }), "Tria el mínim, el màxim i el pas (per defecte, de −5 a 5 de 0,1 en 0,1)."]
      ] }),
      h(H3, null, "Exemples per explorar"),
      h(
        "div",
        { className: "grid sm:grid-cols-2 gap-2 text-sm" },
        [
          ["y = m x + n", "Pendent i ordenada a l'origen"],
          ["y = a(x - h)^2 + k", "Forma canònica de la paràbola"],
          ["y = a x^2 + b x + c", "Coeficients i discriminant"],
          ["y = a sin(b x)", "Amplitud i període"],
          ["y = a^x", "Exponencials creixents i decreixents"],
          ["(x - a)^2 + (y - b)^2 = r^2", "Circumferència de centre (a, b)"]
        ].map(([expr, desc]) => h("div", { key: expr, className: "rounded-lg border border-slate-500/25 p-2 flex items-center justify-between gap-2" }, h("div", null, h(Code, null, expr), h("div", { className: "text-xs opacity-75 mt-1" }, desc)), h(Try, { expr, onTry })))
      )
    )
  },
  {
    id: "sistemes",
    icon: "fa-layer-group",
    title: "Sistemes",
    keywords: "sistema equacions dues incògnites punt tall compatible incompatible indeterminat",
    render: ({ onTry }) => h(
      React.Fragment,
      null,
      h(
        "div",
        { className: "flex flex-col sm:flex-row gap-4 items-start" },
        h("div", { className: "sm:w-44 flex-shrink-0" }, h(Ill, { name: "sistema" })),
        h(Steps, { items: [
          ["Obre l'editor", "amb «+ Afegir» i tria la pestanya «Sistema»."],
          ["Escriu una equació a cada línia.", "Amb «Afegeix una equació» en pots posar més de dues."],
          ["Desa-ho.", "Cada equació es dibuixa d'un color i les solucions apareixen com a punts, també a la targeta."]
        ] })
      ),
      h(Tip, null, "Els sistemes lineals es resolen de manera exacta i se'n diu el tipus: ", h("strong", null, "compatible determinat"), " (un punt), ", h("strong", null, "incompatible"), " (rectes paral·leles, sense solució) o ", h("strong", null, "compatible indeterminat"), " (la mateixa recta, infinites solucions). Els no lineals (paràboles, circumferències...) es resolen numèricament."),
      h(
        "div",
        { className: "flex flex-wrap gap-2" },
        h(Try, { expr: ["2x + 3y = 7", "x - y = 1"], onTry, label: "Lineal" }),
        h(Try, { expr: ["y = 2x + 1", "y = 2x - 3"], onTry, label: "Incompatible" }),
        h(Try, { expr: ["y = x^2", "y = x + 2"], onTry, label: "Paràbola i recta" }),
        h(Try, { expr: ["x^2 + y^2 = 25", "y = x + 1"], onTry, label: "Circumferència i recta" })
      ),
      h(P, { className: "text-sm mt-3" }, "Per canviar el color d'una equació concreta, prem el seu punt de color a la targeta.")
    )
  },
  {
    id: "targetes",
    icon: "fa-list-check",
    title: "Gestionar les funcions",
    keywords: "panell lateral targeta ull amagar editar eliminar color",
    render: () => h(
      Table,
      { head: ["Icona", "Què fa"], rows: [
        [h(Icon, { name: "fa-eye text-green-500" }), "Mostra o amaga la funció sense esborrar-la. Útil per presentar les funcions d'una en una."],
        [h(Icon, { name: "fa-circle-info text-blue-500" }), "Obre o tanca l'estudi de la funció."],
        [h("span", { className: "inline-block w-3.5 h-3.5 rounded-full bg-blue-500 align-middle" }), "Canvia el color (en un sistema, el de cada equació)."],
        [h(Icon, { name: "fa-pencil" }), "Edita l'expressió."],
        [h(Icon, { name: "fa-trash text-red-500" }), "Esborra-la."],
        [h(Icon, { name: "fa-bars" }), "A la capçalera, obre o tanca el panell lateral (en mòbil, també amb ×)."]
      ] }
    )
  },
  {
    id: "aula",
    icon: "fa-chalkboard-user",
    title: "Idees per a l'aula",
    keywords: "professorat docent activitat classe projector alumnat idees",
    render: () => h(
      React.Fragment,
      null,
      h(P, { className: "mb-3 text-sm" }, "Algunes maneres de treure'n profit a classe:"),
      h(Fold, { title: "Predir abans de veure", icon: "fa-eye-slash", open: true }, "Escriu la funció i amaga-la amb l'ull. Demana a l'alumnat que en predigui la forma, els talls o el vèrtex, i després mostra-la i obre l'estudi per comprovar-ho."),
      h(Fold, { title: "Què fa cada paràmetre?", icon: "fa-sliders" }, "Escriu ", h(Code, null, "y = a(x − h)^2 + k"), " i anima un paràmetre cada vegada. L'alumnat descriu què canvia (obertura, desplaçament horitzontal o vertical) i ho formula com a regla."),
      h(Fold, { title: "Lectura de gràfiques", icon: "fa-table-cells" }, "Amaga els nombres dels eixos o les etiquetes dels punts (menú de vista) i demana que estimin coordenades, extrems o intervals de creixement. Després ho comproveu amb el punter."),
      h(Fold, { title: "Resolució gràfica d'equacions i sistemes", icon: "fa-equals" }, "Compara la solució algebraica amb la gràfica: una equació de segon grau amb Δ < 0 no talla l'eix X; un sistema incompatible són rectes paral·leles."),
      h(Fold, { title: "Inequacions i signe", icon: "fa-greater-than-equal" }, "Escriu x² − 4 ≥ 0 i y = x² − 4 alhora: l'interval solució coincideix amb la part on la paràbola és per sobre de l'eix X."),
      h(Fold, { title: "Modelització", icon: "fa-chart-line" }, "Planteja una situació real (tarifa de telèfon, població que creix, preu amb descompte), deixa que l'alumnat proposi el model amb paràmetres i l'ajusti amb els lliscadors."),
      h(Tip, { icon: "fa-image", color: "text-blue-500" }, "Per a fitxes i presentacions: tema clar o d'alt contrast, quadrícula activada i ", h(Icon, { name: "fa-floppy-disk" }), " per descarregar la imatge.")
    )
  },
  {
    id: "faq",
    icon: "fa-circle-question",
    title: "Problemes freqüents",
    keywords: "error no dibuixa no surt problema dubte coma precisió aproximat actualitzar memòria cau desar",
    render: () => h(
      React.Fragment,
      null,
      h(Fold, { title: "L'editor diu que hi ha un error", icon: "fa-circle-exclamation", open: true }, "Llegeix el missatge en vermell: indica què falta (un parèntesi, un exponent...) o quina lletra no reconeix. Revisa sobretot els parèntesis de fraccions i funcions."),
      h(Fold, { title: "No veig la gràfica", icon: "fa-eye-slash" }, "Comprova que l'ull de la targeta estigui actiu i prem ", h(Icon, { name: "fa-expand" }), " per ajustar la vista. Si la funció creix molt, prova una escala de l'eix Y més petita al menú de vista. Si hi ha un domini restringit, només es dibuixa en aquell tros."),
      h(Fold, { title: "Per què uns valors porten ≈?", icon: "fa-wave-square" }, "Perquè són aproximats (per exemple, √2 ≈ 1,41). Els exactes es mostren com a enters, fraccions o múltiples de π."),
      h(Fold, { title: "Com escric 2,5 si la coma separa el domini?", icon: "fa-keyboard" }, "Una coma entre dues xifres és sempre decimal (", h(Code, null, "2,5x"), "). La coma que separa el domini ha d'anar seguida d'un espai o d'una expressió: ", h(Code, null, "y = x², −2 < x < 2"), ". Si vols, separa'l amb punt i coma."),
      h(Fold, { title: "Una lletra s'ha convertit en un lliscador", icon: "fa-sliders" }, "Les lletres diferents de x i y es tracten com a paràmetres. Si volies multiplicar, escriu el número: ", h(Code, null, "2x"), " en lloc de ", h(Code, null, "ax"), "."),
      h(Fold, { title: "No surten les novetats de l'aplicació", icon: "fa-rotate" }, "El navegador pot tenir guardada una versió antiga. Recarrega la pàgina amb ", h(Code, null, "Ctrl + F5"), " (o ", h(Code, null, "Cmd + Maj + R"), " a Mac)."),
      h(Fold, { title: "On es desen les meves funcions?", icon: "fa-database" }, "Només en aquest navegador i en aquest dispositiu. Si n'esborres les dades o canvies d'ordinador, no hi seran. Per conservar una gràfica, descarrega-la en imatge.")
    )
  }
];
const normalize = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
// Converteix un exemple de l'ajuda en una funció a punt per afegir a la gràfica
const buildExample = (expr) => {
  if (Array.isArray(expr)) return { expressions: expr, type: "system" };
  const { expr: text, domain } = splitInlineDomain(expr);
  const prep = prepareExpression(text);
  if (!prep.ok) return null;
  const type = prep.kind === "interval" ? "interval" : prep.relation !== "=" ? "inequality" : "equation";
  return { expressions: [text], type, domainRestriction: domain && prep.kind === "explicitY" ? domain : void 0 };
};
const InfoModal = ({ isOpen, onClose, theme, onAddExample }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(() => {
    try {
      return localStorage.getItem(TAB_KEY) || "inici";
    } catch (e) {
      return "inici";
    }
  });
  const contentRef = React.useRef(null);
  const navRef = React.useRef(null);
  const themeClasses = THEMES[theme];
  React.useEffect(() => {
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);
  const handleClose = React.useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  }, [onClose]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);
  const select = (id) => {
    setActive(id);
    try {
      localStorage.setItem(TAB_KEY, id);
    } catch (e) {
    }
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };
  const q = normalize(query.trim());
  const visibleTopics = q ? TOPICS.filter((t) => normalize(`${t.title} ${t.keywords}`).includes(q)) : TOPICS;
  const current = visibleTopics.find((t) => t.id === active) || visibleTopics[0];
  const onTry = onAddExample ? (expr) => {
    const func = buildExample(expr);
    if (!func) return;
    onAddExample(func);
    handleClose();
  } : null;
  // La pestanya activa sempre visible (en mòbil les pestanyes es desplacen en horitzontal)
  React.useEffect(() => {
    const el = navRef.current && navRef.current.querySelector('[aria-current="page"]');
    if (el) el.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [current && current.id, isOpen]);
  if (!isOpen) return null;
  const navButton = (t) => h(
    "button",
    {
      key: t.id,
      type: "button",
      onClick: () => select(t.id),
      className: `flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg whitespace-nowrap md:whitespace-normal transition-colors ${current && current.id === t.id ? themeClasses.accentButtonClasses : themeClasses.buttonHover}`,
      "aria-current": current && current.id === t.id ? "page" : void 0
    },
    h(Icon, { name: `${t.icon} w-4 text-center` }),
    t.title
  );
  return h("div", { className: `fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-200 ${isAnimating ? "opacity-100" : "opacity-0"}`, onClick: handleClose }, h(
    "div",
    {
      className: `rounded-xl shadow-2xl w-full max-w-4xl h-[92vh] sm:h-[85vh] ${theme === "light" ? "bg-white" : themeClasses.sidePanelBg} ${themeClasses.text} border ${themeClasses.border} transition-all duration-200 ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"} flex flex-col overflow-hidden`,
      onClick: (e) => e.stopPropagation(),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Ajuda"
    },
    h(
      "div",
      { className: `px-4 py-3 border-b ${themeClasses.border} flex flex-wrap gap-3 justify-between items-center flex-shrink-0` },
      h("h2", { className: "text-xl font-bold flex items-center gap-3" }, h(Icon, { name: "fa-circle-question text-blue-500" }), "Ajuda de la graficadora"),
      h(
        "div",
        { className: "flex items-center gap-2 flex-1 sm:flex-none justify-end" },
        h(
          "label",
          { className: `flex items-center gap-2 px-3 py-1.5 rounded-full border ${themeClasses.border} ${themeClasses.buttonBg} flex-1 sm:w-64` },
          h(Icon, { name: "fa-magnifying-glass text-sm opacity-60" }),
          h("input", { type: "search", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Cerca: asímptota, paràmetre, zoom...", className: "bg-transparent outline-none text-sm w-full min-w-0", "aria-label": "Cerca a l'ajuda" })
        ),
        h("button", { onClick: handleClose, className: `w-9 h-9 rounded-full flex-shrink-0 ${themeClasses.buttonHover}`, "aria-label": "Tanca l'ajuda" }, h(Icon, { name: "fa-times" }))
      )
    ),
    h(
      "div",
      { className: "flex flex-col md:flex-row flex-1 min-h-0" },
      h(
        "nav",
        { ref: navRef, className: `flex md:flex-col gap-1 p-2 md:w-56 flex-shrink-0 overflow-x-auto md:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b md:border-b-0 md:border-r ${themeClasses.border}`, "aria-label": "Temes de l'ajuda" },
        visibleTopics.length ? visibleTopics.map(navButton) : h("p", { className: `text-sm px-3 py-2 ${themeClasses.secondaryText}` }, "Cap tema coincideix amb la cerca.")
      ),
      h(
        "div",
        { ref: contentRef, className: "flex-1 overflow-y-auto p-4 sm:p-6" },
        current && h(
          React.Fragment,
          null,
          h("h2", { className: "text-2xl font-bold mb-4 flex items-center gap-3" }, h(Icon, { name: `${current.icon} text-blue-500 text-xl` }), current.title),
          h(current.render, { onTry, key: current.id })
        )
      )
    ),
    h(
      "div",
      { className: `px-4 py-3 border-t ${themeClasses.border} flex items-center justify-between gap-3 flex-shrink-0` },
      h("span", { className: `text-xs ${themeClasses.secondaryText} hidden sm:inline` }, "Els botons «Prova-ho» afegeixen l'exemple a la gràfica."),
      h(
        "div",
        { className: "flex gap-2 ml-auto" },
        (() => {
          const i = TOPICS.findIndex((t) => current && t.id === current.id);
          const next = !q && i >= 0 && i < TOPICS.length - 1 ? TOPICS[i + 1] : null;
          return next ? h("button", { onClick: () => select(next.id), className: `px-4 py-2 rounded-lg font-semibold border ${themeClasses.border} ${themeClasses.buttonHover}` }, `${next.title} `, h(Icon, { name: "fa-arrow-right text-sm" })) : null;
        })(),
        h("button", { onClick: handleClose, className: `px-5 py-2 rounded-lg font-semibold transition-colors ${themeClasses.accentButtonClasses}` }, "Entesos!")
      )
    )
  ));
};
export {
  InfoModal
};
