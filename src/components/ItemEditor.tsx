import { useState } from 'react';
import { Item, V2 } from '../types/mafsSpec';
import { Trash2, Copy, ChevronDown, ChevronUp, MoveUp, MoveDown, FunctionSquare } from 'lucide-react';
import MathToolbar from './MathToolbar';

interface ItemEditorProps {
  item: Item;
  index: number;
  total: number;
  onChange: (updated: Item) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const PRESET_COLORS = [
  { name: 'Ko‘k', hex: '#2563eb' },
  { name: 'Qizil', hex: '#dc2626' },
  { name: 'Yashil', hex: '#059669' },
  { name: 'Sariq', hex: '#d97706' },
  { name: 'Binafsha', hex: '#7c3aed' },
  { name: 'Pushti', hex: '#e11d48' },
  { name: 'Kulrang', hex: '#64748b' },
  { name: 'To‘q Moviy', hex: '#0284c7' },
];

export default function ItemEditor({
  item,
  index,
  total,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: ItemEditorProps) {
  const [isOpen, setIsOpen] = useState(true);

  const getItemTitle = () => {
    switch (item.type) {
      case 'function':
        return `Funksiya: y = ${item.expr || '...'}`;
      case 'point':
        return `Nuqta: (${item.x}, ${item.y}) ${item.label ? `"${item.label}"` : ''}`;
      case 'vector':
        return `Vektor: [${item.from?.[0] ?? 0}, ${item.from?.[1] ?? 0}] → [${item.to[0]}, ${item.to[1]}]`;
      case 'segment':
        return `Kesma: [${item.a[0]}, ${item.a[1]}] – [${item.b[0]}, ${item.b[1]}]`;
      case 'circle':
        return `Aylana: Markaz (${item.center[0]}, ${item.center[1]}), R = ${item.r}`;
      case 'polygon':
        return `Ko‘pburchak: ${item.points.length} ta nuqta`;
      case 'text':
        return `Matn: "${item.text}" (${item.x}, ${item.y})`;
    }
  };

  const currentColor = 'color' in item ? item.color ?? '#2563eb' : '#2563eb';

  const updateColor = (hex: string) => {
    onChange({ ...item, color: hex } as Item);
  };

  const addMathSymbol = (sym: string) => {
    if (item.type === 'function') {
      onChange({ ...item, expr: (item.expr || '') + sym });
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:border-slate-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3.5 py-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span
            className="h-3 w-3 flex-shrink-0 rounded-full shadow-inner ring-1 ring-black/10"
            style={{ backgroundColor: currentColor }}
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 truncate text-left font-medium text-slate-800 hover:text-blue-600 text-xs sm:text-sm"
          >
            <span className="font-mono text-xs text-slate-400">#{index + 1}</span>
            <span className="truncate">{getItemTitle()}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Yuqoriga surish"
            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25"
          >
            <MoveUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            title="Pastga surish"
            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25"
          >
            <MoveDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            title="Nusxasini yaratish"
            className="p-1 text-slate-400 hover:text-blue-600"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="O‘chirish"
            className="p-1 text-slate-400 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-700"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isOpen && (
        <div className="p-3.5 space-y-3.5 text-xs sm:text-sm bg-white">
          {/* Item Type Switcher & Color */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Element turi
              </label>
              <select
                value={item.type}
                onChange={(e) => {
                  const newType = e.target.value as Item['type'];
                  if (newType === item.type) return;

                  switch (newType) {
                    case 'function':
                      onChange({ type: 'function', expr: 'x^2', color: currentColor });
                      break;
                    case 'point':
                      onChange({ type: 'point', x: 2, y: 3, color: currentColor, label: '(2, 3)' });
                      break;
                    case 'vector':
                      onChange({ type: 'vector', from: [0, 0], to: [3, 2], color: currentColor });
                      break;
                    case 'segment':
                      onChange({ type: 'segment', a: [-2, 0], b: [2, 3], color: currentColor });
                      break;
                    case 'circle':
                      onChange({ type: 'circle', center: [0, 0], r: 3, color: currentColor });
                      break;
                    case 'polygon':
                      onChange({
                        type: 'polygon',
                        points: [
                          [0, 0],
                          [3, 0],
                          [1.5, 3],
                        ],
                        color: currentColor,
                      });
                      break;
                    case 'text':
                      onChange({ type: 'text', x: 1, y: 1, text: 'Matn', color: currentColor });
                      break;
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <option value="function">Funksiya (f(x))</option>
                <option value="point">Nuqta</option>
                <option value="vector">Vektor</option>
                <option value="segment">Kesma</option>
                <option value="circle">Aylana</option>
                <option value="polygon">Ko‘pburchak</option>
                <option value="text">Matn / Belgilash</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Rang
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => updateColor(c.hex)}
                    title={c.name}
                    className={`h-5 w-5 rounded-md transition-all ${
                      currentColor === c.hex
                        ? 'ring-2 ring-blue-500 ring-offset-1 scale-110 shadow-xs'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => updateColor(e.target.value)}
                  className="h-5 w-6 cursor-pointer rounded border border-slate-300 p-0"
                  title="Boshqa rang tanlash"
                />
              </div>
            </div>
          </div>

          {/* Type specific fields */}
          {item.type === 'function' && (
            <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FunctionSquare className="h-3.5 w-3.5 text-blue-600" />
                    Funksiya ifodasi: <span className="font-mono text-blue-600 font-bold">y = f(x)</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={item.expr}
                  onChange={(e) => onChange({ ...item, expr: e.target.value })}
                  placeholder="masalan: x^2 - 4*x + 3 yoki sin(x)"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Math Toolbar for Function */}
              <MathToolbar onInsert={addMathSymbol} />

              {/* Domain filter */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Domain min (x boshlanishi):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={item.domain ? item.domain[0] : ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                      if (val === undefined) {
                        onChange({ ...item, domain: undefined });
                      } else {
                        const currentMax = item.domain ? item.domain[1] : 5;
                        onChange({ ...item, domain: [val, currentMax] });
                      }
                    }}
                    placeholder="-∞ (avtomatik)"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Domain max (x tugashi):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={item.domain ? item.domain[1] : ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                      if (val === undefined) {
                        onChange({ ...item, domain: undefined });
                      } else {
                        const currentMin = item.domain ? item.domain[0] : -5;
                        onChange({ ...item, domain: [currentMin, val] });
                      }
                    }}
                    placeholder="+∞ (avtomatik)"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {item.type === 'point' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">X koordinata</label>
                <input
                  type="number"
                  step="0.1"
                  value={item.x}
                  onChange={(e) => onChange({ ...item, x: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Y koordinata</label>
                <input
                  type="number"
                  step="0.1"
                  value={item.y}
                  onChange={(e) => onChange({ ...item, y: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Yorliq (Label)</label>
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={(e) => onChange({ ...item, label: e.target.value })}
                  placeholder="masalan: A (2, 3)"
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          {item.type === 'vector' && (
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Boshlanish X</label>
                  <input
                    type="number"
                    step="0.5"
                    value={item.from ? item.from[0] : 0}
                    onChange={(e) => {
                      const x = parseFloat(e.target.value) || 0;
                      onChange({ ...item, from: [x, item.from?.[1] ?? 0] });
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Boshlanish Y</label>
                  <input
                    type="number"
                    step="0.5"
                    value={item.from ? item.from[1] : 0}
                    onChange={(e) => {
                      const y = parseFloat(e.target.value) || 0;
                      onChange({ ...item, from: [item.from?.[0] ?? 0, y] });
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Uch X</label>
                  <input
                    type="number"
                    step="0.5"
                    value={item.to[0]}
                    onChange={(e) => {
                      const x = parseFloat(e.target.value) || 0;
                      onChange({ ...item, to: [x, item.to[1]] });
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Uch Y</label>
                  <input
                    type="number"
                    step="0.5"
                    value={item.to[1]}
                    onChange={(e) => {
                      const y = parseFloat(e.target.value) || 0;
                      onChange({ ...item, to: [item.to[0], y] });
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {item.type === 'segment' && (
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nuqta A (x)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={item.a[0]}
                    onChange={(e) => {
                      const x = parseFloat(e.target.value) || 0;
                      onChange({ ...item, a: [x, item.a[1]] });
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nuqta A (y)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={item.a[1]}
                    onChange={(e) => {
                      const y = parseFloat(e.target.value) || 0;
                      onChange({ ...item, a: [item.a[0], y] });
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nuqta B (x)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={item.b[0]}
                    onChange={(e) => {
                      const x = parseFloat(e.target.value) || 0;
                      onChange({ ...item, b: [x, item.b[1]] });
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nuqta B (y)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={item.b[1]}
                    onChange={(e) => {
                      const y = parseFloat(e.target.value) || 0;
                      onChange({ ...item, b: [item.b[0], y] });
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {item.type === 'circle' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Markaz X</label>
                <input
                  type="number"
                  step="0.5"
                  value={item.center[0]}
                  onChange={(e) => {
                    const x = parseFloat(e.target.value) || 0;
                    onChange({ ...item, center: [x, item.center[1]] });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Markaz Y</label>
                <input
                  type="number"
                  step="0.5"
                  value={item.center[1]}
                  onChange={(e) => {
                    const y = parseFloat(e.target.value) || 0;
                    onChange({ ...item, center: [item.center[0], y] });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Radiusi (R)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={item.r}
                  onChange={(e) => onChange({ ...item, r: Math.max(0.1, parseFloat(e.target.value) || 1) })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
            </div>
          )}

          {item.type === 'polygon' && (
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Ko‘pburchak cho‘qqilari:</span>
                <button
                  type="button"
                  onClick={() => {
                    const last = item.points[item.points.length - 1] || [0, 0];
                    onChange({ ...item, points: [...item.points, [last[0] + 1, last[1] + 1]] });
                  }}
                  className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                >
                  + Nuqta
                </button>
              </div>

              <div className="space-y-1.5">
                {item.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono text-xs text-slate-400">P{pIdx + 1}</span>
                    <input
                      type="number"
                      step="0.5"
                      value={pt[0]}
                      onChange={(e) => {
                        const newPts: V2[] = [...item.points];
                        newPts[pIdx] = [parseFloat(e.target.value) || 0, pt[1]];
                        onChange({ ...item, points: newPts });
                      }}
                      placeholder="X"
                      className="w-20 rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={pt[1]}
                      onChange={(e) => {
                        const newPts: V2[] = [...item.points];
                        newPts[pIdx] = [pt[0], parseFloat(e.target.value) || 0];
                        onChange({ ...item, points: newPts });
                      }}
                      placeholder="Y"
                      className="w-20 rounded border border-slate-300 px-2 py-1 font-mono text-xs"
                    />
                    {item.points.length > 3 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPts = item.points.filter((_, i) => i !== pIdx);
                          onChange({ ...item, points: newPts });
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.type === 'text' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">X koordinata</label>
                <input
                  type="number"
                  step="0.5"
                  value={item.x}
                  onChange={(e) => onChange({ ...item, x: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Y koordinata</label>
                <input
                  type="number"
                  step="0.5"
                  value={item.y}
                  onChange={(e) => onChange({ ...item, y: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Matn mazmuni</label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => onChange({ ...item, text: e.target.value })}
                  placeholder="masalan: Maksimum nuqta"
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
