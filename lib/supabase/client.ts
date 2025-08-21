import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    "https://cxrngznfmtucthfqfnng.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cm5nem5mbXR1Y3RoZnFmbm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODgxNTEsImV4cCI6MjA3MDY2NDE1MX0.JbSSbeus1yw0ur38alj9DeNTi_jTKoZOSchqlcrS_Ow",
  )
}
