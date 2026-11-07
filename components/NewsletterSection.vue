<template>
  <section id="newsletter" class="py-16 bg-gradient-to-br from-yberry-100 via-white to-yberry-200 border-b border-gray-100 relative overflow-hidden">
    <!-- Ambient decorative blobs -->
    <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-yberry-300/30 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-yberry-400/20 blur-3xl pointer-events-none"></div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white text-yberry-1000 border border-yberry-300 text-xs font-semibold mb-6 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-yberry-1000 animate-pulse"></span>
        <span>The Daily Briefing</span>
      </div>

      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-950 font-sans tracking-tight leading-tight mb-4">
        Stay Ahead of Every Major Headline.
      </h2>

      <p class="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Join over 45,000 discerning readers and technologists receiving our weekday briefing of thoughtful analysis and investigative journalism.
      </p>

      <!-- Interactive Form -->
      <form @submit.prevent="handleSubscribe" class="max-w-md mx-auto space-y-3 sm:space-y-0 sm:flex sm:items-center sm:bg-white sm:p-2 sm:rounded-full sm:shadow-lg sm:border sm:border-yberry-300">
        <input
          v-model="email"
          type="email"
          required
          placeholder="Enter your email address..."
          class="w-full px-5 py-3.5 sm:py-2 text-sm text-gray-900 rounded-full sm:rounded-none focus:outline-none placeholder-gray-400 bg-white sm:bg-transparent shadow sm:shadow-none border sm:border-0 border-gray-200"
        />
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full sm:w-auto btn-primary !py-3.5 sm:!py-3 !px-8 font-semibold tracking-wide text-xs sm:text-sm whitespace-nowrap"
        >
          <span v-if="!isSubmitting && !isSuccess">Subscribe Free</span>
          <span v-else-if="isSubmitting">Subscribing...</span>
          <span v-else class="flex items-center space-x-1">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>Subscribed!</span>
          </span>
        </button>
      </form>

      <!-- Success feedback -->
      <div v-if="isSuccess" class="mt-4 text-sm font-medium text-green-700 bg-green-50 border border-green-200 py-2.5 px-4 rounded-xl inline-block">
        Welcome aboard! Please check your inbox to confirm your subscription.
      </div>

      <!-- Trust markers -->
      <div class="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-700">
        <span class="flex items-center space-x-1.5">
          <svg class="w-4 h-4 text-yberry-1000" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>No spam, ever</span>
        </span>
        <span class="flex items-center space-x-1.5">
          <svg class="w-4 h-4 text-yberry-1000" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>1-click unsubscribe</span>
        </span>
        <span class="flex items-center space-x-1.5">
          <svg class="w-4 h-4 text-yberry-1000" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Strict privacy policy</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)

const handleSubscribe = () => {
  if (!email.value) return
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isSuccess.value = true
    email.value = ''
    setTimeout(() => {
      isSuccess.value = false
    }, 6000)
  }, 750)
}
</script>

