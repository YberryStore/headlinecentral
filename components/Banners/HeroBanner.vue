<template>
  <section v-if="article" class="bg-white pt-4 pb-12 sm:pb-16">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16">
        <!-- Left Column: Article Info -->
        <div class="flex-1 w-full flex flex-col justify-between py-2 sm:py-4">
          <div>
            <!-- Heading -->
            <h1 class="text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] font-medium leading-[1.25] text-gray-950 font-sans tracking-tight hover:text-[#EE5102] transition-colors">
              <NuxtLink :to="`/blog/${article.slug}`">
                <template v-if="article.titleHighlight">
                  <span class="text-[#EE5102]">{{ article.titleHighlight }}</span>
                  {{ article.title.replace(article.titleHighlight, '') }}
                </template>
                <template v-else>
                  {{ article.title }}
                </template>
              </NuxtLink>
            </h1>

            <!-- Excerpt / Subtitle -->
            <p class="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 font-normal leading-[1.65] max-w-xl">
              {{ article.excerpt }}
            </p>
          </div>

          <!-- Bottom Row: Date & Reading Time + Read Story Button -->
          <div class="mt-8 sm:mt-12 flex items-center justify-between max-w-xl">
            <span class="text-xs sm:text-[13px] text-gray-400 font-normal">
              {{ article.publishedAt }} • {{ article.readTime }}
            </span>

            <NuxtLink
              :to="`/blog/${article.slug}`"
              class="inline-flex items-center justify-center px-7 py-2.5 rounded-full text-sm font-normal text-white bg-[#EE5102] hover:bg-[#d84802] transition-colors shadow-sm flex-shrink-0"
            >
              Read Story
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column: Banner Image (900x500 on Desktop) -->
        <div class="w-full lg:w-[900px] flex-shrink-0">
          <NuxtLink
            :to="`/blog/${article.slug}`"
            class="block w-full lg:w-[900px] lg:h-[500px] aspect-[9/5] lg:aspect-auto rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-sm bg-gray-950 group"
          >
            <img
              :src="article.featuredImage"
              :alt="article.title"
              class="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/composables/useArticles'

defineProps<{
  article: Article
}>()
</script>
