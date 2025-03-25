<!--
 * @Author: Alex yxfacw@163.com
 * @Date: 2025-01-10 13:35:17
 * @LastEditTime: 2025-02-28 13:18:11
 * @LastEditors: Alex yxfacw@163.com
 * @Description: .
-->
<template>
  <h1 class="header">文章列表</h1>
  <div class="container">
    <div class="post-list">
      <div v-for="post in displayedPosts" :key="post.url" class="post-item">
        <div class="post-title">
          <a :href="post.url">{{ post.title }}</a>
        </div>
        <div class="post-meta">
          <span class="post-date">{{ post.date }}</span>
          <span v-if="post.tags && post.tags.length" class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </span>
        </div>
        <div v-if="post.excerpt" class="post-excerpt">
          {{ post.excerpt }}
        </div>
      </div>
      <div
        class="pagination"
        v-show="totalPages > 1 && selectedTags.length == 0"
      >
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          :class="[currentPage === 1 ? 'first-page' : '']"
        >
          {{ currentPage === 1 ? "第一页~" : "上一页" }}
        </button>
        <span class="page-text">{{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages"
          :class="[currentPage === totalPages ? 'last-page' : '']"
          @click="currentPage++"
        >
          {{ currentPage === totalPages ? "最后一页~" : "下一页" }}
        </button>
      </div>
    </div>

    <!-- 右侧过滤区域 -->
    <div class="tags-filter">
      <h3 class="tags-filter-title">标签</h3>
      <div class="tags-container">
        <span
          v-for="tag in allTags"
          :key="tag"
          :class="['filter-tag', { active: selectedTags.includes(tag) }]"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { data as posts } from "../../posts.data";
import { ref, computed, onMounted, onUnmounted } from "vue";

const currentPage = ref(1);
const pageSize = ref(5); // 每页显示的文章数量
const selectedTags = ref<string[]>([]); // 存储选中的标签

// 根据窗口宽度调整每页显示数量
const updatePageSize = () => {
  const width = window.innerWidth;
  console.info(width);
  if (width > 2560) {
    pageSize.value = 10;
  } else if (width > 1920) {
    pageSize.value = 8;
  } else if (width > 1440) {
    pageSize.value = 6;
  } else {
    pageSize.value = 5; // 最低显示5条
  }
};

// 监听窗口大小变化
onMounted(() => {
  updatePageSize();
  window.addEventListener("resize", updatePageSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updatePageSize);
});

const totalPages = computed(() => Math.ceil(posts.length / pageSize.value));
// 获取所有唯一的标签
const allTags = computed(() => {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
});
// 切换标签选中状态
const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};
// 加上标签过滤支持
const displayedPosts = computed(() => {
  if (selectedTags.value.length === 0) {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return posts.slice(start, end);
  } else {
    currentPage.value = 1;
    return posts.filter((post) =>
      post.tags?.some((tag) => selectedTags.value.includes(tag))
    );
  }
});
</script>
<style scoped>
.header {
  max-width: 1140px;
  margin: 4px auto;
  padding: 20px;
  font-size: 2rem;
  font-weight: 600;
}

.container {
  display: flex;
  gap: 1.6rem;
  max-width: 1140px;
  margin: 0 auto;
  padding: 20px;
}

.tags-filter {
  width: 200px;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.tags-filter-title {
  font-weight: 500;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
}

.tags-filter-title::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--vp-c-brand);
  transition: transform 0.3s ease;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 10px;
}

.filter-tag {
  cursor: pointer;
  background: var(--vp-c-bg-mute);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.filter-tag:hover {
  background: var(--vp-c-brand-dimm);
}

.filter-tag.active {
  background: var(--vp-c-brand);
  color: white;
}

.post-list {
  flex: 1;
  max-width: none;
  margin: 0 auto;
  padding-right: 20px;
}

.post-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.post-title a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.post-title a:hover {
  text-decoration: underline;
}

.post-meta {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.post-tags {
  margin-left: 1rem;
}

.tag {
  /* background: #757de8; */
  /* background: var(--vp-c-brand); */
  background: var(--vp-c-brand);
  color: white;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.post-excerpt {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
}

.nav {
  color: var(--vp-c-brand);
}

.pagination {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.page-text {
  color: var(--vp-c-brand);
}

.first-page,
.last-page {
  color: #aaa;
}
</style>
