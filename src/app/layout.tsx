import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { AnimatedBackground } from "@/components/ui/animated-background"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "HumanizeAI | Transform AI Text into Natural Writing",
  description:
    "Make your AI-generated text sound human. Improve readability, flow, and tone while preserving your original meaning.",
  keywords: ["AI humanizer", "text humanizer", "writing assistant", "AI writing", "content enhancement"],
  openGraph: {
    title: "HumanizeAI | Transform AI Text into Natural Writing",
    description: "Make your AI-generated text sound human. Improve readability, flow, and tone.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");var d=document.documentElement;if(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)d.classList.add("dark");else if(t==="dark")d.classList.add("dark");else if(t==="light")d.classList.add("light");else d.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#000000] text-white`}
      >
        <AnimatedBackground />
        <div className="fixed inset-0 dot-grid pointer-events-none z-[1]" />
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
