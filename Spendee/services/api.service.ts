import { auth } from '@/firebase.config'

interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

interface ApiError {
  message: string
  status?: number
  statusText?: string
  url?: string
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class ApiService {
  private static baseUrl: string = `${process.env.EXPO_PUBLIC_API_BASE_URL}`
  private static defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  private static async getAuthHeader(): Promise<HeadersInit> {
    const user = auth.currentUser
    if (!user) return {}

    const token = await user.getIdToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private static async handleResponse<T>(
    response: Response,
  ): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred during the request',
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      }

      try {
        const errorData = await response.json()
        console.log(errorData)
        error.message = errorData.message || error.message
      } catch {
        console.log('Error parsing json', error)
      }
      throw error
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    }
  }

  public static async get<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { params, headers, ...restConfig } = config
    let url = this.baseUrl + endpoint
    const authHeader = await this.getAuthHeader()

    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            acc[key] = String(value)
            return acc
          },
          {} as Record<string, string>,
        ),
      ).toString()
      url += `?${queryString}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...authHeader, ...headers },
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }

  public static async post<T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { headers, ...restConfig } = config
    const url = this.baseUrl + endpoint
    const authHeader = await this.getAuthHeader()

    const response = await fetch(url, {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...authHeader, ...headers },
      body: data ? JSON.stringify(data) : undefined,
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }

  public static async put<T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { headers, ...restConfig } = config
    const url = this.baseUrl + endpoint
    const authHeader = await this.getAuthHeader()

    const response = await fetch(url, {
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...authHeader, ...headers },
      body: data ? JSON.stringify(data) : undefined,
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }

  public static async patch<T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { headers, ...restConfig } = config
    const url = this.baseUrl + endpoint
    const authHeader = await this.getAuthHeader()

    const response = await fetch(url, {
      method: 'PATCH',
      headers: { ...this.defaultHeaders, ...authHeader, ...headers },
      body: data ? JSON.stringify(data) : undefined,
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }

  public static async delete<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { headers, ...restConfig } = config
    const url = this.baseUrl + endpoint
    const authHeader = await this.getAuthHeader()

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...authHeader, ...headers },
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }
}

export default ApiService
