import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import type { MathFunction, Theme, ViewConfig, TooltipData } from '../types';
import { THEMES } from '../constants';
import { parseExpression, parseIntervalExpression } from '../services/mathService';

interface GraphProps {
  functions: MathFunction[];
  theme: Theme;
  viewConfig: ViewConfig;
}

export interface GraphRef {
  downloadImage: () => void;
}

const TOOLTIP_OFFSET = 15;

// Helper functions for image export, kept locally to avoid altering other files.

/**
 * A recursive descent parser to convert a mathematical expression string
 * into a LaTeX string, correctly handling operator precedence for fractions.
 */
const formatSubExpression = (subExpr: string): string => {
    const expr = subExpr.trim();
    if (!expr) return '';
    if (expr.startsWith('(') && expr.endsWith(')')) {
        let depth = 0;
        let isWrapped = true;
        for (let i = 0; i < expr.length - 1; i++) {
            if (expr[i] === '(') depth++;
            else if (expr[i] === ')') depth--;
            if (depth === 0) { isWrapped = false; break; }
        }
        if (isWrapped) return `(${formatSubExpression(expr.slice(1, -1))})`;
    }
    let depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];
        if (char === ')') depth++;
        else if (char === '(') depth--;
        else if ((char === '+' || char === '-') && depth === 0) {
            if (i > 0 && !['+', '-', '*', '/'].includes(expr[i - 1].trim())) {
                return `${formatSubExpression(expr.slice(0, i))} ${char} ${formatSubExpression(expr.slice(i + 1))}`;
            }
        }
    }
    depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];
        if (char === ')') depth++;
        else if (char === '(') depth--;
        else if (char === '/' && depth === 0) return `\\frac{${formatSubExpression(expr.slice(0, i))}}{${formatSubExpression(expr.slice(i + 1))}}`;
    }
    depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];
        if (char === ')') depth++;
        else if (char === '(') depth--;
        else if (char === '*' && depth === 0) return `${formatSubExpression(expr.slice(0, i))} \\cdot ${formatSubExpression(expr.slice(i + 1))}`;
    }
    if (expr.startsWith('sqrt(') && expr.endsWith(')')) return `\\sqrt{${formatSubExpression(expr.slice(5, -1))}}`;
    return expr;
};

const formatExpressionForMathJax = (expr: string): string => {
  let expressionToFormat = expr;
  if (!expressionToFormat || expressionToFormat.trim() === '') return '';
  const texifyOperator = (op: string) => op.replace(/<=/g, ' \\le ').replace(/≤/g, ' \\le ').replace(/>=/g, ' \\ge ').replace(/≥/g, ' \\ge ').replace(/</g, ' \\lt ').replace(/>/g, ' \\gt ').replace(/=/g, ' = ');
  const operatorMatch = expressionToFormat.match(/(<=|>=|≤|≥|<|>|=)/);
  let formatted;
  if (operatorMatch && operatorMatch.index !== undefined && operatorMatch.index > 0) {
    const op = operatorMatch[0];
    const opIndex = operatorMatch.index;
    let lhs = expressionToFormat.substring(0, opIndex).trim();
    let rhs = expressionToFormat.substring(opIndex + op.length).trim();
    formatted = `${lhs} ${texifyOperator(op)} ${formatSubExpression(rhs)}`;
  } else {
    const parts = expressionToFormat.split(/(<=|>=|≤|≥|<|>|=)/).filter(p => p);
    if (parts.length > 1) {
        formatted = parts.map((part, index) => index % 2 === 1 ? texifyOperator(part) : formatSubExpression(part)).join('');
    } else {
       formatted = formatSubExpression(expressionToFormat);
    }
  }
  return `\\(${formatted}\\)`;
};

const svgStringToImage = (svgString: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = url;
    });
};

const renderMathJaxToImage = async (expr: string, textColor: string): Promise<{img: HTMLImageElement, width: number, height: number} | null> => {
    if (!window.MathJax || !expr) return null;
    const tex = formatExpressionForMathJax(expr);
    const cleanTex = tex.replace(/^\\\(/, '').replace(/\\\)$/, '');
    await window.MathJax.startup.promise;
    const container = await window.MathJax.tex2svgPromise(cleanTex, { display: false });
    const svgEl = container.querySelector('svg');
    if (!svgEl) return null;
    
    const style = document.createElement('style');
    style.textContent = `* { fill: ${textColor} !important; color: ${textColor} !important; }`;
    svgEl.prepend(style);
    
    const svgString = svgEl.outerHTML;
    const viewBox = svgEl.getAttribute('viewBox')?.split(' ').map(Number);
    const originalWidth = viewBox ? viewBox[2] : 0;
    const originalHeight = viewBox ? viewBox[3] : 0;
    if(originalHeight === 0 || originalWidth === 0) return null;

    const desiredHeight = 20;
    const scale = desiredHeight / originalHeight;
    const finalWidth = originalWidth * scale;

    const img = await svgStringToImage(svgString);
    return { img, width: finalWidth, height: desiredHeight };
};


export const Graph = forwardRef<GraphRef, GraphProps>(({ functions, theme, viewConfig }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({ visible: false, content: '', x: 0, y: 0 });

  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(50);
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();
  
  const themeConfig = THEMES[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
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
        
        const { x: worldLeft, y: worldTop } = screenToWorld(0, 0, pan, zoom, { width: viewWidth, height: viewHeight });
        const { x: worldRight, y: worldBottom } = screenToWorld(viewWidth, viewHeight, pan, zoom, { width: viewWidth, height: viewHeight });
        
        if (viewConfig.grid) drawGrid(ctx, worldLeft, worldRight, worldBottom, worldTop, pan, zoom, { width: viewWidth, height: viewHeight });
        drawAxes(ctx, pan, zoom, { width: viewWidth, height: viewHeight });
        if (viewConfig.labels) drawLabels(ctx, worldLeft, worldRight, worldBottom, worldTop, pan, zoom, { width: viewWidth, height: viewHeight });
        
        functions.forEach(func => {
          drawFunction(ctx, func, worldLeft, worldRight, pan, zoom, { width: viewWidth, height: viewHeight });
        });
      };
      
    const screenToWorld = (screenX: number, screenY: number, pan: {x: number, y: number}, zoom: number, canvas: { width: number, height: number }) => {
        const worldX = (screenX - pan.x - canvas.width / 2) / zoom;
        const worldY = (screenY - pan.y - canvas.height / 2) / -zoom;
        return { x: worldX, y: worldY };
    };
    
    const worldToScreen = (worldX: number, worldY: number, pan: {x: number, y: number}, zoom: number, canvas: { width: number, height: number }) => {
        const screenX = worldX * zoom + pan.x + canvas.width / 2;
        const screenY = -worldY * zoom + pan.y + canvas.height / 2;
        return { x: screenX, y: screenY };
    };

    const getGridSpacing = (zoom: number) => {
        const minPixelSpacing = 60;
        const minWorldSpacing = minPixelSpacing / zoom;
        const magnitudes = [0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
        return magnitudes.find(m => m > minWorldSpacing) || magnitudes[magnitudes.length - 1];
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, worldLeft: number, worldRight: number, worldBottom: number, worldTop: number, pan: {x:number, y:number}, zoom: number, canvas: { width: number, height: number }) => {
        ctx.strokeStyle = themeConfig.grid;
        ctx.lineWidth = 1;
        const spacing = getGridSpacing(zoom);
        ctx.beginPath();
        for (let x = Math.floor(worldLeft / spacing) * spacing; x < worldRight; x += spacing) {
            const { x: screenX } = worldToScreen(x, 0, pan, zoom, canvas);
            ctx.moveTo(screenX, 0); ctx.lineTo(screenX, canvas.height);
        }
        for (let y = Math.floor(worldBottom / spacing) * spacing; y < worldTop; y += spacing) {
            const { y: screenY } = worldToScreen(0, y, pan, zoom, canvas);
            ctx.moveTo(0, screenY); ctx.lineTo(canvas.width, screenY);
        }
        ctx.stroke();
    };

    const drawAxes = (ctx: CanvasRenderingContext2D, pan: {x:number, y:number}, zoom: number, canvas: { width: number, height: number }) => {
        ctx.strokeStyle = themeConfig.textColorValue;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const { x: originX, y: originY } = worldToScreen(0, 0, pan, zoom, canvas);
        ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height);
        ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY);
        ctx.stroke();
    };

    const drawLabels = (ctx: CanvasRenderingContext2D, worldLeft: number, worldRight: number, worldBottom: number, worldTop: number, pan: {x:number, y:number}, zoom: number, canvas: { width: number, height: number }) => {
        ctx.fillStyle = themeConfig.secondaryTextColorValue;
        ctx.font = '12px sans-serif';
        const spacing = getGridSpacing(zoom);
        for (let x = Math.floor(worldLeft / spacing) * spacing; x < worldRight; x += spacing) {
            if (Math.abs(x) < 1e-9) continue;
            const { x: screenX, y: originY } = worldToScreen(x, 0, pan, zoom, canvas);
            ctx.fillText(Number(x.toPrecision(4)).toString(), screenX + 5, Math.max(15, Math.min(canvas.height - 5, originY + 15)));
        }
        for (let y = Math.floor(worldBottom / spacing) * spacing; y < worldTop; y += spacing) {
            if (Math.abs(y) < 1e-9) continue;
            const { x: originX, y: screenY } = worldToScreen(0, y, pan, zoom, canvas);
            ctx.fillText(Number(y.toPrecision(4)).toString(), Math.max(5, Math.min(canvas.width - 20, originX + 5)), screenY - 5);
        }
        const { x: originX, y: originY } = worldToScreen(0, 0, pan, zoom, canvas);
        ctx.fillText('0', originX + 5, originY + 15);

        // Add axis labels
        ctx.fillStyle = themeConfig.textColorValue;
        ctx.font = 'italic 16px sans-serif';

        // X-axis label
        const xLabelYPos = originY > canvas.height - 25 ? originY - 15 : originY + 20;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('eix x', canvas.width - 10, xLabelYPos);
        
        // Y-axis label
        const yLabelXPos = originX < 25 ? originX + 10 : originX - 15;
        ctx.textAlign = originX < 25 ? 'left' : 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('eix y', yLabelXPos, 10);
        
        // Reset text alignment and baseline for safety
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    };
    
    const drawFunction = (ctx: CanvasRenderingContext2D, mathFunc: MathFunction, worldLeft: number, worldRight: number, pan: {x:number, y:number}, zoom: number, canvas: { width: number, height: number }) => {
        ctx.strokeStyle = mathFunc.color;
        ctx.fillStyle = mathFunc.color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const domainInterval = mathFunc.domainRestriction ? parseIntervalExpression(mathFunc.domainRestriction) : null;
        for(const expression of mathFunc.expressions) {
          if (['equation', 'inequality', 'system'].includes(mathFunc.type)) {
              const parsed = parseExpression(expression);
              if (!parsed) continue;
              ctx.beginPath();
              let firstPoint = true;
              if (parsed.variable === 'y') {
                  for (let sx = 0; sx <= canvas.width; sx++) {
                      const { x: wx } = screenToWorld(sx, 0, pan, zoom, canvas);
                      if(domainInterval && (wx < domainInterval.lowerBound || wx > domainInterval.upperBound)) {
                          if(!firstPoint) ctx.stroke(); firstPoint = true; continue;
                      }
                      try {
                          const wy = parsed.func(wx);
                          if (!isFinite(wy)) { if(!firstPoint) ctx.stroke(); firstPoint = true; continue; }
                          const { x: screenX, y: screenY } = worldToScreen(wx, wy, pan, zoom, canvas);
                          if (firstPoint) { ctx.beginPath(); ctx.moveTo(screenX, screenY); firstPoint = false; }
                          else { ctx.lineTo(screenX, screenY); }
                      } catch(e) { if(!firstPoint) ctx.stroke(); firstPoint = true; }
                  }
                  if (!firstPoint) ctx.stroke();
              } else {
                  for (let sy = 0; sy <= canvas.height; sy++) {
                      const { y: wy } = screenToWorld(0, sy, pan, zoom, canvas);
                       try {
                          const wx = parsed.func(wy);
                           if (!isFinite(wx)) { if(!firstPoint) ctx.stroke(); firstPoint = true; continue; }
                          const { x: screenX, y: screenY } = worldToScreen(wx, wy, pan, zoom, canvas);
                          if (firstPoint) { ctx.beginPath(); ctx.moveTo(screenX, screenY); firstPoint = false; }
                          else { ctx.lineTo(screenX, screenY); }
                      } catch(e) { if(!firstPoint) ctx.stroke(); firstPoint = true; }
                  }
                  if (!firstPoint) ctx.stroke();
              }
          } else if (mathFunc.type === 'interval') {
              const parsed = parseIntervalExpression(expression);
              if (!parsed) continue;
              ctx.globalAlpha = 0.3;
              if (parsed.variable === 'x') {
                  const {x: startX} = worldToScreen(parsed.lowerBound, 0, pan, zoom, canvas);
                  const {x: endX} = worldToScreen(parsed.upperBound, 0, pan, zoom, canvas);
                  ctx.fillRect(startX, 0, endX - startX, canvas.height);
              } else {
                  const {y: startY} = worldToScreen(0, parsed.upperBound, pan, zoom, canvas);
                  const {y: endY} = worldToScreen(0, parsed.lowerBound, pan, zoom, canvas);
                  ctx.fillRect(0, startY, canvas.width, endY - startY);
              }
              ctx.globalAlpha = 1.0;
          }
        }
    };
    
    const redraw = () => { 
        if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(draw);
    };
    redraw();

    const handleResize = () => redraw();
    window.addEventListener('resize', handleResize);
    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        const oldZoom = zoomRef.current;
        const newZoom = oldZoom * zoomFactor;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const {x: worldX, y: worldY} = screenToWorld(mouseX, mouseY, panRef.current, oldZoom, rect);
        panRef.current.x = mouseX - worldX * newZoom - rect.width / 2;
        panRef.current.y = mouseY + worldY * newZoom - rect.height / 2;
        zoomRef.current = newZoom;
        redraw();
    };
    const handleMouseDown = (e: MouseEvent) => {
        isPanningRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
    };
    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const {x, y} = screenToWorld(mouseX, mouseY, panRef.current, zoomRef.current, rect);
        setTooltip({ visible: true, content: `(${x.toFixed(2)}, ${y.toFixed(2)})`, x: e.clientX, y: e.clientY });
        if (isPanningRef.current) {
            const dx = e.clientX - lastMousePosRef.current.x;
            const dy = e.clientY - lastMousePosRef.current.y;
            panRef.current = { x: panRef.current.x + dx, y: panRef.current.y + dy };
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
            redraw();
        }
    };
    const handleMouseUp = () => { isPanningRef.current = false; canvas.style.cursor = 'grab'; };
    const handleMouseLeave = () => { setTooltip(t => ({ ...t, visible: false })); };
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [functions, theme, viewConfig]);
  
  useImperativeHandle(ref, () => ({
    async downloadImage() {
        const sourceCanvas = canvasRef.current;
        if (!sourceCanvas) return;
        
        const PADDING = 20;
        const LEGEND_TOP_MARGIN = 20;
        const LEGEND_ITEM_SPACING = 15;
        const LEGEND_COLOR_BOX_SIZE = 20;
        const LEGEND_BOX_TEXT_SPACING = 8;
        
        const visibleFunctions = functions.filter(f => f.expressions.some(e => e.trim() !== ''));
        if (visibleFunctions.length === 0) {
             const link = document.createElement('a');
             link.download = 'grafica.png';
             link.href = sourceCanvas.toDataURL('image/png');
             link.click();
             return;
        }

        const formulaImages = await Promise.all(
            visibleFunctions.map(f => renderMathJaxToImage(f.expressions.join('; '), themeConfig.textColorValue))
        );

        const validFormulas = visibleFunctions.map((f, i) => ({ ...f, imgData: formulaImages[i] })).filter(f => f.imgData);

        const totalLegendWidth = validFormulas.reduce((acc, f) => {
            return acc + LEGEND_COLOR_BOX_SIZE + LEGEND_BOX_TEXT_SPACING + (f.imgData?.width || 0) + LEGEND_ITEM_SPACING;
        }, -LEGEND_ITEM_SPACING);

        const maxLegendHeight = Math.max(...validFormulas.map(f => f.imgData?.height || 0), LEGEND_COLOR_BOX_SIZE);

        const newWidth = sourceCanvas.width;
        const newHeight = sourceCanvas.height + maxLegendHeight + LEGEND_TOP_MARGIN + PADDING;

        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = newWidth;
        targetCanvas.height = newHeight;
        const ctx = targetCanvas.getContext('2d');
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

        const link = document.createElement('a');
        link.download = 'grafica.png';
        link.href = targetCanvas.toDataURL('image/png');
        link.click();
    }
  }));

  return (
    <div className="w-full h-full relative touch-none" style={{touchAction: 'none'}}>
      <canvas ref={canvasRef} className="w-full h-full" style={{cursor: 'grab'}} />
      {tooltip.visible && (
        <div 
          className={`absolute pointer-events-none p-2 rounded-md shadow-lg transition-opacity ${themeConfig.panelBg} ${themeConfig.text}`}
          style={{
            left: tooltip.x + TOOLTIP_OFFSET,
            top: tooltip.y + TOOLTIP_OFFSET,
            opacity: tooltip.visible ? 1 : 0,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
});