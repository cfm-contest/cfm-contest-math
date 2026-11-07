import React from 'react';
import KatexSpan from './KatexSpan';
import MathGraph from './MathGraph';
import JSXGraphViewer from './JSXGraphViewer';

interface MarkdownRendererProps {
  content: string;
}

// Parses text with KaTeX: $inline$ and $$display$$
function renderTextWithMath(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Check for display math $$...$$
    const displayMatch = remaining.match(/\$\$([\s\S]*?)\$\$/);
    // Check for inline math $...$
    const inlineMatch = remaining.match(/\$([^$\n]+?)\$/);

    let matchType: 'display' | 'inline' | null = null;
    let matchIndex = -1;
    let matchLength = 0;
    let mathContent = '';

    if (displayMatch && displayMatch.index !== undefined) {
      if (
        !inlineMatch ||
        inlineMatch.index === undefined ||
        displayMatch.index <= inlineMatch.index
      ) {
        matchType = 'display';
        matchIndex = displayMatch.index;
        matchLength = displayMatch[0].length;
        mathContent = displayMatch[1];
      }
    }

    if (!matchType && inlineMatch && inlineMatch.index !== undefined) {
      matchType = 'inline';
      matchIndex = inlineMatch.index;
      matchLength = inlineMatch[0].length;
      mathContent = inlineMatch[1];
    }

    if (matchType && matchIndex >= 0) {
      if (matchIndex > 0) {
        parts.push(remaining.slice(0, matchIndex));
      }
      parts.push(
        <KatexSpan
          key={`math-${keyIndex++}`}
          math={mathContent}
          block={matchType === 'display'}
        />
      );
      remaining = remaining.slice(matchIndex + matchLength);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split into chunks: fenced code blocks and regular markdown
  const blockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim()) {
      elements.push(
        <div key={`text-${lastIndex}`} className="space-y-3">
          {renderMarkdownParagraphs(textBefore)}
        </div>
      );
    }

    const language = match[1]?.trim().toLowerCase();
    const code = match[2];

    if (language === 'mafs') {
      elements.push(
        <div key={`mafs-${match.index}`} className="my-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              Mafs Interaktiv Grafik
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              ```mafs
            </span>
          </div>
          <MathGraph source={code} />
        </div>
      );
    } else if (language === 'jsxgraph') {
      elements.push(
        <div key={`jsxgraph-${match.index}`} className="my-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-600"></span>
              JSXGraph Dinamik Geometriya
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              ```jsxgraph
            </span>
          </div>
          <JSXGraphViewer source={code} />
        </div>
      );
    } else {
      elements.push(
        <div key={`code-${match.index}`} className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-xs shadow-md">
          {language && (
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-2 font-mono text-slate-400">
              <span>{language}</span>
            </div>
          )}
          <pre className="overflow-x-auto p-4 font-mono text-slate-200">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  const trailingText = content.substring(lastIndex);
  if (trailingText.trim()) {
    elements.push(
      <div key={`text-trailing`} className="space-y-3">
        {renderMarkdownParagraphs(trailingText)}
      </div>
    );
  }

  return (
    <div className="prose prose-slate max-w-none text-slate-800">
      {elements}
    </div>
  );
}

function renderMarkdownParagraphs(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const rendered: React.ReactNode[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const pText = currentParagraph.join(' ');
      rendered.push(
        <p key={rendered.length} className="leading-relaxed text-slate-700">
          {renderTextWithMath(pText)}
        </p>
      );
      currentParagraph = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph();
      rendered.push(
        <h1 key={rendered.length} className="mt-6 mb-3 text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
          {renderTextWithMath(trimmed.replace(/^#\s+/, ''))}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      flushParagraph();
      rendered.push(
        <h2 key={rendered.length} className="mt-5 mb-2.5 text-xl font-bold text-slate-900">
          {renderTextWithMath(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      flushParagraph();
      rendered.push(
        <h3 key={rendered.length} className="mt-4 mb-2 text-lg font-semibold text-slate-900">
          {renderTextWithMath(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      rendered.push(
        <li key={rendered.length} className="ml-5 list-disc text-slate-700">
          {renderTextWithMath(trimmed.replace(/^[-*]\s+/, ''))}
        </li>
      );
    } else {
      currentParagraph.push(trimmed);
    }
  });

  flushParagraph();
  return rendered;
}
