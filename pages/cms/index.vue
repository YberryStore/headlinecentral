<template>
  <div class="min-h-screen bg-[#F2F2F2] p-3 sm:p-4 flex flex-col lg:flex-row gap-4 sm:gap-5 font-sans text-gray-900">
    <!-- Left Sidebar Card -->
    <aside
      :class="isSidebarCollapsed ? 'lg:w-[84px]' : 'lg:w-[260px]'"
      class="bg-white rounded-[24px] p-4 sm:p-5 flex flex-col justify-between flex-shrink-0 transition-all duration-200 lg:min-h-[calc(100vh-2rem)]"
    >
      <!-- Top Sidebar Section -->
      <div>
        <!-- Brand Logo & Sidebar Toggle -->
        <div class="flex items-center justify-between px-1 mb-5">
          <NuxtLink v-if="!isSidebarCollapsed" to="/" class="flex items-center">
            <img
              :src="useAsset('/images/headline-central-logo.svg')"
              alt="HeadlineCentral."
              class="h-[21px] w-auto"
            />
          </NuxtLink>
          <button
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            type="button"
            aria-label="Toggle sidebar"
            class="text-gray-700 hover:text-gray-950 p-1 rounded-lg transition-colors mx-auto lg:mx-0"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <line x1="9.5" y1="3" x2="9.5" y2="21" />
            </svg>
          </button>
        </div>

        <!-- Search Pill Input -->
        <div v-if="!isSidebarCollapsed" class="mb-4">
          <div class="flex items-center gap-2.5 w-full rounded-full bg-[#EBEBEB] border border-[#C8C8C8] px-3.5 py-2">
            <svg class="w-4 h-4 text-gray-800 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path stroke-linecap="round" d="M20 20l-4-4" />
            </svg>
            <input
              v-model="cmsSearch"
              type="text"
              placeholder="Search"
              class="bg-transparent text-[13px] text-gray-800 placeholder-gray-700 focus:outline-none w-full"
            />
          </div>
        </div>

        <!-- Primary Navigation Items -->
        <nav class="space-y-1">
          <!-- Dashboard -->
          <button
            @click="activeTab = 'dashboard'"
            type="button"
            :class="[
              activeTab === 'dashboard'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2" />
              <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2" transform="rotate(45 17.25 6.75)" />
              <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2" />
              <rect x="14" y="14" width="6.5" height="6.5" rx="1.2" />
            </svg>
            <span v-if="!isSidebarCollapsed">Dashboard</span>
          </button>

          <!-- Media files -->
          <button
            @click="activeTab = 'media'"
            type="button"
            :class="[
              activeTab === 'media'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7.5L9.5 5H5a2 2 0 0 0-2 2z" />
            </svg>
            <span v-if="!isSidebarCollapsed">Media files</span>
          </button>

          <!-- Blogs -->
          <button
            @click="activeTab = 'blogs'"
            type="button"
            :class="[
              activeTab === 'blogs' || activeTab === 'editor'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 21h15a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
              <path d="M10 7h7" />
              <path d="M10 11h7" />
              <rect x="10" y="14" width="4" height="3" rx="0.5" />
            </svg>
            <span v-if="!isSidebarCollapsed">Blogs</span>
          </button>
        </nav>
      </div>

      <!-- Bottom Sidebar Section -->
      <div class="pt-6">
        <nav class="space-y-1 mb-3">
          <!-- User Management -->
          <button
            @click="activeTab = 'users'"
            type="button"
            :class="[
              activeTab === 'users'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="7" r="3.5" />
              <path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3" />
              <circle cx="17.5" cy="16.5" r="2.2" />
              <path d="M17.5 13v1.2M17.5 18.8V20M14 16.5h1.2M19.8 16.5H21M15 14l.8.8M19.2 18.2l.8.8M20 14l-.8.8M15.8 18.2l-.8.8" />
            </svg>
            <span v-if="!isSidebarCollapsed">User Management</span>
          </button>

          <!-- Settings -->
          <button
            @click="activeTab = 'settings'"
            type="button"
            :class="[
              activeTab === 'settings'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span v-if="!isSidebarCollapsed">Settings</span>
          </button>
        </nav>

        <!-- User Profile Footer -->
        <div
          :class="isSidebarCollapsed ? 'justify-center' : 'px-2'"
          class="flex items-center gap-3 pt-2"
        >
          <img
            :src="useAsset('/images/author-marcus.jpg')"
            alt="User Avatar"
            class="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          <div v-if="!isSidebarCollapsed" class="min-w-0">
            <p class="text-[13px] font-normal text-gray-800 leading-tight truncate">
              {{ userProfile.sidebarName }}
            </p>
            <p class="text-[11px] font-normal text-gray-400 leading-tight mt-0.5 truncate">
              {{ userProfile.role }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Right Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Header Bar -->
      <header class="flex flex-wrap items-center justify-between gap-4 px-1 pt-0.5 pb-4">
        <div>
          <h1 class="text-2xl sm:text-[28px] font-semibold text-gray-950 tracking-tight leading-snug">
            Welcome back <span class="text-[#EE5102]">“{{ userProfile.welcomeName }}”</span>
          </h1>
          <p class="text-xs sm:text-[13px] text-gray-400 font-normal mt-0.5">
            Here's your overview of your blog stats.
          </p>
        </div>

        <div class="flex items-center gap-8 sm:gap-12">
          <!-- Current Live Visitors Indicator -->
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#8CE563] inline-block"></span>
            <span class="text-xs sm:text-[13px] font-medium text-gray-700">Current Live Visitors:</span>
            <span class="text-xs sm:text-[13px] font-normal text-gray-400">{{ liveVisitors }}</span>
          </div>

          <!-- Create New Blog CTA Button -->
          <button
            @click="startNewBlog"
            type="button"
            class="inline-flex items-center gap-2 bg-[#EE5102] hover:bg-[#d84802] text-white text-xs sm:text-[13px] font-normal px-5 py-2.5 rounded-full transition-colors shadow-sm"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create new blog</span>
          </button>
        </div>
      </header>

      <!-- Main White Canvas Container -->
      <main class="flex-1 bg-white rounded-[28px] overflow-hidden flex flex-col min-h-[calc(100vh-7.5rem)]">
        <!-- TAB 1: DASHBOARD (Matches reference clean white canvas) -->
        <div v-if="activeTab === 'dashboard'" class="flex-1 p-6 sm:p-8">
          <!-- Clean canvas matching reference design -->
        </div>

        <!-- TAB 2: BLOGS LIST & MANAGEMENT -->
        <div v-else-if="activeTab === 'blogs'" class="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Published Blogs ({{ filteredCmsArticles.length }})</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Click Edit to manage Hero Banners (Desktop &amp; Mobile), Content Sections, and the 12-Image Gallery.
              </p>
            </div>
            <button
              @click="startNewBlog"
              type="button"
              class="inline-flex items-center gap-2 bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors"
            >
              <span>+ Create new blog</span>
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in filteredCmsArticles"
              :key="item.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/10 transition-colors"
            >
              <div class="flex items-start sm:items-center gap-4 min-w-0">
                <img
                  :src="item.bannerImage || item.featuredImage"
                  :alt="item.bannerAlt || item.title"
                  class="w-24 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                />
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mb-1">
                    <span class="px-2.5 py-0.5 rounded-full bg-[#feeee6] text-[#EE5102] font-medium">
                      {{ item.category === 'Technology' ? 'Tech' : item.category }}
                    </span>
                    <span>•</span>
                    <span>{{ item.publishedAt }}</span>
                    <span>•</span>
                    <span>{{ item.sections?.length || 0 }} Sections</span>
                    <span>•</span>
                    <span>{{ item.galleryItems?.length || 0 }}/12 Gallery Images</span>
                  </div>
                  <h3 class="text-sm font-semibold text-gray-900 truncate">
                    {{ item.title }}
                  </h3>
                  <p class="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {{ item.excerpt }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <NuxtLink
                  :to="`/blog/${item.slug}`"
                  target="_blank"
                  class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  View Live
                </NuxtLink>
                <button
                  @click="editBlog(item)"
                  type="button"
                  class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#feeee6] hover:bg-[#fcdccc] text-[#EE5102] transition-colors"
                >
                  Edit
                </button>
                <button
                  v-if="articles.length > 1"
                  @click="handleDeleteBlog(item.id)"
                  type="button"
                  class="px-3 py-1.5 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: CREATE / EDIT BLOG (STRUCTURED FOLLOWING EXACT BLOG CONTENT ORDER) -->
        <div v-else-if="activeTab === 'editor'" class="flex-1 p-6 sm:p-8 overflow-y-auto">
          <!-- Sticky Editor Top Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <div class="flex items-center gap-2">
                <button
                  @click="activeTab = 'blogs'"
                  type="button"
                  class="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1"
                >
                  <span>&larr; Back to Blogs</span>
                </button>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mt-1">
                {{ editingArticleId ? 'Edit Blog Post' : 'Create New Blog Post' }}
              </h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Structured in exact article order: Headline &rarr; Hero Banner (Desktop &amp; Mobile + Alt) &rarr; Sections (Header, Copy, Desktop &amp; Mobile Image + Alt) &rarr; Gallery (up to 12 Images + Alt).
              </p>
            </div>
            <div class="flex items-center gap-2.5">
              <button
                @click="isPreviewMode = !isPreviewMode"
                type="button"
                class="px-4 py-2 rounded-full text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                {{ isPreviewMode ? 'Back to Editor' : 'Live Layout Preview' }}
              </button>
              <button
                @click="saveBlogPost"
                type="button"
                class="px-5 py-2 rounded-full text-xs font-medium bg-[#EE5102] hover:bg-[#d84802] text-white transition-colors shadow-sm"
              >
                {{ editingArticleId ? 'Update Blog' : 'Publish Blog' }}
              </button>
            </div>
          </div>

          <!-- Live Preview Using the Unified BlogPostLayout Component -->
          <div v-if="isPreviewMode" class="border border-gray-200 rounded-2xl overflow-hidden">
            <BlogPostLayout :article="previewArticleObject" />
          </div>

          <!-- Structured Blog Editor Form -->
          <form v-else @submit.prevent="saveBlogPost" class="space-y-8 max-w-5xl pb-12">
            <!-- ======================================================================= -->
            <!-- 1. BLOG HEADER & METADATA                                               -->
            <!-- ======================================================================= -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-4">
              <div class="flex items-center justify-between border-b border-gray-200/80 pb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Step 1</span>
                  <h3 class="text-base font-semibold text-gray-900">Blog Headline &amp; Supporting Text</h3>
                </div>
                <span class="text-xs text-gray-400">Top centered article header</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Category Badge *</label>
                  <select
                    v-model="editorForm.category"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-[#EE5102]"
                  >
                    <option value="Technology">Tech (Technology)</option>
                    <option value="Home and DIY">Home &amp; DIY</option>
                    <option value="Food">Food</option>
                    <option value="Parenting">Parenting</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Publish Date</label>
                  <input
                    v-model="editorForm.publishedAt"
                    type="text"
                    placeholder="2026 November 7"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Reading Time</label>
                  <input
                    v-model="editorForm.readTime"
                    type="text"
                    placeholder="5 min read"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Full Headline / Title *</label>
                  <input
                    v-model="editorForm.title"
                    type="text"
                    required
                    placeholder="Unboxing 2006 in Full Path Tracing: Revisiting the GeForce 8800 GTX Two Decades On"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Highlighted Orange Text</label>
                  <input
                    v-model="editorForm.titleHighlight"
                    type="text"
                    placeholder="Unboxing 2006"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Supporting Text / Subtitle *</label>
                <textarea
                  v-model="editorForm.excerpt"
                  rows="2"
                  required
                  placeholder="Software is no longer just a passive tool waiting for human input. We examine how multimodal agent architectures and proactive intelligence are quietly"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                ></textarea>
              </div>
            </div>

            <!-- ======================================================================= -->
            <!-- 2. BLOG HERO BANNER (DESKTOP & MOBILE WITH ALT TAG)                     -->
            <!-- ======================================================================= -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-4">
              <div class="flex items-center justify-between border-b border-gray-200/80 pb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Step 2</span>
                  <h3 class="text-base font-semibold text-gray-900">Blog Hero Banner (Desktop &amp; Mobile + Alt Tag)</h3>
                </div>
                <span class="text-xs text-gray-400">Main 1600x800 / Mobile responsive hero banner</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <!-- Desktop Hero Banner -->
                <div class="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-semibold text-gray-800">Desktop Hero Banner *</label>
                    <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                      Upload File
                      <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => editorForm.bannerImage = url)" />
                    </label>
                  </div>
                  <input
                    v-model="editorForm.bannerImage"
                    type="text"
                    required
                    placeholder="/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-desktop-banner.webp"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                  <div v-if="editorForm.bannerImage" class="aspect-[2/1] rounded-lg overflow-hidden bg-gray-950 border border-gray-100">
                    <img :src="resolvePreviewUrl(editorForm.bannerImage)" :alt="editorForm.bannerAlt || 'Desktop Hero Preview'" class="w-full h-full object-cover" />
                  </div>
                </div>

                <!-- Mobile Hero Banner -->
                <div class="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-xs font-semibold text-gray-800">Mobile Hero Banner *</label>
                    <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                      Upload File
                      <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => editorForm.bannerImageMobile = url)" />
                    </label>
                  </div>
                  <input
                    v-model="editorForm.bannerImageMobile"
                    type="text"
                    placeholder="/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp"
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                  <div v-if="editorForm.bannerImageMobile" class="aspect-[16/10] max-h-36 rounded-lg overflow-hidden bg-gray-950 border border-gray-100">
                    <img :src="resolvePreviewUrl(editorForm.bannerImageMobile)" :alt="editorForm.bannerAlt || 'Mobile Hero Preview'" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Hero Banner Alt Tag *</label>
                  <input
                    v-model="editorForm.bannerAlt"
                    type="text"
                    required
                    placeholder="Descriptive alt text for desktop & mobile hero banner"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Hero Banner Caption (Optional)</label>
                  <input
                    v-model="editorForm.imageCaption"
                    type="text"
                    placeholder="Photo courtesy: NVIDIA G80 20-Year Archive Celebration..."
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
              </div>
            </div>

            <!-- ======================================================================= -->
            <!-- 3. ARTICLE CONTENT SECTIONS (MULTIPLE SECTIONS WITH HEADER & IMAGES)    -->
            <!-- ======================================================================= -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 pb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Step 3</span>
                  <h3 class="text-base font-semibold text-gray-900">
                    Article Sections ({{ editorForm.sections.length }})
                  </h3>
                  <p class="text-xs text-gray-400">
                    Each section header automatically populates the sticky Table of Contents on the left of the blog.
                  </p>
                </div>
                <button
                  @click="addSection"
                  type="button"
                  class="inline-flex items-center gap-1.5 bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  <span>+ Add Section</span>
                </button>
              </div>

              <!-- List of Dynamic Sections -->
              <div class="space-y-5">
                <div
                  v-for="(sec, sIdx) in editorForm.sections"
                  :key="sIdx"
                  class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4"
                >
                  <!-- Section Card Top Bar -->
                  <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div class="flex items-center gap-2.5">
                      <span class="w-6 h-6 rounded-full bg-[#feeee6] text-[#EE5102] text-xs font-semibold flex items-center justify-center">
                        {{ sIdx + 1 }}
                      </span>
                      <span class="text-sm font-semibold text-gray-900">
                        {{ sec.title || `Section ${sIdx + 1}` }}
                      </span>
                    </div>

                    <div class="flex items-center gap-1.5">
                      <button
                        v-if="sIdx > 0"
                        @click="moveSection(sIdx, -1)"
                        type="button"
                        title="Move section up"
                        class="px-2.5 py-1 rounded-lg text-xs text-gray-500 hover:bg-gray-100"
                      >
                        &uarr; Up
                      </button>
                      <button
                        v-if="sIdx < editorForm.sections.length - 1"
                        @click="moveSection(sIdx, 1)"
                        type="button"
                        title="Move section down"
                        class="px-2.5 py-1 rounded-lg text-xs text-gray-500 hover:bg-gray-100"
                      >
                        &darr; Down
                      </button>
                      <button
                        v-if="editorForm.sections.length > 1"
                        @click="removeSection(sIdx)"
                        type="button"
                        class="px-2.5 py-1 rounded-lg text-xs text-red-600 hover:bg-red-50 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <!-- Section Header (H2) -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1.5">
                      Section Header (H2 &amp; Table of Contents Title) *
                    </label>
                    <input
                      v-model="sec.title"
                      type="text"
                      required
                      placeholder="e.g. Standing in Awe: A 2006 Memory"
                      class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                    />
                  </div>

                  <!-- Section Body Copy -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1.5">
                      Section Content / Paragraphs *
                    </label>
                    <textarea
                      v-model="sec.content"
                      rows="6"
                      required
                      placeholder="Write section paragraphs here (separate paragraphs with a blank line)..."
                      class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm leading-relaxed focus:outline-none focus:border-[#EE5102]"
                    ></textarea>
                  </div>

                  <!-- Section Image Toggle / Block (Desktop & Mobile + Alt Tag) -->
                  <div class="pt-2">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-xs font-semibold text-gray-800">
                        Section Image (Desktop &amp; Mobile + Alt Tag)
                      </span>
                      <button
                        @click="sec.hasImage = !sec.hasImage"
                        type="button"
                        class="text-xs font-medium px-3 py-1 rounded-full transition-colors"
                        :class="sec.hasImage ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#feeee6] text-[#EE5102] hover:bg-[#fcdccc]'"
                      >
                        {{ sec.hasImage ? 'Remove Section Image' : '+ Add Image to Section' }}
                      </button>
                    </div>

                    <div v-if="sec.hasImage" class="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Desktop Section Image -->
                        <div class="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2.5">
                          <div class="flex items-center justify-between">
                            <label class="text-xs font-medium text-gray-700">Desktop Image *</label>
                            <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                              Upload File
                              <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => sec.imageSrc = url)" />
                            </label>
                          </div>
                          <input
                            v-model="sec.imageSrc"
                            type="text"
                            placeholder="/images/geforce-8800-gtx-gpu-celebration-20-year-steam-tech-demo.webp"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                          />
                          <div v-if="sec.imageSrc" class="aspect-video rounded-lg overflow-hidden bg-gray-950">
                            <img :src="resolvePreviewUrl(sec.imageSrc)" :alt="sec.imageAlt || sec.title" class="w-full h-full object-cover" />
                          </div>
                        </div>

                        <!-- Mobile Section Image -->
                        <div class="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2.5">
                          <div class="flex items-center justify-between">
                            <label class="text-xs font-medium text-gray-700">Mobile Image</label>
                            <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                              Upload File
                              <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => sec.imageMobileSrc = url)" />
                            </label>
                          </div>
                          <input
                            v-model="sec.imageMobileSrc"
                            type="text"
                            placeholder="/images/geforce-8800-gtx-gpu-celebration-20-year-steam-tech-demo.webp"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                          />
                          <div v-if="sec.imageMobileSrc" class="aspect-video rounded-lg overflow-hidden bg-gray-950">
                            <img :src="resolvePreviewUrl(sec.imageMobileSrc)" :alt="sec.imageAlt || sec.title" class="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">Section Image Alt Tag *</label>
                          <input
                            v-model="sec.imageAlt"
                            type="text"
                            placeholder="e.g. GeForce 8800 GTX 20 Years of a Legend"
                            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                          />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">Section Image Caption (Optional)</label>
                          <input
                            v-model="sec.imageCaption"
                            type="text"
                            placeholder="Caption shown beneath the section image"
                            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Radio Toggle for Custom HTML Field (e.g. Modern Tech Meets Vintage Silicon Table) -->
                  <div class="pt-3 border-t border-gray-100">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span class="text-xs font-semibold text-gray-800 block">
                          Include HTML Field (Table / Custom HTML Caption)
                        </span>
                        <span class="text-[11px] text-gray-400">
                          Enable to include custom HTML markup (such as the comparison table in "Modern Tech Meets Vintage Silicon").
                        </span>
                      </div>

                      <!-- Radio Toggle Group -->
                      <div class="inline-flex items-center gap-4 bg-gray-100 px-3.5 py-1.5 rounded-full">
                        <label class="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-gray-700">
                          <input
                            type="radio"
                            :name="`html-toggle-${sIdx}`"
                            :value="false"
                            v-model="sec.includeHtml"
                            class="accent-[#EE5102] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>Off</span>
                        </label>
                        <label class="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-gray-900">
                          <input
                            type="radio"
                            :name="`html-toggle-${sIdx}`"
                            :value="true"
                            v-model="sec.includeHtml"
                            class="accent-[#EE5102] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span class="text-[#EE5102] font-semibold">HTML Field</span>
                        </label>
                      </div>
                    </div>

                    <!-- Expanded HTML Field & Live Preview -->
                    <div v-if="sec.includeHtml" class="mt-3 p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-3">
                      <div class="flex items-center justify-between">
                        <label class="text-xs font-semibold text-gray-800">
                          HTML Markup (Rendered below section paragraphs)
                        </label>
                        <button
                          @click="insertDefaultComparisonTableHtml(sec)"
                          type="button"
                          class="text-[11px] font-medium text-[#EE5102] hover:underline"
                        >
                          Insert Comparison Table Template
                        </button>
                      </div>
                      <textarea
                        v-model="sec.htmlContent"
                        rows="8"
                        placeholder="<div class=&quot;my-8 overflow-hidden rounded-2xl border border-gray-200&quot;>...</div>"
                        class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#EE5102]"
                      ></textarea>

                      <!-- Live Rendered HTML Preview inside the Editor -->
                      <div v-if="sec.htmlContent" class="pt-2">
                        <span class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                          Live HTML Preview:
                        </span>
                        <div class="bg-white p-3 rounded-xl border border-gray-100" v-html="sec.htmlContent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ======================================================================= -->
            <!-- 4. GALLERY SECTION (UP TO 12 IMAGES WITH ALT TAGS)                      -->
            <!-- ======================================================================= -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 pb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Step 4</span>
                  <div class="flex items-center gap-2.5">
                    <h3 class="text-base font-semibold text-gray-900">
                      Article Photo Gallery
                    </h3>
                    <span
                      class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      :class="editorForm.galleryItems.length >= 12 ? 'bg-amber-100 text-amber-800' : 'bg-[#feeee6] text-[#EE5102]'"
                    >
                      {{ editorForm.galleryItems.length }} / 12 Images
                    </span>
                  </div>
                  <p class="text-xs text-gray-400">
                    Add up to 12 gallery images with individual alt tags for the interactive 1040x600 gallery carousel.
                  </p>
                </div>

                <button
                  @click="addGalleryItem"
                  type="button"
                  :disabled="editorForm.galleryItems.length >= 12"
                  :class="editorForm.galleryItems.length >= 12 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#EE5102] hover:bg-[#d84802] text-white'"
                  class="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  <span>{{ editorForm.galleryItems.length >= 12 ? 'Max 12 Images Reached' : '+ Add Gallery Image' }}</span>
                </button>
              </div>

              <!-- Gallery Caption -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Gallery Archive Caption (Optional)</label>
                <input
                  v-model="editorForm.galleryCaption"
                  type="text"
                  placeholder="A high-resolution visual archive celebrating 20 years of GeForce 8800 GTX hardware craft..."
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>

              <!-- Empty State -->
              <div v-if="editorForm.galleryItems.length === 0" class="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200">
                <p class="text-xs text-gray-400 mb-3">No gallery images added yet (supports up to 12 images with alt tags).</p>
                <button
                  @click="addGalleryItem"
                  type="button"
                  class="px-4 py-2 rounded-full text-xs font-medium bg-[#feeee6] text-[#EE5102] hover:bg-[#fcdccc] transition-colors"
                >
                  + Add First Gallery Image
                </button>
              </div>

              <!-- Grid of up to 12 Gallery Image Cards -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(gItem, gIdx) in editorForm.galleryItems"
                  :key="gIdx"
                  class="bg-white p-4 rounded-2xl border border-gray-200 flex gap-3.5 items-start shadow-sm"
                >
                  <!-- Image Preview & Index Badge -->
                  <div class="w-24 flex-shrink-0 space-y-1.5">
                    <div class="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-950 border border-gray-100">
                      <img
                        v-if="gItem.src"
                        :src="resolvePreviewUrl(gItem.src)"
                        :alt="gItem.alt || `Gallery ${gIdx + 1}`"
                        class="w-full h-full object-cover"
                      />
                      <span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono">
                        #{{ gIdx + 1 }}
                      </span>
                    </div>
                    <label class="block text-center cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                      Upload
                      <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => gItem.src = url)" />
                    </label>
                  </div>

                  <!-- Image Path & Alt Tag Inputs -->
                  <div class="flex-1 min-w-0 space-y-2.5">
                    <div>
                      <div class="flex items-center justify-between mb-1">
                        <label class="text-[11px] font-semibold text-gray-700">Image {{ gIdx + 1 }} Path / URL *</label>
                        <button
                          @click="removeGalleryItem(gIdx)"
                          type="button"
                          class="text-[11px] text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        v-model="gItem.src"
                        type="text"
                        required
                        placeholder="/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp"
                        class="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#EE5102]"
                      />
                    </div>

                    <div>
                      <label class="block text-[11px] font-semibold text-gray-700 mb-1">Image {{ gIdx + 1 }} Alt Tag *</label>
                      <input
                        v-model="gItem.alt"
                        type="text"
                        required
                        :placeholder="`Descriptive alt text for gallery image #${gIdx + 1}`"
                        class="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#EE5102]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ======================================================================= -->
            <!-- 5. ARTICLE TAGS & PUBLISH FOOTER                                        -->
            <!-- ======================================================================= -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-4">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Step 5</span>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Article Tags</h3>
                <input
                  v-model="editorForm.tagsInput"
                  type="text"
                  placeholder="NVIDIA, GeForce 8800, Retro Tech, Hardware, PC Gaming History"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>

              <div class="pt-3 flex items-center justify-end gap-3 border-t border-gray-200/80">
                <button
                  @click="isPreviewMode = true"
                  type="button"
                  class="px-5 py-2.5 rounded-full text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  Preview Full Blog
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 rounded-full text-xs font-medium bg-[#EE5102] hover:bg-[#d84802] text-white transition-colors shadow-sm"
                >
                  {{ editingArticleId ? 'Save & Update Blog' : 'Publish New Blog' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- TAB 4: MEDIA FILES -->
        <div v-else-if="activeTab === 'media'" class="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div class="mb-6 pb-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">Media Library ({{ mediaAssets.length }})</h2>
            <p class="text-xs text-gray-400 mt-0.5">Click any asset to copy its path for your Hero Banner, Sections, or 12-Image Gallery.</p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="media in mediaAssets"
              :key="media.path"
              @click="copyMediaPath(media.path)"
              class="group cursor-pointer rounded-2xl border border-gray-100 overflow-hidden hover:border-[#EE5102] transition-all"
            >
              <div class="aspect-video bg-gray-100 overflow-hidden">
                <img :src="useAsset(media.path)" :alt="media.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div class="p-3">
                <p class="text-xs font-medium text-gray-800 truncate">{{ media.name }}</p>
                <p class="text-[11px] text-[#EE5102] mt-0.5">
                  {{ copiedMedia === media.path ? 'Copied!' : 'Click to copy path' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5: USER MANAGEMENT -->
        <div v-else-if="activeTab === 'users'" class="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div class="mb-6 pb-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">User Management</h2>
            <p class="text-xs text-gray-400 mt-0.5">Manage editorial team members and roles.</p>
          </div>
          <div class="max-w-2xl space-y-3">
            <div class="flex items-center justify-between p-4 rounded-2xl border border-gray-100">
              <div class="flex items-center gap-3.5">
                <img :src="useAsset('/images/author-marcus.jpg')" alt="Avatar" class="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ userProfile.sidebarName }}</p>
                  <p class="text-xs text-gray-400">{{ userProfile.role }}</p>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium bg-[#feeee6] text-[#EE5102]">Admin</span>
            </div>
          </div>
        </div>

        <!-- TAB 6: SETTINGS -->
        <div v-else-if="activeTab === 'settings'" class="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div class="mb-6 pb-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">CMS Profile &amp; Settings</h2>
            <p class="text-xs text-gray-400 mt-0.5">Customize your displayed username and editorial role.</p>
          </div>
          <div class="max-w-md space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">Welcome Header Username</label>
              <input
                v-model="userProfile.welcomeName"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none focus:border-[#EE5102]"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">Sidebar Display Name</label>
              <input
                v-model="userProfile.sidebarName"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none focus:border-[#EE5102]"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">User Role</label>
              <input
                v-model="userProfile.role"
                type="text"
                class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none focus:border-[#EE5102]"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useArticles, type Article, type ArticleSection, type GalleryItem } from '~/composables/useArticles'

definePageMeta({
  layout: false
})

useHead({
  title: 'CMS Dashboard — HeadlineCentral.'
})

interface EditableSectionForm {
  id: string
  title: string
  content: string
  hasImage: boolean
  imageSrc: string
  imageMobileSrc: string
  imageAlt: string
  imageCaption: string
  includeHtml: boolean
  htmlContent: string
  comparisonTable?: ArticleSection['comparisonTable']
}

const { articles, authors, addArticle, updateArticle, deleteArticle } = useArticles()

const isSidebarCollapsed = ref(false)
const activeTab = ref<'dashboard' | 'media' | 'blogs' | 'editor' | 'users' | 'settings'>('dashboard')
const cmsSearch = ref('')
const liveVisitors = ref(12)
const isPreviewMode = ref(false)
const editingArticleId = ref<string | null>(null)
const copiedMedia = ref('')

const userProfile = reactive({
  welcomeName: 'username goes here',
  sidebarName: 'Username goes here',
  role: 'User Role Goes here'
})

const editorForm = reactive({
  title: '',
  titleHighlight: '',
  category: 'Technology' as Article['category'],
  publishedAt: '2026 November 7',
  readTime: '5 min read',
  excerpt: '',
  bannerImage: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-desktop-banner.webp',
  bannerImageMobile: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp',
  bannerAlt: '',
  imageCaption: '',
  sections: [] as EditableSectionForm[],
  galleryItems: [] as GalleryItem[],
  galleryCaption: '',
  tagsInput: 'NVIDIA, GeForce 8800, Retro Tech, Hardware, PC Gaming History'
})

const categorySlugMap: Record<Article['category'], Article['categorySlug']> = {
  'Technology': 'technology',
  'Home and DIY': 'home-and-diy',
  'Food': 'food',
  'Parenting': 'parenting'
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const resolvePreviewUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return useAsset(url)
}

const handleFileUpload = (event: Event, onLoaded: (dataUrl: string) => void) => {
  const input = event.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      onLoaded(reader.result)
    }
  }
  reader.readAsDataURL(file)
}

const filteredCmsArticles = computed(() => {
  const q = cmsSearch.value.trim().toLowerCase()
  if (!q) return articles
  return articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q)
  )
})

const defaultComparisonTableHtml = `<div class="my-8 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse text-xs sm:text-sm">
      <thead>
        <tr class="bg-[#EE5102] text-white">
          <th class="py-3.5 px-4 sm:px-5 font-semibold text-xs tracking-wider">Component / Feature</th>
          <th class="py-3.5 px-4 sm:px-5 font-semibold text-xs tracking-wider">GeForce 8800 GTX (2006)</th>
          <th class="py-3.5 px-4 sm:px-5 font-semibold text-xs tracking-wider">Modern Architecture (2026 Target)</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 bg-white">
        <tr class="bg-white hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">Unified Architecture</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">128 Stream Processors</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">Thousands of Parallel Cores + Dedicated RT &amp; Tensor Cores</td>
        </tr>
        <tr class="bg-orange-50/20 hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">Core Clock &amp; Memory</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">575 MHz Core / 768 MB GDDR3 (384-bit)</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">2.5+ GHz Core / 24+ GB High-Bandwidth GDDR6X / HBM3</td>
        </tr>
        <tr class="bg-white hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">3D Graphics API</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">DirectX 10 Shader Model 4.0</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">DirectX 12 Ultimate / Full Hardware Path Tracing</td>
        </tr>
        <tr class="bg-orange-50/20 hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">Architecture Paradigm</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">First Unified Computing Architecture (G80)</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">Neural, Agentic &amp; Autonomous Acceleration</td>
        </tr>
        <tr class="bg-white hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">Historical Market Impact</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">First Consumer GPU to Break 500 GFLOPs</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">PetaFLOP Workstation Workhorses Powering Real-Time AI</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`

const insertDefaultComparisonTableHtml = (sec: EditableSectionForm) => {
  sec.includeHtml = true
  sec.htmlContent = defaultComparisonTableHtml
}

const addSection = () => {
  editorForm.sections.push({
    id: `section-${Date.now()}-${editorForm.sections.length + 1}`,
    title: '',
    content: '',
    hasImage: false,
    imageSrc: '',
    imageMobileSrc: '',
    imageAlt: '',
    imageCaption: '',
    includeHtml: false,
    htmlContent: ''
  })
}

const removeSection = (index: number) => {
  if (editorForm.sections.length > 1) {
    editorForm.sections.splice(index, 1)
  }
}

const moveSection = (index: number, direction: -1 | 1) => {
  const target = index + direction
  if (target < 0 || target >= editorForm.sections.length) return
  const temp = editorForm.sections[index]
  editorForm.sections[index] = editorForm.sections[target]
  editorForm.sections[target] = temp
}

const addGalleryItem = () => {
  if (editorForm.galleryItems.length >= 12) return
  const nextNum = editorForm.galleryItems.length + 1
  editorForm.galleryItems.push({
    src: `/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-${nextNum}.webp`,
    alt: `Gallery image ${nextNum}`
  })
}

const removeGalleryItem = (index: number) => {
  editorForm.galleryItems.splice(index, 1)
}

const previewArticleObject = computed<Article>(() => {
  const cat = editorForm.category
  const desktopBanner = resolvePreviewUrl(editorForm.bannerImage)
  const mobileBanner = resolvePreviewUrl(editorForm.bannerImageMobile || editorForm.bannerImage)

  const builtSections: ArticleSection[] = editorForm.sections.map((sec, idx) => {
    const sectionObj: ArticleSection = {
      id: slugify(sec.title || `section-${idx + 1}`),
      title: sec.title || `Section ${idx + 1}`,
      content: sec.content
    }
    if (sec.hasImage && (sec.imageSrc || sec.imageMobileSrc)) {
      sectionObj.image = {
        src: resolvePreviewUrl(sec.imageSrc || sec.imageMobileSrc),
        mobileSrc: resolvePreviewUrl(sec.imageMobileSrc || sec.imageSrc),
        alt: sec.imageAlt || sec.title || 'Section image',
        caption: sec.imageCaption || ''
      }
    }
    if (sec.includeHtml && sec.htmlContent) {
      sectionObj.includeHtml = true
      sectionObj.htmlContent = sec.htmlContent
    } else if (sec.comparisonTable) {
      sectionObj.comparisonTable = sec.comparisonTable
    }
    return sectionObj
  })

  const builtGallery: GalleryItem[] = editorForm.galleryItems
    .slice(0, 12)
    .filter(g => Boolean(g.src))
    .map((g, idx) => ({
      src: resolvePreviewUrl(g.src),
      alt: g.alt || `Gallery image ${idx + 1}`
    }))

  return {
    id: editingArticleId.value || 'preview-article',
    slug: slugify(editorForm.title || 'untitled-blog'),
    title: editorForm.title || 'Untitled Blog Post',
    titleHighlight: editorForm.titleHighlight || undefined,
    excerpt: editorForm.excerpt || '',
    category: cat,
    categorySlug: categorySlugMap[cat],
    categoryColor: '#ee5102',
    featuredImage: mobileBanner || desktopBanner,
    bannerImage: desktopBanner,
    bannerImageMobile: mobileBanner,
    bannerAlt: editorForm.bannerAlt || editorForm.title || 'Blog Hero Banner',
    imageCaption: editorForm.imageCaption || '',
    publishedAt: editorForm.publishedAt || '2026 November 7',
    readTime: editorForm.readTime || '5 min read',
    views: 1,
    isFeatured: true,
    isPopular: true,
    author: authors.marcus,
    sections: builtSections,
    galleryItems: builtGallery,
    galleryCaption: editorForm.galleryCaption || '',
    tags: editorForm.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
  }
})

const startNewBlog = () => {
  editingArticleId.value = null
  isPreviewMode.value = false
  editorForm.title = ''
  editorForm.titleHighlight = ''
  editorForm.category = 'Technology'
  editorForm.publishedAt = '2026 November 7'
  editorForm.readTime = '5 min read'
  editorForm.excerpt = ''
  editorForm.bannerImage = '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-desktop-banner.webp'
  editorForm.bannerImageMobile = '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp'
  editorForm.bannerAlt = ''
  editorForm.imageCaption = ''
  editorForm.sections = [
    {
      id: `section-${Date.now()}-1`,
      title: '',
      content: '',
      hasImage: true,
      imageSrc: '',
      imageMobileSrc: '',
      imageAlt: '',
      imageCaption: '',
      includeHtml: false,
      htmlContent: ''
    }
  ]
  editorForm.galleryItems = []
  editorForm.galleryCaption = ''
  editorForm.tagsInput = 'NVIDIA, GeForce 8800, Retro Tech, Hardware, PC Gaming History'
  activeTab.value = 'editor'
}

const editBlog = (article: Article) => {
  editingArticleId.value = article.id
  isPreviewMode.value = false
  editorForm.title = article.title
  editorForm.titleHighlight = article.titleHighlight || ''
  editorForm.category = article.category
  editorForm.publishedAt = article.publishedAt
  editorForm.readTime = article.readTime
  editorForm.excerpt = article.excerpt
  editorForm.bannerImage = article.bannerImage || article.featuredImage
  editorForm.bannerImageMobile = article.bannerImageMobile || article.featuredImage
  editorForm.bannerAlt = article.bannerAlt || article.title
  editorForm.imageCaption = article.imageCaption || ''
  editorForm.tagsInput = article.tags.join(', ')

  if (article.sections && article.sections.length > 0) {
    editorForm.sections = article.sections.map(s => ({
      id: s.id,
      title: s.title,
      content: s.content,
      hasImage: Boolean(s.image && (s.image.src || s.image.mobileSrc)),
      imageSrc: s.image?.src || '',
      imageMobileSrc: s.image?.mobileSrc || s.image?.src || '',
      imageAlt: s.image?.alt || '',
      imageCaption: s.image?.caption || '',
      includeHtml: Boolean(s.includeHtml || s.htmlContent || s.comparisonTable),
      htmlContent: s.htmlContent || (s.comparisonTable ? defaultComparisonTableHtml : ''),
      comparisonTable: s.comparisonTable
    }))
  } else {
    editorForm.sections = [
      {
        id: 'section-1',
        title: 'Introduction',
        content: article.content || '',
        hasImage: false,
        imageSrc: '',
        imageMobileSrc: '',
        imageAlt: '',
        imageCaption: '',
        includeHtml: false,
        htmlContent: ''
      }
    ]
  }

  // Populate up to 12 gallery items with alt tags
  if (article.galleryItems && article.galleryItems.length > 0) {
    editorForm.galleryItems = article.galleryItems.slice(0, 12).map(g => ({
      src: g.src,
      alt: g.alt
    }))
    editorForm.galleryCaption = article.galleryCaption || ''
  } else {
    const secWithGallery = article.sections?.find(s => s.gallery && s.gallery.length > 0)
    if (secWithGallery && secWithGallery.gallery) {
      editorForm.galleryItems = secWithGallery.gallery.slice(0, 12).map((item, idx) =>
        typeof item === 'string'
          ? { src: item, alt: `Gallery image ${idx + 1}` }
          : { src: item.src, alt: item.alt || `Gallery image ${idx + 1}` }
      )
      editorForm.galleryCaption = secWithGallery.galleryCaption || ''
    } else {
      editorForm.galleryItems = []
      editorForm.galleryCaption = ''
    }
  }

  activeTab.value = 'editor'
}

const saveBlogPost = () => {
  const built = previewArticleObject.value
  if (editingArticleId.value) {
    updateArticle(editingArticleId.value, {
      title: built.title,
      titleHighlight: built.titleHighlight,
      excerpt: built.excerpt,
      category: built.category,
      categorySlug: built.categorySlug,
      featuredImage: built.featuredImage,
      bannerImage: built.bannerImage,
      bannerImageMobile: built.bannerImageMobile,
      bannerAlt: built.bannerAlt,
      imageCaption: built.imageCaption,
      publishedAt: built.publishedAt,
      readTime: built.readTime,
      sections: built.sections,
      galleryItems: built.galleryItems,
      galleryCaption: built.galleryCaption,
      tags: built.tags
    })
  } else {
    addArticle({
      ...built,
      id: `art-${Date.now()}`
    })
  }
  activeTab.value = 'blogs'
}

const handleDeleteBlog = (id: string) => {
  deleteArticle(id)
}

const mediaAssets = [
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
  { name: 'GeForce 8800 GTX Gallery 12', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-12.webp' }
]

const copyMediaPath = (path: string) => {
  if (typeof window !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(path)
    copiedMedia.value = path
    setTimeout(() => {
      copiedMedia.value = ''
    }, 2000)
  }
}
</script>
