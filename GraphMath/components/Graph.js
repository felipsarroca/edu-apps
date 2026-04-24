import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { THEMES } from "../constants.js";
import { parseExpression, parseIntervalExpression, analyzeSystem } from "../services/mathService.js";
const TOOLTIP_OFFSET = 15;
const formatSubExpression = (subExpr) => {
  const expr = subExpr.trim();
  if (!expr) return "";
  if (expr.startsWith("(") && expr.endsWith(")")) {
    let depth2 = 0;
    let isWrapped = true;
    for (let i = 0; i < expr.length - 1; i++) {
      if (expr[i] === "(") depth2++;
      else if (expr[i] === ")") depth2--;
      if (depth2 === 0) {
        isWrapped = false;
        break;
      }
    }
    if (isWrapped) return `(${formatSubExpression(expr.slice(1, -1))})`;
  }
  let depth = 0;
  for (let i = expr.length - 1; i >= 0; i--) {
    const char = expr[i];
    if (char === ")") depth++;
    else if (char === "(") depth--;
    else if ((char === "+" || char === "-") && depth === 0) {
      if (i > 0 && !["+", "-", "*", "/"].includes(expr[i - 1].trim())) {
        return `${formatSubExpression(expr.slice(0, i))} ${char} ${formatSubExpression(expr.slice(i + 1))}`;
      }
    }
  }
  depth = 0;
  for (let i = expr.length - 1; i >= 0; i--) {
    const char = expr[i];
    if (char === ")") depth++;
    else if (char === "(") depth--;
    else if (char === "/" && depth === 0) return `\\frac{${formatSubExpression(expr.slice(0, i))}}{${formatSubExpression(expr.slice(i + 1))}}`;
  }
  depth = 0;
  for (let i = expr.length - 1; i >= 0; i--) {
    const char = expr[i];
    if (char === ")") depth++;
    else if (char === "(") depth--;
    else if (char === "*" && depth === 0) return `${formatSubExpression(expr.slice(0, i))} \\cdot ${formatSubExpression(expr.slice(i + 1))}`;
  }
  if (expr.startsWith("sqrt(") && expr.endsWith(")")) return `\\sqrt{${formatSubExpression(expr.slice(5, -1))}}`;
  return expr;
};
const formatExpressionForMathJax = (expr) => {
  let expressionToFormat = expr;
  if (!expressionToFormat || expressionToFormat.trim() === "") return "";
  const texifyOperator = (op) => op.replace(/<=/g, " \\le ").replace(/≤/g, " \\le ").replace(/>=/g, " \\ge ").replace(/≥/g, " \\ge ").replace(/</g, " \\lt ").replace(/>/g, " \\gt ").replace(/=/g, " = ");
  const operatorMatch = expressionToFormat.match(/(<=|>=|≤|≥|<|>|=)/);
  let formatted;
  if (operatorMatch && operatorMatch.index !== void 0 && operatorMatch.index > 0) {
    const op = operatorMatch[0];
    const opIndex = operatorMatch.index;
    let lhs = expressionToFormat.substring(0, opIndex).trim();
    let rhs = expressionToFormat.substring(opIndex + op.length).trim();
    formatted = `${lhs} ${texifyOperator(op)} ${formatSubExpression(rhs)}`;
  } else {
    const parts = expressionToFormat.split(/(<=|>=|≤|≥|<|>|=)/).filter((p) => p);
    if (parts.length > 1) {
      formatted = parts.map((part, index) => index % 2 === 1 ? texifyOperator(part) : formatSubExpression(part)).join("");
    } else {
      formatted = formatSubExpression(expressionToFormat);
    }
  }
  return `\\(${formatted}\\)`;
};
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
  const tex = formatExpressionForMathJax(expr);
  const cleanTex = tex.replace(/^\\\(/, "").replace(/\\\)$/, "");
  await window.MathJax.startup.promise;
  const container = await window.MathJax.tex2svgPromise(cleanTex, { display: false });
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
  const desiredHeight = 20;
  const scale = desiredHeight / originalHeight;
  const finalWidth = originalWidth * scale;
  const img = await svgStringToImage(svgString);
  return { img, width: finalWidth, height: desiredHeight };
};
const Graph = forwardRef(({ functions, theme, viewConfig }, ref) => {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: "", x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(50);
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
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
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.scale(dpr, dpr);
    const viewWidth = rect.width;
    const viewHeight = rect.height;
    ctx.fillStyle = themeConfig.bgColorValue;
    ctx.fillRect(0, 0, viewWidth, viewHeight);
    const pan = panRef.current;
    const zoom = zoomRef.current;
    const worldToScreen = (worldX, worldY) => {
      const screenX = worldX * zoom + pan.x + viewWidth / 2;
      const screenY = -worldY * zoom + pan.y + viewHeight / 2;
      return { x: screenX, y: screenY };
    };
    const { x: worldLeft } = screenToWorld(0, 0);
    const { y: worldTop } = screenToWorld(0, 0);
    const { x: worldRight } = screenToWorld(viewWidth, viewHeight);
    const { y: worldBottom } = screenToWorld(viewWidth, viewHeight);
    if (viewConfig.grid) drawGrid(ctx, worldLeft, worldRight, worldBottom, worldTop, worldToScreen, zoom);
    drawAxes(ctx, worldToScreen);
    if (viewConfig.labels) drawLabels(ctx, worldLeft, worldRight, worldBottom, worldTop, worldToScreen, zoom);
    functions.forEach((func) => {
      drawFunction(ctx, func, screenToWorld, worldToScreen, zoom);
    });
    functions.forEach((func) => {
      if (func.type === "system") {
        const analysis = analyzeSystem(func.expressions);
        if (analysis.intersectionPoints && analysis.intersectionPoints.length > 0) {
          analysis.intersectionPoints.forEach((p) => {
            const { x: sx, y: sy } = worldToScreen(p.x, p.y);
            const pointRadius = 6;
            const outlineColor = theme === "light" ? "#000" : "#fff";
            const outlineWidth = 2;
            ctx.fillStyle = outlineColor;
            ctx.beginPath();
            ctx.arc(sx, sy, pointRadius + outlineWidth, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = func.color;
            ctx.beginPath();
            ctx.arc(sx, sy, pointRadius, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      }
    });
  }, [functions, theme, viewConfig, screenToWorld]);
  const redraw = useCallback(() => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(draw);
  }, [draw]);
  const handleZoom = useCallback((zoomFactor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const oldZoom = zoomRef.current;
    const newZoom = oldZoom * zoomFactor;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const { x: worldX, y: worldY } = screenToWorld(centerX, centerY);
    panRef.current.x = centerX - worldX * newZoom - rect.width / 2;
    panRef.current.y = centerY + worldY * newZoom - rect.height / 2;
    zoomRef.current = newZoom;
    redraw();
  }, [redraw, screenToWorld]);
  const handleZoomIn = useCallback(() => handleZoom(1.2), [handleZoom]);
  const handleZoomOut = useCallback(() => handleZoom(1 / 1.2), [handleZoom]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redraw();
    const handleResize = () => redraw();
    window.addEventListener("resize", handleResize);
    const handleWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const oldZoom = zoomRef.current;
      const newZoom = oldZoom * zoomFactor;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const { x: worldX, y: worldY } = screenToWorld(mouseX, mouseY);
      panRef.current.x = mouseX - worldX * newZoom - rect.width / 2;
      panRef.current.y = mouseY + worldY * newZoom - rect.height / 2;
      zoomRef.current = newZoom;
      redraw();
    };
    const handleMouseDown = (e) => {
      isPanningRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const { x, y } = screenToWorld(mouseX, mouseY);
      setTooltip({ visible: true, content: `(${x.toFixed(2)}, ${y.toFixed(2)})`, x: e.clientX, y: e.clientY });
      if (isPanningRef.current) {
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        panRef.current = { x: panRef.current.x + dx, y: panRef.current.y + dy };
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        redraw();
      }
    };
    const handleMouseUp = () => {
      isPanningRef.current = false;
      canvas.style.cursor = "grab";
    };
    const handleMouseLeave = () => {
      setTooltip((t) => ({ ...t, visible: false }));
    };
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [redraw, screenToWorld]);
  const getGridSpacing = (zoom) => {
    const minPixelSpacing = 60;
    const minWorldSpacing = minPixelSpacing / zoom;
    const magnitudes = [0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1e3];
    return magnitudes.find((m) => m > minWorldSpacing) || magnitudes[magnitudes.length - 1];
  };
  const drawGrid = (ctx, worldLeft, worldRight, worldBottom, worldTop, worldToScreen, zoom) => {
    ctx.strokeStyle = themeConfig.grid;
    ctx.lineWidth = 1;
    const spacing = getGridSpacing(zoom);
    const canvas = ctx.canvas;
    ctx.beginPath();
    for (let x = Math.floor(worldLeft / spacing) * spacing; x < worldRight; x += spacing) {
      const { x: screenX } = worldToScreen(x, 0);
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, canvas.height);
    }
    for (let y = Math.floor(worldBottom / spacing) * spacing; y < worldTop; y += spacing) {
      const { y: screenY } = worldToScreen(0, y);
      ctx.moveTo(0, screenY);
      ctx.lineTo(canvas.width, screenY);
    }
    ctx.stroke();
  };
  const drawAxes = (ctx, worldToScreen) => {
    ctx.strokeStyle = themeConfig.textColorValue;
    ctx.lineWidth = 1.5;
    const canvas = ctx.canvas;
    ctx.beginPath();
    const { x: originX, y: originY } = worldToScreen(0, 0);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, canvas.height);
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();
  };
  const drawLabels = (ctx, worldLeft, worldRight, worldBottom, worldTop, worldToScreen, zoom) => {
    ctx.fillStyle = themeConfig.secondaryTextColorValue;
    ctx.font = "12px sans-serif";
    const canvas = ctx.canvas;
    const spacing = getGridSpacing(zoom);
    for (let x = Math.floor(worldLeft / spacing) * spacing; x < worldRight; x += spacing) {
      if (Math.abs(x) < 1e-9) continue;
      const { x: screenX, y: originY2 } = worldToScreen(x, 0);
      ctx.fillText(Number(x.toPrecision(4)).toString(), screenX + 5, Math.max(15, Math.min(canvas.height - 5, originY2 + 15)));
    }
    for (let y = Math.floor(worldBottom / spacing) * spacing; y < worldTop; y += spacing) {
      if (Math.abs(y) < 1e-9) continue;
      const { x: originX2, y: screenY } = worldToScreen(0, y);
      ctx.fillText(Number(y.toPrecision(4)).toString(), Math.max(5, Math.min(canvas.width - 20, originX2 + 5)), screenY - 5);
    }
    const { x: originX, y: originY } = worldToScreen(0, 0);
    ctx.fillText("0", originX + 5, originY + 15);
    ctx.fillStyle = themeConfig.textColorValue;
    ctx.font = "italic 16px sans-serif";
    const xLabelYPos = originY > canvas.height - 25 ? originY - 15 : originY + 20;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("eix x", canvas.width - 10, xLabelYPos);
    const yLabelXPos = originX < 25 ? originX + 10 : originX - 15;
    ctx.textAlign = originX < 25 ? "left" : "right";
    ctx.textBaseline = "top";
    ctx.fillText("eix y", yLabelXPos, 10);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  };
  const drawImplicitLinearEquation = (ctx, coefficients, screenToWorld2, worldToScreen) => {
    const { a, b, c } = coefficients;
    const canvas = ctx.canvas;
    const points = [];
    const addPoint = (x, y) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const screenPoint = worldToScreen(x, y);
      if (Number.isFinite(screenPoint.x) && Number.isFinite(screenPoint.y)) {
        points.push(screenPoint);
      }
    };
    if (Math.abs(b) > 1e-12) {
      const leftWorld = screenToWorld2(0, 0).x;
      const rightWorld = screenToWorld2(canvas.width, 0).x;
      addPoint(leftWorld, (c - a * leftWorld) / b);
      addPoint(rightWorld, (c - a * rightWorld) / b);
    }
    if (Math.abs(a) > 1e-12) {
      const topWorld = screenToWorld2(0, 0).y;
      const bottomWorld = screenToWorld2(0, canvas.height).y;
      addPoint((c - b * topWorld) / a, topWorld);
      addPoint((c - b * bottomWorld) / a, bottomWorld);
    }
    const visiblePoints = points.filter((point, index) => index === points.findIndex((candidate) => Math.abs(candidate.x - point.x) < 0.5 && Math.abs(candidate.y - point.y) < 0.5)).filter((point) => point.x >= -1 && point.x <= canvas.width + 1 && point.y >= -1 && point.y <= canvas.height + 1);
    if (visiblePoints.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);
      ctx.lineTo(visiblePoints[1].x, visiblePoints[1].y);
      ctx.stroke();
    }
  };
  const drawFunction = (ctx, mathFunc, screenToWorld2, worldToScreen, zoom) => {
    ctx.strokeStyle = mathFunc.color;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const canvas = ctx.canvas;
    const domainInterval = mathFunc.domainRestriction ? parseIntervalExpression(mathFunc.domainRestriction) : null;
    for (const expression of mathFunc.expressions) {
      if (["equation", "inequality", "system"].includes(mathFunc.type)) {
        const parsed = parseExpression(expression);
        if (!parsed) continue;
        if (parsed.implicitType === "linear" && parsed.coefficients) {
          drawImplicitLinearEquation(ctx, parsed.coefficients, screenToWorld2, worldToScreen);
          continue;
        }
        const points = [];
        let currentSegment = [];
        const addPoint = (wx, wy) => {
          let inDomain = !domainInterval || (domainInterval.variable === "x" ? wx >= domainInterval.lowerBound && wx <= domainInterval.upperBound : wy >= domainInterval.lowerBound && wy <= domainInterval.upperBound);
          if (isFinite(wx) && isFinite(wy) && inDomain) {
            currentSegment.push(worldToScreen(wx, wy));
          } else {
            if (currentSegment.length > 0) {
              points.push(...currentSegment, { x: NaN, y: NaN });
              currentSegment = [];
            }
          }
        };
        if (parsed.variable === "y") {
          for (let sx = 0; sx <= canvas.width; sx++) {
            const { x: wx } = screenToWorld2(sx, 0);
            try {
              addPoint(wx, parsed.func(wx));
            } catch (e) {
              addPoint(NaN, NaN);
            }
          }
        } else {
          for (let sy = 0; sy <= canvas.height; sy++) {
            const { y: wy } = screenToWorld2(0, sy);
            try {
              addPoint(parsed.func(wy), wy);
            } catch (e) {
              addPoint(NaN, NaN);
            }
          }
        }
        if (currentSegment.length > 0) points.push(...currentSegment);
        if (points.length > 0) {
          ctx.beginPath();
          if (parsed.inequalityType === "<" || parsed.inequalityType === ">") {
            ctx.setLineDash([8, 8]);
          }
          let isNewLine = true;
          for (const p of points) {
            if (isNaN(p.x)) {
              isNewLine = true;
              continue;
            }
            if (isNewLine) {
              ctx.moveTo(p.x, p.y);
              isNewLine = false;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (parsed.inequalityType && points.length > 0) {
          const fillablePoints = points.filter((p) => !isNaN(p.x));
          if (fillablePoints.length > 1) {
            ctx.fillStyle = mathFunc.color;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(fillablePoints[0].x, fillablePoints[0].y);
            for (let i = 1; i < fillablePoints.length; i++) {
              ctx.lineTo(fillablePoints[i].x, fillablePoints[i].y);
            }
            if (parsed.variable === "y") {
              const bound = parsed.inequalityType === ">" || parsed.inequalityType === ">=" ? 0 : canvas.height;
              ctx.lineTo(fillablePoints[fillablePoints.length - 1].x, bound);
              ctx.lineTo(fillablePoints[0].x, bound);
            } else {
              const bound = parsed.inequalityType === ">" || parsed.inequalityType === ">=" ? canvas.width : 0;
              ctx.lineTo(bound, fillablePoints[fillablePoints.length - 1].y);
              ctx.lineTo(bound, fillablePoints[0].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
        if (domainInterval) {
          const drawEndpoint = (worldX, worldY, inclusive) => {
            if (!isFinite(worldX) || !isFinite(worldY)) return;
            const { x: sx, y: sy } = worldToScreen(worldX, worldY);
            ctx.beginPath();
            ctx.arc(sx, sy, 5, 0, 2 * Math.PI);
            if (inclusive) {
              ctx.fillStyle = mathFunc.color;
              ctx.fill();
            } else {
              ctx.fillStyle = themeConfig.bgColorValue;
              ctx.fill();
              ctx.strokeStyle = mathFunc.color;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          };
          if (domainInterval.variable === "x" && parsed.variable === "y") {
            if (isFinite(domainInterval.lowerBound)) drawEndpoint(domainInterval.lowerBound, parsed.func(domainInterval.lowerBound), domainInterval.lowerInclusive);
            if (isFinite(domainInterval.upperBound)) drawEndpoint(domainInterval.upperBound, parsed.func(domainInterval.upperBound), domainInterval.upperInclusive);
          }
        }
      } else if (mathFunc.type === "interval") {
        const parsed = parseIntervalExpression(expression);
        if (!parsed) continue;
        ctx.fillStyle = mathFunc.color;
        ctx.globalAlpha = 0.3;
        if (parsed.variable === "x") {
          const { x: startX } = worldToScreen(parsed.lowerBound, 0);
          const { x: endX } = worldToScreen(parsed.upperBound, 0);
          ctx.fillRect(startX, 0, endX - startX, canvas.height);
        } else {
          const { y: startY } = worldToScreen(0, parsed.upperBound);
          const { y: endY } = worldToScreen(0, parsed.lowerBound);
          ctx.fillRect(0, startY, canvas.width, endY - startY);
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = mathFunc.color;
        ctx.lineWidth = 2;
        const drawBoundary = (val, isInclusive, variable) => {
          if (!isFinite(val)) return;
          if (!isInclusive) ctx.setLineDash([8, 8]);
          if (variable === "x") {
            const { x } = worldToScreen(val, 0);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          } else {
            const { y } = worldToScreen(0, val);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
          ctx.setLineDash([]);
        };
        drawBoundary(parsed.lowerBound, parsed.lowerInclusive, parsed.variable);
        drawBoundary(parsed.upperBound, parsed.upperInclusive, parsed.variable);
      }
    }
  };
  useImperativeHandle(ref, () => ({
    async downloadImage() {
      const sourceCanvas = canvasRef.current;
      if (!sourceCanvas) return;
      const PADDING = 20;
      const LEGEND_TOP_MARGIN = 20;
      const LEGEND_ITEM_SPACING = 15;
      const LEGEND_COLOR_BOX_SIZE = 20;
      const LEGEND_BOX_TEXT_SPACING = 8;
      const visibleFunctions = functions.filter((f) => f.expressions.some((e) => e.trim() !== ""));
      if (visibleFunctions.length === 0) {
        const link2 = document.createElement("a");
        link2.download = "grafica.png";
        link2.href = sourceCanvas.toDataURL("image/png");
        link2.click();
        return;
      }
      const formulaImages = await Promise.all(
        visibleFunctions.map((f) => renderMathJaxToImage(f.expressions.join("; "), themeConfig.textColorValue))
      );
      const validFormulas = visibleFunctions.map((f, i) => ({ ...f, imgData: formulaImages[i] })).filter((f) => f.imgData);
      const totalLegendWidth = validFormulas.reduce((acc, f) => {
        return acc + LEGEND_COLOR_BOX_SIZE + LEGEND_BOX_TEXT_SPACING + (f.imgData?.width || 0) + LEGEND_ITEM_SPACING;
      }, -LEGEND_ITEM_SPACING);
      const maxLegendHeight = Math.max(...validFormulas.map((f) => f.imgData?.height || 0), LEGEND_COLOR_BOX_SIZE);
      const newWidth = sourceCanvas.width;
      const newHeight = sourceCanvas.height + maxLegendHeight + LEGEND_TOP_MARGIN + PADDING;
      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = newWidth;
      targetCanvas.height = newHeight;
      const ctx = targetCanvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = themeConfig.bgColorValue;
      ctx.fillRect(0, 0, newWidth, newHeight);
      ctx.drawImage(sourceCanvas, 0, 0);
      const legendY = sourceCanvas.height + LEGEND_TOP_MARGIN;
      let currentX = (newWidth - totalLegendWidth) / 2;
      for (const func of validFormulas) {
        if (!func.imgData) continue;
        ctx.fillStyle = func.color;
        ctx.fillRect(currentX, legendY + (maxLegendHeight - LEGEND_COLOR_BOX_SIZE) / 2, LEGEND_COLOR_BOX_SIZE, LEGEND_COLOR_BOX_SIZE);
        currentX += LEGEND_COLOR_BOX_SIZE + LEGEND_BOX_TEXT_SPACING;
        ctx.drawImage(func.imgData.img, currentX, legendY + (maxLegendHeight - func.imgData.height) / 2, func.imgData.width, func.imgData.height);
        currentX += func.imgData.width + LEGEND_ITEM_SPACING;
      }
      const link = document.createElement("a");
      link.download = "grafica.png";
      link.href = targetCanvas.toDataURL("image/png");
      link.click();
    }
  }));
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full relative touch-none", style: { touchAction: "none" }, children: [
    /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "w-full h-full", style: { cursor: "grab" } }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 right-4 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleZoomIn,
          className: `w-10 h-10 flex items-center justify-center rounded-full shadow-lg text-xl font-bold transition-transform transform hover:scale-105 ${themeConfig.buttonBg} ${themeConfig.buttonHover}`,
          "aria-label": "Zoom in",
          children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleZoomOut,
          className: `w-10 h-10 flex items-center justify-center rounded-full shadow-lg text-xl font-bold transition-transform transform hover:scale-105 ${themeConfig.buttonBg} ${themeConfig.buttonHover}`,
          "aria-label": "Zoom out",
          children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-minus" })
        }
      )
    ] }),
    tooltip.visible && /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute pointer-events-none p-2 rounded-md shadow-lg transition-opacity ${themeConfig.panelBg} ${themeConfig.text}`,
        style: {
          left: tooltip.x + TOOLTIP_OFFSET,
          top: tooltip.y + TOOLTIP_OFFSET,
          opacity: tooltip.visible ? 1 : 0
        },
        children: tooltip.content
      }
    )
  ] });
});
export {
  Graph
};
