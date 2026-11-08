<template>
  <div class="bg-white">
    <!-- Main Navigation Bar -->
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-24">
        <!-- Brand Logo -->
        <div class="flex items-center flex-shrink-0">
          <NuxtLink to="/" class="flex items-center group">
            <img
              :src="useAsset('/images/headline-central-logo.svg')"
              alt="HeadlineCentral."
              class="h-6 sm:h-[26px] w-auto"
            />
          </NuxtLink>
        </div>

          <!-- Dynamic Navigation Items (with Sub-Category Dropdowns) -->
          <nav class="hidden lg:flex items-center space-x-7 xl:space-x-8">
            <div
              v-for="item in visibleNavItems"
              :key="item.id || item.label"
              class="relative group py-2"
            >
              <a
                v-if="item.isExternal"
                :href="item.to"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-[15px] font-normal transition-colors text-gray-900 hover:text-[#EE5102]"
              >
                <span>{{ item.label }}</span>
                <svg class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <NuxtLink
                v-else
                :to="item.to"
                class="inline-flex items-center gap-1 text-[15px] font-normal transition-colors"
                :class="$route.path === item.to ? 'text-[#EE5102] font-medium' : 'text-gray-900 hover:text-[#EE5102]'"
              >
                <span>{{ item.label }}</span>
                <svg
                  v-if="item.subCategories && item.subCategories.length > 0"
                  class="w-3.5 h-3.5 text-gray-400 group-hover:text-[#EE5102] transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </NuxtLink>

              <!-- Sub-Categories Dropdown Menu -->
              <div
                v-if="item.subCategories && item.subCategories.length > 0"
                class="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-40 min-w-[200px]"
              >
                <div class="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 px-1.5 space-y-0.5">
                  <NuxtLink
                    v-for="sub in item.subCategories"
                    :key="sub.id || sub.slug"
                    :to="`${item.to}?sub=${sub.slug}`"
                    class="block px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-[#feeee6] hover:text-[#EE5102] transition-colors"
                  >
                    {{ sub.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </nav>

          <!-- Right Side: Search & Header CTA Button -->
          <div class="hidden sm:flex items-center space-x-5">
            <!-- Search button trigger -->
            <button
              @click="isSearchOpen = true"
              aria-label="Search articles"
              class="p-1.5 text-[#768289] hover:text-gray-900 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.2-5.2m1.7-4.8a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- Dynamic Header CTA Button (e.g. Contact Us) -->
            <NuxtLink
              v-if="headerFooterConfig.headerCta?.isVisible !== false"
              :to="headerFooterConfig.headerCta?.to || '/contact'"
              class="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-normal text-white bg-[#EE5102] hover:bg-yberry-300 hover:text-gray-900 transition-colors shadow-sm"
            >
              {{ headerFooterConfig.headerCta?.label || 'Contact Us' }}
            </NuxtLink>
          </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="flex items-center space-x-2 lg:hidden">
          <button
            @click="isSearchOpen = true"
            aria-label="Search"
            class="p-2 rounded-lg text-[#768289] hover:text-gray-900 sm:hidden"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.2-5.2m1.7-4.8a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle mobile menu"
            class="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-lg"
    >
      <template v-for="item in visibleNavItems" :key="item.id || item.label">
        <a
          v-if="item.isExternal"
          :href="item.to"
          target="_blank"
          rel="noopener noreferrer"
          @click="isMobileMenuOpen = false"
          class="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-normal text-gray-900 hover:bg-yberry-100 hover:text-[#EE5102]"
        >
          <span>{{ item.label }}</span>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <NuxtLink
          v-else
          :to="item.to"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2.5 rounded-lg text-base font-normal text-gray-900 hover:bg-yberry-100 hover:text-[#EE5102]"
        >
          {{ item.label }}
        </NuxtLink>
      </template>

      <div v-if="headerFooterConfig.headerCta?.isVisible !== false" class="pt-4 border-t border-gray-100">
        <NuxtLink
          :to="headerFooterConfig.headerCta?.to || '/contact'"
          @click="isMobileMenuOpen = false"
          class="block w-full text-center py-3 rounded-full text-sm font-normal text-white bg-[#EE5102] hover:bg-yberry-300 hover:text-gray-900 transition-colors"
        >
          {{ headerFooterConfig.headerCta?.label || 'Contact Us' }}
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Search Modal -->
    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      @click.self="isSearchOpen = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100">
          <div class="flex items-center space-x-3 flex-1">
            <svg class="w-5 h-5 text-[#EE5102]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search articles across News, Tech, Fashion, Food, Home & DIY, Parenting..."
              class="w-full text-base sm:text-lg focus:outline-none text-gray-900 placeholder-gray-400 font-sans"
              autofocus
            />
          </div>
          <button
            @click="isSearchOpen = false"
            class="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search Results List -->
        <div class="mt-4 max-h-96 overflow-y-auto divide-y divide-gray-100">
          <div v-if="filteredArticles.length === 0" class="py-8 text-center text-gray-500">
            No matching articles found for "{{ searchQuery }}".
          </div>
          <NuxtLink
            v-for="article in filteredArticles"
            :key="article.id"
            :to="`/blog/${article.slug}`"
            @click="isSearchOpen = false"
            class="py-3 px-2 flex items-start space-x-4 hover:bg-yberry-100/60 rounded-xl transition-colors group"
          >
            <img
              :src="article.featuredImage"
              :alt="article.title"
              class="w-16 h-12 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                <span class="font-medium text-[#EE5102]">{{ article.category }}</span>
                <span>•</span>
                <span>{{ article.readTime }}</span>
              </div>
              <h4 class="text-sm font-semibold text-gray-900 group-hover:text-[#EE5102] transition-colors line-clamp-1">
                {{ article.title }}
              </h4>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useArticles } from '~/composables/useArticles'
import { useSiteContent } from '~/composables/useSiteContent'

const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')

const { articles } = useArticles()
const { headerFooterConfig } = useSiteContent()

const visibleNavItems = computed(() => {
  if (!headerFooterConfig.navItems) return []
  return headerFooterConfig.navItems.filter(item => item.isVisible !== false)
})

const filteredArticles = computed(() => {
  if (!searchQuery.value.trim()) {
    return articles.slice(0, 5)
  }
  const q = searchQuery.value.toLowerCase()
  return articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q) ||
    a.tags.some(t => t.toLowerCase().includes(q))
  )
})
</script>

