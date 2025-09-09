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
  Clock,
  Lock,
  X,
  AlertCircle,
} from "lucide-react"

interface ProfileData {
  email: string
  userId: string
  createdAt: string
  lastSignIn: string | null
  emailConfirmed: boolean
  phone: string | null
  metadata: any
  appMetadata: any
  identities: any[]
}

export function ProfileManager() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [userSession, setUserSession] = useState<any>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchProfileData()
    fetchUserSession()
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
          lastSignIn: user.last_sign_in_at || null,
          emailConfirmed: !!user.email_confirmed_at,
          phone: user.phone || null,
          metadata: user.user_metadata,
          appMetadata: user.app_metadata,
          identities: user.identities || [],
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile data")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error fetching session:", error)
        return
      }
      setUserSession(session)
    } catch (err) {
      console.error("Error in fetchUserSession:", err)
    }
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords do not match")
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long")
      }

      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) {
        throw error
      }

      setPasswordSuccess("Password updated successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordSuccess(null)
      }, 2000)

    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const openPasswordModal = () => {
    setShowPasswordModal(true)
    setPasswordError(null)
    setPasswordSuccess(null)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordError(null)
    setPasswordSuccess(null)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
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

      {/* Password Management */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">Password Management</h3>
          </div>
          <button
            onClick={openPasswordModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>
        
        <div className="p-4 bg-slate-50/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Password Status</p>
              <p className="font-medium text-slate-800">Password is set and secure</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Authentication Information */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">Authentication Details</h3>
        </div>
        
        <div className="space-y-4">
          {/* Phone Number */}
          {profile?.phone && (
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-500">Phone Number</p>
                  <p className="font-medium text-slate-800">{profile.phone}</p>
                </div>
              </div>
              <CopyButton text={profile.phone} field="phone" label="Phone" />
            </div>
          )}

          {/* Access Token */}
          {userSession?.access_token && (
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-500">Access Token</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-slate-800 break-all">
                      {showPassword ? userSession.access_token : "••••••••••••••••••••••••••••••••"}
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
              <CopyButton text={userSession.access_token} field="accessToken" label="Token" />
            </div>
          )}

          {/* Refresh Token */}
          {userSession?.refresh_token && (
            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-500">Refresh Token</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-slate-800 break-all">
                      {showPassword ? userSession.refresh_token : "••••••••••••••••••••••••••••••••"}
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
              <CopyButton text={userSession.refresh_token} field="refreshToken" label="Refresh Token" />
            </div>
          )}

          {/* Session Expiry */}
          {userSession?.expires_at && (
            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-lg">
              <Clock className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm text-slate-500">Session Expires</p>
                <p className="font-medium text-slate-800">
                  {formatDate(new Date(userSession.expires_at * 1000).toISOString())}
                </p>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* User Metadata */}
      {(profile?.metadata && Object.keys(profile.metadata).length > 0) && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">User Metadata</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(profile.metadata).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-500 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="font-medium text-slate-800">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </p>
                </div>
                <CopyButton 
                  text={typeof value === 'object' ? JSON.stringify(value) : String(value)} 
                  field={`metadata-${key}`} 
                  label={key} 
                />
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Authentication Providers */}
      {profile?.identities && profile.identities.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">Authentication Providers</h3>
          </div>
          
          <div className="space-y-3">
            {profile.identities.map((identity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-500">Provider</p>
                  <p className="font-medium text-slate-800 capitalize">{identity.provider}</p>
                  {identity.identity_data?.email && (
                    <p className="text-xs text-slate-600 mt-1">{identity.identity_data.email}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Created</p>
                  <p className="text-xs text-slate-600">
                    {formatDate(identity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Change Password</h3>
              <button
                onClick={closePasswordModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password (min 6 characters)"
                  minLength={6}
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-700">{passwordError}</p>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-green-700">{passwordSuccess}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
