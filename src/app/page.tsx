"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] relative flex items-center justify-center">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-50"
      >
        <source src="/vid.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-black/20 z-[1]" />
      <motion.div
        initial={{ x: -600, opacity: 0, rotate: -10 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{
          default: {
            type: "spring",
            stiffness: 40,
            damping: 12,
            mass: 1.5,
            delay: 1,
          },
          opacity: {
            duration: 1.5,
            ease: "easeOut",
            delay: 1,
          },
        }}
        className="relative z-10"
      >
        <Link
          href="/dashboard"
          className="inline-block px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-xl hover:scale-105 transition-transform"
        >
          Humanizer
        </Link>
      </motion.div>
    </main>
  )
}
