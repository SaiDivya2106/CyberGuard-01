/// <reference types="vite/client" />

// enable ?raw imports for arbitrary files (CSV, text, etc.)
declare module "*?raw" {
  const content: string;
  export default content;
}
