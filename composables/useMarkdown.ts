import { marked } from 'marked'

export interface TocItem {
  id: string
  title: string
  level?: number
}

// Custom renderer for marked to ensure headings have IDs for TOC anchor linking
const renderer = new marked.Renderer()

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const useMarkdown = () => {
  /**
   * Parse a markdown string into styled HTML
   */
  const renderMarkdown = (content: string): string => {
    if (!content) return ''
    try {
      return marked.parse(content, {
        gfm: true,
        breaks: true
      }) as string
    } catch (e) {
      console.error('Error parsing markdown:', e)
      return content
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
    slugify
  }
}

