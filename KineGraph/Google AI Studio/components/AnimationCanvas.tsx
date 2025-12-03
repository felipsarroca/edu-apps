
import React, { useEffect, useRef, useMemo } from 'react';
import { Mobile, MovementType } from '../types';
import { calculateAnimationData, get2DInstantaneousPosition, getInstantaneousKinematics } from '../services/physicsService';
import { COLORS } from '../constants';

interface AnimationCanvasProps {
    mobiles: Mobile[];
    animationTime: number;
    simulationTime: number;
}

const getNiceTickInterval = (min: number, max: number, maxTicks: number) => {
    const range = max - min;
    if (range === 0) return { ticks: [min], interval: 1 };
    
    const roughInterval = range / (maxTicks - 1);
    const exponent = Math.floor(Math.log10(roughInterval));
    const magnitude = Math.pow(10, exponent);
    const residual = roughInterval / magnitude;

    let tickInterval;
    if (residual > 5) tickInterval = 10 * magnitude;
    else if (residual > 2) tickInterval = 5 * magnitude;
    else if (residual > 1) tickInterval = 2 * magnitude;
    else tickInterval = magnitude;

    const firstTick = Math.ceil(min / tickInterval) * tickInterval;
    const lastTick = Math.floor(max / tickInterval) * tickInterval;

    const ticks = [];
    for (let i = firstTick; i <= lastTick; i += tickInterval) {
        ticks.push(parseFloat(i.toFixed(5)));
    }
    
    return { ticks, interval: tickInterval };
};

export const AnimationCanvas: React.FC<AnimationCanvasProps> = ({ mobiles, animationTime, simulationTime }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const animationData: { [key: string]: { x: number, y: number }[] } = useMemo(() => {
        if (simulationTime <= 0) return {};
        return calculateAnimationData(mobiles, simulationTime, 0.1)
    }, [mobiles, simulationTime]);
    
    const hasVerticalMotion = useMemo(() => 
        mobiles.some(m => m.phases.some(p => p.tipus === MovementType.MovimentVertical || p.tipus === MovementType.TirParabolic)),
    [mobiles]);

    const bounds = useMemo(() => {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        let hasData = false;

        Object.values(animationData).forEach(trajectory => {
            if (trajectory.length > 0) {
                hasData = true;
                trajectory.forEach(pos => {
                    if (isFinite(pos.x)) {
                        minX = Math.min(minX, pos.x);
                        maxX = Math.max(maxX, pos.x);
                    }
                    if (isFinite(pos.y)) {
                        minY = Math.min(minY, pos.y);
                        maxY = Math.max(maxY, pos.y);
                    }
                });
            }
        });
        
        if (!hasData) {
            return { minX: -10, maxX: 10, minY: -10, maxY: 10 };
        }
        
        // Ensure the ground is visible for vertical motion
        if (hasVerticalMotion) {
            minY = Math.min(0, minY);
        }

        let width = maxX - minX;
        let height = maxY - minY;

        // Give some dimension to 1D movements to avoid a flat view
        const minDimension = 10; // Minimum world units to show
        if (width < minDimension) {
            const midX = (minX + maxX) / 2;
            minX = midX - minDimension / 2;
            maxX = midX + minDimension / 2;
        }
        if (height < minDimension) {
             const midY = (minY + maxY) / 2;
            minY = midY - minDimension / 2;
            maxY = midY + minDimension / 2;
        }
        
        // Recalculate dimensions and add padding
        width = maxX - minX;
        height = maxY - minY;
        const PADDING_FACTOR = 0.1; // 10% padding on each side

        return {
            minX: minX - width * PADDING_FACTOR,
            maxX: maxX + width * PADDING_FACTOR,
            minY: minY - height * PADDING_FACTOR,
            maxY: maxY + height * PADDING_FACTOR,
        };
    }, [animationData, hasVerticalMotion]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        ctx.save();

        const PADDING = 50;
        const worldWidth = bounds.maxX - bounds.minX;
        const worldHeight = bounds.maxY - bounds.minY;

        if (worldWidth <= 1e-6 || worldHeight <= 1e-6) return;

        const scaleX = (width - 2 * PADDING) / worldWidth;
        const scaleY = (height - 2 * PADDING) / worldHeight;
        const scale = Math.min(scaleX, scaleY);

        const worldToCanvas = (wx: number, wy: number) => {
            const cx = PADDING + (wx - bounds.minX) * scale;
            const cy = height - PADDING - (wy - bounds.minY) * scale;
            return { x: cx, y: cy };
        }

        // Draw Axes and Grid
        const origin = worldToCanvas(0, 0);
        
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.font = '10px Poppins';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const xTicks = getNiceTickInterval(bounds.minX, bounds.maxX, Math.floor(width / 80)).ticks;
        xTicks.forEach(tick => {
            const canvasPos = worldToCanvas(tick, 0);
            ctx.beginPath();
            ctx.moveTo(canvasPos.x, PADDING);
            ctx.lineTo(canvasPos.x, height - PADDING);
            ctx.stroke();
            if (Math.abs(tick) > 1e-6) {
                 ctx.fillText(`${tick.toFixed(0)}m`, canvasPos.x, height - PADDING + 15);
            }
        });

        if (hasVerticalMotion) {
            const yTicks = getNiceTickInterval(bounds.minY, bounds.maxY, Math.floor(height / 50)).ticks;
            yTicks.forEach(tick => {
                const canvasPos = worldToCanvas(0, tick);
                ctx.beginPath();
                ctx.moveTo(PADDING, canvasPos.y);
                ctx.lineTo(width - PADDING, canvasPos.y);
                ctx.stroke();
                if (Math.abs(tick) > 1e-6) {
                    ctx.save();
                    ctx.textAlign = 'right';
                    ctx.fillText(`${tick.toFixed(0)}m`, PADDING - 10, canvasPos.y);
                    ctx.restore();
                }
            });
        }
        
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(PADDING, origin.y);
        ctx.lineTo(width - PADDING, origin.y); // X-axis
        if (hasVerticalMotion) {
            ctx.moveTo(origin.x, PADDING);
            ctx.lineTo(origin.x, height - PADDING); // Y-axis
        }
        ctx.stroke();
        ctx.fillText("0", origin.x - 10, origin.y + (hasVerticalMotion ? 15 : 0));


        // Draw dynamic trajectories
        mobiles.forEach((mobile, index) => {
            const trajectory = animationData[mobile.nom];
            if (!trajectory || trajectory.length < 2) return;

            const totalPoints = trajectory.length - 1;
            const pointsToDraw = Math.floor((animationTime / simulationTime) * totalPoints);
            const partialTrajectory = trajectory.slice(0, pointsToDraw + 1);
            
            if (partialTrajectory.length < 2) return;

            ctx.beginPath();
            const startPoint = worldToCanvas(partialTrajectory[0].x, partialTrajectory[0].y);
            ctx.moveTo(startPoint.x, startPoint.y);
            
            partialTrajectory.forEach(pos => {
                const canvasPos = worldToCanvas(pos.x, pos.y);
                ctx.lineTo(canvasPos.x, canvasPos.y);
            });
            ctx.strokeStyle = `${COLORS[index % COLORS.length]}80`;
            ctx.lineWidth = 6;
            ctx.stroke();
        });
        
        const MOBILE_SIZE = 30;
        const labelData = mobiles.map((mobile) => {
            const kinematics = getInstantaneousKinematics(mobile, animationTime);
            const textLines = [
                `v: ${kinematics.v.toFixed(1)} m/s`,
                `a: ${kinematics.a.toFixed(1)} m/s²`,
            ];
            ctx.font = '11px Poppins';
            const textWidth = Math.max(...textLines.map(line => ctx.measureText(line).width)) + 10;
            const boxHeight = textLines.length * 14 + 6;
            
            const pos = get2DInstantaneousPosition(mobile, animationTime);
            const canvasPos = worldToCanvas(pos.x, pos.y);

            return {
                mobile,
                canvasPos,
                textLines,
                boxWidth: textWidth,
                boxHeight,
                rect: {
                    x: canvasPos.x + MOBILE_SIZE / 2 + 5,
                    y: canvasPos.y - boxHeight - 5,
                    width: textWidth,
                    height: boxHeight,
                }
            };
        });

        // Adjust label positions to avoid overlap
        for (let i = 0; i < labelData.length; i++) {
            for (let j = i + 1; j < labelData.length; j++) {
                const rect1 = labelData[i].rect;
                const rect2 = labelData[j].rect;

                if (rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.y + rect1.height > rect2.y) {
                    
                    labelData[j].rect.y = rect1.y + rect1.height + 5;
                }
            }
        }


        // Draw mobiles and their data
        labelData.forEach((data, index) => {
             const { canvasPos, textLines, rect } = data;
            const size = MOBILE_SIZE;

            // Draw Mobile Shape
            ctx.fillStyle = COLORS[index % COLORS.length];
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            const shape = index % 3;
            switch(shape) {
                case 0: ctx.arc(canvasPos.x, canvasPos.y, size / 2, 0, 2 * Math.PI); break;
                case 1: ctx.rect(canvasPos.x - size / 2, canvasPos.y - size / 2, size, size); break;
                case 2:
                    const h = size * (Math.sqrt(3)/2);
                    ctx.moveTo(canvasPos.x, canvasPos.y - h / 2);
                    ctx.lineTo(canvasPos.x - size / 2, canvasPos.y + h / 2);
                    ctx.lineTo(canvasPos.x + size / 2, canvasPos.y + h / 2);
                    ctx.closePath();
                    break;
            }
            ctx.fill();
            ctx.stroke();

            // Draw data box
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            textLines.forEach((line, i) => {
                ctx.fillText(line, rect.x + 5, rect.y + 3 + i * 14);
            });
        });

        ctx.restore();

    }, [animationTime, mobiles, bounds, animationData, hasVerticalMotion, simulationTime]);

    return (
        <div ref={containerRef} className="w-full h-full bg-gray-50 border rounded-md overflow-hidden">
            <canvas ref={canvasRef} />
        </div>
    );
};
