"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/layout/dashboard-navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="h-screen flex flex-col bg-[#000000]">
      <DashboardNavbar />
      <div className="flex-1 flex overflow-hidden">
        {!isMobile && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
