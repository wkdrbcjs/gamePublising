// plugins/api.ts
export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
  
    return {
      provide: {
        apiFetch: async (url: string, body: Record<string, any> = {}, options: any = {}) => {
          const defaults = {
            baseURL: '',
            method: 'POST',
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/json",
            },
          }
  
          const mergedOptions = { ...defaults, ...options }
          if (mergedOptions.method !== 'GET' && Object.keys(body).length > 0) {
            mergedOptions.body = JSON.stringify(body)
          }
  
          console.log('api provide : ', url, mergedOptions)
  
          const response = await $fetch(url, mergedOptions)
          return {
            data: response,
            error: (response as any)?.error || null
          }
        }
  
      }
    }
  })