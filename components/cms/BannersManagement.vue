<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2 h-2 rounded-full bg-[#EE5102] animate-pulse"></span>
          <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Landing Page Showcase</span>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Hero Banners Management</h2>
        <p class="text-xs text-gray-400 mt-0.5">
          Configure, schedule and reorder banners displayed in the landing page hero section. Supports desktop &amp; mobile imagery, alt tags, videos, custom URLs, and automatic expiration.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          @click="openNewBannerModal"
          type="button"
          class="px-4 py-2 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>Add New Banner</span>
        </button>

        <button
          @click="handleSaveAll"
          :disabled="isSaving"
          type="button"
          class="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          <svg v-if="isSaving" class="animate-spin w-3.5 h-3.5 text-[#EE5102]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>{{ isSaving ? 'Syncing...' : 'Sync to Cloud' }}</span>
        </button>
      </div>
    </div>

    <!-- Active Banners Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-50 text-[#EE5102] flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">Total Banners</p>
          <p class="text-lg font-semibold text-gray-900">{{ banners.length }}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">Active on Landing Page</p>
          <p class="text-lg font-semibold text-green-600">{{ activeBanners.length }}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">Scheduled Future</p>
          <p class="text-lg font-semibold text-purple-600">{{ scheduledCount }}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">Expired / Inactive</p>
          <p class="text-lg font-semibold text-gray-600">{{ expiredOrInactiveCount }}</p>
        </div>
      </div>
    </div>

    <!-- Feedback Message Toast -->
    <div
      v-if="feedbackMessage"
      :class="feedbackType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'"
      class="p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <span v-if="feedbackType === 'success'">✓</span>
        <span v-else>⚠</span>
        <span>{{ feedbackMessage }}</span>
      </div>
      <button @click="feedbackMessage = ''" type="button" class="text-gray-400 hover:text-gray-600 text-xs">Dismiss</button>
    </div>

    <!-- Banners List Table / Cards -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-semibold text-gray-900">Configured Hero Banners</h3>
          <p class="text-xs text-gray-400">Drag or use arrow buttons to reorder banner sequence on the hero carousel.</p>
        </div>
        <span class="text-xs font-medium text-gray-500">
          {{ banners.length }} {{ banners.length === 1 ? 'Banner' : 'Banners' }}
        </span>
      </div>

      <!-- Empty State -->
      <div v-if="banners.length === 0" class="p-12 text-center">
        <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <h4 class="text-sm font-semibold text-gray-900 mb-1">No hero banners created</h4>
        <p class="text-xs text-gray-500 max-w-sm mx-auto mb-4">
          Add your first hero banner to promote breaking stories, key categories, or multimedia features on the homepage.
        </p>
        <button
          @click="openNewBannerModal"
          type="button"
          class="px-4 py-2 rounded-full bg-[#EE5102] text-white text-xs font-semibold hover:bg-[#d84802] transition-colors"
        >
          Create First Banner
        </button>
      </div>

      <!-- Table of Banners -->
      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          class="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
        >
          <!-- Left: Order & Thumbnail -->
          <div class="flex items-center gap-3 min-w-0">
            <!-- Sort up/down controls -->
            <div class="flex flex-col gap-1 text-gray-400">
              <button
                @click="moveBanner(index, -1)"
                :disabled="index === 0"
                type="button"
                aria-label="Move Up"
                class="hover:text-gray-700 disabled:opacity-20 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>
              </button>
              <button
                @click="moveBanner(index, 1)"
                :disabled="index === banners.length - 1"
                type="button"
                aria-label="Move Down"
                class="hover:text-gray-700 disabled:opacity-20 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>

            <!-- Media Preview Thumbnail -->
            <div class="w-20 h-12 rounded-xl bg-gray-900 overflow-hidden flex-shrink-0 relative border border-gray-200">
              <img
                v-if="banner.mediaType === 'image'"
                :src="resolveMediaUrl(banner.desktopImageUrl)"
                :alt="banner.desktopAlt || banner.headline"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                <svg class="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>

              <!-- Media Type Badge -->
              <span
                class="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider"
                :class="banner.mediaType === 'video' ? 'bg-purple-600 text-white' : 'bg-black/70 text-white'"
              >
                {{ banner.mediaType }}
              </span>
            </div>

            <!-- Text & Metadata -->
            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  v-if="banner.badgeText"
                  class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-[#EE5102] border border-orange-100"
                >
                  {{ banner.badgeText }}
                </span>
                <span :class="getStatusBadgeClass(banner)" class="text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {{ getStatusText(banner) }}
                </span>
                <span v-if="banner.mobileImageUrl" class="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                  📱 Mobile media active
                </span>
              </div>

              <h4 class="text-sm font-semibold text-gray-950 truncate max-w-md sm:max-w-lg">
                {{ banner.headline }}
              </h4>

              <div class="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                <span class="truncate max-w-xs text-gray-500">
                  Target: <span class="font-medium text-gray-700">{{ banner.customUrl || '/' }}</span>
                </span>
                <span v-if="banner.expirationDate" class="text-red-500 font-medium">
                  Expires: {{ formatDateTime(banner.expirationDate) }}
                </span>
                <span v-if="banner.startDate && isBannerScheduled(banner)" class="text-purple-600 font-medium">
                  Starts: {{ formatDateTime(banner.startDate) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Actions & Toggle -->
          <div class="flex items-center gap-3 flex-shrink-0 self-end md:self-center">
            <!-- Active Toggle -->
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="banner.isActive"
                @change="handleToggleActive(banner.id)"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EE5102]"></div>
            </label>

            <!-- Edit Button -->
            <button
              @click="openEditBannerModal(banner)"
              type="button"
              class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
            >
              Edit
            </button>

            <!-- Duplicate Button -->
            <button
              @click="handleDuplicate(banner.id)"
              type="button"
              title="Duplicate banner"
              class="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>

            <!-- Delete Button -->
            <button
              @click="handleDelete(banner.id)"
              type="button"
              title="Delete banner"
              class="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CREATE / EDIT BANNER MODAL DIALOG -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div class="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-gray-100 shadow-2xl space-y-6 p-6 sm:p-8">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2 h-2 rounded-full bg-[#EE5102]"></span>
              <span class="text-xs uppercase tracking-widest font-bold text-[#EE5102]">
                {{ formState.id ? 'Edit Hero Banner' : 'Create New Hero Banner' }}
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-950">
              {{ formState.id ? 'Modify Banner Configuration' : 'Hero Presentation Setup' }}
            </h3>
          </div>
          <button
            @click="closeModal"
            type="button"
            class="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="submitBannerForm" class="space-y-6">
          
          <!-- Tabbed Media Type Selector -->
          <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700">Media Presentation Format</label>
            <div class="flex items-center gap-3">
              <button
                @click="formState.mediaType = 'image'"
                type="button"
                :class="formState.mediaType === 'image' ? 'bg-[#EE5102] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span>Image (Desktop &amp; Mobile Responsive)</span>
              </button>

              <button
                @click="formState.mediaType = 'video'"
                type="button"
                :class="formState.mediaType === 'video' ? 'bg-[#EE5102] text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Video (HTML5 / Embed)</span>
              </button>
            </div>
          </div>

          <!-- Section: Headlines & Copy -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2 space-y-1.5">
              <label class="block text-xs font-bold text-gray-800">Headline <span class="text-red-500">*</span></label>
              <input
                v-model="formState.headline"
                type="text"
                required
                placeholder="e.g. The Architecture of Modern Compute."
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#EE5102] focus:ring-1 focus:ring-[#EE5102] focus:outline-none"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-800">Headline Highlight (Orange Accent)</label>
              <input
                v-model="formState.headlineHighlight"
                type="text"
                placeholder="Exact text within headline to accent in orange"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#EE5102] focus:outline-none"
              />
              <p class="text-[11px] text-gray-400">e.g. "Modern Compute" will highlight with signature brand orange.</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-800">Badge Text (Optional)</label>
              <input
                v-model="formState.badgeText"
                type="text"
                placeholder="e.g. Featured Story, Special Investigation"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#EE5102] focus:outline-none"
              />
            </div>

            <div class="md:col-span-2 space-y-1.5">
              <label class="block text-xs font-bold text-gray-800">Caption / Subheadline</label>
              <textarea
                v-model="formState.caption"
                rows="3"
                placeholder="Brief explanatory narrative or editorial lead for the banner..."
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#EE5102] focus:ring-1 focus:ring-[#EE5102] focus:outline-none"
              ></textarea>
            </div>
          </div>

          <!-- Section: Media Uploads (Image Mode) -->
          <div v-if="formState.mediaType === 'image'" class="space-y-6 border-t border-gray-100 pt-5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700">Responsive Image Assets</h4>

            <!-- Desktop Image Asset -->
            <div class="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="text-xs font-bold text-gray-900">1. Desktop Image (Required)</h5>
                  <p class="text-[11px] text-gray-500">Recommended 16:9 or 900x500px high-resolution banner image.</p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="openMediaPicker('Select Desktop Banner Image', item => { formState.desktopImageUrl = item.path; if (!formState.desktopAlt) formState.desktopAlt = item.name })"
                    type="button"
                    class="px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span>Media File</span>
                  </button>
                  <!-- File Upload Trigger -->
                  <label class="px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="e => handleImageFile(e, 'desktop')"
                    />
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-[11px] font-semibold text-gray-700">Desktop Image URL</label>
                  <input
                    v-model="formState.desktopImageUrl"
                    type="text"
                    required
                    placeholder="/images/tech-hero.jpg or https://..."
                    class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#EE5102] focus:outline-none"
                  />
                </div>
                <div class="space-y-1">
                  <label class="block text-[11px] font-semibold text-gray-700">Desktop Alt Tag (Accessibility &amp; SEO)</label>
                  <input
                    v-model="formState.desktopAlt"
                    type="text"
                    required
                    placeholder="Descriptive alt text for screen readers"
                    class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#EE5102] focus:outline-none"
                  />
                </div>
              </div>

              <!-- Desktop Preview Thumbnail -->
              <div v-if="formState.desktopImageUrl" class="mt-2">
                <p class="text-[10px] text-gray-400 mb-1">Preview:</p>
                <div class="w-full sm:w-72 h-36 rounded-xl overflow-hidden border border-gray-300 bg-gray-900">
                  <img
                    :src="resolveMediaUrl(formState.desktopImageUrl)"
                    :alt="formState.desktopAlt"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <!-- Mobile Image Asset -->
            <div class="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="text-xs font-bold text-gray-900">2. Mobile Image (Optional Override)</h5>
                  <p class="text-[11px] text-gray-500">Optimized for mobile displays (under 768px). Falls back to desktop image if omitted.</p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="openMediaPicker('Select Mobile Banner Image', item => { formState.mobileImageUrl = item.path; if (!formState.mobileAlt) formState.mobileAlt = item.name })"
                    type="button"
                    class="px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span>Media File</span>
                  </button>
                  <!-- File Upload Trigger -->
                  <label class="px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    <span>Upload Mobile File</span>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="e => handleImageFile(e, 'mobile')"
                    />
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-[11px] font-semibold text-gray-700">Mobile Image URL</label>
                  <input
                    v-model="formState.mobileImageUrl"
                    type="text"
                    placeholder="Leave blank to use desktop image"
                    class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#EE5102] focus:outline-none"
                  />
                </div>
                <div class="space-y-1">
                  <label class="block text-[11px] font-semibold text-gray-700">Mobile Alt Tag</label>
                  <input
                    v-model="formState.mobileAlt"
                    type="text"
                    placeholder="Mobile specific alt description"
                    class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#EE5102] focus:outline-none"
                  />
                </div>
              </div>

              <!-- Mobile Preview Thumbnail -->
              <div v-if="formState.mobileImageUrl" class="mt-2">
                <p class="text-[10px] text-gray-400 mb-1">Mobile Preview:</p>
                <div class="w-32 h-36 rounded-xl overflow-hidden border border-gray-300 bg-gray-900">
                  <img
                    :src="resolveMediaUrl(formState.mobileImageUrl)"
                    :alt="formState.mobileAlt || formState.desktopAlt"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Media Uploads (Video Mode) -->
          <div v-else-if="formState.mediaType === 'video'" class="space-y-5 border-t border-gray-100 pt-5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700">Video Background Assets</h4>

            <div class="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="text-xs font-bold text-gray-900">Video Source (MP4 / WebM / YouTube / Vimeo)</h5>
                  <p class="text-[11px] text-gray-500">Provide direct video URL or upload an MP4/WebM clip.</p>
                </div>
                <!-- Video File Upload Trigger -->
                <label class="px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  <span>Upload Video Clip</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    class="hidden"
                    @change="handleVideoFile"
                  />
                </label>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="block text-[11px] font-semibold text-gray-700">Video URL</label>
                  <input
                    v-model="formState.videoUrl"
                    type="text"
                    required
                    placeholder="https://.../clip.mp4 or https://youtube.com/watch?v=..."
                    class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#EE5102] focus:outline-none"
                  />
                </div>
                <div class="space-y-1">
                  <label class="block text-[11px] font-semibold text-gray-700">Video Poster Image URL (Loading placeholder)</label>
                  <input
                    v-model="formState.videoPosterUrl"
                    type="text"
                    placeholder="/images/tech-hero.jpg or image URL"
                    class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#EE5102] focus:outline-none"
                  />
                </div>
              </div>

              <!-- Video Playback Options -->
              <div class="flex items-center gap-6 pt-1 flex-wrap text-xs text-gray-700">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="formState.videoAutoplay" type="checkbox" class="rounded text-[#EE5102] focus:ring-0" />
                  <span>Autoplay</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="formState.videoLoop" type="checkbox" class="rounded text-[#EE5102] focus:ring-0" />
                  <span>Loop Continuous</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="formState.videoMuted" type="checkbox" class="rounded text-[#EE5102] focus:ring-0" />
                  <span>Muted (Required for browser autoplay)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Section: Custom URL & CTA Button Configuration -->
          <div class="space-y-4 border-t border-gray-100 pt-5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700">Destination &amp; Call To Action</h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-800">Banner Custom URL <span class="text-red-500">*</span></label>
                <input
                  v-model="formState.customUrl"
                  type="text"
                  required
                  placeholder="/blog/my-story or /categories/technology or https://..."
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#EE5102] focus:outline-none"
                />
                <p class="text-[11px] text-gray-400">Where the user is taken when clicking the headline or image.</p>
              </div>

              <!-- CTA Enable Toggle -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-gray-800">Show CTA Button</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="formState.cta.enabled" type="checkbox" class="sr-only peer" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EE5102]"></div>
                  </label>
                </div>
                <input
                  v-model="formState.cta.label"
                  type="text"
                  :disabled="!formState.cta.enabled"
                  placeholder="Button label (e.g. Read Story, Explore Now)"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#EE5102] focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>

              <div v-if="formState.cta.enabled" class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-800">CTA Target URL Override (Optional)</label>
                <input
                  v-model="formState.cta.url"
                  type="text"
                  placeholder="Leave empty to use main custom URL"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#EE5102] focus:outline-none"
                />
              </div>

              <div v-if="formState.cta.enabled" class="space-y-1.5">
                <label class="block text-xs font-bold text-gray-800">CTA Button Visual Style</label>
                <select
                  v-model="formState.cta.style"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#EE5102] focus:outline-none"
                >
                  <option value="primary">Primary Orange (#EE5102)</option>
                  <option value="dark">Dark Charcoal (#111827)</option>
                  <option value="outline">Orange Outline</option>
                  <option value="white">White on Dark</option>
                </select>
              </div>

              <div class="sm:col-span-2 flex items-center gap-2">
                <input
                  v-model="formState.cta.targetBlank"
                  id="targetBlankToggle"
                  type="checkbox"
                  class="rounded text-[#EE5102] focus:ring-0"
                />
                <label for="targetBlankToggle" class="text-xs text-gray-700 cursor-pointer">
                  Open link in new browser tab (<code class="text-xs bg-gray-100 px-1 py-0.5 rounded">target="_blank"</code>)
                </label>
              </div>
            </div>
          </div>

          <!-- Section: Expiration Date & Scheduling -->
          <div class="space-y-4 border-t border-gray-100 pt-5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700">Expiration &amp; Campaign Scheduling</h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <label class="block text-xs font-bold text-gray-800">Expiration Date &amp; Time (Optional)</label>
                </div>
                <input
                  v-model="formState.expirationDate"
                  type="datetime-local"
                  class="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#EE5102] focus:outline-none"
                />
                <p class="text-[11px] text-gray-400">
                  When this date passes, the banner is automatically retired from the landing page. Leave empty for permanent.
                </p>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <label class="block text-xs font-bold text-gray-800">Launch / Start Date (Optional)</label>
                </div>
                <input
                  v-model="formState.startDate"
                  type="datetime-local"
                  class="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#EE5102] focus:outline-none"
                />
                <p class="text-[11px] text-gray-400">
                  Delay publication until a specific campaign time. Leave blank to activate immediately.
                </p>
              </div>
            </div>
          </div>

          <!-- Section: Active Status & Sort Order -->
          <div class="border-t border-gray-100 pt-5 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="formState.isActive" type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EE5102]"></div>
              </label>
              <div>
                <p class="text-xs font-bold text-gray-900">Banner Active Status</p>
                <p class="text-[11px] text-gray-400">If unchecked, this banner is held in draft and hidden from visitors.</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs font-bold text-gray-700">Display Order:</label>
              <input
                v-model.number="formState.sortOrder"
                type="number"
                min="1"
                class="w-16 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-center focus:border-[#EE5102] focus:outline-none"
              />
            </div>
          </div>

          <!-- Modal Actions Footer -->
          <div class="border-t border-gray-100 pt-5 flex items-center justify-end gap-3">
            <button
              @click="closeModal"
              type="button"
              class="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-7 py-2.5 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <svg v-if="isSubmitting" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ formState.id ? 'Save Banner' : 'Create Banner' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Media Picker Modal -->
    <MediaPickerModal
      :is-open="isMediaPickerOpen"
      :title="mediaPickerTitle"
      :media-items="mediaAssetsList"
      @close="isMediaPickerOpen = false"
      @select="handleMediaPickerChosen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import MediaPickerModal from '~/components/cms/MediaPickerModal.vue'
import {
  useBanners,
  isBannerExpired,
  isBannerScheduled,
  isBannerActive,
  type HeroBanner,
  type BannerMediaType,
  type BannerCtaStyle
} from '~/composables/useBanners'
import { useFirebase } from '~/composables/useFirebase'

const {
  banners,
  activeBanners,
  isSaving,
  saveBanner,
  deleteBanner,
  toggleBannerActive,
  duplicateBanner,
  reorderBanners,
  syncFromFirestore,
  saveBannersToCloud
} = useBanners()

const { uploadFileToStorage, uploadVideoToStorage } = useFirebase()

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error'>('success')

// Media Library Integration
const isMediaPickerOpen = ref(false)
const mediaPickerTitle = ref('Select Banner Image from Media')
const onMediaPickerSelect = ref<((item: { name: string; path: string }) => void) | null>(null)

const mediaAssetsList = [
  { name: 'GeForce 8800 GTX Desktop Banner', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-desktop-banner.webp' },
  { name: 'GeForce 8800 GTX 20-Year Steam Tech Demo', path: '/images/geforce-8800-gtx-gpu-celebration-20-year-steam-tech-demo.webp' },
  { name: 'GeForce 8800 GTX Gallery 1', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp' },
  { name: 'GeForce 8800 GTX Gallery 2', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-2.webp' },
  { name: 'GeForce 8800 GTX Gallery 3', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-3.webp' },
  { name: 'GeForce 8800 GTX Gallery 4', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-4.webp' },
  { name: 'GeForce 8800 GTX Gallery 5', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-5.webp' },
  { name: 'GeForce 8800 GTX Gallery 6', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-6.webp' },
  { name: 'GeForce 8800 GTX Gallery 7', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-7.webp' },
  { name: 'GeForce 8800 GTX Gallery 8', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-8.webp' },
  { name: 'GeForce 8800 GTX Gallery 9', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-9.webp' },
  { name: 'GeForce 8800 GTX Gallery 10', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-10.webp' },
  { name: 'GeForce 8800 GTX Gallery 11', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-11.webp' },
  { name: 'GeForce 8800 GTX Gallery 12', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-12.webp' },
  { name: 'Tech Hero Banner', path: '/images/tech-hero.jpg' },
  { name: 'Food Hero Banner', path: '/images/food-hero.jpg' },
  { name: 'DIY Hero Banner', path: '/images/diy-hero.jpg' }
]

const openMediaPicker = (title: string, onSelect: (item: { name: string; path: string }) => void) => {
  mediaPickerTitle.value = title
  onMediaPickerSelect.value = onSelect
  isMediaPickerOpen.value = true
}

const handleMediaPickerChosen = (item: { name: string; path: string }) => {
  if (onMediaPickerSelect.value) {
    onMediaPickerSelect.value(item)
  }
  isMediaPickerOpen.value = false
}

const defaultFormState = (): Partial<HeroBanner> => ({
  id: '',
  headline: '',
  headlineHighlight: '',
  caption: '',
  badgeText: 'Featured Story',
  mediaType: 'image' as BannerMediaType,
  desktopImageUrl: '',
  desktopAlt: '',
  mobileImageUrl: '',
  mobileAlt: '',
  videoUrl: '',
  videoPosterUrl: '',
  videoAutoplay: true,
  videoLoop: true,
  videoMuted: true,
  customUrl: '/blog',
  cta: {
    enabled: true,
    label: 'Explore Story',
    url: '',
    targetBlank: false,
    style: 'primary' as BannerCtaStyle
  },
  expirationDate: '',
  startDate: '',
  isActive: true,
  sortOrder: banners.value.length + 1
})

const formState = reactive<any>(defaultFormState())

const scheduledCount = computed(() => banners.value.filter(b => isBannerScheduled(b)).length)
const expiredOrInactiveCount = computed(() => banners.value.filter(b => !isBannerActive(b)).length)

const resolveMediaUrl = (url?: string) => {
  if (!url) return ''
  const trimmed = url.trim()
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return useAsset(trimmed)
}

const formatDateTime = (val?: string) => {
  if (!val) return ''
  try {
    const d = new Date(val)
    return d.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return val
  }
}

const getStatusBadgeClass = (banner: HeroBanner) => {
  if (isBannerExpired(banner)) return 'bg-red-50 text-red-600 border border-red-200'
  if (isBannerScheduled(banner)) return 'bg-purple-50 text-purple-600 border border-purple-200'
  if (banner.isActive) return 'bg-green-50 text-green-700 border border-green-200'
  return 'bg-gray-100 text-gray-500 border border-gray-200'
}

const getStatusText = (banner: HeroBanner) => {
  if (isBannerExpired(banner)) return 'Expired'
  if (isBannerScheduled(banner)) return 'Scheduled'
  if (banner.isActive) return 'Active'
  return 'Draft / Hidden'
}

const openNewBannerModal = () => {
  Object.assign(formState, defaultFormState())
  isModalOpen.value = true
}

const openEditBannerModal = (banner: HeroBanner) => {
  Object.assign(formState, JSON.parse(JSON.stringify(banner)))
  if (!formState.cta) {
    formState.cta = { enabled: true, label: 'Read Story', url: '', targetBlank: false, style: 'primary' }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleImageFile = async (e: Event, mode: 'desktop' | 'mobile') => {
  const input = e.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) return

  try {
    const uploadedUrl = await uploadFileToStorage(file, 'banners')
    if (uploadedUrl) {
      if (mode === 'desktop') {
        formState.desktopImageUrl = uploadedUrl
        if (!formState.desktopAlt) {
          formState.desktopAlt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }
      } else {
        formState.mobileImageUrl = uploadedUrl
        if (!formState.mobileAlt) {
          formState.mobileAlt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }
      }
      feedbackType.value = 'success'
      feedbackMessage.value = `${mode === 'desktop' ? 'Desktop' : 'Mobile'} image "${file.name}" uploaded successfully.`
    }
  } catch (err: any) {
    feedbackType.value = 'error'
    feedbackMessage.value = `Image upload failed: ${err?.message || 'File processing error.'}`
  } finally {
    if (input) input.value = ''
  }
}

const handleVideoFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) return

  try {
    const uploadedUrl = await uploadVideoToStorage(file, 'banners')
    if (uploadedUrl) {
      formState.videoUrl = uploadedUrl
      feedbackType.value = 'success'
      feedbackMessage.value = `Video "${file.name}" uploaded successfully.`
    }
  } catch (err: any) {
    feedbackType.value = 'error'
    feedbackMessage.value = `Video upload error: ${err?.message || 'Unsupported format'}`
  } finally {
    if (input) input.value = ''
  }
}

const submitBannerForm = async () => {
  if (!formState.headline?.trim()) {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Please provide a headline for the banner.'
    return
  }

  if (formState.mediaType === 'image' && !formState.desktopImageUrl?.trim()) {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Please specify or upload a desktop image.'
    return
  }

  if (formState.mediaType === 'video' && !formState.videoUrl?.trim()) {
    feedbackType.value = 'error'
    feedbackMessage.value = 'Please specify or upload a video URL.'
    return
  }

  isSubmitting.value = true
  try {
    await saveBanner(JSON.parse(JSON.stringify(formState)))
    feedbackType.value = 'success'
    feedbackMessage.value = `Hero banner "${formState.headline}" saved and published to live site!`
    closeModal()
  } catch (err: any) {
    feedbackType.value = 'error'
    feedbackMessage.value = `Failed to save banner: ${err?.message || 'Unknown error'}`
  } finally {
    isSubmitting.value = false
  }
}

const handleToggleActive = async (id: string) => {
  await toggleBannerActive(id)
  feedbackType.value = 'success'
  feedbackMessage.value = 'Banner visibility updated on live site.'
}

const handleDuplicate = async (id: string) => {
  const copy = await duplicateBanner(id)
  if (copy) {
    feedbackType.value = 'success'
    feedbackMessage.value = `Banner duplicated as draft "${copy.headline}".`
  }
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this hero banner? This action cannot be undone.')) {
    await deleteBanner(id)
    feedbackType.value = 'success'
    feedbackMessage.value = 'Banner deleted from live site.'
  }
}

const moveBanner = async (index: number, direction: -1 | 1) => {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= banners.value.length) return

  const list = [...banners.value]
  const temp = list[index]
  list[index] = list[targetIndex]
  list[targetIndex] = temp

  const orderedIds = list.map(b => b.id)
  await reorderBanners(orderedIds)
}

const handleSaveAll = async () => {
  const ok = await saveBannersToCloud()
  feedbackType.value = 'success'
  feedbackMessage.value = ok
    ? 'Hero banners pushed and synchronized to the live server!'
    : 'Hero banners saved locally.'
}

onMounted(async () => {
  await syncFromFirestore().catch(() => {})
})
</script>

