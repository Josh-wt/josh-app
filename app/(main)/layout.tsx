"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Menu, X } from "lucide-react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-purple-100/20 animate-pulse-slow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-200/10 to-blue-200/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 flex h-screen">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="mobile-nav lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`mobile-sidebar lg:relative lg:translate-x-0 lg:w-64 lg:flex-shrink-0 ${sidebarOpen ? 'open' : ''}`}>
          <SidebarNavigation onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="mobile-header">
            <GlassCard className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden glass-button p-2 rounded-lg hover:scale-105 transition-all touch-target-sm"
                  >
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  </button>
                  
                  <div className="min-w-0 flex-1">
                    <h1 className="mobile-heading bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                      Josh App <span className="mobile-text-xs text-slate-500 font-normal">v12</span>
                    </h1>
                    <p className="mobile-caption hidden sm:block">
                      Your personal productivity & creativity hub
                    </p>
                  </div>
                </div>
                
                <div className="glass-button p-2 sm:p-3 rounded-full touch-target-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm lg:text-lg font-semibold text-slate-700">J</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </header>

          {/* Main content area */}
          <main className="mobile-content flex-1 overflow-y-auto">
            <div className="mobile-space-y">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}