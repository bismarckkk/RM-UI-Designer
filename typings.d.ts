/// <reference types="vite/client" />

declare module '*.md';
declare module '*.png';
declare module '*.svg';
declare module '*.woff';
declare module '*.woff2';
declare module '*?url';

declare const process: {
  env: {
    VERSION: string;
    NODE_ENV?: string;
    ref?: string;
  };
};

interface Window {
  dataLayer?: unknown[][];
  Module?: unknown;
  createObjectURL?: (file: Blob) => string;
  dispatch?: (type: string, payload: unknown) => void;
}

interface HTMLElement {
  msRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface Document {
  msExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  webkitExitFullscreen?: () => Promise<void> | void;
}
