<template>
  <div v-if="!isCmsRoute">
    <!-- 1. Floating Bottom Banner (Initial prompt for visitors who have not yet chosen preferences) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-8 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-8 opacity-0"
    >
      <div
        v-if="isBannerVisible && !isPreferencesModalOpen"
        class="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none"
        role="dialog"
        aria-label="Cookie consent banner"
      >
        <div class="max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 sm:p-6 pointer-events-auto">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-[#EE5102]"></span>
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-900">Privacy &amp; Cookie Compliance</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Headline Central respects your privacy rights in accordance with the <strong>South African POPIA</strong>, the <strong>EU &amp; UK GDPR</strong>, <strong>US State Privacy Laws (CCPA/CPRA)</strong>, and <strong>Asia-Pacific frameworks</strong>. We use cookies and local storage to guarantee secure navigation, measure performance, and deliver relevant editorial experiences.
              </p>
              <div class="flex items-center gap-4 text-[11px] text-gray-500 pt-0.5">
                <NuxtLink to="/privacy" class="text-gray-700 underline hover:text-[#EE5102] transition-colors">Privacy Policy</NuxtLink>
                <span>&bull;</span>
                <NuxtLink to="/cookies" class="text-gray-700 underline hover:text-[#EE5102] transition-colors">Cookie Policy</NuxtLink>
                <span>&bull;</span>
                <NuxtLink to="/terms" class="text-gray-700 underline hover:text-[#EE5102] transition-colors">Terms &amp; Conditions</NuxtLink>
              </div>
            </div>

            <!-- Action buttons (Clean rectangular/subtle rounded buttons, NO pills) -->
            <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto flex-shrink-0">
              <button
                @click="openPreferencesModal"
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                Customize
              </button>
              <button
                @click="rejectNonEssential"
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                Reject Non-Essential
              </button>
              <button
                @click="acceptAll"
                type="button"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. Detailed Cookie Preferences Modal (Granular toggle options compliant with POPIA, GDPR, CCPA, APAC) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPreferencesModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm overflow-y-auto"
        @click.self="closePreferencesModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
      >
        <div class="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto font-sans">
          <!-- Header -->
          <div class="flex items-start justify-between border-b border-gray-100 pb-4">
            <div>
              <span class="text-[11px] font-semibold uppercase tracking-wider text-[#EE5102]">Multi-Regional Legal Compliance</span>
              <h2 id="cookie-modal-title" class="text-xl font-bold text-gray-950 mt-0.5">
                Cookie &amp; Tracking Consent Preferences
              </h2>
              <p class="text-xs text-gray-500 mt-1">
                Customize which categories of cookies and telemetry technologies you authorize Headline Central to utilize.
              </p>
            </div>
            <button
              @click="closePreferencesModal"
              type="button"
              aria-label="Close dialog"
              class="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Regional Framework Badges (Clean badges, not pill buttons) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-medium text-gray-600">
            <div class="bg-gray-50 border border-gray-200/80 rounded-xl p-2">
              <span class="block font-semibold text-gray-900">South Africa</span>
              <span>POPIA &amp; PAIA</span>
            </div>
            <div class="bg-gray-50 border border-gray-200/80 rounded-xl p-2">
              <span class="block font-semibold text-gray-900">European Union</span>
              <span>GDPR / ePrivacy</span>
            </div>
            <div class="bg-gray-50 border border-gray-200/80 rounded-xl p-2">
              <span class="block font-semibold text-gray-900">United States</span>
              <span>CCPA / CPRA</span>
            </div>
            <div class="bg-gray-50 border border-gray-200/80 rounded-xl p-2">
              <span class="block font-semibold text-gray-900">Asia-Pacific</span>
              <span>PDPA &amp; APPI</span>
            </div>
          </div>

          <!-- Category Toggles List -->
          <div class="space-y-4">
            <!-- 1. Strictly Necessary Cookies (Locked ON) -->
            <div class="p-4 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold text-gray-900">1. Strictly Necessary &amp; Security Cookies</h3>
                  <span class="text-[10px] uppercase tracking-wider font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">Always Active</span>
                </div>
                <!-- Locked switch -->
                <div class="w-10 h-6 bg-[#EE5102] rounded-full opacity-60 cursor-not-allowed flex items-center justify-end px-1" title="Mandatory for platform operation">
                  <div class="w-4 h-4 rounded-full bg-white shadow"></div>
                </div>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Essential for core navigation, authentication security, network firewall diagnostics, and rate-limit defenses. Under Section 11 of the South African POPIA and Article 5(3) of the EU ePrivacy Directive, these cookies do not require prior consent because the platform cannot function without them.
              </p>
              <div class="text-[10px] font-mono text-gray-500">
                Examples: Session tokens, terminal lockout prevention, CSRF verification.
              </div>
            </div>

            <!-- 2. Performance & Analytical Cookies (Toggleable) -->
            <div class="p-4 rounded-2xl border border-gray-200 bg-white space-y-2 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">2. Performance &amp; Analytics Cookies</h3>
                  <p class="text-[11px] text-gray-500">Google Analytics 4 &amp; Google Tag Manager telemetry</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="tempPreferences.analytics"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Allows us to aggregate readership metrics, identify popular investigative reports, diagnose site speed, and evaluate bounce rates. All IP addresses are anonymized before storage.
              </p>
            </div>

            <!-- 3. Functional & Experience Cookies (Toggleable) -->
            <div class="p-4 rounded-2xl border border-gray-200 bg-white space-y-2 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-gray-900">3. Functionality &amp; Personalization</h3>
                  <p class="text-[11px] text-gray-500">Remembers typography preferences and customized view modes</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="tempPreferences.functional"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Preserves individual reading settings, bookmark state, newsletter dismissals, and font size choices across your visits without tying data to personal dossiers.
              </p>
            </div>

            <!-- 4. Targeting & Advertising Cookies (Toggleable, CCPA opt-out compliant) -->
            <div class="p-4 rounded-2xl border border-gray-200 bg-white space-y-2 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-semibold text-gray-900">4. Targeting &amp; Advertising Cookies</h3>
                    <span class="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">US CCPA Opt-Out</span>
                  </div>
                  <p class="text-[11px] text-gray-500">Meta Pixel, Google AdSense &amp; partner display units</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="tempPreferences.advertising"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EE5102]"></div>
                </label>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Used to deliver relevant advertising campaigns, verify sponsored editorial engagement, and prevent ad fatigue. Disabling this toggle activates your <strong>"Do Not Sell or Share My Personal Information"</strong> right under the California Consumer Privacy Act (CCPA/CPRA).
              </p>
            </div>
          </div>

          <!-- Footer Actions (NO pill buttons: standard clean rounded-xl buttons) -->
          <div class="border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <NuxtLink
              to="/cookies"
              @click="closePreferencesModal"
              class="text-xs text-gray-500 hover:text-[#EE5102] underline order-last sm:order-first transition-colors"
            >
              Read Full Cookie Policy Documentation
            </NuxtLink>

            <div class="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                @click="rejectNonEssential"
                type="button"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                Reject Non-Essential
              </button>
              <button
                @click="handleSavePreferences"
                type="button"
                class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#EE5102] hover:bg-[#d84802] text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCookieConsent } from '~/composables/useCookieConsent'

const route = useRoute()
const {
  consentState,
  isBannerVisible,
  isPreferencesModalOpen,
  initConsent,
  acceptAll,
  rejectNonEssential,
  savePreferences,
  openPreferencesModal,
  closePreferencesModal
} = useCookieConsent()

const isCmsRoute = computed(() =>
  route.path.startsWith('/cms') || route.path.startsWith('/admin')
)

const tempPreferences = reactive({
  necessary: true,
  analytics: false,
  functional: false,
  advertising: false
})

// Sync modal local toggles whenever modal opens or state changes
watch(
  () => isPreferencesModalOpen.value,
  isOpen => {
    if (isOpen) {
      tempPreferences.necessary = true
      tempPreferences.analytics = Boolean(consentState.categories.analytics)
      tempPreferences.functional = Boolean(consentState.categories.functional)
      tempPreferences.advertising = Boolean(consentState.categories.advertising)
    }
  }
)

const handleSavePreferences = () => {
  savePreferences({
    necessary: true,
    analytics: tempPreferences.analytics,
    functional: tempPreferences.functional,
    advertising: tempPreferences.advertising
  })
}

onMounted(() => {
  initConsent()
})
</script>

