import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}

let tokenRefreshPromise: Promise<string | null> | null = null

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Use a shared promise to avoid multiple refresh attempts
        if (!tokenRefreshPromise) {
          tokenRefreshPromise = refreshAccessToken()
        }

        const newToken = await tokenRefreshPromise
        tokenRefreshPromise = null

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return client(originalRequest)
        } else {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/auth/login'
          return Promise.reject(error)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      return null
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { access_token } = response.data
    localStorage.setItem('access_token', access_token)
    return access_token
  } catch (error) {
    return null
  }
}

export function getApiClient(): AxiosInstance {
  return client
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown>
    return {
      message: data?.message || error.message || 'An error occurred',
      code: error.response?.status?.toString(),
      details: data?.details,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'An unexpected error occurred',
  }
}
