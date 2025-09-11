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
  Settings,
  X
} from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: any
  href: string
  children?: NavItem[]
}

interface SidebarNavigationProps {
  onClose?: () => void
}

export function SidebarNavigation({ onClose }: SidebarNavigationProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const navigationItems: NavItem[] = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      href: "/overview"
    },
    {
      id: "ai",
      label: "AI Assistant",
      icon: Brain,
      href: "/ai"
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: CheckSquare,
      href: "/tasks",
      children: [
        {
          id: "tasks-main",
          label: "All Tasks",
          icon: CheckSquare,
          href: "/tasks"
        },
        {
          id: "tasks-projects",
          label: "Projects",
          icon: FolderOpen,
          href: "/tasks/projects"
        },
        {
          id: "tasks-calendar",
          label: "Calendar",
          icon: Calendar,
          href: "/tasks/calendar"
        }
      ]
    },
    {
      id: "habits",
      label: "Habits",
      icon: Target,
      href: "/habits"
    },
    {
      id: "finance",
      label: "Finance",
      icon: DollarSign,
      href: "/finance"
    },
    {
      id: "learning",
      label: "Learning",
      icon: BookOpen,
      href: "/learning"
    },
    {
      id: "notes",
      label: "Notes",
      icon: StickyNote,
      href: "/notes"
    },
    {
      id: "writing",
      label: "Writing",
      icon: PenTool,
      href: "/writing"
    },
    {
      id: "mood",
      label: "Mood",
      icon: Heart,
      href: "/mood"
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: Megaphone,
      href: "/marketing"
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      href: "/calendar"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile"
    }
  ]

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose()
    }
  }

  const isActive = (href: string) => {
    if (href === "/overview") {
      return pathname === "/" || pathname === "/overview"
    }
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item.href)
    const Icon = item.icon

    return (
      <div key={item.id} className="mobile-space-y">
        <div className="mobile-flex-row">
          <Link
            href={item.href}
            onClick={handleLinkClick}
            className={`mobile-flex-row flex-1 glass-button rounded-lg p-3 transition-all touch-target ${
              active 
                ? "bg-white/50 shadow-sm text-slate-800" 
                : "text-slate-600 hover:text-slate-800 hover:bg-white/30"
            }`}
            style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="mobile-text font-medium truncate">{item.label}</span>
          </Link>
          
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="glass-button p-2 rounded-lg touch-target-sm ml-2"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              )}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mobile-space-y ml-4">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-white/10 backdrop-blur-lg border-r border-white/20 flex flex-col">
      {/* Header */}
      <div className="mobile-padding border-b border-white/20">
        <div className="mobile-flex-row justify-between items-center">
          <div className="mobile-flex-row items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">J</span>
            </div>
            <h1 className="mobile-subheading text-slate-800">Josh App <span className="mobile-text-xs text-slate-500 font-normal">v12</span></h1>
          </div>
          
          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden glass-button p-2 rounded-lg hover:scale-105 transition-all touch-target-sm"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mobile-padding mobile-space-y overflow-y-auto scrollbar-thin">
        {navigationItems.map(item => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="mobile-padding border-t border-white/20">
        <Link
          href="/profile"
          onClick={handleLinkClick}
          className={`mobile-flex-row glass-button rounded-lg p-3 transition-all touch-target ${
            isActive("/profile") 
              ? "bg-white/50 shadow-sm text-slate-800" 
              : "text-slate-600 hover:text-slate-800 hover:bg-white/30"
          }`}
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="mobile-text font-medium">Settings</span>
        </Link>
      </div>
    </div>
  )
}