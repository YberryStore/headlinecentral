export const useAsset = (path: string): string => {
  if (!path) return ''
  const trimmed = path.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed
  }

  const config = useRuntimeConfig()
  const base = (config.app?.baseURL || '/').replace(/\/$/, '')

  let cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  if (base && base !== '/') {
    // If the path already has one or more repeated base prefixes (e.g. /headlinecentral/headlinecentral/), normalize it
    const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const multiBaseRegex = new RegExp(`^(?:${escapedBase})+`, 'g')
    cleanPath = cleanPath.replace(multiBaseRegex, base)

    if (cleanPath === base || cleanPath.startsWith(`${base}/`)) {
      return cleanPath
    }
  }

  return `${base}${cleanPath}`
}

