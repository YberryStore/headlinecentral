<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    @click.self="close"
  >
    <div class="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-[#EE5102]">Media Library</span>
          <h3 class="text-lg font-bold text-gray-900 mt-0.5">{{ title || 'Select an Image from Media' }}</h3>
          <p class="text-xs text-gray-500">Click any image to select it directly into your form field.</p>
        </div>
        <button
          @click="close"
          type="button"
          class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search media files by name or path..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[#EE5102] focus:outline-none"
          />
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span class="text-xs text-gray-400 font-medium">
          Showing {{ filteredMedia.length }} assets
        </span>
      </div>

      <!-- Media Grid -->
      <div class="p-5 sm:p-6 overflow-y-auto flex-1 bg-gray-50/30">
        <div v-if="filteredMedia.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="item in filteredMedia"
            :key="item.path"
            @click="selectMedia(item)"
            class="group relative bg-white rounded-2xl border border-gray-200 hover:border-[#EE5102] overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <!-- Thumbnail preview -->
            <div class="aspect-[16/10] bg-gray-950 overflow-hidden relative">
              <video
                v-if="isVideoAsset(item.path)"
                :src="useAsset(item.path)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                playsinline
                preload="metadata"
              ></video>
              <img
                v-else
                :src="useAsset(item.path)"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span
                v-if="isVideoAsset(item.path)"
                class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[9px] font-bold uppercase tracking-wider"
              >
                Video
              </span>
              <div class="absolute inset-0 bg-[#EE5102]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="px-3 py-1 rounded-full bg-white text-gray-900 text-[11px] font-bold shadow-md">Select</span>
              </div>
            </div>
            <!-- Metadata footer -->
            <div class="p-2.5 bg-white flex flex-col justify-between flex-1">
              <p class="text-[11px] font-semibold text-gray-900 truncate" :title="item.name">
                {{ item.name }}
              </p>
              <p class="text-[10px] text-gray-400 font-mono truncate mt-0.5" :title="item.path">
                {{ item.path }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="py-16 text-center">
          <div class="w-12 h-12 rounded-full bg-orange-50 text-[#EE5102] flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <p class="text-sm font-semibold text-gray-800">No media assets found</p>
          <p class="text-xs text-gray-500 mt-1">Try refining your search keyword.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
        <span class="text-xs text-gray-400">Headline Central Media Picker</span>
        <button
          @click="close"
          type="button"
          class="px-5 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAsset } from '~/composables/useAsset'

export interface MediaAssetItem {
  name: string
  path: string
}

const props = defineProps<{
  isOpen: boolean
  title?: string
  mediaItems: MediaAssetItem[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', item: MediaAssetItem): void
}>()

const searchQuery = ref('')

const isVideoAsset = (path: string) => {
  if (!path) return false
  const lower = path.toLowerCase()
  return (
    lower.startsWith('data:video/') ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.mov') ||
    lower.includes('.mp4?') ||
    lower.includes('.webm?') ||
    lower.includes('.mov?')
  )
}

const filteredMedia = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.mediaItems
  return props.mediaItems.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.path.toLowerCase().includes(q)
  )
})

const selectMedia = (item: MediaAssetItem) => {
  emit('select', item)
  emit('close')
}

const close = () => {
  searchQuery.value = ''
  emit('close')
}
</script>

