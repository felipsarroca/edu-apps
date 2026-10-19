import { MathSyntaxError, compile, getParameters, paramSignature, parseRelation, polyCoef, polyDegree, relationToTex, toPolynomial, toTex, usesVar } from "./parser.js";

const SEARCH_RANGE = 100;
const SEARCH_STEPS = 2e4;
const FLIP = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=" };

// ---------- Format de nombres ----------
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
function snapNumber(v) {
  if (!Number.isFinite(v)) return v;
  const r = Math.round(v);
  if (Math.abs(v - r) < 1e-7) return r === 0 ? 0 : r;
  for (let q = 2; q <= 12; q++) {
    const p = Math.round(v * q);
    if (Math.abs(v - p / q) < 1e-9) return p / q;
  }
  return v;
}
// Arrodoniment més tolerant per a valors obtinguts per minimització (màxims i mínims)
function snapLoose(v) {
  for (let q = 1; q <= 12; q++) {
    const p = Math.round(v * q);
    if (Math.abs(v - p / q) < 1e-6) return p / q;
  }
  // Múltiples de π (extrems de funcions trigonomètriques)
  for (let q = 1; q <= 12; q++) {
    const p = Math.round(v / Math.PI * q);
    if (p !== 0 && Math.abs(p) <= 48 && Math.abs(v - p * Math.PI / q) < 1e-6) return p * Math.PI / q;
  }
  return v;
}
function toFraction(v) {
  for (let q = 1; q <= 12; q++) {
    const p = Math.round(v * q);
    if (Math.abs(v - p / q) < 1e-9) {
      const g = gcd(p, q) || 1;
      return { p: p / g, q: q / g };
    }
  }
  return null;
}
function formatNumber(v, decimals = 2) {
  if (typeof v !== "number") return String(v);
  if (!Number.isFinite(v)) return v > 0 ? "+∞" : v < 0 ? "−∞" : "—";
  const frac = toFraction(v);
  if (frac) {
    const sign = frac.p < 0 ? "−" : "";
    return frac.q === 1 ? `${sign}${Math.abs(frac.p)}` : `${sign}${Math.abs(frac.p)}/${frac.q}`;
  }
  const piText = formatPiMultiple(v);
  if (piText) return piText;
  const s = Number(v.toFixed(decimals)).toString().replace(".", ",").replace("-", "−");
  return `${s}`;
}
// Múltiples racionals de π: π/2, 2π, −3π/4...
function piFraction(v) {
  if (v === 0 || !Number.isFinite(v)) return null;
  const f = toFraction(v / Math.PI);
  return f && Math.abs(f.p) <= 48 ? f : null;
}
function formatPiMultiple(v) {
  const f = piFraction(v);
  if (!f) return null;
  const sign = f.p < 0 ? "−" : "";
  const num = Math.abs(f.p) === 1 ? "π" : `${Math.abs(f.p)}π`;
  return f.q === 1 ? `${sign}${num}` : `${sign}${num}/${f.q}`;
}
const isApprox = (v) => typeof v === "number" && Number.isFinite(v) && !toFraction(v) && !piFraction(v);
function formatApprox(v, decimals = 2) {
  return (isApprox(v) ? "≈ " : "") + formatNumber(v, decimals);
}
function formatPoint(p, decimals = 2) {
  const sep = isApprox(p.x) || isApprox(p.y) ? "; " : ", ";
  return `(${formatNumber(p.x, decimals)}${sep}${formatNumber(p.y, decimals)})`;
}

// ---------- Cerca numèrica de zeros ----------
function bisect(h, a, b, fa) {
  for (let k = 0; k < 200 && b - a > 1e-14 * (1 + Math.abs(a)); k++) {
    const m = (a + b) / 2;
    const fm = h(m);
    if (!Number.isFinite(fm)) return NaN;
    if (fm === 0) return m;
    if (fa * fm < 0) b = m;
    else {
      a = m;
      fa = fm;
    }
  }
  return (a + b) / 2;
}
function goldenMinAbs(h, a, b) {
  const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a);
  let d = a + g * (b - a);
  for (let k = 0; k < 120; k++) {
    if (Math.abs(h(c)) < Math.abs(h(d))) b = d;
    else a = c;
    c = b - g * (b - a);
    d = a + g * (b - a);
  }
  return (a + b) / 2;
}
function pushUnique(list, v, tol = 1e-6) {
  if (list.every((r) => Math.abs(r - v) > tol)) list.push(v);
}
function polish(h, r) {
  const s = snapNumber(r);
  if (s !== r && Math.abs(h(s)) <= Math.abs(h(r)) + 1e-12) return s;
  return r;
}
// Zeros d'una funció d'una variable a [-range, range] (inclou arrels dobles)
function findRoots(h, range = SEARCH_RANGE, steps = SEARCH_STEPS, breaks = null) {
  const xs = new Float64Array(steps + 1);
  const vs = new Float64Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    xs[i] = -range + 2 * range * i / steps;
    let v;
    try {
      v = h(xs[i]);
    } catch (e) {
      v = NaN;
    }
    vs[i] = typeof v === "number" ? v : NaN;
  }
  let zeros = 0;
  for (let i = 0; i <= steps; i++) if (vs[i] === 0) zeros++;
  if (zeros > steps / 4) {
    const all = [];
    all.identicallyZero = true;
    return all;
  }
  const roots = [];
  const scale = 1e-7;
  for (let i = 0; i <= steps; i++) {
    const v = vs[i];
    if (!Number.isFinite(v)) continue;
    if (v === 0) {
      pushUnique(roots, xs[i]);
      continue;
    }
    if (i > 0 && Number.isFinite(vs[i - 1]) && vs[i - 1] !== 0 && vs[i - 1] * v < 0) {
      const r = bisect(h, xs[i - 1], xs[i], vs[i - 1]);
      const hr = h(r);
      // Descarta salts (asímptotes): el valor a l'arrel ha de ser petit
      if (Number.isFinite(hr) && Math.abs(hr) < 1e-6 * (1 + Math.abs(vs[i - 1]) + Math.abs(v))) pushUnique(roots, polish(h, r));
      else if (breaks && Number.isFinite(r)) pushUnique(breaks, snapNumber(r));
      continue;
    }
    // Arrels dobles: mínim local de |h| molt a prop de 0
    if (i > 0 && i < steps && Number.isFinite(vs[i - 1]) && Number.isFinite(vs[i + 1]) && Math.abs(v) <= Math.abs(vs[i - 1]) && Math.abs(v) <= Math.abs(vs[i + 1]) && Math.abs(v) < 1e-2 && vs[i - 1] * v > 0 && vs[i + 1] * v > 0) {
      const m = goldenMinAbs(h, xs[i - 1], xs[i + 1]);
      const hm = h(m);
      if (Number.isFinite(hm) && Math.abs(hm) < scale * 1e-2) pushUnique(roots, polish(h, m));
    }
  }
  return roots.sort((a, b) => a - b);
}

// ---------- Equació de segon grau: forma exacta ----------
function simplifySqrt(n) {
  let k = 1;
  let m = n;
  for (let d = 2; d * d <= m; d++) {
    while (m % (d * d) === 0) {
      m /= d * d;
      k *= d;
    }
  }
  return { k, m };
}
function quadraticDetails(a, b, c) {
  const delta = b * b - 4 * a * c;
  const details = { a, b, c, delta: snapNumber(delta) };
  if (Math.abs(delta) < 1e-12) {
    details.roots = [snapNumber(-b / (2 * a))];
    details.exact = [`x = ${formatNumber(details.roots[0])}`];
    return details;
  }
  if (delta < 0) {
    details.roots = [];
    return details;
  }
  const sq = Math.sqrt(delta);
  details.roots = [snapNumber((-b - sq) / (2 * a)), snapNumber((-b + sq) / (2 * a))].sort((p, q) => p - q);
  const ints = [a, b, c].every((v) => Number.isInteger(v));
  if (ints && Number.isInteger(delta) && !Number.isInteger(Math.round(sq * 1e6) / 1e6)) {
    let { k, m } = simplifySqrt(delta);
    let num = -b;
    let den = 2 * a;
    const g = gcd(gcd(num, k), den) || 1;
    num /= g;
    k /= g;
    den /= g;
    if (den < 0) {
      num = -num;
      den = -den;
    }
    const root = `${k === 1 ? "" : k}√${m}`;
    const top = num === 0 ? `±${root}` : `${num < 0 ? "−" : ""}${Math.abs(num)} ± ${root}`;
    details.exact = [den === 1 ? `x = ${top}` : `x = (${top}) / ${den}`];
  }
  return details;
}

// ---------- Preparació d'una expressió ----------
function makeDiff(sideL, sideR) {
  const l = compile(sideL);
  const r = compile(sideR);
  return (x, y) => l(x, y) - r(x, y);
}
const SAMPLE_X = [-3.7, -1.3, 0.45, 1.9, 5.2, 8.3];
const SAMPLE_Y = [-2.1, 0.7, 3.3, 6.1];
// Comprova si D és afí respecte d'una variable: D = A·v + B. Retorna { A(x), B(x), constA }
function affineIn(D, variable) {
  const at = (u, v) => variable === "y" ? D(u, v) : D(v, u);
  let valid = 0;
  let constA = null;
  let aConstant = true;
  for (const u of SAMPLE_X) {
    const b0 = at(u, 0);
    const a1 = at(u, 1) - b0;
    if (!Number.isFinite(b0) || !Number.isFinite(a1)) continue;
    if (constA === null) constA = a1;
    else if (Math.abs(a1 - constA) > 1e-9 * (1 + Math.abs(constA))) aConstant = false;
    for (const v of SAMPLE_Y) {
      const real = at(u, v);
      if (!Number.isFinite(real)) continue;
      const lin = b0 + a1 * v;
      if (Math.abs(real - lin) > 1e-8 * (1 + Math.abs(real))) return null;
      valid++;
    }
  }
  if (valid < 3) return null;
  const A = (u) => at(u, 1) - at(u, 0);
  const B = (u) => at(u, 0);
  return { A, B, constA: aConstant ? constA : null };
}
const isBareVar = (node, name) => node.type === "var" && node.name === name || node.type === "group" && isBareVar(node.arg, name);
function polyInfo(D, sides) {
  const pl = toPolynomial(sides[0]);
  const pr = toPolynomial(sides[1]);
  if (!pl || !pr) return null;
  const p = new Map(pl);
  for (const [k, v] of pr) p.set(k, (p.get(k) || 0) - v);
  for (const [k, v] of p) if (Math.abs(v) < 1e-12) p.delete(k);
  return p;
}

// Els resultats depenen del valor dels paràmetres (a, b, c...): s'inclouen a la clau de la memòria cau
const paramNamesCache = /* @__PURE__ */ new Map();
function paramKey(text) {
  let names = paramNamesCache.get(text);
  if (!names) {
    names = getParameters(text);
    if (paramNamesCache.size > 1e3) paramNamesCache.clear();
    paramNamesCache.set(text, names);
  }
  return names.length ? paramSignature(names) : "";
}
const prepareCache = /* @__PURE__ */ new Map();
// Analitza el text i decideix com s'ha de dibuixar.
// options.inSystem: dins d'un sistema, les equacions només en x es dibuixen com a rectes verticals.
function prepareExpression(text, options = {}) {
  const key = `${options.inSystem ? "S" : "F"}|${paramKey(text)}|${text}`;
  if (prepareCache.has(key)) return prepareCache.get(key);
  const result = prepareUncached(text, options);
  if (prepareCache.size > 500) prepareCache.clear();
  prepareCache.set(key, result);
  return result;
}
function prepareUncached(text, { inSystem = false } = {}) {
  let parsed;
  try {
    parsed = parseRelation(text);
  } catch (e) {
    return { ok: false, error: e instanceof MathSyntaxError ? e.message : "Expressió no vàlida" };
  }
  let { sides, ops } = parsed;
  let tex;
  try {
    tex = relationToTex(text);
  } catch (e) {
    tex = text;
  }
  const hasX = sides.some((s) => usesVar(s, "x"));
  const hasY = sides.some((s) => usesVar(s, "y"));
  if (ops.includes("!=")) return { ok: false, error: "El signe ≠ no es pot representar" };
  if (ops.length === 0) {
    // Només una expressió: s'entén com y = expressió
    if (hasY) return { ok: false, error: "Falta el signe «=» (o <, >) a l'equació" };
    sides = [{ type: "var", name: "y" }, sides[0]];
    ops = ["="];
    tex = `y = ${toTex(sides[1])}`;
  }
  if (ops.length >= 2 && ops.includes("=")) return { ok: false, error: "Hi ha massa signes «=». Escriu una sola igualtat." };
  if (ops.length === 2) {
    // Interval compost: a < x < b
    const mid = sides[1];
    const variable = isBareVar(mid, "x") ? "x" : isBareVar(mid, "y") ? "y" : null;
    const constant = (n) => !usesVar(n, "x") && !usesVar(n, "y");
    if (!variable || !constant(sides[0]) || !constant(sides[2])) return { ok: false, error: "Escriu els intervals com a < x < b" };
    const sameDir = (op) => op.startsWith("<") ? "<" : ">";
    if (sameDir(ops[0]) !== sameDir(ops[1])) return { ok: false, error: "Els dos signes de l'interval han d'anar en el mateix sentit" };
    const v0 = compile(sides[0])(0, 0);
    const v2 = compile(sides[2])(0, 0);
    const asc = sameDir(ops[0]) === "<";
    const interval = {
      variable,
      lowerBound: asc ? v0 : v2,
      upperBound: asc ? v2 : v0,
      lowerInclusive: (asc ? ops[0] : ops[1]).includes("="),
      upperInclusive: (asc ? ops[1] : ops[0]).includes("=")
    };
    if (!(interval.lowerBound < interval.upperBound)) return { ok: false, error: "L'interval és buit: el límit inferior ha de ser menor que el superior" };
    return { ok: true, source: text, kind: "interval", interval, tex, relation: "interval" };
  }
  if (ops.length > 2) return { ok: false, error: "Massa signes de comparació" };
  const rel = ops[0];
  if (!hasX && !hasY) return { ok: false, error: "L'expressió no conté cap variable (x o y)" };
  const D = makeDiff(sides[0], sides[1]);
  const poly = polyInfo(D, sides);
  const base = { ok: true, source: text, tex, relation: rel, D, poly };

  // 1) Forma y = f(x) (o x = g(y)) escrita directament
  for (const v of ["y", "x"]) {
    for (const [vi, ei] of [[0, 1], [1, 0]]) {
      if (isBareVar(sides[vi], v) && !usesVar(sides[ei], v)) {
        const f = compile(sides[ei]);
        const fn = v === "y" ? (x) => f(x, 0) : (y) => f(0, y);
        const r = vi === 0 ? rel : FLIP[rel];
        return { ...base, kind: v === "y" ? "explicitY" : "explicitX", fn, relation: r, fnNode: sides[ei] };
      }
    }
  }
  // 2) Equacions o inequacions amb una sola incògnita x (2x - 6 = 0, x^2 - 5x + 6 = 0...)
  if (!hasY && !inSystem) {
    const h = (x) => D(x, 0);
    const kind = rel === "=" ? "equationX" : "inequalityX";
    return { ...base, kind, fn: h };
  }
  // 3) Aïllar y o x si l'expressió és afí respecte d'una d'elles (2x + 3y = 7, xy = 1...)
  for (const v of hasY ? ["y", "x"] : ["x"]) {
    const aff = affineIn(D, v);
    if (!aff) continue;
    if (aff.constA !== null && Math.abs(aff.constA) < 1e-12) continue;
    if (rel !== "=" && aff.constA === null) continue;
    let r = rel;
    if (rel !== "=" && aff.constA < 0) r = FLIP[rel];
    const fn = (u) => -aff.B(u) / aff.A(u);
    return { ...base, kind: v === "y" ? "explicitY" : "explicitX", fn, relation: r };
  }
  // 4) Cas general: corba implícita F(x, y) = 0
  return { ...base, kind: "implicit" };
}

// ---------- Domini ----------
function collectNodes(node, pred, out = []) {
  if (!node) return out;
  if (pred(node)) out.push(node);
  for (const k of ["left", "right", "arg", "base", "exp"]) if (node[k]) collectNodes(node[k], pred, out);
  return out;
}
function formatInterval(a, b, incA, incB) {
  const left = Number.isFinite(a) ? `${incA ? "[" : "("}${formatNumber(a)}` : "(−∞";
  const right = Number.isFinite(b) ? `${formatNumber(b)}${incB ? "]" : ")"}` : "+∞)";
  return `${left}, ${right}`;
}
// Domini numèric d'una funció d'una variable (intervals on és finita)
function numericDomain(f, exclusions) {
  const steps = SEARCH_STEPS;
  const range = SEARCH_RANGE;
  const ok = (x) => {
    if (exclusions.some((e) => Math.abs(e - x) < 1e-12)) return false;
    const v = f(x);
    return typeof v === "number" && Number.isFinite(v);
  };
  const edge = (a, b) => {
    // a és dins del domini i b fora (o al revés)
    const aIn = ok(a);
    for (let k = 0; k < 80; k++) {
      const m = (a + b) / 2;
      if (ok(m) === aIn) a = m;
      else b = m;
    }
    return snapNumber(aIn ? a : b);
  };
  const intervals = [];
  let start = null;
  let prevX = -range;
  let prevOk = ok(-range);
  if (prevOk) start = -Infinity;
  for (let i = 1; i <= steps; i++) {
    const x = -range + 2 * range * i / steps;
    const cur = ok(x);
    if (cur && !prevOk) start = edge(x, prevX);
    if (!cur && prevOk) intervals.push([start, edge(prevX, x)]);
    prevX = x;
    prevOk = cur;
  }
  if (prevOk) intervals.push([start, Infinity]);
  return intervals.map(([a, b]) => ({ a, b, incA: Number.isFinite(a) && ok(a), incB: Number.isFinite(b) && ok(b) })).filter((iv) => !(Number.isFinite(iv.a) && Number.isFinite(iv.b) && iv.b - iv.a < 1e-9 && !iv.incA));
}
function isConstInteger(node) {
  if (usesVar(node, "x") || usesVar(node, "y")) return false;
  const v = compile(node)(0, 0);
  return Number.isInteger(v) && v >= 0;
}
const ALL_REALS = "Tots els reals (ℝ)";
// Valors de x que anul·len algun denominador
function domainExclusions(node) {
  const exclusions = [];
  for (const d of collectNodes(node, (n) => n.type === "bin" && n.op === "/" && usesVar(n.right, "x"))) {
    const den = compile(d.right);
    const roots = findRoots((x) => den(x, 0));
    if (!roots.identicallyZero) roots.forEach((r) => pushUnique(exclusions, r));
  }
  for (const p of collectNodes(node, (n) => n.type === "pow" && usesVar(n.base, "x") && n.exp.type === "neg")) {
    const b = compile(p.base);
    findRoots((x) => b(x, 0)).forEach((r) => pushUnique(exclusions, r));
  }
  return exclusions.sort((a, b) => a - b);
}
function describeDomain(sides, fn) {
  const notes = [];
  const exprSide = sides;
  const divisions = collectNodes(exprSide, (n) => n.type === "bin" && n.op === "/" && usesVar(n.right, "x"));
  const roots = collectNodes(exprSide, (n) => n.type === "func" && ["sqrt", "ln", "log", "logb", "asin", "acos"].includes(n.name) && usesVar(n.arg, "x") || n.type === "pow" && usesVar(n.base, "x") && !isConstInteger(n.exp));
  const tangents = collectNodes(exprSide, (n) => n.type === "func" && n.name === "tan" && usesVar(n.arg, "x"));
  const exclusions = domainExclusions(exprSide);
  if (tangents.length) notes.push("La tangent no existeix on el seu argument val π/2 + k·π.");
  if (!divisions.length && !roots.length && !tangents.length) return { text: "Tots els reals (ℝ)", notes };
  if (tangents.length && !roots.length) return { text: exclusions.length ? `ℝ − {${exclusions.map((e) => formatNumber(e)).join(", ")}}, excepte on no existeix la tangent` : "ℝ, excepte on no existeix la tangent", notes };
  if (!roots.length) return { text: exclusions.length ? `ℝ − {${exclusions.map((e) => formatNumber(e)).join(", ")}}` : "Tots els reals (ℝ)", notes };
  const intervals = numericDomain(fn, exclusions);
  if (!intervals.length) return { text: "Buit: la funció no existeix per a cap valor de x (a [−100, 100])", notes };
  if (intervals.length === 1 && !Number.isFinite(intervals[0].a) && !Number.isFinite(intervals[0].b)) return { text: ALL_REALS, notes };
  const pieces = intervals.map((iv) => formatInterval(iv.a, iv.b, iv.incA, iv.incB));
  return { text: pieces.join(" ∪ "), notes };
}

// ---------- Inequacions d'una incògnita ----------
const holds = (v, rel) => rel === "<" ? v < 0 : rel === ">" ? v > 0 : rel === "<=" ? v <= 0 : rel === ">=" ? v >= 0 : Math.abs(v) < 1e-12;
function solveInequality1D(h, rel, extraCuts = []) {
  const breaks = [...extraCuts];
  const roots = findRoots(h, SEARCH_RANGE, SEARCH_STEPS, breaks);
  if (roots.identicallyZero) return { roots: [], intervals: rel.includes("=") ? [{ a: -Infinity, b: Infinity }] : [] };
  const edges = [];
  for (const iv of numericDomain(h, [])) {
    if (Number.isFinite(iv.a)) edges.push(iv.a);
    if (Number.isFinite(iv.b)) edges.push(iv.b);
  }
  const cuts = [...roots, ...breaks, ...edges].sort((p, q) => p - q).filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 1e-6);
  const bounds = [-Infinity, ...cuts, Infinity];
  const pointOk = (v) => {
    const hv = h(v);
    return Number.isFinite(hv) && holds(Math.abs(hv) < 1e-12 ? 0 : hv, rel);
  };
  const segments = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const a = bounds[i];
    const b = bounds[i + 1];
    const mid = !Number.isFinite(a) && !Number.isFinite(b) ? 0.5 : !Number.isFinite(a) ? b - 1 : !Number.isFinite(b) ? a + 1 : (a + b) / 2;
    const hv = h(mid);
    segments.push({ a, b, ok: Number.isFinite(hv) && holds(hv, rel) });
  }
  const intervals = [];
  segments.forEach((seg, i) => {
    const incA = Number.isFinite(seg.a) && pointOk(seg.a);
    const incB = Number.isFinite(seg.b) && pointOk(seg.b);
    const last = intervals[intervals.length - 1];
    if (seg.ok) {
      if (last && !last.point && last.b === seg.a && incA) {
        last.b = seg.b;
        last.incB = incB;
      } else {
        intervals.push({ a: seg.a, b: seg.b, incA, incB });
      }
    } else if (incB && i < segments.length - 1 && !segments[i + 1].ok) {
      intervals.push({ a: seg.b, b: seg.b, incA: true, incB: true, point: true });
    }
  });
  return { roots, intervals };
}
function formatSolutionIntervals(intervals) {
  if (!intervals.length) return "No té solució";
  if (intervals.length === 1 && !Number.isFinite(intervals[0].a) && !Number.isFinite(intervals[0].b)) return "Tots els reals (ℝ)";
  return intervals.map((iv) => iv.point ? `{${formatNumber(iv.a)}}` : formatInterval(iv.a, iv.b, iv.incA, iv.incB)).join(" ∪ ");
}

// ---------- Característiques d'una funció y = f(x) ----------
const BIG = 1e3;
// Comportament a prop d'un punt problemàtic: forat (discontinuïtat evitable) o asímptota vertical
function nearBehaviour(f, r, side) {
  const at = (d) => f(r + side * d);
  const m1 = Math.abs(at(1e-4));
  const m2 = Math.abs(at(1e-8));
  const m3 = Math.abs(at(1e-12));
  if (![m1, m2, m3].every(Number.isFinite)) return { finite: false, asymptote: false };
  const asymptote = m2 > 10 * m1 + 10 || m2 - m1 > 5 && m3 - m2 > 5;
  return { finite: !asymptote, asymptote, value: at(1e-9) };
}
function horizontalAsymptote(f, sign) {
  const v = [1e4, 1e6, 1e8].map((t) => f(sign * t));
  if (!v.every(Number.isFinite)) return null;
  if (Math.abs(v[2] - v[1]) < 1e-4 * (1 + Math.abs(v[2])) && Math.abs(v[1] - v[0]) < 1e-2 * (1 + Math.abs(v[1]))) return snapNumber(Number(v[2].toFixed(6)));
  return null;
}
function findExtrema(f) {
  const steps = SEARCH_STEPS;
  const xs = new Float64Array(steps + 1);
  const vs = new Float64Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    xs[i] = -SEARCH_RANGE + 2 * SEARCH_RANGE * i / steps;
    const v = f(xs[i]);
    vs[i] = Number.isFinite(v) ? v : NaN;
  }
  const out = [];
  const golden = (g, a, b) => {
    const k = (Math.sqrt(5) - 1) / 2;
    let c = b - k * (b - a);
    let d = a + k * (b - a);
    for (let it = 0; it < 100; it++) {
      if (g(c) < g(d)) b = d;
      else a = c;
      c = b - k * (b - a);
      d = a + k * (b - a);
    }
    return (a + b) / 2;
  };
  for (let i = 1; i < steps; i++) {
    const [a, v, b] = [vs[i - 1], vs[i], vs[i + 1]];
    if (Number.isNaN(a) || Number.isNaN(v) || Number.isNaN(b)) continue;
    const isMax = v > a && v >= b;
    const isMin = v < a && v <= b;
    if (!isMax && !isMin) continue;
    // Descarta pics deguts a una asímptota
    if (Math.abs(v) > 1e6) continue;
    const x = snapLoose(golden(isMax ? (t) => -f(t) : f, xs[i - 1], xs[i + 1]));
    const y = f(x);
    if (!Number.isFinite(y)) continue;
    if (out.every((e) => Math.abs(e.x - x) > 1e-6)) out.push({ x, y: snapNumber(y), type: isMax ? "max" : "min" });
  }
  return out;
}
// Arrels periòdiques (sin, cos...): forma general x = b + k·P
function periodicForm(roots) {
  if (roots.length < 6) return null;
  const has = (v) => roots.some((r) => Math.abs(r - v) < 1e-6);
  const max = roots[roots.length - 1];
  for (let k = 1; k <= 4 && k < roots.length; k++) {
    const P = roots[k] - roots[0];
    if (P <= 1e-6) continue;
    const ok = roots.every((r) => r + P > max + 1e-6 || has(r + P));
    if (!ok) continue;
    const base = roots.filter((r) => r >= -1e-9 && r < P - 1e-9);
    const period = formatNumber(snapNumber(P));
    const kP = /^\d*π(\/\d+)?$/.test(period) ? period.replace(/^(\d*)π/, (m, n) => `${n}kπ`) : `k·${period}`;
    const general = base.map((b) => Math.abs(b) < 1e-12 ? `x = ${kP}` : `x = ${formatNumber(b)} + ${kP}`).join(";  ") + "  (k ∈ ℤ)";
    const idx = roots.findIndex((r) => r >= -1e-9);
    const start = Math.max(0, idx - 1);
    return { general, sample: roots.slice(start, start + 4) };
  }
  return null;
}
function formatUnion(intervals) {
  if (!intervals.length) return "Cap";
  if (intervals.length === 1 && !Number.isFinite(intervals[0].a) && !Number.isFinite(intervals[0].b)) return ALL_REALS;
  let list = intervals.filter((iv) => !iv.point);
  let more = false;
  if (list.length > 6) {
    list = list.filter((iv) => iv.b > -10 && iv.a < 10).slice(0, 5);
    more = true;
  }
  return list.map((iv) => formatInterval(iv.a, iv.b, false, false)).join(" ∪ ") + (more ? " ∪ …" : "");
}
function functionFeatures(f, exclusions, isPolynomial) {
  const features = { holes: [], asymptotes: { vertical: [], horizontal: [] } };
  // Punts problemàtics: denominadors nuls i extrems del domini
  const edges = [];
  for (const iv of numericDomain(f, exclusions)) {
    if (Number.isFinite(iv.a)) edges.push({ x: iv.a, side: 1 });
    if (Number.isFinite(iv.b)) edges.push({ x: iv.b, side: -1 });
  }
  for (const r of exclusions) {
    const left = nearBehaviour(f, r, -1);
    const right = nearBehaviour(f, r, 1);
    if (left.asymptote || right.asymptote) pushUnique(features.asymptotes.vertical, snapNumber(r));
    else if (left.finite && right.finite && Math.abs(left.value - right.value) < 1e-4 * (1 + Math.abs(left.value))) features.holes.push({ x: snapNumber(r), y: snapNumber(Number(((left.value + right.value) / 2).toFixed(9))) });
  }
  for (const e of edges) {
    if (exclusions.some((r) => Math.abs(r - e.x) < 1e-6)) continue;
    if (nearBehaviour(f, e.x, e.side).asymptote) pushUnique(features.asymptotes.vertical, snapNumber(e.x));
  }
  if (!isPolynomial) {
    const plus = horizontalAsymptote(f, 1);
    const minus = horizontalAsymptote(f, -1);
    if (plus !== null && minus !== null && Math.abs(plus - minus) < 1e-9) features.asymptotes.horizontal.push({ y: plus, where: "x → ±∞" });
    else {
      if (minus !== null) features.asymptotes.horizontal.push({ y: minus, where: "x → −∞" });
      if (plus !== null) features.asymptotes.horizontal.push({ y: plus, where: "x → +∞" });
    }
  }
  features.extrema = findExtrema(f);
  const cuts = [...exclusions];
  const sign = { positive: solveInequality1D(f, ">", cuts).intervals, negative: solveInequality1D(f, "<", cuts).intervals };
  features.sign = { positive: formatUnion(sign.positive), negative: formatUnion(sign.negative) };
  const d = (x) => {
    const h = 1e-6 * (1 + Math.abs(x));
    if (exclusions.some((r) => Math.abs(r - x) <= 2 * h)) return NaN;
    return (f(x + h) - f(x - h)) / (2 * h);
  };
  const inc = solveInequality1D(d, ">", cuts).intervals;
  const dec = solveInequality1D(d, "<", cuts).intervals;
  features.monotony = inc.length || dec.length ? { increasing: formatUnion(inc), decreasing: formatUnion(dec) } : null;
  return features;
}

// ---------- Anàlisi d'una expressió ----------
const analysisCache = /* @__PURE__ */ new Map();
function analyzeExpression(expression) {
  const key = `${paramKey(expression)}|${expression}`;
  if (analysisCache.has(key)) return analysisCache.get(key);
  const result = analyzeUncached(expression);
  if (analysisCache.size > 300) analysisCache.clear();
  analysisCache.set(key, result);
  return result;
}
function analyzeUncached(expression) {
  const prep = prepareExpression(expression);
  const result = { kind: prep.kind, ok: prep.ok, error: prep.error, domainNotes: [], facts: [] };
  if (!prep.ok) return result;
  const poly = prep.poly;
  if (prep.kind === "explicitY" && prep.relation === "=") {
    const f = prep.fn;
    const domain = prep.fnNode ? describeDomain(prep.fnNode, f) : { text: describeDomainFallback(f), notes: [] };
    result.domain = domain.text;
    result.domainNotes = domain.notes;
    const y0 = f(0);
    result.yIntercept = Number.isFinite(y0) ? snapNumber(y0) : "No existeix (x = 0 no és del domini)";
    result.xIntercepts = findRoots(f);
    result.onXAxis = !!result.xIntercepts.identicallyZero;
    // Funcions polinòmiques de grau 1 i 2
    if (poly && polyDegree(poly, "y") === 1 && polyDegree(poly, "x") <= 2) {
      const ay = polyCoef(poly, 0, 1);
      const mixed = [...poly.keys()].some((k) => k !== "0,1" && k.split(",")[1] !== "0");
      if (!mixed && ay !== 0) {
        const a = snapNumber(-polyCoef(poly, 2, 0) / ay);
        const b = snapNumber(-polyCoef(poly, 1, 0) / ay);
        const c = snapNumber(-polyCoef(poly, 0, 0) / ay);
        if (polyDegree(poly, "x") === 2) {
          const vx = snapNumber(-b / (2 * a));
          const vy = snapNumber(f(vx));
          result.facts.push({ label: "Tipus", value: `Funció quadràtica (paràbola ${a > 0 ? "oberta cap amunt ∪" : "oberta cap avall ∩"})` });
          result.facts.push({ label: "Vèrtex", value: formatPoint({ x: vx, y: vy }) });
          result.facts.push({ label: "Eix de simetria", value: `x = ${formatNumber(vx)}` });
          result.vertex = { x: vx, y: vy };
          const q = quadraticDetails(a, b, c);
          result.facts.push({ label: "Discriminant", value: `Δ = b² − 4ac = ${formatNumber(q.delta)}` });
          result.xIntercepts = q.roots;
          if (q.exact) result.exactRoots = q.exact;
        } else if (polyDegree(poly, "x") === 1) {
          result.facts.push({ label: "Tipus", value: "Funció lineal o afí (recta)" });
          result.facts.push({ label: "Pendent", value: `m = ${formatNumber(b)}` });
          result.facts.push({ label: "Ordenada a l'origen", value: `n = ${formatNumber(c)}` });
          result.slope = { m: b, n: c };
          result.xIntercepts = [snapNumber(-c / b)];
        } else {
          result.facts.push({ label: "Tipus", value: "Funció constant (recta horitzontal)" });
          result.facts.push({ label: "Pendent", value: "m = 0" });
        }
      }
    }
    let exclusions;
    if (prep.fnNode) exclusions = domainExclusions(prep.fnNode);
    else {
      // Forma aïllada numèricament (2x + 3y = 7, xy = 1): els forats del domini són exclusions
      const ivs = numericDomain(f, []);
      exclusions = [];
      for (let i = 1; i < ivs.length; i++) if (Number.isFinite(ivs[i].a) && Math.abs(ivs[i].a - ivs[i - 1].b) < 1e-6) exclusions.push(ivs[i].a);
    }
    Object.assign(result, functionFeatures(f, exclusions, !!poly));
    result.xIntercepts = result.xIntercepts.filter((x) => !result.holes.some((h) => Math.abs(h.x - x) < 1e-9));
    result.periodic = periodicForm(result.xIntercepts);
    if (!result.xIntercepts.length && !result.onXAxis) {
      const delta = result.facts.find((ft) => ft.label === "Discriminant");
      result.explanation = delta ? "Com que Δ < 0, la paràbola no talla l'eix X." : "La gràfica no talla l'eix X: la funció no s'anul·la per a cap valor de x.";
    }
  } else if (prep.kind === "explicitY" || prep.kind === "explicitX") {
    if (prep.relation === "=") {
      const xIsConst = prep.kind === "explicitX" && [-3, 0, 4].every((v) => Math.abs(prep.fn(v) - prep.fn(0)) < 1e-12);
      if (xIsConst) {
        result.facts.push({ label: "Tipus", value: `Recta vertical x = ${formatNumber(snapNumber(prep.fn(0)))}` });
      } else {
        const x0 = prep.fn(0);
        if (Number.isFinite(x0)) result.facts.push({ label: "Tall amb l'eix X", value: formatPoint({ x: snapNumber(x0), y: 0 }) });
        const ys = findRoots(prep.fn);
        if (ys.length) result.facts.push({ label: "Talls amb l'eix Y", value: ys.map((y) => formatPoint({ x: 0, y })).join("  ") });
      }
    } else {
      const v = prep.kind === "explicitY" ? "y" : "x";
      const side = prep.relation.startsWith("<") ? v === "y" ? "per sota de" : "a l'esquerra de" : v === "y" ? "per sobre de" : "a la dreta de";
      result.facts.push({ label: "Regió", value: `Punts ${side} la línia frontera${prep.relation.includes("=") ? " (inclosa: línia contínua)" : " (no inclosa: línia discontínua)"}` });
    }
  } else if (prep.kind === "equationX") {
    result.auxiliary = true;
    const deg = poly ? polyDegree(poly, "x") : null;
    if (deg === -Infinity) {
      result.identity = true;
      result.solutions = [];
    } else if (deg !== null && deg <= 2) {
      const a = polyCoef(poly, 2, 0);
      const b = polyCoef(poly, 1, 0);
      const c = polyCoef(poly, 0, 0);
      if (deg === 2) {
        const q = quadraticDetails(a, b, c);
        result.facts.push({ label: "Tipus", value: "Equació de segon grau" });
        result.facts.push({ label: "Coeficients", value: `a = ${formatNumber(snapNumber(a))}, b = ${formatNumber(snapNumber(b))}, c = ${formatNumber(snapNumber(c))}` });
        result.facts.push({ label: "Discriminant", value: `Δ = b² − 4ac = ${formatNumber(q.delta)} → ${q.delta > 0 ? "dues solucions" : q.delta === 0 ? "una solució doble" : "cap solució real"}` });
        result.solutions = q.roots;
        if (q.exact) result.exactRoots = q.exact;
        // Vèrtex de la paràbola auxiliar y = (1r membre − 2n membre)
        result.vertex = { x: snapNumber(-b / (2 * a)), y: snapNumber(c - b * b / (4 * a)) };
        result.facts.push({ label: "Vèrtex", value: `${formatPoint(result.vertex)} (de la paràbola auxiliar)` });
      } else if (deg === 1) {
        result.facts.push({ label: "Tipus", value: "Equació de primer grau" });
        result.solutions = [snapNumber(-c / b)];
      } else {
        result.solutions = [];
        result.explanation = `En simplificar queda una igualtat falsa (0 = ${formatNumber(snapNumber(-c))}): l'equació no té solució.`;
      }
    }
    if (!result.solutions) {
      const roots = findRoots(prep.fn);
      result.identity = !!roots.identicallyZero;
      result.solutions = roots;
    }
    result.periodic = periodicForm(result.solutions);
    if (result.identity) result.explanation = "En simplificar queda 0 = 0: qualsevol valor de x és solució (és una identitat).";
    else if (!result.solutions.length && !result.explanation) {
      result.explanation = deg === 2 ? "Com que Δ < 0, la paràbola auxiliar no talla l'eix X: l'equació no té cap solució real." : "La corba auxiliar no talla l'eix X: cap valor de x compleix l'equació.";
    }
  } else if (prep.kind === "inequalityX") {
    result.auxiliary = true;
    const sol = solveInequality1D(prep.fn, prep.relation);
    result.solutions = sol.roots;
    result.intervals = sol.intervals;
    result.solutionText = formatSolutionIntervals(sol.intervals);
    if (!sol.intervals.length) result.explanation = "Cap valor de x compleix la inequació: la corba auxiliar no entra mai a la zona demanada.";
    else if (result.solutionText === ALL_REALS) result.explanation = "Tots els valors de x compleixen la inequació.";
  } else if (prep.kind === "implicit" && prep.relation === "=" && poly) {
    // Circumferència: x² + y² + Dx + Ey + F = 0
    const a = polyCoef(poly, 2, 0);
    const c2 = polyCoef(poly, 0, 2);
    const keys = [...poly.keys()];
    if (polyDegree(poly) === 2 && Math.abs(a - c2) < 1e-12 && a !== 0 && !keys.includes("1,1")) {
      const D = polyCoef(poly, 1, 0) / a;
      const E = polyCoef(poly, 0, 1) / a;
      const F = polyCoef(poly, 0, 0) / a;
      const r2 = D * D / 4 + E * E / 4 - F;
      if (r2 > 0) {
        result.facts.push({ label: "Tipus", value: "Circumferència" });
        result.circle = { x: -D / 2, y: -E / 2, r: Math.sqrt(r2) };
        result.facts.push({ label: "Centre", value: formatPoint({ x: snapNumber(-D / 2), y: snapNumber(-E / 2) }) });
        const r = Math.sqrt(r2);
        const rs = snapNumber(r);
        result.facts.push({ label: "Radi", value: isApprox(rs) ? `√${formatNumber(snapNumber(r2))} ≈ ${formatNumber(r)}` : formatNumber(rs) });
      }
    }
  } else if (prep.kind === "interval") {
    const iv = prep.interval;
    result.facts.push({ label: "Interval", value: `${iv.variable} ∈ ${formatInterval(iv.lowerBound, iv.upperBound, iv.lowerInclusive, iv.upperInclusive)}` });
  }
  return result;
}
function describeDomainFallback(f) {
  const intervals = numericDomain(f, []);
  if (intervals.length === 1 && !Number.isFinite(intervals[0].a) && !Number.isFinite(intervals[0].b)) return "Tots els reals (ℝ)";
  return intervals.map((iv) => formatInterval(iv.a, iv.b, iv.incA, iv.incB)).join(" ∪ ") || "Buit";
}

// ---------- Sistemes ----------
function residualOk(F, p) {
  const v = F(p.x, p.y);
  return Number.isFinite(v) && Math.abs(v) < 1e-6 * (1 + Math.abs(p.x) + Math.abs(p.y));
}
function newton2D(F1, F2, x, y) {
  for (let k = 0; k < 40; k++) {
    const f1 = F1(x, y);
    const f2 = F2(x, y);
    if (!Number.isFinite(f1) || !Number.isFinite(f2)) return null;
    if (Math.abs(f1) < 1e-13 && Math.abs(f2) < 1e-13) break;
    const hx = 1e-7 * (1 + Math.abs(x));
    const hy = 1e-7 * (1 + Math.abs(y));
    const a = (F1(x + hx, y) - f1) / hx;
    const b = (F1(x, y + hy) - f1) / hy;
    const c = (F2(x + hx, y) - f2) / hx;
    const d = (F2(x, y + hy) - f2) / hy;
    const det = a * d - b * c;
    if (!Number.isFinite(det) || Math.abs(det) < 1e-14) return null;
    const dx = (d * f1 - b * f2) / det;
    const dy = (a * f2 - c * f1) / det;
    x -= dx;
    y -= dy;
    if (Math.abs(x) > 1e4 || Math.abs(y) > 1e4) return null;
    if (Math.abs(dx) < 1e-15 && Math.abs(dy) < 1e-15) break;
  }
  return { x, y };
}
function addPoint(points, p) {
  const q = { x: snapNumber(p.x), y: snapNumber(p.y) };
  if (points.every((o) => Math.hypot(o.x - q.x, o.y - q.y) > 1e-5)) points.push(q);
}
function intersectPair(e1, e2) {
  const points = [];
  const explicitFirst = [e1, e2].find((e) => e.kind === "explicitY") || [e1, e2].find((e) => e.kind === "explicitX");
  if (explicitFirst) {
    const other = explicitFirst === e1 ? e2 : e1;
    const isY = explicitFirst.kind === "explicitY";
    const h = isY ? (u) => other.D(u, explicitFirst.fn(u)) : (u) => other.D(explicitFirst.fn(u), u);
    // Mateixa corba?
    const tests = [-7.3, -2.2, -0.6, 0.9, 3.1, 6.4];
    const evals = tests.map(h).filter(Number.isFinite);
    if (evals.length >= 4 && evals.every((v) => Math.abs(v) < 1e-9)) return { infinite: true, points: [] };
    for (const u of findRoots(h)) {
      const v = explicitFirst.fn(u);
      if (Number.isFinite(v)) addPoint(points, isY ? { x: u, y: v } : { x: v, y: u });
    }
  } else {
    for (let sx = -20; sx <= 20; sx += 1) {
      for (let sy = -20; sy <= 20; sy += 1) {
        const p = newton2D(e1.D, e2.D, sx + 0.013, sy - 0.017);
        if (p && residualOk(e1.D, p) && residualOk(e2.D, p)) addPoint(points, p);
      }
    }
  }
  return { infinite: false, points: points.filter((p) => residualOk(e1.D, p) && residualOk(e2.D, p)).sort((a, b) => a.x - b.x || a.y - b.y) };
}
function linearCoefficients(prep) {
  const p = prep.poly;
  if (!p || polyDegree(p) > 1 || polyDegree(p) < 0) return null;
  return { a: polyCoef(p, 1, 0), b: polyCoef(p, 0, 1), c: -polyCoef(p, 0, 0) };
}
function polyProportional(p1, p2) {
  if (!p1 || !p2 || p1.size === 0 || p1.size !== p2.size) return false;
  let k = null;
  for (const [key, v] of p1) {
    if (!p2.has(key)) return false;
    const ratio = p2.get(key) / v;
    if (k === null) k = ratio;
    else if (Math.abs(ratio - k) > 1e-9 * Math.abs(k)) return false;
  }
  return true;
}
const systemCache = /* @__PURE__ */ new Map();
function analyzeSystem(expressions) {
  const key = expressions.map((e) => `${paramKey(e)}|${e}`).join("\n");
  if (systemCache.has(key)) return systemCache.get(key);
  const result = analyzeSystemUncached(expressions);
  if (systemCache.size > 100) systemCache.clear();
  systemCache.set(key, result);
  return result;
}
function analyzeSystemUncached(expressions) {
  const preps = expressions.map((e) => prepareExpression(e, { inSystem: true }));
  const valid = preps.filter((p) => p.ok);
  const result = { domainNotes: [], intersectionPoints: [], facts: [] };
  if (valid.length < preps.length) {
    result.domainNotes.push("Alguna equació del sistema no és vàlida.");
    return result;
  }
  if (valid.length < 2) {
    result.domainNotes.push("Un sistema necessita almenys dues equacions.");
    return result;
  }
  if (valid.some((p) => p.relation !== "=")) {
    result.systemSolutionStatus = "INEQUALITIES";
    return result;
  }
  // Sistema lineal 2x2: solució exacta
  const lin = valid.map(linearCoefficients);
  if (valid.length === 2 && lin.every(Boolean)) {
    const [{ a: a1, b: b1, c: c1 }, { a: a2, b: b2, c: c2 }] = lin;
    const det = a1 * b2 - a2 * b1;
    result.linear = true;
    if (Math.abs(det) > 1e-12) {
      const p = { x: snapNumber((c1 * b2 - c2 * b1) / det), y: snapNumber((a1 * c2 - a2 * c1) / det) };
      result.systemSolutionStatus = "LIMITED_SOLUTIONS";
      result.classification = "Sistema compatible determinat: una sola solució (les rectes es tallen en un punt).";
      result.intersectionPoints = [p];
      return result;
    }
    const proportional = Math.abs(a1 * c2 - a2 * c1) < 1e-12 && Math.abs(b1 * c2 - b2 * c1) < 1e-12;
    result.systemSolutionStatus = proportional ? "INFINITE_SOLUTIONS" : "NO_SOLUTION";
    result.classification = proportional ? "Sistema compatible indeterminat: infinites solucions (les dues rectes són la mateixa)." : "Sistema incompatible: no té solució (les rectes són paral·leles).";
    return result;
  }
  if (valid.length === 2 && polyProportional(valid[0].poly, valid[1].poly)) {
    result.systemSolutionStatus = "INFINITE_SOLUTIONS";
    result.classification = "Les dues equacions representen la mateixa corba: infinites solucions.";
    return result;
  }
  const first = intersectPair(valid[0], valid[1]);
  if (first.infinite && valid.length === 2) {
    result.systemSolutionStatus = "INFINITE_SOLUTIONS";
    result.classification = "Les dues equacions representen la mateixa corba: infinites solucions.";
    return result;
  }
  let points = first.points;
  for (const extra of valid.slice(2)) points = points.filter((p) => residualOk(extra.D, p));
  result.intersectionPoints = points;
  result.systemSolutionStatus = points.length ? "LIMITED_SOLUTIONS" : "NO_SOLUTION";
  result.classification = points.length ? points.length === 1 ? "El sistema té una solució." : `El sistema té ${points.length} solucions.` : "No s'han trobat solucions reals (les corbes no es tallen a la zona estudiada, de −100 a 100).";
  return result;
}

// ---------- Restricció de domini (ex.: -2 < x < 5, x ≥ 0) ----------
function parseIntervalExpression(expression) {
  if (!expression || !expression.trim()) return null;
  const prep = prepareExpression(expression);
  if (!prep.ok) return null;
  if (prep.kind === "interval") return prep.interval;
  if ((prep.kind === "explicitX" || prep.kind === "explicitY") && prep.relation !== "=") {
    const v = prep.kind === "explicitX" ? "x" : "y";
    const vals = [-1, 0, 2].map((t) => prep.fn(t));
    if (!vals.every((val) => Math.abs(val - vals[0]) < 1e-12)) return null;
    const value = vals[0];
    const lower = prep.relation.startsWith(">");
    return {
      variable: v,
      lowerBound: lower ? value : -Infinity,
      upperBound: lower ? Infinity : value,
      lowerInclusive: lower && prep.relation.includes("="),
      upperInclusive: !lower && prep.relation.includes("=")
    };
  }
  return null;
}

// Domini escrit a la mateixa línia: "y = x^2, -2 < x < 2" -> { expr, domain }
function splitInlineDomain(text) {
  const str = String(text ?? "");
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0 && (c === ";" || c === "," && !/\d/.test(str[i + 1] || ""))) {
      const domain = str.slice(i + 1).trim();
      if (/[<>≤≥]/.test(domain) && /[xX]/.test(domain)) return { expr: str.slice(0, i).trim(), domain };
    }
  }
  return { expr: str.trim(), domain: "" };
}

// Compatibilitat amb la versió anterior
function parseExpression(expression) {
  const prep = prepareExpression(expression);
  if (!prep.ok) return null;
  return { ...prep, isEquation: prep.relation === "=", inequalityType: prep.relation !== "=" ? prep.relation : void 0 };
}

export {
  analyzeExpression,
  splitInlineDomain,
  analyzeSystem,
  findRoots,
  formatApprox,
  formatNumber,
  formatPoint,
  parseExpression,
  parseIntervalExpression,
  prepareExpression
};
