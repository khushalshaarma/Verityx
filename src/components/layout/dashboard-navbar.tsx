"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  LogOut,
  User,
  CreditCard,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/components/providers/theme-provider"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"

export function DashboardNavbar() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#000000]/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#7F5AF0] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          {!isMobile && (
            <span className="text-sm font-semibold text-white">HumanizeAI</span>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02]">
          <CreditCard className="w-3.5 h-3.5 text-[#6C63FF]" />
          <span className="text-xs text-white/60">{session?.user ? "250" : "10"} credits</span>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/10 bg-[#0a0a1a] backdrop-blur-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-3 border-b border-white/5">
                  <span className="text-xs font-medium text-white/60">Notifications</span>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm text-white/30">No new notifications</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-white/5 transition-all"
          >
            <Avatar className="w-7 h-7">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="text-[10px]">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {!isMobile && (
              <>
                <span className="text-xs text-white/70">
                  {session?.user?.name || "User"}
                </span>
                <ChevronDown className="w-3 h-3 text-white/30" />
              </>
            )}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#0a0a1a] backdrop-blur-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                    <CreditCard className="w-4 h-4" />
                    Billing
                  </button>
                  <div className="my-1 border-t border-white/5" />
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
