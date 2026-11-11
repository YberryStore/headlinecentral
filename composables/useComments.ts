import { ref, reactive } from 'vue'
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
  moderationReason?: string
}

const STORAGE_KEY = 'hc_blog_comments_v1'
const LAST_POST_TS_KEY = 'hc_last_comment_ts_v1'
const ADMIN_HEADER_VALUE = 'HC-CMS-Admin-2026'

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'yopmail.com', 'trashmail.com', 'sharklasers.com',
  'getnada.com', 'maildrop.cc', 'dispostable.com', 'fakeinbox.com',
  'throwawaymail.com', 'mailnesia.com', 'burnermail.io', 'tempmailo.com'
])

const sharedComments = reactive<BlogComment[]>([])
const likedCommentIds = ref<Set<string>>(new Set())
let isInitialized = false

function evaluateClientSpamHeuristics(author: string, email: string, content: string): {
  decision: 'allow' | 'pending' | 'block'
  reason?: string
} {
  // 1. HTML / BBCode injection check
  if (/(<\s*a\s+href|<\s*script|<\s*iframe|\[url=|\[link=)/i.test(`${content} ${author}`)) {
    return { decision: 'block', reason: 'HTML tags and BBCode links are not permitted in comments.' }
  }

  // 2. No URLs or domains in author name
  if (/(https?:\/\/|www\.|\.(com|net|org|ru|xyz|info|biz|io|co)\b)/i.test(author)) {
    return { decision: 'block', reason: 'Please enter a valid personal name without links or domains.' }
  }

  // 3. Disposable email check
  const domain = email.split('@')[1]?.trim().toLowerCase() || ''
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { decision: 'block', reason: 'Disposable or temporary email addresses are not permitted.' }
  }

  // 4. URL count check (max 2 links)
  const urlMatches = content.match(/(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|co\.za|io|ru|xyz|info|biz|me|ly|gl)\/)/gi)
  const urlCount = urlMatches ? urlMatches.length : 0
  if (urlCount > 2) {
    return { decision: 'block', reason: 'For spam protection, comments may not contain more than 2 links.' }
  }

  // 5. High-confidence spam patterns
  const hardSpamPatterns = [
    /\b(viagra|cialis|levitra|casino|slot\s*gacor|poker\s*online|betting|sportsbook|payday\s*loan)\b/i,
    /\b(crypto\s*recovery|hack\s*recovery|recover\s*lost\s*(bitcoin|crypto|funds)|whatsapp\s*\+?\d{7,})\b/i,
    /\b(buy\s*backlinks|seo\s*services|guest\s*post\s*service|rank\s*your\s*website|cheap\s*traffic)\b/i,
    /\b(telegram\s*@?[a-z0-9_]{4,}|signal\s*\+?\d{7,})\b/i,
    /(.)\1{14,}/u
  ]
  for (const pattern of hardSpamPatterns) {
    if (pattern.test(content) || pattern.test(author)) {
      return { decision: 'block', reason: 'Your comment triggered our automated spam filter and could not be posted.' }
    }
  }

  // 6. Soft flag for editorial moderation
  if (urlCount >= 1) {
    return { decision: 'pending', reason: `Contains external link (${urlCount})` }
  }

  if (/\b(check\s*out\s*my|visit\s*my\s*(site|website|blog|channel)|promo\s*code|discount\s*code|free\s*money|make\s*\$\d+|earn\s*\$\d+|dm\s*me|contact\s*me\s*at)\b/i.test(content)) {
    return { decision: 'pending', reason: 'Flagged for promotional phrasing' }
  }

  return { decision: 'allow' }
}

export const useComments = () => {
  const isSubmitting = ref(false)
  const submitError = ref('')
  const submitSuccess = ref(false)
  const submitPending = ref(false)

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
   * Fetch approved public comments for a specific article from:
   * 1. Live Server API (/api/comments.php)
   * 2. Firestore fallback
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
      const resp = await fetch(`/api/comments.php?all=1&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'X-HC-Admin': ADMIN_HEADER_VALUE }
      })
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

  /**
   * Returns only approved comments for public article display
   */
  const getArticleComments = (articleId: string, articleSlug?: string): BlogComment[] => {
    return sharedComments
      .filter(c => {
        const isApproved = !c.status || c.status === 'approved'
        if (!isApproved) return false
        const matchId = articleId && c.articleId === articleId
        const matchSlug = articleSlug && c.articleSlug === articleSlug
        return matchId || matchSlug
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  /**
   * Post a new comment with 5-Layer Anti-Spam Protection
   */
  const addComment = async (payload: {
    articleId: string
    articleSlug: string
    authorName: string
    authorEmail: string
    content: string
    websiteUrl?: string
    elapsedMs?: number
  }): Promise<{ ok: boolean; pending?: boolean; comment?: BlogComment; error?: string }> => {
    isSubmitting.value = true
    submitError.value = ''
    submitSuccess.value = false
    submitPending.value = false

    const rawAuthor = (payload.authorName || '').trim()
    const rawEmail = (payload.authorEmail || '').trim().toLowerCase()
    const rawContent = (payload.content || '').trim()
    const honeypot = (payload.websiteUrl || '').trim()
    const elapsedMs = typeof payload.elapsedMs === 'number' ? payload.elapsedMs : 10000

    // LAYER 1: Invisible Honeypot & Speed Trap (< 2.5s)
    if (honeypot !== '' || (elapsedMs > 0 && elapsedMs < 2500)) {
      isSubmitting.value = false
      submitSuccess.value = true
      return { ok: true }
    }

    if (!rawAuthor || rawAuthor.length < 2 || rawAuthor.length > 60) {
      isSubmitting.value = false
      submitError.value = 'Please enter a valid name (2 to 60 characters).'
      return { ok: false, error: submitError.value }
    }

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      isSubmitting.value = false
      submitError.value = 'Please enter a valid email address.'
      return { ok: false, error: submitError.value }
    }

    if (!rawContent || rawContent.length < 3) {
      isSubmitting.value = false
      submitError.value = 'Please write a comment (at least 3 characters).'
      return { ok: false, error: submitError.value }
    }

    if (rawContent.length > 3000) {
      isSubmitting.value = false
      submitError.value = 'Comment is too long (maximum 3000 characters).'
      return { ok: false, error: submitError.value }
    }

    // Client-side rate-limit check (45s cooldown)
    if (typeof window !== 'undefined') {
      const lastTs = Number(localStorage.getItem(LAST_POST_TS_KEY) || 0)
      const elapsedSec = Math.floor((Date.now() - lastTs) / 1000)
      if (lastTs > 0 && elapsedSec < 45) {
        const waitSec = 45 - elapsedSec
        isSubmitting.value = false
        submitError.value = `Please wait ${waitSec} seconds before posting another comment.`
        return { ok: false, error: submitError.value }
      }
    }

    // Client-side duplicate check
    const normalizedNew = rawContent.toLowerCase().replace(/\s+/g, ' ')
    const isDuplicate = sharedComments.some(
      c => c.content.trim().toLowerCase().replace(/\s+/g, ' ') === normalizedNew
    )
    if (isDuplicate) {
      isSubmitting.value = false
      submitError.value = 'This exact comment has already been posted recently.'
      return { ok: false, error: submitError.value }
    }

    // Client-side heuristic evaluation
    const heuristic = evaluateClientSpamHeuristics(rawAuthor, rawEmail, rawContent)
    if (heuristic.decision === 'block') {
      isSubmitting.value = false
      submitError.value = heuristic.reason || 'Comment blocked by spam filter.'
      return { ok: false, error: submitError.value }
    }

    const cleanAuthor = rawAuthor.replace(/<[^>]*>/g, '').trim()
    const cleanContent = rawContent.replace(/<[^>]*>/g, '').trim()
    const initialStatus: 'approved' | 'pending' = heuristic.decision === 'pending' ? 'pending' : 'approved'

    let savedComment: BlogComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      articleId: payload.articleId,
      articleSlug: payload.articleSlug,
      authorName: cleanAuthor,
      content: cleanContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      status: initialStatus,
      ...(heuristic.reason ? { moderationReason: heuristic.reason } : {})
    }

    // 1. Submit to Live Server PHP API
    try {
      const resp = await fetch('/api/comments.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          articleId: payload.articleId,
          articleSlug: payload.articleSlug,
          authorName: rawAuthor,
          authorEmail: rawEmail,
          content: rawContent,
          websiteUrl: honeypot,
          elapsedMs
        })
      })

      const json = await resp.json().catch(() => null)

      // Never fall back to Firestore if the server explicitly rejected the comment!
      if (!resp.ok || (json && json.ok === false)) {
        isSubmitting.value = false
        submitError.value = json?.error || 'Your comment could not be posted. Please try again later.'
        return { ok: false, error: submitError.value }
      }

      if (json && json.shadowDropped) {
        isSubmitting.value = false
        submitSuccess.value = true
        return { ok: true }
      }

      if (json && json.ok && json.comment) {
        savedComment = json.comment
      }
    } catch {
      // Network unreachable (e.g. offline/local dev): use client-validated savedComment
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LAST_POST_TS_KEY, String(Date.now()))
      } catch {
        // Ignore
      }
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
    const isPending = savedComment.status === 'pending'
    if (isPending) {
      submitPending.value = true
    } else {
      submitSuccess.value = true
    }

    return { ok: true, pending: isPending, comment: savedComment }
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
   * Moderate a comment's status (Approve, Pending, or Spam)
   */
  const moderateComment = async (
    commentId: string,
    newStatus: 'approved' | 'pending' | 'spam'
  ): Promise<boolean> => {
    const target = sharedComments.find(c => c.id === commentId)
    if (target) {
      target.status = newStatus
      if (newStatus === 'approved') {
        delete target.moderationReason
      }
      persistLocalComments()
    }

    try {
      await fetch('/api/comments.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-HC-Admin': ADMIN_HEADER_VALUE
        },
        body: JSON.stringify({
          action: 'moderate',
          id: commentId,
          status: newStatus
        })
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
      return true
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
        method: 'DELETE',
        headers: { 'X-HC-Admin': ADMIN_HEADER_VALUE }
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

  /**
   * Purge all comments flagged as spam (Admin moderation)
   */
  const purgeSpamComments = async (): Promise<number> => {
    const before = sharedComments.length
    const kept = sharedComments.filter(c => c.status !== 'spam')
    const removed = before - kept.length
    sharedComments.splice(0, sharedComments.length, ...kept)
    persistLocalComments()

    try {
      await fetch('/api/comments.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-HC-Admin': ADMIN_HEADER_VALUE
        },
        body: JSON.stringify({ action: 'purge_spam' })
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

    return removed
  }

  const hasLiked = (commentId: string): boolean => {
    return likedCommentIds.value.has(commentId)
  }

  return {
    comments: sharedComments,
    isSubmitting,
    submitError,
    submitSuccess,
    submitPending,
    fetchCommentsForArticle,
    fetchAllComments,
    getArticleComments,
    addComment,
    likeComment,
    moderateComment,
    deleteComment,
    purgeSpamComments,
    hasLiked
  }
}
