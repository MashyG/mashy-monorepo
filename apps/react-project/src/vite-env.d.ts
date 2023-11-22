/// <reference types="vite/client" />

export as namespace JSX;

export interface IntrinsicElements {
  "my-vue-app": React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  >;
}
