<template>
  <div v-if="article" class="bg-white min-h-screen">
    <!-- Article Header: Category, Title, Excerpt, Date -->
    <header class="pt-8 sm:pt-12 pb-6 max-w-4xl mx-auto text-center px-4">
      <!-- Category Badge -->
      <div class="mb-4">
        <NuxtLink
          :to="`/categories/${article.categorySlug}`"
          class="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-[#feeee6] text-[#EE5102] hover:bg-[#fcdccc] transition-colors"
        >
          {{ article.category === 'Technology' ? 'Tech' : article.category }}
        </NuxtLink>
      </div>

      <!-- Article Title -->
      <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-medium leading-[1.2] text-gray-950 font-sans tracking-tight mb-4">
        <template v-if="article.titleHighlight">
          <span class="text-[#EE5102]">{{ article.titleHighlight }}</span>
          {{ article.title.replace(article.titleHighlight, '') }}
        </template>
        <template v-else>
          {{ article.title }}
        </template>
      </h1>

      <!-- Excerpt / Subtitle -->
      <p v-if="article.excerpt" class="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto mb-4">
        {{ article.excerpt }}
      </p>

      <!-- Date & Reading Time -->
      <div class="text-xs text-gray-400 font-normal">
        {{ article.publishedAt }} • {{ article.readTime }}
      </div>
    </header>

    <!-- Full-Width Featured Banner or Playable Hero Video (Desktop & Mobile with Alt Tag, Clickable URL, Video Controls & Credit) -->
    <div v-if="article.bannerImage || article.bannerImageMobile || article.featuredImage || article.videoUrl" class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
      <!-- Mode 1: Active In-Place Video Player -->
      <div
        v-if="article.videoUrl && isPlayingHeroVideo"
        class="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-black relative border border-gray-800"
      >
        <div class="aspect-video w-full bg-black relative">
          <iframe
            v-if="isEmbedVideo(article.videoUrl)"
            :src="getEmbedVideoUrl(article.videoUrl, true)"
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            :title="article.videoCaption || article.title"
          ></iframe>
          <video
            v-else
            :src="useAsset(article.videoUrl)"
            controls
            autoplay
            playsinline
            preload="auto"
            class="w-full h-full object-contain bg-black"
          ></video>
        </div>

        <!-- Video Control Bar -->
        <div class="p-3 sm:p-4 bg-gray-900 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 text-white">
            <span class="w-2 h-2 rounded-full bg-[#EE5102] animate-pulse"></span>
            <span class="font-semibold text-gray-200">Playing Blog Video</span>
            <span v-if="article.videoCaption" class="text-gray-400 italic hidden sm:inline">&mdash; {{ article.videoCaption }}</span>
          </div>

          <div class="flex items-center gap-2.5">
            <button
              v-if="article.bannerImage || article.featuredImage"
              @click="isPlayingHeroVideo = false"
              type="button"
              class="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>Switch to Photo Banner</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mode 2: Hero Banner Image with "Play Video" In-Place Overlay -->
      <div v-else class="rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-gray-950 relative group">
        <!-- Interactive Play Video Overlay directly on the blog hero banner -->
        <button
          v-if="article.videoUrl"
          @click="isPlayingHeroVideo = true"
          type="button"
          class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/30 hover:bg-black/45 transition-all group/play cursor-pointer"
          aria-label="Play video directly on blog page"
        >
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-[#EE5102] flex items-center justify-center shadow-2xl group-hover/play:scale-110 group-hover/play:bg-[#EE5102] group-hover/play:text-white transition-all duration-300">
            <svg class="w-7 h-7 sm:w-9 sm:h-9 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <span class="mt-3 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold shadow-lg group-hover/play:bg-[#EE5102] transition-colors">
            Play Video on Page
          </span>
        </button>

        <a
          v-if="article.bannerLinkUrl && !article.videoUrl"
          :href="formatLinkUrl(article.bannerLinkUrl)"
          :target="isExternalUrl(article.bannerLinkUrl) ? '_blank' : '_self'"
          :rel="isExternalUrl(article.bannerLinkUrl) ? 'noopener noreferrer' : undefined"
          class="block relative"
        >
          <picture>
            <source
              v-if="article.bannerImageMobile"
              media="(max-width: 639px)"
              :srcset="useAsset(article.bannerImageMobile)"
            />
            <img
              :src="useAsset(article.bannerImage || article.featuredImage || article.bannerImageMobile)"
              :alt="article.bannerAlt || article.title"
              class="w-full h-auto aspect-[2/1] object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
            />
          </picture>
          <span class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium inline-flex items-center gap-1.5 opacity-90 group-hover:bg-[#EE5102] transition-colors shadow-sm">
            <span>Visit Link</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </span>
        </a>
        <picture v-else>
          <source
            v-if="article.bannerImageMobile"
            media="(max-width: 639px)"
            :srcset="useAsset(article.bannerImageMobile)"
          />
          <img
            :src="useAsset(article.bannerImage || article.featuredImage || article.bannerImageMobile)"
            :alt="article.bannerAlt || article.title"
            class="w-full h-auto aspect-[2/1] object-cover object-center"
          />
        </picture>
      </div>

      <div v-if="article.imageCaption || article.bannerCredit || article.videoUrl" class="mt-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs text-center">
        <p v-if="article.imageCaption" class="text-gray-500 italic">
          {{ article.imageCaption }}
        </p>
        <span v-if="article.imageCaption && (article.bannerCredit || article.videoUrl)" class="hidden sm:inline text-gray-300">•</span>
        <p v-if="article.bannerCredit" class="text-gray-400 font-medium">
          Source / Credit:
          <a
            v-if="article.bannerLinkUrl"
            :href="formatLinkUrl(article.bannerLinkUrl)"
            :target="isExternalUrl(article.bannerLinkUrl) ? '_blank' : '_self'"
            :rel="isExternalUrl(article.bannerLinkUrl) ? 'noopener noreferrer' : undefined"
            class="text-[#EE5102] hover:underline"
          >{{ article.bannerCredit }}</a>
          <span v-else class="text-gray-600">{{ article.bannerCredit }}</span>
        </p>
        <span v-if="article.videoUrl && !isPlayingHeroVideo" class="inline-flex items-center gap-1 text-[#EE5102] font-semibold cursor-pointer hover:underline" @click="isPlayingHeroVideo = true">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span>Watch Playable Video</span>
        </span>
      </div>
    </div>

    <!-- Optional Dedicated Blog Video Section (When not playing inside hero banner) -->
    <div v-if="article.videoUrl && !isPlayingHeroVideo" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
      <div class="rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-gray-950 border border-gray-100">
        <div class="aspect-video w-full bg-black relative">
          <iframe
            v-if="isEmbedVideo(article.videoUrl)"
            :src="getEmbedVideoUrl(article.videoUrl)"
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            :title="article.videoCaption || article.title"
          ></iframe>
          <video
            v-else
            :src="useAsset(article.videoUrl)"
            controls
            playsinline
            preload="metadata"
            class="w-full h-full object-contain bg-black"
          ></video>
        </div>
        <div v-if="article.videoCaption || article.videoCredit" class="p-3.5 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs text-center">
          <span v-if="article.videoCaption" class="text-gray-600 italic">{{ article.videoCaption }}</span>
          <span v-if="article.videoCaption && article.videoCredit" class="hidden sm:inline text-gray-300">•</span>
          <span v-if="article.videoCredit" class="text-gray-400 font-medium">Video Source / Credit: <strong class="font-medium text-gray-600">{{ article.videoCredit }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Main Content Layout (Table of Contents LHS + Article Body RHS) -->
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <!-- Sticky Table of Contents LHS (desktop) -->
        <aside v-if="tocItems.length > 0" class="hidden lg:block lg:col-span-3">
          <TableOfContents :items="tocItems" />
        </aside>

        <!-- Main Article Content RHS -->
        <main :class="tocItems.length > 0 ? 'lg:col-span-9 max-w-4xl' : 'lg:col-span-12 max-w-4xl mx-auto'" class="space-y-12">
          <!-- Mobile Table of Contents (collapsible) -->
          <div v-if="tocItems.length > 0" class="block lg:hidden">
            <TableOfContents :items="tocItems" />
          </div>

          <!-- Mode A: Structured CMS Sections -->
          <article v-if="article.sections && article.sections.length > 0" class="space-y-12">
            <section
              v-for="section in article.sections"
              :key="section.id"
              :id="section.id"
              class="scroll-mt-28 space-y-4"
            >
              <!-- Section Title -->
              <h2 class="text-2xl sm:text-[28px] font-medium text-gray-950 font-sans tracking-tight">
                {{ section.title }}
              </h2>

              <!-- Rich Markdown Content -->
              <MarkdownRenderer :content="section.content" />

              <!-- Mid-Article Embedded Image (Desktop & Mobile with Alt Tag, Optional Clickable URL & Credit) -->
              <figure
                v-if="section.image && (section.image.src || section.image.mobileSrc)"
                class="my-6 rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-950 group"
              >
                <a
                  v-if="section.image.linkUrl"
                  :href="formatLinkUrl(section.image.linkUrl)"
                  :target="isExternalUrl(section.image.linkUrl) ? '_blank' : '_self'"
                  :rel="isExternalUrl(section.image.linkUrl) ? 'noopener noreferrer' : undefined"
                  class="block relative overflow-hidden"
                >
                  <picture>
                    <source
                      v-if="section.image.mobileSrc"
                      media="(max-width: 639px)"
                      :srcset="useAsset(section.image.mobileSrc)"
                    />
                    <img
                      :src="useAsset(section.image.src || section.image.mobileSrc)"
                      :alt="section.image.alt || section.title"
                      class="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    />
                  </picture>
                  <span class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-sm text-white text-[11px] font-medium inline-flex items-center gap-1.5 opacity-90 group-hover:bg-[#EE5102] transition-colors shadow-sm">
                    <span>Visit Link</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </span>
                </a>
                <picture v-else>
                  <source
                    v-if="section.image.mobileSrc"
                    media="(max-width: 639px)"
                    :srcset="useAsset(section.image.mobileSrc)"
                  />
                  <img
                    :src="useAsset(section.image.src || section.image.mobileSrc)"
                    :alt="section.image.alt || section.title"
                    class="w-full h-auto object-cover"
                  />
                </picture>
                <figcaption
                  v-if="section.image.caption || section.image.credit"
                  class="p-3 text-xs bg-white border-t border-gray-100 text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3"
                >
                  <span v-if="section.image.caption" class="text-gray-500 italic">
                    {{ section.image.caption }}
                  </span>
                  <span v-if="section.image.caption && section.image.credit" class="hidden sm:inline text-gray-300">•</span>
                  <span v-if="section.image.credit" class="text-gray-400 font-medium">
                    Source / Credit:
                    <a
                      v-if="section.image.linkUrl"
                      :href="formatLinkUrl(section.image.linkUrl)"
                      :target="isExternalUrl(section.image.linkUrl) ? '_blank' : '_self'"
                      :rel="isExternalUrl(section.image.linkUrl) ? 'noopener noreferrer' : undefined"
                      class="text-[#EE5102] hover:underline"
                    >{{ section.image.credit }}</a>
                    <span v-else class="text-gray-600">{{ section.image.credit }}</span>
                  </span>
                </figcaption>
              </figure>

              <!-- Mid-Article Embedded Section Video (YouTube / Vimeo / Direct Video File) -->
              <figure
                v-if="section.video && section.video.src"
                class="my-6 rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-950"
              >
                <div class="aspect-video w-full bg-black relative">
                  <iframe
                    v-if="isEmbedVideo(section.video.src)"
                    :src="getEmbedVideoUrl(section.video.src)"
                    class="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    :title="section.video.caption || section.title"
                  ></iframe>
                  <video
                    v-else
                    :src="useAsset(section.video.src)"
                    :poster="section.video.poster ? useAsset(section.video.poster) : undefined"
                    controls
                    playsinline
                    preload="metadata"
                    class="w-full h-full object-contain bg-black"
                  ></video>
                </div>
                <figcaption
                  v-if="section.video.caption || section.video.credit"
                  class="p-3 text-xs bg-white border-t border-gray-100 text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3"
                >
                  <span v-if="section.video.caption" class="text-gray-500 italic">
                    {{ section.video.caption }}
                  </span>
                  <span v-if="section.video.caption && section.video.credit" class="hidden sm:inline text-gray-300">•</span>
                  <span v-if="section.video.credit" class="text-gray-400 font-medium">
                    Video Source / Credit: <span class="text-gray-600">{{ section.video.credit }}</span>
                  </span>
                </figcaption>
              </figure>

              <!-- Custom HTML Field (e.g. Modern Tech Meets Vintage Silicon Table) -->
              <div
                v-if="section.includeHtml !== false && section.htmlContent"
                v-html="sanitizeHtml(section.htmlContent)"
              ></div>

              <!-- Comparison Table Fallback -->
              <div v-else-if="section.comparisonTable" class="my-8 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr class="bg-[#EE5102] text-white">
                        <th
                          v-for="(header, hIdx) in section.comparisonTable.headers"
                          :key="hIdx"
                          class="py-3.5 px-4 sm:px-5 font-semibold text-xs tracking-wider"
                        >
                          {{ header }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 bg-white">
                      <tr
                        v-for="(row, rIdx) in section.comparisonTable.rows"
                        :key="rIdx"
                        :class="rIdx % 2 === 1 ? 'bg-orange-50/20' : 'bg-white'"
                        class="hover:bg-orange-50/40 transition-colors"
                      >
                        <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100 last:border-r-0">
                          {{ row[0] }}
                        </td>
                        <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100 last:border-r-0">
                          {{ row[1] }}
                        </td>
                        <td class="py-3.5 px-4 sm:px-5 text-gray-700">
                          {{ row[2] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Interactive Photo Gallery (Section-Level Fallback if Article-Level Gallery Not Used) -->
              <div v-if="(!article.galleryItems || article.galleryItems.length === 0) && section.gallery && section.gallery.length">
                <ArticleGallery
                  :images="section.gallery"
                  :caption="section.galleryCaption"
                />
              </div>

              <!-- Callout Box -->
              <div
                v-if="section.callout"
                class="p-5 rounded-2xl bg-gradient-to-r from-yberry-100 to-white border border-yberry-300 my-4 flex items-start space-x-3.5 shadow-sm"
              >
                <div class="w-8 h-8 rounded-full bg-[#EE5102] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-[#EE5102] mb-1">
                    {{ section.callout.title }}
                  </h4>
                  <p class="text-sm text-gray-800 leading-relaxed">
                    {{ section.callout.text }}
                  </p>
                </div>
              </div>
            </section>
          </article>

          <!-- Mode B: Direct Markdown Body from Headless CMS -->
          <article v-else-if="article.content" class="space-y-6">
            <MarkdownRenderer :content="article.content" />
          </article>

          <!-- Article-Level Photo Gallery (Up to 12 Images with Alt Tags) -->
          <div v-if="article.galleryItems && article.galleryItems.length > 0">
            <ArticleGallery
              :images="article.galleryItems"
              :caption="article.galleryCaption"
            />
          </div>

          <!-- Article Topics & Tags -->
          <div v-if="article.tags && article.tags.length > 0" class="pt-8 border-t border-gray-200">
            <span class="text-xs font-semibold text-gray-400 block mb-3 uppercase tracking-wider">
              Explore the full hardware archive:
            </span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-[#feeee6] hover:text-[#EE5102] transition-colors"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Share and Comments Bar -->
          <div class="pt-6 pb-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-2 text-xs text-gray-500">
              <span class="font-medium text-gray-700">Share this article:</span>
              <a
                :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#EE5102] hover:text-white text-gray-600 flex items-center justify-center transition-colors"
                aria-label="Share on X"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                :href="`https://www.linkedin.com/sharing/share-offsite/`"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#EE5102] hover:text-white text-gray-600 flex items-center justify-center transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <button
                @click="copyShareLink"
                class="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors flex items-center space-x-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                <span>{{ copied ? 'Link Copied!' : 'Copy Link' }}</span>
              </button>
            </div>

            <!-- Comments Badge (clickable jump to discussion) -->
            <a
              href="#comments"
              class="flex items-center space-x-1.5 text-xs text-[#EE5102] bg-orange-50 hover:bg-orange-100 px-3.5 py-1.5 rounded-full font-medium border border-[#EE5102]/20 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <span>{{ totalCommentsCount }} {{ totalCommentsCount === 1 ? 'Comment' : 'Comments' }}</span>
            </a>
          </div>

          <!-- Reader Discussion & Comments Section -->
          <BlogComments
            :article-id="article.id"
            :article-slug="article.slug"
            :article-title="article.title"
          />

          <!-- Related Stories Section -->
          <RelatedArticles :current-article="article" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Article } from '~/composables/useArticles'
import { useMarkdown, type TocItem } from '~/composables/useMarkdown'
import { useComments } from '~/composables/useComments'

const props = defineProps<{
  article: Article
}>()

const { extractHeadings, sanitizeHtml } = useMarkdown()
const { getArticleComments, fetchCommentsForArticle } = useComments()

const copied = ref(false)
const isPlayingHeroVideo = ref(false)

const commentsList = computed(() => {
  return getArticleComments(props.article.id || '', props.article.slug || '')
})

const totalCommentsCount = computed(() => commentsList.value.length)

onMounted(() => {
  if (props.article.id || props.article.slug) {
    fetchCommentsForArticle(props.article.id || props.article.slug)
  }
})

const formatLinkUrl = (url?: string): string => {
  if (!url) return '#'
  const trimmed = url.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:')
  ) {
    return trimmed
  }
  return `https://${trimmed}`
}

const isExternalUrl = (url?: string): boolean => {
  if (!url) return false
  const formatted = formatLinkUrl(url)
  return formatted.startsWith('http://') || formatted.startsWith('https://')
}

const isEmbedVideo = (url?: string): boolean => {
  if (!url) return false
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
}

const getEmbedVideoUrl = (url?: string, autoplay = false): string => {
  if (!url) return ''
  let trimmed = url.trim()

  // Extract src if iframe string was pasted
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const match = trimmed.match(/src=["']([^"']+)["']/)
    if (match && match[1]) {
      trimmed = match[1]
    }
  }

  let finalUrl = trimmed
  if (trimmed.includes('youtube.com/embed/')) {
    finalUrl = trimmed
  } else if (trimmed.includes('youtube.com/watch?v=')) {
    const id = trimmed.split('v=')[1]?.split('&')[0]
    finalUrl = id ? `https://www.youtube.com/embed/${id}` : trimmed
  } else if (trimmed.includes('youtube.com/shorts/')) {
    const id = trimmed.split('youtube.com/shorts/')[1]?.split('?')[0]?.split('/')[0]
    finalUrl = id ? `https://www.youtube.com/embed/${id}` : trimmed
  } else if (trimmed.includes('youtu.be/')) {
    const id = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0]
    finalUrl = id ? `https://www.youtube.com/embed/${id}` : trimmed
  } else if (trimmed.includes('vimeo.com/')) {
    if (trimmed.includes('player.vimeo.com/video/')) {
      finalUrl = trimmed
    } else {
      const id = trimmed.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0]
      finalUrl = id ? `https://player.vimeo.com/video/${id}` : trimmed
    }
  }

  if (autoplay && finalUrl) {
    const separator = finalUrl.includes('?') ? '&' : '?'
    finalUrl = `${finalUrl}${separator}autoplay=1`
  }

  return finalUrl
}

const copyShareLink = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  }
}

/**
 * Automatically compute Table of Contents items:
 * If article has structured sections, map their titles & IDs.
 * If article has a raw markdown content string (CMS body), extract ## headings dynamically!
 */
const tocItems = computed<TocItem[]>(() => {
  if (props.article.sections && props.article.sections.length > 0) {
    return props.article.sections.map(s => ({
      id: s.id,
      title: s.title
    }))
  }

  if (props.article.content) {
    return extractHeadings(props.article.content)
  }

  return []
})
</script>

