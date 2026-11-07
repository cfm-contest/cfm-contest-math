import { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  Eye,
  Sliders,
  Plus,
  RotateCcw,
  Maximize2,
  Minimize2,
  Compass,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import MathGraph, { makeFn } from './components/MathGraph';
import ItemEditor from './components/ItemEditor';
import JSXGraphViewer from './components/JSXGraphViewer';
import JSXGraphEditor from './components/JSXGraphEditor';
import MarkdownRenderer from './components/MarkdownRenderer';
import { PRESETS } from './data/presets';
import { MafsSpec, Item, V2 } from './types/mafsSpec';
import { JSXGraphSpec } from './types/jsxgraphSpec';

type ActiveTab = 'visual' | 'preview' | 'json';
type EngineType = 'mafs' | 'jsxgraph';
type MathCategory = 'all' | 'Algebra' | 'Geometriya' | 'Trigonometriya' | 'Vektorlar' | 'Matematik Analiz';

export default function App() {
  const [activeEngine, setActiveEngine] = useState<EngineType>('mafs');
  const [selectedCategory, setSelectedCategory] = useState<MathCategory>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [activeTab, setActiveTab] = useState<ActiveTab>('visual');

  // Mafs State
  const [mafsSpec, setMafsSpec] = useState<MafsSpec>(() => JSON.parse(JSON.stringify(PRESETS[0].spec!)));

  // JSXGraph State
  const defaultJxgPreset = PRESETS.find((p) => p.engine === 'jsxgraph')!;
  const [jsxSpec, setJsxSpec] = useState<JSXGraphSpec>(() => JSON.parse(JSON.stringify(defaultJxgPreset.jsxSpec!)));

  // Raw JSON text for JSON editor mode
  const [jsonText, setJsonText] = useState<string>(() => JSON.stringify(PRESETS[0].spec!, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Markdown lesson text for Preview mode
  const [markdownContent, setMarkdownContent] = useState<string>(PRESETS[0].sampleMarkdown);

  // UI helpers
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isFullscreenGraph, setIsFullscreenGraph] = useState(false);
  const [clickToAddPoint, setClickToAddPoint] = useState(false);

  // Filter presets by category
  const filteredPresets = useMemo(() => {
    if (selectedCategory === 'all') return PRESETS;
    return PRESETS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Check validity of functions in active spec
  const formulaValidation = useMemo(() => {
    if (activeEngine === 'mafs') {
      const fnItems = mafsSpec.items.filter((i) => i.type === 'function');
      for (const item of fnItems) {
        if (item.type === 'function') {
          const fn = makeFn(item.expr);
          if (isNaN(fn(1)) && isNaN(fn(0)) && isNaN(fn(2))) {
            return { valid: false, message: `"${item.expr}" formulasi xato` };
          }
        }
      }
      return { valid: true, message: 'Matematik formula to‘g‘ri' };
    }
    return { valid: true, message: 'Geometriya elementlari faol' };
  }, [mafsSpec, activeEngine]);

  // Switch engine
  const handleSwitchEngine = (newEngine: EngineType) => {
    setActiveEngine(newEngine);
    if (newEngine === 'mafs') {
      setJsonText(JSON.stringify(mafsSpec, null, 2));
    } else {
      setJsonText(JSON.stringify(jsxSpec, null, 2));
    }
    setJsonError(null);
  };

  // Sync JSON text when Mafs spec changes visually
  const updateMafsSpec = (newSpec: MafsSpec) => {
    setMafsSpec(newSpec);
    if (activeEngine === 'mafs') {
      setJsonText(JSON.stringify(newSpec, null, 2));
      setJsonError(null);
    }
  };

  // Sync JSON text when JSXGraph spec changes visually
  const updateJsxSpec = (newSpec: JSXGraphSpec) => {
    setJsxSpec(newSpec);
    if (activeEngine === 'jsxgraph') {
      setJsonText(JSON.stringify(newSpec, null, 2));
      setJsonError(null);
    }
  };

  // Sync markdown content when specs change
  useEffect(() => {
    if (activeEngine === 'mafs') {
      const mafsBlockRegex = /```mafs\n[\s\S]*?```/;
      const newBlock = `\`\`\`mafs\n${JSON.stringify(mafsSpec, null, 2)}\n\`\`\``;
      if (mafsBlockRegex.test(markdownContent)) {
        setMarkdownContent((prev) => prev.replace(mafsBlockRegex, newBlock));
      }
    } else {
      const jsxBlockRegex = /```jsxgraph\n[\s\S]*?```/;
      const newBlock = `\`\`\`jsxgraph\n${JSON.stringify(jsxSpec, null, 2)}\n\`\`\``;
      if (jsxBlockRegex.test(markdownContent)) {
        setMarkdownContent((prev) => prev.replace(jsxBlockRegex, newBlock));
      }
    }
  }, [mafsSpec, jsxSpec, activeEngine]);

  // Handle Preset selection
  const handleSelectPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setSelectedPresetId(id);
    setActiveEngine(preset.engine);

    if (preset.engine === 'mafs' && preset.spec) {
      const cloned = JSON.parse(JSON.stringify(preset.spec));
      setMafsSpec(cloned);
      setJsonText(JSON.stringify(cloned, null, 2));
    } else if (preset.engine === 'jsxgraph' && preset.jsxSpec) {
      const cloned = JSON.parse(JSON.stringify(preset.jsxSpec));
      setJsxSpec(cloned);
      setJsonText(JSON.stringify(cloned, null, 2));
    }

    setMarkdownContent(preset.sampleMarkdown);
    setJsonError(null);
  };

  // Copy helpers
  const handleCopy = (type: 'codeBlock' | 'jsonOnly' | 'fullMarkdown') => {
    let textToCopy = '';
    let message = '';

    if (type === 'codeBlock') {
      if (activeEngine === 'mafs') {
        textToCopy = `\`\`\`mafs\n${JSON.stringify(mafsSpec, null, 2)}\n\`\`\``;
        message = "Django uchun ```mafs kodi nusxalandi! Matn maydoniga joylang.";
      } else {
        textToCopy = `\`\`\`jsxgraph\n${JSON.stringify(jsxSpec, null, 2)}\n\`\`\``;
        message = "Django uchun ```jsxgraph kodi nusxalandi! Matn maydoniga joylang.";
      }
    } else if (type === 'fullMarkdown') {
      textToCopy = markdownContent;
      message = "To‘liq dars matni (nazariya, formula va chizma) nusxalandi!";
    } else if (type === 'jsonOnly') {
      textToCopy = activeEngine === 'mafs' ? JSON.stringify(mafsSpec, null, 2) : JSON.stringify(jsxSpec, null, 2);
      message = 'Toza JSON kodi nusxalandi!';
    }

    navigator.clipboard.writeText(textToCopy);
    setCopyFeedback(message);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // Mafs Item Management
  const handleAddMafsItem = (type: Item['type']) => {
    let newItem: Item;
    const colors = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed'];
    const chosenColor = colors[mafsSpec.items.length % colors.length];

    switch (type) {
      case 'function':
        newItem = { type: 'function', expr: 'x^2 - 2', color: chosenColor };
        break;
      case 'point':
        newItem = { type: 'point', x: 1, y: 2, color: chosenColor, label: '(1, 2)' };
        break;
      case 'vector':
        newItem = { type: 'vector', from: [0, 0], to: [2, 3], color: chosenColor };
        break;
      case 'segment':
        newItem = { type: 'segment', a: [-2, -1], b: [2, 3], color: chosenColor };
        break;
      case 'circle':
        newItem = { type: 'circle', center: [0, 0], r: 2.5, color: chosenColor };
        break;
      case 'polygon':
        newItem = {
          type: 'polygon',
          points: [
            [-1, -1],
            [2, -1],
            [1, 2],
          ],
          color: chosenColor,
        };
        break;
      case 'text':
        newItem = { type: 'text', x: 0, y: 2.5, text: 'Izoh matni', color: chosenColor };
        break;
    }

    updateMafsSpec({
      ...mafsSpec,
      items: [...mafsSpec.items, newItem],
    });
  };

  // Mafs canvas click
  const handleMafsCanvasClick = (coord: V2) => {
    if (clickToAddPoint) {
      const newPoint: Item = {
        type: 'point',
        x: coord[0],
        y: coord[1],
        color: '#dc2626',
        label: `(${coord[0]}, ${coord[1]})`,
      };
      updateMafsSpec({
        ...mafsSpec,
        items: [...mafsSpec.items, newPoint],
      });
      setCopyFeedback(`Nuqta qo‘shildi: (${coord[0]}, ${coord[1]})`);
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  // JSON editor change
  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      if (activeEngine === 'mafs') {
        if (!Array.isArray(parsed.items)) {
          setJsonError("Mafs uchun 'items' massiv bo'lishi kerak");
          return;
        }
        setMafsSpec(parsed);
      } else {
        if (!Array.isArray(parsed.elements)) {
          setJsonError("JSXGraph uchun 'elements' massiv bo'lishi kerak");
          return;
        }
        setJsxSpec(parsed);
      }
      setJsonError(null);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : 'JSON formati xato');
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      if (activeEngine === 'mafs') setMafsSpec(parsed);
      else setJsxSpec(parsed);
      setJsonError(null);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
            {/* Branding & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                    Math Studio
                  </h1>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                    Django uchun Chizma &amp; Grafik
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Matematik grafik va figuralarni vizual chizing va Django dars matniga 1-bosishda nusxalab joylang
                </p>
              </div>
            </div>

            {/* Engine Switcher + Copy Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Engine Toggle */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleSwitchEngine('mafs')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                    activeEngine === 'mafs'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Algebra va funksiya grafiklari uchun"
                >
                  <span className="h-2 w-2 rounded-full bg-blue-300"></span>
                  Mafs (Grafik)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchEngine('jsxgraph')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                    activeEngine === 'jsxgraph'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Dinamik va interaktiv geometriya uchun"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
                  JSXGraph (Geometriya)
                </button>
              </div>

              {/* Primary Copy Button for Django */}
              <button
                type="button"
                onClick={() => handleCopy('codeBlock')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 text-white ${
                  activeEngine === 'mafs'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30'
                }`}
                title="Django sahifasiga qo'yish uchun chizmani nusxalash"
              >
                {copyFeedback && copyFeedback.includes('Django') ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Django uchun nusxalash</span>
                  </>
                )}
              </button>

              {/* Copy Full Lesson Markdown */}
              <button
                type="button"
                onClick={() => handleCopy('fullMarkdown')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs sm:text-sm font-semibold shadow-2xs transition"
                title="Sarlavha, nazariya, KaTeX formula va grafikni bitta qilib nusxalash"
              >
                <FileCheck className="h-4 w-4 text-slate-500" />
                <span>To‘liq darsni nusxalash</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Clear and non-technical) */}
          <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-100 pt-1 -mb-px overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs sm:text-sm font-medium transition ${
                activeTab === 'visual'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>1. Chizma Maydoni ({activeEngine === 'mafs' ? 'Mafs Grafik' : 'JSXGraph Geometriya'})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs sm:text-sm font-medium transition ${
                activeTab === 'preview'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>2. Darsni Tekshirish &amp; Jonli Ko‘rish</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs sm:text-sm font-medium transition ${
                activeTab === 'json'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>3. Grafik Kodi / JSON</span>
            </button>
          </div>
        </div>
      </header>

      {/* Math Curriculum Taxonomy Bar (under header) */}
      <div className="bg-slate-100/70 border-b border-slate-200 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 text-xs overflow-x-auto">
            <span className="text-slate-500 font-semibold mr-1 text-[11px] uppercase tracking-wider">
              Mavzular:
            </span>
            {(
              [
                ['all', 'Barchasi'],
                ['Algebra', 'Algebra'],
                ['Geometriya', 'Geometriya'],
                ['Trigonometriya', 'Trigonometriya'],
                ['Vektorlar', 'Vektorlar'],
                ['Matematik Analiz', 'Matematik Analiz'],
              ] as const
            ).map(([catKey, catLabel]) => (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey as MathCategory)}
                className={`rounded-lg px-2.5 py-0.5 font-medium transition ${
                  selectedCategory === catKey
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {catLabel}
              </button>
            ))}
          </div>

          {/* Preset Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-0.5 border border-slate-200 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer py-0.5 text-xs max-w-[240px] sm:max-w-sm truncate"
            >
              {filteredPresets.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.engine.toUpperCase()}] {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10 animate-fade-in">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: VISUAL STUDIO */}
        {activeTab === 'visual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Visual Builder Controls */}
            <div className="lg:col-span-5 space-y-4">
              {activeEngine === 'mafs' ? (
                <>
                  {/* Mafs Viewport Settings */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="h-3.5 w-3.5 text-blue-600" />
                        Koordinata Chegaralari
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          updateMafsSpec({
                            ...mafsSpec,
                            x: [-5, 5],
                            y: [-5, 5],
                            height: 360,
                            grid: true,
                          });
                        }}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Standart holatga qaytarish
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          X o‘qi [min, max]
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={mafsSpec.x?.[0] ?? -5}
                            onChange={(e) => {
                              const min = parseFloat(e.target.value) || -5;
                              updateMafsSpec({ ...mafsSpec, x: [min, mafsSpec.x?.[1] ?? 5] });
                            }}
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 font-mono text-xs text-center"
                          />
                          <span className="text-slate-400 text-xs">→</span>
                          <input
                            type="number"
                            value={mafsSpec.x?.[1] ?? 5}
                            onChange={(e) => {
                              const max = parseFloat(e.target.value) || 5;
                              updateMafsSpec({ ...mafsSpec, x: [mafsSpec.x?.[0] ?? -5, max] });
                            }}
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 font-mono text-xs text-center"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Y o‘qi [min, max]
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={mafsSpec.y?.[0] ?? -5}
                            onChange={(e) => {
                              const min = parseFloat(e.target.value) || -5;
                              updateMafsSpec({ ...mafsSpec, y: [min, mafsSpec.y?.[1] ?? 5] });
                            }}
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 font-mono text-xs text-center"
                          />
                          <span className="text-slate-400 text-xs">→</span>
                          <input
                            type="number"
                            value={mafsSpec.y?.[1] ?? 5}
                            onChange={(e) => {
                              const max = parseFloat(e.target.value) || 5;
                              updateMafsSpec({ ...mafsSpec, y: [mafsSpec.y?.[0] ?? -5, max] });
                            }}
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 font-mono text-xs text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Balandlik:</span>
                        <input
                          type="range"
                          min="240"
                          max="540"
                          step="20"
                          value={mafsSpec.height ?? 360}
                          onChange={(e) => updateMafsSpec({ ...mafsSpec, height: parseInt(e.target.value, 10) })}
                          className="w-20 accent-blue-600 cursor-pointer"
                        />
                        <span className="font-mono text-slate-500 text-[11px]">{mafsSpec.height ?? 360}px</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mafsSpec.grid !== false}
                          onChange={(e) => updateMafsSpec({ ...mafsSpec, grid: e.target.checked })}
                          className="rounded text-blue-600"
                        />
                        <span>Katakli to‘r (Grid)</span>
                      </label>
                    </div>
                  </div>

                  {/* Add Mafs Elements */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Plus className="h-3.5 w-3.5 text-blue-600" />
                        Chizmaga Element Qo‘shish
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        {mafsSpec.items.length} ta element
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddMafsItem('function')}
                        className="rounded-xl border border-blue-200 bg-blue-50/70 p-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                      >
                        + Funksiya
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddMafsItem('point')}
                        className="rounded-xl border border-rose-200 bg-rose-50/70 p-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                      >
                        + Nuqta
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddMafsItem('vector')}
                        className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        + Vektor
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddMafsItem('segment')}
                        className="rounded-xl border border-amber-200 bg-amber-50/70 p-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                      >
                        + Kesma
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddMafsItem('circle')}
                        className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
                      >
                        + Aylana
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddMafsItem('polygon')}
                        className="rounded-xl border border-purple-200 bg-purple-50/70 p-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                      >
                        + Ko‘pburchak
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddMafsItem('text')}
                        className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        + Matn / Yorliq
                      </button>
                    </div>
                  </div>

                  {/* Mafs Items Stack */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Chizmadagi Qatlamlar ({mafsSpec.items.length})
                      </h4>
                      {mafsSpec.items.length > 0 && (
                        <button
                          type="button"
                          onClick={() => updateMafsSpec({ ...mafsSpec, items: [] })}
                          className="text-xs text-rose-500 hover:text-rose-700"
                        >
                          Barchasini tozalash
                        </button>
                      )}
                    </div>

                    {mafsSpec.items.map((item, idx) => (
                      <ItemEditor
                        key={idx}
                        item={item}
                        index={idx}
                        total={mafsSpec.items.length}
                        onChange={(updated) => {
                          const next = [...mafsSpec.items];
                          next[idx] = updated;
                          updateMafsSpec({ ...mafsSpec, items: next });
                        }}
                        onDelete={() => {
                          const next = mafsSpec.items.filter((_, i) => i !== idx);
                          updateMafsSpec({ ...mafsSpec, items: next });
                        }}
                        onDuplicate={() => {
                          const cloned = JSON.parse(JSON.stringify(mafsSpec.items[idx]));
                          const next = [...mafsSpec.items];
                          next.splice(idx + 1, 0, cloned);
                          updateMafsSpec({ ...mafsSpec, items: next });
                        }}
                        onMoveUp={() => {
                          if (idx === 0) return;
                          const next = [...mafsSpec.items];
                          const [m] = next.splice(idx, 1);
                          next.splice(idx - 1, 0, m);
                          updateMafsSpec({ ...mafsSpec, items: next });
                        }}
                        onMoveDown={() => {
                          if (idx === mafsSpec.items.length - 1) return;
                          const next = [...mafsSpec.items];
                          const [m] = next.splice(idx, 1);
                          next.splice(idx + 1, 0, m);
                          updateMafsSpec({ ...mafsSpec, items: next });
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                /* JSXGraph Visual Editor */
                <JSXGraphEditor spec={jsxSpec} onChange={updateJsxSpec} />
              )}
            </div>

            {/* Right Column: Live Graph Preview & Django Export Block */}
            <div className={`lg:col-span-7 space-y-4 ${isFullscreenGraph ? 'fixed inset-4 z-50 bg-white p-6 rounded-2xl shadow-2xl overflow-y-auto' : ''}`}>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                        activeEngine === 'mafs' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                    ></span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeEngine === 'mafs'
                        ? 'Jonli Mafs Maydoni'
                        : 'Jonli JSXGraph Dinamik Maydoni'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Formula Status Indicator */}
                    <div
                      className={`hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                        formulaValidation.valid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {formulaValidation.valid ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-rose-600" />
                      )}
                      <span>{formulaValidation.message}</span>
                    </div>

                    {activeEngine === 'mafs' && (
                      <button
                        type="button"
                        onClick={() => setClickToAddPoint(!clickToAddPoint)}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                          clickToAddPoint
                            ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {clickToAddPoint ? '✓ Nuqta qo‘yish faol' : 'Bosib nuqta qo‘yish'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsFullscreenGraph(!isFullscreenGraph)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                    >
                      {isFullscreenGraph ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-2">
                  {activeEngine === 'mafs'
                    ? 'Sichqonchani grafik ustiga keltiring: koordinatalar avtomatik hisoblanadi.'
                    : 'JSXGraph: Nuqtalarni sichqoncha bilan ushlab suring, burchak va chiziqlar real vaqtda harakatlanadi.'}
                </p>

                {/* THE LIVE GRAPH VIEWER */}
                {activeEngine === 'mafs' ? (
                  <MathGraph
                    spec={mafsSpec}
                    showHoverCoordinates={true}
                    onCoordinateClick={handleMafsCanvasClick}
                  />
                ) : (
                  <JSXGraphViewer spec={jsxSpec} />
                )}
              </div>

              {/* Django Export Code Card (Direct Copy Box) */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg text-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Django uchun tayyor kod (```` ```{activeEngine} ````)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('codeBlock')}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold shadow-sm transition text-white ${
                      activeEngine === 'mafs' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Nusxalash</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-2.5">
                  Ushbu kodni to‘g‘ridan-to‘g‘ri Django dars matniga qo‘ysangiz, sahifada yuqoridagi kabi chizma hosil bo‘ladi:
                </p>

                <div className="relative">
                  <pre className="max-h-56 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-emerald-300 border border-slate-800/80">
                    <code>
                      {activeEngine === 'mafs'
                        ? `\`\`\`mafs\n${JSON.stringify(mafsSpec, null, 2)}\n\`\`\``
                        : `\`\`\`jsxgraph\n${JSON.stringify(jsxSpec, null, 2)}\n\`\`\``}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DJANGO LESSON PREVIEW (KaTeX + Mafs + JSXGraph) */}
        {activeTab === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Django Matn Maydoni</h3>
                  <p className="text-xs text-slate-500">
                    Formulalar: <code className="font-mono text-blue-600">$...$</code>, Chizma: <code className="font-mono text-emerald-600">```{activeEngine}</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('fullMarkdown')}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>To‘liq nusxalash</span>
                </button>
              </div>

              <textarea
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                rows={22}
                className="w-full rounded-2xl border border-slate-300 bg-white p-4 font-mono text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                spellCheck={false}
              />
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    O‘quvchi Ko‘radigan Dars Sahifasi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Formulalar va chizma birgalikda render qilinadi
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  Jonli Natija
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[460px]">
                <MarkdownRenderer content={markdownContent} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JSON EDITOR */}
        {activeTab === 'json' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeEngine === 'mafs' ? 'Mafs' : 'JSXGraph'} Koidi (JSON)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mavjud kodni bu yerga qo‘yib tahrirlashingiz mumkin
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFormatJson}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs"
                  >
                    Formatlash
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy('jsonOnly')}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 shadow-2xs"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Nusxalash
                  </button>
                </div>
              </div>

              {jsonError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                  <span>Xatolik: {jsonError}</span>
                </div>
              )}

              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={22}
                className="w-full rounded-2xl border border-slate-300 bg-slate-950 p-4 font-mono text-xs text-slate-100 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                spellCheck={false}
              />
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Jonli Natija</h3>
              <p className="text-xs text-slate-500">
                Kod o‘zgarishi bilan chizma yangilanadi
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                {activeEngine === 'mafs' ? (
                  <MathGraph source={jsonText} />
                ) : (
                  <JSXGraphViewer source={jsonText} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          Math Studio — Matematika o‘qituvchilari va adminlar uchun interaktiv grafik va geometriya platformasi.
        </p>
      </footer>
    </div>
  );
}
