"use client"

import { motion } from "framer-motion"
import { Type, Sparkles, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Type,
    title: "Paste Your Text",
    description: "Copy and paste your AI-generated or rough draft into the editor. Upload TXT, DOCX, or PDF files.",
    color: "#6C63FF",
    step: "01",
  },
  {
    icon: Sliders,
    title: "Customize Settings",
    description: "Choose your writing mode, tone, intensity, and creativity level to match your needs.",
    color: "#7F5AF0",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "Humanize",
    description: "Click humanize and watch as our AI transforms your text into natural, flowing prose.",
    color: "#00D4FF",
    step: "03",
  },
  {
    icon: CheckCircle,
    title: "Review & Export",
    description: "Review the enhanced text, compare versions, and export in your preferred format.",
    color: "#6C63FF",
    step: "04",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Four simple steps to better writing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-[#6C63FF] via-[#7F5AF0] to-[#00D4FF] origin-left"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                <step.icon className="w-7 h-7" style={{ color: step.color }} />
              </div>
              <span
                className="text-sm font-mono mb-3"
                style={{ color: step.color }}
              >
                {step.step}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/50 max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Sliders } from "lucide-react"
