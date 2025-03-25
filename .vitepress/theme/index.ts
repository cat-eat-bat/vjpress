/*
 * @Author: Alex
 * @LastEditors: Alex yxfacw@163.com
 * @Date: 2024-11-20
 * @Description:
 */
import DefaultTheme from "vitepress/theme";
import { type Theme } from "vitepress";
import "./custom.css";

import mediumZoom from "medium-zoom";
import { onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import PostList from "./components/PostList.vue";
import PostNav from "./components/PostNav.vue";
import PostMeta from "./components/PostMeta.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("PostList", PostList);
    app.component("PostNav", PostNav);
    app.component("PostMeta", PostMeta);
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
} satisfies Theme;
