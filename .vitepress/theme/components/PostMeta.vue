<!--
 * @Author: Alex yxfacw@163.com
 * @Date: 2025-02-06 16:13:07
 * @LastEditTime: 2025-02-06 16:45:06
 * @LastEditors: Alex yxfacw@163.com
 * @Description: .
-->
<template>
  <div class="post-hint">
    <span style="margin-right: 1rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><g fill="currentColor"><path fill-rule="evenodd" d="M16.5 4.5h-13A.5.5 0 0 0 3 5v11a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5M4 15.5v-10h12v10z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M16.5 4.5h-13A.5.5 0 0 0 3 5v3a.5.5 0 0 0 .5.5h13A.5.5 0 0 0 17 8V5a.5.5 0 0 0-.5-.5M4 7.5v-2h12v2z" clip-rule="evenodd"/><path d="M5.5 5.5h1A.5.5 0 0 0 7 5V4a.5.5 0 0 0-.5-.5h-1A.5.5 0 0 0 5 4v1a.5.5 0 0 0 .5.5m8 0h1A.5.5 0 0 0 15 5V4a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5m-7.5 6a1 1 0 1 1 0-2a1 1 0 0 1 0 2"/></g></svg>
      {{ page.frontmatter.date.split('T')[0] }}
    </span>
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 20 20"
      >
        <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
          <path
            d="M3.944 11.79a.5.5 0 0 1 .141-.277L14.163 1.435a.5.5 0 0 1 .707 0l3.89 3.89a.5.5 0 0 1 0 .706L8.68 16.11a.5.5 0 0 1-.277.14l-4.595.706a.5.5 0 0 1-.57-.57zm.964.314l-.577 3.76l3.759-.578l9.609-9.608l-3.183-3.182z"
          />
          <path d="m15.472 8.173l-3.537-3.53l.707-.708l3.536 3.53z" />
        </g>
      </svg>
      字数: {{ wordCount }}</span
    >
    <span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-v-7cdd11fb=""
        class=""
      >
        <rect width="16" height="16" fill="none" data-v-7cdd11fb=""></rect>
        <circle
          cx="8"
          cy="8"
          r="5.65625"
          stroke="#8A919F"
          data-v-7cdd11fb=""
        ></circle>
        <path
          d="M7.69141 5.18652V8.30924H10.8141"
          stroke="#8A919F"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-7cdd11fb=""
        ></path>
      </svg>
      阅读: 约 {{ readingTime }} 分钟</span
    >
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import { ref, onMounted, computed } from "vue";

const wordCount = ref(0);
const readingTime = ref(0);
const { page } = useData();

onMounted(() => {
  const text = document.querySelector(".main").textContent; // 获取文章内容
  wordCount.value = text.length - 7; // 统计字数

  const wordsPerMinute = 250; // 假设平均阅读速度为每分钟 250 字
  readingTime.value = Math.ceil(wordCount.value / wordsPerMinute); // 计算阅读时间
});
</script>

<style scoped>
.post-hint {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.post-hint span {
  /* margin-left: 1rem; */
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
