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
              <p class="text-xs text-gray-400 mt-0.5">All blogs dynamically render through the unified BlogPostLayout component.</p>
            </div>
            <button
              @click="startNewBlog"
              type="button"
              class="inline-flex items-center gap-2 bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors"
            >
              <span>+ New Blog Post</span>
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
                  :src="item.featuredImage"
                  :alt="item.title"
                  class="w-20 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                />
                <div class="min-w-0">
                  <div class="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
                    <span class="px-2.5 py-0.5 rounded-full bg-[#feeee6] text-[#EE5102] font-medium">
                      {{ item.category === 'Technology' ? 'Tech' : item.category }}
                    </span>
                    <span>•</span>
                    <span>{{ item.publishedAt }}</span>
                    <span>•</span>
                    <span>{{ item.readTime }}</span>
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

        <!-- TAB 3: CREATE / EDIT BLOG (DYNAMIC MARKDOWN CMS EDITOR) -->
        <div v-else-if="activeTab === 'editor'" class="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                {{ editingArticleId ? 'Edit Blog Post' : 'Create New Blog Post' }}
              </h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Use Markdown (`## Heading`) to automatically generate the sticky Table of Contents on the blog page.
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
                class="px-5 py-2 rounded-full text-xs font-medium bg-[#EE5102] hover:bg-[#d84802] text-white transition-colors"
              >
                {{ editingArticleId ? 'Update Blog' : 'Publish Blog' }}
              </button>
            </div>
          </div>

          <!-- Live Preview Using the Unified BlogPostLayout Component -->
          <div v-if="isPreviewMode" class="border border-gray-200 rounded-2xl overflow-hidden">
            <BlogPostLayout :article="previewArticleObject" />
          </div>

          <!-- Editor Form -->
          <form v-else @submit.prevent="saveBlogPost" class="space-y-5 max-w-4xl">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Headline / Title *</label>
                <input
                  v-model="editorForm.title"
                  type="text"
                  required
                  placeholder="e.g. Unboxing 2006 in Full Path Tracing: Revisiting the GeForce 8800 GTX"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Highlighted Title Prefix (Orange Text)</label>
                <input
                  v-model="editorForm.titleHighlight"
                  type="text"
                  placeholder="e.g. Unboxing 2006"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Category *</label>
                <select
                  v-model="editorForm.category"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-[#EE5102]"
                >
                  <option value="Technology">Tech (Technology)</option>
                  <option value="Home and DIY">Home & DIY</option>
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
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Reading Time</label>
                <input
                  v-model="editorForm.readTime"
                  type="text"
                  placeholder="5 min read"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">Supporting Text / Excerpt *</label>
              <textarea
                v-model="editorForm.excerpt"
                rows="2"
                required
                placeholder="Brief summary displayed below the headline..."
                class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Banner / Featured Image Path</label>
                <input
                  v-model="editorForm.bannerImage"
                  type="text"
                  placeholder="/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
                <input
                  v-model="editorForm.tagsInput"
                  type="text"
                  placeholder="NVIDIA, GeForce, 8800 GTX, RTX Remix"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">
                Article Body (Markdown) *
              </label>
              <textarea
                v-model="editorForm.content"
                rows="14"
                required
                placeholder="## Standing in Awe: A 2006 Memory&#10;&#10;Write your blog content in Markdown here..."
                class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#EE5102]"
              ></textarea>
            </div>
          </form>
        </div>

        <!-- TAB 4: MEDIA FILES -->
        <div v-else-if="activeTab === 'media'" class="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div class="mb-6 pb-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">Media Library ({{ mediaAssets.length }})</h2>
            <p class="text-xs text-gray-400 mt-0.5">Click any asset to copy its path for your blog posts.</p>
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
            <h2 class="text-xl font-semibold text-gray-900">CMS Profile & Settings</h2>
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
import { useArticles, type Article } from '~/composables/useArticles'

definePageMeta({
  layout: false
})

useHead({
  title: 'CMS Dashboard — HeadlineCentral.'
})

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
  bannerImage: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp',
  tagsInput: 'NVIDIA, GeForce, 8800 GTX, RTX Remix, Path Tracing',
  content: ''
})

const categorySlugMap: Record<Article['category'], Article['categorySlug']> = {
  'Technology': 'technology',
  'Home and DIY': 'home-and-diy',
  'Food': 'food',
  'Parenting': 'parenting'
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

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const previewArticleObject = computed<Article>(() => {
  const cat = editorForm.category
  const imgPath = useAsset(editorForm.bannerImage || '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp')
  return {
    id: editingArticleId.value || 'preview-article',
    slug: slugify(editorForm.title || 'untitled-blog'),
    title: editorForm.title || 'Untitled Blog Post',
    titleHighlight: editorForm.titleHighlight || undefined,
    excerpt: editorForm.excerpt || '',
    category: cat,
    categorySlug: categorySlugMap[cat],
    categoryColor: '#ee5102',
    featuredImage: imgPath,
    bannerImage: imgPath,
    imageCaption: '',
    publishedAt: editorForm.publishedAt || '2026 November 7',
    readTime: editorForm.readTime || '5 min read',
    views: 1,
    isFeatured: true,
    isPopular: true,
    author: authors.marcus,
    sections: [],
    content: editorForm.content,
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
  editorForm.bannerImage = '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp'
  editorForm.tagsInput = 'NVIDIA, GeForce, 8800 GTX'
  editorForm.content = `## Section Heading\n\nStart writing your new blog post here...`
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
  editorForm.tagsInput = article.tags.join(', ')
  if (article.content) {
    editorForm.content = article.content
  } else if (article.sections && article.sections.length > 0) {
    editorForm.content = article.sections
      .map(s => `## ${s.title}\n\n${s.content}`)
      .join('\n\n')
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
      publishedAt: built.publishedAt,
      readTime: built.readTime,
      content: built.content,
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
  { name: 'GeForce 8800 GTX Gallery 1', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp' },
  { name: 'GeForce 8800 GTX Desktop Banner', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-desktop-banner.webp' },
  { name: 'GeForce 8800 GTX Gallery 2', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-2.webp' },
  { name: 'GeForce 8800 GTX Gallery 3', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-3.webp' },
  { name: 'GeForce 8800 GTX Gallery 4', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-4.webp' },
  { name: 'GeForce 8800 GTX Gallery 5', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-5.webp' },
  { name: 'GeForce 8800 GTX Gallery 6', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-6.webp' },
  { name: 'GeForce 8800 GTX Gallery 7', path: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-7.webp' }
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

