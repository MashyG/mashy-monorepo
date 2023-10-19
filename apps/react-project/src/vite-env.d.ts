/// <reference types="vite/client" />

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       'my-vue-app': React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLElement>,
//         HTMLElement
//       >
//     }
//   }
// }

export as namespace JSX

export interface IntrinsicElements {
  'my-vue-app': React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  >
}
