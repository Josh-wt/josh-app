import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    "https://cxrngznfmtucthfqfnng.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cm5nem5mbXR1Y3RoZnFmbm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODgxNTEsImV4cCI6MjA3MDY2NDE1MX0.JbSSbeus1yw0ur38alj9DeNTi_jTKoZOSchqlcrS_Ow",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
