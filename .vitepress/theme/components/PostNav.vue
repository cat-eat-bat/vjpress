<!--
 * @Author: Alex yxfacw@163.com
 * @Date: 2025-01-17 13:11:31
 * @LastEditTime: 2025-02-06 16:37:59
 * @LastEditors: Alex yxfacw@163.com
 * @Description: .
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data'

const { page } = useData()

const currentIndex = computed(() => {
  // console.log('page', page.value.frontmatter)
  return posts.findIndex(post => {
   return post.url.indexOf(page.value.relativePath.split('.')[0]) > -1
  })
})

const prevPost = computed(() => {
  console.log('current index', currentIndex.value)
  if (currentIndex.value > 0) {
    return posts[currentIndex.value - 1]
  }
  return null
})

const nextPost = computed(() => {
  console.log('current index', currentIndex.value)
  if (currentIndex.value < posts.length - 1) {
    return posts[currentIndex.value + 1]
  }
  return null
})
</script>

<template>
  <div class="post-nav">
    <div class="prev" v-if="prevPost">
      <div class="nav-label">上一篇</div>
      <a :href="prevPost.url">{{ prevPost.title }}</a>
    </div>
    <div class="next" v-if="nextPost">
      <div class="nav-label">下一篇</div>
      <a :href="nextPost.url">{{ nextPost.title }}</a>
    </div>
  </div>
</template>

<style scoped>
.post-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.prev, .next {
  max-width: 45%;
}

.next {
  text-align: right;
  margin-left: auto;
}

.nav-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
</style>
