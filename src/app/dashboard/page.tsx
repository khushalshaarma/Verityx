"use client"

import { motion } from "framer-motion"
import { Sparkles, FileText, History, TrendingUp, Zap, Cpu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const Chart = dynamic(() => import("recharts").then((mod: Record<string, unknown>) => {
  function ChartInner({ data, dataKey, color, type = "monotone" }: { data: Record<string, unknown>[]; dataKey: string; color: string; type?: string }) {
    const ResponsiveContainer = mod.ResponsiveContainer as React.ElementType
    const BarChart = mod.BarChart as React.ElementType
    const Bar = mod.Bar as React.ElementType
    const AreaChart = mod.AreaChart as React.ElementType
    const Area = mod.Area as React.ElementType
    const XAxis = mod.XAxis as React.ElementType
    const YAxis = mod.YAxis as React.ElementType
    const Tooltip = mod.Tooltip as React.ElementType
    const CartesianGrid = mod.CartesianGrid as React.ElementType
    if (type === "bar") {
      return (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0a0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }
    return (
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis dataKey={data[0]?.date ? "date" : "day"} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0a0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
            labelStyle={{ color: "rgba(255,255,255,0.7)" }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#gradient-${dataKey})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    )
  }
  return ChartInner
}), { ssr: false, loading: () => <div className="h-[180px] rounded-xl bg-white/5 animate-pulse" /> })

const mockWeeklyUsage = [
  { day: "Mon", requests: 12 }, { day: "Tue", requests: 18 }, { day: "Wed", requests: 15 },
  { day: "Thu", requests: 22 }, { day: "Fri", requests: 20 }, { day: "Sat", requests: 8 }, { day: "Sun", requests: 5 },
]

const mockHumanScoreTrend = [
  { date: "Mon", score: 62 }, { date: "Tue", score: 68 }, { date: "Wed", score: 71 },
  { date: "Thu", score: 75 }, { date: "Fri", score: 74 }, { date: "Sat", score: 78 }, { date: "Sun", score: 82 },
]

const mockWordsTrend = [
  { date: "Mon", words: 450 }, { date: "Tue", words: 680 }, { date: "Wed", words: 520 },
  { date: "Thu", words: 890 }, { date: "Fri", words: 760 }, { date: "Sat", words: 320 }, { date: "Sun", words: 210 },
]

const mockReadabilityTrend = [
  { date: "Mon", score: 63 }, { date: "Tue", score: 65 }, { date: "Wed", score: 68 },
  { date: "Thu", score: 72 }, { date: "Fri", score: 70 }, { date: "Sat", score: 74 }, { date: "Sun", score: 76 },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-white/40">Track your writing improvement</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Words Humanized", value: "3,830", icon: FileText, color: "#6C63FF", sub: "+12% this week" },
          { label: "Documents", value: "24", icon: History, color: "#00D4FF", sub: "7 this week" },
          { label: "Avg Human Score", value: "82%", icon: TrendingUp, color: "#10b981", sub: "+5% improvement" },
          { label: "Avg Readability", value: "74", icon: Sparkles, color: "#f59e0b", sub: "Good range" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-white/20 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Weekly Usage</h3>
            <span className="text-[10px] text-white/20">This week</span>
          </div>
          <Chart data={mockWeeklyUsage} dataKey="requests" color="#6C63FF" type="bar" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Human Score Trend</h3>
            <span className="text-[10px] text-white/20">+20 pts</span>
          </div>
          <Chart data={mockHumanScoreTrend} dataKey="score" color="#10b981" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Words Humanized</h3>
            <span className="text-[10px] text-white/20">3,830 total</span>
          </div>
          <Chart data={mockWordsTrend} dataKey="words" color="#3b82f6" type="bar" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Readability Trend</h3>
            <span className="text-[10px] text-white/20">+13 pts</span>
          </div>
          <Chart data={mockReadabilityTrend} dataKey="score" color="#f59e0b" />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-white/70">Gemini Requests</p>
            <p className="text-lg font-bold text-white">8</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-white/70">Local Engine Requests</p>
            <p className="text-lg font-bold text-white">16</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#6C63FF]/5 to-[#00D4FF]/5 backdrop-blur-xl"
      >
        <h2 className="text-xl font-semibold text-white mb-2">Ready to humanize your text?</h2>
        <p className="text-sm text-white/50 mb-6 max-w-lg">
          Transform AI-generated or rough drafts into natural, fluent writing in seconds.
        </p>
        <Link href="/dashboard/humanizer">
          <Button className="group">
            <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            Open Humanizer
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
