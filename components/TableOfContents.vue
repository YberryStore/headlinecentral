<template>
  <nav class="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-md sticky top-28">
    <div class="flex items-center justify-between pb-3.5 mb-3 border-b border-gray-100">
      <div class="flex items-center">
        <span class="w-1 h-4 bg-[#EE5102] rounded-full mr-2.5"></span>
        <span class="text-xs sm:text-sm font-semibold tracking-tight text-gray-950 font-sans">
          Table of contents
        </span>
      </div>
      <button
        @click="isOpen = !isOpen"
        class="text-xs text-gray-400 hover:text-gray-900 lg:hidden"
      >
        {{ isOpen ? 'Hide' : 'Show' }}
      </button>
    </div>

    <ul :class="isOpen ? 'block' : 'hidden lg:block'" class="space-y-2.5 text-xs">
      <li v-for="(section, idx) in sections" :key="section.id">
        <a
          :href="`#${section.id}`"
          @click.prevent="scrollTo(section.id)"
          class="flex items-start space-x-2.5 py-1.5 px-2 rounded-lg transition-all duration-150 leading-relaxed"
          :class="activeId === section.id ? 'text-[#EE5102] font-semibold bg-orange-50/50' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-50'"
        >
          <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" :class="activeId === section.id ? 'bg-[#EE5102]' : 'bg-gray-300'"></span>
          <span class="line-clamp-2">{{ section.title }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ArticleSection } from '~/composables/useArticles'

const props = defineProps<{
  sections: ArticleSection[]
}>()

const isOpen = ref(true)
const activeId = ref('')

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -90
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
    activeId.value = id
  }
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.sections.length > 0) {
    activeId.value = props.sections[0].id
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    { rootMargin: '-100px 0px -60% 0px' }
  )

  props.sections.forEach((sec) => {
    const el = document.getElementById(sec.id)
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

