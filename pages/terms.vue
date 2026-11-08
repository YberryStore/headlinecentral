<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb (Clean text links, no pill styling) -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-[#EE5102] transition-colors">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Terms &amp; Conditions</span>
      </nav>

      <!-- Main Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-sm space-y-10 font-sans text-gray-900">
        <!-- Header -->
        <header class="border-b border-gray-100 pb-8">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-2 h-2 rounded-full bg-[#EE5102]"></span>
            <span class="text-xs uppercase tracking-widest font-semibold text-[#EE5102]">
              User Agreement &amp; Publishing Code
            </span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-medium text-gray-950 font-sans tracking-tight mb-3">
            Terms &amp; Conditions of Digital Service
          </h1>
          <p class="text-xs text-gray-500">
            Effective Date: November 1, 2026 &bull; Published by Headline Central &bull; Governed by the Laws of the Republic of South Africa
          </p>
        </header>

        <!-- Preamble Callout -->
        <div class="bg-gray-50 border-l-4 border-[#EE5102] p-5 rounded-r-2xl space-y-2">
          <h2 class="text-xs uppercase tracking-wider font-bold text-gray-950">Binding Legal Agreement</h2>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Please read these Terms and Conditions carefully before browsing, referencing, or utilizing Headline Central (<a href="https://headlinecentral.co.za" class="underline text-gray-900 font-medium">headlinecentral.co.za</a>). By accessing our publications, newsletters, or digital archives, you agree to be bound by these provisions and our Privacy Policy.
          </p>
        </div>

        <!-- Section 1 -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">1. Acceptance &amp; Eligibility</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            By accessing or using Headline Central, you represent that you are at least 18 years of age or possess legal parental/guardian consent, and that you hold full legal capacity to enter into these Terms. If you do not agree to every term contained herein, your sole remedy is to cease accessing the platform immediately.
          </p>
        </section>

        <!-- Section 2: Intellectual Property -->
        <section class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-950">2. Intellectual Property, Copyright &amp; Fair Quotation</h2>
          <div class="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>
              <strong>A. Proprietary Rights:</strong> All original news reports, technical architectural diagrams, high-resolution media banners, photo galleries, brand marks, and underlying codebase comprising Headline Central are the exclusive property of Headline Central, protected under South African Copyright Act (Act 98 of 1978), the Berne Convention, and international intellectual property treaties.
            </p>
            <p>
              <strong>B. Fair Use Quotation:</strong> Editorial publications and independent journalists may quote up to seventy-five (75) consecutive words of an article, provided that clear verbal attribution is rendered and an active, clickable hyperlink is provided directly to the source article on Headline Central.
            </p>
            <p>
              <strong>C. Artificial Intelligence &amp; Data Mining Prohibition:</strong> Wholesale scraping, harvesting, automated parsing, or ingestion of Headline Central content for the purpose of training artificial intelligence, large language models, or automated news summarization systems without an explicit, negotiated written licensing contract is strictly prohibited and constitutes copyright infringement.
            </p>
          </div>
        </section>

        <!-- Section 3: User Contributions & Pitches -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">3. User Communications &amp; Story Pitches</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            When you transmit comments, investigative leads, feedback, or editorial pitches to our newsroom:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li>You warrant that all submitted materials are accurate, non-defamatory, and do not infringe any third-party trade secrets or non-disclosure agreements.</li>
            <li>You grant Headline Central an irrevocable, non-exclusive license to review and publish submitted pitches in accordance with professional journalism confidentiality agreements.</li>
            <li>Headline Central reserves the absolute discretion to edit, archive, or decline submissions that fail to meet editorial verification standards.</li>
          </ul>
        </section>

        <!-- Section 4: Editorial Independence & Disclaimers -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">4. Professional &amp; Practical Advice Disclaimers</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Headline Central publishes reported journalism, technical retrospective analysis, culinary crafts, and home renovation tutorials:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li><strong>Hardware &amp; Electrical DIY:</strong> Articles describing compute hardware, power distribution, thermal paste application, or carpentry reflect journalistic demonstrations. High-voltage electrical work and structural renovations must always be performed or verified by certified, licensed tradespersons.</li>
            <li><strong>Health &amp; Parenting:</strong> Features in our Parenting and Food sections represent informed editorial exploration and cannot substitute for qualified pediatric, psychological, or medical consultation.</li>
            <li><strong>Financial &amp; Investment Independence:</strong> Coverage of enterprise technology companies, GPU markets, or consumer electronics does not constitute financial advice or securities recommendations.</li>
          </ul>
        </section>

        <!-- Section 5: Advertising & Links -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">5. External Hyperlinks &amp; Sponsored Advertising</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Headline Central may contain links to external third-party domains, manufacturer specifications, and commercial sponsors. We exercise no editorial control over external platforms and assume no liability for their contents, terms of service, or privacy practices. Interaction with commercial banner sponsors is conducted strictly between you and the respective advertiser.
          </p>
        </section>

        <!-- Section 6: Prohibited Conduct -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">6. Prohibited Conduct &amp; Cybersecurity Protections</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            You agree not to engage in any activity that impairs or disrupts Headline Central infrastructure:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li>Attempting unauthorized access to CMS administrative terminals, Firebase databases, or user accounts.</li>
            <li>Conducting distributed denial-of-service (DDoS) attacks, brute-force credential stuffing, or server stress tests.</li>
            <li>Impersonating Headline Central editors, contributors, or authorized administrative personnel.</li>
            <li>Injecting cross-site scripting (XSS), malicious payloads, or executable scripts via contact transmission forms.</li>
          </ul>
        </section>

        <!-- Section 7: Warranties & Limitation of Liability -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">7. Disclaimer of Warranties &amp; Limitation of Liability</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            To the maximum extent permitted under South African law and applicable international jurisdictions, Headline Central is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis, without express or implied warranties of any kind.
          </p>
          <p class="text-sm text-gray-700 leading-relaxed">
            In no event shall Headline Central, its directors, editors, writers, or affiliates be liable for indirect, punitive, incidental, or consequential damages resulting from your access to, or inability to access, the website or reliance on editorial content.
          </p>
        </section>

        <!-- Section 8: Indemnification -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">8. Indemnification</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            You agree to defend, indemnify, and hold harmless Headline Central, its editorial staff, contractors, and agents from any claims, liabilities, damages, or costs (including legal fees) arising from your violation of these Terms or unauthorized exploitation of platform assets.
          </p>
        </section>

        <!-- Section 9: Governing Law -->
        <section class="space-y-3 bg-gray-50/80 p-6 rounded-2xl border border-gray-200">
          <h2 class="text-lg font-bold text-gray-950">9. Governing Law &amp; Jurisdiction</h2>
          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
            These Terms and Conditions are governed by and construed in accordance with the substantive laws of the <strong>Republic of South Africa</strong>, without regard to conflict-of-law principles. Any legal disputes arising in connection with Headline Central shall be subject to the exclusive jurisdiction of the competent courts of the <strong>Republic of South Africa</strong>.
          </p>
        </section>

        <!-- Section 10: Amendments & Contact -->
        <section class="space-y-3 border-t border-gray-100 pt-8">
          <h2 class="text-xl font-semibold text-gray-950">10. Modifications &amp; Legal Desk Contact</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            We reserve the right to revise these Terms periodically to mirror evolving digital media laws. Continued usage following publication constitutes acceptance of updated terms.
          </p>
          <div class="text-sm text-gray-700 space-y-1 pt-2">
            <p><strong>Legal &amp; Syndication Inquiries:</strong> <a href="mailto:support@headlinecentral.co.za" class="text-[#EE5102] underline">support@headlinecentral.co.za</a></p>
            <p><strong>Newsroom Desk:</strong> <NuxtLink to="/contact" class="text-[#EE5102] underline">Contact Editorial Bureau</NuxtLink></p>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteSeo } from '~/composables/useSiteSeo'

const { applyPageSeo } = useSiteSeo()
applyPageSeo('terms')
</script>
