<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-yberry-1000">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Privacy Policy</span>
      </nav>

      <!-- Main Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-sm space-y-8 font-sans">
        <header class="border-b border-gray-100 pb-6">
          <span class="text-xs uppercase tracking-widest font-semibold text-yberry-1000 block mb-2">
            Legal Transparency
          </span>
          <h1 class="text-3xl sm:text-4xl font-medium text-gray-950 font-sans tracking-tight mb-2">
            Privacy Policy &amp; Data Practices
          </h1>
          <p class="text-xs text-gray-500">
            Effective Date: November 1, 2026 • Last Reviewed: November 2026
          </p>
        </header>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">1. Information We Collect</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            At Headline Central, we respect the privacy of our readers. We collect personal information only when voluntarily provided (for example, when you subscribe to our daily newsletter or submit a tip via our contact form). Such data typically includes your name and email address.
          </p>
          <p class="text-sm text-gray-700 leading-relaxed">
            Additionally, our web servers collect standard, non-identifying telemetry: IP addresses (anonymized), browser types, referring pages, and timestamp data to diagnose infrastructure performance and combat malicious scraping.
          </p>
        </section>

        <!-- Explicit Advertising Disclosure required by Image 1 -->
        <section id="advertising" class="space-y-3 bg-yberry-100/50 p-6 rounded-2xl border border-yberry-300">
          <div class="flex items-center space-x-2 text-yberry-1000 mb-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <h2 class="text-lg font-bold text-gray-950">2. Advertising &amp; Commercial Partnerships Disclosure</h2>
          </div>
          <p class="text-xs sm:text-sm text-gray-800 leading-relaxed">
            To provide high-quality journalism without requiring a mandatory paywall, Headline Central displays display advertising units (such as Google AdSense, programmatic exchange banners, and vetted direct brand sponsors).
          </p>
          <ul class="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-1.5">
            <li><strong>Third-Party Ad Networks:</strong> Third-party ad vendors, including Google, use cookies to serve ads based on prior visits to this and other websites.</li>
            <li><strong>Affiliate Links:</strong> Some articles covering tools, culinary gear, or home renovation hardware may include affiliate tracking links. If you purchase through these links, we may earn an affiliate commission at no extra cost to you.</li>
            <li><strong>Sponsor Isolation:</strong> Commercial partners have no editorial control over our reporting, product critiques, or ranking algorithms.</li>
          </ul>
        </section>

        <section id="cookies" class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">3. Cookies &amp; Tracking Technologies</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            We use essential session cookies for layout preferences and fraud prevention. You may disable cookies through your web browser preferences; however, doing so may affect interactive features of the website.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">4. Your Rights (GDPR &amp; CCPA)</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Regardless of your geographic jurisdiction, you have the right to request access to any personal data we hold about you, request immediate deletion of your email subscription, or object to data processing. To exercise these rights, submit a request through our <NuxtLink to="/contact" class="text-yberry-1000 underline">Contact Desk</NuxtLink>.
          </p>
        </section>

        <section class="space-y-3 border-t border-gray-100 pt-6">
          <h2 class="text-xl font-semibold text-gray-950">5. Contact Our Data Protection Officer</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            If you have questions regarding this Privacy Policy, please email <a href="mailto:privacy@headlinecentral.com" class="text-yberry-1000 underline">privacy@headlinecentral.com</a>.
          </p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteSeo } from '~/composables/useSiteSeo'

const { applyPageSeo } = useSiteSeo()
applyPageSeo('privacy')
</script>

