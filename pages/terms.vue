<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-yberry-1000">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Terms &amp; Conditions</span>
      </nav>

      <!-- Main Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-sm space-y-8 font-sans">
        <header class="border-b border-gray-100 pb-6">
          <span class="text-xs uppercase tracking-widest font-semibold text-yberry-1000 block mb-2">
            Usage Agreement
          </span>
          <h1 class="text-3xl sm:text-4xl font-medium text-gray-950 font-sans tracking-tight mb-2">
            Terms &amp; Conditions of Website Usage
          </h1>
          <p class="text-xs text-gray-500">
            Effective Date: November 1, 2026 • Headline Central Media Group
          </p>
        </header>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">1. Acceptance of Terms</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            By accessing, reading, or navigating Headline Central ("the Website"), you agree to be bound by these Terms and Conditions. If you disagree with any portion of these terms, your sole remedy is to discontinue using the Website.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">2. Intellectual Property Rights</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            All original text, bespoke editorial illustrations, photographic media, interface designs, logos, and software code on Headline Central are protected by international copyright, trademark, and intellectual property laws.
          </p>
          <p class="text-sm text-gray-700 leading-relaxed">
            You may quote brief excerpts (up to 75 words) with clear attribution and a direct clickable hyperlink back to the original article on Headline Central. Full republication or wholesale syndication without written permission is strictly prohibited.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">3. User Conduct &amp; Prohibited Uses</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            You agree not to use the Website to:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Engage in aggressive automated scraping that burdens server infrastructure.</li>
            <li>Submit fraudulent news tips, impersonate journalists, or distribute malicious code.</li>
            <li>Bypass rate limits, paywalls, or digital security controls.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">4. Editorial Disclaimers &amp; Limitation of Liability</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Articles in our Home &amp; DIY, Food, and Parenting sections represent informed editorial opinion and practical experience. However, home renovations, electrical work, and child health decisions should always be evaluated with appropriate certified professionals. Headline Central assumes no liability for injuries, property damage, or financial outcomes resulting from following editorial tutorials.
          </p>
        </section>

        <section class="space-y-3 border-t border-gray-100 pt-6">
          <h2 class="text-xl font-semibold text-gray-950">5. Governing Law</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            These terms are governed by and construed in accordance with standard commercial publication practices. Inquiries regarding legal syndication should be directed to <NuxtLink to="/contact" class="text-yberry-1000 underline">our legal desk</NuxtLink>.
          </p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Terms & Conditions — Headline Central',
  meta: [
    { name: 'description', content: 'Terms and conditions governing the usage and syndication of Headline Central content.' }
  ]
})
</script>

