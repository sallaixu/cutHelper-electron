// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        '@node-main': resolve('src/main'),
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
            // css in js
          })
        ]
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
