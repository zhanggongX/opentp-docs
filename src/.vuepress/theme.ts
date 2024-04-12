import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "opentp.cn",

  author: {
    name: "zhanggong",
    url: "opentp.cn",
  },

  iconAssets: "fontawesome-with-brands",
  logo: "logo.svg",
  favicon: "favicon.ico",
  repo: "https://github.com/zhanggongX/open-tp.git",
  docsDir: "开源项目 opentp 介绍文档",
  lastUpdated: false,

  locales: {
    // en config
    "/en/": {
      navbar: enNavbar,
      sidebar: enSidebar,
      footer: '<a href="https://beian.miit.gov.cn/" target="_blank">豫ICP备2024059261号-1</a>',
      displayFooter: true,
      metaLocales: {
        editLink: "Edit this page",
      },
    },
    // zh config
    "/": {
      navbar: zhNavbar,
      sidebar: zhSidebar,
      footer: '<a href="https://beian.miit.gov.cn/" target="_blank">豫ICP备2024059261号-1</a>',
      displayFooter: true,
      // page meta
      metaLocales: {
        editLink: "编辑此页",
      },
    },
  },

  pageInfo: ["Author", "Category", "Tag", "Original", "Word", "ReadingTime"],

  blog: {
    intro: "/about-the-author/",
    sidebarDisplay: "mobile",
    medias: {
      Github: "https://github.com/zhanggongX",
    },
  },

  plugins: {
    // You should generate and use your own comment service
    comment: {
      provider: "Giscus",
      repo: "zhanggongX/opentp-docs",
      repoId: "R_kgDOLkwkHg",
      category: "Announcements",
      categoryId: "DIC_kwDOLkwkHs4CeZiW",
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    // All features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,

      // install chart.js before enabling it
      // chart: true,

      // insert component easily

      // install echarts before enabling it
      // echarts: true,

      // install flowchart.ts before enabling it
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // install katex before enabling it
      // katex: true,

      // install mathjax-full before enabling it
      // mathjax: true,

      // install mermaid before enabling it
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // install reveal.js before enabling it
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // install @vue/repl before enabling it
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    // install @vuepress/plugin-pwa and uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
