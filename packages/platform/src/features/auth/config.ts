import { ref } from 'vue'
import type { AppKey } from '../settings/types/app-setting.types'

interface AuthConfig {
  appKey: AppKey
  appTitle: string
  appSubtitle: string
  logoAlt: string
  loginTitle: string
  homeRoute: string
}

export const authConfig = ref<AuthConfig>({
  appKey: 'ACADEMIC',
  appTitle: '241 Apps',
  appSubtitle: 'Sistem Informasi Akademik',
  logoAlt: '241 Apps Logo',
  loginTitle: 'Masuk ke 241 Apps',
  homeRoute: '/',
})

export function configureAuth(config: Partial<typeof authConfig.value>) {
  authConfig.value = { ...authConfig.value, ...config }
}
