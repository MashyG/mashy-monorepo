/// <reference types="vite/client" />
import * as Vue from 'vue'

declare module 'vue' {
  export interface GlobalComponents {
    'my-vue-app': typeof App
  }
}
