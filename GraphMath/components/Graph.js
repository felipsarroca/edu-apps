import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { THEMES, getExpressionColor } from "../constants.js";
import { prepareExpression, parseIntervalExpression, analyzeSystem, analyzeExpression, formatNumber, formatPoint } from "../services/mathService.js";
import { relationToTex } from "../services/parser.js";
const TOOLTIP_OFFSET = 15;
const DEFAULT_ZOOM = 50;
const LINE_WIDTH = 3.5;
const svgStringToImage = (svgString) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};
const renderMathJaxToImage = async (expr, textColor) => {
  if (!window.MathJax || !expr) return null;
  let tex;
  try {
    tex = relationToTex(expr);
  } catch (e) {
    tex = expr;
  }
  await window.MathJax.startup.promise;
  const container = await window.MathJax.tex2svgPromise(tex, { display: false });
  const svgEl = container.querySelector("svg");
  if (!svgEl) return null;
  const style = document.createElement("style");
  style.textContent = `* { fill: ${textColor} !important; color: ${textColor} !important; }`;
  svgEl.prepend(style);
  const svgString = svgEl.outerHTML;
  const viewBox = svgEl.getAttribute("viewBox")?.split(" ").map(Number);
  const originalWidth = viewBox ? viewBox[2] : 0;
  const originalHeight = viewBox ? viewBox[3] : 0;
  if (originalHeight === 0 || originalWidth === 0) return null;
  const desiredHeight = 22 * (window.devicePixelRatio || 1);
  const scale = desiredHeight / originalHeight;
  const img = await svgStringToImage(svgString);
  return { img, width: originalWidth * scale, height: desiredHeight };
};
const holds = (v, rel) => rel === "<" ? v < 0 : rel === ">" ? v > 0 : rel === "<=" ? v <= 0 : v >= 0;
const formatAxisNumber = (v) => Number(v.toPrecision(4)).toString().replace(".", ",").replace("-", "−");
const Graph = forwardRef(({ functions, theme, viewConfig }, ref) => {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: "", x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(DEFAULT_ZOOM);
  const pointersRef = useRef(/* @__PURE__ */ new Map());
  const pinchRef = useRef(null);
  const animationFrameId = useRef();
  const themeConfig = THEMES[theme];
  const screenToWorld = useCallback((screenX, screenY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const worldX = (screenX - panRef.current.x - rect.width / 2) / zoomRef.current;
    const worldY = (screenY - panRef.current.y - rect.height / 2) / -zoomRef.current;
    return { x: worldX, y: worldY };
  }, []);
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = rect.width;
    const H = rect.height;
    ctx.fillStyle = themeConfig.bgColorValue;
    ctx.fillRect(0, 0, W, H);
    const pan = panRef.current;
    const zoom = zoomRef.current;
    const view = {
      W,
      H,
      zoom,
      toScreen: (wx, wy) => ({ x: wx * zoom + pan.x + W / 2, y: -wy * zoom + pan.y + H / 2 }),
      toWorldX: (sx) => (sx - pan.x - W / 2) / zoom,
      toWorldY: (sy) => (sy - pan.y - H / 2) / -zoom
    };
    const worldLeft = view.toWorldX(0);
    const worldRight = view.toWorldX(W);
    const worldTop = view.toWorldY(0);
    const worldBottom = view.toWorldY(H);
    if (viewConfig.grid) drawGrid(ctx, worldLeft, worldRight, worldBottom, worldTop, view);
    drawAxes(ctx, view);
    if (viewConfig.labels) drawLabels(ctx, worldLeft, worldRight, worldBottom, worldTop, view);
    const pointLayer = [];
    functions.forEach((func) => {
      const inSystem = func.type === "system";
      const domainInterval = !inSystem && func.domainRestriction ? parseIntervalExpression(func.domainRestriction) : null;
      func.expressions.forEach((expression, index) => {
        const prep = prepareExpression(expression, { inSystem });
        if (!prep.ok) return;
        const color = getExpressionColor(func, index);
        drawPrepared(ctx, prep, color, view, domainInterval);
        if (!inSystem && (prep.kind === "equationX" || prep.kind === "inequalityX")) {
          const analysis = analyzeExpression(expression);
          const sols = (analysis.solutions || []).filter((x) => x >= worldLeft && x <= worldRight).slice(0, 30);
          sols.forEach((x, k) => {
            const inclusive = prep.kind === "equationX" || prep.relation.includes("=");
            const name = sols.length > 1 && prep.kind === "equationX" ? `x${"₁₂₃₄₅₆₇₈₉"[k] || ""}` : "x";
            pointLayer.push({ x, y: 0, color, label: `${name} = ${formatNumber(x)}`, open: !inclusive });
          });
        }
      });
      if (inSystem) {
        const analysis = analyzeSystem(func.expressions);
        (analysis.intersectionPoints || []).forEach((p) => pointLayer.push({ x: p.x, y: p.y, label: formatPoint(p), solution: true }));
      }
    });
    const placed = [];
    pointLayer.forEach((p) => drawPoint(ctx, p, view, placed));
  }, [functions, theme, viewConfig]);
  const redraw = useCallback(() => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(draw);
  }, [draw]);
  const zoomAt = useCallback((factor, sx, sy) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const newZoom = Math.min(5e4, Math.max(0.05, zoomRef.current * factor));
    const { x: worldX, y: worldY } = screenToWorld(sx, sy);
    panRef.current.x = sx - worldX * newZoom - rect.width / 2;
    panRef.current.y = sy + worldY * newZoom - rect.height / 2;
    zoomRef.current = newZoom;
    redraw();
  }, [redraw, screenToWorld]);
  const zoomCenter = useCallback((factor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    zoomAt(factor, rect.width / 2, rect.height / 2);
  }, [zoomAt]);
  const handleZoomIn = useCallback(() => zoomCenter(1.25), [zoomCenter]);
  const handleZoomOut = useCallback(() => zoomCenter(1 / 1.25), [zoomCenter]);
  const handleResetView = useCallback(() => {
    panRef.current = { x: 0, y: 0 };
    zoomRef.current = DEFAULT_ZOOM;
    redraw();
  }, [redraw]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redraw();
    const handleResize = () => redraw();
    window.addEventListener("resize", handleResize);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => redraw()) : null;
    resizeObserver?.observe(canvas);
    const localPos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const handleWheel = (e) => {
      e.preventDefault();
      const { x, y } = localPos(e);
      zoomAt(e.deltaY < 0 ? 1.1 : 1 / 1.1, x, y);
    };
    const handlePointerDown = (e) => {
      canvas.setPointerCapture?.(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointersRef.current.size === 2) {
        const [a, b] = [...pointersRef.current.values()];
        pinchRef.current = Math.hypot(a.x - b.x, a.y - b.y);
      }
      canvas.style.cursor = "grabbing";
    };
    const handlePointerMove = (e) => {
      const { x, y } = localPos(e);
      if (e.pointerType === "mouse") {
        const w = screenToWorld(x, y);
        setTooltip({ visible: true, content: `(${formatAxisNumber(Number(w.x.toFixed(2)))}; ${formatAxisNumber(Number(w.y.toFixed(2)))})`, x, y });
      }
      const prev = pointersRef.current.get(e.pointerId);
      if (!prev) return;
      if (pointersRef.current.size === 1) {
        panRef.current = { x: panRef.current.x + e.clientX - prev.x, y: panRef.current.y + e.clientY - prev.y };
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        redraw();
      } else if (pointersRef.current.size === 2) {
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...pointersRef.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const r = canvas.getBoundingClientRect();
        if (pinchRef.current && dist > 0) zoomAt(dist / pinchRef.current, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
        pinchRef.current = dist;
      }
    };
    const handlePointerUp = (e) => {
      pointersRef.current.delete(e.pointerId);
      pinchRef.current = null;
      if (pointersRef.current.size === 0) canvas.style.cursor = "grab";
    };
    const handlePointerLeave = (e) => {
      if (e.pointerType === "mouse") setTooltip((t) => ({ ...t, visible: false }));
    };
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [redraw, screenToWorld, zoomAt]);
  const getGridSpacing = (zoom) => {
    const minWorldSpacing = 60 / zoom;
    const magnitude = Math.pow(10, Math.floor(Math.log10(minWorldSpacing)));
    for (const m of [1, 2, 5, 10]) if (m * magnitude >= minWorldSpacing) return m * magnitude;
    return 10 * magnitude;
  };
  const drawGrid = (ctx, worldLeft, worldRight, worldBottom, worldTop, view) => {
    const spacing = getGridSpacing(view.zoom);
    // Quadrícula secundària
    ctx.strokeStyle = themeConfig.grid;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const minor = spacing / 5;
    for (let x = Math.floor(worldLeft / minor) * minor; x < worldRight; x += minor) {
      const sx = Math.round(view.toScreen(x, 0).x) + 0.5;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, view.H);
    }
    for (let y = Math.floor(worldBottom / minor) * minor; y < worldTop; y += minor) {
      const sy = Math.round(view.toScreen(0, y).y) + 0.5;
      ctx.moveTo(0, sy);
      ctx.lineTo(view.W, sy);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    for (let x = Math.floor(worldLeft / spacing) * spacing; x < worldRight; x += spacing) {
      const sx = Math.round(view.toScreen(x, 0).x) + 0.5;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, view.H);
    }
    for (let y = Math.floor(worldBottom / spacing) * spacing; y < worldTop; y += spacing) {
      const sy = Math.round(view.toScreen(0, y).y) + 0.5;
      ctx.moveTo(0, sy);
      ctx.lineTo(view.W, sy);
    }
    ctx.stroke();
  };
  const drawAxes = (ctx, view) => {
    ctx.strokeStyle = themeConfig.textColorValue;
    ctx.fillStyle = themeConfig.textColorValue;
    ctx.lineWidth = 1.5;
    const { x: originX, y: originY } = view.toScreen(0, 0);
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, view.H);
    ctx.moveTo(0, originY);
    ctx.lineTo(view.W, originY);
    ctx.stroke();
    // Fletxes dels eixos
    ctx.beginPath();
    if (originY > 0 && originY < view.H) {
      ctx.moveTo(view.W, originY);
      ctx.lineTo(view.W - 10, originY - 5);
      ctx.lineTo(view.W - 10, originY + 5);
    }
    if (originX > 0 && originX < view.W) {
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX - 5, 10);
      ctx.lineTo(originX + 5, 10);
    }
    ctx.fill();
  };
  const drawLabels = (ctx, worldLeft, worldRight, worldBottom, worldTop, view) => {
    ctx.fillStyle = themeConfig.secondaryTextColorValue;
    ctx.font = "12px sans-serif";
    const spacing = getGridSpacing(view.zoom);
    const { x: originX, y: originY } = view.toScreen(0, 0);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let x = Math.floor(worldLeft / spacing) * spacing; x < worldRight; x += spacing) {
      if (Math.abs(x) < spacing * 1e-6) continue;
      const sx = view.toScreen(x, 0).x;
      ctx.fillText(formatAxisNumber(x), sx, Math.max(4, Math.min(view.H - 18, originY + 5)));
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let y = Math.floor(worldBottom / spacing) * spacing; y < worldTop; y += spacing) {
      if (Math.abs(y) < spacing * 1e-6) continue;
      const sy = view.toScreen(0, y).y;
      ctx.fillText(formatAxisNumber(y), Math.max(30, Math.min(view.W - 4, originX - 6)), sy);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("0", originX - 5, originY + 5);
    ctx.fillStyle = themeConfig.textColorValue;
    ctx.font = "italic bold 17px serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("x", view.W - 8, Math.min(view.H - 4, Math.max(20, originY - 6)));
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("y", Math.max(4, Math.min(view.W - 16, originX + 8)), 4);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  };
  // Recorre una funció explícita (y = f(x) o x = g(y)) i en retorna els trams continus en coordenades de pantalla
  const sampleExplicit = (prep, view, domainInterval) => {
    const isY = prep.kind === "explicitY" || prep.kind === "equationX" || prep.kind === "inequalityX";
    const length = isY ? view.W : view.H;
    const limit = isY ? view.H : view.W;
    const segments = [];
    let current = [];
    let prev = null;
    const close = () => {
      if (current.length > 1) segments.push(current);
      current = [];
      prev = null;
    };
    const step = 0.5;
    for (let s = -1; s <= length + 1; s += step) {
      const u = isY ? view.toWorldX(s) : view.toWorldY(s);
      if (domainInterval) {
        const v = domainInterval.variable === "x" ? isY ? u : NaN : isY ? NaN : u;
        if (Number.isFinite(v)) {
          const inside = (v > domainInterval.lowerBound || domainInterval.lowerInclusive && v >= domainInterval.lowerBound) && (v < domainInterval.upperBound || domainInterval.upperInclusive && v <= domainInterval.upperBound);
          if (!inside) {
            close();
            continue;
          }
        }
      }
      let w;
      try {
        w = prep.fn(u);
      } catch (e) {
        w = NaN;
      }
      if (!Number.isFinite(w)) {
        close();
        continue;
      }
      const sc = isY ? view.toScreen(u, w).y : view.toScreen(w, u).x;
      // Salt d'una asímptota: es trenca el traç
      if (prev !== null && (prev < -limit && sc > 2 * limit || prev > 2 * limit && sc < -limit)) close();
      const clamped = Math.max(-10 * limit, Math.min(11 * limit, sc));
      current.push(isY ? { x: s, y: clamped } : { x: clamped, y: s });
      prev = sc;
    }
    close();
    return { segments, isY };
  };
  const strokeSegments = (ctx, segments) => {
    ctx.beginPath();
    for (const seg of segments) {
      ctx.moveTo(seg[0].x, seg[0].y);
      for (let i = 1; i < seg.length; i++) ctx.lineTo(seg[i].x, seg[i].y);
    }
    ctx.stroke();
  };
  const setLineStyle = (ctx, color, dashed, width = LINE_WIDTH) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash(dashed ? [10, 8] : []);
  };
  // Marching squares per a corbes implícites F(x, y) = 0
  const implicitSegments = (F, view, cell = 4) => {
    const nx = Math.ceil(view.W / cell) + 1;
    const ny = Math.ceil(view.H / cell) + 1;
    const vals = new Float64Array(nx * ny);
    for (let j = 0; j < ny; j++) {
      const wy = view.toWorldY(j * cell);
      for (let i = 0; i < nx; i++) {
        const v = F(view.toWorldX(i * cell), wy);
        vals[j * nx + i] = Number.isFinite(v) ? v : NaN;
      }
    }
    const lines = [];
    const edgePoint = (i0, j0, v0, i1, j1, v1) => {
      const t = v0 / (v0 - v1);
      const sx = (i0 + (i1 - i0) * t) * cell;
      const sy = (j0 + (j1 - j0) * t) * cell;
      const fv = F(view.toWorldX(sx), view.toWorldY(sy));
      // Descarta canvis de signe deguts a discontinuïtats
      if (!Number.isFinite(fv) || Math.abs(fv) > Math.max(Math.abs(v0), Math.abs(v1))) return null;
      return { x: sx, y: sy };
    };
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const v0 = vals[j * nx + i];
        const v1 = vals[j * nx + i + 1];
        const v2 = vals[(j + 1) * nx + i + 1];
        const v3 = vals[(j + 1) * nx + i];
        if (Number.isNaN(v0) || Number.isNaN(v1) || Number.isNaN(v2) || Number.isNaN(v3)) continue;
        const pts = [];
        const cross = (a, b) => a === 0 && b !== 0 || a < 0 !== b < 0 && b !== 0;
        if (cross(v0, v1)) pts[0] = edgePoint(i, j, v0, i + 1, j, v1);
        if (cross(v1, v2)) pts[1] = edgePoint(i + 1, j, v1, i + 1, j + 1, v2);
        if (cross(v2, v3)) pts[2] = edgePoint(i + 1, j + 1, v2, i, j + 1, v3);
        if (cross(v3, v0)) pts[3] = edgePoint(i, j + 1, v3, i, j, v0);
        const found = [0, 1, 2, 3].filter((k) => pts[k]);
        if (found.length === 2) {
          lines.push([pts[found[0]], pts[found[1]]]);
        } else if (found.length === 4) {
          const center = F(view.toWorldX((i + 0.5) * cell), view.toWorldY((j + 0.5) * cell));
          if (center < 0 === v0 < 0) {
            lines.push([pts[0], pts[1]], [pts[2], pts[3]]);
          } else {
            lines.push([pts[0], pts[3]], [pts[1], pts[2]]);
          }
        }
      }
    }
    return lines;
  };
  const drawPrepared = (ctx, prep, color, view, domainInterval) => {
    const strict = prep.relation === "<" || prep.relation === ">";
    if (prep.kind === "explicitY" || prep.kind === "explicitX") {
      const { segments, isY } = sampleExplicit(prep, view, domainInterval);
      if (prep.relation !== "=") {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.22;
        const toMax = prep.relation.startsWith(">");
        ctx.beginPath();
        for (const seg of segments) {
          const first = seg[0];
          const last = seg[seg.length - 1];
          ctx.moveTo(first.x, first.y);
          for (let i = 1; i < seg.length; i++) ctx.lineTo(seg[i].x, seg[i].y);
          if (isY) {
            const bound = toMax ? 0 : view.H;
            ctx.lineTo(last.x, bound);
            ctx.lineTo(first.x, bound);
          } else {
            const bound = toMax ? view.W : 0;
            ctx.lineTo(bound, last.y);
            ctx.lineTo(bound, first.y);
          }
          ctx.closePath();
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      setLineStyle(ctx, color, strict);
      strokeSegments(ctx, segments);
      ctx.setLineDash([]);
      if (domainInterval && domainInterval.variable === "x" && isY) {
        const endpoint = (x, inclusive) => {
          if (!Number.isFinite(x)) return;
          const y = prep.fn(x);
          if (!Number.isFinite(y)) return;
          const { x: sx, y: sy } = view.toScreen(x, y);
          ctx.beginPath();
          ctx.arc(sx, sy, 5.5, 0, 2 * Math.PI);
          ctx.fillStyle = inclusive ? color : themeConfig.bgColorValue;
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        };
        endpoint(domainInterval.lowerBound, domainInterval.lowerInclusive);
        endpoint(domainInterval.upperBound, domainInterval.upperInclusive);
      }
      return;
    }
    if (prep.kind === "equationX" || prep.kind === "inequalityX") {
      if (prep.kind === "inequalityX") {
        const intervals = analyzeExpression(prep.source).intervals || [];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.16;
        for (const iv of intervals) {
          if (iv.point) continue;
          const a = Number.isFinite(iv.a) ? view.toScreen(iv.a, 0).x : -10;
          const b = Number.isFinite(iv.b) ? view.toScreen(iv.b, 0).x : view.W + 10;
          ctx.fillRect(a, 0, b - a, view.H);
        }
        ctx.globalAlpha = 1;
        // Solució marcada sobre l'eix X
        const { y: originY } = view.toScreen(0, 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = 7;
        ctx.globalAlpha = 0.85;
        ctx.lineCap = "butt";
        ctx.beginPath();
        for (const iv of intervals) {
          if (iv.point) continue;
          const a = Number.isFinite(iv.a) ? view.toScreen(iv.a, 0).x : -10;
          const b = Number.isFinite(iv.b) ? view.toScreen(iv.b, 0).x : view.W + 10;
          ctx.moveTo(a, originY);
          ctx.lineTo(b, originY);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      const { segments } = sampleExplicit(prep, view, null);
      ctx.globalAlpha = 0.75;
      setLineStyle(ctx, color, false, 2.5);
      strokeSegments(ctx, segments);
      ctx.globalAlpha = 1;
      return;
    }
    if (prep.kind === "implicit") {
      const F = prep.D;
      if (prep.relation !== "=") {
        const cell = 3;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        for (let sy = 0; sy < view.H; sy += cell) {
          const wy = view.toWorldY(sy + cell / 2);
          let runStart = null;
          for (let sx = 0; sx <= view.W + cell; sx += cell) {
            const v = sx <= view.W ? F(view.toWorldX(sx + cell / 2), wy) : NaN;
            const ok = Number.isFinite(v) && holds(v, prep.relation);
            if (ok && runStart === null) runStart = sx;
            if (!ok && runStart !== null) {
              ctx.rect(runStart, sy, sx - runStart, cell);
              runStart = null;
            }
          }
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      setLineStyle(ctx, color, strict);
      const lines = implicitSegments(F, view);
      ctx.beginPath();
      for (const [a, b] of lines) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    if (prep.kind === "interval") {
      const iv = prep.interval;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.22;
      if (iv.variable === "x") {
        const a = Number.isFinite(iv.lowerBound) ? view.toScreen(iv.lowerBound, 0).x : -10;
        const b = Number.isFinite(iv.upperBound) ? view.toScreen(iv.upperBound, 0).x : view.W + 10;
        ctx.fillRect(a, 0, b - a, view.H);
      } else {
        const a = Number.isFinite(iv.upperBound) ? view.toScreen(0, iv.upperBound).y : -10;
        const b = Number.isFinite(iv.lowerBound) ? view.toScreen(0, iv.lowerBound).y : view.H + 10;
        ctx.fillRect(0, a, view.W, b - a);
      }
      ctx.globalAlpha = 1;
      const boundary = (val, inclusive) => {
        if (!Number.isFinite(val)) return;
        setLineStyle(ctx, color, !inclusive, 2.5);
        ctx.beginPath();
        if (iv.variable === "x") {
          const { x } = view.toScreen(val, 0);
          ctx.moveTo(x, 0);
          ctx.lineTo(x, view.H);
        } else {
          const { y } = view.toScreen(0, val);
          ctx.moveTo(0, y);
          ctx.lineTo(view.W, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };
      boundary(iv.lowerBound, iv.lowerInclusive);
      boundary(iv.upperBound, iv.upperInclusive);
    }
  };
  const drawPoint = (ctx, p, view, placed) => {
    const { x: sx, y: sy } = view.toScreen(p.x, p.y);
    if (sx < -20 || sx > view.W + 20 || sy < -20 || sy > view.H + 20) return;
    ctx.setLineDash([]);
    if (p.solution) {
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, 2 * Math.PI);
      ctx.fillStyle = themeConfig.bgColorValue;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = themeConfig.textColorValue;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = themeConfig.textColorValue;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(sx, sy, 6.5, 0, 2 * Math.PI);
      ctx.fillStyle = p.open ? themeConfig.bgColorValue : p.color;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = p.open ? p.color : themeConfig.textColorValue;
      ctx.stroke();
    }
    if (!viewConfig.points || !p.label) return;
    ctx.font = "bold 14px sans-serif";
    const textWidth = ctx.measureText(p.label).width;
    const boxW = textWidth + 14;
    const boxH = 24;
    // Busca una posició per a l'etiqueta que no se superposi amb les ja dibuixades
    const candidates = [[12, -12 - boxH], [-12 - boxW, -12 - boxH], [12, 12], [-12 - boxW, 12], [12, -24 - 2 * boxH], [-12 - boxW, -24 - 2 * boxH], [12, 24 + boxH], [-12 - boxW, 24 + boxH]];
    const fits = (x, y) => x >= 2 && y >= 2 && x + boxW <= view.W - 2 && y + boxH <= view.H - 2;
    const free = (x, y) => placed.every((b) => x + boxW < b.x || x > b.x + b.w || y + boxH < b.y || y > b.y + b.h);
    let [bx, by] = [sx + candidates[0][0], sy + candidates[0][1]];
    const choice = candidates.find(([dx, dy]) => fits(sx + dx, sy + dy) && free(sx + dx, sy + dy)) || candidates.find(([dx, dy]) => fits(sx + dx, sy + dy));
    if (choice) [bx, by] = [sx + choice[0], sy + choice[1]];
    placed.push({ x: bx, y: by, w: boxW, h: boxH });
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = themeConfig.bgColorValue;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, boxW, boxH, 6);
    else ctx.rect(bx, by, boxW, boxH);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = p.solution ? themeConfig.textColorValue : p.color;
    ctx.stroke();
    ctx.fillStyle = themeConfig.textColorValue;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(p.label, bx + 7, by + boxH / 2 + 1);
    ctx.textBaseline = "alphabetic";
  };
  useImperativeHandle(ref, () => ({
    async downloadImage() {
      const sourceCanvas = canvasRef.current;
      if (!sourceCanvas) return;
      const dpr = window.devicePixelRatio || 1;
      const PADDING = 20 * dpr;
      const LEGEND_TOP_MARGIN = 20 * dpr;
      const LEGEND_ITEM_SPACING = 24 * dpr;
      const LEGEND_COLOR_BOX_SIZE = 18 * dpr;
      const LEGEND_BOX_TEXT_SPACING = 8 * dpr;
      const items = functions.flatMap((f) => f.expressions.filter((e) => e.trim() !== "").map((expr, i) => ({ expr, color: getExpressionColor(f, i) })));
      if (items.length === 0) {
        const link2 = document.createElement("a");
        link2.download = "grafica.png";
        link2.href = sourceCanvas.toDataURL("image/png");
        link2.click();
        return;
      }
      const images = await Promise.all(items.map((it) => renderMathJaxToImage(it.expr, themeConfig.textColorValue).catch(() => null)));
      const legend = items.map((it, i) => ({ ...it, imgData: images[i] })).filter((it) => it.imgData);
      const rows = [];
      let row = [];
      let rowWidth = 0;
      const maxWidth = sourceCanvas.width - 2 * PADDING;
      for (const it of legend) {
        const w = LEGEND_COLOR_BOX_SIZE + LEGEND_BOX_TEXT_SPACING + it.imgData.width;
        if (row.length && rowWidth + LEGEND_ITEM_SPACING + w > maxWidth) {
          rows.push({ row, rowWidth });
          row = [];
          rowWidth = 0;
        }
        rowWidth += (row.length ? LEGEND_ITEM_SPACING : 0) + w;
        row.push({ ...it, w });
      }
      if (row.length) rows.push({ row, rowWidth });
      const rowHeight = Math.max(...legend.map((it) => it.imgData.height), LEGEND_COLOR_BOX_SIZE) + 10 * dpr;
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = sourceCanvas.width;
      targetCanvas.height = sourceCanvas.height + LEGEND_TOP_MARGIN + rows.length * rowHeight + PADDING;
      const ctx = targetCanvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = themeConfig.bgColorValue;
      ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(sourceCanvas, 0, 0);
      rows.forEach(({ row: r, rowWidth: rw }, ri) => {
        const y = sourceCanvas.height + LEGEND_TOP_MARGIN + ri * rowHeight;
        let x = (targetCanvas.width - rw) / 2;
        for (const it of r) {
          ctx.fillStyle = it.color;
          ctx.fillRect(x, y + (rowHeight - LEGEND_COLOR_BOX_SIZE) / 2, LEGEND_COLOR_BOX_SIZE, LEGEND_COLOR_BOX_SIZE);
          x += LEGEND_COLOR_BOX_SIZE + LEGEND_BOX_TEXT_SPACING;
          ctx.drawImage(it.imgData.img, x, y + (rowHeight - it.imgData.height) / 2, it.imgData.width, it.imgData.height);
          x += it.imgData.width + LEGEND_ITEM_SPACING;
        }
      });
      const link = document.createElement("a");
      link.download = "grafica.png";
      link.href = targetCanvas.toDataURL("image/png");
      link.click();
    }
  }));
  const roundButton = `w-10 h-10 flex items-center justify-center rounded-full shadow-lg text-lg font-bold transition-transform transform hover:scale-105 ${themeConfig.buttonBg} ${themeConfig.buttonHover}`;
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full relative touch-none", style: { touchAction: "none" }, children: [
    /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "w-full h-full block", style: { cursor: "grab", touchAction: "none" } }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 right-4 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: handleZoomIn, className: roundButton, title: "Apropa", "aria-label": "Apropa", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus" }) }),
      /* @__PURE__ */ jsx("button", { onClick: handleZoomOut, className: roundButton, title: "Allunya", "aria-label": "Allunya", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-minus" }) }),
      /* @__PURE__ */ jsx("button", { onClick: handleResetView, className: roundButton, title: "Torna a la vista inicial", "aria-label": "Torna a la vista inicial", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-house" }) })
    ] }),
    tooltip.visible && /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute pointer-events-none px-2 py-1 rounded-md shadow-lg font-mono text-sm ${themeConfig.panelBg} ${themeConfig.text}`,
        style: { left: tooltip.x + TOOLTIP_OFFSET, top: tooltip.y + TOOLTIP_OFFSET },
        children: tooltip.content
      }
    )
  ] });
});
export {
  Graph
};
