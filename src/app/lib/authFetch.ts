export type AuthFetchOptions = RequestInit & {
  /**
   * If true, do not attach Authorization header even if token exists.
   * Useful for public endpoints.
   */
  skipAuth?: boolean
}

/**
 * Client-side fetch wrapper that:
 * - Reads token from localStorage ("access_token")
 * - Attaches Authorization: Bearer <token> automatically
 * - Sends cookies (credentials: "include") so guest_id persists
 */
export async function authFetch(input: RequestInfo | URL, options: AuthFetchOptions = {}) {
  const { skipAuth, headers, credentials, ...rest } = options

  const mergedHeaders = new Headers(headers ?? {})

  if (!skipAuth && typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token")
    if (token && !mergedHeaders.has("Authorization")) {
      mergedHeaders.set("Authorization", `Bearer ${token}`)
    }
  }

  return fetch(input, {
    ...rest,
    headers: mergedHeaders,
    credentials: credentials ?? "include",
  })
}

