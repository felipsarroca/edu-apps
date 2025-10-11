export {};

declare global {
  interface Window {
    MathJax?: {
      tex?: unknown;
      svg?: unknown;
      typesetPromise?: () => Promise<void>;
      tex2svgPromise?: (tex: string, options?: unknown) => Promise<HTMLElement>;
      startup?: {
        promise: Promise<void>;
      };
    };
  }
}
