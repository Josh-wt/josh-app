"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { GlassCard } from "./glass-card"
import {
  Send,
  Mic,
  Brain,
  Calendar,
  CheckSquare,
  Search,
  Lightbulb,
  Clock,
  Zap,
  User,
  Bot,
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "suggestion" | "action"
}

interface QuickAction {
  id: string
  label: string
  icon: any
  prompt: string
  category: "productivity" | "research" | "planning" | "analysis"
}

const quickActions: QuickAction[] = [
  {
    id: "plan-day",
    label: "Plan My Day",
    icon: Calendar,
    prompt: "Help me plan my day based on my tasks and priorities",
    category: "planning",
  },
  {
    id: "task-suggestions",
    label: "Task Suggestions",
    icon: CheckSquare,
    prompt: "Suggest tasks I should focus on based on my current workload",
    category: "productivity",
  },
  {
    id: "research-topic",
    label: "Research Helper",
    icon: Search,
    prompt: "Help me research a topic and provide key insights",
    category: "research",
  },
  {
    id: "productivity-tips",
    label: "Productivity Tips",
    icon: TrendingUp,
    prompt: "Give me personalized productivity tips based on my habits",
    category: "productivity",
  },
  {
    id: "goal-planning",
    label: "Goal Planning",
    icon: Target,
    prompt: "Help me break down my goals into actionable steps",
    category: "planning",
  },
  {
    id: "learning-path",
    label: "Learning Path",
    icon: BookOpen,
    prompt: "Create a learning path for a skill I want to develop",
    category: "analysis",
  },
]

const categoryColors = {
  productivity: "from-blue-400/20 to-blue-500/20 border-blue-300/30",
  research: "from-green-400/20 to-green-500/20 border-green-300/30",
  planning: "from-purple-400/20 to-purple-500/20 border-purple-300/30",
  analysis: "from-orange-400/20 to-orange-500/20 border-orange-300/30",
}

export function PersonalAiHub() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello Josh! I'm your personal AI assistant. I can help you with task management, research, scheduling, and provide smart suggestions to boost your productivity. What would you like to work on today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAiResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("plan") && message.includes("day")) {
      return "Based on your current tasks, I recommend starting with your high-priority work items this morning when your energy is highest. Schedule your dentist call for mid-afternoon, and save the learning tasks for evening when you can focus without interruptions. Would you like me to create a detailed schedule?"
    }

    if (message.includes("task") && message.includes("suggest")) {
      return "I notice you have several pending tasks. I suggest prioritizing: 1) Review morning emails (due today), 2) Call dentist for appointment (health-related), 3) Continue with your learning goals. The project timeline update can wait since it's already completed. Shall I help you break these down further?"
    }

    if (message.includes("research")) {
      return "I'd be happy to help with research! What topic would you like me to investigate? I can provide key insights, recent developments, credible sources, and actionable takeaways tailored to your needs."
    }

    if (message.includes("productivity")) {
      return "Here are some personalized productivity tips based on your patterns: 1) Use the Pomodoro technique for focused work sessions, 2) Batch similar tasks together (like all your calls), 3) Set specific times for email checking, 4) Take regular breaks to maintain energy. Which area would you like to focus on improving?"
    }

    if (message.includes("goal")) {
      return "Let's break down your goals into manageable steps! What's a specific goal you'd like to work on? I can help you create a timeline, identify key milestones, and suggest daily actions to keep you on track."
    }

    if (message.includes("learning")) {
      return "I can create a personalized learning path for you! What skill or topic would you like to develop? I'll suggest resources, create a study schedule, and recommend practical exercises to accelerate your learning."
    }

    // Default responses
    const responses = [
      "That's an interesting point! Let me help you think through this systematically. What specific aspect would you like to focus on first?",
      "I understand what you're looking for. Based on your current productivity patterns, I have some tailored suggestions. Would you like me to elaborate?",
      "Great question! I can provide some insights on this. Let me break it down into actionable steps for you.",
      "I'm here to help optimize your workflow. What's the main challenge you're facing with this right now?",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAiResponse(inputMessage),
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: QuickAction) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: action.prompt,
      sender: "user",
      timestamp: new Date(),
      type: "action",
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAiResponse(action.prompt),
        sender: "ai",
        timestamp: new Date(),
        type: "suggestion",
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredActions =
    selectedCategory === "all" ? quickActions : quickActions.filter((action) => action.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* AI Status & Quick Actions */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Personal AI Assistant</h2>
              <p className="text-sm text-slate-600">Ready to help with your productivity goals</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Online
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-slate-600">Quick Actions:</span>
          {[
            { key: "all", label: "All" },
            { key: "productivity", label: "Productivity" },
            { key: "research", label: "Research" },
            { key: "planning", label: "Planning" },
            { key: "analysis", label: "Analysis" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                "glass-button px-3 py-1 rounded-lg text-sm transition-all",
                selectedCategory === key && "glass-active",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className={cn(
                  "glass-button p-4 rounded-xl text-left hover:scale-105 transition-all bg-gradient-to-r border",
                  categoryColors[action.category],
                )}
              >
                <Icon className="w-5 h-5 text-slate-600 mb-2" />
                <div className="text-sm font-medium text-slate-800">{action.label}</div>
              </button>
            )
          })}
        </div>
      </GlassCard>

      {/* Chat Interface */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold text-slate-800">AI Conversation</h3>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.sender === "user" ? "justify-end" : "justify-start")}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-cyan-600" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl",
                  message.sender === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                    : "glass-button border border-slate-200/50",
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div
                  className={cn(
                    "text-xs mt-2 opacity-70",
                    message.sender === "user" ? "text-cyan-100" : "text-slate-500",
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 bg-gradient-to-r from-slate-400/20 to-slate-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="glass-button p-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-end gap-3">
          <div className="flex-1 glass-button p-3 rounded-2xl">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about productivity, planning, or research..."
              className="w-full bg-transparent border-none outline-none resize-none text-slate-800 placeholder-slate-500"
              rows={1}
              style={{ minHeight: "24px", maxHeight: "120px" }}
            />
          </div>

          <button className="glass-button p-3 rounded-xl group">
            <Mic className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors" />
          </button>

          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className={cn(
              "glass-button p-3 rounded-xl transition-all",
              inputMessage.trim()
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105"
                : "opacity-50 cursor-not-allowed",
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </GlassCard>

      {/* AI Insights */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-slate-800">Smart Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-button p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-800">Optimal Work Time</span>
            </div>
            <p className="text-sm text-slate-600">
              Your productivity peaks between 9-11 AM. Schedule important tasks then.
            </p>
          </div>

          <div className="glass-button p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-slate-800">Weekly Progress</span>
            </div>
            <p className="text-sm text-slate-600">You've completed 85% more tasks this week compared to last week!</p>
          </div>

          <div className="glass-button p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-slate-800">Goal Tracking</span>
            </div>
            <p className="text-sm text-slate-600">You're 3 days ahead of your monthly learning goal. Great progress!</p>
          </div>

          <div className="glass-button p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-slate-800">Energy Levels</span>
            </div>
            <p className="text-sm text-slate-600">
              Consider a 15-minute break. Your focus typically improves after short breaks.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
