<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb (Clean text links, no pill styling) -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-[#EE5102] transition-colors">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Editorial Policy</span>
      </nav>

      <!-- Main Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-sm space-y-10 font-sans text-gray-900">
        <!-- Header -->
        <header class="border-b border-gray-100 pb-8">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-2 h-2 rounded-full bg-[#EE5102]"></span>
            <span class="text-xs uppercase tracking-widest font-semibold text-[#EE5102]">
              Journalistic Standards &amp; Verification
            </span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-medium text-gray-950 font-sans tracking-tight mb-3">
            Editorial Policy, Ethics &amp; Correction Standards
          </h1>
          <p class="text-xs text-gray-500">
            Published by Headline Central &bull; Last Revised: November 2026 &bull; Adhering to the South African Press Code
          </p>
        </header>

        <!-- Mission Preamble -->
        <div class="bg-gray-50 border-l-4 border-[#EE5102] p-5 rounded-r-2xl space-y-2">
          <h2 class="text-xs uppercase tracking-wider font-bold text-gray-950">Editorial Charter</h2>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Headline Central is committed to independent, rigorously verified, and accessible digital journalism. We report on breakthrough computing technologies, global public policy, cultural shifts, and practical craftsmanship with uncompromised integrity.
          </p>
        </div>

        <!-- Section 1: Verification -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">1. Fact-Checking &amp; Primary Source Verification</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Our newsroom operates on the fundamental standard that information must be verified before dissemination:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li><strong>Two-Source Requirement:</strong> Factual assertions involving investigative claims or regulatory policy require at least two independent corroborating sources.</li>
            <li><strong>Hands-On Benchmarking:</strong> In our Technology, DIY, and Hardware sections, performance claims, power draws, and thermal metrics are tested and documented in our internal testbed environments before publication.</li>
            <li><strong>Direct Attribution:</strong> Quotations, research papers, statistical surveys, and court records are cited directly with contextual hyperlinks to original primary documents.</li>
          </ul>
        </section>

        <!-- Section 2: Corrections Policy -->
        <section class="space-y-3 bg-gray-50/80 p-6 rounded-2xl border border-gray-200">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-[#EE5102]"></span>
            <h2 class="text-lg font-bold text-gray-950">2. Transparent Corrections Policy</h2>
          </div>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
            When factual inaccuracies occur, Headline Central corrects them promptly, prominently, and transparently:
          </p>
          <ul class="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li><strong>Correction Notes:</strong> Substantive corrections are marked with a prominent note at the top of the article detailing the error, what was amended, and the precise timestamp.</li>
            <li><strong>No Stealth Edits:</strong> We do not silently rewrite articles to mask journalistic mistakes. Minor typographical updates that do not alter factual meaning are corrected immediately.</li>
            <li><strong>Reporting Errors:</strong> If you believe an article contains a factual error, email our dedicated desk at <a href="mailto:support@headlinecentral.co.za" class="text-[#EE5102] underline">support@headlinecentral.co.za</a> with the article URL and supporting evidence.</li>
          </ul>
        </section>

        <!-- Section 3: Commercial Independence -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">3. Commercial Independence &amp; Ad Neutrality</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Headline Central maintains an unyielding partition between editorial decision-making and commercial revenue streams:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li><strong>Zero Commercial Influence:</strong> Advertisers, commercial sponsors, and programmatic ad networks have zero editorial preview rights, zero influence on story selection, and zero power to alter journalist evaluations.</li>
            <li><strong>Review Units &amp; Loaners:</strong> Hardware components or software licenses provided by manufacturers for evaluation are accepted strictly on loan or under standard press terms. We never accept paid reviews or favorable coverage guarantees.</li>
            <li><strong>Sponsored Content Labeling:</strong> Any commercial content or co-created brand feature is distinctly and unmistakably labeled as "Sponsored Feature" or "Paid Partnership" in accordance with advertising authority regulations.</li>
          </ul>
        </section>

        <!-- Section 4: AI & Machine Intelligence Standards -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">4. Artificial Intelligence &amp; Generative Content Standards</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            While Headline Central covers machine intelligence and automated systems rigorously as an editorial subject, we adhere to clear newsroom standards regarding its operational use:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li><strong>Human Authorship &amp; Accountability:</strong> Every investigative report, opinion column, and tutorial published on Headline Central is written, reviewed, and verified by human contributors and editors.</li>
            <li><strong>No Synthetic Byline Deception:</strong> We do not publish automated, unvetted AI-generated text under fake bylines or synthetic persona avatars.</li>
            <li><strong>Diagnostic Assistance:</strong> When machine-learning tools are utilized for computational dataset analysis or translation assistance, the methodology is disclosed within the piece.</li>
          </ul>
        </section>

        <!-- Section 5: South African Press Code -->
        <section class="space-y-3 bg-gray-50/80 p-6 rounded-2xl border border-gray-200">
          <h2 class="text-lg font-bold text-gray-950">5. Commitment to the South African Press Code</h2>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Headline Central subscribes to the South African Press Code, which prescribes that our journalism must be fair, accurate, balanced, and independent. We respect the privacy of individuals, safeguard confidential journalistic sources, and commit to presenting opposing viewpoints when reporting on controversial public affairs.
          </p>
        </section>

        <!-- Section 6: Editorial Desk Contact -->
        <section class="space-y-3 border-t border-gray-100 pt-8">
          <h2 class="text-xl font-semibold text-gray-950">6. Contact Our Editorial Board</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            For news tips, syndicate licensing, or editorial oversight inquiries:
          </p>
          <div class="text-sm text-gray-700 space-y-1">
            <p><strong>Newsroom &amp; Editorial Inquiries:</strong> <a href="mailto:support@headlinecentral.co.za" class="text-[#EE5102] underline">support@headlinecentral.co.za</a></p>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteSeo } from '~/composables/useSiteSeo'

const { applyPageSeo } = useSiteSeo()
applyPageSeo('editorial-policy')
</script>

