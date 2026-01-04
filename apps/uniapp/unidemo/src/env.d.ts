// / <reference types="vite/client" />
// / <reference types="vite-svg-loader" />
/* eslint-disable */
declare module "*.vue" {
  import { DefineComponent } from "vue";
   
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_SERVER_PORT: string
  readonly VITE_SERVER_BASEURL: string
  readonly VITE_DELETE_CONSOLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
