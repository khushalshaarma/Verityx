"use client"

import { Sparkles } from "lucide-react"
import Link from "next/link"

export function FooterSection() {
  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#6C63FF]" />
              <span className="text-lg font-bold text-white">HumanizeAI</span>
            </Link>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed">
              Transform AI-generated text into natural, authentic writing that resonates with readers.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Demo", "FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Contact", "Privacy"].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2026 HumanizeAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/30 hover:text-white/50 transition-colors">
              Terms
            </Link>
            <Link href="/" className="text-sm text-white/30 hover:text-white/50 transition-colors">
              Privacy
            </Link>
            <Link href="/" className="text-sm text-white/30 hover:text-white/50 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
