<template>
  <div class="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 font-sans text-gray-100 relative overflow-hidden">
    <!-- Ambient Security Background Glows -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#EE5102]/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- ==================================================================== -->
    <!-- LAYER 1: SECURITY GATEWAY AUTHENTICATION BARRIER                      -->
    <!-- Sub-State A: Standard Entry & 2-Minute Cooldown Gate                 -->
    <!-- ==================================================================== -->
    <div
      v-if="!isGatewayUnlocked && !isLockedOut"
      class="w-full max-w-md bg-slate-900/95 backdrop-blur-xl rounded-[28px] p-7 sm:p-9 shadow-2xl border border-slate-800 text-gray-100 z-10 transition-all duration-300"
    >
      <!-- Gateway Header & Shield Icon -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700/80 mb-4 shadow-inner text-[#EE5102]">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#EE5102]/15 text-[#EE5102] border border-[#EE5102]/30 mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-[#EE5102] animate-pulse"></span>
          Level 1 Access Control
        </div>

        <h1 class="text-2xl font-bold text-white tracking-tight">
          Security <span class="text-[#EE5102]">Gateway</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          Restricted zone. Enter the primary Security Gateway credentials to unlock the CMS portal.
        </p>
      </div>

      <!-- COOLDOWN TIMER ACTIVE BANNER (3 Failed Attempts) -->
      <div
        v-if="isCooldownActive"
        class="mb-5 p-4 rounded-2xl bg-amber-950/70 border border-amber-600/80 text-amber-200 text-xs space-y-2 shadow-lg"
      >
        <div class="flex items-center justify-between font-semibold">
          <span class="flex items-center gap-2 text-amber-300">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            Security Cooldown Active
          </span>
          <span class="font-mono text-sm px-2.5 py-0.5 rounded-lg bg-black/50 text-amber-300 border border-amber-500/40">
            {{ formattedCooldown }}
          </span>
        </div>
        <p class="text-[11px] text-slate-300 leading-relaxed">
          3 consecutive failed attempts detected. Terminal inputs are temporarily locked for 2 minutes. Please wait before retrying.
        </p>
      </div>

      <!-- POST-COOLDOWN WARNING (Final attempt before permanent lockout) -->
      <div
        v-else-if="isPostCooldown"
        class="mb-5 p-3.5 rounded-xl bg-orange-950/60 border border-orange-600/70 text-orange-200 text-xs flex items-start gap-2.5"
      >
        <svg class="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <span class="font-semibold block">Final Retry Attempt</span>
          <span>Cooldown complete. Any further failed attempt will lock terminal access and require administrator rescue authorization.</span>
        </div>
      </div>

      <!-- General Error Alert -->
      <div
        v-else-if="gatewayError"
        class="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5"
      >
        <svg class="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <span class="font-semibold block">Gateway Authentication Denied</span>
          <span>{{ gatewayError }}</span>
        </div>
      </div>

      <!-- Gateway Verification Form -->
      <form @submit.prevent="handleGatewaySubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Gateway Username</span>
            <span class="text-[10px] text-slate-400 font-normal">Email sign-in blocked</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              v-model="gatewayForm.username"
              type="text"
              required
              autocomplete="username"
              :disabled="isCooldownActive"
              placeholder="Username only (e.g. @Dm1n902@6!)"
              class="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#EE5102] focus:ring-1 focus:ring-[#EE5102] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">
            Gateway Security Password / Key
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              v-model="gatewayForm.password"
              :type="gatewayForm.showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              :disabled="isCooldownActive"
              placeholder="••••••••••••"
              class="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#EE5102] focus:ring-1 focus:ring-[#EE5102] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <button
              @click="gatewayForm.showPassword = !gatewayForm.showPassword"
              type="button"
              :disabled="isCooldownActive"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-30"
            >
              <svg v-if="gatewayForm.showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isGatewayVerifying || isCooldownActive"
          class="w-full mt-2 py-3 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-sm font-semibold transition-all shadow-lg shadow-[#EE5102]/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg v-if="isGatewayVerifying" class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span v-if="isCooldownActive">Cooldown in Progress ({{ formattedCooldown }})</span>
          <span v-else-if="isGatewayVerifying">Authenticating Gateway...</span>
          <span v-else>Verify & Unlock CMS Portal</span>
          <span v-if="!isGatewayVerifying && !isCooldownActive">&rarr;</span>
        </button>
      </form>

      <!-- Security Notice -->
      <div class="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Attempt Tracking: {{ failedAttempts }}/3
        </span>
        <NuxtLink to="/" class="text-slate-400 hover:text-[#EE5102] transition-colors">
          &larr; Return to Website
        </NuxtLink>
      </div>
    </div>

    <!-- ==================================================================== -->
    <!-- LAYER 1 SUB-STATE B: FULL TERMINAL LOCKOUT & RESCUE SUBMISSION       -->
    <!-- (Triggered if authentication fails after the 2-minute cooldown)       -->
    <!-- ==================================================================== -->
    <div
      v-else-if="!isGatewayUnlocked && isLockedOut"
      class="w-full max-w-md bg-slate-900/95 backdrop-blur-xl rounded-[28px] p-7 sm:p-9 shadow-2xl border-2 border-red-700/80 text-gray-100 z-10 transition-all duration-300"
    >
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-950/80 border border-red-700/80 mb-4 shadow-inner text-red-500">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285zM12 16.5h.008v.008H12v-.008z" />
          </svg>
        </div>

        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-950/80 text-red-300 border border-red-700/80 mb-2">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          Terminal Access Suspended
        </div>

        <h1 class="text-2xl font-bold text-white tracking-tight">
          Terminal <span class="text-red-500">Locked</span>
        </h1>
        <p class="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
          Authentication failed following the 2-minute cooldown. To request access clearance, submit your registered Rescue Email address below.
        </p>
      </div>

      <!-- Feedback / Status Message -->
      <div
        v-if="rescueForm.statusMessage"
        class="mb-5 p-3.5 rounded-xl text-xs space-y-1"
        :class="rescueForm.isSuccess ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-200' : 'bg-red-950/80 border border-red-800 text-red-200'"
      >
        <div class="font-semibold flex items-center gap-1.5">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="rescueForm.isSuccess" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ rescueForm.isSuccess ? 'Security Alert Logged' : 'Authorization Notice' }}</span>
        </div>
        <p class="leading-relaxed">{{ rescueForm.statusMessage }}</p>
      </div>

      <!-- If rescue email NOT yet submitted: Form -->
      <form v-if="!submittedRescueEmail" @submit.prevent="handleRescueSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">
            Rescue Email Address *
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              v-model="rescueForm.email"
              type="email"
              required
              placeholder="e.g. editor@headlinecentral.co.za"
              class="w-full rounded-xl bg-slate-800/90 border border-slate-700 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            />
          </div>
          <p class="text-[11px] text-slate-400 mt-1">
            The administrator will receive a notification of this attempt with your website URL and client IP.
          </p>
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">
            Incident Note / Context (Optional)
          </label>
          <input
            v-model="rescueForm.notes"
            type="text"
            placeholder="e.g. Elena Rostova — forgot new gateway password"
            class="w-full rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="rescueForm.isSubmitting"
          class="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg v-if="rescueForm.isSubmitting" class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>{{ rescueForm.isSubmitting ? 'Transmitting Alert...' : 'Transmit Rescue Request to Administrator' }}</span>
          <span v-if="!rescueForm.isSubmitting">&rarr;</span>
        </button>
      </form>

      <!-- If rescue email HAS been submitted: Status Card & Clearance Check -->
      <div v-else class="space-y-4">
        <div class="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Target Rescue Email:</span>
            <span class="font-mono text-cyan-300 font-semibold">{{ submittedRescueEmail }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Lockout Status:</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">BLOCKED</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-700/60">
            Access will remain blocked until the Master Admin or an Administrator reviews your request, unblocks this email, or whitelists your client IP address.
          </p>
        </div>

        <button
          @click="handleCheckClearance"
          :disabled="isCheckingClearance"
          type="button"
          class="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg v-if="isCheckingClearance" class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>{{ isCheckingClearance ? 'Checking Clearance...' : 'Check Clearance Status' }}</span>
        </button>
      </div>

      <div class="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>Security Alert: SEC-ENGAGED</span>
        <NuxtLink to="/" class="text-slate-400 hover:text-[#EE5102] transition-colors">
          &larr; Return to Website
        </NuxtLink>
      </div>
    </div>

    <!-- ==================================================================== -->
    <!-- LAYER 2: CMS LOGIN & REGISTRATION SCREEN                             -->
    <!-- (Only accessible after passing Layer 1 Security Gateway)             -->
    <!-- ==================================================================== -->
    <div
      v-else
      class="w-full max-w-md bg-white rounded-[28px] p-7 sm:p-9 shadow-2xl border border-gray-100 text-gray-900 z-10 transition-all duration-300"
    >
      <!-- Layer 1 Clearance Status Bar -->
      <div class="flex items-center justify-between pb-3 mb-5 border-b border-gray-100 text-xs">
        <div class="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Layer 1: Security Gateway Cleared</span>
        </div>
        <button
          @click="lockGateway"
          type="button"
          class="text-[11px] font-medium text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
          title="Re-arm Layer 1 Security Barrier"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Lock Gateway
        </button>
      </div>

      <!-- Brand Logo & Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/" class="inline-flex items-center justify-center mb-4">
          <img
            :src="useAsset('/images/headline-central-logo.svg')"
            alt="HeadlineCentral."
            class="h-6 w-auto"
          />
        </NuxtLink>
        <h1 class="text-2xl font-semibold text-gray-950 tracking-tight">
          {{ authMode === 'login' ? 'Sign in to' : 'Request Access to' }} <span class="text-[#EE5102]">CMS Portal</span>
        </h1>
        <p class="text-xs text-gray-500 mt-1">
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
            :src="pendingApprovalInfo.photoURL || useAsset('/favicon.svg')"
            :alt="pendingApprovalInfo.displayName"
            class="w-12 h-12 rounded-full object-cover border-2 border-amber-300 flex-shrink-0 bg-gray-100 p-0.5"
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

      <!-- Error Alert -->
      <div
        v-if="authError"
        class="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700"
      >
        {{ authError }}
      </div>

      <!-- TAB 1: SIGN IN (Google SSO + Email/Password) -->
      <div v-if="authMode === 'login'">
        <!-- Official Google Sign-In Button (Popup Flow) -->
        <button
          @click="handleGoogleLogin"
          :disabled="isGoogleSubmitting || isSubmitting"
          type="button"
          class="w-full py-3 px-4 rounded-full border border-gray-900 bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{{ isGoogleSubmitting ? 'Authenticating with Google...' : 'Sign in with Google' }}</span>
        </button>

        <!-- Redirect Alternative for strict COOP or popup-blocked browsers -->
        <div class="mt-2 text-center">
          <button
            @click="handleGoogleLoginRedirect"
            :disabled="isGoogleSubmitting || isSubmitting"
            type="button"
            class="text-[11px] text-gray-500 hover:text-[#EE5102] transition-colors underline decoration-dotted"
          >
            Popup blocked or browser policy warnings? Click here to Sign in via Redirect
          </button>
        </div>

        <div class="relative my-5">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-100"></div>
          </div>
          <div class="relative flex justify-center text-[11px] uppercase">
            <span class="bg-white px-3 text-gray-400">Or sign in with email</span>
          </div>
        </div>

        <form @submit.prevent="handleEmailLogin" class="space-y-3.5">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="e.g. admin@headlinecentral.co.za"
              class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••••••"
              class="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#EE5102]"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            {{ isSubmitting ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
      </div>

      <!-- TAB 2: REGISTER / REQUEST ACCESS FORM -->
      <div v-else>
        <!-- Google Quick Registration Request -->
        <button
          @click="handleGoogleLogin"
          :disabled="isGoogleSubmitting"
          type="button"
          class="w-full py-3 px-4 rounded-full border border-gray-900 bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 mb-4"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{{ isGoogleSubmitting ? 'Verifying with Google...' : 'Request Access with Google' }}</span>
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
            class="w-full py-3 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebase } from '~/composables/useFirebase'
import { useCmsGateway } from '~/composables/useCmsGateway'

definePageMeta({
  layout: false,
  robots: 'noindex, nofollow'
})

useHead({
  title: 'CMS Portal Authentication — HeadlineCentral.',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const router = useRouter()

// Layer 1 Gateway composable
const {
  isGatewayUnlocked,
  gatewayError,
  isVerifying: isGatewayVerifying,
  failedAttempts,
  isCooldownActive,
  cooldownSecondsRemaining,
  isPostCooldown,
  isLockedOut,
  submittedRescueEmail,
  initGateway,
  unlockGateway,
  lockGateway,
  submitRescueRequest,
  checkTerminalClearance
} = useCmsGateway()

const gatewayForm = reactive({
  username: '',
  password: '',
  showPassword: false
})

const rescueForm = reactive({
  email: '',
  notes: '',
  isSubmitting: false,
  statusMessage: '',
  isSuccess: false
})

const isCheckingClearance = ref(false)

const formattedCooldown = computed(() => {
  const mins = Math.floor(cooldownSecondsRemaining.value / 60)
  const secs = cooldownSecondsRemaining.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const handleGatewaySubmit = async () => {
  const ok = await unlockGateway(gatewayForm.username, gatewayForm.password)
  if (ok) {
    gatewayForm.password = ''
  }
}

const handleRescueSubmit = async () => {
  rescueForm.isSubmitting = true
  rescueForm.statusMessage = ''
  try {
    const res = await submitRescueRequest(rescueForm.email, rescueForm.notes)
    rescueForm.statusMessage = res.message
    rescueForm.isSuccess = res.ok
  } finally {
    rescueForm.isSubmitting = false
  }
}

const handleCheckClearance = async () => {
  isCheckingClearance.value = true
  try {
    const res = await checkTerminalClearance()
    rescueForm.statusMessage = res.message
    rescueForm.isSuccess = res.cleared
  } finally {
    isCheckingClearance.value = false
  }
}

// Layer 2 CMS Firebase composable
const {
  currentUser,
  authError,
  pendingApprovalInfo,
  initFirebase,
  loginWithEmail,
  loginWithGoogle,
  loginWithGoogleRedirect,
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
  initGateway()
  initFirebase()
  if (isGatewayUnlocked.value && currentUser.value && (currentUser.value.isMaster || (currentUser.value.status === 'active' && currentUser.value.approvedAt && currentUser.value.active !== false))) {
    router.replace('/cms')
  }
})

watch(currentUser, (user) => {
  if (isGatewayUnlocked.value && user && (user.isMaster || (user.status === 'active' && user.approvedAt && user.active !== false))) {
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

const handleGoogleLoginRedirect = async () => {
  authError.value = null
  requestSuccessMessage.value = ''
  isGoogleSubmitting.value = true
  try {
    await loginWithGoogleRedirect()
  } catch (err: any) {
    authError.value = err?.message || 'Unable to initiate Google redirect. Please try again.'
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
    authError.value = err?.message || 'Failed to submit registration request.'
  } finally {
    isRegistering.value = false
  }
}
</script>
