<template>
  <div
    class="prose prose-orange max-w-none font-sans text-gray-700 leading-relaxed text-sm sm:text-base prose-headings:font-sans prose-headings:font-medium prose-headings:text-gray-950 prose-headings:tracking-tight prose-h2:text-2xl sm:prose-h2:text-[28px] prose-h3:text-xl sm:prose-h3:text-2xl prose-p:my-4 prose-p:leading-relaxed prose-a:text-[#EE5102] hover:prose-a:underline prose-strong:text-gray-950 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-[#EE5102] prose-blockquote:bg-orange-50/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-gray-800 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1.5 prose-img:rounded-2xl sm:prose-img:rounded-3xl prose-img:shadow-sm prose-img:my-6 prose-hr:border-gray-200 prose-hr:my-8"
    v-html="renderedHtml"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdown } from '~/composables/useMarkdown'

const props = defineProps<{
  content: string
}>()

const { renderMarkdown } = useMarkdown()

const renderedHtml = computed(() => {
  return renderMarkdown(props.content || '')
})
</script>

