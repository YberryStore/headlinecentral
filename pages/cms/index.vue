<template>
  <div v-if="currentUser && (currentUser.isMaster || (currentUser.status === 'active' && currentUser.approvedAt && currentUser.active !== false))" class="min-h-screen bg-[#F2F2F2] p-3 sm:p-4 flex flex-col lg:flex-row gap-4 sm:gap-5 font-sans text-gray-900">
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
            v-if="hasPermission('canManageMedia')"
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

          <!-- Categories & Sub-Categories -->
          <button
            v-if="hasPermission('canManageCategories')"
            @click="activeTab = 'categories'"
            type="button"
            :class="[
              activeTab === 'categories'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16M4 12h10M4 18h7" />
              <circle cx="18" cy="15" r="3" />
            </svg>
            <span v-if="!isSidebarCollapsed">Categories</span>
          </button>

          <!-- Banners (Landing Page Hero Section) -->
          <button
            v-if="hasPermission('canManageSettings') || hasPermission('canManageBlogs') || isMasterAdmin"
            @click="activeTab = 'banners'"
            type="button"
            :class="[
              activeTab === 'banners'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <circle cx="8" cy="8" r="1.5" />
              <path d="M21 14l-5-5L5 17" />
            </svg>
            <span v-if="!isSidebarCollapsed">Banners</span>
          </button>

          <!-- SEO & Analytics (GTM / GA4 / Meta Pixel) -->
          <button
            v-if="hasPermission('canManageSettings') || hasPermission('canManageBlogs')"
            @click="activeTab = 'seo'"
            type="button"
            :class="[
              activeTab === 'seo'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            <span v-if="!isSidebarCollapsed">SEO &amp; Tracking</span>
          </button>

          <!-- Trending now -->
          <button
            v-if="hasPermission('canManageSettings') || hasPermission('canManageBlogs') || isMasterAdmin"
            @click="activeTab = 'trending'"
            type="button"
            :class="[
              activeTab === 'trending'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <span v-if="!isSidebarCollapsed">Trending now</span>
          </button>

          <!-- Header & Footer Navigation & Content -->
          <button
            v-if="hasPermission('canManageSettings') || isMasterAdmin"
            @click="activeTab = 'header-footer'"
            type="button"
            :class="[
              activeTab === 'header-footer'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18" />
            </svg>
            <span v-if="!isSidebarCollapsed">Header &amp; Footer</span>
          </button>

          <!-- Contact Us Page Content -->
          <button
            v-if="hasPermission('canManageSettings') || isMasterAdmin"
            @click="activeTab = 'contact-page'"
            type="button"
            :class="[
              activeTab === 'contact-page'
                ? 'bg-[#EE5102] text-white'
                : 'text-gray-900 hover:bg-gray-100',
              isSidebarCollapsed ? 'justify-center px-2' : 'px-4'
            ]"
            class="w-full flex items-center gap-3 py-2.5 rounded-full text-[13px] font-normal transition-colors"
          >
            <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span v-if="!isSidebarCollapsed">Contact Us</span>
          </button>
        </nav>
      </div>

      <!-- Bottom Sidebar Section -->
      <div class="pt-6">
        <nav class="space-y-1 mb-3">
          <!-- User Management -->
          <button
            v-if="canViewUserManagementInNav"
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
            v-if="hasPermission('canManageSettings')"
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

        <!-- User Profile Footer & Sign Out -->
        <div
          :class="isSidebarCollapsed ? 'flex-col items-center gap-2' : 'px-2 justify-between gap-2'"
          class="flex items-center pt-2 border-t border-gray-100"
        >
          <div class="flex items-center gap-3 min-w-0">
            <img
              :src="currentUser?.photoURL || useAsset('/images/author-marcus.jpg')"
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
          <button
            @click="handleLogout"
            type="button"
            title="Sign Out"
            class="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 hover:text-white bg-gray-100 hover:bg-[#EE5102] px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span v-if="!isSidebarCollapsed">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Right Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Header Bar -->
      <header class="flex flex-wrap items-center justify-between gap-4 px-1 pt-0.5 pb-4">
        <div>
          <div class="flex flex-wrap items-center gap-2.5">
            <h1 class="text-2xl sm:text-[28px] font-semibold text-gray-950 tracking-tight leading-snug">
              Welcome back <span class="text-[#EE5102]">“{{ userProfile.welcomeName }}”</span>
            </h1>
            <span class="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#feeee6] text-[#EE5102] border border-orange-200/60">
              {{ userProfile.role }}
            </span>
          </div>
          <p class="text-xs sm:text-[13px] text-gray-400 font-normal mt-0.5">
            Here's your overview of your blog stats.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
          <!-- Current Live Visitors Indicator -->
          <div class="flex items-center gap-2">
            <span class="relative flex h-2.5 w-2.5">
              <span
                :class="isPulsing ? 'animate-ping opacity-75' : 'opacity-0'"
                class="absolute inline-flex h-full w-full rounded-full bg-[#8CE563] transition-opacity duration-500"
              ></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8CE563]"></span>
            </span>
            <span class="text-xs sm:text-[13px] font-medium text-gray-700">Current Live Visitors:</span>
            <span class="text-xs sm:text-[13px] font-semibold text-gray-900 transition-all duration-300">
              {{ liveVisitors }}
            </span>
          </div>

          <div class="flex items-center gap-2.5">
            <!-- Create New Blog CTA Button -->
            <button
              v-if="hasPermission('canManageBlogs')"
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

            <!-- Top Header Sign Out Button -->
            <button
              @click="handleLogout"
              type="button"
              class="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 text-xs sm:text-[13px] font-medium px-4 py-2.5 rounded-full transition-colors shadow-sm"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main White Canvas Container -->
      <main class="flex-1 bg-white rounded-[28px] overflow-hidden flex flex-col min-h-[calc(100vh-7.5rem)]">
        <!-- Global Feedback / Status Banner -->
        <div
          v-if="userFeedbackMessage"
          class="m-6 sm:m-8 mb-0 px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in"
          :class="userFeedbackType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'"
        >
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="userFeedbackType === 'error' ? 'bg-red-500' : 'bg-emerald-500'"></span>
            <span>{{ userFeedbackMessage }}</span>
          </div>
          <button @click="userFeedbackMessage = ''" type="button" class="text-current font-bold ml-4 hover:opacity-75">&times;</button>
        </div>

        <!-- TAB 1: DASHBOARD (Matches reference clean white canvas) -->
        <div v-if="activeTab === 'dashboard'" class="flex-1 p-6 sm:p-8">
          <!-- Clean canvas matching reference design -->
        </div>

        <!-- TAB 2: BLOGS LIST & MANAGEMENT -->
        <div v-else-if="activeTab === 'blogs'" class="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <h2 class="text-xl font-semibold text-gray-900">Articles &amp; Blogs ({{ articles.length }})</h2>
                <!-- Filter Pills: All / Published / Drafts -->
                <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-full text-xs">
                  <button
                    @click="blogStatusFilter = 'all'"
                    type="button"
                    :class="blogStatusFilter === 'all' ? 'bg-white text-gray-900 font-semibold shadow-xs' : 'text-gray-500 hover:text-gray-900'"
                    class="px-3 py-1 rounded-full transition-all"
                  >
                    All ({{ articles.length }})
                  </button>
                  <button
                    @click="blogStatusFilter = 'published'"
                    type="button"
                    :class="blogStatusFilter === 'published' ? 'bg-white text-emerald-700 font-semibold shadow-xs' : 'text-gray-500 hover:text-gray-900'"
                    class="px-3 py-1 rounded-full transition-all flex items-center gap-1.5"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Published ({{ publishedBlogsCount }})</span>
                  </button>
                  <button
                    @click="blogStatusFilter = 'draft'"
                    type="button"
                    :class="blogStatusFilter === 'draft' ? 'bg-white text-amber-700 font-semibold shadow-xs' : 'text-gray-500 hover:text-gray-900'"
                    class="px-3 py-1 rounded-full transition-all flex items-center gap-1.5"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Drafts ({{ draftBlogsCount }})</span>
                  </button>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-1">
                Use the toggle switch on any blog to publish it to the live site or save it as an internal draft.
              </p>
            </div>
            <button
              v-if="hasPermission('canManageBlogs')"
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
                  :src="resolvePreviewUrl(item.bannerImage || item.featuredImage)"
                  :alt="item.bannerAlt || item.title"
                  class="w-24 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                />
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mb-1">
                    <span class="px-2.5 py-0.5 rounded-full bg-[#feeee6] text-[#EE5102] font-medium">
                      {{ item.category === 'Technology' ? 'Tech' : item.category }}
                    </span>
                    <span v-if="item.subCategory" class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {{ item.subCategory }}
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

              <div class="flex flex-wrap items-center gap-3 flex-shrink-0">
                <!-- Draft / Publish Toggle Switch -->
                <div class="flex items-center gap-2 bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-full">
                  <label class="relative inline-flex items-center cursor-pointer" :title="item.status === 'draft' ? 'Click to Publish' : 'Click to save as Draft'">
                    <input
                      type="checkbox"
                      :checked="item.status !== 'draft'"
                      @change="handleToggleArticlePublish(item.id)"
                      class="sr-only peer"
                    />
                    <div class="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#EE5102]"></div>
                  </label>
                  <span
                    :class="item.status === 'draft' ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'"
                    class="text-[11px] select-none"
                  >
                    {{ item.status === 'draft' ? 'Draft' : 'Published' }}
                  </span>
                </div>

                <NuxtLink
                  :to="`/blog/${item.slug}`"
                  target="_blank"
                  class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  {{ item.status === 'draft' ? 'Preview' : 'View Live' }}
                </NuxtLink>
                <button
                  v-if="hasPermission('canManageBlogs')"
                  @click="editBlog(item)"
                  type="button"
                  class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#feeee6] hover:bg-[#fcdccc] text-[#EE5102] transition-colors"
                >
                  Edit
                </button>
                <button
                  v-if="articles.length > 1 && hasPermission('canDeleteBlogs')"
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
              <!-- Publication Status Toggle -->
              <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full">
                <label class="relative inline-flex items-center cursor-pointer" :title="editorForm.status === 'draft' ? 'Switch to Published' : 'Switch to Draft'">
                  <input
                    type="checkbox"
                    :checked="editorForm.status !== 'draft'"
                    @change="editorForm.status = editorForm.status === 'draft' ? 'published' : 'draft'"
                    class="sr-only peer"
                  />
                  <div class="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
                <span
                  :class="editorForm.status === 'draft' ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'"
                  class="text-xs select-none"
                >
                  {{ editorForm.status === 'draft' ? 'Draft Mode' : 'Live / Published' }}
                </span>
              </div>

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
                {{ editorForm.status === 'draft' ? (editingArticleId ? 'Save Draft' : 'Create Draft') : (editingArticleId ? 'Update & Publish' : 'Publish Blog') }}
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

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Page Category *</label>
                  <select
                    v-model="editorForm.category"
                    @change="editorForm.subCategory = ''"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-[#EE5102]"
                  >
                    <option v-for="cat in categories" :key="cat.slug" :value="cat.name">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Sub-Category (Optional)</label>
                  <select
                    v-model="editorForm.subCategory"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-[#EE5102]"
                  >
                    <option value="">None (Main Category)</option>
                    <option
                      v-for="sub in availableSubCategoriesForEditor"
                      :key="sub.id"
                      :value="sub.name"
                    >
                      {{ sub.name }}
                    </option>
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
                    <div class="flex items-center gap-3">
                      <button
                        @click="openMediaPicker('Select Desktop Hero Banner', item => { editorForm.bannerImage = item.path; if (!editorForm.bannerAlt) editorForm.bannerAlt = item.name })"
                        type="button"
                        class="text-[11px] font-medium text-gray-600 hover:text-[#EE5102] flex items-center gap-1 hover:underline"
                      >
                        <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span>Select Media</span>
                      </button>
                      <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                        Upload File
                        <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => editorForm.bannerImage = url)" />
                      </label>
                    </div>
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
                    <div class="flex items-center gap-3">
                      <button
                        @click="openMediaPicker('Select Mobile Hero Banner', item => { editorForm.bannerImageMobile = item.path; if (!editorForm.bannerAlt) editorForm.bannerAlt = item.name })"
                        type="button"
                        class="text-[11px] font-medium text-gray-600 hover:text-[#EE5102] flex items-center gap-1 hover:underline"
                      >
                        <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span>Select Media</span>
                      </button>
                      <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                        Upload File
                        <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => editorForm.bannerImageMobile = url)" />
                      </label>
                    </div>
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
                            <div class="flex items-center gap-3">
                              <button
                                @click="openMediaPicker(`Select Section ${secIdx + 1} Desktop Image`, item => { sec.imageSrc = item.path; if (!sec.imageAlt) sec.imageAlt = item.name })"
                                type="button"
                                class="text-[11px] font-medium text-gray-600 hover:text-[#EE5102] flex items-center gap-1 hover:underline"
                              >
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                <span>Select Media</span>
                              </button>
                              <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                                Upload File
                                <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => sec.imageSrc = url)" />
                              </label>
                            </div>
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
                            <div class="flex items-center gap-3">
                              <button
                                @click="openMediaPicker(`Select Section ${secIdx + 1} Mobile Image`, item => { sec.imageMobileSrc = item.path })"
                                type="button"
                                class="text-[11px] font-medium text-gray-600 hover:text-[#EE5102] flex items-center gap-1 hover:underline"
                              >
                                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                <span>Select Media</span>
                              </button>
                              <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                                Upload File
                                <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => sec.imageMobileSrc = url)" />
                              </label>
                            </div>
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
                        <div class="bg-white p-3 rounded-xl border border-gray-100" v-html="sanitizeHtml(sec.htmlContent)"></div>
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
                    <div class="flex flex-col items-center gap-1">
                      <button
                        @click="openMediaPicker(`Select Gallery Image ${gIdx + 1}`, item => { gItem.src = item.path; if (!gItem.alt) gItem.alt = item.name })"
                        type="button"
                        class="text-[10px] font-medium text-gray-600 hover:text-[#EE5102] hover:underline"
                      >
                        Media File
                      </button>
                      <label class="block text-center cursor-pointer text-[10px] font-medium text-[#EE5102] hover:underline">
                        Upload
                        <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => gItem.src = url)" />
                      </label>
                    </div>
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
            <!-- 5. ARTICLE SEO, META DESCRIPTION, TAGS & PUBLISH FOOTER                 -->
            <!-- ======================================================================= -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-4">
              <div class="flex items-center justify-between border-b border-gray-200/80 pb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Step 5</span>
                  <h3 class="text-base font-semibold text-gray-900">SEO Page Title, Meta Description &amp; Article Tags</h3>
                </div>
                <span class="text-xs text-gray-400">Search Engine &amp; Social Graph Optimization</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="text-xs font-medium text-gray-700">SEO Page Title (Optional Override)</label>
                    <span class="text-[11px] text-gray-400">{{ (editorForm.seoTitle || editorForm.title).length }}/60 chars</span>
                  </div>
                  <input
                    v-model="editorForm.seoTitle"
                    type="text"
                    :placeholder="editorForm.title ? `${editorForm.title} — Headline Central` : 'Custom SEO Title tag...'"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1.5">Article Tags &amp; SEO Keywords</label>
                  <input
                    v-model="editorForm.tagsInput"
                    type="text"
                    placeholder="NVIDIA, GeForce 8800, Retro Tech, Hardware, PC Gaming History"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="text-xs font-medium text-gray-700">SEO Meta Description (Optional Override)</label>
                  <span class="text-[11px] text-gray-400">{{ (editorForm.metaDescription || editorForm.excerpt).length }}/160 chars</span>
                </div>
                <textarea
                  v-model="editorForm.metaDescription"
                  rows="2"
                  :placeholder="editorForm.excerpt || 'Write a concise 150-160 character meta description for search engines...'"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                ></textarea>
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
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Media Library ({{ allMediaAssets.length }})</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Click any asset to copy its path for your Hero Banner, Sections, or 12-Image Gallery.
              </p>
            </div>
            <label class="cursor-pointer inline-flex items-center gap-2 bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors shadow-sm">
              <span>{{ isUploading ? 'Uploading...' : '+ Upload Media' }}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" class="hidden" @change="handleMediaLibraryUpload" />
            </label>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="media in allMediaAssets"
              :key="media.path"
              @click="copyMediaPath(media.path)"
              class="group cursor-pointer rounded-2xl border border-gray-100 overflow-hidden hover:border-[#EE5102] transition-all"
            >
              <div class="aspect-video bg-gray-100 overflow-hidden">
                <img :src="resolvePreviewUrl(media.path)" :alt="media.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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

        <!-- TAB 4.5: CATEGORIES & SUB-CATEGORIES MANAGEMENT -->
        <div v-else-if="activeTab === 'categories'" class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Page Categories &amp; Sub-Categories ({{ categories.length }})</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Manage main website categories, navbar visibility, and nested sub-categories for filtering articles.
              </p>
            </div>
            <button
              @click="showNewCategoryForm = !showNewCategoryForm"
              type="button"
              class="inline-flex items-center gap-2 bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-medium px-4 py-2.5 rounded-full transition-colors shadow-sm"
            >
              <span>{{ showNewCategoryForm ? 'Close Form' : '+ Add Page Category' }}</span>
            </button>
          </div>

          <!-- Add / Edit Page Category Form -->
          <form
            v-if="showNewCategoryForm"
            @submit.prevent="handleSaveCategory"
            class="p-5 sm:p-6 rounded-2xl border border-orange-200 bg-orange-50/30 space-y-4 max-w-4xl"
          >
            <div class="flex items-center justify-between border-b border-orange-200/60 pb-3">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Category Configuration</span>
                <h3 class="text-base font-semibold text-gray-900">
                  {{ editingCategorySlug ? `Edit Category: ${categoryForm.name}` : 'Create New Page Category' }}
                </h3>
              </div>
              <button
                @click="resetCategoryForm"
                type="button"
                class="text-xs text-gray-400 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Category Name *</label>
                <input
                  v-model="categoryForm.name"
                  @input="!editingCategorySlug && (categoryForm.slug = slugify(categoryForm.name))"
                  type="text"
                  required
                  placeholder="e.g. Science & Space"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">URL Slug *</label>
                <input
                  v-model="categoryForm.slug"
                  type="text"
                  required
                  :disabled="Boolean(editingCategorySlug)"
                  placeholder="science-and-space"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102] disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Navigation Bar</label>
                <label class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white cursor-pointer">
                  <input
                    v-model="categoryForm.showInNavbar"
                    type="checkbox"
                    class="accent-[#EE5102] w-4 h-4 rounded"
                  />
                  <span class="text-xs font-medium text-gray-700">Display in Top Navbar</span>
                </label>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Category Page Description *</label>
                <input
                  v-model="categoryForm.description"
                  type="text"
                  required
                  placeholder="Brief editorial summary shown on the category hero banner..."
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-medium text-gray-700">Hero Banner Image Path</label>
                  <div class="flex items-center gap-3">
                    <button
                      @click="openMediaPicker('Select Category Hero Image', item => { categoryForm.image = item.path })"
                      type="button"
                      class="text-[11px] font-medium text-gray-600 hover:text-[#EE5102] flex items-center gap-1 hover:underline"
                    >
                      <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span>Select Media</span>
                    </button>
                    <label class="cursor-pointer text-[11px] font-medium text-[#EE5102] hover:underline">
                      Upload Image
                      <input type="file" accept="image/*" class="hidden" @change="e => handleFileUpload(e, url => categoryForm.image = url)" />
                    </label>
                  </div>
                </div>
                <input
                  v-model="categoryForm.image"
                  type="text"
                  placeholder="/images/tech-hero.jpg"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">SEO Page Title (Optional)</label>
                <input
                  v-model="categoryForm.seoTitle"
                  type="text"
                  :placeholder="categoryForm.name ? `${categoryForm.name} — Headline Central` : 'Custom SEO Page Title'"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">SEO Meta Description (Optional)</label>
                <input
                  v-model="categoryForm.metaDescription"
                  type="text"
                  :placeholder="categoryForm.description || 'Custom SEO meta description for search engines...'"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-2">
              <button
                @click="resetCategoryForm"
                type="button"
                class="px-4 py-2 rounded-full text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-full text-xs font-medium bg-[#EE5102] hover:bg-[#d84802] text-white shadow-sm"
              >
                {{ editingCategorySlug ? 'Update Category' : 'Save Page Category' }}
              </button>
            </div>
          </form>

          <!-- Categories & Nested Sub-Categories Cards -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div
              v-for="cat in categories"
              :key="cat.slug"
              class="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between space-y-4"
            >
              <!-- Category Header Info -->
              <div>
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3.5">
                    <img
                      :src="resolvePreviewUrl(cat.image)"
                      :alt="cat.name"
                      class="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
                    />
                    <div>
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="text-base font-semibold text-gray-900">{{ cat.name }}</h3>
                        <span class="px-2 py-0.5 rounded-full text-[11px] font-mono bg-gray-100 text-gray-600">
                          /categories/{{ cat.slug }}
                        </span>
                        <span
                          class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          :class="cat.showInNavbar !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                        >
                          {{ cat.showInNavbar !== false ? 'In Navbar' : 'Hidden from Navbar' }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ cat.description }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <NuxtLink
                      :to="cat.slug === 'news' ? '/blog' : `/categories/${cat.slug}`"
                      target="_blank"
                      class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                      View Page
                    </NuxtLink>
                    <button
                      @click="startEditCategory(cat)"
                      type="button"
                      class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#feeee6] hover:bg-[#fcdccc] text-[#EE5102] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      v-if="categories.length > 1"
                      @click="deleteCategory(cat.slug)"
                      type="button"
                      class="px-2.5 py-1 rounded-full text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <!-- Sub-Categories Management Area -->
                <div class="mt-4 pt-4 border-t border-gray-100">
                  <div class="flex items-center justify-between mb-2.5">
                    <span class="text-xs font-semibold text-gray-800">
                      Sub-Categories ({{ cat.subCategories?.length || 0 }})
                    </span>
                    <span class="text-[11px] text-gray-400">Used to filter articles inside {{ cat.name }}</span>
                  </div>

                  <!-- Existing Sub-Category Pills -->
                  <div v-if="cat.subCategories && cat.subCategories.length > 0" class="flex flex-wrap gap-2 mb-3">
                    <span
                      v-for="sub in cat.subCategories"
                      :key="sub.id"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200/70"
                    >
                      <span>{{ sub.name }}</span>
                      <button
                        @click="removeSubCategory(cat.slug, sub.id)"
                        type="button"
                        title="Remove sub-category"
                        class="text-gray-400 hover:text-red-600 font-bold leading-none ml-0.5"
                      >
                        &times;
                      </button>
                    </span>
                  </div>
                  <p v-else class="text-xs text-gray-400 italic mb-3">
                    No sub-categories added yet.
                  </p>

                  <!-- Inline Add Sub-Category Input -->
                  <div class="flex items-center gap-2">
                    <input
                      v-model="newSubCategoryInputs[cat.slug]"
                      @keydown.enter.prevent="handleAddSubCategory(cat.slug)"
                      type="text"
                      :placeholder="`Add sub-category to ${cat.name} (e.g. Reviews, Guides)...`"
                      class="flex-1 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-1.5 text-xs focus:outline-none focus:bg-white focus:border-[#EE5102]"
                    />
                    <button
                      @click="handleAddSubCategory(cat.slug)"
                      type="button"
                      class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#EE5102] hover:bg-[#d84802] text-white transition-colors flex-shrink-0"
                    >
                      + Add Sub-Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5: USER MANAGEMENT & ACCESS CONTROL -->
        <div v-else-if="activeTab === 'users'" class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">User Management &amp; Access Control ({{ managedUsers.length }})</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Add team members, assign editorial roles, and configure granular user access permissions.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2.5">
              <button
                @click="handleConnectGoogleAccount"
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-[#EE5102] bg-white text-xs font-medium text-gray-800 transition-colors shadow-sm"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z" />
                  <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 19.9 7.4 23 12 23z" />
                </svg>
                <span>{{ currentUser?.provider === 'google' ? 'Switch Google Account' : 'Sign in with Google' }}</span>
              </button>

              <button
                @click="showNotificationLogsModal = true"
                type="button"
                class="inline-flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-2 rounded-full transition-colors shadow-sm"
              >
                <svg class="w-3.5 h-3.5 text-[#EE5102]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Email Logs</span>
                <span v-if="notificationLogs.length" class="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-100 text-[#EE5102] font-semibold">{{ notificationLogs.length }}</span>
              </button>

              <button
                v-if="hasPermission('canManageUsers')"
                @click="showAddUserForm = !showAddUserForm"
                type="button"
                class="inline-flex items-center gap-2 bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                <span>{{ showAddUserForm ? 'Close Form' : '+ Add New User' }}</span>
              </button>
            </div>
          </div>

          <!-- Status / Feedback Banner -->
          <div
            v-if="userFeedbackMessage"
            class="px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-between"
            :class="userFeedbackType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'"
          >
            <span>{{ userFeedbackMessage }}</span>
            <button @click="userFeedbackMessage = ''" type="button" class="text-current font-bold ml-4">&times;</button>
          </div>

          <!-- GATEKEEPER SECURITY INCIDENTS & BLOCKED TERMINAL REQUESTS -->
          <div
            v-if="hasPermission('canManageUsers') && blockedRecords.length > 0"
            class="p-5 sm:p-6 rounded-2xl border-2 border-red-300 bg-red-50/60 space-y-4 max-w-4xl shadow-sm"
          >
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-red-200/80 pb-3.5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-red-200 text-red-950 flex items-center justify-center font-bold text-sm">
                  {{ blockedRecords.filter(r => r.status === 'blocked').length }}
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-950 flex items-center gap-2">
                    Security Gateway Lockouts &amp; Rescue Requests
                    <span
                      v-if="blockedRecords.some(r => r.status === 'blocked')"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-200 text-red-900 animate-pulse"
                    >
                      Action Required
                    </span>
                  </h3>
                  <p class="text-xs text-gray-600 mt-0.5">
                    Terminal lockout events triggered after 3 failed attempts and post-cooldown authentication failure.
                  </p>
                </div>
              </div>
              <button
                @click="handleResetAllTerminalLocks"
                type="button"
                class="px-3 py-1.5 rounded-xl border border-red-300 text-xs font-semibold text-red-950 bg-red-100 hover:bg-red-200 transition-colors"
                title="Emergency master reset of all client lockouts"
              >
                Reset All Terminal Locks
              </button>
            </div>

            <!-- List of Blocked Incident Cards -->
            <div class="space-y-3">
              <div
                v-for="rec in blockedRecords"
                :key="rec.id"
                class="p-4 rounded-xl border border-red-200 bg-white shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-bold text-gray-950">{{ rec.rescueEmail }}</span>
                    <span
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      :class="rec.status === 'blocked' ? 'bg-red-100 text-red-800 border border-red-200' : rec.status === 'whitelisted' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'"
                    >
                      {{ rec.status }}
                    </span>
                    <span class="text-[11px] text-gray-400">Date: {{ rec.timestamp ? rec.timestamp.split('T')[0] : 'Today' }}</span>
                  </div>
                  <div class="text-[11px] text-gray-500 font-mono flex flex-wrap items-center gap-3">
                    <span>IP: <strong>{{ rec.clientIp }}</strong></span>
                    <span>Attempted User: {{ rec.attemptedUsername }}</span>
                    <span>URL: {{ rec.websiteUrl }}</span>
                  </div>
                  <p v-if="rec.rescueNotes" class="text-[11px] text-gray-700 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                    Rescue Note: &ldquo;{{ rec.rescueNotes }}&rdquo;
                  </p>
                  <p v-if="rec.unblockedAt" class="text-[10px] text-emerald-700 font-medium">
                    Cleared on {{ rec.unblockedAt.split('T')[0] }} by {{ rec.unblockedBy || 'Administrator' }}
                  </p>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <button
                    v-if="rec.status === 'blocked'"
                    @click="handleAdminUnblock(rec)"
                    type="button"
                    class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-sm"
                  >
                    Unblock Email
                  </button>
                  <button
                    v-if="rec.status !== 'whitelisted'"
                    @click="handleAdminWhitelist(rec)"
                    type="button"
                    class="px-3.5 py-1.5 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold transition-colors"
                  >
                    Whitelist IP
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- PENDING ACCOUNT APPROVALS QUEUE (Google & Email Registration Requests) -->
          <div
            v-if="hasPermission('canManageUsers') && pendingUsers.length > 0"
            class="p-5 sm:p-6 rounded-2xl border-2 border-amber-300 bg-amber-50/50 space-y-4 max-w-4xl shadow-sm"
          >
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3.5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm">
                  {{ pendingUsers.length }}
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-950 flex items-center gap-2">
                    Pending Account Approvals
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-200 text-amber-900">
                      Approval Required
                    </span>
                  </h3>
                  <p class="text-xs text-gray-600 mt-0.5">
                    Newly registered Google and Email sign-ups. Approving activates access and dispatches a push notification email to the user.
                  </p>
                </div>
              </div>
              <button
                @click="handleSyncUsers"
                :disabled="isSyncingUsers"
                type="button"
                class="px-3.5 py-1.5 rounded-xl border border-amber-300 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg v-if="isSyncingUsers" class="animate-spin w-3.5 h-3.5 text-amber-900" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span v-else>&#8635;</span>
                {{ isSyncingUsers ? 'Syncing...' : 'Sync Cloud' }}
              </button>
            </div>

            <!-- List of Pending Account Cards -->
            <div class="space-y-4">
              <div
                v-for="pu in pendingUsers"
                :key="pu.uid"
                class="p-5 rounded-2xl border border-amber-200/90 bg-white shadow-sm space-y-4"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="flex items-center gap-3.5">
                    <img
                      :src="pu.photoURL || useAsset('/images/author-marcus.jpg')"
                      :alt="pu.displayName"
                      class="w-11 h-11 rounded-full object-cover border-2 border-amber-200 flex-shrink-0"
                    />
                    <div>
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="text-sm font-semibold text-gray-900">{{ pu.displayName }}</span>
                        <span
                          class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                          :class="pu.provider === 'google' ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'bg-gray-100 text-gray-700'"
                        >
                          {{ pu.provider === 'google' ? 'Google Sign-In Registration' : 'Email Sign-Up Request' }}
                        </span>
                        <span class="text-[11px] text-gray-400">Registered: {{ pu.createdAt }}</span>
                      </div>
                      <p class="text-xs text-gray-500 font-mono mt-0.5">{{ pu.email }}</p>
                      <p v-if="pu.registrationNotes" class="text-xs text-gray-600 italic mt-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        Registration Note: &ldquo;{{ pu.registrationNotes }}&rdquo;
                      </p>
                    </div>
                  </div>

                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                    Awaiting Access Assignment
                  </span>
                </div>

                <!-- Granular User Access Assignment Panel (Admin Configures Before Approval) -->
                <div class="bg-amber-50/40 rounded-xl p-4 border border-amber-200/70 space-y-3">
                  <div class="flex flex-wrap items-center justify-between gap-2.5 border-b border-amber-200/60 pb-2.5">
                    <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <svg class="w-3.5 h-3.5 text-[#EE5102]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Assign User Access Level &amp; Permissions
                    </span>

                    <div class="flex items-center gap-2">
                      <label class="text-xs font-medium text-gray-600">Role Preset:</label>
                      <select
                        :value="getPendingAccess(pu.uid).roleKey"
                        @change="handlePendingRoleChange(pu.uid, ($event.target as HTMLSelectElement).value as CmsRoleKey)"
                        class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#EE5102]"
                      >
                        <option value="editor">Senior Editor (Blogs, Categories, Media)</option>
                        <option value="author">Contributor / Writer (Create &amp; Edit Blogs)</option>
                        <option value="viewer">Analyst (Read-Only)</option>
                        <option value="admin">Administrator (Full Access)</option>
                      </select>
                    </div>
                  </div>

                  <!-- 6 Access Control Checkboxes -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    <label class="flex items-center gap-2 text-xs text-gray-700 p-2.5 rounded-lg bg-white border border-gray-200 cursor-pointer hover:border-[#EE5102] transition-colors">
                      <input
                        v-model="getPendingAccess(pu.uid).permissions.canManageBlogs"
                        type="checkbox"
                        class="accent-[#EE5102] w-4 h-4 rounded"
                      />
                      <div>
                        <span class="font-medium block text-gray-900">Create &amp; Edit Blogs</span>
                        <span class="text-[10px] text-gray-400">Write and publish articles</span>
                      </div>
                    </label>

                    <label class="flex items-center gap-2 text-xs text-gray-700 p-2.5 rounded-lg bg-white border border-gray-200 cursor-pointer hover:border-[#EE5102] transition-colors">
                      <input
                        v-model="getPendingAccess(pu.uid).permissions.canDeleteBlogs"
                        type="checkbox"
                        class="accent-[#EE5102] w-4 h-4 rounded"
                      />
                      <div>
                        <span class="font-medium block text-gray-900">Delete Blogs</span>
                        <span class="text-[10px] text-gray-400">Permanently remove articles</span>
                      </div>
                    </label>

                    <label class="flex items-center gap-2 text-xs text-gray-700 p-2.5 rounded-lg bg-white border border-gray-200 cursor-pointer hover:border-[#EE5102] transition-colors">
                      <input
                        v-model="getPendingAccess(pu.uid).permissions.canManageCategories"
                        type="checkbox"
                        class="accent-[#EE5102] w-4 h-4 rounded"
                      />
                      <div>
                        <span class="font-medium block text-gray-900">Manage Categories</span>
                        <span class="text-[10px] text-gray-400">Add &amp; edit sub-categories</span>
                      </div>
                    </label>

                    <label class="flex items-center gap-2 text-xs text-gray-700 p-2.5 rounded-lg bg-white border border-gray-200 cursor-pointer hover:border-[#EE5102] transition-colors">
                      <input
                        v-model="getPendingAccess(pu.uid).permissions.canManageMedia"
                        type="checkbox"
                        class="accent-[#EE5102] w-4 h-4 rounded"
                      />
                      <div>
                        <span class="font-medium block text-gray-900">Media Library Access</span>
                        <span class="text-[10px] text-gray-400">Upload &amp; browse images</span>
                      </div>
                    </label>

                    <label class="flex items-center gap-2 text-xs text-gray-700 p-2.5 rounded-lg bg-white border border-gray-200 cursor-pointer hover:border-[#EE5102] transition-colors">
                      <input
                        v-model="getPendingAccess(pu.uid).permissions.canManageUsers"
                        type="checkbox"
                        class="accent-[#EE5102] w-4 h-4 rounded"
                      />
                      <div>
                        <span class="font-medium block text-gray-900">User Control Access</span>
                        <span class="text-[10px] text-gray-400">Approve &amp; manage accounts</span>
                      </div>
                    </label>

                    <label class="flex items-center gap-2 text-xs text-gray-700 p-2.5 rounded-lg bg-white border border-gray-200 cursor-pointer hover:border-[#EE5102] transition-colors">
                      <input
                        v-model="getPendingAccess(pu.uid).permissions.canManageSettings"
                        type="checkbox"
                        class="accent-[#EE5102] w-4 h-4 rounded"
                      />
                      <div>
                        <span class="font-medium block text-gray-900">CMS Settings</span>
                        <span class="text-[10px] text-gray-400">SEO &amp; tracking configurations</span>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Action Footer -->
                <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  <span class="text-xs text-gray-500">
                    Will activate with <strong>{{ ROLE_LABELS[getPendingAccess(pu.uid).roleKey] }}</strong> role &amp; dispatch activation push email.
                  </span>

                  <div class="flex items-center gap-2 ml-auto">
                    <button
                      @click="handleRejectUser(pu)"
                      type="button"
                      class="px-4 py-2 rounded-full text-xs font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-colors"
                    >
                      Decline Request
                    </button>

                    <button
                      @click="handleApproveUser(pu)"
                      :disabled="approvingUserId === pu.uid"
                      type="button"
                      class="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm disabled:opacity-50"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{{ approvingUserId === pu.uid ? 'Activating & Sending Email...' : 'Approve & Activate Account' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PENDING QUEUE STATUS WHEN 0 PENDING REQUESTS -->
          <div
            v-else-if="hasPermission('canManageUsers')"
            class="p-4 rounded-2xl border border-gray-200/90 bg-white/80 flex flex-wrap items-center justify-between gap-3 max-w-4xl shadow-sm text-xs text-gray-600"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span><strong>Account Approvals:</strong> No pending sign-ups awaiting approval. Real-time cloud sync active.</span>
            </div>
            <button
              @click="handleSyncUsers"
              :disabled="isSyncingUsers"
              type="button"
              class="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium text-gray-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <svg v-if="isSyncingUsers" class="animate-spin w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span v-else>&#8635;</span>
              {{ isSyncingUsers ? 'Checking Cloud...' : 'Check for New Registrations' }}
            </button>
          </div>

          <!-- ADD NEW USER & ACCESS CONTROL FORM (Admin Only) -->
          <form
            v-if="showAddUserForm && hasPermission('canManageUsers')"
            @submit.prevent="handleCreateNewUser"
            class="p-5 sm:p-6 rounded-2xl border border-orange-200 bg-orange-50/30 space-y-5 max-w-4xl"
          >
            <div class="flex items-center justify-between border-b border-orange-200/60 pb-3">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Admin User Provisioning</span>
                <h3 class="text-base font-semibold text-gray-900">Add New CMS User &amp; Configure Access Control</h3>
              </div>
              <button
                @click="showAddUserForm = false"
                type="button"
                class="text-xs text-gray-400 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input
                  v-model="newUserForm.displayName"
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Email Address (Google SSO / Login) *</label>
                <input
                  v-model="newUserForm.email"
                  type="email"
                  required
                  placeholder="sarah@headlinecentral.co.za"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">User Role *</label>
                <select
                  v-model="newUserForm.roleKey"
                  @change="applyRolePresetToNewUser(newUserForm.roleKey)"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                >
                  <option value="admin">Master Admin (Full Access)</option>
                  <option value="editor">Senior Editor (Blogs, Categories, Media)</option>
                  <option value="author">Contributor / Author (Create &amp; Edit Blogs)</option>
                  <option value="viewer">Read-Only Viewer</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Sign-In Method *</label>
                <select
                  v-model="newUserForm.provider"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                >
                  <option value="both">Google Single Sign-On (SSO) + Password</option>
                  <option value="google">Google Single Sign-On (SSO) Only</option>
                  <option value="email">Email &amp; Password Only</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">Environment Target *</label>
                <select
                  v-model="newUserForm.environment"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                >
                  <option value="live">Live &amp; Local Environment (Cloud Synced)</option>
                  <option value="local">Local Environment Only</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">
                  {{ newUserForm.provider === 'google' ? 'Login Password (Optional for Google SSO)' : 'Login Password *' }}
                </label>
                <input
                  v-model="newUserForm.password"
                  type="password"
                  :required="newUserForm.provider !== 'google'"
                  minlength="6"
                  :placeholder="newUserForm.provider === 'google' ? 'Optional backup password' : 'Min. 6 characters'"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
                />
              </div>
            </div>

            <!-- Granular User Control Access Checkboxes -->
            <div class="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-800">User Control Access Permissions</span>
                <span class="text-[11px] text-gray-400">Customize what this user can view and modify in the CMS</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <input v-model="newUserForm.permissions.canManageBlogs" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                  <div>
                    <span class="block text-xs font-medium text-gray-800">Create &amp; Edit Blogs</span>
                    <span class="block text-[11px] text-gray-400">Publish and edit blog articles</span>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <input v-model="newUserForm.permissions.canDeleteBlogs" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                  <div>
                    <span class="block text-xs font-medium text-gray-800">Delete Blogs</span>
                    <span class="block text-[11px] text-gray-400">Remove published blog posts</span>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <input v-model="newUserForm.permissions.canManageCategories" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                  <div>
                    <span class="block text-xs font-medium text-gray-800">Manage Categories</span>
                    <span class="block text-[11px] text-gray-400">Add/edit categories &amp; sub-categories</span>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <input v-model="newUserForm.permissions.canManageMedia" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                  <div>
                    <span class="block text-xs font-medium text-gray-800">Media Library Access</span>
                    <span class="block text-[11px] text-gray-400">Upload and browse media files</span>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <input v-model="newUserForm.permissions.canManageUsers" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                  <div>
                    <span class="block text-xs font-medium text-gray-800">User Management (Admin)</span>
                    <span class="block text-[11px] text-gray-400">Add users &amp; modify access control</span>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <input v-model="newUserForm.permissions.canManageSettings" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                  <div>
                    <span class="block text-xs font-medium text-gray-800">CMS Settings</span>
                    <span class="block text-[11px] text-gray-400">Customize profile &amp; display settings</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2.5">
              <button
                @click="showAddUserForm = false"
                type="button"
                class="px-4 py-2 rounded-full text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-full text-xs font-medium bg-[#EE5102] hover:bg-[#d84802] text-white shadow-sm"
              >
                Create User Account
              </button>
            </div>
          </form>

          <!-- Managed Users List & Access Control Cards -->
          <div class="space-y-4 max-w-4xl">
            <div class="flex items-center justify-between pb-1">
              <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Active Editorial Team ({{ activeUsers.length }})
              </h3>
            </div>
            <div
              v-for="u in activeUsers"
              :key="u.uid"
              class="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-4"
            >
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <img
                    :src="u.photoURL || useAsset('/images/author-marcus.jpg')"
                    :alt="u.displayName"
                    class="w-11 h-11 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="text-sm font-semibold text-gray-900">{{ u.displayName }}</p>
                      <span
                        class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                        :class="u.roleKey === 'admin' ? 'bg-[#feeee6] text-[#EE5102]' : 'bg-gray-100 text-gray-700'"
                      >
                        {{ u.role }}
                      </span>
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        :class="u.environment !== 'local' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'"
                      >
                        {{ u.environment !== 'local' ? 'Live & Local' : 'Local Only' }}
                      </span>
                      <span
                        v-if="!u.isMaster && (u.provider === 'google' || u.provider === 'both')"
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60"
                      >
                        Google OAuth Enabled
                      </span>
                      <span
                        v-else-if="u.isMaster"
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        Master Password Only
                      </span>
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        :class="u.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'"
                      >
                        {{ u.active !== false ? 'Active' : 'Suspended' }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-400 mt-0.5">{{ u.email }}</p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div v-if="hasPermission('canManageUsers')" class="flex items-center gap-2">
                  <button
                    @click="toggleEditUserAccess(u)"
                    type="button"
                    class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#feeee6] hover:bg-[#fcdccc] text-[#EE5102] transition-colors"
                  >
                    {{ editingUserId === u.uid ? 'Close Access Panel' : 'Access Control & Role' }}
                  </button>
                  <button
                    v-if="u.email.toLowerCase() !== 'admin@headlinecentral.co.za'"
                    @click="handleToggleUserActive(u)"
                    type="button"
                    class="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    {{ u.active !== false ? 'Suspend' : 'Activate' }}
                  </button>
                  <button
                    v-if="u.email.toLowerCase() !== 'admin@headlinecentral.co.za'"
                    @click="handleRemoveUser(u)"
                    type="button"
                    class="px-3 py-1.5 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <!-- Permission Badges Summary -->
              <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                <span class="text-[11px] text-gray-400 mr-1">Access:</span>
                <span v-if="u.permissions?.canManageBlogs" class="px-2.5 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700">Create/Edit Blogs</span>
                <span v-if="u.permissions?.canDeleteBlogs" class="px-2.5 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700">Delete Blogs</span>
                <span v-if="u.permissions?.canManageCategories" class="px-2.5 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700">Categories &amp; Sub-Categories</span>
                <span v-if="u.permissions?.canManageMedia" class="px-2.5 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700">Media Library</span>
                <span v-if="u.permissions?.canManageUsers" class="px-2.5 py-0.5 rounded-full text-[11px] bg-orange-50 text-[#EE5102] font-medium">User Admin</span>
                <span v-if="u.permissions?.canManageSettings" class="px-2.5 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700">Settings</span>
              </div>

              <!-- MASTER ADMIN RADIO TOGGLE: USER MANAGEMENT IN NAVBAR -->
              <div
                v-if="isMasterAdmin && !u.isMaster && u.email.toLowerCase() !== 'admin@headlinecentral.co.za'"
                class="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/80 -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-slate-100"
              >
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white">
                    Master Admin Control
                  </span>
                  <span class="font-semibold text-gray-800">User Management Tab in Navbar:</span>
                </div>

                <div class="inline-flex items-center p-1 rounded-xl bg-white border border-gray-200 shadow-sm">
                  <label
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs font-semibold select-none"
                    :class="u.permissions?.canManageUsers ? 'bg-[#EE5102] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                  >
                    <input
                      type="radio"
                      :name="'user-nav-' + u.uid"
                      :value="true"
                      :checked="Boolean(u.permissions?.canManageUsers)"
                      :disabled="isUpdatingUserNav === u.uid"
                      @change="handleSetUserNavAccess(u, true)"
                      class="sr-only"
                    />
                    <span class="w-2 h-2 rounded-full" :class="u.permissions?.canManageUsers ? 'bg-white' : 'bg-gray-400'"></span>
                    <span>Show in Navbar</span>
                  </label>

                  <label
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-xs font-semibold select-none"
                    :class="!u.permissions?.canManageUsers ? 'bg-slate-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                  >
                    <input
                      type="radio"
                      :name="'user-nav-' + u.uid"
                      :value="false"
                      :checked="!u.permissions?.canManageUsers"
                      :disabled="isUpdatingUserNav === u.uid"
                      @change="handleSetUserNavAccess(u, false)"
                      class="sr-only"
                    />
                    <span class="w-2 h-2 rounded-full" :class="!u.permissions?.canManageUsers ? 'bg-white' : 'bg-gray-400'"></span>
                    <span>Hide from Navbar</span>
                  </label>
                </div>
              </div>

              <!-- Inline Edit Role & User Control Access Drawer -->
              <div
                v-if="editingUserId === u.uid"
                class="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-4 mt-3"
              >
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      v-model="editUserForm.displayName"
                      type="text"
                      class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Assigned Role</label>
                    <select
                      v-model="editUserForm.roleKey"
                      @change="applyRolePresetToEditUser(editUserForm.roleKey)"
                      :disabled="u.email.toLowerCase() === 'admin@headlinecentral.co.za'"
                      class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102] disabled:bg-gray-100"
                    >
                      <option value="admin">Master Admin</option>
                      <option value="editor">Senior Editor</option>
                      <option value="author">Contributor / Author</option>
                      <option value="viewer">Read-Only Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Reset Password (Optional)</label>
                    <input
                      v-model="editUserForm.newPassword"
                      type="password"
                      placeholder="Leave blank to keep current"
                      class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                    />
                  </div>
                </div>

                <div>
                  <span class="block text-xs font-semibold text-gray-800 mb-2">Granular Access Control</span>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <label class="flex items-center gap-2 text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200/80 cursor-pointer">
                      <input v-model="editUserForm.permissions.canManageBlogs" type="checkbox" class="accent-[#EE5102]" />
                      <span>Create &amp; Edit Blogs</span>
                    </label>
                    <label class="flex items-center gap-2 text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200/80 cursor-pointer">
                      <input v-model="editUserForm.permissions.canDeleteBlogs" type="checkbox" class="accent-[#EE5102]" />
                      <span>Delete Blogs</span>
                    </label>
                    <label class="flex items-center gap-2 text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200/80 cursor-pointer">
                      <input v-model="editUserForm.permissions.canManageCategories" type="checkbox" class="accent-[#EE5102]" />
                      <span>Manage Categories</span>
                    </label>
                    <label class="flex items-center gap-2 text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200/80 cursor-pointer">
                      <input v-model="editUserForm.permissions.canManageMedia" type="checkbox" class="accent-[#EE5102]" />
                      <span>Manage Media</span>
                    </label>
                    <label class="flex items-center gap-2 text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200/80 cursor-pointer">
                      <input
                        v-model="editUserForm.permissions.canManageUsers"
                        :disabled="u.email.toLowerCase() === 'admin@headlinecentral.co.za'"
                        type="checkbox"
                        class="accent-[#EE5102]"
                      />
                      <span>Manage Users</span>
                    </label>
                    <label class="flex items-center gap-2 text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200/80 cursor-pointer">
                      <input v-model="editUserForm.permissions.canManageSettings" type="checkbox" class="accent-[#EE5102]" />
                      <span>Manage Settings</span>
                    </label>
                  </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2">
                  <button
                    @click="editingUserId = null"
                    type="button"
                    class="px-3.5 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    @click="handleSaveEditedUser(u.uid)"
                    type="button"
                    class="px-4 py-1.5 rounded-full text-xs font-medium bg-[#EE5102] hover:bg-[#d84802] text-white"
                  >
                    Save Role &amp; Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5.5: SEO, GOOGLE TAG MANAGER (GA4) & META PIXEL -->
        <div v-else-if="activeTab === 'seo'" class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">SEO, Google Tag Manager (GA4) &amp; Meta Pixel</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Configure Google Tag Manager, GA4 Measurement ID, Meta Pixel tracking, and page-level SEO titles &amp; meta descriptions.
              </p>
            </div>
            <span
              v-if="seoSavedMessage"
              class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              {{ seoSavedMessage }}
            </span>
          </div>

          <!-- 1. GOOGLE TAG MANAGER, GA4 & META PIXEL TRACKING CONFIGURATION -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-5 max-w-5xl">
            <div class="flex items-center justify-between border-b border-gray-200/80 pb-3">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Analytics &amp; Conversion Pixels</span>
                <h3 class="text-base font-semibold text-gray-900">Google Tag Manager, GA4 &amp; Meta Pixel</h3>
              </div>
              <button
                @click="handleSaveTrackingConfig"
                type="button"
                class="px-4 py-2 rounded-full text-xs font-medium bg-[#EE5102] hover:bg-[#d84802] text-white transition-colors shadow-sm"
              >
                Save Tracking Settings
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <!-- Google Tag Manager (GTM) -->
              <div class="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-semibold text-gray-900 block">Google Tag Manager</span>
                    <span class="text-[11px] text-gray-400">Container ID (GTM-XXXXXXX)</span>
                  </div>
                  <label class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                    <input v-model="trackingConfig.enableGtm" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                    <span>Active</span>
                  </label>
                </div>
                <input
                  v-model="trackingConfig.gtmId"
                  type="text"
                  placeholder="GTM-XXXXXXX"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#EE5102]"
                />
                <p class="text-[11px] text-gray-400">
                  Injects GTM head script &amp; noscript container and pushes virtual <code class="text-gray-600">page_view</code> events on route navigation.
                </p>
              </div>

              <!-- Google Analytics 4 (GA4) -->
              <div class="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-semibold text-gray-900 block">Google Analytics 4 (GA4)</span>
                    <span class="text-[11px] text-gray-400">Measurement ID (G-XXXXXXXXXX)</span>
                  </div>
                  <label class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                    <input v-model="trackingConfig.enableGa4" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                    <span>Active</span>
                  </label>
                </div>
                <input
                  v-model="trackingConfig.ga4Id"
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#EE5102]"
                />
                <p class="text-[11px] text-gray-400">
                  Loads <code class="text-gray-600">gtag.js</code> and tracks real-time pageviews &amp; reader engagement across all public pages.
                </p>
              </div>

              <!-- Meta Pixel (Facebook Pixel) -->
              <div class="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-semibold text-gray-900 block">Meta Pixel</span>
                    <span class="text-[11px] text-gray-400">Dataset / Pixel ID (Numeric)</span>
                  </div>
                  <label class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                    <input v-model="trackingConfig.enableMetaPixel" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                    <span>Active</span>
                  </label>
                </div>
                <input
                  v-model="trackingConfig.metaPixelId"
                  type="text"
                  placeholder="123456789012345"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#EE5102]"
                />
                <p class="text-[11px] text-gray-400">
                  Initializes <code class="text-gray-600">fbevents.js</code> and fires <code class="text-gray-600">fbq('track', 'PageView')</code> on every page visit.
                </p>
              </div>

              <!-- Google AdSense -->
              <div class="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-semibold text-gray-900 block">Google AdSense</span>
                    <span class="text-[11px] text-gray-400">Publisher ID (ca-pub-...)</span>
                  </div>
                  <label class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                    <input v-model="trackingConfig.enableAdsense" type="checkbox" class="accent-[#EE5102] w-4 h-4" />
                    <span>Active</span>
                  </label>
                </div>
                <input
                  v-model="trackingConfig.adsensePublisherId"
                  type="text"
                  placeholder="ca-pub-1234567890123456"
                  class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#EE5102]"
                />
                <p class="text-[11px] text-gray-400">
                  Injects verification script &amp; <code class="text-gray-600">&lt;meta name="google-adsense-account"&gt;</code> into <code class="text-gray-600">&lt;head&gt;</code> for approval.
                </p>
              </div>
            </div>
          </div>

          <!-- 2. PAGE-LEVEL SEO (PAGE TITLES, META DESCRIPTIONS & KEYWORDS) -->
          <div class="space-y-4 max-w-5xl">
            <div>
              <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Search Engine Optimization</span>
              <h3 class="text-base font-semibold text-gray-900">Website Page Titles &amp; Meta Descriptions</h3>
              <p class="text-xs text-gray-400">
                Customize the title tag, meta description, keywords, and social share image for every core page on Headline Central.
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div
                v-for="pageEntry in Object.values(pagesSeo)"
                :key="pageEntry.key"
                class="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-4"
              >
                <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div class="flex items-center gap-2.5">
                    <span class="text-sm font-semibold text-gray-900">{{ pageEntry.label }}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-gray-100 text-gray-600">
                      {{ pageEntry.path }}
                    </span>
                  </div>
                  <button
                    @click="handleSavePageSeo(pageEntry.key)"
                    type="button"
                    class="px-4 py-1.5 rounded-full text-xs font-medium bg-[#feeee6] hover:bg-[#EE5102] text-[#EE5102] hover:text-white transition-colors"
                  >
                    Save Page SEO
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="text-xs font-medium text-gray-700">Page Title Tag *</label>
                      <span class="text-[11px] text-gray-400">{{ pageEntry.title.length }}/60 chars</span>
                    </div>
                    <input
                      v-model="pageEntry.title"
                      type="text"
                      class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Meta Keywords</label>
                    <input
                      v-model="pageEntry.keywords"
                      type="text"
                      class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                    />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-xs font-medium text-gray-700">Meta Description *</label>
                    <span class="text-[11px] text-gray-400">{{ pageEntry.description.length }}/160 chars</span>
                  </div>
                  <textarea
                    v-model="pageEntry.description"
                    rows="2"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5.5: TRENDING NOW BANNER MANAGEMENT -->
        <div v-else-if="activeTab === 'trending'" class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="inline-block w-2 h-2 rounded-full bg-[#EE5102] animate-pulse"></span>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Top Announcement Bar</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900">Trending Now Management</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Update the live breaking alert and trending story ticker that appears above the main navigation across the entire website.
              </p>
            </div>
            <div class="flex items-center gap-2.5">
              <button
                @click="resetTrendingBarToDefaults"
                type="button"
                class="px-3.5 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Reset to Defaults
              </button>
              <button
                @click="handleSaveTrending"
                :disabled="isSavingTrending"
                type="button"
                class="px-5 py-2 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <svg v-if="isSavingTrending" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ isSavingTrending ? 'Saving Changes...' : 'Save Trending Now' }}</span>
              </button>
            </div>
          </div>

          <!-- Section 1: Live Visual Preview Card -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-3.5 max-w-5xl shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Realtime Preview</span>
                <h3 class="text-sm font-semibold text-gray-900">Live Website Announcement Banner</h3>
              </div>
              <span
                :class="headerFooterConfig.trendingBar.isVisible !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
                class="text-[11px] px-3 py-1 rounded-full border font-medium flex items-center gap-1.5"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="headerFooterConfig.trendingBar.isVisible !== false ? 'bg-emerald-500' : 'bg-amber-400'"
                ></span>
                {{ headerFooterConfig.trendingBar.isVisible !== false ? 'Visible on Public Site' : 'Hidden from Public Site' }}
              </span>
            </div>

            <!-- Simulated Browser Bar -->
            <div class="rounded-xl overflow-hidden border border-gray-300 shadow-inner">
              <div class="bg-[#2B2A2E] px-4 py-2 border-b border-[#3E3D42] flex items-center gap-2">
                <div class="flex items-center gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div class="flex-1 text-center">
                  <span class="text-[11px] text-gray-400 font-mono">headlinecentral.co.za</span>
                </div>
              </div>
              <!-- Simulated TrendingToolbar.vue -->
              <div
                v-if="headerFooterConfig.trendingBar.isVisible !== false"
                class="bg-[#414045] text-white text-xs py-2.5 px-4 transition-all"
              >
                <div class="max-w-[1600px] mx-auto flex items-center justify-center space-x-2 text-center">
                  <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#EE5102] flex-shrink-0 animate-pulse"></span>
                  <span class="text-[#9ca3af] font-normal">{{ headerFooterConfig.trendingBar.label || 'Trending now:' }}</span>
                  <a
                    :href="headerFooterConfig.trendingBar.link || '/blog'"
                    @click.prevent
                    class="text-white font-normal hover:text-[#EE5102] transition-colors truncate max-w-xl underline decoration-[#EE5102]/60 hover:decoration-[#EE5102]"
                  >
                    {{ headerFooterConfig.trendingBar.text || 'Welcome to Headline Central — Essential Stories & Investigative Digital Journalism.' }}
                  </a>
                </div>
              </div>
              <div v-else class="bg-gray-100 py-3 text-center text-xs text-gray-500 font-medium">
                (The Trending Now bar is currently toggled OFF and will not display to website visitors)
              </div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-gray-500 pt-1">
              <span>Target link destination: <code class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">{{ headerFooterConfig.trendingBar.link || '/blog' }}</code></span>
              <span class="text-gray-400">Updates live when saved</span>
            </div>
          </div>

          <!-- Section 2: Banner Settings Form -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-5 max-w-5xl shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Configuration</span>
                <h3 class="text-base font-semibold text-gray-900">Headline, Label &amp; Destination Link</h3>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="headerFooterConfig.trendingBar.isVisible"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EE5102]"></div>
                <span class="ml-2.5 text-xs font-medium text-gray-700 select-none">
                  {{ headerFooterConfig.trendingBar.isVisible !== false ? 'Enabled' : 'Disabled' }}
                </span>
              </label>
            </div>

            <!-- Prefix Badge Presets -->
            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-700">Quick Badge Presets</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="preset in ['Trending now:', 'Breaking News:', 'Special Report:', 'Editor’s Pick:', 'Just In:', 'Market Alert:']"
                  :key="preset"
                  @click="headerFooterConfig.trendingBar.label = preset"
                  type="button"
                  :class="headerFooterConfig.trendingBar.label === preset ? 'bg-[#EE5102] text-white border-[#EE5102]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
                  class="px-3 py-1 rounded-full border text-xs font-medium transition-colors"
                >
                  {{ preset }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div class="md:col-span-1">
                <label class="block font-medium text-gray-700 mb-1">Prefix Badge Label</label>
                <input
                  v-model="headerFooterConfig.trendingBar.label"
                  type="text"
                  placeholder="e.g. Trending now:"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#EE5102]"
                />
                <p class="text-[10px] text-gray-400 mt-1">Appears in gray before the clickable headline.</p>
              </div>

              <div class="md:col-span-2">
                <label class="block font-medium text-gray-700 mb-1">Target Link Destination URL</label>
                <input
                  v-model="headerFooterConfig.trendingBar.link"
                  type="text"
                  placeholder="e.g. /blog or /blog/my-headline-story"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#EE5102]"
                />
                <p class="text-[10px] text-gray-400 mt-1">Destination when a reader clicks anywhere on the trending banner.</p>
              </div>

              <div class="md:col-span-3">
                <label class="block font-medium text-gray-700 mb-1">
                  Headline Announcement Text
                  <span class="text-gray-400 font-normal">({{ (headerFooterConfig.trendingBar.text || '').length }} characters)</span>
                </label>
                <textarea
                  v-model="headerFooterConfig.trendingBar.text"
                  rows="2"
                  placeholder="Enter the main headline or breaking news statement..."
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#EE5102]"
                ></textarea>
                <p class="text-[10px] text-gray-400 mt-1">Keep headline concise (under 120 characters) for optimal desktop and mobile visibility.</p>
              </div>
            </div>
          </div>

          <!-- Section 3: Quick Select from Published Articles -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-4 max-w-5xl shadow-sm">
            <div class="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Quick Fill</span>
                <h3 class="text-base font-semibold text-gray-900">Feature a Published Blog Article</h3>
                <p class="text-xs text-gray-400 mt-0.5">Click any published blog below to instantly set its title and URL into the Trending banner.</p>
              </div>
              <span class="text-xs text-gray-500 font-medium">{{ articles.length }} articles available</span>
            </div>

            <div v-if="articles && articles.length > 0" class="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              <div
                v-for="art in articles"
                :key="art.id"
                class="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/80 px-2 rounded-xl transition-colors"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img
                      v-if="art.featuredImage"
                      :src="art.featuredImage"
                      :alt="art.title"
                      class="w-full h-full object-cover"
                      @error="(e: any) => { e.target.style.display = 'none' }"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                      HC
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-xs font-medium text-gray-900 truncate">{{ art.title }}</h4>
                    <div class="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                      <span class="font-medium text-[#EE5102]">{{ art.category }}</span>
                      <span>&bull;</span>
                      <span>{{ art.publishedAt || 'Recent' }}</span>
                      <span v-if="art.isPopular" class="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-semibold">Popular</span>
                    </div>
                  </div>
                </div>

                <button
                  @click="handleApplyArticleToTrending(art)"
                  type="button"
                  class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-white hover:bg-[#EE5102] hover:border-[#EE5102] text-xs font-medium transition-colors flex-shrink-0"
                >
                  Feature in Trending
                </button>
              </div>
            </div>
            <div v-else class="text-center py-6 text-xs text-gray-400">
              No published articles found yet. You can still type custom headline text and destination URL above.
            </div>
          </div>
        </div>

        <!-- TAB 5.6: HEADER & FOOTER NAVIGATION & CONTENT -->
        <div v-else-if="activeTab === 'header-footer'" class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Header &amp; Footer Management</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Configure main navigation menu links, dropdown categories, trending alert ticker, and global footer branding.
              </p>
            </div>
            <div class="flex items-center gap-2.5">
              <button
                @click="resetHeaderFooterToDefaults"
                type="button"
                class="px-3.5 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Reset to Defaults
              </button>
              <button
                @click="handleSaveHeaderFooter"
                :disabled="isSavingHeaderFooter"
                type="button"
                class="px-5 py-2 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <svg v-if="isSavingHeaderFooter" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ isSavingHeaderFooter ? 'Saving Changes...' : 'Save Header &amp; Footer' }}</span>
              </button>
            </div>
          </div>

          <!-- Section 1: Navigation Menu Items -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-5 max-w-5xl shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Header Navigation</span>
                <h3 class="text-base font-semibold text-gray-900">Navbar Menu Items</h3>
                <p class="text-xs text-gray-400 mt-0.5">Control the links that appear in the top website header and mobile drawer.</p>
              </div>
              <button
                @click="handleAddNavItem"
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-medium transition-colors shadow-sm"
              >
                <span>+ Add Menu Item</span>
              </button>
            </div>

            <!-- Items Table/List -->
            <div class="space-y-3">
              <div
                v-for="(item, idx) in headerFooterConfig.navItems"
                :key="item.id || idx"
                class="p-4 rounded-xl border border-gray-200/90 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3 hover:border-gray-300 transition-colors"
              >
                <div class="flex items-center gap-3 flex-1 min-w-[260px]">
                  <span class="w-6 h-6 rounded-full bg-gray-200 text-gray-700 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label class="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Label</label>
                      <input
                        v-model="item.label"
                        type="text"
                        placeholder="e.g. Technology"
                        class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#EE5102]"
                      />
                    </div>
                    <div>
                      <label class="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Target URL</label>
                      <input
                        v-model="item.to"
                        type="text"
                        placeholder="e.g. /categories/technology"
                        class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#EE5102]"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2.5 flex-wrap">
                  <!-- External Link toggle -->
                  <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
                    <input
                      v-model="item.isExternal"
                      type="checkbox"
                      class="accent-[#EE5102] rounded"
                    />
                    <span class="text-[11px]">Open New Tab</span>
                  </label>

                  <!-- Visibility toggle -->
                  <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
                    <input
                      v-model="item.isVisible"
                      type="checkbox"
                      class="accent-[#EE5102] rounded"
                    />
                    <span class="text-[11px] font-medium" :class="item.isVisible !== false ? 'text-emerald-700' : 'text-gray-400'">
                      {{ item.isVisible !== false ? 'Visible' : 'Hidden' }}
                    </span>
                  </label>

                  <!-- Move Up / Down -->
                  <div class="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
                    <button
                      @click="handleMoveNavItem(idx, 'up')"
                      :disabled="idx === 0"
                      type="button"
                      class="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      @click="handleMoveNavItem(idx, 'down')"
                      :disabled="idx === headerFooterConfig.navItems.length - 1"
                      type="button"
                      class="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors border-l border-gray-200"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  <!-- Remove item -->
                  <button
                    @click="handleRemoveNavItem(idx)"
                    type="button"
                    class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove Menu Item"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Header CTA Button & Trending Bar -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            <!-- Header CTA Button -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-4 shadow-sm">
              <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Header Button</span>
                  <h3 class="text-sm font-semibold text-gray-900">Header CTA Action</h3>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="headerFooterConfig.headerCta.isVisible"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
              </div>

              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Button Label</label>
                  <input
                    v-model="headerFooterConfig.headerCta.label"
                    type="text"
                    placeholder="e.g. Contact Us"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Target Destination URL</label>
                  <input
                    v-model="headerFooterConfig.headerCta.to"
                    type="text"
                    placeholder="e.g. /contact"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
              </div>
            </div>

            <!-- Trending / Breaking Alert Ticker -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-4 shadow-sm">
              <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Announcement Bar</span>
                  <h3 class="text-sm font-semibold text-gray-900">Top Trending Toolbar</h3>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="headerFooterConfig.trendingBar.isVisible"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
              </div>

              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Prefix Badge Label</label>
                  <input
                    v-model="headerFooterConfig.trendingBar.label"
                    type="text"
                    placeholder="e.g. Trending now:"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Headline Announcement Text</label>
                  <input
                    v-model="headerFooterConfig.trendingBar.text"
                    type="text"
                    placeholder="e.g. Welcome to Headline Central..."
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Target Link URL</label>
                  <input
                    v-model="headerFooterConfig.trendingBar.link"
                    type="text"
                    placeholder="e.g. /blog"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Footer Brand & Contact Information -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-5 max-w-5xl shadow-sm">
            <div class="border-b border-gray-100 pb-3">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Footer Configuration</span>
              <h3 class="text-base font-semibold text-gray-900">Brand Description, Contact &amp; Copyright</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div class="md:col-span-2">
                <label class="block font-medium text-gray-700 mb-1">Brand Description / About Snippet</label>
                <textarea
                  v-model="headerFooterConfig.footer.brandDescription"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                ></textarea>
              </div>

              <div>
                <label class="block font-medium text-gray-700 mb-1">Footer Contact Email</label>
                <input
                  v-model="headerFooterConfig.footer.contactEmail"
                  type="email"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block font-medium text-gray-700 mb-1">Copyright Line</label>
                <input
                  v-model="headerFooterConfig.footer.copyright"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>
            </div>
          </div>

          <!-- Section 4: Social Media Links -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-5 max-w-5xl shadow-sm">
            <div class="border-b border-gray-100 pb-3">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Social Media</span>
              <h3 class="text-base font-semibold text-gray-900">Social Profile URLs</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label class="block font-medium text-gray-700 mb-1">Twitter / X</label>
                <input
                  v-model="headerFooterConfig.footer.socialLinks.twitter"
                  type="url"
                  placeholder="https://x.com/headlinecentral"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  v-model="headerFooterConfig.footer.socialLinks.linkedin"
                  type="url"
                  placeholder="https://linkedin.com/company/headlinecentral"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  v-model="headerFooterConfig.footer.socialLinks.github"
                  type="url"
                  placeholder="https://github.com/headlinecentral"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  v-model="headerFooterConfig.footer.socialLinks.facebook"
                  type="url"
                  placeholder="https://facebook.com/..."
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block font-medium text-gray-700 mb-1">Instagram</label>
                <input
                  v-model="headerFooterConfig.footer.socialLinks.instagram"
                  type="url"
                  placeholder="https://instagram.com/..."
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>
              <div>
                <label class="block font-medium text-gray-700 mb-1">RSS Feed</label>
                <input
                  v-model="headerFooterConfig.footer.socialLinks.rss"
                  type="text"
                  placeholder="/rss.xml"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 5.7: CONTACT US PAGE CONTENT -->
        <div v-else-if="activeTab === 'contact-page'" class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Contact Us Page Content</h2>
              <p class="text-xs text-gray-400 mt-0.5">
                Update hero text, direct desk emails, newsroom phone, address, response expectations, and contact form settings.
              </p>
            </div>
            <div class="flex items-center gap-2.5">
              <button
                @click="resetContactPageToDefaults"
                type="button"
                class="px-3.5 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Reset to Defaults
              </button>
              <button
                @click="handleSaveContactPage"
                :disabled="isSavingContactPage"
                type="button"
                class="px-5 py-2 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <svg v-if="isSavingContactPage" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ isSavingContactPage ? 'Saving Changes...' : 'Save Contact Page' }}</span>
              </button>
            </div>
          </div>

          <!-- Section 1: Page Header & Hero -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-4 max-w-5xl shadow-sm">
            <div class="border-b border-gray-100 pb-3">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Hero Banner</span>
              <h3 class="text-base font-semibold text-gray-900">Page Header &amp; Introduction</h3>
            </div>

            <div class="space-y-4 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Eyebrow Badge Text</label>
                  <input
                    v-model="contactPageConfig.badge"
                    type="text"
                    placeholder="e.g. Get in Touch"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Main Heading</label>
                  <input
                    v-model="contactPageConfig.title"
                    type="text"
                    placeholder="e.g. Contact the Newsroom"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
              </div>

              <div>
                <label class="block font-medium text-gray-700 mb-1">Introductory Paragraph</label>
                <textarea
                  v-model="contactPageConfig.description"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Section 2: Direct Desks Email Inboxes -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-4 max-w-5xl shadow-sm">
            <div class="border-b border-gray-100 pb-3">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Primary Inbox</span>
              <h3 class="text-base font-semibold text-gray-900">Official Contact &amp; Support Email</h3>
            </div>

            <div class="max-w-md text-xs">
              <div>
                <label class="block font-medium text-gray-700 mb-1">Official Support &amp; Inquiries Email</label>
                <input
                  v-model="contactPageConfig.supportEmail"
                  type="email"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
                <p class="text-[11px] text-gray-400 mt-1">Unified official email displayed across all public contact channels.</p>
              </div>
            </div>
          </div>

          <!-- Section 3: Response Commitment -->
          <div class="max-w-2xl">
            <!-- Response Commitment Card -->
            <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-4 shadow-sm">
              <div class="border-b border-gray-100 pb-3">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Assurance</span>
                <h3 class="text-sm font-semibold text-gray-900">Response Commitment Notice</h3>
              </div>
              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Commitment Card Title</label>
                  <input
                    v-model="contactPageConfig.responseTitle"
                    type="text"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Expected Turnaround Time</label>
                  <input
                    v-model="contactPageConfig.responseTime"
                    type="text"
                    placeholder="e.g. 24 to 48 hours"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  />
                </div>
                <div>
                  <label class="block font-medium text-gray-700 mb-1">Commitment Statement</label>
                  <textarea
                    v-model="contactPageConfig.responseCommitment"
                    rows="2"
                    class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Contact Form Settings & Inquiry Topics -->
          <div class="p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white space-y-5 max-w-5xl shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Form Settings</span>
                <h3 class="text-base font-semibold text-gray-900">Transmission Form &amp; Topic Options</h3>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="contactPageConfig.formEnabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EE5102]"></div>
              </label>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block font-medium text-gray-700 mb-1">Success Feedback Message</label>
                <input
                  v-model="contactPageConfig.successMessage"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#EE5102]"
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block font-medium text-gray-700">Inquiry Topics (Dropdown Options)</label>
                  <button
                    @click="handleAddInquiryTopic"
                    type="button"
                    class="text-[11px] font-semibold text-[#EE5102] hover:underline"
                  >
                    + Add Topic
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    v-for="(t, idx) in contactPageConfig.inquiryTopics"
                    :key="idx"
                    class="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200"
                  >
                    <input
                      v-model="contactPageConfig.inquiryTopics[idx]"
                      type="text"
                      class="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#EE5102]"
                    />
                    <button
                      @click="handleRemoveInquiryTopic(idx)"
                      :disabled="contactPageConfig.inquiryTopics.length <= 1"
                      type="button"
                      class="text-gray-400 hover:text-red-600 disabled:opacity-30 p-1"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: HERO BANNERS -->
        <div v-else-if="activeTab === 'banners'" class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
          <BannersManagement />
        </div>

        <!-- TAB 6: SETTINGS -->
        <div v-else-if="activeTab === 'settings'" class="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
          <div class="mb-6 pb-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">CMS Profile &amp; Settings</h2>
            <p class="text-xs text-gray-400 mt-0.5">
              Customize your displayed username, editorial role, and manage your active session.
            </p>
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
                disabled
                class="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-500 px-3.5 py-2 text-sm focus:outline-none"
              />
            </div>

            <!-- Active Session & Sign Out Card -->
            <div class="pt-6 border-t border-gray-100">
              <div class="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 flex items-center justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold text-gray-900">Active Session</p>
                  <p class="text-[11px] text-gray-500 mt-0.5">
                    Signed in as {{ currentUser?.email }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    @click="handleLogout({ lockGateway: true })"
                    type="button"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium transition-colors shadow-sm"
                    title="Sign out and re-arm Layer 1 Security Gateway"
                  >
                    <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Lock Gateway</span>
                  </button>
                  <button
                    @click="handleLogout()"
                    type="button"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors shadow-sm"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- NOTIFICATION LOGS & EMAIL PREVIEW MODAL -->
    <div
      v-if="showNotificationLogsModal"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 max-h-[90vh] flex flex-col shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-orange-50 text-[#EE5102] flex items-center justify-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-900">Email &amp; Push Notification History</h3>
              <p class="text-xs text-gray-400">Push emails dispatched to newly activated users</p>
            </div>
          </div>
          <button
            @click="showNotificationLogsModal = false"
            type="button"
            class="text-gray-400 hover:text-gray-700 text-sm font-semibold p-1"
          >
            &times; Close
          </button>
        </div>

        <!-- Logs List -->
        <div class="flex-1 overflow-y-auto space-y-3">
          <div v-if="!notificationLogs.length" class="text-center py-10 text-xs text-gray-400">
            No activation emails dispatched yet. Newly approved users will appear here.
          </div>
          <div
            v-for="log in notificationLogs"
            :key="log.id"
            class="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2.5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-gray-900">{{ log.recipientName }}</span>
                  <span class="text-[11px] text-gray-500 font-mono">{{ log.recipientEmail }}</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    ✓ {{ log.status === 'delivered' ? 'Push Email Delivered' : 'Dispatched' }}
                  </span>
                </div>
                <p class="text-xs font-medium text-gray-800 mt-1">{{ log.subject }}</p>
                <p class="text-[11px] text-gray-400 mt-0.5">
                  Dispatched on {{ log.dispatchedAt.split('T')[0] }} by {{ log.dispatchedBy }}
                </p>
              </div>
              <button
                @click="selectedPreviewEmail = log"
                type="button"
                class="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 hover:bg-white text-gray-700 flex-shrink-0"
              >
                Preview Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- EMAIL PREVIEW DIALOG -->
    <div
      v-if="selectedPreviewEmail"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] flex flex-col shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 class="text-sm font-semibold text-gray-900">Email Preview</h3>
            <p class="text-[11px] text-gray-400">To: {{ selectedPreviewEmail.recipientEmail }}</p>
          </div>
          <button
            @click="selectedPreviewEmail = null"
            type="button"
            class="text-gray-400 hover:text-gray-700 text-sm font-semibold"
          >
            &times; Close
          </button>
        </div>
        <div class="flex-1 overflow-y-auto border border-gray-200 rounded-2xl p-4 bg-gray-50">
          <div v-html="selectedPreviewEmail.contentHtml" class="w-full"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Reusable Media Picker Modal -->
  <MediaPickerModal
    :is-open="isMediaPickerOpen"
    :title="mediaPickerTitle"
    :media-items="allMediaAssets"
    @close="isMediaPickerOpen = false"
    @select="handleMediaPickerChosen"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticles, type Article, type ArticleSection, type GalleryItem, type CategoryMeta } from '~/composables/useArticles'
import { useSiteSeo } from '~/composables/useSiteSeo'
import { useSiteContent } from '~/composables/useSiteContent'
import {
  useFirebase,
  getDefaultPermissionsForRole,
  ROLE_LABELS,
  type CmsRoleKey,
  type CmsUserPermissions,
  type ManagedCmsUser,
  type NotificationLog
} from '~/composables/useFirebase'
import { sanitizeHtml } from '~/composables/useMarkdown'
import { useCmsGateway, type SecurityBlockedRecord } from '~/composables/useCmsGateway'
import BannersManagement from '~/components/cms/BannersManagement.vue'
import MediaPickerModal from '~/components/cms/MediaPickerModal.vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'CMS Dashboard — HeadlineCentral.',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
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

const router = useRouter()
const {
  checkGatewayAuth,
  lockGateway,
  blockedRecords,
  whitelistedIps,
  unblockedEmails,
  adminUnblockEmail,
  adminWhitelistIp,
  adminResetTerminalLock
} = useCmsGateway()

const handleAdminUnblock = async (rec: SecurityBlockedRecord) => {
  await adminUnblockEmail(rec.id, rec.rescueEmail)
  userFeedbackType.value = 'success'
  userFeedbackMessage.value = `Terminal access restored: ${rec.rescueEmail} has been unblocked.`
}

const handleAdminWhitelist = async (rec: SecurityBlockedRecord) => {
  await adminWhitelistIp(rec.id, rec.clientIp)
  userFeedbackType.value = 'success'
  userFeedbackMessage.value = `Client IP ${rec.clientIp} has been whitelisted for ${rec.rescueEmail}.`
}

const handleResetAllTerminalLocks = () => {
  adminResetTerminalLock()
  userFeedbackType.value = 'success'
  userFeedbackMessage.value = 'All terminal lockouts and attempt counters have been reset by Master Admin.'
}
const {
  articles,
  categories,
  authors,
  syncFromFirestore,
  addArticle,
  updateArticle,
  deleteArticle,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  removeSubCategory,
  toggleArticleStatus
} = useArticles()

const {
  currentUser,
  managedUsers,
  pendingUsers,
  activeUsers,
  notificationLogs,
  allowAdminUserManagementInNav,
  setAllowAdminUserManagementInNav,
  isUploading,
  initFirebase,
  syncUsersFromCloud,
  loginWithGoogle,
  logoutUser,
  createManagedUser,
  updateManagedUser,
  deleteManagedUser,
  approveAndActivateUser,
  rejectUserRequest,
  uploadFileToStorage,
  listStorageMedia
} = useFirebase()

const {
  headerFooterConfig,
  contactPageConfig,
  saveHeaderFooterConfig,
  saveContactPageConfig,
  resetTrendingBarToDefaults,
  resetHeaderFooterToDefaults,
  resetContactPageToDefaults,
  syncSiteContentFromCloud
} = useSiteContent()

const isSavingTrending = ref(false)
const isSavingHeaderFooter = ref(false)
const isSavingContactPage = ref(false)

const handleSaveTrending = async () => {
  isSavingTrending.value = true
  try {
    const ok = await saveHeaderFooterConfig()
    if (ok) {
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = 'Trending now banner updated and saved successfully!'
    }
  } catch (err: any) {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = `Failed to save Trending now banner: ${err?.message || 'Write failed'}`
  } finally {
    isSavingTrending.value = false
  }
}

const handleApplyArticleToTrending = (art: Article) => {
  headerFooterConfig.trendingBar.text = art.title
  headerFooterConfig.trendingBar.link = `/blog/${art.slug}`
  userFeedbackType.value = 'success'
  userFeedbackMessage.value = `Loaded "${art.title}" into Trending now bar. Remember to click "Save Trending Now".`
}

const handleSaveHeaderFooter = async () => {
  isSavingHeaderFooter.value = true
  try {
    const ok = await saveHeaderFooterConfig()
    if (ok) {
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = 'Header and Footer configuration saved and updated successfully.'
    }
  } catch (err: any) {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = `Failed to save Header & Footer: ${err?.message || 'Write failed'}`
  } finally {
    isSavingHeaderFooter.value = false
  }
}

const handleSaveContactPage = async () => {
  isSavingContactPage.value = true
  try {
    const ok = await saveContactPageConfig()
    if (ok) {
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = 'Contact Us page content saved and updated successfully.'
    }
  } catch (err: any) {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = `Failed to save Contact Page: ${err?.message || 'Write failed'}`
  } finally {
    isSavingContactPage.value = false
  }
}

const handleAddNavItem = () => {
  headerFooterConfig.navItems.push({
    id: `nav-${Date.now()}`,
    label: 'New Link',
    to: '/',
    isVisible: true
  })
}

const handleRemoveNavItem = (idx: number) => {
  headerFooterConfig.navItems.splice(idx, 1)
}

const handleMoveNavItem = (idx: number, dir: 'up' | 'down') => {
  const targetIdx = dir === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= headerFooterConfig.navItems.length) return
  const [moved] = headerFooterConfig.navItems.splice(idx, 1)
  headerFooterConfig.navItems.splice(targetIdx, 0, moved)
}

const handleAddInquiryTopic = () => {
  contactPageConfig.inquiryTopics.push('New Topic Option')
}

const handleRemoveInquiryTopic = (idx: number) => {
  if (contactPageConfig.inquiryTopics.length > 1) {
    contactPageConfig.inquiryTopics.splice(idx, 1)
  }
}

const isSyncingUsers = ref(false)
const handleSyncUsers = async () => {
  isSyncingUsers.value = true
  try {
    await syncUsersFromCloud()
    userFeedbackType.value = 'success'
    userFeedbackMessage.value = 'Cloud user database synchronized successfully.'
  } catch {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = 'Unable to synchronize cloud users. Please verify connection and Firestore rules.'
  } finally {
    isSyncingUsers.value = false
  }
}

const showNotificationLogsModal = ref(false)
const selectedPreviewEmail = ref<NotificationLog | null>(null)
const approvingUserId = ref<string | null>(null)
const pendingUserAccess = reactive<Record<string, { roleKey: CmsRoleKey; permissions: CmsUserPermissions }>>({})

const getPendingAccess = (uid: string) => {
  if (!pendingUserAccess[uid]) {
    const userMatch = managedUsers.find(u => u.uid === uid)
    const initRole: CmsRoleKey = (userMatch?.roleKey && userMatch.roleKey !== 'admin') ? userMatch.roleKey : 'editor'
    pendingUserAccess[uid] = {
      roleKey: initRole,
      permissions: userMatch?.permissions ? { ...userMatch.permissions } : { ...getDefaultPermissionsForRole(initRole) }
    }
  }
  return pendingUserAccess[uid]
}

const handlePendingRoleChange = (uid: string, newRole: CmsRoleKey) => {
  const access = getPendingAccess(uid)
  access.roleKey = newRole
  access.permissions = { ...getDefaultPermissionsForRole(newRole) }
}

const handleApproveUser = async (pu: ManagedCmsUser) => {
  approvingUserId.value = pu.uid
  const access = getPendingAccess(pu.uid)
  const res = await approveAndActivateUser(pu.uid, {
    roleKey: access.roleKey,
    permissions: access.permissions
  })
  approvingUserId.value = null
  if (res.ok) {
    userFeedbackType.value = 'success'
    userFeedbackMessage.value = res.message
  } else {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = res.message
  }
}

const handleRejectUser = async (pu: ManagedCmsUser) => {
  if (confirm(`Decline account request for ${pu.email}?`)) {
    const res = await rejectUserRequest(pu.uid)
    if (res.ok) {
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = res.message
    }
  }
}

const {
  pagesSeo,
  trackingConfig,
  updatePageSeo,
  updateTrackingConfig
} = useSiteSeo()

const seoSavedMessage = ref('')

const handleSaveTrackingConfig = () => {
  updateTrackingConfig({
    gtmId: trackingConfig.gtmId.trim(),
    enableGtm: trackingConfig.enableGtm,
    ga4Id: trackingConfig.ga4Id.trim(),
    enableGa4: trackingConfig.enableGa4,
    metaPixelId: trackingConfig.metaPixelId.trim(),
    enableMetaPixel: trackingConfig.enableMetaPixel,
    adsensePublisherId: (trackingConfig.adsensePublisherId || '').trim(),
    enableAdsense: trackingConfig.enableAdsense !== false
  })
  seoSavedMessage.value = 'Tracking & AdSense settings saved!'
  setTimeout(() => {
    seoSavedMessage.value = ''
  }, 2500)
}

const handleSavePageSeo = (key: string) => {
  const entry = pagesSeo[key]
  if (!entry) return
  updatePageSeo(key, {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    ogImage: entry.ogImage
  })
  seoSavedMessage.value = `SEO saved for ${entry.label}!`
  setTimeout(() => {
    seoSavedMessage.value = ''
  }, 2500)
}

const isSidebarCollapsed = ref(false)
const activeTab = ref<'dashboard' | 'media' | 'blogs' | 'editor' | 'categories' | 'banners' | 'seo' | 'trending' | 'header-footer' | 'contact-page' | 'users' | 'settings'>('dashboard')
const cmsSearch = ref('')
const liveVisitors = ref(14)
const isPulsing = ref(false)
const isPreviewMode = ref(false)
const editingArticleId = ref<string | null>(null)
const copiedMedia = ref('')
const cloudMediaAssets = ref<{ name: string; path: string }[]>([])

// Realtime Live Visitors Simulator with 1-Minute Pulse Cycle
let liveVisitorsInterval: any = null
let pulseTimeout: any = null

const triggerLiveVisitorsPulse = () => {
  isPulsing.value = true
  // Realistic natural fluctuation between 8 and 38 visitors
  const delta = Math.floor(Math.random() * 5) - 2 // -2, -1, 0, +1, +2
  const nextVal = Math.max(6, Math.min(42, liveVisitors.value + delta))
  liveVisitors.value = nextVal

  if (pulseTimeout) clearTimeout(pulseTimeout)
  pulseTimeout = setTimeout(() => {
    isPulsing.value = false
  }, 4000)
}

// Media Picker Modal State
const isMediaPickerOpen = ref(false)
const mediaPickerTitle = ref('Select Image from Media')
const onMediaPickerSelect = ref<((item: { name: string; path: string }) => void) | null>(null)

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

const userProfile = reactive({
  welcomeName: 'Master Admin',
  sidebarName: 'Master Admin',
  role: 'Master Admin'
})

const isMasterAdmin = computed(() => Boolean(
  currentUser.value?.isMaster ||
  currentUser.value?.email?.toLowerCase() === 'admin@headlinecentral.co.za'
))

const canViewUserManagementInNav = computed(() => {
  if (!currentUser.value) return false
  if (isMasterAdmin.value) return true
  return Boolean(currentUser.value.permissions?.canManageUsers)
})

const hasPermission = (perm: keyof CmsUserPermissions): boolean => {
  if (!currentUser.value) return false
  if (isMasterAdmin.value) return true
  if (perm === 'canManageUsers') {
    return Boolean(currentUser.value.permissions?.canManageUsers)
  }
  if (currentUser.value.roleKey === 'admin') return true
  return currentUser.value.permissions?.[perm] !== false
}

watch(canViewUserManagementInNav, (canView) => {
  if (!canView && activeTab.value === 'users') {
    activeTab.value = 'dashboard'
  }
})

const isUpdatingUserNav = ref<string | null>(null)
const handleSetUserNavAccess = async (u: ManagedCmsUser, allowed: boolean) => {
  if (!isMasterAdmin.value) return
  if (u.isMaster || u.email.toLowerCase() === 'admin@headlinecentral.co.za') return

  isUpdatingUserNav.value = u.uid
  try {
    const currentPermissions = u.permissions || getDefaultPermissionsForRole(u.roleKey || 'editor')
    const updatedPermissions: CmsUserPermissions = {
      ...currentPermissions,
      canManageUsers: allowed
    }

    const ok = await updateManagedUser(u.uid, {
      permissions: updatedPermissions
    })

    if (ok) {
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = allowed
        ? `User Management navbar access ENABLED for ${u.displayName || u.email}.`
        : `User Management navbar access HIDDEN for ${u.displayName || u.email}.`
    }
  } finally {
    isUpdatingUserNav.value = null
  }
}

// ============================================================================
// CATEGORIES & SUB-CATEGORIES STATE
// ============================================================================
const showNewCategoryForm = ref(false)
const editingCategorySlug = ref<string | null>(null)
const newSubCategoryInputs = reactive<Record<string, string>>({})

const categoryForm = reactive({
  name: '',
  slug: '',
  description: '',
  seoTitle: '',
  metaDescription: '',
  image: '/images/tech-hero.jpg',
  showInNavbar: true
})

const resetCategoryForm = () => {
  editingCategorySlug.value = null
  categoryForm.name = ''
  categoryForm.slug = ''
  categoryForm.description = ''
  categoryForm.seoTitle = ''
  categoryForm.metaDescription = ''
  categoryForm.image = '/images/tech-hero.jpg'
  categoryForm.showInNavbar = true
  showNewCategoryForm.value = false
}

const startEditCategory = (cat: CategoryMeta) => {
  editingCategorySlug.value = cat.slug
  categoryForm.name = cat.name
  categoryForm.slug = cat.slug
  categoryForm.description = cat.description
  categoryForm.seoTitle = cat.seoTitle || ''
  categoryForm.metaDescription = cat.metaDescription || ''
  categoryForm.image = cat.image
  categoryForm.showInNavbar = cat.showInNavbar !== false
  showNewCategoryForm.value = true
}

const handleSaveCategory = () => {
  if (!categoryForm.name.trim()) return
  const cleanSlug = categoryForm.slug.trim() || slugify(categoryForm.name)
  if (editingCategorySlug.value) {
    updateCategory(editingCategorySlug.value, {
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim(),
      seoTitle: categoryForm.seoTitle.trim() || undefined,
      metaDescription: categoryForm.metaDescription.trim() || undefined,
      image: categoryForm.image.trim() || '/images/tech-hero.jpg',
      showInNavbar: categoryForm.showInNavbar
    })
  } else {
    addCategory({
      name: categoryForm.name.trim(),
      slug: cleanSlug,
      description: categoryForm.description.trim(),
      seoTitle: categoryForm.seoTitle.trim() || undefined,
      metaDescription: categoryForm.metaDescription.trim() || undefined,
      image: categoryForm.image.trim() || '/images/tech-hero.jpg',
      showInNavbar: categoryForm.showInNavbar,
      subCategories: []
    })
  }
  resetCategoryForm()
}

const handleAddSubCategory = (categorySlug: string) => {
  const inputVal = (newSubCategoryInputs[categorySlug] || '').trim()
  if (!inputVal) return
  addSubCategory(categorySlug, inputVal)
  newSubCategoryInputs[categorySlug] = ''
}

// ============================================================================
// USER MANAGEMENT & ACCESS CONTROL STATE
// ============================================================================
const showAddUserForm = ref(false)
const userFeedbackMessage = ref('')
const userFeedbackType = ref<'success' | 'error'>('success')
const editingUserId = ref<string | null>(null)

const newUserForm = reactive({
  displayName: '',
  email: '',
  password: '',
  roleKey: 'editor' as CmsRoleKey,
  provider: 'both' as 'both' | 'google' | 'email',
  environment: 'live' as 'live' | 'local',
  permissions: getDefaultPermissionsForRole('editor')
})

const editUserForm = reactive({
  displayName: '',
  roleKey: 'editor' as CmsRoleKey,
  newPassword: '',
  permissions: getDefaultPermissionsForRole('editor')
})

const applyRolePresetToNewUser = (roleKey: CmsRoleKey) => {
  newUserForm.permissions = getDefaultPermissionsForRole(roleKey)
}

const applyRolePresetToEditUser = (roleKey: CmsRoleKey) => {
  editUserForm.permissions = getDefaultPermissionsForRole(roleKey)
}

const handleCreateNewUser = async () => {
  userFeedbackMessage.value = ''
  const result = await createManagedUser({
    displayName: newUserForm.displayName,
    email: newUserForm.email,
    password: newUserForm.password,
    roleKey: newUserForm.roleKey,
    provider: newUserForm.provider,
    environment: newUserForm.environment,
    permissions: { ...newUserForm.permissions }
  })

  if (result.ok) {
    userFeedbackType.value = 'success'
    const envLabel = newUserForm.environment === 'live' ? 'Live & Local Environment' : 'Local Environment'
    userFeedbackMessage.value = `User "${newUserForm.displayName}" (${newUserForm.email}) provisioned for ${envLabel} with ${newUserForm.roleKey.toUpperCase()} role.`
    newUserForm.displayName = ''
    newUserForm.email = ''
    newUserForm.password = ''
    newUserForm.roleKey = 'editor'
    newUserForm.provider = 'both'
    newUserForm.environment = 'live'
    newUserForm.permissions = getDefaultPermissionsForRole('editor')
    showAddUserForm.value = false
  } else {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = result.message || 'Unable to create user.'
  }
}

const toggleEditUserAccess = (u: ManagedCmsUser) => {
  if (editingUserId.value === u.uid) {
    editingUserId.value = null
    return
  }
  editingUserId.value = u.uid
  editUserForm.displayName = u.displayName
  editUserForm.roleKey = u.roleKey
  editUserForm.newPassword = ''
  editUserForm.permissions = { ...u.permissions }
}

const handleSaveEditedUser = async (uid: string) => {
  const ok = await updateManagedUser(uid, {
    displayName: editUserForm.displayName,
    roleKey: editUserForm.roleKey,
    permissions: { ...editUserForm.permissions },
    newPassword: editUserForm.newPassword || undefined
  })
  if (ok) {
    if (currentUser.value?.uid === uid && currentUser.value) {
      userProfile.welcomeName = currentUser.value.displayName
      userProfile.sidebarName = currentUser.value.displayName
      userProfile.role = currentUser.value.role
    }
    userFeedbackType.value = 'success'
    userFeedbackMessage.value = 'User role and access permissions updated.'
    editingUserId.value = null
  }
}

const handleToggleUserActive = async (u: ManagedCmsUser) => {
  await updateManagedUser(u.uid, { active: u.active === false })
}

const handleRemoveUser = async (u: ManagedCmsUser) => {
  const ok = await deleteManagedUser(u.uid)
  if (ok) {
    userFeedbackType.value = 'success'
    userFeedbackMessage.value = `User "${u.displayName}" removed.`
  }
}

onMounted(async () => {
  if (!checkGatewayAuth()) {
    router.replace('/cms/login')
    return
  }

  initFirebase()

  if (
    !currentUser.value ||
    (!currentUser.value.isMaster && (!currentUser.value.approvedAt || currentUser.value.status !== 'active' || currentUser.value.active === false))
  ) {
    await logoutUser()
    router.replace('/cms/login')
    return
  }

  if (currentUser.value.displayName) {
    userProfile.welcomeName = currentUser.value.displayName
    userProfile.sidebarName = currentUser.value.displayName
  }
  if (currentUser.value.role) {
    userProfile.role = currentUser.value.role
  }

  await syncFromFirestore()
  await syncUsersFromCloud().catch(() => {})
  await syncSiteContentFromCloud().catch(() => {})
  const remoteMedia = await listStorageMedia('blogs')
  if (remoteMedia.length > 0) {
    cloudMediaAssets.value = remoteMedia
  }

  // Initialize Realtime Live Visitors with an immediate gentle pulse and recurring 1-minute cycle
  triggerLiveVisitorsPulse()
  if (typeof window !== 'undefined') {
    liveVisitorsInterval = setInterval(() => {
      triggerLiveVisitorsPulse()
    }, 60000)
  }
})

onUnmounted(() => {
  if (liveVisitorsInterval) clearInterval(liveVisitorsInterval)
  if (pulseTimeout) clearTimeout(pulseTimeout)
})

const handleConnectGoogleAccount = async () => {
  const ok = await loginWithGoogle()
  if (ok && currentUser.value) {
    userProfile.welcomeName = currentUser.value.displayName
    userProfile.sidebarName = currentUser.value.displayName
    userProfile.role = currentUser.value.role
  }
}

const handleLogout = async (options?: { lockGateway?: boolean }) => {
  await logoutUser()
  if (options?.lockGateway) {
    lockGateway()
  }
  router.replace('/cms/login')
}

const editorForm = reactive({
  title: '',
  titleHighlight: '',
  seoTitle: '',
  metaDescription: '',
  category: 'Technology',
  subCategory: '',
  publishedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  readTime: '4 min read',
  excerpt: '',
  status: 'published' as 'published' | 'draft',
  bannerImage: '',
  bannerImageMobile: '',
  bannerAlt: '',
  imageCaption: '',
  sections: [] as EditableSectionForm[],
  galleryItems: [] as GalleryItem[],
  galleryCaption: '',
  tagsInput: ''
})

const blogStatusFilter = ref<'all' | 'published' | 'draft'>('all')
const publishedBlogsCount = computed(() => articles.filter(a => a.status !== 'draft').length)
const draftBlogsCount = computed(() => articles.filter(a => a.status === 'draft').length)

const handleToggleArticlePublish = async (id: string) => {
  const updated = await toggleArticleStatus(id)
  if (updated) {
    userFeedbackType.value = 'success'
    userFeedbackMessage.value = `Article "${updated.title}" changed to ${updated.status === 'draft' ? 'Draft' : 'Published'}.`
  }
}

const availableSubCategoriesForEditor = computed(() => {
  const found = categories.find(c => c.name === editorForm.category)
  return found?.subCategories || []
})

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const resolvePreviewUrl = (url: string) => {
  if (!url) return ''
  const trimmed = url.trim()
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed
  }
  return useAsset(trimmed)
}

const handleFileUpload = async (event: Event, onLoaded: (url: string) => void) => {
  const input = event.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) return
  try {
    const uploadedUrl = await uploadFileToStorage(file, 'blogs')
    if (uploadedUrl) {
      onLoaded(uploadedUrl)
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = `Image "${file.name}" uploaded and attached successfully!`
    }
  } catch (err: any) {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = `Upload failed: ${err?.message || 'Unsupported format or file too large.'}`
  } finally {
    if (input) input.value = ''
  }
}

const handleMediaLibraryUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input?.files?.[0]
  if (!file) return
  try {
    const uploadedUrl = await uploadFileToStorage(file, 'blogs')
    if (uploadedUrl) {
      cloudMediaAssets.value.unshift({
        name: file.name,
        path: uploadedUrl
      })
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = `Media item "${file.name}" uploaded to cloud library!`
    }
  } catch (err: any) {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = `Media upload failed: ${err?.message || 'Unsupported file type.'}`
  } finally {
    if (input) input.value = ''
  }
}

const filteredCmsArticles = computed(() => {
  const q = cmsSearch.value.trim().toLowerCase()
  return articles.filter(a => {
    if (blogStatusFilter.value === 'published' && a.status === 'draft') return false
    if (blogStatusFilter.value === 'draft' && a.status !== 'draft') return false
    if (!q) return true
    return (
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    )
  })
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
  const catName = editorForm.category
  const matchedCat = categories.find(c => c.name === catName)
  const catSlug = matchedCat?.slug || slugify(catName)
  const subName = editorForm.subCategory || undefined
  const matchedSub = matchedCat?.subCategories?.find(s => s.name === subName)
  const subSlug = matchedSub?.slug || (subName ? slugify(subName) : undefined)

  const cleanBannerDesktop = (editorForm.bannerImage || '').trim()
  const cleanBannerMobile = (editorForm.bannerImageMobile || editorForm.bannerImage || '').trim()

  const desktopBanner = resolvePreviewUrl(cleanBannerDesktop)
  const mobileBanner = resolvePreviewUrl(cleanBannerMobile)

  const builtSections: ArticleSection[] = editorForm.sections.map((sec, idx) => {
    const sectionObj: ArticleSection = {
      id: slugify(sec.title || `section-${idx + 1}`),
      title: sec.title || `Section ${idx + 1}`,
      content: sec.content
    }
    const cleanImgSrc = (sec.imageSrc || '').trim()
    const cleanImgMobileSrc = (sec.imageMobileSrc || '').trim()

    if (sec.hasImage && (cleanImgSrc || cleanImgMobileSrc)) {
      sectionObj.image = {
        src: resolvePreviewUrl(cleanImgSrc || cleanImgMobileSrc),
        mobileSrc: resolvePreviewUrl(cleanImgMobileSrc || cleanImgSrc),
        alt: (sec.imageAlt || sec.title || 'Section image').trim(),
        caption: (sec.imageCaption || '').trim()
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
    .filter(g => Boolean(g.src && g.src.trim()))
    .map((g, idx) => ({
      src: resolvePreviewUrl(g.src.trim()),
      alt: (g.alt || `Gallery image ${idx + 1}`).trim()
    }))

  const fallbackSlug = editingArticleId.value ? `story-${editingArticleId.value.replace(/[^a-z0-9]/gi, '')}` : `story-${Date.now()}`
  const resolvedSlug = (slugify(editorForm.title || '') || fallbackSlug).trim()

  return {
    id: editingArticleId.value || 'preview-article',
    slug: resolvedSlug,
    title: editorForm.title || 'Untitled Blog Post',
    titleHighlight: editorForm.titleHighlight || undefined,
    excerpt: editorForm.excerpt || '',
    seoTitle: editorForm.seoTitle.trim() || undefined,
    metaDescription: editorForm.metaDescription.trim() || undefined,
    category: catName,
    categorySlug: catSlug,
    subCategory: subName,
    subCategorySlug: subSlug,
    categoryColor: matchedCat?.color || '#ee5102',
    featuredImage: mobileBanner || desktopBanner,
    bannerImage: desktopBanner,
    bannerImageMobile: mobileBanner,
    bannerAlt: (editorForm.bannerAlt || editorForm.title || 'Blog Hero Banner').trim(),
    imageCaption: (editorForm.imageCaption || '').trim(),
    publishedAt: editorForm.publishedAt || '2026 November 7',
    readTime: editorForm.readTime || '5 min read',
    views: 1,
    status: editorForm.status,
    isPublished: editorForm.status === 'published',
    isFeatured: true,
    isPopular: true,
    author: authors.marcus,
    sections: builtSections,
    galleryItems: builtGallery,
    galleryCaption: (editorForm.galleryCaption || '').trim(),
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
  editorForm.seoTitle = ''
  editorForm.metaDescription = ''
  editorForm.category = categories[0]?.name || 'Technology'
  editorForm.subCategory = ''
  editorForm.publishedAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  editorForm.readTime = '4 min read'
  editorForm.excerpt = ''
  editorForm.status = 'published'
  editorForm.bannerImage = ''
  editorForm.bannerImageMobile = ''
  editorForm.bannerAlt = ''
  editorForm.imageCaption = ''
  editorForm.sections = [
    {
      id: `section-${Date.now()}-1`,
      title: '',
      content: '',
      hasImage: false,
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
  editorForm.tagsInput = ''
  activeTab.value = 'editor'
}

const editBlog = (article: Article) => {
  editingArticleId.value = article.id
  isPreviewMode.value = false
  editorForm.title = article.title
  editorForm.titleHighlight = article.titleHighlight || ''
  editorForm.seoTitle = article.seoTitle || ''
  editorForm.metaDescription = article.metaDescription || ''
  editorForm.category = article.category
  editorForm.subCategory = article.subCategory || ''
  editorForm.publishedAt = article.publishedAt
  editorForm.readTime = article.readTime
  editorForm.excerpt = article.excerpt
  editorForm.status = article.status || 'published'
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

const saveBlogPost = async () => {
  const built = previewArticleObject.value
  const cleanTitle = (built.title || 'Untitled Blog Post').trim()
  const cleanSlug = (built.slug || slugify(cleanTitle) || `story-${Date.now()}`).trim()

  try {
    if (editingArticleId.value) {
      await updateArticle(editingArticleId.value, {
        title: cleanTitle,
        slug: cleanSlug,
        titleHighlight: built.titleHighlight,
        excerpt: built.excerpt,
        status: editorForm.status,
        isPublished: editorForm.status === 'published',
        seoTitle: built.seoTitle,
        metaDescription: built.metaDescription,
        category: built.category,
        categorySlug: built.categorySlug,
        subCategory: built.subCategory,
        subCategorySlug: built.subCategorySlug,
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
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = `Blog article "${cleanTitle}" saved successfully as ${editorForm.status === 'draft' ? 'Draft' : 'Published'}!`
    } else {
      const newId = `art-${Date.now()}`
      await addArticle({
        ...built,
        id: newId,
        slug: cleanSlug,
        title: cleanTitle,
        status: editorForm.status,
        isPublished: editorForm.status === 'published'
      })
      userFeedbackType.value = 'success'
      userFeedbackMessage.value = `New blog article "${cleanTitle}" created as ${editorForm.status === 'draft' ? 'Draft' : 'Published'}!`
    }
    // Guarantee newly created/updated article shows up immediately without being hidden by active filters
    blogStatusFilter.value = 'all'
    cmsSearch.value = ''
    editingArticleId.value = null
    isPreviewMode.value = false
    activeTab.value = 'blogs'
  } catch (err: any) {
    userFeedbackType.value = 'error'
    userFeedbackMessage.value = `Error saving blog: ${err?.message || 'Storage write failed'}`
  }
}

const handleDeleteBlog = (id: string) => {
  if (!hasPermission('canDeleteBlogs')) return
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

const allMediaAssets = computed(() => [...cloudMediaAssets.value, ...mediaAssets])

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
