<template>
  <section id="comments" class="pt-10 border-t border-gray-200 scroll-mt-24 space-y-8">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-orange-50 text-[#EE5102] flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-950 font-sans tracking-tight">
            Reader Discussion
          </h3>
          <p class="text-xs text-gray-500">
            Share your perspective, technical analysis, or questions on this story.
          </p>
        </div>
      </div>

      <span class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#feeee6] text-[#EE5102] border border-[#EE5102]/20">
        {{ articleComments.length }} {{ articleComments.length === 1 ? 'Comment' : 'Comments' }}
      </span>
    </div>

    <!-- Comment Submission Form -->
    <div class="bg-gray-50/80 rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-4">
      <div class="flex items-center justify-between border-b border-gray-200/60 pb-3">
        <span class="text-xs font-bold text-gray-900 uppercase tracking-wider">Leave a Comment</span>
        <span class="text-[11px] text-gray-400">All constructive viewpoints welcome</span>
      </div>

      <!-- Success Notification -->
      <div
        v-if="submitSuccess"
        class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          <span>Your comment has been posted successfully! Thank you for participating.</span>
        </div>
        <button @click="submitSuccess = false" type="button" class="text-emerald-600 hover:text-emerald-900 font-bold">&times;</button>
      </div>

      <!-- Error Notification -->
      <div
        v-if="submitError"
        class="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>{{ submitError }}</span>
        </div>
        <button @click="submitError = ''" type="button" class="text-red-600 hover:text-red-900 font-bold">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Your Name <span class="text-[#EE5102]">*</span>
            </label>
            <input
              v-model="authorName"
              type="text"
              required
              placeholder="e.g. Alex Henderson"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm focus:border-[#EE5102] focus:outline-none focus:ring-1 focus:ring-[#EE5102]"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-semibold text-gray-700">
                Email Address <span class="text-[#EE5102]">*</span>
              </label>
              <span class="text-[10px] text-gray-400">Never published publicly</span>
            </div>
            <input
              v-model="authorEmail"
              type="email"
              required
              placeholder="alex@example.com"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm focus:border-[#EE5102] focus:outline-none focus:ring-1 focus:ring-[#EE5102]"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-xs font-semibold text-gray-700">
              Your Comment <span class="text-[#EE5102]">*</span>
            </label>
            <span class="text-[11px] text-gray-400">{{ commentText.length }} / 3000 chars</span>
          </div>
          <textarea
            v-model="commentText"
            rows="4"
            required
            maxlength="3000"
            placeholder="Share your thoughts on this story, ask a question, or contribute further context..."
            class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-xs sm:text-sm leading-relaxed focus:border-[#EE5102] focus:outline-none focus:ring-1 focus:ring-[#EE5102]"
          ></textarea>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p class="text-[11px] text-gray-400">
            By submitting, you agree to our editorial guidelines for respectful discussion.
          </p>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-7 py-2.5 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <svg v-if="isSubmitting" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Posting Comment...' : 'Post Comment' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Comments List -->
    <div class="space-y-4">
      <!-- Empty State -->
      <div
        v-if="articleComments.length === 0"
        class="py-12 px-6 rounded-3xl bg-white border border-dashed border-gray-200 text-center space-y-2"
      >
        <div class="w-12 h-12 rounded-full bg-orange-50 text-[#EE5102] flex items-center justify-center mx-auto mb-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h4 class="text-sm font-bold text-gray-900">Be the first to comment</h4>
        <p class="text-xs text-gray-500 max-w-sm mx-auto">
          No comments have been posted on this story yet. Use the form above to start the discussion!
        </p>
      </div>

      <!-- Comment Cards -->
      <div
        v-for="comment in articleComments"
        :key="comment.id"
        class="p-5 sm:p-6 rounded-3xl bg-white border border-gray-100 shadow-2xs hover:border-gray-200 transition-colors space-y-3"
      >
        <div class="flex items-start justify-between gap-3">
          <!-- Author Profile & Initials -->
          <div class="flex items-center gap-3">
            <div
              :class="getAvatarColor(comment.authorName)"
              class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider flex-shrink-0 shadow-2xs"
            >
              {{ getInitials(comment.authorName) }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs sm:text-sm font-bold text-gray-950">{{ comment.authorName }}</span>
                <span class="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  Reader
                </span>
              </div>
              <p class="text-[11px] text-gray-400 mt-0.5 font-mono">
                {{ formatCommentDate(comment.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Like / Helpful Button -->
          <button
            @click="likeComment(comment.id)"
            type="button"
            :class="hasLiked(comment.id) ? 'bg-orange-50 text-[#EE5102] border-[#EE5102]/30' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'"
            class="px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Mark as helpful"
          >
            <svg
              class="w-3.5 h-3.5"
              :fill="hasLiked(comment.id) ? 'currentColor' : 'none'"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ comment.likes || 0 }}</span>
          </button>
        </div>

        <!-- Comment Content -->
        <p class="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-13">
          {{ comment.content }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useComments, type BlogComment } from '~/composables/useComments'

const props = defineProps<{
  articleId: string
  articleSlug: string
  articleTitle?: string
}>()

const {
  fetchCommentsForArticle,
  getArticleComments,
  addComment,
  likeComment,
  hasLiked,
  isSubmitting,
  submitError,
  submitSuccess
} = useComments()

const authorName = ref('')
const authorEmail = ref('')
const commentText = ref('')

const articleComments = computed<BlogComment[]>(() => {
  return getArticleComments(props.articleId, props.articleSlug)
})

onMounted(async () => {
  await fetchCommentsForArticle(props.articleId, props.articleSlug)
})

const handleSubmit = async () => {
  const result = await addComment({
    articleId: props.articleId,
    articleSlug: props.articleSlug,
    authorName: authorName.value,
    authorEmail: authorEmail.value,
    content: commentText.value
  })

  if (result.ok) {
    commentText.value = ''
  }
}

const getInitials = (name: string): string => {
  if (!name) return 'HC'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const avatarGradients = [
  'bg-gradient-to-br from-orange-500 to-red-600',
  'bg-gradient-to-br from-blue-600 to-indigo-700',
  'bg-gradient-to-br from-emerald-600 to-teal-700',
  'bg-gradient-to-br from-purple-600 to-pink-600',
  'bg-gradient-to-br from-amber-500 to-orange-600'
]

const getAvatarColor = (name: string): string => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % avatarGradients.length
  return avatarGradients[idx]
}

const formatCommentDate = (dateStr: string): string => {
  if (!dateStr) return 'Recently'
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000)

    if (diffSec < 60) return 'Just now'
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`
    if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)} days ago`

    return d.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}
</script>

