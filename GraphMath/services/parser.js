// Analitzador d'expressions matemàtiques: text -> arbre (AST) -> funció JS, LaTeX i polinomi.

const FUNCTIONS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round
};
const FUNCTION_ALIASES = { sen: "sin", arrel: "sqrt", rel: "sqrt", arcsin: "asin", arccos: "acos", arctan: "atan", tg: "tan" };
const CONSTANTS = { pi: Math.PI, e: Math.E };
const FUNCTION_NAMES = [...Object.keys(FUNCTIONS), ...Object.keys(FUNCTION_ALIASES)].sort((a, b) => b.length - a.length);
const SUPERSCRIPTS = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };

class MathSyntaxError extends Error {
}

function normalizeInput(text) {
  let s = String(text ?? "");
  s = s.replace(/[−–—]/g, "-").replace(/[×·⋅∙]/g, "*").replace(/[÷:]/g, "/").replace(/,/g, ".").replace(/π/g, "pi").replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/≠/g, "!=").replace(/==/g, "=");
  s = s.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => `^(${[...m].map((c) => SUPERSCRIPTS[c]).join("")})`);
  s = s.replace(/∛/g, "cbrt").replace(/√/g, "sqrt");
  s = s.replace(/\\cdot/g, "*").replace(/\\pi/g, "pi");
  return s;
}

function tokenize(input) {
  const s = normalizeInput(input);
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const raw = s.slice(i, j);
      if ((raw.match(/\./g) || []).length > 1 || raw === ".") throw new MathSyntaxError(`Nombre mal escrit: «${raw}»`);
      tokens.push({ type: "num", value: Number(raw), raw });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      let word = s.slice(i, j).toLowerCase();
      // Separa paraules enganxades: "xsin" -> x, sin; "2pix" -> pi, x
      while (word.length > 0) {
        const fn = FUNCTION_NAMES.find((name) => word.startsWith(name));
        if (fn) {
          tokens.push({ type: "func", value: FUNCTION_ALIASES[fn] || fn });
          word = word.slice(fn.length);
        } else if (word.startsWith("pi")) {
          tokens.push({ type: "const", value: "pi" });
          word = word.slice(2);
        } else if (word[0] === "x" || word[0] === "y") {
          tokens.push({ type: "var", value: word[0] });
          word = word.slice(1);
        } else if (word[0] === "e") {
          tokens.push({ type: "const", value: "e" });
          word = word.slice(1);
        } else {
          throw new MathSyntaxError(`No reconec «${s.slice(i, j)}». Fes servir només x, y, nombres i funcions.`);
        }
      }
      i = j;
      continue;
    }
    const two = s.slice(i, i + 2);
    if (two === "<=" || two === ">=" || two === "**" || two === "!=") {
      tokens.push(two === "**" ? { type: "op", value: "^" } : { type: "rel", value: two });
      i += 2;
      continue;
    }
    if (c === "<" || c === ">" || c === "=") {
      tokens.push({ type: "rel", value: c });
      i++;
      continue;
    }
    if ("+-*/^".includes(c)) {
      tokens.push({ type: "op", value: c });
      i++;
      continue;
    }
    if ("([{".includes(c)) {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (")]}".includes(c)) {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }
    if (c === "|") {
      tokens.push({ type: "bar" });
      i++;
      continue;
    }
    throw new MathSyntaxError(`Símbol no permès: «${c}»`);
  }
  return tokens;
}

// Gramàtica:
// expr   := term (('+'|'-') term)*
// term   := unary (('*'|'/') unary | <implícit> unary)*
// unary  := ('-'|'+') unary | power
// power  := postfix ('^' unary)?
// atom   := num | var | const | func atom | '(' expr ')' | '|' expr '|'
function parseTokens(tokens) {
  let pos = 0;
  let barDepth = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];
  const startsAtom = (t) => t && (t.type === "num" || t.type === "var" || t.type === "const" || t.type === "func" || t.type === "lparen" || t.type === "bar" && barDepth === 0);
  const parseExpr = () => {
    let node = parseTerm();
    while (peek() && peek().type === "op" && (peek().value === "+" || peek().value === "-")) {
      const op = next().value;
      if (!peek() || peek().type === "rparen" || peek().type === "rel") throw new MathSyntaxError(`Falta un terme després de «${op}»`);
      node = { type: "bin", op, left: node, right: parseTerm() };
    }
    return node;
  };
  const parseTerm = () => {
    let node = parseUnary();
    for (; ; ) {
      const t = peek();
      if (t && t.type === "op" && (t.value === "*" || t.value === "/")) {
        next();
        if (!peek() || peek().type === "rparen" || peek().type === "rel") throw new MathSyntaxError(`Falta un terme després de «${t.value === "*" ? "×" : "÷"}»`);
        node = { type: "bin", op: t.value, left: node, right: parseUnary() };
      } else if (startsAtom(t)) {
        node = { type: "bin", op: "*", implicit: true, left: node, right: parsePower() };
      } else {
        return node;
      }
    }
  };
  const parseUnary = () => {
    const t = peek();
    if (t && t.type === "op" && (t.value === "-" || t.value === "+")) {
      next();
      const arg = parseUnary();
      return t.value === "-" ? { type: "neg", arg } : arg;
    }
    return parsePower();
  };
  const parsePower = () => {
    const base = parseAtom();
    if (peek() && peek().type === "op" && peek().value === "^") {
      next();
      if (!peek()) throw new MathSyntaxError("Falta l'exponent després de «^»");
      return { type: "pow", base, exp: parseUnary() };
    }
    return base;
  };
  const parseAtom = () => {
    const t = next();
    if (!t) throw new MathSyntaxError("L'expressió està incompleta");
    switch (t.type) {
      case "num":
        return { type: "num", value: t.value };
      case "var":
        return { type: "var", name: t.value };
      case "const":
        return { type: "const", name: t.value };
      case "func": {
        const nt = peek();
        if (!nt) throw new MathSyntaxError(`Falta l'argument de ${t.value}( )`);
        let arg;
        if (nt.type === "lparen") {
          next();
          if (peek() && peek().type === "rparen") throw new MathSyntaxError(`${t.value}( ) està buida`);
          arg = parseExpr();
          if (!peek() || peek().type !== "rparen") throw new MathSyntaxError("Falta tancar un parèntesi «)»");
          next();
        } else {
          arg = parsePower();
        }
        return { type: "func", name: t.value, arg };
      }
      case "lparen": {
        if (peek() && peek().type === "rparen") throw new MathSyntaxError("Hi ha uns parèntesis buits «( )»");
        const inner = parseExpr();
        if (!peek() || peek().type !== "rparen") throw new MathSyntaxError("Falta tancar un parèntesi «)»");
        next();
        return { type: "group", arg: inner };
      }
      case "bar": {
        barDepth++;
        const inner = parseExpr();
        barDepth--;
        if (!peek() || peek().type !== "bar") throw new MathSyntaxError("Falta tancar el valor absolut «|»");
        next();
        return { type: "func", name: "abs", arg: inner };
      }
      case "rparen":
        throw new MathSyntaxError("Sobra un parèntesi «)»");
      case "op":
        throw new MathSyntaxError(`L'operador «${t.value}» no pot anar aquí`);
      case "rel":
        throw new MathSyntaxError(`Falta una expressió abans de «${t.value}»`);
      default:
        throw new MathSyntaxError("Expressió no vàlida");
    }
  };
  return { parseExpr, peek, next, atEnd: () => pos >= tokens.length };
}

// Retorna { sides: [ast, ast, ...], ops: ["=", "<", ...] } o llança MathSyntaxError
function parseRelation(text) {
  const tokens = tokenize(text);
  if (tokens.length === 0) throw new MathSyntaxError("L'expressió és buida");
  const p = parseTokens(tokens);
  const sides = [p.parseExpr()];
  const ops = [];
  while (!p.atEnd()) {
    const t = p.next();
    if (t.type !== "rel") {
      if (t.type === "rparen") throw new MathSyntaxError("Sobra un parèntesi «)»");
      throw new MathSyntaxError("Hi ha alguna cosa que no encaixa a l'expressió");
    }
    if (p.atEnd()) throw new MathSyntaxError(`Falta una expressió després de «${t.value}»`);
    ops.push(t.value);
    sides.push(p.parseExpr());
  }
  return { sides, ops };
}

function parseExpressionAst(text) {
  const { sides, ops } = parseRelation(text);
  if (ops.length) throw new MathSyntaxError("Aquí només s'espera una expressió, sense =, < ni >");
  return sides[0];
}

function usesVar(node, name) {
  switch (node.type) {
    case "var":
      return node.name === name;
    case "bin":
      return usesVar(node.left, name) || usesVar(node.right, name);
    case "pow":
      return usesVar(node.base, name) || usesVar(node.exp, name);
    case "neg":
    case "group":
    case "func":
      return usesVar(node.arg, name);
    default:
      return false;
  }
}

function compile(node) {
  switch (node.type) {
    case "num": {
      const v = node.value;
      return () => v;
    }
    case "const": {
      const v = CONSTANTS[node.name];
      return () => v;
    }
    case "var":
      return node.name === "x" ? (x) => x : (x, y) => y;
    case "neg": {
      const a = compile(node.arg);
      return (x, y) => -a(x, y);
    }
    case "group":
      return compile(node.arg);
    case "func": {
      const f = FUNCTIONS[node.name];
      const a = compile(node.arg);
      return (x, y) => f(a(x, y));
    }
    case "pow": {
      const b = compile(node.base);
      const e = compile(node.exp);
      const constExp = !usesVar(node.exp, "x") && !usesVar(node.exp, "y") ? e(0, 0) : null;
      // Arrels senars de negatius: x^(1/3) amb x < 0 ha de donar un valor real
      return (x, y) => {
        const bv = b(x, y);
        const ev = constExp ?? e(x, y);
        if (bv < 0 && !Number.isInteger(ev)) {
          for (const d of [3, 5, 7, 9]) {
            const n = ev * d;
            if (Math.abs(n - Math.round(n)) < 1e-9) {
              const sign = Math.round(n) % 2 === 0 ? 1 : -1;
              return sign * Math.pow(-bv, ev);
            }
          }
        }
        return Math.pow(bv, ev);
      };
    }
    case "bin": {
      const l = compile(node.left);
      const r = compile(node.right);
      switch (node.op) {
        case "+":
          return (x, y) => l(x, y) + r(x, y);
        case "-":
          return (x, y) => l(x, y) - r(x, y);
        case "*":
          return (x, y) => l(x, y) * r(x, y);
        case "/":
          return (x, y) => l(x, y) / r(x, y);
      }
    }
  }
  throw new Error("Node desconegut");
}

// --- Polinomis en x i y: mapa "i,j" -> coeficient de x^i·y^j ---
const MAX_POLY_DEGREE = 6;
const polyConst = (c) => /* @__PURE__ */ new Map([["0,0", c]]);
const polyAdd = (a, b, sign = 1) => {
  const r = new Map(a);
  for (const [k, v] of b) r.set(k, (r.get(k) || 0) + sign * v);
  return r;
};
const polyMul = (a, b) => {
  const r = /* @__PURE__ */ new Map();
  for (const [ka, va] of a) {
    const [ia, ja] = ka.split(",").map(Number);
    for (const [kb, vb] of b) {
      const [ib, jb] = kb.split(",").map(Number);
      if (ia + ib + ja + jb > MAX_POLY_DEGREE) return null;
      const k = `${ia + ib},${ja + jb}`;
      r.set(k, (r.get(k) || 0) + va * vb);
    }
  }
  return r;
};
const polyClean = (p) => {
  const r = /* @__PURE__ */ new Map();
  for (const [k, v] of p) if (Math.abs(v) > 1e-12) r.set(k, v);
  return r;
};
const polyConstValue = (p) => {
  const c = polyClean(p);
  if (c.size === 0) return 0;
  if (c.size === 1 && c.has("0,0")) return c.get("0,0");
  return null;
};

// Converteix l'AST en polinomi si és possible (si no, retorna null)
function toPolynomial(node) {
  switch (node.type) {
    case "num":
      return polyConst(node.value);
    case "const":
      return polyConst(CONSTANTS[node.name]);
    case "var":
      return /* @__PURE__ */ new Map([[node.name === "x" ? "1,0" : "0,1", 1]]);
    case "neg": {
      const a = toPolynomial(node.arg);
      return a && polyAdd(/* @__PURE__ */ new Map(), a, -1);
    }
    case "group":
      return toPolynomial(node.arg);
    case "func": {
      const a = toPolynomial(node.arg);
      const c = a && polyConstValue(a);
      return c === null || c === void 0 ? null : polyConst(FUNCTIONS[node.name](c));
    }
    case "pow": {
      const b = toPolynomial(node.base);
      const e = toPolynomial(node.exp);
      if (!b || !e) return null;
      const ev = polyConstValue(e);
      if (ev === null) return null;
      const bv = polyConstValue(b);
      if (bv !== null) return polyConst(Math.pow(bv, ev));
      if (!Number.isInteger(ev) || ev < 0 || ev > MAX_POLY_DEGREE) return null;
      let r = polyConst(1);
      for (let k = 0; k < ev; k++) {
        r = polyMul(r, b);
        if (!r) return null;
      }
      return r;
    }
    case "bin": {
      const l = toPolynomial(node.left);
      const r = toPolynomial(node.right);
      if (!l || !r) return null;
      if (node.op === "+") return polyAdd(l, r);
      if (node.op === "-") return polyAdd(l, r, -1);
      if (node.op === "*") return polyMul(l, r);
      if (node.op === "/") {
        const d = polyConstValue(r);
        if (d === null || d === 0) return null;
        return polyMul(l, polyConst(1 / d));
      }
    }
  }
  return null;
}

function polyDegree(p, which) {
  let deg = -Infinity;
  for (const [k, v] of polyClean(p)) {
    const [i, j] = k.split(",").map(Number);
    const d = which === "x" ? i : which === "y" ? j : i + j;
    if (Math.abs(v) > 1e-12) deg = Math.max(deg, d);
  }
  return deg;
}
const polyCoef = (p, i, j) => p.get(`${i},${j}`) || 0;

// --- LaTeX ---
const PREC = { bin_add: 1, bin_mul: 2, neg: 3, pow: 4, atom: 5 };
const precOf = (n) => n.type === "bin" ? n.op === "+" || n.op === "-" ? PREC.bin_add : PREC.bin_mul : n.type === "neg" ? PREC.neg : n.type === "pow" ? PREC.pow : PREC.atom;
const FUNC_TEX = { sin: "\\sin", cos: "\\cos", tan: "\\tan", asin: "\\arcsin", acos: "\\arccos", atan: "\\arctan", ln: "\\ln", log: "\\log", exp: "\\exp", floor: "\\operatorname{floor}", ceil: "\\operatorname{ceil}", round: "\\operatorname{round}" };
function formatTexNumber(v) {
  return String(v).replace(".", "{,}");
}
function toTex(node) {
  const wrap = (child, minPrec) => precOf(child) < minPrec ? `\\left(${toTex(child)}\\right)` : toTex(child);
  switch (node.type) {
    case "num":
      return formatTexNumber(node.value);
    case "const":
      return node.name === "pi" ? "\\pi" : "e";
    case "var":
      return node.name;
    case "group":
      return node.arg.type === "bin" && node.arg.op === "/" ? toTex(node.arg) : `\\left(${toTex(node.arg)}\\right)`;
    case "neg":
      return `-${wrap(node.arg, PREC.bin_mul)}`;
    case "func":
      if (node.name === "sqrt") return `\\sqrt{${toTex(stripGroup(node.arg))}}`;
      if (node.name === "cbrt") return `\\sqrt[3]{${toTex(stripGroup(node.arg))}}`;
      if (node.name === "abs") return `\\left|${toTex(stripGroup(node.arg))}\\right|`;
      return `${FUNC_TEX[node.name] || node.name}\\left(${toTex(stripGroup(node.arg))}\\right)`;
    case "pow": {
      const base = node.base.type === "func" && node.base.name !== "sqrt" && node.base.name !== "abs" || precOf(node.base) <= PREC.pow ? `\\left(${toTex(stripGroup(node.base))}\\right)` : toTex(node.base);
      return `${base}^{${toTex(stripGroup(node.exp))}}`;
    }
    case "bin": {
      if (node.op === "/") return `\\frac{${toTex(stripGroup(node.left))}}{${toTex(stripGroup(node.right))}}`;
      if (node.op === "*") {
        const left = wrap(node.left, PREC.bin_mul);
        const right = wrap(node.right, PREC.neg + 1);
        const needsDot = !node.implicit || node.right.type === "num" || (node.left.type === "num" || node.left.type === "neg") && node.right.type === "num";
        return needsDot ? `${left} \\cdot ${right}` : `${left}${right}`;
      }
      if (node.op === "+" && node.right.type === "neg") return `${toTex(node.left)} - ${wrap(node.right.arg, PREC.bin_mul)}`;
      const right = node.right.type === "neg" ? `\\left(${toTex(node.right)}\\right)` : wrap(node.right, PREC.bin_mul);
      return `${toTex(node.left)} ${node.op} ${right}`;
    }
  }
  return "";
}
function stripGroup(node) {
  return node.type === "group" ? stripGroup(node.arg) : node;
}
const REL_TEX = { "=": "=", "<": "<", ">": ">", "<=": "\\le", ">=": "\\ge", "!=": "\\ne" };
function relationToTex(text) {
  const { sides, ops } = parseRelation(text);
  return sides.map((s, i) => (i > 0 ? ` ${REL_TEX[ops[i - 1]]} ` : "") + toTex(s)).join("");
}

export {
  MathSyntaxError,
  compile,
  normalizeInput,
  parseExpressionAst,
  parseRelation,
  polyCoef,
  polyDegree,
  relationToTex,
  toPolynomial,
  toTex,
  usesVar
};
