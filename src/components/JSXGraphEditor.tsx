import { useState } from 'react';
import { JSXGraphSpec, JXGElementItem } from '../types/jsxgraphSpec';
import { Trash2, Copy, ChevronDown, ChevronUp, MoveUp, MoveDown } from 'lucide-react';

interface JSXGraphEditorProps {
  spec: JSXGraphSpec;
  onChange: (updated: JSXGraphSpec) => void;
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

export default function JSXGraphEditor({ spec, onChange }: JSXGraphEditorProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const existingPointNames = spec.elements
    .filter((e) => e.type === 'point' && e.name)
    .map((e) => e.name as string);

  const handleAddElement = (type: JXGElementItem['type']) => {
    const colors = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0284c7'];
    const chosenColor = colors[spec.elements.length % colors.length];

    let newItem: JXGElementItem;

    // Generate nice point name: A, B, C, D...
    const nextChar = String.fromCharCode(65 + (spec.elements.filter((e) => e.type === 'point').length % 26));

    switch (type) {
      case 'point':
        newItem = {
          type: 'point',
          name: nextChar,
          parents: [1, 2],
          color: chosenColor,
          fixed: false,
          size: 3,
        };
        break;
      case 'line':
        newItem = {
          type: 'line',
          parents: existingPointNames.length >= 2 ? [existingPointNames[0], existingPointNames[1]] : [1, 2, 4, 3],
          color: chosenColor,
          strokeWidth: 2,
        };
        break;
      case 'segment':
        newItem = {
          type: 'segment',
          parents: existingPointNames.length >= 2 ? [existingPointNames[0], existingPointNames[1]] : [[-2, 0], [2, 3]],
          color: chosenColor,
          strokeWidth: 2,
        };
        break;
      case 'circle':
        newItem = {
          type: 'circle',
          parents: existingPointNames.length >= 2 ? [existingPointNames[0], existingPointNames[1]] : [[0, 0], 3],
          color: chosenColor,
          strokeWidth: 2,
          fillOpacity: 0.1,
        };
        break;
      case 'polygon':
        newItem = {
          type: 'polygon',
          parents: existingPointNames.length >= 3 ? [existingPointNames[0], existingPointNames[1], existingPointNames[2]] : [[-2, -1], [3, -1], [0.5, 3]],
          color: chosenColor,
          fillOpacity: 0.2,
        };
        break;
      case 'functiongraph':
        newItem = {
          type: 'functiongraph',
          parents: ['x^2 - 3'],
          color: chosenColor,
          strokeWidth: 2.5,
        };
        break;
      case 'slider':
        newItem = {
          type: 'slider',
          name: 'k',
          parents: [[-4, -3], [1, -3], [-5, 1, 5]], // [[x1, y1], [x2, y2], [min, start, max]]
          color: chosenColor,
        };
        break;
      case 'angle':
        newItem = {
          type: 'angle',
          parents: existingPointNames.length >= 3 ? [existingPointNames[0], existingPointNames[1], existingPointNames[2]] : ['A', 'B', 'C'],
          color: chosenColor,
        };
        break;
      case 'midpoint':
        newItem = {
          type: 'midpoint',
          name: 'M',
          parents: existingPointNames.length >= 2 ? [existingPointNames[0], existingPointNames[1]] : ['A', 'B'],
          color: chosenColor,
        };
        break;
      default:
        newItem = {
          type: 'point',
          name: 'P',
          parents: [0, 0],
          color: chosenColor,
        };
    }

    onChange({
      ...spec,
      elements: [...spec.elements, newItem],
    });
    setOpenIndex(spec.elements.length);
  };

  const handleUpdateItem = (idx: number, updated: JXGElementItem) => {
    const next = [...spec.elements];
    next[idx] = updated;
    onChange({ ...spec, elements: next });
  };

  const handleDeleteItem = (idx: number) => {
    const next = spec.elements.filter((_, i) => i !== idx);
    onChange({ ...spec, elements: next });
  };

  const handleDuplicateItem = (idx: number) => {
    const item = spec.elements[idx];
    const cloned = JSON.parse(JSON.stringify(item));
    if (cloned.type === 'point' && Array.isArray(cloned.parents)) {
      cloned.parents[0] += 0.5;
      cloned.parents[1] += 0.5;
      cloned.name = (cloned.name || '') + "'";
    }
    const next = [...spec.elements];
    next.splice(idx + 1, 0, cloned);
    onChange({ ...spec, elements: next });
  };

  const handleMove = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= spec.elements.length) return;
    const next = [...spec.elements];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    onChange({ ...spec, elements: next });
    setOpenIndex(target);
  };

  const boundingbox = spec.boundingbox ?? [-5, 5, 5, -5];

  return (
    <div className="space-y-4">
      {/* Canvas Viewport Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          JSXGraph Maydoni & Chegaralari
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">X min</label>
            <input
              type="number"
              value={boundingbox[0]}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || -5;
                onChange({ ...spec, boundingbox: [val, boundingbox[1], boundingbox[2], boundingbox[3]] });
              }}
              className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs text-center"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Y max</label>
            <input
              type="number"
              value={boundingbox[1]}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 5;
                onChange({ ...spec, boundingbox: [boundingbox[0], val, boundingbox[2], boundingbox[3]] });
              }}
              className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs text-center"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">X max</label>
            <input
              type="number"
              value={boundingbox[2]}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 5;
                onChange({ ...spec, boundingbox: [boundingbox[0], boundingbox[1], val, boundingbox[3]] });
              }}
              className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs text-center"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Y min</label>
            <input
              type="number"
              value={boundingbox[3]}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || -5;
                onChange({ ...spec, boundingbox: [boundingbox[0], boundingbox[1], boundingbox[2], val] });
              }}
              className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs text-center"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={spec.axis !== false}
              onChange={(e) => onChange({ ...spec, axis: e.target.checked })}
              className="rounded text-blue-600"
            />
            <span>O‘qlar (Axis)</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={spec.grid !== false}
              onChange={(e) => onChange({ ...spec, grid: e.target.checked })}
              className="rounded text-blue-600"
            />
            <span>To‘r (Grid)</span>
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Balandlik:</span>
            <input
              type="range"
              min="240"
              max="540"
              step="20"
              value={spec.height ?? 380}
              onChange={(e) => onChange({ ...spec, height: parseInt(e.target.value, 10) })}
              className="w-20 accent-blue-600"
            />
            <span className="font-mono text-[11px]">{spec.height ?? 380}px</span>
          </div>
        </div>
      </div>

      {/* Add Elements */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            JSXGraph Element Qo‘shish
          </h3>
          <span className="text-xs text-slate-500 font-mono">{spec.elements.length} ta</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleAddElement('point')}
            className="rounded-xl border border-blue-200 bg-blue-50/70 py-1.5 px-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
          >
            + Nuqta
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('line')}
            className="rounded-xl border border-emerald-200 bg-emerald-50/70 py-1.5 px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
          >
            + Chiziq
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('segment')}
            className="rounded-xl border border-amber-200 bg-amber-50/70 py-1.5 px-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
          >
            + Kesma
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('circle')}
            className="rounded-xl border border-cyan-200 bg-cyan-50/70 py-1.5 px-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
          >
            + Aylana
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('polygon')}
            className="rounded-xl border border-purple-200 bg-purple-50/70 py-1.5 px-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
          >
            + Ko‘pburchak
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('functiongraph')}
            className="rounded-xl border border-rose-200 bg-rose-50/70 py-1.5 px-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
          >
            + Funksiya
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('midpoint')}
            className="rounded-xl border border-indigo-200 bg-indigo-50/70 py-1.5 px-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
          >
            + O‘rta nuqta
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('slider')}
            className="rounded-xl border border-teal-200 bg-teal-50/70 py-1.5 px-2 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition"
          >
            + Slayder
          </button>
        </div>
      </div>

      {/* Elements Stack */}
      <div className="space-y-3">
        {spec.elements.map((item, idx) => {
          const isOpen = openIndex === idx;
          const currentColor = item.color || '#2563eb';

          return (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3.5 py-2.5">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: currentColor }}
                  />
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="truncate text-left font-medium text-slate-800 text-xs sm:text-sm"
                  >
                    <span className="font-mono text-xs text-slate-400 mr-1.5">#{idx + 1}</span>
                    <span className="capitalize font-semibold text-blue-700">{item.type}</span>
                    {item.name ? `: ${item.name}` : ''}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                  >
                    <MoveUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === spec.elements.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                  >
                    <MoveDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateItem(idx)}
                    className="p-1 text-slate-400 hover:text-blue-600"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              {isOpen && (
                <div className="p-4 space-y-3 text-xs bg-white">
                  {/* Color Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Rang:</span>
                    <div className="flex items-center gap-1">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handleUpdateItem(idx, { ...item, color: c.hex })}
                          className={`h-5 w-5 rounded-md ${currentColor === c.hex ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Type Specific Fields */}
                  {item.type === 'point' && (
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Nomi</label>
                        <input
                          type="text"
                          value={item.name || ''}
                          onChange={(e) => handleUpdateItem(idx, { ...item, name: e.target.value })}
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">X koordinata</label>
                        <input
                          type="number"
                          step="0.5"
                          value={Array.isArray(item.parents) ? item.parents[0] : 0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const y = Array.isArray(item.parents) ? item.parents[1] : 0;
                            handleUpdateItem(idx, { ...item, parents: [val, y] });
                          }}
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Y koordinata</label>
                        <input
                          type="number"
                          step="0.5"
                          value={Array.isArray(item.parents) ? item.parents[1] : 0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const x = Array.isArray(item.parents) ? item.parents[0] : 0;
                            handleUpdateItem(idx, { ...item, parents: [x, val] });
                          }}
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {item.type === 'functiongraph' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Funksiya ifodasi: y = f(x)
                      </label>
                      <input
                        type="text"
                        value={typeof item.parents[0] === 'string' ? item.parents[0] : 'x^2'}
                        onChange={(e) => handleUpdateItem(idx, { ...item, parents: [e.target.value] })}
                        placeholder="masalan: sin(x) yoki x^2 - 4"
                        className="w-full rounded border border-slate-300 px-3 py-1.5 font-mono text-sm"
                      />
                    </div>
                  )}

                  {(item.type === 'line' || item.type === 'segment') && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">1-Nuqta (nomi)</label>
                        <input
                          type="text"
                          value={item.parents[0]}
                          onChange={(e) => handleUpdateItem(idx, { ...item, parents: [e.target.value, item.parents[1]] })}
                          placeholder="masalan: A"
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">2-Nuqta (nomi)</label>
                        <input
                          type="text"
                          value={item.parents[1]}
                          onChange={(e) => handleUpdateItem(idx, { ...item, parents: [item.parents[0], e.target.value] })}
                          placeholder="masalan: B"
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {item.type === 'circle' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Markaz nuqtasi</label>
                        <input
                          type="text"
                          value={item.parents[0]}
                          onChange={(e) => handleUpdateItem(idx, { ...item, parents: [e.target.value, item.parents[1]] })}
                          placeholder="masalan: A yoki [0,0]"
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Aylanadagi nuqta yoki radius</label>
                        <input
                          type="text"
                          value={item.parents[1]}
                          onChange={(e) => {
                            const num = parseFloat(e.target.value);
                            const val = isNaN(num) ? e.target.value : num;
                            handleUpdateItem(idx, { ...item, parents: [item.parents[0], val] });
                          }}
                          placeholder="masalan: B yoki 3"
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {item.type === 'midpoint' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">1-Nuqta</label>
                        <input
                          type="text"
                          value={item.parents[0]}
                          onChange={(e) => handleUpdateItem(idx, { ...item, parents: [e.target.value, item.parents[1]] })}
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">2-Nuqta</label>
                        <input
                          type="text"
                          value={item.parents[1]}
                          onChange={(e) => handleUpdateItem(idx, { ...item, parents: [item.parents[0], e.target.value] })}
                          className="w-full rounded border border-slate-300 px-2 py-1 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
