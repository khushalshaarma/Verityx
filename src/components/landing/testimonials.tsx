"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Writer",
    content:
      "HumanizeAI has completely transformed my workflow. The output reads like I wrote it myself — natural, engaging, and authentic.",
    color: "#6C63FF",
  },
  {
    name: "Marcus Johnson",
    role: "Marketing Director",
    content:
      "We use HumanizeAI for all our content. The difference in engagement and readability is remarkable. Our audience can tell.",
    color: "#00D4FF",
  },
  {
    name: "Emily Rodriguez",
    role: "PhD Candidate",
    content:
      "The academic mode is incredible. It helps me maintain scholarly tone while making my writing flow naturally.",
    color: "#7F5AF0",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by Writers
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Join thousands of happy users who transformed their writing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl"
            >
              <Quote
                className="w-8 h-8 mb-4"
                style={{ color: `${testimonial.color}40` }}
              />
              <p className="text-white/70 leading-relaxed mb-6">
                {testimonial.content}
              </p>
              <div>
                <p className="text-white font-medium">{testimonial.name}</p>
                <p className="text-sm text-white/40">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
