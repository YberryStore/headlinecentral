export const useAsset = (path: string): string => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  const config = useRuntimeConfig()
  const base = (config.app?.baseURL || '/').replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}

