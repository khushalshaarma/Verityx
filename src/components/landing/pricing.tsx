"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out",
    features: ["10 humanizations per month", "Standard mode", "Basic tone options", "TXT export"],
    color: "#6C63FF",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For serious writers",
    features: [
      "Unlimited humanizations",
      "All writing modes",
      "All tone options",
      "Full export formats",
      "Version history",
      "Priority support",
    ],
    popular: true,
    color: "#00D4FF",
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams and businesses",
    features: [
      "Everything in Pro",
      "5 team members",
      "Team workspace",
      "API access",
      "Custom branding",
      "Dedicated support",
    ],
    color: "#7F5AF0",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple Pricing
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Start for free, upgrade when you need more
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                plan.popular
                  ? "border-[#00D4FF]/30 bg-[#00D4FF]/[0.03] shadow-lg shadow-[#00D4FF]/5"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-xs font-medium text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-white/40">{plan.period}</span>
                )}
              </div>
              <p className="text-sm text-white/50 mb-8">{plan.description}</p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.name === "Free" ? "/dashboard" : "/register"}>
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.name === "Free" ? "Get Started" : "Subscribe"}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
