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
      <li v-for="item in tocList" :key="item.id">
        <a
          :href="`#${item.id}`"
          @click.prevent="scrollTo(item.id)"
          class="flex items-start space-x-2.5 py-1.5 px-2 rounded-lg transition-all duration-150 leading-relaxed"
          :class="activeId === item.id ? 'text-[#EE5102] font-semibold bg-orange-50/50' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-50'"
        >
          <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" :class="activeId === item.id ? 'bg-[#EE5102]' : 'bg-gray-300'"></span>
          <span class="line-clamp-2">{{ item.title }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface TocEntry {
  id: string
  title: string
}

const props = withDefaults(defineProps<{
  sections?: TocEntry[]
  items?: TocEntry[]
}>(), {
  sections: () => [],
  items: () => []
})

const tocList = computed(() => {
  if (props.items && props.items.length > 0) return props.items
  return props.sections || []
})

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
  if (tocList.value.length > 0) {
    activeId.value = tocList.value[0].id
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

  tocList.value.forEach((sec) => {
    const el = document.getElementById(sec.id)
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

