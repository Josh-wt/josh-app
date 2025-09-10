"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import {
  Brain,
  CheckSquare,
  Heart,
  Target,
  DollarSign,
  BookOpen,
  StickyNote,
  Calendar,
  Zap,
  PenTool,
  BarChart3,
  User,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  FileText,
  CreditCard,
  Target as TargetIcon,
  Megaphone,
  TrendingUp,
  Settings
} from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: any
  path: string
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: Zap,
    path: "/overview",
    children: [
      { id: "overview-main", label: "Dashboard", icon: Zap, path: "/overview" },
      { id: "overview-analytics", label: "Analytics", icon: BarChart3, path: "/overview/analytics" },
      { id: "overview-performance", label: "Performance", icon: TrendingUp, path: "/overview/performance" }
    ]
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    path: "/tasks",
    children: [
      { id: "tasks-main", label: "All Tasks", icon: CheckSquare, path: "/tasks" },
      { id: "tasks-projects", label: "Projects", icon: FolderOpen, path: "/tasks/projects" },
      { id: "tasks-calendar", label: "Calendar", icon: Calendar, path: "/tasks/calendar" }
    ]
  },
  {
    id: "habits",
    label: "Habits",
    icon: Target,
    path: "/habits",
    children: [
      { id: "habits-main", label: "Habit Tracker", icon: Target, path: "/habits" },
      { id: "habits-streaks", label: "Streaks", icon: TrendingUp, path: "/habits/streaks" },
      { id: "habits-analytics", label: "Analytics", icon: BarChart3, path: "/habits/analytics" }
    ]
  },
  {
    id: "notes",
    label: "Notes",
    icon: StickyNote,
    path: "/notes",
    children: [
      { id: "notes-main", label: "All Notes", icon: StickyNote, path: "/notes" },
      { id: "notes-categories", label: "Categories", icon: FolderOpen, path: "/notes/categories" }
    ]
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: BarChart3,
    path: "/marketing",
    children: [
      { id: "marketing-main", label: "Dashboard", icon: BarChart3, path: "/marketing" },
      { id: "marketing-analytics", label: "Analytics", icon: TrendingUp, path: "/marketing/analytics" },
      { id: "marketing-campaigns", label: "Campaigns", icon: Megaphone, path: "/marketing/campaigns" }
    ]
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    path: "/finance",
    children: [
      { id: "finance-main", label: "Overview", icon: DollarSign, path: "/finance" },
      { id: "finance-transactions", label: "Transactions", icon: CreditCard, path: "/finance/transactions" },
      { id: "finance-budgets", label: "Budgets", icon: TargetIcon, path: "/finance/budgets" }
    ]
  },
  {
    id: "ai",
    label: "AI Hub",
    icon: Brain,
    path: "/ai"
  },
  {
    id: "mood",
    label: "Mood",
    icon: Heart,
    path: "/mood"
  },
  {
    id: "learning",
    label: "Learning",
    icon: BookOpen,
    path: "/learning"
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    path: "/calendar"
  },
  {
    id: "writing",
    label: "Writing",
    icon: PenTool,
    path: "/writing"
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    path: "/profile"
  }
]

interface SidebarNavigationProps {
  onClose?: () => void
}

export function SidebarNavigation({ onClose }: SidebarNavigationProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (path: string) => {
    if (path === "/overview") {
      return pathname === "/overview"
    }
    return pathname.startsWith(path)
  }

  const isExpanded = (itemId: string) => expandedItems.includes(itemId)

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="w-64 h-full bg-white/10 backdrop-blur-lg border-r border-white/20">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">Josh App <span className="text-xs text-slate-500 font-normal">v7</span></h1>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden glass-button p-2 rounded-lg hover:scale-105 transition-all"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const expanded = isExpanded(item.id)
            const active = isActive(item.path)

            return (
              <div key={item.id}>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    active 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 border border-blue-200/50' 
                      : 'hover:bg-white/10 text-slate-700'
                  }`}
                  onClick={() => hasChildren ? toggleExpanded(item.id) : null}
                >
                  <Link 
                    href={item.path} 
                    className="flex items-center space-x-3 flex-1"
                    onClick={(e) => {
                      if (hasChildren) {
                        e.preventDefault()
                      } else {
                        handleLinkClick()
                      }
                    }}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </Link>
                  
                  {hasChildren && (
                    <div className="ml-2">
                      {expanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>

                {hasChildren && expanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children!.map((child) => {
                      const childActive = pathname === child.path
                      return (
                        <Link
                          key={child.id}
                          href={child.path}
                          className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                            childActive 
                              ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border border-blue-200/30' 
                              : 'hover:bg-white/5 text-slate-600'
                          }`}
                          onClick={handleLinkClick}
                        >
                          <child.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">{child.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
