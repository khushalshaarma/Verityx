"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How does HumanizeAI work?",
    answer:
      "HumanizeAI uses advanced language models to analyze your text and transform it into more natural, flowing prose while preserving the original meaning. It detects repetitive patterns, improves sentence flow, enhances vocabulary diversity, and adjusts tone to match your preferences.",
  },
  {
    question: "Is my text kept private?",
    answer:
      "Yes. Your text is encrypted in transit and at rest. We never share or sell your content. You have full control to delete your documents at any time.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "You can paste text directly, upload TXT, DOCX, or PDF files, drag and drop files, or import from clipboard.",
  },
  {
    question: "Can I customize the output?",
    answer:
      "Absolutely. You can choose from multiple writing modes (Standard, Academic, Professional, Casual, Creative, and more), adjust tone, control intensity and creativity levels, and toggle options like keyword preservation and formatting.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes! The Free plan includes 10 humanizations per month with standard mode and basic tone options. Upgrade to Pro for unlimited access to all features.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-white/50">
            Everything you need to know
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-white/50 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
