export type ThemePreference = 'light' | 'dark'

export function normalizeTheme(value: string | null): ThemePreference {
  return value === 'dark' ? 'dark' : 'light'
}
