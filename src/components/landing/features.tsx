"use client"

import { motion } from "framer-motion"
import {
  FileText,
  Sliders,
  Layers,
  History,
  Share2,
  Shield,
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Smart Analysis",
    description: "AI analyzes your text for repetition, flow issues, and readability improvements.",
    color: "#6C63FF",
  },
  {
    icon: Sliders,
    title: "Fine Control",
    description: "Adjust intensity, creativity, tone, and mode to get exactly the output you need.",
    color: "#7F5AF0",
  },
  {
    icon: Layers,
    title: "Multiple Modes",
    description: "From academic to casual, professional to creative — write for any audience.",
    color: "#00D4FF",
  },
  {
    icon: History,
    title: "Version History",
    description: "Every generation is saved. Compare, restore, or review previous versions.",
    color: "#6C63FF",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Copy, download, or share your polished text in multiple formats.",
    color: "#7F5AF0",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your text is encrypted and never stored without permission. Full control over your data.",
    color: "#00D4FF",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Professional-grade writing enhancement tools at your fingertips
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative p-8 rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl hover:border-white/[0.1] transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
