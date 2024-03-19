import { defineCustomElement } from "vue";
import "element-plus/dist/index.css";

import MyButton from "./libs/MyButton.ce.vue";

customElements.define("my-web-comp", defineCustomElement(MyButton));
