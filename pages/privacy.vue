<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb (Clean text links, no pill styling) -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-[#EE5102] transition-colors">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Privacy Policy</span>
      </nav>

      <!-- Main Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-sm space-y-10 font-sans text-gray-900">
        <!-- Header -->
        <header class="border-b border-gray-100 pb-8">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-2 h-2 rounded-full bg-[#EE5102]"></span>
            <span class="text-xs uppercase tracking-widest font-semibold text-[#EE5102]">
              Legal &amp; Regulatory Compliance
            </span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-medium text-gray-950 font-sans tracking-tight mb-3">
            Privacy Policy &amp; POPIA Act Compliance Statement
          </h1>
          <p class="text-xs text-gray-500">
            Effective Date: November 1, 2026 &bull; Last Revised: November 2026 &bull; Published by Headline Central
          </p>
        </header>

        <!-- Executive Summary Notice -->
        <div class="bg-gray-50 border-l-4 border-[#EE5102] p-5 rounded-r-2xl space-y-2">
          <h2 class="text-xs uppercase tracking-wider font-bold text-gray-950">Executive Commitment</h2>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Headline Central is committed to safeguarding personal information across all digital touchpoints. This policy outlines how we collect, store, process, and protect your data in strict compliance with the <strong>South African Protection of Personal Information Act (POPIA Act No. 4 of 2013)</strong>, the <strong>Promotion of Access to Information Act (PAIA)</strong>, and digital privacy standards.
          </p>
        </div>

        <!-- Section 1 -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">1. Data Controller / Responsible Party</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            The responsible party determining the purposes and means of processing personal data on this platform is:
          </p>
          <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-xs sm:text-sm text-gray-800 space-y-1">
            <p class="font-bold text-gray-950">Headline Central</p>
            <p>Support &amp; Inquiries: <a href="mailto:support@headlinecentral.co.za" class="text-[#EE5102] underline">support@headlinecentral.co.za</a></p>
          </div>
        </section>

        <!-- Section 2 -->
        <section class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-950">2. Categories of Information We Collect</h2>
          <div class="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>A. Voluntarily Disclosed Data:</strong> When you subscribe to our daily news briefing, submit an investigative pitch, contact our bureau, or apply for credentials, you may provide your full name, email address, and professional affiliation.
            </p>
            <p>
              <strong>B. Automated Technical Telemetry:</strong> When navigating our publications, our edge servers automatically register non-personally identifiable diagnostic headers: masked IP addresses (anonymized at transmission), operating system, browser user-agent, referring URLs, time spent per investigative article, and interaction timestamps.
            </p>
            <p>
              <strong>C. Content Preferences &amp; Local Storage:</strong> Layout modes, bookmark lists, and cookie consent records are stored locally within your browser’s <code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">localStorage</code> and never cross-referenced with third-party consumer brokers.
            </p>
          </div>
        </section>

        <!-- Section 3 -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">3. Legal Bases for Data Processing</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Under Section 11 of the South African Protection of Personal Information Act (POPIA) and established digital privacy standards, we process personal information strictly under the following lawful conditions:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li><strong>Consent:</strong> When you affirmatively subscribe to newsletters or opt in to performance cookies.</li>
            <li><strong>Legitimate Interests:</strong> To maintain server integrity, investigate fraudulent cyber intrusion attempts, enforce copyright protections, and improve editorial depth.</li>
            <li><strong>Contractual &amp; Operational Necessity:</strong> To process commercial sponsorship agreements or respond to direct newsroom inquiries.</li>
            <li><strong>Statutory Compliance:</strong> When required by South African press ombudsman regulations or court orders issued by competent jurisdictions.</li>
          </ul>
        </section>

        <!-- Section 4: South Africa POPIA & PAIA -->
        <section class="space-y-3 bg-gray-50/80 p-6 rounded-2xl border border-gray-200">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-2.5 rounded-full bg-[#EE5102]"></span>
            <h2 class="text-lg font-bold text-gray-950">4. South African Citizens: POPIA &amp; PAIA Rights</h2>
          </div>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
            In terms of the <strong>Protection of Personal Information Act, 2013 (Act No. 4 of 2013)</strong> and the <strong>Promotion of Access to Information Act, 2000 (Act No. 2 of 2000)</strong>, South African data subjects enjoy explicit statutory protections:
          </p>
          <ul class="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li><strong>Right of Access &amp; Correction:</strong> You may request confirmation of personal records held by Headline Central and demand rectification of outdated or inaccurate information.</li>
            <li><strong>Right to Object &amp; Erasure:</strong> You may object to the processing of personal information on reasonable grounds relating to your particular situation and demand deletion.</li>
            <li><strong>Transborder Information Flows:</strong> Cross-border hosting via Google Firebase/Firestore adheres strictly to Section 72 of POPIA, ensuring recipient jurisdictions maintain equivalent data privacy laws.</li>
            <li><strong>Regulatory Recourse:</strong> Should you believe your data has been handled contrary to POPIA, you have the right to lodge a complaint directly with the <strong>Information Regulator of South Africa</strong> (<a href="mailto:POPIAComplaints@inforegulator.org.za" class="text-[#EE5102] underline">POPIAComplaints@inforegulator.org.za</a>).</li>
          </ul>
        </section>

        <!-- Section 5: Advertising & Editorial Independence -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">5. Advertising Disclosures, Google AdSense &amp; Affiliate Transparency</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Headline Central sustains independent investigative journalism through vetted brand sponsorships, programmatic display units, and Google AdSense:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-2 leading-relaxed">
            <li>
              <strong>Google AdSense Third-Party Cookies:</strong> Third-party vendors, including Google, use cookies to serve advertisements based on a user's prior visits to this website or other internet websites. Google's use of advertising cookies enables it and its advertising exchange partners to serve contextual and interest-based ads to readers.
            </li>
            <li>
              <strong>Opting Out of Personalized Google Advertising:</strong> Readers may opt out of personalized advertising at any time by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" class="text-[#EE5102] underline">Google Ads Settings</a> or through the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" class="text-[#EE5102] underline">AboutAds Consumer Choice tool</a>. Alternatively, you may disable Targeting &amp; Advertising cookies via our <NuxtLink to="/cookies" class="text-[#EE5102] underline">Cookie Preferences</NuxtLink>.
            </li>
            <li>
              <strong>Editorial Isolation:</strong> Commercial partners, programmatic exchanges, and ad networks have zero oversight, preview rights, or veto power over newsroom coverage or product reviews.
            </li>
            <li>
              <strong>Affiliate Commissions:</strong> Select buying guides and hardware articles include affiliate tracking tags. When you purchase through these vetted links, we may receive an affiliate commission at no incremental cost to you.
            </li>
          </ul>
        </section>

        <!-- Section 6: Cookies & Telemetry -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">6. Cookie Governance &amp; Preference Controls</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            We categorize cookies into Strictly Necessary, Analytics &amp; Performance, Functional, and Targeting &amp; Advertising. You can adjust your consent choices at any time through our interactive <NuxtLink to="/cookies" class="text-[#EE5102] underline font-medium">Cookie Policy &amp; Consent Center</NuxtLink>.
          </p>
        </section>

        <!-- Section 7: Retention & Security -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">7. Data Retention &amp; Cryptographic Security</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            All personal information is stored on SOC-2 and ISO 27001 certified Google Cloud Firestore infrastructure utilizing AES-256 encryption at rest and TLS 1.3 encryption in transit. Diagnostic server logs are purged after 90 days, while newsletter records are maintained only until you initiate unsubscription.
          </p>
        </section>

        <!-- Section 8: Contact Information Officer -->
        <section class="space-y-3 border-t border-gray-100 pt-8">
          <h2 class="text-xl font-semibold text-gray-950">8. Contact Our Information Officer</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            For any queries regarding this Privacy Policy or to exercise your statutory rights under the POPIA Act, contact our Compliance Bureau:
          </p>
          <div class="text-sm text-gray-700 space-y-1">
            <p><strong>Email:</strong> <a href="mailto:support@headlinecentral.co.za" class="text-[#EE5102] underline">support@headlinecentral.co.za</a></p>
            <p><strong>Response Commitment:</strong> Written acknowledgment within 48 hours; full resolution within 30 days.</p>
          </div>
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
