import { userAgents, type Endpoints } from '#common/constants'
import type { ApiContextEnum } from '#common/enums'

type EndpointValue = (typeof Endpoints)[keyof typeof Endpoints]

interface FetchParams {
  endpoint: EndpointValue
  params: Record<string, string | number>
  context?: ApiContextEnum
}

interface FetchResponse<T> {
  data: T
  ok: Response['ok']
}

const MAX_CONCURRENT_REQUESTS = 6
let activeRequests = 0
const queuedRequests: Array<() => void> = []

const acquireRequestSlot = async () => {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    await new Promise<void>((resolve) => queuedRequests.push(resolve))
  }

  activeRequests += 1
}

const releaseRequestSlot = () => {
  activeRequests -= 1
  queuedRequests.shift()?.()
}

export const useFetch = async <T>({ endpoint, params, context }: FetchParams): Promise<FetchResponse<T>> => {
  const url = new URL('https://www.jiosaavn.com/api.php')

  url.searchParams.append('__call', endpoint.toString())
  url.searchParams.append('_format', 'json')
  url.searchParams.append('_marker', '0')
  url.searchParams.append('api_version', '4')
  url.searchParams.append('ctx', context || 'web6dot0')

  Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])))

  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

  await acquireRequestSlot()

  let lastError: unknown

  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetch(url.toString(), {
          headers: { 'Content-Type': 'application/json', 'User-Agent': randomUserAgent },
          signal: AbortSignal.timeout(7_000)
        })

        if (!response.ok) {
          throw new Error(`JioSaavn responded with ${response.status}`)
        }

        const body = await response.text()
        let data: T

        try {
          data = JSON.parse(body) as T
        } catch {
          throw new Error('JioSaavn returned an invalid response')
        }

        return { data: data as T, ok: true }
      } catch (error) {
        lastError = error
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt))
      }
    }
  } finally {
    releaseRequestSlot()
  }

  throw lastError instanceof Error ? lastError : new Error('JioSaavn request failed')
}
