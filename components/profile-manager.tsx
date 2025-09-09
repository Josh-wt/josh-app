"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { createClient } from "@/lib/supabase/client"
import {
  User,
  Mail,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Settings,
  Shield,
  Database,
  ExternalLink,
} from "lucide-react"

interface ProfileData {
  email: string
  userId: string
  createdAt: string
  lastSignIn: string | null
  emailConfirmed: boolean
}

export function ProfileManager() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [supabaseCredentials, setSupabaseCredentials] = useState({
    url: "",
    anonKey: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchProfileData()
    fetchSupabaseCredentials()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        throw error
      }

      if (user) {
        setProfile({
          email: user.email || "",
          userId: user.id,
          createdAt: user.created_at,
          lastSignIn: user.last_sign_in_at,
          emailConfirmed: !!user.email_confirmed_at,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile data")
    } finally {
      setLoading(false)
    }
  }

  const fetchSupabaseCredentials = () => {
    // Get credentials from environment or hardcoded values
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cxrngznfmtucthfqfnng.supabase.co"
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cm5nem5mbXR1Y3RoZnFmbm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODgxNTEsImV4cCI6MjA3MDY2NDE1MX0.JbSSbeus1yw0ur38alj9DeNTi_jTKoZOSchqlcrS_Ow"
    
    setSupabaseCredentials({ url, anonKey })
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="flex items-center gap-2 px-3 py-2 bg-slate-100/50 hover:bg-slate-200/50 rounded-lg transition-colors text-sm"
    >
      {copiedField === field ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 text-slate-600" />
          <span className="text-slate-600">Copy {label}</span>
        </>
      )}
    </button>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200/50 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200/50 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200/50 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200/50 rounded w-1/4"></div>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Authentication Error</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={fetchProfileData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-slate-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Profile & Credentials</h2>
            <p className="text-slate-600">Manage your account information and access credentials</p>
          </div>
        </div>
      </GlassCard>

      {/* User Profile Information */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">User Profile</h3>
        </div>
        
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="font-medium text-slate-800">{profile?.email}</p>
                {profile?.emailConfirmed && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
            {profile?.email && (
              <CopyButton text={profile.email} field="email" label="Email" />
            )}
          </div>

          {/* User ID */}
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">User ID</p>
                <p className="font-mono text-sm text-slate-800 break-all">{profile?.userId}</p>
              </div>
            </div>
            {profile?.userId && (
              <CopyButton text={profile.userId} field="userId" label="User ID" />
            )}
          </div>

          {/* Account Created */}
          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-lg">
            <Settings className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Account Created</p>
              <p className="font-medium text-slate-800">
                {profile?.createdAt ? formatDate(profile.createdAt) : "Unknown"}
              </p>
            </div>
          </div>

          {/* Last Sign In */}
          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-lg">
            <Eye className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Last Sign In</p>
              <p className="font-medium text-slate-800">
                {profile?.lastSignIn ? formatDate(profile.lastSignIn) : "Never"}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Supabase Credentials */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">Supabase Credentials</h3>
        </div>
        
        <div className="space-y-4">
          {/* Supabase URL */}
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Supabase URL</p>
                <p className="font-mono text-sm text-slate-800 break-all">{supabaseCredentials.url}</p>
              </div>
            </div>
            <CopyButton text={supabaseCredentials.url} field="url" label="URL" />
          </div>

          {/* Supabase Anon Key */}
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Anonymous Key</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-slate-800 break-all">
                    {showPassword ? supabaseCredentials.anonKey : "••••••••••••••••••••••••••••••••"}
                  </p>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:bg-slate-200/50 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <CopyButton text={supabaseCredentials.anonKey} field="anonKey" label="Key" />
          </div>
        </div>
      </GlassCard>

      {/* Environment Variables Info */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">Environment Setup</h3>
        </div>
        
        <div className="bg-slate-50/50 rounded-lg p-4">
          <p className="text-sm text-slate-600 mb-3">
            To use these credentials in your environment, create a <code className="bg-slate-200/50 px-2 py-1 rounded text-xs">.env.local</code> file:
          </p>
          <div className="bg-slate-800 text-green-400 p-3 rounded-lg font-mono text-sm">
            <div>NEXT_PUBLIC_SUPABASE_URL={supabaseCredentials.url}</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY={supabaseCredentials.anonKey}</div>
          </div>
          <button
            onClick={() => copyToClipboard(
              `NEXT_PUBLIC_SUPABASE_URL=${supabaseCredentials.url}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseCredentials.anonKey}`,
              "env"
            )}
            className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            {copiedField === "env" ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Environment Variables</span>
              </>
            )}
          </button>
        </div>
      </GlassCard>
    </div>
  )
}
