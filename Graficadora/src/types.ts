export type FunctionType = 'equation' | 'inequality' | 'system' | 'interval';

export interface MathFunction {
  id: number;
  expressions: string[];
  type: FunctionType;
  color: string;
  isVisible: boolean;
  domainRestriction?: string;
}

export type Theme = 'light' | 'dark' | 'chalkboard' | 'high-contrast';

export interface ThemeConfig {
  bg: string;
  text: string;
  secondaryText: string;
  border: string;
  grid: string;
  accent: string;
  panelBg: string;
  sidePanelBg: string;
  headerBg: string;
  buttonBg: string;
  buttonHover: string;
  accentButtonClasses: string;
  textColorValue: string;
  secondaryTextColorValue: string;
  headerGradient: string;
  bgColorValue: string;
}

export interface ViewConfig {
  grid: boolean;
  labels: boolean;
  points: boolean;
}

export interface TooltipData {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

export interface AnalysisResult {
  domainNotes: string[];
  intersectionPoints?: { x: number; y: number }[];
  yIntercept?: number | string;
  xIntercepts?: number[];
  systemSolutionStatus?: 'LIMITED_SOLUTIONS' | 'INFINITE_SOLUTIONS' | 'NO_SOLUTION';
}
