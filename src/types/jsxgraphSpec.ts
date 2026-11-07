export type JXGBoundingBox = [number, number, number, number]; // [xMin, yMax, xMax, yMin]

export type JXGElementType =
  | 'point'
  | 'line'
  | 'segment'
  | 'circle'
  | 'polygon'
  | 'functiongraph'
  | 'slider'
  | 'angle'
  | 'text'
  | 'midpoint';

export interface JXGElementItem {
  id?: string;
  name?: string;
  type: JXGElementType;
  parents: any[]; // JSXGraph parents parameters
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  fixed?: boolean;
  size?: number;
  dash?: number; // 0: solid, 1: dotted, 2: dashed
}

export interface JSXGraphSpec {
  boundingbox?: JXGBoundingBox;
  axis?: boolean;
  grid?: boolean;
  height?: number;
  showNavigation?: boolean;
  showCopyright?: boolean;
  elements: JXGElementItem[];
}
