<template>
  <footer class="bg-white text-gray-600 pt-16 pb-12 border-t border-gray-200">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-100">
        <!-- Brand column -->
        <div class="lg:col-span-2 space-y-4">
          <NuxtLink to="/" class="inline-flex items-center">
            <img
              :src="useAsset('/images/headline-central-logo.svg')"
              alt="HeadlineCentral."
              class="h-6 sm:h-[26px] w-auto"
            />
          </NuxtLink>
          <p class="text-sm text-gray-500 max-w-sm leading-relaxed">
            {{ footer.brandDescription || 'Essential long-form journalism, rigorous analysis, and practical craft guides across News, Tech, Fashion, Food, Home & DIY, and Mindful Parenting.' }}
          </p>

          <!-- Direct Contact details if configured -->
          <div v-if="footer.contactEmail" class="text-xs text-gray-500 space-y-1 pt-1">
            <p v-if="footer.contactEmail">
              <span class="font-medium text-gray-700">Email:</span>
              <a :href="`mailto:${footer.contactEmail}`" class="ml-1 text-[#EE5102] hover:underline">{{ footer.contactEmail }}</a>
            </p>
          </div>

          <!-- Social Links -->
          <div class="flex items-center space-x-3 pt-2">
            <a
              v-if="footer.socialLinks?.twitter"
              :href="footer.socialLinks.twitter"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#EE5102] transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a
              v-if="footer.socialLinks?.linkedin"
              :href="footer.socialLinks.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#EE5102] transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a
              v-if="footer.socialLinks?.github"
              :href="footer.socialLinks.github"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#EE5102] transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
            <a
              v-if="footer.socialLinks?.rss"
              :href="footer.socialLinks.rss"
              aria-label="RSS Feed"
              class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#EE5102] transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M6 19a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
            </a>
          </div>
        </div>

        <!-- Categories column -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">
            Categories
          </h4>
          <ul class="space-y-2.5 text-sm text-gray-600">
            <li v-for="cat in visibleCategories" :key="cat.slug">
              <NuxtLink :to="cat.slug === 'news' ? '/blog' : `/categories/${cat.slug}`" class="hover:text-[#EE5102] transition-colors">
                {{ cat.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company / Editorial column -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">
            Editorial
          </h4>
          <ul class="space-y-2.5 text-sm text-gray-600">
            <li v-for="item in footer.editorialLinks" :key="item.label">
              <NuxtLink :to="item.to" class="hover:text-[#EE5102] transition-colors">{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal pages column -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">
            Legal &amp; Policy
          </h4>
          <ul class="space-y-2.5 text-sm text-gray-600">
            <li v-for="item in footer.legalLinks" :key="item.label">
              <button
                v-if="item.to === '#cookie-preferences' || item.label.toLowerCase().includes('cookie preference')"
                @click="openPreferencesModal"
                type="button"
                class="hover:text-[#EE5102] transition-colors text-left cursor-pointer"
              >
                {{ item.label }}
              </button>
              <NuxtLink v-else :to="item.to" class="hover:text-[#EE5102] transition-colors">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
        <p>{{ footer.copyright || '© 2026 Headline Central. All rights reserved.' }}</p>
        <p class="text-gray-400">
          Essential Stories &amp; Investigative Digital Journalism.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArticles } from '~/composables/useArticles'
import { useSiteContent } from '~/composables/useSiteContent'
import { useCookieConsent } from '~/composables/useCookieConsent'

const { categories } = useArticles()
const { headerFooterConfig } = useSiteContent()
const { openPreferencesModal } = useCookieConsent()

const footer = computed(() => headerFooterConfig.footer)
const visibleCategories = computed(() => categories.filter(c => c.showInNavbar !== false))
</script>
