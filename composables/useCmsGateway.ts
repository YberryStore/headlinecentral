import { ref, reactive, computed } from 'vue'
import { computeSha256Hex, useFirebase, type NotificationLog } from '~/composables/useFirebase'

export interface SecurityBlockedRecord {
  id: string
  rescueEmail: string
  attemptedUsername: string
  clientIp: string
  websiteUrl: string
  timestamp: string
  status: 'blocked' | 'unblocked' | 'whitelisted'
  unblockedAt?: string
  unblockedBy?: string
  rescueNotes?: string
}

// Storage Keys
const GATEWAY_SESSION_KEY = 'hc_cms_gateway_auth_token'
const GATEWAY_ATTEMPTS_KEY = 'hc_cms_gateway_failed_attempts'
const GATEWAY_COOLDOWN_UNTIL_KEY = 'hc_cms_gateway_cooldown_until'
const GATEWAY_POST_COOLDOWN_KEY = 'hc_cms_gateway_post_cooldown_active'
const GATEWAY_LOCKED_OUT_KEY = 'hc_cms_gateway_locked_out'
const GATEWAY_BLOCKED_RECORDS_KEY = 'hc_cms_gateway_blocked_records'
const GATEWAY_WHITELISTED_IPS_KEY = 'hc_cms_gateway_whitelisted_ips'
const GATEWAY_UNBLOCKED_EMAILS_KEY = 'hc_cms_gateway_unblocked_emails'
const GATEWAY_DIGEST_SALT = 'hc_gateway_layer1_v1:'
const MASTER_DIGEST_HEX = 'cea91bc5bc5cecb209361d9626ad4a64aa4032e1c67e91e55112164c033bdb73'

const MAX_FAILED_ATTEMPTS = 3
const COOLDOWN_DURATION_MS = 2 * 60 * 1000 // 2 minutes (120 seconds)

const constantTimeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

// Global Reactive Gateway State
const isGatewayUnlocked = ref(false)
const gatewayError = ref<string | null>(null)
const isVerifying = ref(false)
const failedAttempts = ref(0)
const isCooldownActive = ref(false)
const cooldownSecondsRemaining = ref(0)
const isPostCooldown = ref(false)
const isLockedOut = ref(false)
const submittedRescueEmail = ref<string | null>(null)
const blockedRecords = reactive<SecurityBlockedRecord[]>([])
const whitelistedIps = reactive<string[]>([])
const unblockedEmails = reactive<string[]>([])

let cooldownTimerInterval: any = null
let isGatewayStateInitialized = false

export const useCmsGateway = () => {
  const runtimeConfig = useRuntimeConfig()
  const { notificationLogs, initFirebase } = useFirebase()

  const getGatewayConfig = () => {
    const pubGateway = (runtimeConfig?.public as any)?.gateway || {}
    return {
      username: (pubGateway.username || '@Dm1n902@6!').trim(),
      password: (pubGateway.password || 'CMsL@g!n2@26!').trim()
    }
  }

  // Detect public IP of the user client with safe fallback
  const detectClientIp = async (): Promise<string> => {
    if (typeof window === 'undefined') return '127.0.0.1'
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)
      const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal })
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json()
        if (data?.ip) return data.ip
      }
    } catch {
      // Fallback
    }
    return typeof window !== 'undefined' ? `${window.location.hostname} (Client)` : '127.0.0.1'
  }

  const persistGatewayState = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(GATEWAY_ATTEMPTS_KEY, String(failedAttempts.value))
      localStorage.setItem(GATEWAY_POST_COOLDOWN_KEY, isPostCooldown.value ? 'true' : 'false')
      localStorage.setItem(GATEWAY_LOCKED_OUT_KEY, isLockedOut.value ? 'true' : 'false')
      localStorage.setItem(GATEWAY_BLOCKED_RECORDS_KEY, JSON.stringify(blockedRecords))
      localStorage.setItem(GATEWAY_WHITELISTED_IPS_KEY, JSON.stringify(whitelistedIps))
      localStorage.setItem(GATEWAY_UNBLOCKED_EMAILS_KEY, JSON.stringify(unblockedEmails))
    } catch {
      // Ignore storage errors
    }
  }

  const stopCooldownTimer = () => {
    if (cooldownTimerInterval) {
      clearInterval(cooldownTimerInterval)
      cooldownTimerInterval = null
    }
  }

  const startCooldownTimer = (untilTimestamp: number) => {
    stopCooldownTimer()
    isCooldownActive.value = true

    const updateTimer = () => {
      const now = Date.now()
      const diffMs = untilTimestamp - now
      if (diffMs <= 0) {
        stopCooldownTimer()
        isCooldownActive.value = false
        cooldownSecondsRemaining.value = 0
        if (typeof window !== 'undefined') {
          localStorage.removeItem(GATEWAY_COOLDOWN_UNTIL_KEY)
        }
        // User has completed cooldown, now in post-cooldown single retry phase
        isPostCooldown.value = true
        persistGatewayState()
        gatewayError.value = 'Cooldown expired. Enter credentials carefully. Any further failed attempt will lock terminal access and require administrator rescue authorization.'
        return
      }
      cooldownSecondsRemaining.value = Math.ceil(diffMs / 1000)
    }

    updateTimer()
    cooldownTimerInterval = setInterval(updateTimer, 1000)
  }

  const initGateway = () => {
    if (typeof window === 'undefined') return
    if (isGatewayStateInitialized) return
    isGatewayStateInitialized = true

    try {
      // Restore Token
      const storedToken = sessionStorage.getItem(GATEWAY_SESSION_KEY)
      if (storedToken && storedToken.startsWith('gw_auth_')) {
        isGatewayUnlocked.value = true
      }

      // Restore Blocked Records
      const rawRecords = localStorage.getItem(GATEWAY_BLOCKED_RECORDS_KEY)
      if (rawRecords) {
        const parsed = JSON.parse(rawRecords)
        if (Array.isArray(parsed)) {
          blockedRecords.splice(0, blockedRecords.length, ...parsed)
        }
      }

      // Restore Whitelisted IPs
      const rawIps = localStorage.getItem(GATEWAY_WHITELISTED_IPS_KEY)
      if (rawIps) {
        const parsedIps = JSON.parse(rawIps)
        if (Array.isArray(parsedIps)) {
          whitelistedIps.splice(0, whitelistedIps.length, ...parsedIps)
        }
      }

      // Restore Unblocked Emails
      const rawEmails = localStorage.getItem(GATEWAY_UNBLOCKED_EMAILS_KEY)
      if (rawEmails) {
        const parsedEmails = JSON.parse(rawEmails)
        if (Array.isArray(parsedEmails)) {
          unblockedEmails.splice(0, unblockedEmails.length, ...parsedEmails)
        }
      }

      // Restore Lockout State
      isLockedOut.value = localStorage.getItem(GATEWAY_LOCKED_OUT_KEY) === 'true'
      isPostCooldown.value = localStorage.getItem(GATEWAY_POST_COOLDOWN_KEY) === 'true'
      failedAttempts.value = parseInt(localStorage.getItem(GATEWAY_ATTEMPTS_KEY) || '0', 10)

      // Restore Cooldown
      const storedCooldown = localStorage.getItem(GATEWAY_COOLDOWN_UNTIL_KEY)
      if (storedCooldown) {
        const until = parseInt(storedCooldown, 10)
        if (until > Date.now()) {
          startCooldownTimer(until)
        } else {
          localStorage.removeItem(GATEWAY_COOLDOWN_UNTIL_KEY)
          if (failedAttempts.value >= MAX_FAILED_ATTEMPTS) {
            isPostCooldown.value = true
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  const checkGatewayAuth = (): boolean => {
    if (typeof window === 'undefined') return false
    initGateway()
    const storedToken = sessionStorage.getItem(GATEWAY_SESSION_KEY)
    if (storedToken && storedToken.startsWith('gw_auth_')) {
      isGatewayUnlocked.value = true
      return true
    }
    isGatewayUnlocked.value = false
    return false
  }

  /**
   * Unlock Layer 1 Gateway with attempt tracking, 2-minute cooldown, and lockout detection
   */
  const unlockGateway = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    gatewayError.value = null
    isVerifying.value = true

    // 1. Guard against attempt if terminal is locked out
    if (isLockedOut.value) {
      gatewayError.value = 'Terminal Locked: Excessive unauthorized attempts. Submit your Rescue Email to request administrator clearance.'
      isVerifying.value = false
      return false
    }

    // 2. Guard against attempt during active 2-minute cooldown
    if (isCooldownActive.value) {
      const minutes = Math.floor(cooldownSecondsRemaining.value / 60)
      const seconds = cooldownSecondsRemaining.value % 60
      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      gatewayError.value = `Security Cooldown in effect. Please wait ${formatted} before retrying.`
      isVerifying.value = false
      return false
    }

    const inputUser = (usernameInput || '').trim()
    const inputPass = (passwordInput || '').trim()

    if (!inputUser || !inputPass) {
      gatewayError.value = 'Please provide both Gateway Username and Password.'
      isVerifying.value = false
      return false
    }

    try {
      const config = getGatewayConfig()

      // Explicitly block all email address inputs from Layer 1 access
      if (inputUser.includes('.') && inputUser.includes('@') && inputUser !== config.username) {
        gatewayError.value = 'Email addresses are strictly blocked from Layer 1. Only the dedicated Gateway Username has access.'
        if (isPostCooldown.value) {
          isLockedOut.value = true
          persistGatewayState()
        } else {
          failedAttempts.value += 1
          persistGatewayState()
          if (failedAttempts.value >= MAX_FAILED_ATTEMPTS) {
            const until = Date.now() + COOLDOWN_DURATION_MS
            if (typeof window !== 'undefined') {
              localStorage.setItem(GATEWAY_COOLDOWN_UNTIL_KEY, String(until))
            }
            startCooldownTimer(until)
          }
        }
        isVerifying.value = false
        return false
      }

      // Strictly verify against ONLY the provided Layer 1 Gateway Credentials (@Dm1n902@6! / CMsL@g!n2@26!)
      const isGatewayMatch =
        (constantTimeEqual(inputUser, config.username) || constantTimeEqual(inputUser.toLowerCase(), config.username.toLowerCase())) &&
        constantTimeEqual(inputPass, config.password)

      if (isGatewayMatch) {
        // Reset all security counters on successful authentication
        failedAttempts.value = 0
        isPostCooldown.value = false
        isLockedOut.value = false
        stopCooldownTimer()
        if (typeof window !== 'undefined') {
          localStorage.removeItem(GATEWAY_ATTEMPTS_KEY)
          localStorage.removeItem(GATEWAY_COOLDOWN_UNTIL_KEY)
          localStorage.removeItem(GATEWAY_POST_COOLDOWN_KEY)
          localStorage.removeItem(GATEWAY_LOCKED_OUT_KEY)
        }

        const token = `gw_auth_${await computeSha256Hex(GATEWAY_DIGEST_SALT + inputUser + Date.now())}`
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(GATEWAY_SESSION_KEY, token)
        }
        isGatewayUnlocked.value = true
        gatewayError.value = null
        isVerifying.value = false
        return true
      }

      // ========================================================================
      // FAILED ATTEMPT HANDLING & STAGED DEFENSE ESCALATION
      // ========================================================================

      // Check if this failure happened AFTER already serving the 2-minute cooldown
      if (isPostCooldown.value) {
        // HARD LOCKOUT ACTIVATED
        isLockedOut.value = true
        persistGatewayState()
        gatewayError.value = 'Terminal Locked: Authentication failed following security cooldown. Access has been suspended. A Rescue Email submission is required to request administrator clearance.'
        isVerifying.value = false
        return false
      }

      // Increment attempt counter
      failedAttempts.value += 1
      persistGatewayState()

      // If reached 3 failed attempts, trigger 2-minute cooldown
      if (failedAttempts.value >= MAX_FAILED_ATTEMPTS) {
        const until = Date.now() + COOLDOWN_DURATION_MS
        if (typeof window !== 'undefined') {
          localStorage.setItem(GATEWAY_COOLDOWN_UNTIL_KEY, String(until))
        }
        startCooldownTimer(until)
        gatewayError.value = '3 consecutive failed attempts detected. Terminal cooling down for 2 minutes. Please wait before retrying.'
      } else {
        const remaining = MAX_FAILED_ATTEMPTS - failedAttempts.value
        gatewayError.value = `Access Denied: Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before 2-minute cooldown.`
      }

      isVerifying.value = false
      return false
    } catch {
      gatewayError.value = 'Security verification failed. Please try again.'
      isVerifying.value = false
      return false
    }
  }

  /**
   * Submit Rescue Email and dispatch security incident report to Master Admin
   */
  const submitRescueRequest = async (
    rescueEmail: string,
    notes?: string
  ): Promise<{ ok: boolean; message: string }> => {
    const normalizedEmail = (rescueEmail || '').trim().toLowerCase()
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { ok: false, message: 'Please provide a valid rescue email address.' }
    }

    try {
      const clientIp = await detectClientIp()
      const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://headlinecentral.co.za/cms/login'
      const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })

      const newRecord: SecurityBlockedRecord = {
        id: `sec-${Date.now()}`,
        rescueEmail: normalizedEmail,
        attemptedUsername: '@Dm1n902@6!',
        clientIp,
        websiteUrl: currentUrl,
        timestamp: new Date().toISOString(),
        status: 'blocked',
        rescueNotes: notes?.trim() || 'Multiple failed authentication attempts after cooldown.'
      }

      blockedRecords.unshift(newRecord)
      submittedRescueEmail.value = normalizedEmail
      persistGatewayState()

      // Dispatch alert notification to Master Admin
      const subject = `🚨 SECURITY ALERT: Unauthorized CMS Gateway Access Blocked (${normalizedEmail})`
      const contentHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
    <tr>
      <td style="padding: 28px 32px; background-color: #7f1d1d; text-align: center;">
        <span style="display: inline-block; padding: 4px 12px; background: rgba(0,0,0,0.3); border-radius: 9999px; color: #fca5a5; font-size: 11px; font-weight: 700; text-transform: uppercase;">Security Incident Alert</span>
        <h1 style="color: #ffffff; font-size: 20px; margin: 8px 0 0; font-weight: 700;">CMS Terminal Lockout Engaged</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px;">
          An unauthorized user exceeded the maximum allowed login attempts and failed the 2-minute cooldown verification. The terminal has locked access and generated this rescue alert.
        </p>
        <div style="background-color: #0f172a; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid #334155;">
          <table width="100%" border="0" cellspacing="0" cellpadding="6">
            <tr>
              <td style="font-size: 12px; color: #94a3b8; width: 140px;">Rescue Email:</td>
              <td style="font-size: 13px; font-weight: 600; color: #38bdf8;">${normalizedEmail}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #94a3b8;">Detected Client IP:</td>
              <td style="font-size: 13px; font-family: monospace; color: #f8fafc;">${clientIp}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #94a3b8;">Terminal URL:</td>
              <td style="font-size: 12px; color: #cbd5e1; word-break: break-all;">${currentUrl}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #94a3b8;">Incident Status:</td>
              <td style="font-size: 12px; font-weight: 700; color: #ef4444;">BLOCKED (Requires Admin Unblock or IP Whitelist)</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #94a3b8;">Timestamp:</td>
              <td style="font-size: 12px; color: #cbd5e1;">${timestamp}</td>
            </tr>
            ${notes ? `<tr><td style="font-size: 12px; color: #94a3b8;">User Note:</td><td style="font-size: 12px; color: #e2e8f0; font-style: italic;">&ldquo;${notes}&rdquo;</td></tr>` : ''}
          </table>
        </div>
        <p style="font-size: 13px; color: #94a3b8; margin: 20px 0 0;">
          To restore access for this user, log into the CMS Dashboard and click <strong>"Unblock Email"</strong> or <strong>"Whitelist IP"</strong> under the Gatekeeper Security panel.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

      const contentText = `SECURITY ALERT: Terminal Lockout Engaged\n\nRescue Email: ${normalizedEmail}\nClient IP: ${clientIp}\nTerminal URL: ${currentUrl}\nTimestamp: ${timestamp}\nStatus: BLOCKED\n\nAccess is suspended until Master Admin unblocks email or whitelists IP.`

      // Browser Web Notification Push
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            new Notification('Headline Central Security Alert', {
              body: `Terminal locked for ${normalizedEmail}. Master Admin review required.`,
              icon: '/favicon.svg'
            })
          } catch {}
        }
      }

      const logEntry: NotificationLog = {
        id: `sec-alert-${Date.now()}`,
        recipientEmail: 'admin@headlinecentral.co.za',
        recipientName: 'Master Administrator',
        subject,
        contentHtml,
        contentText,
        sentAt: new Date().toISOString(),
        status: 'delivered',
        type: 'security_alert'
      }

      notificationLogs.unshift(logEntry)

      return {
        ok: true,
        message: `Rescue request logged. A security incident alert has been dispatched to the Administrator. Terminal access remains locked until the Administrator reviews and unblocks your email (${normalizedEmail}) or whitelists your IP address (${clientIp}).`
      }
    } catch {
      return { ok: false, message: 'Unable to submit rescue request. Please check your network connection.' }
    }
  }

  /**
   * Check if user's rescue email has been unblocked or if their IP has been whitelisted
   */
  const checkTerminalClearance = async (): Promise<{ cleared: boolean; message: string }> => {
    if (!isLockedOut.value) {
      return { cleared: true, message: 'Terminal is currently unlocked.' }
    }

    const clientIp = await detectClientIp()

    // 1. Check if IP is whitelisted
    if (whitelistedIps.includes(clientIp)) {
      adminResetTerminalLock()
      return { cleared: true, message: `Access restored: Client IP (${clientIp}) has been whitelisted by an administrator.` }
    }

    // 2. Check if rescue email is in unblocked list
    if (submittedRescueEmail.value && unblockedEmails.includes(submittedRescueEmail.value.toLowerCase())) {
      adminResetTerminalLock()
      return { cleared: true, message: `Access restored: Rescue email (${submittedRescueEmail.value}) has been unblocked by an administrator.` }
    }

    // 3. Check blocked records status
    const matchingRecord = blockedRecords.find(
      r => (submittedRescueEmail.value && r.rescueEmail === submittedRescueEmail.value.toLowerCase()) || r.clientIp === clientIp
    )

    if (matchingRecord && (matchingRecord.status === 'unblocked' || matchingRecord.status === 'whitelisted')) {
      adminResetTerminalLock()
      return { cleared: true, message: 'Access clearance verified: Terminal has been unblocked by an administrator.' }
    }

    return {
      cleared: false,
      message: 'Terminal remains blocked. Administrator approval has not yet been granted for this email/IP.'
    }
  }

  /**
   * Admin: Unblock a user's rescue email
   */
  const adminUnblockEmail = async (recordId: string, email: string): Promise<boolean> => {
    const normalized = email.trim().toLowerCase()
    if (!unblockedEmails.includes(normalized)) {
      unblockedEmails.push(normalized)
    }

    const record = blockedRecords.find(r => r.id === recordId || r.rescueEmail === normalized)
    if (record) {
      record.status = 'unblocked'
      record.unblockedAt = new Date().toISOString()
      record.unblockedBy = 'Administrator'
    }

    persistGatewayState()
    return true
  }

  /**
   * Admin: Whitelist a client's IP address
   */
  const adminWhitelistIp = async (recordId: string, ip: string): Promise<boolean> => {
    const cleanIp = ip.trim()
    if (!whitelistedIps.includes(cleanIp)) {
      whitelistedIps.push(cleanIp)
    }

    const record = blockedRecords.find(r => r.id === recordId || r.clientIp === cleanIp)
    if (record) {
      record.status = 'whitelisted'
      record.unblockedAt = new Date().toISOString()
      record.unblockedBy = 'Administrator'
    }

    persistGatewayState()
    return true
  }

  /**
   * Admin: Manual Master Reset of terminal lockout & failed attempts
   */
  const adminResetTerminalLock = () => {
    isLockedOut.value = false
    failedAttempts.value = 0
    isPostCooldown.value = false
    isCooldownActive.value = false
    cooldownSecondsRemaining.value = 0
    submittedRescueEmail.value = null
    stopCooldownTimer()

    if (typeof window !== 'undefined') {
      localStorage.removeItem(GATEWAY_ATTEMPTS_KEY)
      localStorage.removeItem(GATEWAY_COOLDOWN_UNTIL_KEY)
      localStorage.removeItem(GATEWAY_POST_COOLDOWN_KEY)
      localStorage.removeItem(GATEWAY_LOCKED_OUT_KEY)
    }
    persistGatewayState()
  }

  const lockGateway = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(GATEWAY_SESSION_KEY)
      } catch {}
    }
    isGatewayUnlocked.value = false
    gatewayError.value = null
  }

  return {
    isGatewayUnlocked,
    gatewayError,
    isVerifying,
    failedAttempts,
    isCooldownActive,
    cooldownSecondsRemaining,
    isPostCooldown,
    isLockedOut,
    submittedRescueEmail,
    blockedRecords,
    whitelistedIps,
    unblockedEmails,
    initGateway,
    checkGatewayAuth,
    unlockGateway,
    lockGateway,
    getGatewayConfig,
    detectClientIp,
    submitRescueRequest,
    checkTerminalClearance,
    adminUnblockEmail,
    adminWhitelistIp,
    adminResetTerminalLock
  }
}
