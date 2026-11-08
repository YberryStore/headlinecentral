<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb (Clean text links, no pill styling) -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-[#EE5102] transition-colors">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Cookie Policy</span>
      </nav>

      <!-- Main Document Card -->
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-sm space-y-10 font-sans text-gray-900">
        <!-- Header -->
        <header class="border-b border-gray-100 pb-8">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block w-2 h-2 rounded-full bg-[#EE5102]"></span>
            <span class="text-xs uppercase tracking-widest font-semibold text-[#EE5102]">
              Transparency &amp; Consent Management
            </span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-medium text-gray-950 font-sans tracking-tight mb-3">
            Cookie Policy &amp; Regional Compliance Controls
          </h1>
          <p class="text-xs text-gray-500">
            Effective Date: November 1, 2026 &bull; Compliant with POPIA (South Africa), GDPR (EU), CCPA/CPRA (USA), and APAC Privacy Acts
          </p>
        </header>

        <!-- INTERACTIVE COOKIE PREFERENCE CONTROLLER (Embedded directly on page with toggles) -->
        <section class="bg-gray-50 border-2 border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#EE5102]">Interactive Controls</span>
              <h2 class="text-xl font-bold text-gray-950 mt-0.5">Your Cookie Consent Settings</h2>
              <p class="text-xs text-gray-500 mt-1">
                Toggle options below to customize which tracking technologies you authorize.
              </p>
            </div>
            <!-- Status Badge (Clean rectangle, not pill) -->
            <div class="flex items-center gap-2 bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl text-xs font-medium self-start sm:self-auto">
              <span
                class="w-2 h-2 rounded-full"
                :class="hasConsented ? 'bg-emerald-500' : 'bg-amber-400'"
              ></span>
              <span class="text-gray-800">
                {{ hasConsented ? 'Consent Active' : 'Default Non-Essential Blocked' }}
              </span>
            </div>
          </div>

          <!-- Regional Framework Coverage Notice -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div class="bg-white p-3 rounded-xl border border-gray-200">
              <span class="block font-bold text-gray-900 text-xs">South Africa</span>
              <span class="text-[11px] text-gray-500">POPIA Section 11</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-200">
              <span class="block font-bold text-gray-900 text-xs">European Union</span>
              <span class="text-[11px] text-gray-500">GDPR &amp; ePrivacy</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-200">
              <span class="block font-bold text-gray-900 text-xs">United States</span>
              <span class="text-[11px] text-gray-500">CCPA / CPRA</span>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-200">
              <span class="block font-bold text-gray-900 text-xs">Asia-Pacific</span>
              <span class="text-[11px] text-gray-500">PDPA &amp; APPI</span>
            </div>
          </div>

          <!-- The 4 Categorized Toggles -->
          <div class="space-y-4">
            <!-- 1. Strictly Necessary (Locked ON) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <h3 class="text-sm font-semibold text-gray-950">1. Strictly Necessary &amp; Security Cookies</h3>
                  <span class="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                    Always Required
                  </span>
                </div>
                <!-- Locked toggle -->
                <div class="w-11 h-6 bg-[#EE5102] rounded-full opacity-60 cursor-not-allowed flex items-center justify-end px-1" title="Required for website function">
                  <div class="w-4 h-4 rounded-full bg-white shadow"></div>
                </div>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Mandatory for session continuity, authentication security, network rate-limiting, and terminal gatekeeping. In accordance with South African POPIA Section 11 and EU ePrivacy Directive Article 5(3), these cookies do not require prior opt-in.
              </p>
            </div>

            <!-- 2. Performance & Analytical Cookies (Toggleable) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 space-y-2 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-gray-950">2. Performance &amp; Analytics Cookies</h3>
                  <p class="text-[11px] text-gray-500">Google Analytics 4 &amp; Google Tag Manager</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="pagePreferences.analytics"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Allows our editorial analytics team to measure audience engagement, assess reading duration across investigative pieces, and identify infrastructure bottlenecks with anonymized IP addresses.
              </p>
            </div>

            <!-- 3. Functionality & Customization Cookies (Toggleable) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 space-y-2 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-gray-950">3. Functionality &amp; Reader Customization</h3>
                  <p class="text-[11px] text-gray-500">Preserves layout mode, bookmarks &amp; reading preferences</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="pagePreferences.functional"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Remembers your display preferences, customized sidebar status, and acknowledged notifications across your browsing sessions.
              </p>
            </div>

            <!-- 4. Targeting & Advertising Cookies (Toggleable, CCPA opt-out) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 space-y-2 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-semibold text-gray-950">4. Targeting &amp; Advertising Cookies</h3>
                    <span class="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      US CCPA Opt-Out
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-500">Meta Pixel, Google AdSense &amp; commercial sponsor units</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="pagePreferences.advertising"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Empowers delivery of relevant advertising and verifies sponsor campaign reach. Turning this toggle <strong>OFF</strong> satisfies your statutory <strong>"Do Not Sell or Share My Personal Information"</strong> election under the California Consumer Privacy Act (CCPA/CPRA).
              </p>
            </div>
          </div>

          <!-- Action Buttons (Clean rectangular buttons, NO pills) -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span v-if="saveMessage" class="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              {{ saveMessage }}
            </span>
            <span v-else class="text-xs text-gray-500">
              Preferences are saved immediately to your browser.
            </span>

            <div class="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                @click="handleRejectAll"
                type="button"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                Reject Non-Essential
              </button>
              <button
                @click="handleSave"
                type="button"
                class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </section>

        <!-- Section 1: What Are Cookies -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">1. What Are Cookies &amp; Tracking Technologies?</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Cookies are compact text files placed onto your computer, tablet, or smartphone by website servers. They permit the site to identify your device upon subsequent visits, retain navigation preferences, and authenticate secure sessions.
          </p>
          <p class="text-sm text-gray-700 leading-relaxed">
            Headline Central also utilizes contemporary web storage mechanisms such as <code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">localStorage</code> and <code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">sessionStorage</code>. These operate locally inside your browser client without sending unencrypted headers across every HTTP request, enhancing digital security.
          </p>
        </section>

        <!-- Section 2: Detailed Cookie Inventory Table -->
        <section class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-950">2. Complete Inventory of Cookies Employed</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Below is the comprehensive audit of all cookies and storage keys utilized by Headline Central:
          </p>

          <div class="overflow-x-auto rounded-2xl border border-gray-200">
            <table class="w-full text-left text-xs text-gray-700 divide-y divide-gray-200">
              <thead class="bg-gray-50 text-gray-900 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="p-3.5">Cookie / Key Identifier</th>
                  <th class="p-3.5">Category</th>
                  <th class="p-3.5">Provider</th>
                  <th class="p-3.5">Specific Purpose</th>
                  <th class="p-3.5">Lifespan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr>
                  <td class="p-3.5 font-mono font-medium text-gray-900">hc_cookie_consent_v1</td>
                  <td class="p-3.5"><span class="font-semibold text-gray-800">Strictly Necessary</span></td>
                  <td class="p-3.5">Headline Central</td>
                  <td class="p-3.5">Preserves your regional cookie consent toggles across visits.</td>
                  <td class="p-3.5">Persistent (1 Year)</td>
                </tr>
                <tr>
                  <td class="p-3.5 font-mono font-medium text-gray-900">hc_gateway_auth</td>
                  <td class="p-3.5"><span class="font-semibold text-gray-800">Strictly Necessary</span></td>
                  <td class="p-3.5">Headline Central</td>
                  <td class="p-3.5">Validates administrative gateway passcodes and rate-limit lockout security.</td>
                  <td class="p-3.5">Session / 24 Hours</td>
                </tr>
                <tr>
                  <td class="p-3.5 font-mono font-medium text-gray-900">_ga, _ga_*</td>
                  <td class="p-3.5"><span class="font-semibold text-[#EE5102]">Analytics</span></td>
                  <td class="p-3.5">Google Analytics 4</td>
                  <td class="p-3.5">Aggregates readership statistics, article impressions, and traffic trends.</td>
                  <td class="p-3.5">2 Years (opt-in)</td>
                </tr>
                <tr>
                  <td class="p-3.5 font-mono font-medium text-gray-900">_gtm</td>
                  <td class="p-3.5"><span class="font-semibold text-[#EE5102]">Analytics</span></td>
                  <td class="p-3.5">Google Tag Manager</td>
                  <td class="p-3.5">Orchestrates client-side analytics triggers without injecting unvetted code.</td>
                  <td class="p-3.5">Session (opt-in)</td>
                </tr>
                <tr>
                  <td class="p-3.5 font-mono font-medium text-gray-900">_fbp</td>
                  <td class="p-3.5"><span class="font-semibold text-amber-700">Advertising</span></td>
                  <td class="p-3.5">Meta Platforms</td>
                  <td class="p-3.5">Measures effectiveness of social media referrals and advertising campaigns.</td>
                  <td class="p-3.5">90 Days (opt-in)</td>
                </tr>
                <tr>
                  <td class="p-3.5 font-mono font-medium text-gray-900">hc_cms_custom_articles</td>
                  <td class="p-3.5"><span class="font-semibold text-gray-800">Functional</span></td>
                  <td class="p-3.5">Headline Central</td>
                  <td class="p-3.5">Caches published news stories locally to accelerate page loading.</td>
                  <td class="p-3.5">Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Section 3: Multi-Jurisdictional Legal Alignment -->
        <section class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-950">3. Multi-Jurisdictional Statutory Compliance</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-700">
            <!-- POPIA -->
            <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <h3 class="font-bold text-gray-950 text-sm">South Africa (POPIA &amp; ECTA)</h3>
              <p class="leading-relaxed">
                Section 11 of the Protection of Personal Information Act mandates that personal information can only be processed with informed consent. We do not load non-essential analytical beacons until our consent interface is acknowledged.
              </p>
            </div>
            <!-- GDPR -->
            <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <h3 class="font-bold text-gray-950 text-sm">European Union (GDPR / ePrivacy)</h3>
              <p class="leading-relaxed">
                In terms of Article 5(3) of the ePrivacy Directive (Directive 2002/58/EC as amended), storing or accessing data on a user's terminal device requires prior opt-in consent. Our system automatically holds analytical and marketing tags until you click "Accept All" or toggle them ON.
              </p>
            </div>
            <!-- CCPA -->
            <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <h3 class="font-bold text-gray-950 text-sm">United States (CCPA / CPRA)</h3>
              <p class="leading-relaxed">
                The California Privacy Rights Act empowers consumers to opt out of the "sale" or "sharing" of personal data for cross-context behavioral advertising. Toggling off Category 4 executes this opt-out immediately.
              </p>
            </div>
            <!-- APAC -->
            <div class="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <h3 class="font-bold text-gray-950 text-sm">Asia-Pacific (PDPA &amp; APPI)</h3>
              <p class="leading-relaxed">
                Under the Singapore Personal Data Protection Act and Japanese APPI, users receive unambiguous notification of tracking purposes and maintain the right to withdraw consent at any time.
              </p>
            </div>
          </div>
        </section>

        <!-- Section 4: Browser Level Controls -->
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-gray-950">4. Browser-Level Cookie Management</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            In addition to our on-page interactive toggles, you may configure your web browser to reject cookies globally:
          </p>
          <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies.</li>
            <li><strong>Apple Safari:</strong> Settings &gt; Safari &gt; Advanced &gt; Block all cookies.</li>
            <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection.</li>
            <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies.</li>
          </ul>
        </section>

        <!-- Section 5: Inquiries -->
        <section class="space-y-3 border-t border-gray-100 pt-8">
          <h2 class="text-xl font-semibold text-gray-950">5. Contact Our Privacy Office</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            If you have questions regarding our cookie compliance measures or technical implementations, please reach out to our compliance desk:
          </p>
          <div class="text-sm text-gray-700 space-y-1">
            <p><strong>Email:</strong> <a href="mailto:privacy@headlinecentral.co.za" class="text-[#EE5102] underline">privacy@headlinecentral.co.za</a></p>
            <p><strong>Editorial Bureau:</strong> Rosebank, Johannesburg, South Africa</p>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCookieConsent } from '~/composables/useCookieConsent'
import { useSiteSeo } from '~/composables/useSiteSeo'

const { applyPageSeo } = useSiteSeo()
const {
  consentState,
  hasConsented,
  initConsent,
  savePreferences,
  acceptAll,
  rejectNonEssential
} = useCookieConsent()

const saveMessage = ref('')

const pagePreferences = reactive({
  necessary: true,
  analytics: false,
  functional: false,
  advertising: false
})

onMounted(() => {
  initConsent()
  pagePreferences.necessary = true
  pagePreferences.analytics = Boolean(consentState.categories.analytics)
  pagePreferences.functional = Boolean(consentState.categories.functional)
  pagePreferences.advertising = Boolean(consentState.categories.advertising)
})

const handleSave = () => {
  savePreferences({
    necessary: true,
    analytics: pagePreferences.analytics,
    functional: pagePreferences.functional,
    advertising: pagePreferences.advertising
  })
  saveMessage.value = 'Preferences saved successfully!'
  setTimeout(() => {
    saveMessage.value = ''
  }, 3000)
}

const handleRejectAll = () => {
  rejectNonEssential()
  pagePreferences.analytics = false
  pagePreferences.functional = false
  pagePreferences.advertising = false
  saveMessage.value = 'Non-essential cookies disabled!'
  setTimeout(() => {
    saveMessage.value = ''
  }, 3000)
}

applyPageSeo('cookies')
</script>
