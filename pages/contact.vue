<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-yberry-1000">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">Contact Us</span>
      </nav>

      <!-- Header -->
      <header class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs uppercase tracking-widest font-semibold text-yberry-1000 block mb-2">
          Get in Touch
        </span>
        <h1 class="text-3xl sm:text-4xl font-medium text-gray-950 font-sans tracking-tight mb-3">
          Contact the Newsroom
        </h1>
        <p class="text-base text-gray-600 font-normal">
          Whether you have an investigative tip, a partnership proposal, or a factual correction, we are eager to hear from you.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <!-- Contact Form (7 cols) -->
        <div class="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <form @submit.prevent="handleSubmit" class="space-y-4">
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
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yberry-1000 focus:bg-white text-gray-900 placeholder-gray-400"
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
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yberry-1000 focus:bg-white text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label for="topic" class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Inquiry Topic
              </label>
              <select
                id="topic"
                v-model="form.topic"
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yberry-1000 focus:bg-white text-gray-900"
              >
                <option value="story-pitch">Story Pitch / News Tip</option>
                <option value="correction">Factual Correction / Feedback</option>
                <option value="advertising">Advertising &amp; Sponsorship</option>
                <option value="syndication">Licensing &amp; Syndication</option>
                <option value="general">General Inquiry</option>
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
                class="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yberry-1000 focus:bg-white text-gray-900 placeholder-gray-400"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn-primary !py-3 font-semibold text-sm"
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
          <div v-if="isSent" class="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs leading-relaxed">
            Thank you, {{ form.name }}. Your message has been routed to our managing editors. We will respond within 24 to 48 hours.
          </div>
        </div>

        <!-- Sidebar Direct Inquiries (5 cols) -->
        <div class="md:col-span-5 space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 class="text-lg font-semibold text-gray-950 font-sans">
              Direct Desks
            </h3>

            <div class="space-y-3 text-xs">
              <div>
                <span class="font-bold text-gray-900 block">Editorial Pitches:</span>
                <a href="mailto:pitches@headlinecentral.com" class="text-yberry-1000 hover:underline">
                  pitches@headlinecentral.com
                </a>
              </div>

              <div>
                <span class="font-bold text-gray-900 block">Corrections Desk:</span>
                <a href="mailto:corrections@headlinecentral.com" class="text-yberry-1000 hover:underline">
                  corrections@headlinecentral.com
                </a>
              </div>

              <div>
                <span class="font-bold text-gray-900 block">Advertising &amp; Partnerships:</span>
                <a href="mailto:advertising@headlinecentral.com" class="text-yberry-1000 hover:underline">
                  advertising@headlinecentral.com
                </a>
              </div>
            </div>
          </div>

          <div class="bg-yberry-100/50 rounded-3xl p-6 border border-yberry-300 space-y-2 text-xs text-gray-700">
            <h4 class="font-bold text-gray-900 text-sm">Response Commitment</h4>
            <p class="leading-relaxed">
              We read every email. If submitting a breaking news tip with supporting documentation, please specify confidentiality requirements in your subject line.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSiteSeo } from '~/composables/useSiteSeo'

const { applyPageSeo } = useSiteSeo()

const form = ref({
  name: '',
  email: '',
  topic: 'story-pitch',
  message: ''
})

const isSubmitting = ref(false)
const isSent = ref(false)

const handleSubmit = () => {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isSent.value = true
    form.value.name = ''
    form.value.email = ''
    form.value.message = ''
  }, 750)
}

applyPageSeo('contact')
</script>

