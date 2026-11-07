import { ref, reactive, computed } from 'vue'
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  type Firestore
} from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  listAll,
  type FirebaseStorage
} from 'firebase/storage'
import type { Article } from '~/composables/useArticles'

export type CmsRoleKey = 'admin' | 'editor' | 'author' | 'viewer'
export type CmsAccountStatus = 'active' | 'pending' | 'suspended' | 'rejected'

export interface CmsUserPermissions {
  canManageBlogs: boolean
  canDeleteBlogs: boolean
  canManageCategories: boolean
  canManageMedia: boolean
  canManageUsers: boolean
  canManageSettings: boolean
}

export interface NotificationLog {
  id: string
  recipientEmail: string
  recipientName: string
  subject: string
  contentHtml: string
  contentText: string
  type: 'account_activated' | 'account_pending' | 'account_suspended'
  channel: 'email_push'
  status: 'delivered' | 'sent' | 'failed'
  dispatchedAt: string
  dispatchedBy: string
}

export interface PendingApprovalDetails {
  email: string
  displayName: string
  photoURL?: string
  provider: 'google' | 'email'
  registeredAt?: string
}

export interface CmsAuthUser {
  uid: string
  email: string
  displayName: string
  role: string
  roleKey: CmsRoleKey
  permissions: CmsUserPermissions
  photoURL?: string
  provider: 'google' | 'email' | 'both'
  environment?: 'live' | 'local'
  active?: boolean
  status?: CmsAccountStatus
  registrationNotes?: string
  approvedAt?: string
  approvedBy?: string
  isMaster?: boolean
  lastLoginAt?: string
}

export interface ManagedCmsUser extends CmsAuthUser {
  passwordHash?: string
  createdAt: string
}

export const ROLE_LABELS: Record<CmsRoleKey, string> = {
  admin: 'Administrator',
  editor: 'Senior Editor',
  author: 'Contributor / Writer',
  viewer: 'Analyst (Read-Only)'
}

export const getDefaultPermissionsForRole = (roleKey: CmsRoleKey): CmsUserPermissions => {
  switch (roleKey) {
    case 'admin':
      return {
        canManageBlogs: true,
        canDeleteBlogs: true,
        canManageCategories: true,
        canManageMedia: true,
        canManageUsers: true,
        canManageSettings: true
      }
    case 'editor':
      return {
        canManageBlogs: true,
        canDeleteBlogs: true,
        canManageCategories: true,
        canManageMedia: true,
        canManageUsers: false,
        canManageSettings: true
      }
    case 'author':
      return {
        canManageBlogs: true,
        canDeleteBlogs: false,
        canManageCategories: false,
        canManageMedia: true,
        canManageUsers: false,
        canManageSettings: false
      }
    case 'viewer':
    default:
      return {
        canManageBlogs: false,
        canDeleteBlogs: false,
        canManageCategories: false,
        canManageMedia: false,
        canManageUsers: false,
        canManageSettings: false
      }
  }
}

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
])
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

// Salted SHA-256 digest of the master administrator credentials (no plaintext stored)
const MASTER_DIGEST_HEX = 'cea91bc5bc5cecb209361d9626ad4a64aa4032e1c67e91e55112164c033bdb73'
const SESSION_TOKEN_KEY = 'hc_cms_session_token'
const SESSION_USER_KEY = 'hc_cms_session_user'
const MANAGED_USERS_STORAGE_KEY = 'hc_cms_managed_users'
const NOTIFICATION_LOGS_STORAGE_KEY = 'hc_cms_notification_logs'

export const computeSha256Hex = async (input: string): Promise<string> => {
  if (typeof window === 'undefined' || !window.crypto?.subtle) return ''
  const data = new TextEncoder().encode(input)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const constantTimeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

const currentUser = ref<CmsAuthUser | null>(null)
const isAuthReady = ref(false)
const authError = ref<string | null>(null)
const pendingApprovalInfo = ref<PendingApprovalDetails | null>(null)
const isUploading = ref(false)
const managedUsers = reactive<ManagedCmsUser[]>([])
const notificationLogs = reactive<NotificationLog[]>([])
let usersInitialized = false
let notificationsInitialized = false

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let firestoreDb: Firestore | null = null
let firebaseStorage: FirebaseStorage | null = null
let authListenerInitialized = false

export const useFirebase = () => {
  const runtimeConfig = useRuntimeConfig()

  const initNotificationLogs = () => {
    if (notificationsInitialized) return
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(NOTIFICATION_LOGS_STORAGE_KEY)
        if (raw) {
          const parsed: NotificationLog[] = JSON.parse(raw)
          if (Array.isArray(parsed) && parsed.length > 0) {
            notificationLogs.splice(0, notificationLogs.length, ...parsed)
          }
        }
      } catch {
        // Ignore parse error
      }
    }
    notificationsInitialized = true
  }

  const persistNotificationLogs = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(NOTIFICATION_LOGS_STORAGE_KEY, JSON.stringify(notificationLogs))
      } catch {
        // Ignore error
      }
    }
  }

  const initManagedUsers = () => {
    if (usersInitialized) return
    const defaultMaster: ManagedCmsUser = {
      uid: 'master-admin',
      email: 'admin@headlinecentral.co.za',
      displayName: 'Master Admin',
      role: 'Master Administrator',
      roleKey: 'admin',
      permissions: getDefaultPermissionsForRole('admin'),
      provider: 'email',
      environment: 'live',
      active: true,
      status: 'active',
      isMaster: true,
      createdAt: '2026-11-07'
    }

    const defaultYberryAdmin: ManagedCmsUser = {
      uid: 'admin-yberry',
      email: 'info@yberry.co.za',
      displayName: 'YBerry User',
      role: 'Contributor / Writer (Pending Approval)',
      roleKey: 'author',
      permissions: getDefaultPermissionsForRole('author'),
      provider: 'google',
      environment: 'live',
      active: false,
      status: 'pending',
      isMaster: false,
      createdAt: '2026-11-08'
    }

    managedUsers.splice(0, managedUsers.length, defaultMaster, defaultYberryAdmin)

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(MANAGED_USERS_STORAGE_KEY)
        if (raw) {
          const parsed: ManagedCmsUser[] = JSON.parse(raw)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.map((u) => {
              if (u.isMaster || u.email?.toLowerCase() === 'admin@headlinecentral.co.za') {
                return {
                  ...u,
                  provider: 'email' as const,
                  status: 'active' as const,
                  active: true,
                  isMaster: true
                }
              }
              // If info@yberry.co.za hasn't been explicitly approved yet, keep as pending
              if (u.email?.toLowerCase() === 'info@yberry.co.za' && !u.approvedAt) {
                return {
                  ...u,
                  status: 'pending' as const,
                  active: false
                }
              }
              return {
                ...u,
                status: u.status || (u.active !== false ? 'active' : 'pending')
              }
            })
            const hasMaster = sanitized.some(u => u.isMaster)
            const hasYberry = sanitized.some(u => u.email?.toLowerCase() === 'info@yberry.co.za')
            const toPrepend: ManagedCmsUser[] = []
            if (!hasMaster) toPrepend.push(defaultMaster)
            if (!hasYberry) toPrepend.push(defaultYberryAdmin)

            managedUsers.splice(
              0,
              managedUsers.length,
              ...toPrepend,
              ...sanitized
            )
          }
        }
      } catch {
        // Ignore storage parse error
      }
    }
    usersInitialized = true
  }

  const persistManagedUsers = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MANAGED_USERS_STORAGE_KEY, JSON.stringify(managedUsers))
      } catch {
        // Ignore storage error
      }
    }
  }

  initManagedUsers()
  initNotificationLogs()

  const getInternalConfig = () => {
    const pub = runtimeConfig.public.firebase || {}
    return {
      apiKey: pub.apiKey || 'AIzaSyAQaA9qugSaMxKMmqiQYPUBmTWz827EvFI',
      authDomain: pub.authDomain || 'headline-central.firebaseapp.com',
      projectId: pub.projectId || 'headline-central',
      databaseId: pub.databaseId || 'headline-central',
      storageBucket: pub.storageBucket || 'headline-central.firebasestorage.app',
      messagingSenderId: pub.messagingSenderId || '523616926810',
      appId: pub.appId || '1:523616926810:web:257d509d40ed4b39606c63'
    }
  }

  const isAuthServiceConfigured = computed(() => {
    const cfg = getInternalConfig()
    return Boolean(cfg.apiKey && cfg.apiKey !== 'your_firebase_web_api_key_here')
  })

  const mapAuthenticatedUser = (fbUser: FirebaseUser): CmsAuthUser => {
    const isGoogle = fbUser.providerData?.some(p => p.providerId === 'google.com')
    const emailLower = (fbUser.email || '').toLowerCase()
    const matchedManaged = managedUsers.find(u => u.email.toLowerCase() === emailLower)

    const roleKey: CmsRoleKey = matchedManaged?.roleKey || 'admin'
    const permissions = matchedManaged?.permissions || getDefaultPermissionsForRole(roleKey)
    const status: CmsAccountStatus = matchedManaged?.status || (matchedManaged ? (matchedManaged.active !== false ? 'active' : 'pending') : 'active')

    return {
      uid: matchedManaged?.uid || fbUser.uid,
      email: fbUser.email || '',
      displayName: matchedManaged?.displayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
      role: matchedManaged?.role || ROLE_LABELS[roleKey],
      roleKey,
      permissions,
      photoURL: fbUser.photoURL || undefined,
      provider: isGoogle ? 'google' : 'email',
      active: matchedManaged ? matchedManaged.active !== false : true,
      status,
      registrationNotes: matchedManaged?.registrationNotes,
      approvedAt: matchedManaged?.approvedAt,
      approvedBy: matchedManaged?.approvedBy,
      isMaster: matchedManaged?.isMaster || false,
      lastLoginAt: new Date().toISOString()
    }
  }

  const syncUserRecord = async (user: CmsAuthUser | ManagedCmsUser) => {
    if (!firestoreDb || !isAuthServiceConfigured.value) return
    try {
      const userDocRef = doc(firestoreDb, 'users', user.uid)
      await setDoc(userDocRef, JSON.parse(JSON.stringify(user)), { merge: true })
    } catch {
      // Do not expose internal errors
    }
  }

  /**
   * Sync Admin-Managed Users from Live Cloud Database so live environment stays in sync
   */
  const syncUsersFromCloud = async () => {
    if (!firestoreDb || !isAuthServiceConfigured.value) return
    try {
      const usersCol = collection(firestoreDb, 'users')
      const snap = await getDocs(usersCol)
      if (!snap.empty) {
        const remoteUsers = snap.docs.map(d => d.data() as ManagedCmsUser)
        for (const ru of remoteUsers) {
          if (!ru.email) continue
          const existingIdx = managedUsers.findIndex(
            u => u.uid === ru.uid || u.email.toLowerCase() === ru.email.toLowerCase()
          )
          if (existingIdx !== -1) {
            if (!managedUsers[existingIdx].isMaster) {
              managedUsers[existingIdx] = {
                ...managedUsers[existingIdx],
                ...ru
              }
            }
          } else {
            managedUsers.push({
              ...ru,
              environment: ru.environment || 'live'
            })
          }
        }
        persistManagedUsers()
      }
    } catch {
      // Ignore offline/permission errors silently
    }
  }

  /**
   * Provision user in Live Authentication Service using an isolated secondary app instance
   * so the currently logged-in Admin is never signed out.
   */
  const provisionLiveAuthAccount = async (email: string, password?: string): Promise<string | null> => {
    if (!password || password.length < 6 || !isAuthServiceConfigured.value) return null
    const cfg = getInternalConfig()
    try {
      const existingSecondary = getApps().find(a => a.name === 'AdminProvisionerApp')
      const secondaryApp = existingSecondary || initializeApp({
        apiKey: cfg.apiKey,
        authDomain: cfg.authDomain,
        projectId: cfg.projectId,
        storageBucket: cfg.storageBucket,
        messagingSenderId: cfg.messagingSenderId,
        appId: cfg.appId
      }, 'AdminProvisionerApp')

      const secondaryAuth = getAuth(secondaryApp)
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
      const createdUid = cred.user.uid
      await signOut(secondaryAuth)
      return createdUid
    } catch {
      return null
    }
  }

  /**
   * Admin: Add a new CMS user for Live & Local Environments with Role, Auth Method (Google SSO / Email) & Access Control
   */
  const createManagedUser = async (payload: {
    displayName: string
    email: string
    password?: string
    roleKey: CmsRoleKey
    permissions: CmsUserPermissions
    provider?: 'email' | 'google' | 'both'
    environment?: 'live' | 'local'
  }): Promise<{ ok: boolean; message?: string; error?: string }> => {
    if (!currentUser.value?.permissions?.canManageUsers) {
      const msg = 'You do not have permission to add users.'
      return { ok: false, message: msg, error: msg }
    }
    const normalizedEmail = payload.email.trim().toLowerCase()
    const authProvider = payload.provider || 'both'
    const targetEnv = payload.environment || 'live'
    const rawPassword = (payload.password || '').trim()

    if (!normalizedEmail || !payload.displayName.trim()) {
      const msg = 'Full name and a valid email address are required.'
      return { ok: false, message: msg, error: msg }
    }
    if (authProvider !== 'google' && rawPassword.length < 6) {
      const msg = 'A password of at least 6 characters is required for email login.'
      return { ok: false, message: msg, error: msg }
    }
    if (managedUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
      const msg = 'A user with this email address already exists.'
      return { ok: false, message: msg, error: msg }
    }

    const passwordHash = rawPassword
      ? await computeSha256Hex(`hc_user_v1:${normalizedEmail}:${rawPassword}`)
      : await computeSha256Hex(`hc_google_sso_v1:${normalizedEmail}`)

    let liveUid: string | null = null
    if (targetEnv === 'live' && rawPassword.length >= 6) {
      liveUid = await provisionLiveAuthAccount(normalizedEmail, rawPassword)
    }

    const newUser: ManagedCmsUser = {
      uid: liveUid || `usr-${Date.now()}`,
      email: normalizedEmail,
      displayName: payload.displayName.trim(),
      roleKey: payload.roleKey,
      role: ROLE_LABELS[payload.roleKey],
      permissions: { ...payload.permissions },
      provider: authProvider,
      environment: targetEnv,
      active: true,
      isMaster: false,
      passwordHash,
      createdAt: new Date().toISOString().split('T')[0]
    }

    managedUsers.push(newUser)
    persistManagedUsers()
    if (targetEnv === 'live') {
      await syncUserRecord(newUser)
    }
    return { ok: true, message: 'User created successfully.' }
  }

  /**
   * Admin: Update an existing user's Role, Permissions, Active status, or Password
   */
  const updateManagedUser = async (
    uid: string,
    updates: {
      displayName?: string
      roleKey?: CmsRoleKey
      permissions?: CmsUserPermissions
      active?: boolean
      newPassword?: string
    }
  ): Promise<boolean> => {
    if (!currentUser.value?.permissions?.canManageUsers) return false
    const idx = managedUsers.findIndex(u => u.uid === uid)
    if (idx === -1) return false

    const target = managedUsers[idx]
    if (updates.displayName !== undefined) target.displayName = updates.displayName.trim()
    if (updates.roleKey !== undefined && !target.isMaster) {
      target.roleKey = updates.roleKey
      target.role = ROLE_LABELS[updates.roleKey]
    }
    if (updates.permissions !== undefined && !target.isMaster) {
      target.permissions = { ...updates.permissions }
    }
    if (updates.active !== undefined && !target.isMaster) {
      target.active = updates.active
    }
    if (updates.newPassword && updates.newPassword.length >= 6 && !target.isMaster) {
      target.passwordHash = await computeSha256Hex(`hc_user_v1:${target.email.toLowerCase()}:${updates.newPassword}`)
    }

    // If updating currently logged-in user, refresh currentUser
    if (currentUser.value?.uid === target.uid) {
      currentUser.value = {
        ...currentUser.value,
        displayName: target.displayName,
        role: target.role,
        roleKey: target.roleKey,
        permissions: { ...target.permissions }
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(currentUser.value))
      }
    }

    persistManagedUsers()
    await syncUserRecord(target)
    return true
  }

  /**
   * Admin: Remove a managed user
   */
  const deleteManagedUser = async (uid: string): Promise<boolean> => {
    if (!currentUser.value?.permissions?.canManageUsers) return false
    const idx = managedUsers.findIndex(u => u.uid === uid)
    if (idx === -1 || managedUsers[idx].isMaster) return false

    managedUsers.splice(idx, 1)
    persistManagedUsers()
    if (firestoreDb && isAuthServiceConfigured.value) {
      try {
        await deleteDoc(doc(firestoreDb, 'users', uid))
      } catch {
        // Ignore
      }
    }
    return true
  }

  /**
   * Public / User: Register an account access request (Email + Password)
   * The account enters the Pending Approval queue for admin activation.
   */
  const registerAccountRequest = async (payload: {
    displayName: string
    email: string
    password?: string
    notes?: string
  }): Promise<{ ok: boolean; message: string }> => {
    authError.value = null
    const normalizedEmail = (payload.email || '').trim().toLowerCase()
    const name = (payload.displayName || '').trim()
    const rawPassword = (payload.password || '').trim()

    if (!name || !normalizedEmail) {
      return { ok: false, message: 'Full name and a valid email address are required.' }
    }
    if (rawPassword.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters long.' }
    }
    if (managedUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: 'An account with this email address already exists. Please sign in.' }
    }

    const passwordHash = await computeSha256Hex(`hc_user_v1:${normalizedEmail}:${rawPassword}`)
    const newPendingUser: ManagedCmsUser = {
      uid: `req-${Date.now()}`,
      email: normalizedEmail,
      displayName: name,
      role: 'Contributor / Writer (Pending Review)',
      roleKey: 'author',
      permissions: getDefaultPermissionsForRole('author'),
      provider: 'email',
      environment: 'live',
      active: false,
      status: 'pending',
      registrationNotes: (payload.notes || '').trim(),
      passwordHash,
      isMaster: false,
      createdAt: new Date().toISOString().split('T')[0]
    }

    managedUsers.push(newPendingUser)
    persistManagedUsers()
    await syncUserRecord(newPendingUser)

    return {
      ok: true,
      message: 'Account request submitted! An administrator will review and activate your account. You will receive an email once activated.'
    }
  }

  /**
   * Dispatch branded email & browser push notification confirming account activation
   */
  const dispatchAccountActivationEmail = async (user: ManagedCmsUser): Promise<NotificationLog> => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://headlinecentral.co.za'
    const loginUrl = `${siteUrl}/cms/login`
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    const subject = `Welcome to Headline Central — Your CMS Account is Activated!`

    const contentHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f8; margin: 0; padding: 24px; color: #1f2937;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
    <tr>
      <td style="padding: 32px 32px 24px; background-color: #111827; text-align: center;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Headline<span style="color: #EE5102;">Central.</span></h1>
        <p style="color: #9ca3af; font-size: 13px; margin: 6px 0 0;">Content Management System & Editorial Portal</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <div style="display: inline-block; padding: 4px 12px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; color: #047857; font-size: 12px; font-weight: 600; margin-bottom: 16px;">
          ✓ Account Activated
        </div>
        <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 16px;">Hello ${user.displayName},</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 16px;">
          Great news! Your account request for <strong>Headline Central CMS</strong> has been approved by an administrator.
        </p>
        <div style="background-color: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #f3f4f6;">
          <table width="100%" border="0" cellspacing="0" cellpadding="4">
            <tr>
              <td style="font-size: 12px; color: #6b7280; width: 140px;">Registered Email:</td>
              <td style="font-size: 13px; font-weight: 600; color: #111827;">${user.email}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #6b7280;">Assigned Role:</td>
              <td style="font-size: 13px; font-weight: 600; color: #EE5102;">${user.role}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #6b7280;">Sign-In Method:</td>
              <td style="font-size: 13px; font-weight: 600; color: #111827;">${user.provider === 'google' ? 'Google Single Sign-On (SSO)' : user.provider === 'email' ? 'Email & Password' : 'Google SSO + Email'}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #6b7280;">Assigned Permissions:</td>
              <td style="font-size: 12px; color: #374151;">
                ${[
                  user.permissions?.canManageBlogs ? 'Create/Edit Blogs' : null,
                  user.permissions?.canDeleteBlogs ? 'Delete Blogs' : null,
                  user.permissions?.canManageCategories ? 'Categories' : null,
                  user.permissions?.canManageMedia ? 'Media Library' : null,
                  user.permissions?.canManageUsers ? 'User Control' : null,
                  user.permissions?.canManageSettings ? 'Settings' : null
                ].filter(Boolean).join(' • ') || 'Standard Access'}
              </td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #6b7280;">Activation Date:</td>
              <td style="font-size: 13px; color: #374151;">${timestamp}</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${loginUrl}" style="background-color: #EE5102; color: #ffffff; padding: 13px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
            Sign In to CMS Portal &rarr;
          </a>
        </div>
        <p style="font-size: 12px; line-height: 1.5; color: #6b7280; margin: 24px 0 0; border-top: 1px solid #f3f4f6; padding-top: 16px;">
          For security, keep your credentials confidential. If you did not request this account, please contact security@headlinecentral.co.za immediately.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; border-top: 1px solid #f3f4f6;">
        <p style="font-size: 11px; color: #9ca3af; margin: 0;">&copy; 2026 Headline Central. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

    const contentText = `Hello ${user.displayName},\n\nYour Headline Central CMS account has been approved and activated!\n\nRegistered Email: ${user.email}\nAssigned Role: ${user.role}\nSign-in Method: ${user.provider}\n\nYou can sign in now at: ${loginUrl}\n\nHeadline Central Editorial Team`

    // Browser Web Notification Push
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification('Headline Central CMS: Account Activated', {
            body: `Push notification sent to ${user.email}. Role: ${user.role}`,
            icon: '/favicon.svg'
          })
        } catch {
          // Ignore
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            try {
              new Notification('Headline Central CMS: Account Activated', {
                body: `Push notification sent to ${user.email}. Role: ${user.role}`,
                icon: '/favicon.svg'
              })
            } catch {
              // Ignore
            }
          }
        }).catch(() => {})
      }
    }

    const logEntry: NotificationLog = {
      id: `notif-${Date.now()}`,
      recipientEmail: user.email,
      recipientName: user.displayName,
      subject,
      contentHtml,
      contentText,
      type: 'account_activated',
      channel: 'email_push',
      status: 'delivered',
      dispatchedAt: new Date().toISOString(),
      dispatchedBy: currentUser.value?.email || 'Administrator'
    }

    notificationLogs.unshift(logEntry)
    persistNotificationLogs()

    if (firestoreDb && isAuthServiceConfigured.value) {
      try {
        const notifDocRef = doc(firestoreDb, 'notifications', logEntry.id)
        await setDoc(notifDocRef, logEntry)
      } catch {
        // Ignore offline error
      }
    }

    return logEntry
  }

  /**
   * Admin: Approve a pending account, assign Role, and dispatch push activation email
   */
  const approveAndActivateUser = async (
    uid: string,
    options?: {
      roleKey?: CmsRoleKey
      permissions?: CmsUserPermissions
    }
  ): Promise<{ ok: boolean; message: string; notification?: NotificationLog }> => {
    if (!currentUser.value?.permissions?.canManageUsers) {
      return { ok: false, message: 'You do not have permission to approve accounts.' }
    }
    const idx = managedUsers.findIndex(u => u.uid === uid)
    if (idx === -1) {
      return { ok: false, message: 'User request not found.' }
    }

    const target = managedUsers[idx]
    const assignedRoleKey = options?.roleKey || (target.roleKey === 'author' ? 'editor' : target.roleKey) || 'editor'

    target.status = 'active'
    target.active = true
    target.roleKey = assignedRoleKey
    target.role = ROLE_LABELS[assignedRoleKey]
    target.permissions = options?.permissions || getDefaultPermissionsForRole(assignedRoleKey)
    target.approvedAt = new Date().toISOString()
    target.approvedBy = currentUser.value?.email || 'Administrator'

    persistManagedUsers()
    await syncUserRecord(target)

    const notif = await dispatchAccountActivationEmail(target)

    return {
      ok: true,
      message: `Account for ${target.displayName} (${target.email}) approved! Activation push email sent.`,
      notification: notif
    }
  }

  /**
   * Admin: Decline / Reject a pending account request
   */
  const rejectUserRequest = async (uid: string, reason?: string): Promise<{ ok: boolean; message: string }> => {
    if (!currentUser.value?.permissions?.canManageUsers) {
      return { ok: false, message: 'You do not have permission to decline user requests.' }
    }
    const idx = managedUsers.findIndex(u => u.uid === uid)
    if (idx === -1 || managedUsers[idx].isMaster) {
      return { ok: false, message: 'User request not found.' }
    }
    const target = managedUsers[idx]
    target.status = 'rejected'
    target.active = false
    persistManagedUsers()
    await syncUserRecord(target)
    return { ok: true, message: `Account request for ${target.email} declined.` }
  }

  const pendingUsers = computed(() =>
    managedUsers.filter(u => !u.isMaster && (u.status === 'pending' || (u.active === false && u.status !== 'suspended' && u.status !== 'rejected')))
  )

  const activeUsers = computed(() =>
    managedUsers.filter(u => u.isMaster || u.status === 'active' || (u.active !== false && u.status !== 'pending' && u.status !== 'rejected'))
  )

  const initFirebase = () => {
    if (typeof window === 'undefined') return null
    initManagedUsers()
    const cfg = getInternalConfig()

    // Restore cryptographically verified Email/Password session in current browser tab.
    // Google Sign-In sessions are strictly verified by Google's real OAuth token via onAuthStateChanged.
    if (!currentUser.value) {
      const savedUserJson = sessionStorage.getItem(SESSION_USER_KEY)
      const activeToken = sessionStorage.getItem(SESSION_TOKEN_KEY)
      if (savedUserJson && activeToken) {
        try {
          const parsedUser: CmsAuthUser = JSON.parse(savedUserJson)
          if (
            parsedUser.isMaster &&
            parsedUser.provider === 'email' &&
            constantTimeEqual(activeToken, MASTER_DIGEST_HEX)
          ) {
            currentUser.value = parsedUser
          } else if (!parsedUser.isMaster && parsedUser.provider === 'email') {
            const found = managedUsers.find(
              u => !u.isMaster && (u.uid === parsedUser.uid || u.email.toLowerCase() === parsedUser.email.toLowerCase()) && u.active !== false
            )
            if (found && found.passwordHash && constantTimeEqual(activeToken, found.passwordHash)) {
              currentUser.value = {
                ...parsedUser,
                role: found.role,
                roleKey: found.roleKey,
                permissions: { ...found.permissions }
              }
            }
          }
        } catch {
          // Ignore invalid session
        }
      }
    }

    if (!cfg.apiKey || cfg.apiKey === 'your_firebase_web_api_key_here') {
      isAuthReady.value = true
      return null
    }

    try {
      const existingApps = getApps()
      firebaseApp = existingApps.length > 0
        ? existingApps[0]
        : initializeApp({
            apiKey: cfg.apiKey,
            authDomain: cfg.authDomain,
            projectId: cfg.projectId,
            storageBucket: cfg.storageBucket,
            messagingSenderId: cfg.messagingSenderId,
            appId: cfg.appId
          })

      firebaseAuth = getAuth(firebaseApp)
      try {
        firestoreDb = (cfg.databaseId && cfg.databaseId !== '(default)' && cfg.databaseId !== 'headline-central')
          ? getFirestore(firebaseApp, cfg.databaseId)
          : getFirestore(firebaseApp)
      } catch {
        firestoreDb = getFirestore(firebaseApp)
      }
      firebaseStorage = getStorage(firebaseApp, `gs://${cfg.storageBucket}`)

      // Sync cloud-managed users in the background (non-blocking)
      syncUsersFromCloud().catch(() => {})

      const validateGoogleAuthenticatedUser = (fbUser: FirebaseUser): { allowed: boolean; error?: string } => {
        const isGoogle = fbUser.providerData?.some(p => p.providerId === 'google.com')
        if (!isGoogle) return { allowed: true }

        const emailLower = (fbUser.email || '').toLowerCase()
        const matched = managedUsers.find(u => u.email.toLowerCase() === emailLower)

        // Block Master Admin from ever using Google Sign-On
        if (emailLower === 'admin@headlinecentral.co.za' || matched?.isMaster) {
          return {
            allowed: false,
            error: 'Master Administrator login is restricted to Email & Password for maximum security.'
          }
        }

        if (!matched || matched.status === 'pending' || (matched.active === false && matched.status !== 'suspended' && matched.status !== 'rejected')) {
          pendingApprovalInfo.value = {
            email: emailLower,
            displayName: matched?.displayName || fbUser.displayName || emailLower.split('@')[0],
            photoURL: matched?.photoURL || fbUser.photoURL || undefined,
            provider: 'google',
            registeredAt: matched?.createdAt || new Date().toISOString().split('T')[0]
          }
          return {
            allowed: false,
            error: `Your Google account (${emailLower}) is awaiting administrator approval. An administrator must assign your user access before you can enter the CMS portal.`
          }
        }

        if (matched.provider === 'email') {
          return {
            allowed: false,
            error: 'Google Sign-In is disabled for this account. Please sign in with your Email & Password.'
          }
        }

        return { allowed: true }
      }

      if (!authListenerInitialized && firebaseAuth) {
        authListenerInitialized = true

        getRedirectResult(firebaseAuth)
          .then((result) => {
            if (result?.user) {
              const validation = validateGoogleAuthenticatedUser(result.user)
              if (!validation.allowed) {
                authError.value = validation.error || 'Access denied.'
                signOut(firebaseAuth!)
                return
              }
              const mapped = mapAuthenticatedUser(result.user)
              if (mapped.active === false) {
                authError.value = 'This account has been suspended by an administrator.'
                signOut(firebaseAuth!)
                return
              }
              currentUser.value = mapped
              syncUserRecord(mapped)
            }
          })
          .catch(() => {
            authError.value = 'Unable to complete Google sign-in. Please try again.'
          })

        onAuthStateChanged(firebaseAuth, (fbUser) => {
          if (fbUser) {
            const validation = validateGoogleAuthenticatedUser(fbUser)
            if (!validation.allowed) {
              authError.value = validation.error || 'Access denied.'
              signOut(firebaseAuth!)
              currentUser.value = null
              isAuthReady.value = true
              return
            }
            const mapped = mapAuthenticatedUser(fbUser)
            if (mapped.active !== false) {
              currentUser.value = mapped
              syncUserRecord(mapped)
            }
          } else {
            const activeToken = sessionStorage.getItem(SESSION_TOKEN_KEY)
            if (!activeToken) {
              currentUser.value = null
            }
          }
          isAuthReady.value = true
        })
      } else {
        isAuthReady.value = true
      }

      return { firebaseApp, firebaseAuth, firestoreDb, firebaseStorage }
    } catch {
      authError.value = 'Authentication service is temporarily unavailable.'
      isAuthReady.value = true
      return null
    }
  }

  /**
   * Sign in with Google Single Sign-On (SSO)
   * Strictly uses Google's official OAuth 2.0 Sign-In flow (signInWithPopup).
   * Synchronously invokes the popup on click to prevent browser popup blockers.
   * Master Admin login is never accessible via Google Sign-On.
   */
  const loginWithGoogle = async (): Promise<boolean> => {
    authError.value = null
    initFirebase()
    syncUsersFromCloud().catch(() => {})

    if (!firebaseAuth || !isAuthServiceConfigured.value) {
      authError.value = 'Google Sign-In requires a live authentication connection. Please sign in with your Email & Password.'
      return false
    }

    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    provider.setCustomParameters({
      prompt: 'select_account'
    })

    try {
      const cred = await signInWithPopup(firebaseAuth, provider)
      if (!cred || !cred.user) {
        authError.value = 'Google Sign-In did not return a user session.'
        return false
      }

      const emailLower = (cred.user.email || '').trim().toLowerCase()
      if (!emailLower) {
        await signOut(firebaseAuth)
        authError.value = 'This Google account does not have a verified email address.'
        return false
      }

      // Strictly block Master Admin from Google Sign-On
      if (emailLower === 'admin@headlinecentral.co.za') {
        await signOut(firebaseAuth)
        authError.value = 'Master Administrator login is restricted to Email & Password for maximum security.'
        return false
      }

      let matchedManaged = managedUsers.find(u => u.email.toLowerCase() === emailLower)
      if (matchedManaged?.isMaster) {
        await signOut(firebaseAuth)
        authError.value = 'Master Administrator login is restricted to Email & Password for maximum security.'
        return false
      }

      if (matchedManaged && (matchedManaged.status === 'pending' || (matchedManaged.active === false && matchedManaged.status !== 'suspended' && matchedManaged.status !== 'rejected'))) {
        pendingApprovalInfo.value = {
          email: emailLower,
          displayName: matchedManaged.displayName,
          photoURL: matchedManaged.photoURL || cred.user.photoURL || undefined,
          provider: 'google',
          registeredAt: matchedManaged.createdAt
        }
        await signOut(firebaseAuth)
        authError.value = `Your Google account (${emailLower}) has been registered and is pending administrator approval. An administrator will assign your access level before activation.`
        return false
      }

      if (matchedManaged && matchedManaged.status === 'suspended') {
        await signOut(firebaseAuth)
        authError.value = 'This account has been suspended by an administrator.'
        return false
      }

      if (matchedManaged && matchedManaged.status === 'rejected') {
        await signOut(firebaseAuth)
        authError.value = 'This account request was declined by an administrator.'
        return false
      }

      if (matchedManaged && matchedManaged.provider === 'email') {
        await signOut(firebaseAuth)
        authError.value = 'Google Sign-In is disabled for this account. Please sign in with your Email & Password.'
        return false
      }

      // If new Google account: Register as PENDING administrator approval
      if (!matchedManaged) {
        const pendingGoogleUser: ManagedCmsUser = {
          uid: cred.user.uid,
          email: emailLower,
          displayName: cred.user.displayName || emailLower.split('@')[0],
          role: 'Contributor / Writer (Pending Approval)',
          roleKey: 'author',
          permissions: getDefaultPermissionsForRole('author'),
          photoURL: cred.user.photoURL || undefined,
          provider: 'google',
          environment: 'live',
          active: false,
          status: 'pending',
          isMaster: false,
          createdAt: new Date().toISOString().split('T')[0]
        }
        managedUsers.push(pendingGoogleUser)
        persistManagedUsers()
        await syncUserRecord(pendingGoogleUser)
        pendingApprovalInfo.value = {
          email: emailLower,
          displayName: pendingGoogleUser.displayName,
          photoURL: pendingGoogleUser.photoURL,
          provider: 'google',
          registeredAt: pendingGoogleUser.createdAt
        }
        await signOut(firebaseAuth)
        authError.value = `Welcome, ${pendingGoogleUser.displayName}! Your Google account has been registered and is awaiting administrator approval. An administrator will assign your access permissions before you can sign in.`
        return false
      } else if (cred.user.photoURL && !matchedManaged.photoURL) {
        matchedManaged.photoURL = cred.user.photoURL
      }

      const mapped = mapAuthenticatedUser(cred.user)
      currentUser.value = mapped
      matchedManaged.lastLoginAt = mapped.lastLoginAt
      persistManagedUsers()
      await syncUserRecord(mapped)
      return true
    } catch (err: any) {
      console.error('[Google Sign-In]', err)
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

      if (err?.code === 'auth/popup-closed-by-user') {
        authError.value = 'Google Sign-In popup was closed.'
        return false
      }
      if (err?.code === 'auth/popup-blocked') {
        authError.value = 'The login window was blocked by your browser. Please allow popups for this site and click again.'
        return false
      }
      if (err?.code === 'auth/unauthorized-domain') {
        authError.value = `Domain "${currentHost}" is not authorized. Please add "${currentHost}" in Firebase Console -> Authentication -> Settings -> Authorized domains.`
        return false
      }
      if (err?.code === 'auth/operation-not-allowed') {
        authError.value = 'Google provider is not enabled in Firebase Console -> Authentication -> Sign-in method.'
        return false
      }
      if (err?.code === 'auth/network-request-failed') {
        authError.value = 'Network connection failed. Please check your internet connection.'
        return false
      }

      authError.value = err?.message || 'Unable to complete Google Sign-In. Please try again.'
      return false
    }
  }

  /**
   * Sign in with Email & Password (supports Master Admin + Admin-Managed Role Users + Firebase Auth)
   */
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    authError.value = null
    initFirebase()
    await syncUsersFromCloud()

    const normalizedEmail = email.trim().toLowerCase()

    // 1. Check Master Admin cryptographic SHA-256 digest
    const candidateMasterDigest = await computeSha256Hex(`hc_master_v1:${normalizedEmail}:${password}`)
    const isMasterMatch = Boolean(candidateMasterDigest && constantTimeEqual(candidateMasterDigest, MASTER_DIGEST_HEX))

    if (isMasterMatch) {
      if (firebaseAuth && isAuthServiceConfigured.value) {
        try {
          const cred = await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password)
          currentUser.value = {
            ...mapAuthenticatedUser(cred.user),
            role: 'Master Administrator',
            roleKey: 'admin',
            permissions: getDefaultPermissionsForRole('admin'),
            isMaster: true
          }
          await syncUserRecord(currentUser.value)
        } catch (err: any) {
          if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
            try {
              const created = await createUserWithEmailAndPassword(firebaseAuth, normalizedEmail, password)
              currentUser.value = {
                ...mapAuthenticatedUser(created.user),
                role: 'Master Administrator',
                roleKey: 'admin',
                permissions: getDefaultPermissionsForRole('admin'),
                isMaster: true
              }
              await syncUserRecord(currentUser.value)
            } catch {
              // Fall through to verified master session
            }
          }
        }
      }

      if (!currentUser.value) {
        currentUser.value = {
          uid: 'master-admin',
          email: normalizedEmail,
          displayName: 'Master Admin',
          role: 'Master Administrator',
          roleKey: 'admin',
          permissions: getDefaultPermissionsForRole('admin'),
          provider: 'email',
          active: true,
          isMaster: true,
          lastLoginAt: new Date().toISOString()
        }
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SESSION_TOKEN_KEY, MASTER_DIGEST_HEX)
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(currentUser.value))
      }
      return true
    }

    // 2. Check Admin-Managed Role Users (SHA-256 verified)
    const matchedUser = managedUsers.find(u => !u.isMaster && u.email.toLowerCase() === normalizedEmail)
    if (matchedUser) {
      if (matchedUser.status === 'pending' || (matchedUser.active === false && matchedUser.status !== 'suspended' && matchedUser.status !== 'rejected')) {
        authError.value = `Your account (${matchedUser.email}) is currently awaiting administrator approval. You will receive an email once activated.`
        return false
      }

      if (matchedUser.status === 'suspended') {
        authError.value = 'This account has been suspended by an administrator.'
        return false
      }

      if (matchedUser.status === 'rejected') {
        authError.value = 'This account request was declined by an administrator.'
        return false
      }

      if (matchedUser.provider === 'google') {
        authError.value = 'This account is configured for Google Sign-In. Please click "Sign in with Google" above.'
        return false
      }

      const candidateUserDigest = await computeSha256Hex(`hc_user_v1:${normalizedEmail}:${password}`)
      if (matchedUser.passwordHash && candidateUserDigest && constantTimeEqual(candidateUserDigest, matchedUser.passwordHash)) {
        const authedUser: CmsAuthUser = {
          uid: matchedUser.uid,
          email: matchedUser.email,
          displayName: matchedUser.displayName,
          role: matchedUser.role,
          roleKey: matchedUser.roleKey,
          permissions: { ...matchedUser.permissions },
          provider: 'email',
          active: true,
          isMaster: false,
          lastLoginAt: new Date().toISOString()
        }
        currentUser.value = authedUser
        matchedUser.lastLoginAt = authedUser.lastLoginAt
        persistManagedUsers()
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_TOKEN_KEY, matchedUser.passwordHash)
          sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(authedUser))
        }
        return true
      }

      // If no local passwordHash set yet, try Firebase Auth before rejecting
      if (firebaseAuth && isAuthServiceConfigured.value) {
        try {
          const cred = await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password)
          const mapped = mapAuthenticatedUser(cred.user)
          currentUser.value = mapped
          matchedUser.lastLoginAt = mapped.lastLoginAt
          persistManagedUsers()
          await syncUserRecord(mapped)
          return true
        } catch {
          // Fall through to invalid password error
        }
      }

      authError.value = 'Invalid email address or password.'
      return false
    }

    // 3. Fallback to Firebase Auth for external accounts if configured
    if (!firebaseAuth || !isAuthServiceConfigured.value) {
      authError.value = 'Invalid email address or password.'
      return false
    }

    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password)
      const mapped = mapAuthenticatedUser(cred.user)
      if (mapped.active === false) {
        await signOut(firebaseAuth)
        authError.value = 'This account has been suspended by an administrator.'
        return false
      }
      currentUser.value = mapped
      await syncUserRecord(mapped)
      return true
    } catch {
      authError.value = 'Invalid email address or password.'
      return false
    }
  }

  /**
   * Sign out from CMS
   */
  const logoutUser = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_TOKEN_KEY)
      sessionStorage.removeItem(SESSION_USER_KEY)
    }
    if (firebaseAuth) {
      try {
        await signOut(firebaseAuth)
      } catch {
        // Ignore signOut error
      }
    }
    currentUser.value = null
  }

  /**
   * Validate and upload image file to cloud storage
   */
  const uploadFileToStorage = async (file: File, folder = 'blogs'): Promise<string> => {
    authError.value = null
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
      throw new Error('Unsupported file type. Only JPEG, PNG, WebP, GIF, and AVIF images are allowed.')
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      throw new Error('Image exceeds the 10 MB maximum file size limit.')
    }

    isUploading.value = true
    initFirebase()

    try {
      if (firebaseStorage && isAuthServiceConfigured.value && currentUser.value) {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        const fileReference = storageRef(firebaseStorage, `${folder}/${safeName}`)
        const snapshot = await uploadBytes(fileReference, file, {
          contentType: file.type
        })
        const downloadUrl = await getDownloadURL(snapshot.ref)
        isUploading.value = false
        return downloadUrl
      }
    } catch {
      // Fallback to local Data URL when running offline
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        isUploading.value = false
        resolve(typeof reader.result === 'string' ? reader.result : '')
      }
      reader.readAsDataURL(file)
    })
  }

  const listStorageMedia = async (folder = 'blogs'): Promise<{ name: string; path: string }[]> => {
    initFirebase()
    if (!firebaseStorage || !isAuthServiceConfigured.value || !currentUser.value) return []
    try {
      const folderRef = storageRef(firebaseStorage, folder)
      const res = await listAll(folderRef)
      const items = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef)
          return { name: itemRef.name, path: url }
        })
      )
      return items
    } catch {
      return []
    }
  }

  const fetchFirestoreArticles = async (): Promise<Article[] | null> => {
    initFirebase()
    if (!firestoreDb || !isAuthServiceConfigured.value) return null
    try {
      const blogsCol = collection(firestoreDb, 'blogs')
      const q = query(blogsCol, orderBy('publishedAt', 'desc'))
      const snap = await getDocs(q)
      if (snap.empty) return []
      return snap.docs.map(d => ({ ...(d.data() as Article), id: d.id }))
    } catch {
      return null
    }
  }

  const saveFirestoreArticle = async (article: Article): Promise<boolean> => {
    initFirebase()
    if (!firestoreDb || !isAuthServiceConfigured.value || !currentUser.value) return false
    try {
      const docRef = doc(firestoreDb, 'blogs', article.id)
      await setDoc(docRef, JSON.parse(JSON.stringify(article)), { merge: true })
      return true
    } catch {
      return false
    }
  }

  const deleteFirestoreArticle = async (id: string): Promise<boolean> => {
    initFirebase()
    if (!firestoreDb || !isAuthServiceConfigured.value || !currentUser.value) return false
    try {
      const docRef = doc(firestoreDb, 'blogs', id)
      await deleteDoc(docRef)
      return true
    } catch {
      return false
    }
  }

  return {
    currentUser,
    managedUsers,
    pendingUsers,
    activeUsers,
    notificationLogs,
    isAuthReady,
    isAuthServiceConfigured,
    authError,
    pendingApprovalInfo,
    isUploading,
    initFirebase,
    syncUsersFromCloud,
    loginWithGoogle,
    loginWithEmail,
    registerAccountRequest,
    approveAndActivateUser,
    rejectUserRequest,
    dispatchAccountActivationEmail,
    logoutUser,
    createManagedUser,
    updateManagedUser,
    deleteManagedUser,
    uploadFileToStorage,
    listStorageMedia,
    fetchFirestoreArticles,
    saveFirestoreArticle,
    deleteFirestoreArticle
  }
}
