import { useMemo } from 'react';
import katex from 'katex';

interface KatexSpanProps {
  math: string;
  block?: boolean;
  className?: string;
}

export default function KatexSpan({ math, block = false, className = '' }: KatexSpanProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return `<span class="text-rose-500 font-mono text-xs">${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
