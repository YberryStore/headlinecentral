<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2 h-2 rounded-full bg-[#EE5102] animate-pulse"></span>
          <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Community Engagement &amp; Anti-Spam</span>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Reader Comments Moderation</h2>
        <p class="text-xs text-gray-400 mt-0.5">
          Review, approve quarantined comments, and remove spam across all published blogs in real time.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          v-if="spamCommentsCount > 0"
          @click="handlePurgeSpam"
          type="button"
          class="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-red-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Purge Spam ({{ spamCommentsCount }})</span>
        </button>

        <button
          @click="refreshComments"
          type="button"
          :disabled="isRefreshing"
          class="px-4 py-2 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- Feedback Message Toast -->
    <div
      v-if="statusFeedback"
      class="p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs transition-all"
      :class="statusFeedbackType === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'"
    >
      <div class="flex items-center gap-2">
        <svg v-if="statusFeedbackType === 'success'" class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        <svg v-else class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>{{ statusFeedback }}</span>
      </div>
      <button @click="statusFeedback = ''" type="button" class="font-bold opacity-60 hover:opacity-100">&times;</button>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <span class="text-xs text-gray-500 font-medium">Approved Live</span>
          <p class="text-2xl font-bold text-gray-900">{{ approvedCommentsCount }}</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div>
          <span class="text-xs text-gray-500 font-medium">Pending Review</span>
          <p class="text-2xl font-bold text-gray-900">{{ pendingCommentsCount }}</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div>
          <span class="text-xs text-gray-500 font-medium">Flagged Spam</span>
          <p class="text-2xl font-bold text-gray-900">{{ spamCommentsCount }}</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <div>
          <span class="text-xs text-gray-500 font-medium">Helpful Votes</span>
          <p class="text-2xl font-bold text-gray-900">{{ totalLikesCount }}</p>
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3">
      <!-- Status Filter Pills -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          @click="filterStatus = 'all'"
          type="button"
          :class="filterStatus === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
        >
          All ({{ comments.length }})
        </button>
        <button
          @click="filterStatus = 'approved'"
          type="button"
          :class="filterStatus === 'approved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
        >
          Approved ({{ approvedCommentsCount }})
        </button>
        <button
          @click="filterStatus = 'pending'"
          type="button"
          :class="filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
        >
          Pending Review ({{ pendingCommentsCount }})
        </button>
        <button
          @click="filterStatus = 'spam'"
          type="button"
          :class="filterStatus === 'spam' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
        >
          Spam ({{ spamCommentsCount }})
        </button>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by reader name, email, comment message, or article slug..."
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs sm:text-sm focus:border-[#EE5102] focus:bg-white focus:outline-none transition-colors"
          />
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filter by story -->
        <select
          v-model="filterStory"
          class="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:border-[#EE5102] focus:outline-none"
        >
          <option value="">All Stories ({{ activeStoriesCount }})</option>
          <option v-for="story in uniqueStories" :key="story" :value="story">
            {{ story }} ({{ getStoryCount(story) }})
          </option>
        </select>
      </div>
    </div>

    <!-- Comments Stream List -->
    <div v-if="filteredComments.length > 0" class="space-y-4">
      <div
        v-for="c in filteredComments"
        :key="c.id"
        class="bg-white rounded-2xl p-5 sm:p-6 border shadow-xs transition-all flex flex-col sm:flex-row items-start justify-between gap-4"
        :class="
          c.status === 'pending'
            ? 'border-amber-200 bg-amber-50/10'
            : c.status === 'spam'
              ? 'border-red-200 bg-red-50/10'
              : 'border-gray-100 hover:border-gray-200'
        "
      >
        <!-- Left: Details and Content -->
        <div class="flex items-start gap-4 flex-1">
          <!-- Avatar Initial -->
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#feeee6] to-[#fcdccc] text-[#EE5102] font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#EE5102]/20">
            {{ getInitials(c.authorName) }}
          </div>

          <div class="space-y-2 flex-1">
            <!-- Author info, Status Badge & Target Article -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-bold text-gray-950 text-sm">{{ c.authorName }}</span>

              <!-- Status Pill -->
              <span
                v-if="c.status === 'pending'"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200"
              >
                Pending Review
              </span>
              <span
                v-else-if="c.status === 'spam'"
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200"
              >
                Flagged Spam
              </span>
              <span
                v-else
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                Approved
              </span>

              <span
                v-if="c.moderationReason"
                class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600"
              >
                Reason: {{ c.moderationReason }}
              </span>

              <a
                v-if="c.authorEmail"
                :href="`mailto:${c.authorEmail}`"
                class="text-xs text-gray-400 hover:text-[#EE5102] transition-colors"
              >
                &bull; {{ c.authorEmail }}
              </a>
              <span class="text-xs text-gray-400">&bull; {{ formatDate(c.createdAt) }}</span>
            </div>

            <!-- Target Article Badge with live link -->
            <div class="inline-flex items-center gap-1.5 text-xs">
              <span class="text-gray-400">On story:</span>
              <NuxtLink
                :to="`/blog/${c.articleSlug || c.articleId}`"
                target="_blank"
                class="font-semibold text-gray-800 hover:text-[#EE5102] transition-colors inline-flex items-center gap-1"
              >
                <span>/blog/{{ c.articleSlug || c.articleId }}</span>
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </NuxtLink>
            </div>

            <!-- Message Body -->
            <p class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
              {{ c.content }}
            </p>

            <!-- Likes Counter -->
            <div class="flex items-center gap-3 text-xs text-gray-500 pt-1">
              <span class="inline-flex items-center gap-1 text-rose-500 font-medium">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span>{{ c.likes || 0 }} helpful {{ (c.likes || 0) === 1 ? 'vote' : 'votes' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Moderation & Delete Actions -->
        <div class="flex flex-wrap items-center gap-2 self-end sm:self-center">
          <!-- Approve Button (shown if pending or spam) -->
          <button
            v-if="c.status === 'pending' || c.status === 'spam'"
            @click="handleModerate(c.id, 'approved')"
            type="button"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Approve and publish this comment"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            <span>Approve</span>
          </button>

          <!-- Mark as Spam Button (shown if not already spam) -->
          <button
            v-if="c.status !== 'spam'"
            @click="handleModerate(c.id, 'spam')"
            type="button"
            class="px-3 py-2 rounded-xl text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="Quarantine as spam"
          >
            <span>Spam</span>
          </button>

          <!-- Pending Delete Confirmation -->
          <template v-if="confirmDeleteId === c.id">
            <span class="text-xs text-red-600 font-semibold mr-1">Confirm delete?</span>
            <button
              @click="executeDelete(c.id)"
              type="button"
              class="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
            >
              Yes, Delete
            </button>
            <button
              @click="confirmDeleteId = null"
              type="button"
              class="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </template>

          <button
            v-else
            @click="confirmDeleteId = c.id"
            type="button"
            class="px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Delete this comment"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
      <div class="w-16 h-16 rounded-2xl bg-orange-50 text-[#EE5102] flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
      </div>
      <h3 class="text-base font-semibold text-gray-900 mb-1">
        {{ comments.length === 0 ? 'No comments submitted yet' : 'No comments match your filter' }}
      </h3>
      <p class="text-xs text-gray-400 max-w-sm mx-auto">
        {{ comments.length === 0 ? 'When visitors leave comments on any blog story, they will automatically appear here for moderation.' : 'Try switching status tabs or adjusting your search query.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useComments } from '~/composables/useComments'

const { comments, fetchAllComments, moderateComment, deleteComment, purgeSpamComments } = useComments()

const isRefreshing = ref(false)
const searchQuery = ref('')
const filterStory = ref('')
const filterStatus = ref<'all' | 'approved' | 'pending' | 'spam'>('all')
const confirmDeleteId = ref<string | null>(null)
const statusFeedback = ref('')
const statusFeedbackType = ref<'success' | 'error'>('success')

onMounted(async () => {
  await refreshComments()
})

const refreshComments = async () => {
  isRefreshing.value = true
  try {
    await fetchAllComments()
  } finally {
    isRefreshing.value = false
  }
}

const approvedCommentsCount = computed(() =>
  comments.filter(c => !c.status || c.status === 'approved').length
)

const pendingCommentsCount = computed(() =>
  comments.filter(c => c.status === 'pending').length
)

const spamCommentsCount = computed(() =>
  comments.filter(c => c.status === 'spam').length
)

const uniqueStories = computed(() => {
  const set = new Set<string>()
  for (const c of comments) {
    if (c.articleSlug) set.add(c.articleSlug)
    else if (c.articleId) set.add(c.articleId)
  }
  return Array.from(set).sort()
})

const activeStoriesCount = computed(() => uniqueStories.value.length)

const totalLikesCount = computed(() => {
  return comments.reduce((acc, c) => acc + (c.likes || 0), 0)
})

const getStoryCount = (story: string) => {
  return comments.filter(c => c.articleSlug === story || c.articleId === story).length
}

const filteredComments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return comments.filter(c => {
    const cStatus = c.status || 'approved'
    if (filterStatus.value !== 'all' && cStatus !== filterStatus.value) return false

    const matchesStory = !filterStory.value || c.articleSlug === filterStory.value || c.articleId === filterStory.value
    if (!matchesStory) return false
    if (!q) return true
    return (
      (c.authorName && c.authorName.toLowerCase().includes(q)) ||
      (c.authorEmail && c.authorEmail.toLowerCase().includes(q)) ||
      (c.content && c.content.toLowerCase().includes(q)) ||
      (c.articleSlug && c.articleSlug.toLowerCase().includes(q)) ||
      (c.articleId && c.articleId.toLowerCase().includes(q))
    )
  })
})

const getInitials = (name?: string): string => {
  if (!name) return 'HC'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const handleModerate = async (id: string, newStatus: 'approved' | 'pending' | 'spam') => {
  const ok = await moderateComment(id, newStatus)
  if (ok) {
    statusFeedbackType.value = 'success'
    statusFeedback.value =
      newStatus === 'approved'
        ? 'Comment approved and published to the live article.'
        : 'Comment quarantined as spam.'
  }
}

const handlePurgeSpam = async () => {
  const removed = await purgeSpamComments()
  statusFeedbackType.value = 'success'
  statusFeedback.value = `Purged ${removed} spam ${removed === 1 ? 'comment' : 'comments'}.`
}

const executeDelete = async (id: string) => {
  try {
    const ok = await deleteComment(id)
    if (ok) {
      statusFeedbackType.value = 'success'
      statusFeedback.value = 'Comment permanently deleted from server and database.'
    } else {
      statusFeedbackType.value = 'error'
      statusFeedback.value = 'Could not delete comment. Please try again.'
    }
  } catch {
    statusFeedbackType.value = 'error'
    statusFeedback.value = 'Failed to delete comment.'
  } finally {
    confirmDeleteId.value = null
  }
}
</script>
