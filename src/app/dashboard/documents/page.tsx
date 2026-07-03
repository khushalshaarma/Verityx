"use client"

import { motion } from "framer-motion"
import { FileText, Trash2, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SavedDoc {
  id: string
  title: string
  content: string
  createdAt: Date
}

export default function DocumentsPage() {
  const [docs] = useState<SavedDoc[]>([])

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Saved Documents</h1>
          <p className="text-sm text-white/40">Your saved and favorite documents</p>
        </div>
        <Button size="sm" asChild>
          <a href="/dashboard/humanizer">
            <Plus className="w-4 h-4 mr-1.5" />
            New Document
          </a>
        </Button>
      </motion.div>

      {docs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-medium text-white/50 mb-2">No saved documents</h3>
          <p className="text-sm text-white/30 mb-6">
            Save your humanized texts for later reference
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/humanizer">
              <Plus className="w-4 h-4 mr-2" />
              Create Document
            </a>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-5 h-5 text-[#6C63FF]" />
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </Button>
              </div>
              <h3 className="text-sm font-medium text-white mb-1 truncate">{doc.title}</h3>
              <p className="text-xs text-white/30 line-clamp-2 mb-3">{doc.content}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-white/20">
                <Clock className="w-3 h-3" />
                {doc.createdAt.toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
