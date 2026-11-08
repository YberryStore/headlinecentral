<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-yberry-1000">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">About Us</span>
      </nav>

      <!-- Hero Header -->
      <header class="text-center max-w-3xl mx-auto mb-14">
        <span class="text-xs uppercase tracking-widest font-semibold text-yberry-1000 block mb-2">
          Our Mission &amp; Ethics
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-950 font-sans tracking-tight mb-4">
          Journalism Rooted in Depth, Clarity &amp; Craft
        </h1>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
          Headline Central was founded on a simple conviction: in an era of superficial soundbites and automated noise, thoughtful readers crave rigor, nuance, and hands-on truth.
        </p>
      </header>

      <!-- Key Pillars (Establish Credibility) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div class="w-12 h-12 rounded-xl bg-yberry-100 text-yberry-1000 flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-950 mb-2 font-sans">First-Hand Verification</h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            Every tech architecture we cover is tested in real sandbox environments; every recipe is baked across varying ovens; every DIY blueprint is built before publishing.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div class="w-12 h-12 rounded-xl bg-yberry-100 text-yberry-1000 flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-950 mb-2 font-sans">Complete Editorial Independence</h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            Our newsroom maintains an unbreachable wall between editorial content and commercial sponsorship. Advertisers never influence article conclusions or rankings.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div class="w-12 h-12 rounded-xl bg-yberry-100 text-yberry-1000 flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-950 mb-2 font-sans">Transparent Correction Policy</h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            If we make an error, we correct it promptly and visibly at the top of the relevant article, documenting precisely what was updated and when.
          </p>
        </div>
      </div>

      <!-- Masthead / Writers -->
      <section class="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm mb-16">
        <h2 class="text-2xl sm:text-3xl font-medium text-gray-950 font-sans tracking-tight mb-8">
          The Masthead &amp; Senior Contributors
        </h2>

        <div class="max-w-xl">
          <div class="flex items-start space-x-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <img
              src="/images/author-marcus.jpg"
              alt="Dr. Marcus Vance"
              class="w-16 h-16 rounded-xl object-cover ring-2 ring-yberry-300 flex-shrink-0"
            />
            <div>
              <h4 class="font-bold text-gray-900 text-base font-sans">Dr. Marcus Vance</h4>
              <p class="text-xs text-yberry-1000 font-medium mb-1">Principal Technology &amp; Hardware Editor</p>
              <p class="text-xs text-gray-600 leading-relaxed">
                PhD in Distributed Systems. 15+ years investigating neural computing architectures, GPU milestones, and high-performance computing hardware.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Banner -->
      <div class="text-center py-10 bg-yberry-100/60 rounded-3xl border border-yberry-300">
        <h3 class="text-xl font-bold text-gray-900 font-sans mb-2">Have a Story Pitch or Question?</h3>
        <p class="text-sm text-gray-600 mb-6 max-w-md mx-auto">Our editors review independent tips, research submissions, and corrections daily.</p>
        <NuxtLink to="/contact" class="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-sm text-white bg-[#EE5102] hover:bg-[#d84802] transition-colors shadow-sm">
          Contact Our Editorial Desk
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteSeo } from '~/composables/useSiteSeo'

const { applyPageSeo } = useSiteSeo()
applyPageSeo('about')
</script>

