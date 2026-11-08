<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-yberry-1000">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Categories</span>
      </nav>

      <!-- Page Title -->
      <div class="max-w-3xl mb-12">
        <span class="text-xs uppercase tracking-widest font-semibold text-yberry-1000 block mb-2">
          Subject Directory
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-medium text-gray-950 font-sans tracking-tight mb-4">
          Organised by Subject
        </h1>
        <p class="text-base text-gray-600 leading-relaxed font-normal">
          Explore curated journalism and in-depth investigations across dedicated coverage categories.
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="space-y-12">
        <div
          v-for="cat in categories"
          :key="cat.slug"
          class="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <!-- Left Info -->
            <div class="lg:col-span-5 space-y-4">
              <span class="badge-category bg-yberry-100 text-yberry-1000 border border-yberry-300">
                Category Hub
              </span>
              <h2 class="text-2xl sm:text-3xl font-medium text-gray-950 font-sans">
                {{ cat.name }}
              </h2>
              <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                {{ cat.description }}
              </p>
              <div class="pt-2">
                <NuxtLink :to="`/categories/${cat.slug}`" class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#EE5102] hover:bg-[#d84802] transition-colors shadow-sm">
                  Browse All {{ cat.name }} Articles &rarr;
                </NuxtLink>
              </div>
            </div>

            <!-- Right Articles Preview -->
            <div class="lg:col-span-7">
              <div v-if="getArticlesByCategory(cat.slug).length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NuxtLink
                  v-for="art in getArticlesByCategory(cat.slug).slice(0, 2)"
                  :key="art.id"
                  :to="`/blog/${art.slug}`"
                  class="group p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-orange-50/20 hover:border-orange-200 transition-all flex flex-col justify-between"
                >
                  <img
                    :src="useAsset(art.featuredImage || art.bannerImage)"
                    :alt="art.title"
                    class="w-full aspect-video rounded-xl object-cover mb-3 group-hover:scale-102 transition-transform bg-gray-100"
                  />
                  <div>
                    <h3 class="text-sm font-semibold text-gray-900 group-hover:text-yberry-1000 transition-colors line-clamp-2 leading-snug mb-2 font-sans">
                      {{ art.title }}
                    </h3>
                    <p class="text-xs text-gray-500">
                      {{ art.publishedAt }} • {{ art.readTime }}
                    </p>
                  </div>
                </NuxtLink>
              </div>
              <div v-else class="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center text-xs text-gray-400">
                New editorial stories in {{ cat.name }} are currently in development.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticles } from '~/composables/useArticles'
import { useSiteSeo } from '~/composables/useSiteSeo'

const { categories, getArticlesByCategory } = useArticles()
const { applyPageSeo } = useSiteSeo()

applyPageSeo('categories')
</script>

