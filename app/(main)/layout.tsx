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
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-purple-100/20 animate-pulse-slow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-200/10 to-blue-200/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 flex h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <div className={`
          fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <SidebarNavigation onClose={() => setSidebarOpen(false)} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <header className="p-3 sm:p-4 lg:p-6 border-b border-white/20">
            <GlassCard className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden glass-button p-2 rounded-lg hover:scale-105 transition-all"
                  >
                    <Menu className="w-5 h-5 text-slate-600" />
                  </button>
                  
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Josh App <span className="text-xs sm:text-sm text-slate-500 font-normal">v9</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 hidden sm:block">
                      Your personal productivity & creativity hub
                    </p>
                  </div>
                </div>
                
                <div className="glass-button p-2 sm:p-3 rounded-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
                    <span className="text-sm sm:text-lg font-semibold text-slate-700">J</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
