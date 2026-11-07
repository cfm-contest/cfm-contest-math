import React, { useMemo, useState } from 'react';
import { Mafs, Coordinates, Plot, Point, Vector, Line, Circle, Polygon, Text } from 'mafs';
import { compile } from 'mathjs';
import { MafsSpec, Item, V2 } from '../types/mafsSpec';

const DEFAULT_COLOR = '#2563eb';

/** mathjs orqali xavfsiz hisoblash (eval ishlatilmaydi) */
export function makeFn(expr: string): (x: number) => number {
  if (!expr || expr.trim() === '' || expr.length > 200) return () => NaN;
  try {
    const code = compile(expr);
    return (x: number) => {
      try {
        const v = code.evaluate({ x });
        if (typeof v === 'number' && !isNaN(v) && isFinite(v)) {
          return v;
        }
        return NaN;
      } catch {
        return NaN;
      }
    };
  } catch {
    return () => NaN;
  }
}

function FunctionPlot({ item }: { item: Extract<Item, { type: 'function' }> }) {
  const fn = useMemo(() => makeFn(item.expr), [item.expr]);
  return (
    <Plot.OfX
      y={fn}
      color={item.color ?? DEFAULT_COLOR}
      domain={item.domain}
    />
  );
}

interface MathGraphProps {
  source?: string;
  spec?: MafsSpec;
  className?: string;
  onCoordinateClick?: (coord: V2) => void;
  showHoverCoordinates?: boolean;
}

export default function MathGraph({
  source,
  spec: directSpec,
  className = '',
  onCoordinateClick,
  showHoverCoordinates = false,
}: MathGraphProps) {
  const [hoverCoord, setHoverCoord] = useState<V2 | null>(null);

  const parsed = useMemo(() => {
    if (directSpec) {
      if (!Array.isArray(directSpec.items)) {
        return { spec: null, error: "items massiv bo'lishi kerak" };
      }
      return { spec: directSpec, error: null };
    }

    if (!source) {
      return { spec: null, error: 'Manba (source) berilmadi' };
    }

    try {
      const spec = JSON.parse(source) as MafsSpec;
      if (!Array.isArray(spec.items)) {
        throw new Error("items massiv bo'lishi kerak");
      }
      return { spec, error: null };
    } catch (e) {
      return { spec: null, error: e instanceof Error ? e.message : 'JSON formati noto‘g‘ri' };
    }
  }, [source, directSpec]);

  if (!parsed.spec) {
    return (
      <div className={`my-4 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-700 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 font-semibold text-rose-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Grafik JSON xatoligi
        </div>
        <p className="mt-1 font-mono">{parsed.error}</p>
      </div>
    );
  }

  const {
    x = [-5, 5],
    y = [-5, 5],
    height = 360,
    grid = true,
    items = [],
  } = parsed.spec;

  // Safe fallback if x or y bounds are corrupted
  const safeX: V2 = Array.isArray(x) && x.length === 2 && !isNaN(x[0]) && !isNaN(x[1]) ? x : [-5, 5];
  const safeY: V2 = Array.isArray(y) && y.length === 2 && !isNaN(y[0]) && !isNaN(y[1]) ? y : [-5, 5];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showHoverCoordinates && !onCoordinateClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    // Convert pixel ratio to coordinate space
    const mathX = safeX[0] + px * (safeX[1] - safeX[0]);
    const mathY = safeY[1] - py * (safeY[1] - safeY[0]);

    setHoverCoord([Number(mathX.toFixed(2)), Number(mathY.toFixed(2))]);
  };

  const handleClick = () => {
    if (onCoordinateClick && hoverCoord) {
      onCoordinateClick(hoverCoord);
    }
  };

  return (
    <div
      className={`relative my-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverCoord(null)}
      onClick={handleClick}
    >
      {/* Live hover coordinates badge */}
      {hoverCoord && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-lg bg-slate-900/80 px-2.5 py-1 font-mono text-xs text-white shadow backdrop-blur-sm">
          x: {hoverCoord[0]}, y: {hoverCoord[1]}
        </div>
      )}

      <Mafs
        viewBox={{ x: safeX, y: safeY }}
        height={height}
        preserveAspectRatio={false}
      >
        {grid && <Coordinates.Cartesian />}

        {items.map((item, i) => {
          const color = 'color' in item ? item.color ?? DEFAULT_COLOR : DEFAULT_COLOR;
          switch (item.type) {
            case 'function':
              return <FunctionPlot key={i} item={item} />;
            case 'point':
              return (
                <g key={i}>
                  <Point x={item.x} y={item.y} color={color} />
                  {item.label && (
                    <Text x={item.x} y={item.y} attach="ne" attachDistance={12} size={14}>
                      {item.label}
                    </Text>
                  )}
                </g>
              );
            case 'vector':
              return <Vector key={i} tail={item.from ?? [0, 0]} tip={item.to} color={color} />;
            case 'segment':
              return <Line.Segment key={i} point1={item.a} point2={item.b} color={color} />;
            case 'circle':
              return <Circle key={i} center={item.center} radius={item.r} color={color} />;
            case 'polygon':
              return <Polygon key={i} points={item.points} color={color} />;
            case 'text':
              return (
                <Text key={i} x={item.x} y={item.y} size={15}>
                  {item.text}
                </Text>
              );
            default:
              return null;
          }
        })}
      </Mafs>
    </div>
  );
}
