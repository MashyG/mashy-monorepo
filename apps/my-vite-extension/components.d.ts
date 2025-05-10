/// <reference types="vite/client" />

export {}

declare module 'vue' {
  export interface GlobalComponents {
    ElButton: (typeof import('element-plus/es'))['ElButton']
  }
}
