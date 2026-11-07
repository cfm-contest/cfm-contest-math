import React, { useEffect, useRef, useId, useState, useMemo } from 'react';
import JXG from 'jsxgraph';
import { compile } from 'mathjs';
import { JSXGraphSpec, JXGElementItem } from '../types/jsxgraphSpec';

interface JSXGraphViewerProps {
  source?: string;
  spec?: JSXGraphSpec;
  className?: string;
  onPointMove?: (pointName: string, coords: [number, number]) => void;
}

function makeSafeFn(expr: string): (x: number) => number {
  if (!expr || expr.trim() === '' || expr.length > 200) return () => NaN;
  try {
    const code = compile(expr);
    return (x: number) => {
      try {
        const v = code.evaluate({ x });
        return typeof v === 'number' && !isNaN(v) && isFinite(v) ? v : NaN;
      } catch {
        return NaN;
      }
    };
  } catch {
    return () => NaN;
  }
}

export default function JSXGraphViewer({
  source,
  spec: directSpec,
  className = '',
  onPointMove,
}: JSXGraphViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<any>(null);
  const uniqueId = useId().replace(/:/g, '_');
  const boxId = `jxgbox_${uniqueId}`;
  const [boardError, setBoardError] = useState<string | null>(null);

  // Parse spec from source or directSpec
  const parsed = useMemo(() => {
    if (directSpec) {
      if (!Array.isArray(directSpec.elements)) {
        return { spec: null, error: "'elements' massiv bo'lishi kerak" };
      }
      return { spec: directSpec, error: null };
    }

    if (!source) {
      return { spec: null, error: 'Manba (source) berilmadi' };
    }

    try {
      const spec = JSON.parse(source) as JSXGraphSpec;
      if (!Array.isArray(spec.elements)) {
        throw new Error("'elements' massiv bo'lishi kerak");
      }
      return { spec, error: null };
    } catch (e) {
      return { spec: null, error: e instanceof Error ? e.message : 'JSON formati noto‘g‘ri' };
    }
  }, [source, directSpec]);

  useEffect(() => {
    if (!containerRef.current || !parsed.spec) return;

    // Clean up previous board if exists
    if (boardRef.current) {
      try {
        JXG.JSXGraph.freeBoard(boardRef.current);
      } catch {
        // ignore
      }
      boardRef.current = null;
    }

    const {
      boundingbox = [-5, 5, 5, -5],
      axis = true,
      grid = true,
      showNavigation = false,
      showCopyright = false,
      elements = [],
    } = parsed.spec;

    try {
      const board = JXG.JSXGraph.initBoard(boxId, {
        boundingbox,
        axis,
        grid,
        showNavigation,
        showCopyright,
        keepaspectratio: false,
        zoom: { factorX: 1.25, factorY: 1.25, wheel: true, needShift: false },
        pan: { needShift: false, needTwoFingers: false, enabled: true },
      });

      boardRef.current = board;
      setBoardError(null);

      // Store created elements for referencing by ID or name
      const createdObjMap: Record<string, any> = {};

      // Helper to resolve parents (supports either coordinates or referencing element by name/id)
      const resolveParent = (p: any): any => {
        if (typeof p === 'string' && createdObjMap[p]) {
          return createdObjMap[p];
        }
        return p;
      };

      elements.forEach((item: JXGElementItem) => {
        try {
          const defaultColor = item.color || '#2563eb';

          switch (item.type) {
            case 'point': {
              const pt = board.create('point', item.parents, {
                name: item.name || '',
                strokeColor: defaultColor,
                fillColor: item.fillColor || defaultColor,
                fixed: item.fixed ?? false,
                size: item.size ?? 3,
                showInfobox: true,
              });

              if (item.id) createdObjMap[item.id] = pt;
              if (item.name) createdObjMap[item.name] = pt;

              if (onPointMove) {
                pt.on('drag', () => {
                  onPointMove(item.name || item.id || 'point', [
                    Number(pt.X().toFixed(2)),
                    Number(pt.Y().toFixed(2)),
                  ]);
                });
              }
              break;
            }

            case 'line': {
              const resolvedParents = item.parents.map(resolveParent);
              const ln = board.create('line', resolvedParents, {
                name: item.name || '',
                strokeColor: defaultColor,
                strokeWidth: item.strokeWidth ?? 2,
                dash: item.dash ?? 0,
              });
              if (item.id) createdObjMap[item.id] = ln;
              if (item.name) createdObjMap[item.name] = ln;
              break;
            }

            case 'segment': {
              const resolvedParents = item.parents.map(resolveParent);
              const seg = board.create('segment', resolvedParents, {
                name: item.name || '',
                strokeColor: defaultColor,
                strokeWidth: item.strokeWidth ?? 2,
                dash: item.dash ?? 0,
              });
              if (item.id) createdObjMap[item.id] = seg;
              if (item.name) createdObjMap[item.name] = seg;
              break;
            }

            case 'circle': {
              const resolvedParents = item.parents.map(resolveParent);
              const circ = board.create('circle', resolvedParents, {
                name: item.name || '',
                strokeColor: defaultColor,
                fillColor: item.fillColor || defaultColor,
                fillOpacity: item.fillOpacity ?? 0.1,
                strokeWidth: item.strokeWidth ?? 2,
              });
              if (item.id) createdObjMap[item.id] = circ;
              if (item.name) createdObjMap[item.name] = circ;
              break;
            }

            case 'polygon': {
              const resolvedParents = item.parents.map(resolveParent);
              const poly = board.create('polygon', resolvedParents, {
                name: item.name || '',
                fillColor: item.fillColor || defaultColor,
                fillOpacity: item.fillOpacity ?? 0.2,
                borders: {
                  strokeColor: defaultColor,
                  strokeWidth: item.strokeWidth ?? 2,
                },
              });
              if (item.id) createdObjMap[item.id] = poly;
              break;
            }

            case 'functiongraph': {
              // item.parents[0] is expression like "x^2 - 4" or "sin(x)"
              const expr = typeof item.parents[0] === 'string' ? item.parents[0] : 'x';
              const fn = makeSafeFn(expr);
              const fg = board.create('functiongraph', [fn], {
                name: item.name || '',
                strokeColor: defaultColor,
                strokeWidth: item.strokeWidth ?? 2.5,
              });
              if (item.id) createdObjMap[item.id] = fg;
              break;
            }

            case 'slider': {
              const sl = board.create('slider', item.parents, {
                name: item.name || 'a',
                strokeColor: defaultColor,
                fillColor: defaultColor,
              });
              if (item.id) createdObjMap[item.id] = sl;
              if (item.name) createdObjMap[item.name] = sl;
              break;
            }

            case 'angle': {
              const resolvedParents = item.parents.map(resolveParent);
              const ang = board.create('angle', resolvedParents, {
                name: item.name || '',
                fillColor: defaultColor,
                fillOpacity: 0.3,
                strokeColor: defaultColor,
              });
              if (item.id) createdObjMap[item.id] = ang;
              break;
            }

            case 'text': {
              const [x, y, txt] = item.parents;
              const tx = board.create('text', [x, y, txt], {
                fontSize: 14,
                strokeColor: defaultColor,
              });
              if (item.id) createdObjMap[item.id] = tx;
              break;
            }

            case 'midpoint': {
              const resolvedParents = item.parents.map(resolveParent);
              const mid = board.create('midpoint', resolvedParents, {
                name: item.name || 'M',
                strokeColor: defaultColor,
                fillColor: defaultColor,
                size: item.size ?? 3,
              });
              if (item.id) createdObjMap[item.id] = mid;
              if (item.name) createdObjMap[item.name] = mid;
              break;
            }
          }
        } catch (elErr) {
          console.warn('JSXGraph element creation error:', elErr);
        }
      });

      board.update();
    } catch (err) {
      setBoardError(err instanceof Error ? err.message : 'JSXGraph yuklashda xatolik yuz berdi');
    }

    return () => {
      if (boardRef.current) {
        try {
          JXG.JSXGraph.freeBoard(boardRef.current);
        } catch {
          // ignore
        }
        boardRef.current = null;
      }
    };
  }, [boxId, parsed.spec]);

  if (!parsed.spec) {
    return (
      <div className={`my-4 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-700 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 font-semibold text-rose-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          JSXGraph JSON xatoligi
        </div>
        <p className="mt-1 font-mono">{parsed.error}</p>
      </div>
    );
  }

  const height = parsed.spec.height ?? 380;

  return (
    <div className={`relative my-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow ${className}`}>
      {boardError && (
        <div className="absolute top-2 left-2 z-20 rounded bg-rose-500/90 px-2 py-1 text-xs text-white shadow">
          {boardError}
        </div>
      )}
      <div
        id={boxId}
        ref={containerRef}
        className="jxgbox w-full"
        style={{ height: `${height}px`, width: '100%' }}
      />
      <div className="pointer-events-none absolute bottom-2 left-3 z-10 text-[10px] text-slate-400 font-mono">
        JSXGraph • Nuqtalarni sichqoncha bilan siljitish mumkin
      </div>
    </div>
  );
}
