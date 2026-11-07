import { Preset } from '../types/mafsSpec';

export const PRESETS: Preset[] = [
  // ==================== ALGEBRA ====================
  {
    id: 'parabola',
    engine: 'mafs',
    title: 'Parabola va Uchi (Kvadratik Funksiya)',
    category: 'Algebra',
    description: 'Kvadratik funksiya $y = x^2 - 4x + 3$, uning uchi $(2, -1)$, simmetriya o‘qi va koordinata o‘qlari bilan kesishish nuqtalari.',
    latexFormula: 'y = x^2 - 4x + 3',
    spec: {
      x: [-3, 7],
      y: [-3, 8],
      height: 380,
      grid: true,
      items: [
        { type: 'function', expr: 'x^2 - 4*x + 3', color: '#2563eb' },
        { type: 'segment', a: [2, -3], b: [2, 8], color: '#94a3b8' },
        { type: 'point', x: 2, y: -1, color: '#dc2626', label: 'Uchi (2, -1)' },
        { type: 'point', x: 1, y: 0, color: '#059669', label: 'x₁ (1, 0)' },
        { type: 'point', x: 3, y: 0, color: '#059669', label: 'x₂ (3, 0)' },
        { type: 'point', x: 0, y: 3, color: '#d97706', label: 'y-kesish (0, 3)' },
        { type: 'text', x: 2.2, y: 7, text: 'x = 2 simmetriya o‘qi' },
      ],
    },
    sampleMarkdown: `# Kvadratik Funksiya va Uchi

Ushbu darsda $y = x^2 - 4x + 3$ parabolasi xususiyatlarini ko'rib chiqamiz.

Parabolaning uchi koordinatalari:
$$x_0 = -\\frac{b}{2a} = -\\frac{-4}{2(1)} = 2$$
$$y_0 = 2^2 - 4(2) + 3 = -1$$

Ildizlari esa $x_1 = 1$ va $x_2 = 3$ bo'lib, $y$-o'qini $(0, 3)$ nuqtada kesib o'tadi:

\`\`\`mafs
{
  "x": [-3, 7],
  "y": [-3, 8],
  "height": 380,
  "grid": true,
  "items": [
    { "type": "function", "expr": "x^2 - 4*x + 3", "color": "#2563eb" },
    { "type": "segment", "a": [2, -3], "b": [2, 8], "color": "#94a3b8" },
    { "type": "point", "x": 2, "y": -1, "color": "#dc2626", "label": "Uchi (2, -1)" },
    { "type": "point", "x": 1, "y": 0, "color": "#059669", "label": "x₁ (1, 0)" },
    { "type": "point", "x": 3, "y": 0, "color": "#059669", "label": "x₂ (3, 0)" },
    { "type": "point", "x": 0, "y": 3, "color": "#d97706", "label": "y-kesish (0, 3)" },
    { "type": "text", "x": 2.2, "y": 7, "text": "x = 2 simmetriya o‘qi" }
  ]
}
\`\`\`

Xulosa: parabola shoxlari yuqoriga qaragan, chunki $a = 1 > 0$.`,
  },
  {
    id: 'rational_hyperbola',
    engine: 'mafs',
    title: 'Kasr Ratsional Funksiya (Giperbola va Asimptotalar)',
    category: 'Algebra',
    description: '$y = \\frac{1}{x-1} + 2$ giperbolasi, vertikal $x = 1$ va gorizontal $y = 2$ asimptotalari bilan.',
    latexFormula: 'y = \\frac{1}{x-1} + 2',
    spec: {
      x: [-4, 6],
      y: [-3, 7],
      height: 380,
      grid: true,
      items: [
        { type: 'function', expr: '1/(x - 1) + 2', color: '#2563eb', domain: [-4, 0.9] },
        { type: 'function', expr: '1/(x - 1) + 2', color: '#2563eb', domain: [1.1, 6] },
        { type: 'segment', a: [1, -3], b: [1, 7], color: '#dc2626' },
        { type: 'segment', a: [-4, 2], b: [6, 2], color: '#059669' },
        { type: 'point', x: 2, y: 3, color: '#7c3aed', label: '(2, 3)' },
        { type: 'point', x: 0, y: 1, color: '#7c3aed', label: '(0, 1)' },
        { type: 'text', x: 1.2, y: 6.2, text: 'x = 1 vertikal asimptota' },
        { type: 'text', x: 2.8, y: 2.3, text: 'y = 2 gorizontal asimptota' },
      ],
    },
    sampleMarkdown: `# Kasr Ratsional Funksiya va Asimptotalar

$$f(x) = \\frac{1}{x - 1} + 2$$

Asimptotalar:
- Vertikal asimptota: $x - 1 = 0 \\implies x = 1$
- Gorizontal asimptota: $\\lim_{x \\to \\pm\\infty} f(x) = 2 \\implies y = 2$

\`\`\`mafs
{
  "x": [-4, 6],
  "y": [-3, 7],
  "height": 380,
  "grid": true,
  "items": [
    { "type": "function", "expr": "1/(x - 1) + 2", "color": "#2563eb", "domain": [-4, 0.9] },
    { "type": "function", "expr": "1/(x - 1) + 2", "color": "#2563eb", "domain": [1.1, 6] },
    { "type": "segment", "a": [1, -3], "b": [1, 7], "color": "#dc2626" },
    { "type": "segment", "a": [-4, 2], "b": [6, 2], "color": "#059669" },
    { "type": "point", "x": 2, "y": 3, "color": "#7c3aed", "label": "(2, 3)" },
    { "type": "point", "x": 0, "y": 1, "color": "#7c3aed", "label": "(0, 1)" },
    { "type": "text", "x": 1.2, "y": 6.2, "text": "x = 1 vertikal asimptota" },
    { "type": "text", "x": 2.8, "y": 2.3, "text": "y = 2 gorizontal asimptota" }
  ]
}
\`\`\``,
  },
  {
    id: 'exp_log',
    engine: 'mafs',
    title: 'Ko‘rsatkichli va Logarifmik Funksiyalar Simmetriyasi',
    category: 'Algebra',
    description: '$y = 2^x$ va $y = \\log_2(x)$ teskari funksiyalari va ularning $y = x$ simmetriya chizig‘i.',
    latexFormula: 'y = 2^x \\quad \\longleftrightarrow \\quad y = \\log_2(x)',
    spec: {
      x: [-4, 6],
      y: [-4, 6],
      height: 380,
      grid: true,
      items: [
        { type: 'function', expr: '2^x', color: '#2563eb' },
        { type: 'function', expr: 'log(x)/log(2)', color: '#059669', domain: [0.06, 6] },
        { type: 'function', expr: 'x', color: '#94a3b8' },
        { type: 'point', x: 0, y: 1, color: '#2563eb', label: '(0, 1)' },
        { type: 'point', x: 1, y: 0, color: '#059669', label: '(1, 0)' },
        { type: 'point', x: 1, y: 2, color: '#2563eb', label: '(1, 2)' },
        { type: 'point', x: 2, y: 1, color: '#059669', label: '(2, 1)' },
        { type: 'text', x: -3, y: 2.5, text: 'y = 2ˣ' },
        { type: 'text', x: 3.5, y: 1.5, text: 'y = log₂(x)' },
        { type: 'text', x: 4.2, y: 4.5, text: 'y = x' },
      ],
    },
    sampleMarkdown: `# O'zaro Teskari Funksiyalar

Ko'rsatkichli $f(x) = 2^x$ va logarifmik $g(x) = \\log_2(x)$ funksiyalari $y = x$ bissektrisasiga nisbatan simmetrikdir.

\`\`\`mafs
{
  "x": [-4, 6],
  "y": [-4, 6],
  "height": 380,
  "grid": true,
  "items": [
    { "type": "function", "expr": "2^x", "color": "#2563eb" },
    { "type": "function", "expr": "log(x)/log(2)", "color": "#059669", "domain": [0.06, 6] },
    { "type": "function", "expr": "x", "color": "#94a3b8" },
    { "type": "point", "x": 0, "y": 1, "color": "#2563eb", "label": "(0, 1)" },
    { "type": "point", "x": 1, "y": 0, "color": "#059669", "label": "(1, 0)" },
    { "type": "point", "x": 1, "y": 2, "color": "#2563eb", "label": "(1, 2)" },
    { "type": "point", "x": 2, "y": 1, "color": "#059669", "label": "(2, 1)" }
  ]
}
\`\`\``,
  },
  {
    id: 'linear_system',
    engine: 'mafs',
    title: 'Chiziqli Tenglamalar Sistemasi Kesishuvi',
    category: 'Algebra',
    description: 'Ikki to‘g‘ri chiziq: $y = 2x - 1$ va $y = -0.5x + 4$ ning yagona kesishish nuqtasi $(2, 3)$.',
    latexFormula: '\\begin{cases} y = 2x - 1 \\\\ y = -0.5x + 4 \\end{cases}',
    spec: {
      x: [-3, 7],
      y: [-3, 8],
      height: 360,
      grid: true,
      items: [
        { type: 'function', expr: '2*x - 1', color: '#2563eb' },
        { type: 'function', expr: '-0.5*x + 4', color: '#d97706' },
        { type: 'point', x: 2, y: 3, color: '#dc2626', label: 'Kesishuv (2, 3)' },
        { type: 'segment', a: [2, 0], b: [2, 3], color: '#94a3b8' },
        { type: 'segment', a: [0, 3], b: [2, 3], color: '#94a3b8' },
        { type: 'text', x: 3, y: 6, text: 'y = 2x - 1' },
        { type: 'text', x: 4, y: 2.2, text: 'y = -0.5x + 4' },
      ],
    },
    sampleMarkdown: `# Chiziqli Tenglamalar Sistemasi

$$\\begin{cases} y = 2x - 1 \\\\ y = -0.5x + 4 \\end{cases}$$

Tenglashtirish usuli bilan:
$$2x - 1 = -0.5x + 4 \\implies 2.5x = 5 \\implies x = 2$$
$$y = 2(2) - 1 = 3$$

\`\`\`mafs
{
  "x": [-3, 7],
  "y": [-3, 8],
  "height": 360,
  "grid": true,
  "items": [
    { "type": "function", "expr": "2*x - 1", "color": "#2563eb" },
    { "type": "function", "expr": "-0.5*x + 4", "color": "#d97706" },
    { "type": "point", "x": 2, "y": 3, "color": "#dc2626", "label": "Kesishuv (2, 3)" },
    { "type": "segment", "a": [2, 0], "b": [2, 3], "color": "#94a3b8" },
    { "type": "segment", "a": [0, 3], "b": [2, 3], "color": "#94a3b8" }
  ]
}
\`\`\``,
  },

  // ==================== TRIGONOMETRY ====================
  {
    id: 'trigonometry',
    engine: 'mafs',
    title: 'Sinus To‘lqini va Davriylik',
    category: 'Trigonometriya',
    description: '$y = \\sin(x)$ to‘lqini va uning asosiy $\\pi/2, \\pi, 3\\pi/2$ kritik nuqtalari.',
    latexFormula: 'y = \\sin(x)',
    spec: {
      x: [-4, 8],
      y: [-2, 2],
      height: 340,
      grid: true,
      items: [
        { type: 'function', expr: 'sin(x)', color: '#7c3aed' },
        { type: 'point', x: 0, y: 0, color: '#475569', label: '(0, 0)' },
        { type: 'point', x: 1.57, y: 1, color: '#dc2626', label: '(π/2, 1)' },
        { type: 'point', x: 3.14, y: 0, color: '#059669', label: '(π, 0)' },
        { type: 'point', x: 4.71, y: -1, color: '#dc2626', label: '(3π/2, -1)' },
        { type: 'point', x: 6.28, y: 0, color: '#059669', label: '(2π, 0)' },
        { type: 'text', x: 1.8, y: 1.3, text: 'Maksimum' },
        { type: 'text', x: 4.9, y: -1.3, text: 'Minimum' },
      ],
    },
    sampleMarkdown: `# Sinus Funksiyasining Grafigi

Trigonometrik funksiya $y = \\sin(x)$ ning davri $T = 2\\pi \\approx 6.28$ ga teng.

\`\`\`mafs
{
  "x": [-4, 8],
  "y": [-2, 2],
  "height": 340,
  "grid": true,
  "items": [
    { "type": "function", "expr": "sin(x)", "color": "#7c3aed" },
    { "type": "point", "x": 0, "y": 0, "color": "#475569", "label": "(0, 0)" },
    { "type": "point", "x": 1.57, "y": 1, "color": "#dc2626", "label": "(π/2, 1)" },
    { "type": "point", "x": 3.14, "y": 0, "color": "#059669", "label": "(π, 0)" },
    { "type": "point", "x": 4.71, "y": -1, "color": "#dc2626", "label": "(3π/2, -1)" },
    { "type": "point", "x": 6.28, "y": 0, "color": "#059669", "label": "(2π, 0)" }
  ]
}
\`\`\``,
  },
  {
    id: 'jxg_unit_circle_trig',
    engine: 'jsxgraph',
    title: '[JSXGraph] Birlik Aylana va Proyeksiyalar (Sin, Cos)',
    category: 'Trigonometriya',
    description: 'Birlik aylanadagi erkin harakatlanuvchi nuqta $P(\\cos\\alpha, \\sin\\alpha)$ va uning koordinata o‘qlaridagi proyeksiyalari.',
    latexFormula: '\\cos^2\\alpha + \\sin^2\\alpha = 1',
    jsxSpec: {
      boundingbox: [-2.5, 2.5, 2.5, -2.5],
      axis: true,
      grid: true,
      height: 400,
      elements: [
        { type: 'point', id: 'O', name: 'O(0,0)', parents: [0, 0], color: '#334155', fixed: true, size: 3 },
        { type: 'point', id: 'A', name: 'A(1,0)', parents: [1, 0], color: '#94a3b8', fixed: true, size: 2 },
        { type: 'circle', parents: ['O', 1], color: '#0284c7', fillOpacity: 0.05 },
        { type: 'point', id: 'P', name: 'P(cos α, sin α)', parents: [0.707, 0.707], color: '#dc2626', size: 4 },
        { type: 'segment', parents: ['O', 'P'], color: '#2563eb', strokeWidth: 2 },
        { type: 'angle', parents: ['A', 'O', 'P'], color: '#d97706' },
      ],
    },
    sampleMarkdown: `# Birlik Aylana va Asosiy Trigonometrik Ayniyat

Birlik aylana radiusi $R = 1$ ga teng bo'lib, ixtiyoriy $P$ nuqtasining koordinatalari:
$$x = \\cos\\alpha, \\quad y = \\sin\\alpha$$
Pifagor teoremasiga binoan:
$$\\cos^2\\alpha + \\sin^2\\alpha = 1$$

\`\`\`jsxgraph
{
  "boundingbox": [-2.5, 2.5, 2.5, -2.5],
  "axis": true,
  "grid": true,
  "height": 400,
  "elements": [
    { "type": "point", "id": "O", "name": "O(0,0)", "parents": [0, 0], "color": "#334155", "fixed": true, "size": 3 },
    { "type": "point", "id": "A", "name": "A(1,0)", "parents": [1, 0], "color": "#94a3b8", "fixed": true, "size": 2 },
    { "type": "circle", "parents": ["O", 1], "color": "#0284c7", "fillOpacity": 0.05 },
    { "type": "point", "id": "P", "name": "P(cos α, sin α)", "parents": [0.707, 0.707], "color": "#dc2626", "size": 4 },
    { "type": "segment", "parents": ["O", "P"], "color": "#2563eb", "strokeWidth": 2 },
    { "type": "angle", "parents": ["A", "O", "P"], "color": "#d97706" }
  ]
}
\`\`\``,
  },

  // ==================== GEOMETRIYA (PLANIMETRIYA) ====================
  {
    id: 'triangle_centroid',
    engine: 'mafs',
    title: 'Uchburchak va Og‘irlik Markazi (Sentroid)',
    category: 'Geometriya',
    description: 'Uchburchak $A(1, 1), B(7, 2), C(3, 6)$ va uning medianalari kesishgan nuqtasi $G(3.67, 3)$.',
    latexFormula: 'G = \\left(\\frac{x_1+x_2+x_3}{3}, \\frac{y_1+y_2+y_3}{3}\\right)',
    spec: {
      x: [-1, 9],
      y: [-1, 8],
      height: 380,
      grid: true,
      items: [
        {
          type: 'polygon',
          points: [
            [1, 1],
            [7, 2],
            [3, 6],
          ],
          color: '#3b82f6',
        },
        { type: 'segment', a: [1, 1], b: [5, 4], color: '#94a3b8' },
        { type: 'segment', a: [7, 2], b: [2, 3.5], color: '#94a3b8' },
        { type: 'segment', a: [3, 6], b: [4, 1.5], color: '#94a3b8' },
        { type: 'point', x: 1, y: 1, color: '#1d4ed8', label: 'A (1, 1)' },
        { type: 'point', x: 7, y: 2, color: '#1d4ed8', label: 'B (7, 2)' },
        { type: 'point', x: 3, y: 6, color: '#1d4ed8', label: 'C (3, 6)' },
        { type: 'point', x: 3.67, y: 3, color: '#ef4444', label: 'Sentroid G (3.67, 3)' },
      ],
    },
    sampleMarkdown: `# Uchburchakning Og'irlik Markazi (Sentroid)

Medianalar kesishish nuqtasi medianani uchidan boshlab $2:1$ nisbatda bo'ladi.

\`\`\`mafs
{
  "x": [-1, 9],
  "y": [-1, 8],
  "height": 380,
  "grid": true,
  "items": [
    {
      "type": "polygon",
      "points": [[1, 1], [7, 2], [3, 6]],
      "color": "#3b82f6"
    },
    { "type": "segment", "a": [1, 1], "b": [5, 4], "color": "#94a3b8" },
    { "type": "segment", "a": [7, 2], "b": [2, 3.5], "color": "#94a3b8" },
    { "type": "segment", "a": [3, 6], "b": [4, 1.5], "color": "#94a3b8" },
    { "type": "point", "x": 1, "y": 1, "color": "#1d4ed8", "label": "A (1, 1)" },
    { "type": "point", "x": 7, "y": 2, "color": "#1d4ed8", "label": "B (7, 2)" },
    { "type": "point", "x": 3, "y": 6, "color": "#1d4ed8", "label": "C (3, 6)" },
    { "type": "point", "x": 3.67, "y": 3, "color": "#ef4444", "label": "Sentroid G (3.67, 3)" }
  ]
}
\`\`\``,
  },
  {
    id: 'jxg_triangle_angle',
    engine: 'jsxgraph',
    title: '[JSXGraph] Dinamik Uchburchak & Ichki Burchak',
    category: 'Geometriya',
    description: 'Sichqoncha bilan suriladigan $A, B, C$ nuqtalar, ko‘pburchak va dinamik burchak yoyi.',
    latexFormula: '\\alpha + \\beta + \\gamma = 180^\\circ',
    jsxSpec: {
      boundingbox: [-5, 6, 6, -5],
      axis: true,
      grid: true,
      height: 380,
      elements: [
        { type: 'point', id: 'A', name: 'A', parents: [-2, 1], color: '#2563eb', fixed: false, size: 4 },
        { type: 'point', id: 'B', name: 'B', parents: [1, 4], color: '#dc2626', fixed: false, size: 4 },
        { type: 'point', id: 'C', name: 'C', parents: [4, -1], color: '#059669', fixed: false, size: 4 },
        { type: 'polygon', parents: ['A', 'B', 'C'], color: '#3b82f6', fillOpacity: 0.15 },
        { type: 'angle', parents: ['A', 'B', 'C'], color: '#d97706' },
      ],
    },
    sampleMarkdown: `# Dinamik Uchburchak va Burchaklar

Ushbu interaktiv chizmada $A, B, C$ nuqtalarni surib, uchburchak burchaklarining yig'indisi doim $180^\\circ$ ekanligini ko'rish mumkin:

\`\`\`jsxgraph
{
  "boundingbox": [-5, 6, 6, -5],
  "axis": true,
  "grid": true,
  "height": 380,
  "elements": [
    { "type": "point", "id": "A", "name": "A", "parents": [-2, 1], "color": "#2563eb", "fixed": false, "size": 4 },
    { "type": "point", "id": "B", "name": "B", "parents": [1, 4], "color": "#dc2626", "fixed": false, "size": 4 },
    { "type": "point", "id": "C", "name": "C", "parents": [4, -1], "color": "#059669", "fixed": false, "size": 4 },
    { "type": "polygon", "parents": ["A", "B", "C"], "color": "#3b82f6", "fillOpacity": 0.15 },
    { "type": "angle", "parents": ["A", "B", "C"], "color": "#d97706" }
  ]
}
\`\`\``,
  },
  {
    id: 'jxg_midpoint',
    engine: 'jsxgraph',
    title: '[JSXGraph] Kesma O‘rtasi va O‘rta Chiziq',
    category: 'Geometriya',
    description: '$A$ va $B$ erkin nuqtalar hamda JSXGraph tomonidan avtomatik dinamik hisoblanadigan $M$ o‘rta nuqta.',
    latexFormula: 'M = \\left(\\frac{x_A+x_B}{2}, \\frac{y_A+y_B}{2}\\right)',
    jsxSpec: {
      boundingbox: [-5, 5, 5, -5],
      axis: true,
      grid: true,
      height: 380,
      elements: [
        { type: 'point', id: 'A', name: 'A', parents: [-3, -2], color: '#2563eb', fixed: false, size: 4 },
        { type: 'point', id: 'B', name: 'B', parents: [3, 2], color: '#2563eb', fixed: false, size: 4 },
        { type: 'segment', parents: ['A', 'B'], color: '#94a3b8', strokeWidth: 2 },
        { type: 'midpoint', name: 'M (o‘rtasi)', parents: ['A', 'B'], color: '#059669', size: 4 },
      ],
    },
    sampleMarkdown: `# Kesmaning O'rta Nuqtasi

\`\`\`jsxgraph
{
  "boundingbox": [-5, 5, 5, -5],
  "axis": true,
  "grid": true,
  "height": 380,
  "elements": [
    { "type": "point", "id": "A", "name": "A", "parents": [-3, -2], "color": "#2563eb", "fixed": false, "size": 4 },
    { "type": "point", "id": "B", "name": "B", "parents": [3, 2], "color": "#2563eb", "fixed": false, "size": 4 },
    { "type": "segment", "parents": ["A", "B"], "color": "#94a3b8", "strokeWidth": 2 },
    { "type": "midpoint", "name": "M (o‘rtasi)", "parents": ["A", "B"], "color": "#059669", "size": 4 }
  ]
}
\`\`\``,
  },

  // ==================== VEKTORLAR VA CHIZIQLI ALGEBRA ====================
  {
    id: 'vector_addition',
    engine: 'mafs',
    title: 'Vektorlar Qo‘shilishi (Parallelogramm Qoidasi)',
    category: 'Vektorlar',
    description: 'Ikki $\\vec{u} = (3, 1)$ va $\\vec{v} = (1, 3)$ vektor hamda natijaviy $\\vec{w} = \\vec{u} + \\vec{v} = (4, 4)$ vektor.',
    latexFormula: '\\vec{w} = \\vec{u} + \\vec{v}',
    spec: {
      x: [-1, 6],
      y: [-1, 6],
      height: 360,
      grid: true,
      items: [
        { type: 'vector', from: [0, 0], to: [3, 1], color: '#2563eb' },
        { type: 'vector', from: [0, 0], to: [1, 3], color: '#059669' },
        { type: 'vector', from: [0, 0], to: [4, 4], color: '#dc2626' },
        { type: 'segment', a: [3, 1], b: [4, 4], color: '#94a3b8' },
        { type: 'segment', a: [1, 3], b: [4, 4], color: '#94a3b8' },
        { type: 'point', x: 3, y: 1, color: '#2563eb', label: 'u (3, 1)' },
        { type: 'point', x: 1, y: 3, color: '#059669', label: 'v (1, 3)' },
        { type: 'point', x: 4, y: 4, color: '#dc2626', label: 'u + v (4, 4)' },
      ],
    },
    sampleMarkdown: `# Vektorlarni Qo'shish

Parallelogramm qoidasiga ko'ra:
$$\\vec{u} = \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}, \\quad \\vec{v} = \\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix}$$
$$\\vec{w} = \\vec{u} + \\vec{v} = \\begin{pmatrix} 4 \\\\ 4 \\end{pmatrix}$$

\`\`\`mafs
{
  "x": [-1, 6],
  "y": [-1, 6],
  "height": 360,
  "grid": true,
  "items": [
    { "type": "vector", "from": [0, 0], "to": [3, 1], "color": "#2563eb" },
    { "type": "vector", "from": [0, 0], "to": [1, 3], "color": "#059669" },
    { "type": "vector", "from": [0, 0], "to": [4, 4], "color": "#dc2626" },
    { "type": "segment", "a": [3, 1], "b": [4, 4], "color": "#94a3b8" },
    { "type": "segment", "a": [1, 3], "b": [4, 4], "color": "#94a3b8" },
    { "type": "point", "x": 3, "y": 1, "color": "#2563eb", "label": "u (3, 1)" },
    { "type": "point", "x": 1, "y": 3, "color": "#059669", "label": "v (1, 3)" },
    { "type": "point", "x": 4, "y": 4, "color": "#dc2626", "label": "u + v (4, 4)" }
  ]
}
\`\`\``,
  },

  // ==================== MATEMATIK ANALIZ (CALCULUS) ====================
  {
    id: 'cubic_tangent',
    engine: 'mafs',
    title: 'Hosila va Urinma Tenglamasi (Kubik Funksiya)',
    category: 'Matematik Analiz',
    description: '$f(x) = x^3 - 3x$ egri chizig‘i va uning $x_0 = 1.5$ nuqtadagi urinmasi.',
    latexFormula: 'y = f\'(x_0)(x - x_0) + f(x_0)',
    spec: {
      x: [-3, 3],
      y: [-4, 4],
      height: 380,
      grid: true,
      items: [
        { type: 'function', expr: 'x^3 - 3*x', color: '#2563eb' },
        { type: 'function', expr: '3.75*x - 6.75', color: '#e11d48' },
        { type: 'point', x: 1.5, y: -1.125, color: '#e11d48', label: 'T (1.5, -1.13)' },
        { type: 'point', x: 1, y: -2, color: '#059669', label: 'Min (1, -2)' },
        { type: 'point', x: -1, y: 2, color: '#059669', label: 'Max (-1, 2)' },
        { type: 'text', x: -2.3, y: 2.5, text: 'y = x³ - 3x' },
        { type: 'text', x: 1.7, y: 1.2, text: 'Urinma' },
      ],
    },
    sampleMarkdown: `# Funksiyaga Urinma Tenglamasi

Berilgan funksiya: $f(x) = x^3 - 3x$.
Uning hosilasi:
$$f'(x) = 3x^2 - 3$$
$x_0 = 1.5$ nuqtadagi urinma tenglamasi:
$$y = 3.75x - 6.75$$

\`\`\`mafs
{
  "x": [-3, 3],
  "y": [-4, 4],
  "height": 380,
  "grid": true,
  "items": [
    { "type": "function", "expr": "x^3 - 3*x", "color": "#2563eb" },
    { "type": "function", "expr": "3.75*x - 6.75", "color": "#e11d48" },
    { "type": "point", "x": 1.5, "y": -1.125, "color": "#e11d48", "label": "T (1.5, -1.13)" },
    { "type": "point", "x": 1, "y": -2, "color": "#059669", "label": "Min (1, -2)" },
    { "type": "point", "x": -1, "y": 2, "color": "#059669", "label": "Max (-1, 2)" }
  ]
}
\`\`\``,
  },
  {
    id: 'jxg_parabola_line',
    engine: 'jsxgraph',
    title: '[JSXGraph] Kesuvchining Urinmaga Intilishi (Limit va Hosila)',
    category: 'Matematik Analiz',
    description: '$y = x^2 - 3$ parabolasi hamda $A$ va $B$ erkin harakatlanuvchi nuqtalar orqali o‘tuvchi to‘g‘ri chiziq.',
    latexFormula: 'f\'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}',
    jsxSpec: {
      boundingbox: [-4, 6, 4, -4],
      axis: true,
      grid: true,
      height: 380,
      elements: [
        { type: 'functiongraph', parents: ['x^2 - 3'], color: '#7c3aed', strokeWidth: 2.5 },
        { type: 'point', id: 'A', name: 'A', parents: [-1, -2], color: '#2563eb', fixed: false, size: 4 },
        { type: 'point', id: 'B', name: 'B', parents: [2, 1], color: '#dc2626', fixed: false, size: 4 },
        { type: 'line', parents: ['A', 'B'], color: '#059669', strokeWidth: 2 },
      ],
    },
    sampleMarkdown: `# Hosilaning Geometrik Ma'nosi

$A$ va $B$ nuqtalar orqali o'tuvchi kesuvchi to'g'ri chiziq. $B$ nuqtani $A$ ga yaqinlashtirganimiz sari kesuvchi chiziq urinmaga aylanadi:

\`\`\`jsxgraph
{
  "boundingbox": [-4, 6, 4, -4],
  "axis": true,
  "grid": true,
  "height": 380,
  "elements": [
    { "type": "functiongraph", "parents": ["x^2 - 3"], "color": "#7c3aed", "strokeWidth": 2.5 },
    { "type": "point", "id": "A", "name": "A", "parents": [-1, -2], "color": "#2563eb", "fixed": false, "size": 4 },
    { "type": "point", "id": "B", "name": "B", "parents": [2, 1], "color": "#dc2626", "fixed": false, "size": 4 },
    { "type": "line", "parents": ["A", "B"], "color": "#059669", "strokeWidth": 2 }
  ]
}
\`\`\``,
  },
  {
    id: 'integral_area',
    engine: 'mafs',
    title: 'Egri Chiziqli Trapetsiya Yuzasi (Aniq Integral)',
    category: 'Matematik Analiz',
    description: '$y = 4 - x^2$ egri chizig‘i ostidagi $x \\in [-2, 2]$ oraliqdagi yuza va chegaralar.',
    latexFormula: 'S = \\int_{-2}^{2} (4 - x^2) \\, dx = \\frac{32}{3} \\approx 10.67',
    spec: {
      x: [-3.5, 3.5],
      y: [-1, 5.5],
      height: 380,
      grid: true,
      items: [
        { type: 'function', expr: '4 - x^2', color: '#2563eb', domain: [-3, 3] },
        {
          type: 'polygon',
          points: [
            [-2, 0],
            [-2, 0],
            [-1.5, 1.75],
            [-1, 3],
            [0, 4],
            [1, 3],
            [1.5, 1.75],
            [2, 0],
          ],
          color: '#3b82f6',
        },
        { type: 'segment', a: [-2, 0], b: [-2, 0], color: '#dc2626' },
        { type: 'segment', a: [2, 0], b: [2, 0], color: '#dc2626' },
        { type: 'point', x: 0, y: 4, color: '#dc2626', label: 'Max (0, 4)' },
        { type: 'point', x: -2, y: 0, color: '#059669', label: 'a = -2' },
        { type: 'point', x: 2, y: 0, color: '#059669', label: 'b = 2' },
        { type: 'text', x: -0.8, y: 2, text: 'S = 32/3 yuza' },
      ],
    },
    sampleMarkdown: `# Egri Chiziqli Trapetsiya Yuzasi

Nyuton-Leybnits formulasi:
$$S = \\int_{-2}^{2} (4 - x^2) \\, dx = \\left[ 4x - \\frac{x^3}{3} \\right]_{-2}^{2} = \\frac{32}{3} \\approx 10.67$$

\`\`\`mafs
{
  "x": [-3.5, 3.5],
  "y": [-1, 5.5],
  "height": 380,
  "grid": true,
  "items": [
    { "type": "function", "expr": "4 - x^2", "color": "#2563eb", "domain": [-3, 3] },
    {
      "type": "polygon",
      "points": [
        [-2, 0], [-1.5, 1.75], [-1, 3], [0, 4], [1, 3], [1.5, 1.75], [2, 0]
      ],
      "color": "#3b82f6"
    },
    { "type": "point", "x": 0, "y": 4, "color": "#dc2626", "label": "Max (0, 4)" },
    { "type": "point", "x": -2, "y": 0, "color": "#059669", "label": "a = -2" },
    { "type": "point", "x": 2, "y": 0, "color": "#059669", "label": "b = 2" },
    { "type": "text", "x": -0.8, "y": 2, "text": "S = 32/3 yuza" }
  ]
}
\`\`\``,
  },
];
