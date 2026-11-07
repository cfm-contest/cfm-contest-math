import React from 'react';

interface MathToolbarProps {
  onInsert: (symbol: string) => void;
  className?: string;
}

export const MATH_SYMBOLS = [
  { label: 'x²', insert: '^2', desc: 'Kvadrat' },
  { label: 'xⁿ', insert: '^', desc: 'Daraja' },
  { label: '√x', insert: 'sqrt(x)', desc: 'Kvadrat ildiz' },
  { label: 'sin(x)', insert: 'sin(x)', desc: 'Sinus' },
  { label: 'cos(x)', insert: 'cos(x)', desc: 'Kosinus' },
  { label: 'tan(x)', insert: 'tan(x)', desc: 'Tangens' },
  { label: '|x|', insert: 'abs(x)', desc: 'Modul / Absolyut qiymat' },
  { label: '1/x', insert: '1/x', desc: 'Kasr' },
  { label: 'ln(x)', insert: 'log(x)', desc: 'Natural logarifm' },
  { label: 'eˣ', insert: 'exp(x)', desc: 'Eksponenta' },
  { label: 'π', insert: 'pi', desc: 'Pi soni (3.1415...)' },
  { label: 'e', insert: 'e', desc: 'Eyler soni (2.718...)' },
  { label: '·x', insert: '*x', desc: 'Ko‘paytirish' },
  { label: '(x)', insert: '(x)', desc: 'Qavslar' },
];

export default function MathToolbar({ onInsert, className = '' }: MathToolbarProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Tezkor matematik ifodalar:</span>
        <span className="text-[10px] text-slate-400">mathjs orqali hisoblanadi</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {MATH_SYMBOLS.map((sym) => (
          <button
            key={sym.label}
            type="button"
            onClick={() => onInsert(sym.insert)}
            title={sym.desc}
            className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-xs text-slate-700 shadow-2xs hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700 active:scale-95 transition"
          >
            {sym.label}
          </button>
        ))}
      </div>
    </div>
  );
}
