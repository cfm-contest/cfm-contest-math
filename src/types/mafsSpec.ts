import { JSXGraphSpec } from './jsxgraphSpec';

export type V2 = [number, number];

export type FunctionItem = {
  type: 'function';
  expr: string;
  color?: string;
  domain?: V2;
  label?: string;
};

export type PointItem = {
  type: 'point';
  x: number;
  y: number;
  color?: string;
  label?: string;
};

export type VectorItem = {
  type: 'vector';
  from?: V2;
  to: V2;
  color?: string;
  label?: string;
};

export type SegmentItem = {
  type: 'segment';
  a: V2;
  b: V2;
  color?: string;
  label?: string;
};

export type CircleItem = {
  type: 'circle';
  center: V2;
  r: number;
  color?: string;
  label?: string;
};

export type PolygonItem = {
  type: 'polygon';
  points: V2[];
  color?: string;
  label?: string;
};

export type TextItem = {
  type: 'text';
  x: number;
  y: number;
  text: string;
  color?: string;
};

export type Item =
  | FunctionItem
  | PointItem
  | VectorItem
  | SegmentItem
  | CircleItem
  | PolygonItem
  | TextItem;

export interface MafsSpec {
  x?: V2;
  y?: V2;
  height?: number;
  grid?: boolean;
  items: Item[];
}

export interface Preset {
  id: string;
  engine: 'mafs' | 'jsxgraph';
  title: string;
  category: string;
  description: string;
  latexFormula: string;
  spec?: MafsSpec;
  jsxSpec?: JSXGraphSpec;
  sampleMarkdown: string;
}
