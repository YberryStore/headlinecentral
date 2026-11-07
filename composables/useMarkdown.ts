import { marked } from 'marked'

export interface TocItem {
  id: string
  title: string
  level?: number
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Sanitize HTML string to prevent XSS via <script>, <iframe>, inline event handlers (on*),
 * and dangerous URI schemes (javascript:, vbscript:, data:text/html).
 */
export const sanitizeHtml = (rawHtml: string): string => {
  if (!rawHtml) return ''
  return rawHtml
    // Remove dangerous elements and their inner contents
    .replace(/<\s*(script|iframe|object|embed|applet|meta|link|style|base|form)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    // Remove self-closing or unclosed dangerous tags
    .replace(/<\s*\/?\s*(script|iframe|object|embed|applet|meta|link|style|base|form|input|button|textarea)\b[^>]*>/gi, '')
    // Remove inline event handlers (onload, onerror, onclick, onmouseover, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Neutralize javascript:, vbscript:, and data:text/html URIs in href/src/xlink:href/action
    .replace(/\b(href|src|xlink:href|action|formaction)\s*=\s*(?:"\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^"]*"|'\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^']*'|(?:\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^\s>]*))/gi, '$1="#"')
}

export const useMarkdown = () => {
  /**
   * Parse a markdown string into sanitized, styled HTML
   */
  const renderMarkdown = (content: string): string => {
    if (!content) return ''
    try {
      const parsed = marked.parse(content, {
        gfm: true,
        breaks: true
      }) as string
      return sanitizeHtml(parsed)
    } catch {
      return ''
    }
  }

  /**
   * Extract headings (## and ###) from markdown content to build Table of Contents
   */
  const extractHeadings = (markdownText: string): TocItem[] => {
    if (!markdownText) return []
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const items: TocItem[] = []
    let match: RegExpExecArray | null

    while ((match = headingRegex.exec(markdownText)) !== null) {
      const level = match[1].length
      const title = match[2].trim()
      const id = slugify(title)
      items.push({ id, title, level })
    }

    return items
  }

  return {
    renderMarkdown,
    extractHeadings,
    sanitizeHtml,
    slugify
  }
}
