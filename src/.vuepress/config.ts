import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/en/": {
      lang: "en-US",
      title: "opentp",
      description: "the docs for opntp",
    },

    "/": {
      lang: "zh-CN",
      title: "opentp",
      description: "opentp 项目文档",
    },
  },

  theme,
});
