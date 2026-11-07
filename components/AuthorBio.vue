<template>
  <div class="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 my-10">
    <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
      <img
        :src="author.avatar"
        :alt="author.name"
        class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white shadow-md flex-shrink-0"
      />
      <div class="space-y-2 flex-1">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-yberry-1000 block">
              Written By Staff Writer
            </span>
            <h3 class="text-xl font-bold text-gray-950 font-sans">
              {{ author.name }}
            </h3>
          </div>
          <div class="flex items-center justify-center sm:justify-end space-x-2">
            <a
              :href="author.twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-yberry-1000 hover:border-yberry-400 transition-colors"
              aria-label="Twitter Profile"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a
              :href="author.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-yberry-1000 hover:border-yberry-400 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        <p class="text-xs font-medium text-gray-500">
          {{ author.role }}
        </p>

        <p class="text-sm text-gray-700 leading-relaxed pt-1">
          {{ author.bio }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Author } from '~/composables/useArticles'

defineProps<{
  author: Author
}>()
</script>

