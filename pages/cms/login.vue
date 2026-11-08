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
          {{ authMode === 'login' ? 'Sign in to' : 'Request Access to' }} <span class="text-[#EE5102]">CMS Portal</span>
        </h1>
        <p class="text-xs text-gray-400 mt-1">
          {{ authMode === 'login' ? 'Sign in with your approved editorial account.' : 'Submit your account details for administrator review & activation.' }}
        </p>

        <!-- Mode Toggle Tabs (Sign In vs Request Access) -->
        <div class="mt-4 p-1 rounded-full bg-gray-100 flex items-center max-w-xs mx-auto">
          <button
            @click="switchAuthMode('login')"
            type="button"
            class="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all"
            :class="authMode === 'login' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
          >
            Sign In
          </button>
          <button
            @click="switchAuthMode('register')"
            type="button"
            class="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all"
            :class="authMode === 'register' ? 'bg-white text-[#EE5102] shadow-sm' : 'text-gray-500 hover:text-gray-900'"
          >
            Register / Request Access
          </button>
        </div>
      </div>

      <!-- DEDICATED AWAITING ADMINISTRATOR APPROVAL CARD -->
      <div
        v-if="pendingApprovalInfo"
        class="mb-6 p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/70 space-y-4 shadow-sm"
      >
        <div class="flex items-center gap-3.5">
          <img
            :src="pendingApprovalInfo.photoURL || useAsset('/images/author-marcus.jpg')"
            :alt="pendingApprovalInfo.displayName"
            class="w-12 h-12 rounded-full object-cover border-2 border-amber-300 flex-shrink-0"
          />
          <div class="min-w-0">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 mb-1">
              Awaiting Administrator Approval
            </span>
            <p class="text-sm font-semibold text-gray-950 truncate">{{ pendingApprovalInfo.displayName }}</p>
            <p class="text-xs text-gray-600 font-mono truncate">{{ pendingApprovalInfo.email }}</p>
          </div>
        </div>

        <div class="text-xs text-gray-700 bg-white/80 p-3.5 rounded-xl border border-amber-200/80 space-y-2">
          <p class="font-medium text-gray-900">
            Your {{ pendingApprovalInfo.provider === 'google' ? 'Google Sign-In' : 'account registration' }} has been received and verified.
          </p>
          <p class="text-gray-600 leading-relaxed">
            An administrator must review your registration and assign your <strong>CMS editorial access level &amp; permissions</strong> before you can enter the portal.
          </p>
          <div class="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold pt-1">
            <svg class="w-3.5 h-3.5 text-amber-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>You will receive an automated push email notification once approved.</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <button
            @click="pendingApprovalInfo = null; authError = null"
            type="button"
            class="w-full py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors shadow-sm"
          >
            &larr; Switch Account / Return to Sign In
          </button>
        </div>
      </div>

      <!-- Success Alert (e.g. registration submitted) -->
      <div
        v-if="requestSuccessMessage"
        class="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1"
      >
        <div class="font-semibold flex items-center gap-1.5">
          <svg class="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Request Submitted!
        </div>
        <p>{{ requestSuccessMessage }}</p>
      </div>

      <!-- Error / Pending Alert -->
      <div
        v-if="authError"
        class="mb-4 p-3.5 rounded-2xl border text-xs"
        :class="authError.includes('pending administrator approval') ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-200 text-red-700'"
      >
        <div v-if="authError.includes('pending administrator approval')" class="font-semibold mb-0.5 flex items-center gap-1.5 text-amber-800">
          <svg class="w-4 h-4 text-amber-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Pending Administrator Approval
        </div>
        <p>{{ authError }}</p>
      </div>

      <!-- MODE 1: SIGN IN -->
      <div v-if="authMode === 'login'" class="space-y-4">
        <!-- Primary Google Sign-In Button (Official Google OAuth 2.0 Flow Only) -->
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
          <span>{{ isGoogleSubmitting ? 'Signing in with Google...' : 'Sign in with Google' }}</span>
        </button>

        <!-- Divider -->
        <div class="relative my-4">
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
      </div>

      <!-- MODE 2: REGISTER / REQUEST ACCESS -->
      <div v-else class="space-y-4">
        <!-- Google Quick Registration -->
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
          <span>{{ isGoogleSubmitting ? 'Connecting Google Account...' : 'Register with Google SSO' }}</span>
        </button>

        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-100"></div>
          </div>
          <div class="relative flex justify-center text-[11px] uppercase">
            <span class="bg-white px-3 text-gray-400">Or register with email</span>
          </div>
        </div>

        <form @submit.prevent="handleRegisterRequest" class="space-y-3.5">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              v-model="registerForm.displayName"
              type="text"
              required
              placeholder="e.g. Elena Rostova"
              class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              placeholder="elena@headlinecentral.co.za"
              class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Password *</label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              minlength="6"
              placeholder="At least 6 characters"
              class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Department / Editorial Note (Optional)</label>
            <input
              v-model="registerForm.notes"
              type="text"
              placeholder="e.g. Technology Columnist, Freelance Contributor"
              class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#EE5102]"
            />
          </div>

          <button
            type="submit"
            :disabled="isRegistering"
            class="w-full py-3 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {{ isRegistering ? 'Submitting Request...' : 'Submit Account Request' }}
          </button>
        </form>
      </div>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-xs text-gray-400 hover:text-[#EE5102] transition-colors">
          &larr; Return to Website
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
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
  pendingApprovalInfo,
  initFirebase,
  loginWithEmail,
  loginWithGoogle,
  registerAccountRequest
} = useFirebase()

const authMode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const isGoogleSubmitting = ref(false)
const isRegistering = ref(false)
const requestSuccessMessage = ref('')

const registerForm = reactive({
  displayName: '',
  email: '',
  password: '',
  notes: ''
})

const switchAuthMode = (mode: 'login' | 'register') => {
  authMode.value = mode
  authError.value = null
  requestSuccessMessage.value = ''
}

onMounted(() => {
  initFirebase()
  if (currentUser.value && (currentUser.value.isMaster || (currentUser.value.status === 'active' && currentUser.value.approvedAt && currentUser.value.active !== false))) {
    router.replace('/cms')
  }
})

watch(currentUser, (user) => {
  if (user && (user.isMaster || (user.status === 'active' && user.approvedAt && user.active !== false))) {
    router.replace('/cms')
  }
})

const handleEmailLogin = async () => {
  authError.value = null
  requestSuccessMessage.value = ''
  isSubmitting.value = true
  try {
    const ok = await loginWithEmail(email.value, password.value)
    if (ok && currentUser.value && (currentUser.value.isMaster || (currentUser.value.status === 'active' && currentUser.value.approvedAt && currentUser.value.active !== false))) {
      await router.push('/cms').catch(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/cms'
        }
      })
    }
  } catch (err: any) {
    authError.value = err?.message || 'Login failed. Please check your credentials.'
  } finally {
    isSubmitting.value = false
  }
}

const handleGoogleLogin = async () => {
  authError.value = null
  requestSuccessMessage.value = ''
  isGoogleSubmitting.value = true
  try {
    const ok = await loginWithGoogle()
    if (ok && currentUser.value && (currentUser.value.isMaster || (currentUser.value.status === 'active' && currentUser.value.approvedAt && currentUser.value.active !== false))) {
      await router.push('/cms').catch(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/cms'
        }
      })
    }
  } catch (err: any) {
    authError.value = err?.message || 'Unable to complete sign-in. Please try again.'
  } finally {
    isGoogleSubmitting.value = false
  }
}

const handleRegisterRequest = async () => {
  authError.value = null
  requestSuccessMessage.value = ''
  isRegistering.value = true
  try {
    const res = await registerAccountRequest({
      displayName: registerForm.displayName,
      email: registerForm.email,
      password: registerForm.password,
      notes: registerForm.notes
    })
    if (res.ok) {
      requestSuccessMessage.value = res.message
      registerForm.displayName = ''
      registerForm.email = ''
      registerForm.password = ''
      registerForm.notes = ''
    } else {
      authError.value = res.message
    }
  } catch (err: any) {
    authError.value = err?.message || 'Unable to submit registration request. Please try again.'
  } finally {
    isRegistering.value = false
  }
}
</script>
