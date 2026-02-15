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
  };
};

interface Window {
  dataLayer?: unknown[][];
  Module?: unknown;
  createObjectURL?: (file: Blob) => string;
}
