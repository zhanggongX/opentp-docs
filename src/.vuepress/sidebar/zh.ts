import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/opentp": [
    {
      text: "opentp项目",
      icon: "star",
      prefix: "opentp/",
      collapsible: true,
      children: [
        "intro/",
      ],
    },
  ],
  "/blog": [
    {
      text: "作者博客",
      icon: "gears",
      // prefix: "blog/",
      children: [
        "algorithm/",
        "java/",
      ],
    },
  ]

  // "/guide/": "structure",
  // "/opentp/": "structure",
  // "/blog/": "structure",
  // "/demo/": "structure",
});