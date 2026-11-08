<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-[#EE5102]">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Contact Us</span>
      </nav>

      <!-- Header -->
      <header class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs uppercase tracking-widest font-semibold text-[#EE5102] block mb-2">
          {{ contactConfig.badge || 'Get in Touch' }}
        </span>
        <h1 class="text-3xl sm:text-4xl font-medium text-gray-950 font-sans tracking-tight mb-3">
          {{ contactConfig.title || 'Contact the Newsroom' }}
        </h1>
        <p class="text-base text-gray-600 font-normal">
          {{ contactConfig.description || 'Whether you have an investigative tip, a partnership proposal, or a factual correction, we are eager to hear from you.' }}
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <!-- Contact Form (7 cols) -->
        <div class="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div v-if="contactConfig.formEnabled === false" class="py-8 text-center text-gray-500 text-sm">
            The contact form is currently taking a scheduled break. Please reach our direct desks via email on the right.
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="name" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Jane Doe"
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#EE5102] focus:bg-white text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label for="email" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="jane@example.com"
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#EE5102] focus:bg-white text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label for="topic" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Inquiry Topic
              </label>
              <select
                id="topic"
                v-model="form.topic"
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#EE5102] focus:bg-white text-gray-900"
              >
                <option v-for="t in inquiryTopics" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                placeholder="Provide detailed information regarding your inquiry..."
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#EE5102] focus:bg-white text-gray-900 placeholder-gray-400"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3 px-6 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <span v-if="!isSubmitting && !isSent">Send Transmission</span>
              <span v-else-if="isSubmitting">Transmitting...</span>
              <span v-else class="flex items-center justify-center space-x-1">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span>Message Dispatched!</span>
              </span>
            </button>
          </form>

          <!-- Feedback notification -->
          <div v-if="isSent" class="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed">
            {{ contactConfig.successMessage || `Thank you, ${lastSenderName}. Your message has been routed to our managing editors. We will respond within 24 to 48 hours.` }}
          </div>
        </div>

        <!-- Sidebar Direct Inquiries (5 cols) -->
        <div class="md:col-span-5 space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 class="text-lg font-semibold text-gray-950 font-sans">
              Direct Desks
            </h3>

            <div class="space-y-3.5 text-xs">
              <div v-if="contactConfig.pitchesEmail">
                <span class="font-bold text-gray-900 block">Editorial Pitches:</span>
                <a :href="`mailto:${contactConfig.pitchesEmail}`" class="text-[#EE5102] hover:underline">
                  {{ contactConfig.pitchesEmail }}
                </a>
              </div>

              <div v-if="contactConfig.correctionsEmail">
                <span class="font-bold text-gray-900 block">Corrections Desk:</span>
                <a :href="`mailto:${contactConfig.correctionsEmail}`" class="text-[#EE5102] hover:underline">
                  {{ contactConfig.correctionsEmail }}
                </a>
              </div>

              <div v-if="contactConfig.advertisingEmail">
                <span class="font-bold text-gray-900 block">Advertising &amp; Partnerships:</span>
                <a :href="`mailto:${contactConfig.advertisingEmail}`" class="text-[#EE5102] hover:underline">
                  {{ contactConfig.advertisingEmail }}
                </a>
              </div>

              <div v-if="contactConfig.generalEmail">
                <span class="font-bold text-gray-900 block">General Inquiries:</span>
                <a :href="`mailto:${contactConfig.generalEmail}`" class="text-[#EE5102] hover:underline">
                  {{ contactConfig.generalEmail }}
                </a>
              </div>

              <div v-if="contactConfig.phone" class="pt-2 border-t border-gray-100">
                <span class="font-bold text-gray-900 block">Newsroom Phone:</span>
                <span class="text-gray-600">{{ contactConfig.phone }}</span>
              </div>

              <div v-if="contactConfig.address" class="pt-2 border-t border-gray-100">
                <span class="font-bold text-gray-900 block">Physical Bureau:</span>
                <span class="text-gray-600 leading-relaxed">{{ contactConfig.address }}</span>
              </div>
            </div>
          </div>

          <div class="bg-orange-50/70 rounded-3xl p-6 border border-orange-200/80 space-y-2 text-xs text-gray-700">
            <h4 class="font-bold text-gray-900 text-sm">
              {{ contactConfig.responseTitle || 'Response Commitment' }}
            </h4>
            <p class="leading-relaxed">
              {{ contactConfig.responseCommitment || 'We read every email. If submitting a breaking news tip with supporting documentation, please specify confidentiality requirements in your subject line.' }}
            </p>
            <p v-if="contactConfig.responseTime" class="text-[11px] font-semibold text-[#EE5102] pt-1">
              Typical turnaround: {{ contactConfig.responseTime }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSiteSeo } from '~/composables/useSiteSeo'
import { useSiteContent } from '~/composables/useSiteContent'

const { applyPageSeo } = useSiteSeo()
const { contactPageConfig } = useSiteContent()

const contactConfig = computed(() => contactPageConfig)
const inquiryTopics = computed(() => contactPageConfig.inquiryTopics || [
  'Story Pitch / News Tip',
  'Factual Correction / Feedback',
  'Advertising & Sponsorship',
  'Licensing & Syndication',
  'General Inquiry'
])

const form = ref({
  name: '',
  email: '',
  topic: inquiryTopics.value[0] || 'General Inquiry',
  message: ''
})

const isSubmitting = ref(false)
const isSent = ref(false)
const lastSenderName = ref('')

const handleSubmit = () => {
  isSubmitting.value = true
  lastSenderName.value = form.value.name
  setTimeout(() => {
    isSubmitting.value = false
    isSent.value = true
    form.value.name = ''
    form.value.email = ''
    form.value.message = ''
  }, 600)
}

applyPageSeo('contact')
</script>
