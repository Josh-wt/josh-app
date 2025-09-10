"use client"

import { GlassCard } from "@/components/glass-card"
import { SidebarNavigation } from "@/components/sidebar-navigation"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-purple-100/20 animate-pulse-slow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-200/10 to-blue-200/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 flex h-screen">
        {/* Sidebar Navigation */}
        <SidebarNavigation />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="p-6 border-b border-white/20">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Josh App
                  </h1>
                  <p className="text-slate-600 mt-1">Your personal productivity & creativity hub</p>
                </div>
                <div className="glass-button p-3 rounded-full">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-slate-700">J</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
