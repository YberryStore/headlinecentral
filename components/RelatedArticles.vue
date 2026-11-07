<template>
  <section v-if="relatedList.length > 0" class="my-14 pt-10 border-t border-gray-200">
    <div class="flex items-center justify-between mb-8">
      <div>
        <span class="text-xs uppercase tracking-wider font-semibold text-[#EE5102] block mb-1">
          Our editorial pick
        </span>
        <h3 class="text-2xl sm:text-3xl font-medium text-gray-950 font-sans tracking-tight">
          Related Stories You Might Like
        </h3>
      </div>
      <NuxtLink to="/blog" class="text-xs sm:text-sm font-semibold text-[#EE5102] hover:text-[#d84802] transition-colors flex items-center space-x-1">
        <span>Browse all</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article
        v-for="item in relatedList"
        :key="item.id"
        class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
      >
        <div>
          <NuxtLink :to="`/blog/${item.slug}`" class="block aspect-[16/10] overflow-hidden bg-gray-100">
            <img
              :src="item.featuredImage"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </NuxtLink>
          <div class="p-5">
            <span class="text-[11px] font-semibold text-[#EE5102] uppercase tracking-wider block mb-2">
              {{ item.category }}
            </span>
            <h4 class="text-base font-medium text-gray-950 group-hover:text-[#EE5102] transition-colors line-clamp-2 leading-snug font-sans mb-2">
              <NuxtLink :to="`/blog/${item.slug}`">
                {{ item.title }}
              </NuxtLink>
            </h4>
            <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {{ item.excerpt }}
            </p>
          </div>
        </div>

        <div class="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <span>{{ item.readTime }}</span>
          <span class="font-medium text-gray-600">{{ item.author.name }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArticles, type Article } from '~/composables/useArticles'

const props = defineProps<{
  currentArticle: Article
}>()

const { articles } = useArticles()

const relatedList = computed(() => {
  // First prefer same category, excluding current
  const sameCat = articles.filter(a => a.categorySlug === props.currentArticle.categorySlug && a.id !== props.currentArticle.id)
  if (sameCat.length >= 3) {
    return sameCat.slice(0, 3)
  }
  // Fall back to other articles
  const others = articles.filter(a => a.id !== props.currentArticle.id && !sameCat.includes(a))
  return [...sameCat, ...others].slice(0, 3)
})
</script>

