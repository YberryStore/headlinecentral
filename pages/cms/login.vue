<template>
  <div class="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4 font-sans text-gray-900">
    <div class="w-full max-w-md bg-white rounded-[28px] p-7 sm:p-9 shadow-sm border border-gray-100">
      <!-- Brand Logo & Header -->
      <div class="text-center mb-7">
        <NuxtLink to="/" class="inline-flex items-center justify-center mb-5">
          <img
            :src="useAsset('/images/headline-central-logo.svg')"
            alt="HeadlineCentral."
            class="h-6 w-auto"
          />
        </NuxtLink>
        <h1 class="text-2xl font-semibold text-gray-950 tracking-tight">
          Sign in to <span class="text-[#EE5102]">CMS Portal</span>
        </h1>
        <p class="text-xs text-gray-400 mt-1">
          Sign in with your editorial account to continue.
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="authError"
        class="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700"
      >
        {{ authError }}
      </div>

      <!-- Primary Google Sign-In Button -->
      <button
        @click="handleGoogleLogin"
        type="button"
        :disabled="isGoogleSubmitting"
        class="w-full py-3 px-4 rounded-full bg-white border-2 border-gray-200 hover:border-[#EE5102] hover:bg-orange-50/20 text-sm font-medium text-gray-900 flex items-center justify-center gap-3 transition-all shadow-sm disabled:opacity-50"
      >
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z" />
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z" />
          <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z" />
          <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 19.9 7.4 23 12 23z" />
        </svg>
        <span>{{ isGoogleSubmitting ? 'Signing in...' : 'Continue with Google' }}</span>
      </button>

      <!-- Divider -->
      <div class="relative my-5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-100"></div>
        </div>
        <div class="relative flex justify-center text-[11px] uppercase">
          <span class="bg-white px-3 text-gray-400">Or sign in with email</span>
        </div>
      </div>

      <!-- Email & Password Login Form -->
      <form @submit.prevent="handleEmailLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="username"
            placeholder="editor@headlinecentral.com"
            class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-xs text-gray-400 hover:text-[#EE5102] transition-colors">
          &larr; Return to Website
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebase } from '~/composables/useFirebase'

definePageMeta({
  layout: false,
  robots: 'noindex, nofollow'
})

useHead({
  title: 'Sign In — HeadlineCentral.',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()
const {
  currentUser,
  authError,
  initFirebase,
  loginWithEmail,
  loginWithGoogle
} = useFirebase()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const isGoogleSubmitting = ref(false)

onMounted(() => {
  initFirebase()
  if (currentUser.value) {
    router.replace('/cms')
  }
})

watch(currentUser, (user) => {
  if (user) {
    router.replace('/cms')
  }
})

const handleEmailLogin = async () => {
  isSubmitting.value = true
  const ok = await loginWithEmail(email.value, password.value)
  isSubmitting.value = false
  if (ok && currentUser.value) {
    router.push('/cms')
  }
}

const handleGoogleLogin = async () => {
  isGoogleSubmitting.value = true
  const ok = await loginWithGoogle()
  isGoogleSubmitting.value = false
  if (ok && currentUser.value) {
    router.push('/cms')
  }
}
</script>
