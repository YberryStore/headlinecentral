import { ref, reactive, computed } from 'vue'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { useFirebase } from '~/composables/useFirebase'

export interface BlogComment {
  id: string
  articleId: string
  articleSlug: string
  authorName: string
  authorEmail?: string
  content: string
  createdAt: string
  likes?: number
  status?: 'approved' | 'pending' | 'spam'
}

const STORAGE_KEY = 'hc_blog_comments_v1'

const sharedComments = reactive<BlogComment[]>([])
const likedCommentIds = ref<Set<string>>(new Set())
let isInitialized = false

export const useComments = () => {
  const isSubmitting = ref(false)
  const submitError = ref('')
  const submitSuccess = ref(false)

  const initLocalComments = () => {
    if (typeof window === 'undefined' || isInitialized) return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: BlogComment[] = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          sharedComments.splice(0, sharedComments.length, ...parsed)
        }
      }
      const storedLikes = localStorage.getItem('hc_liked_comments_v1')
      if (storedLikes) {
        const parsedLikes: string[] = JSON.parse(storedLikes)
        if (Array.isArray(parsedLikes)) {
          likedCommentIds.value = new Set(parsedLikes)
        }
      }
    } catch {
      // Ignore parse errors
    }
    isInitialized = true
  }

  initLocalComments()

  const persistLocalComments = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedComments))
      localStorage.setItem('hc_liked_comments_v1', JSON.stringify(Array.from(likedCommentIds.value)))
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Fetch comments for a specific article from:
   * 1. Live Server API (/api/comments.php)
   * 2. Firestore fallback (collection 'comments' or system_settings/comments)
   */
  const fetchCommentsForArticle = async (articleId: string, articleSlug?: string): Promise<BlogComment[]> => {
    if (typeof window === 'undefined') return []

    // 1. Live Server PHP API
    try {
      const url = `/api/comments.php?articleId=${encodeURIComponent(articleId)}&articleSlug=${encodeURIComponent(articleSlug || '')}&_t=${Date.now()}`
      const resp = await fetch(url, { cache: 'no-store' })
      if (resp.ok) {
        const json = await resp.json()
        if (json && json.ok && Array.isArray(json.comments)) {
          // Merge remote comments with sharedComments
          for (const c of json.comments) {
            const idx = sharedComments.findIndex(existing => existing.id === c.id)
            if (idx !== -1) {
              sharedComments.splice(idx, 1, { ...sharedComments[idx], ...c })
            } else {
              sharedComments.push(c)
            }
          }
          persistLocalComments()
          return getArticleComments(articleId, articleSlug)
        }
      }
    } catch {
      // Fall through to Firestore
    }

    // 2. Firestore fallback
    try {
      const { fetchLiveConfig } = useFirebase()
      const data = await fetchLiveConfig<{ comments?: BlogComment[] }>('comments')
      if (data && Array.isArray(data.comments)) {
        for (const c of data.comments) {
          const idx = sharedComments.findIndex(existing => existing.id === c.id)
          if (idx !== -1) {
            sharedComments.splice(idx, 1, { ...sharedComments[idx], ...c })
          } else {
            sharedComments.push(c)
          }
        }
        persistLocalComments()
      }
    } catch {
      // Ignore
    }

    return getArticleComments(articleId, articleSlug)
  }

  /**
   * Fetch all comments across the entire publication (for CMS moderation)
   */
  const fetchAllComments = async (): Promise<BlogComment[]> => {
    if (typeof window === 'undefined') return sharedComments

    try {
      const resp = await fetch(`/api/comments.php?all=1&_t=${Date.now()}`, { cache: 'no-store' })
      if (resp.ok) {
        const json = await resp.json()
        if (json && json.ok && Array.isArray(json.comments)) {
          sharedComments.splice(0, sharedComments.length, ...json.comments)
          persistLocalComments()
          return sharedComments
        }
      }
    } catch {
      // Fallback to Firestore
    }

    try {
      const { fetchLiveConfig } = useFirebase()
      const data = await fetchLiveConfig<{ comments?: BlogComment[] }>('comments')
      if (data && Array.isArray(data.comments)) {
        sharedComments.splice(0, sharedComments.length, ...data.comments)
        persistLocalComments()
      }
    } catch {
      // Ignore
    }

    return sharedComments
  }

  const getArticleComments = (articleId: string, articleSlug?: string): BlogComment[] => {
    return sharedComments
      .filter(c => {
        const matchId = articleId && c.articleId === articleId
        const matchSlug = articleSlug && c.articleSlug === articleSlug
        return matchId || matchSlug
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  /**
   * Post a new comment
   */
  const addComment = async (payload: {
    articleId: string
    articleSlug: string
    authorName: string
    authorEmail: string
    content: string
  }): Promise<{ ok: boolean; comment?: BlogComment; error?: string }> => {
    isSubmitting.value = true
    submitError.value = ''
    submitSuccess.value = false

    const cleanAuthor = payload.authorName.trim()
    const cleanEmail = payload.authorEmail.trim().toLowerCase()
    const cleanContent = payload.content.trim()

    if (!cleanAuthor || cleanAuthor.length < 2) {
      isSubmitting.value = false
      submitError.value = 'Please enter your name (at least 2 characters).'
      return { ok: false, error: submitError.value }
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      isSubmitting.value = false
      submitError.value = 'Please enter a valid email address.'
      return { ok: false, error: submitError.value }
    }

    if (!cleanContent || cleanContent.length < 3) {
      isSubmitting.value = false
      submitError.value = 'Please write a comment (at least 3 characters).'
      return { ok: false, error: submitError.value }
    }

    const fallbackComment: BlogComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      articleId: payload.articleId,
      articleSlug: payload.articleSlug,
      authorName: cleanAuthor,
      content: cleanContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      status: 'approved'
    }

    let savedComment = fallbackComment

    // 1. Try Live Server PHP API
    try {
      const resp = await fetch('/api/comments.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          articleId: payload.articleId,
          articleSlug: payload.articleSlug,
          authorName: cleanAuthor,
          authorEmail: cleanEmail,
          content: cleanContent
        })
      })
      if (resp.ok) {
        const json = await resp.json()
        if (json && json.ok && json.comment) {
          savedComment = json.comment
        }
      }
    } catch {
      // Fallback to local & Firestore save
    }

    // Insert locally
    const existingIdx = sharedComments.findIndex(c => c.id === savedComment.id)
    if (existingIdx !== -1) {
      sharedComments.splice(existingIdx, 1, savedComment)
    } else {
      sharedComments.unshift(savedComment)
    }
    persistLocalComments()

    // 2. Sync to Firestore
    try {
      const { saveLiveConfig } = useFirebase()
      await saveLiveConfig('comments', {
        comments: JSON.parse(JSON.stringify(sharedComments))
      })
    } catch {
      // Ignore
    }

    isSubmitting.value = false
    submitSuccess.value = true
    return { ok: true, comment: savedComment }
  }

  /**
   * Upvote / like a comment
   */
  const likeComment = async (commentId: string): Promise<void> => {
    if (likedCommentIds.value.has(commentId)) return

    likedCommentIds.value.add(commentId)
    const target = sharedComments.find(c => c.id === commentId)
    if (target) {
      target.likes = (target.likes || 0) + 1
    }
    persistLocalComments()

    try {
      await fetch('/api/comments.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', id: commentId })
      })
    } catch {
      // Ignore offline
    }

    try {
      const { saveLiveConfig } = useFirebase()
      await saveLiveConfig('comments', {
        comments: JSON.parse(JSON.stringify(sharedComments))
      })
    } catch {
      // Ignore
    }
  }

  /**
   * Delete a comment (Admin moderation)
   */
  const deleteComment = async (commentId: string): Promise<boolean> => {
    const idx = sharedComments.findIndex(c => c.id === commentId)
    if (idx !== -1) {
      sharedComments.splice(idx, 1)
      persistLocalComments()
    }

    try {
      await fetch(`/api/comments.php?id=${encodeURIComponent(commentId)}`, {
        method: 'DELETE'
      })
    } catch {
      // Ignore offline
    }

    try {
      const { saveLiveConfig } = useFirebase()
      await saveLiveConfig('comments', {
        comments: JSON.parse(JSON.stringify(sharedComments))
      })
      return true
    } catch {
      return false
    }
  }

  const hasLiked = (commentId: string): boolean => {
    return likedCommentIds.value.has(commentId)
  }

  return {
    comments: sharedComments,
    isSubmitting,
    submitError,
    submitSuccess,
    fetchCommentsForArticle,
    fetchAllComments,
    getArticleComments,
    addComment,
    likeComment,
    deleteComment,
    hasLiked
  }
}

