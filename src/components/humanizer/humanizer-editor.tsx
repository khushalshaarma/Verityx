"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Upload, Copy, Check, Download, Share2, Save, RefreshCw,
  FileText, BarChart3, BookOpen, Type, Clock, AlertTriangle,
  Undo2, Redo2, GitCompare, Bot, Cpu, Zap, Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/toast"
import { useHistory } from "@/hooks/use-history"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard"
import { useAutosave } from "@/hooks/use-autosave"
import { cn } from "@/lib/utils"
import { BeforeAfterCards } from "./analysis-cards"
import { DiffViewer } from "./diff-viewer"
import { AnalysisExplanation } from "./analysis-explanation"
import { LiveStages } from "./live-stages"
import type { WritingMode, ToneOption, HumanizerResult } from "@/types"

const writingModes: { value: WritingMode; label: string; icon: string }[] = [
  { value: "standard", label: "Standard", icon: "📝" },
  { value: "academic", label: "Academic", icon: "🎓" },
  { value: "professional", label: "Professional", icon: "💼" },
  { value: "casual", label: "Casual", icon: "😊" },
  { value: "creative", label: "Creative", icon: "🎨" },
  { value: "student", label: "Student", icon: "📚" },
  { value: "blog", label: "Blog", icon: "✍️" },
  { value: "business", label: "Business", icon: "🏢" },
]

const toneOptions: { value: ToneOption; label: string }[] = [
  { value: "natural", label: "Natural" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "confident", label: "Confident" },
  { value: "persuasive", label: "Persuasive" },
  { value: "conversational", label: "Conversational" },
]

const modelOptions = [
  { value: "auto", label: "Auto", icon: Brain, desc: "Use Gemini if available, fallback to local" },
  { value: "gemini", label: "Gemini 2.0", icon: Zap, desc: "Google Gemini AI" },
  { value: "local", label: "Local Engine", icon: Cpu, desc: "Built-in humanizer" },
]

export function HumanizerEditor() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressStep, setProgressStep] = useState(0)
  const [copied, setCopied] = useState(false)
  const [result, setResult] = useState<HumanizerResult | null>(null)
  const [mode, setMode] = useState<WritingMode>("standard")
  const [tone, setTone] = useState<ToneOption>("natural")
  const [intensity, setIntensity] = useState(50)
  const [creativity, setCreativity] = useState(50)
  const [preserveKeywords, setPreserveKeywords] = useState(true)
  const [preserveFormatting, setPreserveFormatting] = useState(true)
  const [keepParagraphStructure, setKeepParagraphStructure] = useState(true)
  const [inputTab, setInputTab] = useState<"write" | "preview">("write")
  const [model, setModel] = useState<string>("auto")
  const [showDiff, setShowDiff] = useState(false)
  const [geminiFallback, setGeminiFallback] = useState(false)
  const [geminiErrorMsg, setGeminiErrorMsg] = useState("")
  const [modelLabel, setModelLabel] = useState("")
  const [iterations, setIterations] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()
  const textHistory = useHistory(input)

  useKeyboardShortcuts({
    "ctrl+z": () => { const prev = textHistory.undo(); if (prev !== null) setInput(prev) },
    "ctrl+y": () => { const next = textHistory.redo(); if (next !== null) setInput(next) },
    "ctrl+enter": () => handleHumanize(),
    "ctrl+shift+c": () => { if (output) handleCopy() },
  })

  useAutosave(input, (val) => { try { localStorage.setItem("humanize-draft", val) } catch {} })

  function handleInputChange(val: string) {
    textHistory.push(val)
    setInput(val)
  }

  async function handleHumanize() {
    if (!input.trim()) return
    setLoading(true)
    setProgress(0)
    setProgressStep(0)
    setShowDiff(false)
    setGeminiFallback(false)
    setModelLabel("")

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => prev < 5 ? prev + 1 : prev)
    }, 800)

    const progressInterval = setInterval(() => {
      setProgress((prev) => prev < 85 ? prev + Math.random() * 12 : prev)
    }, 300)

    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          options: { mode, tone, intensity, creativity, preserveKeywords, preserveFormatting, keepParagraphStructure, model },
        }),
      })

      if (!res.ok) throw new Error("Failed")

      const data = await res.json()
      setOutput(data.humanizedText)
      setResult(data)
      setProgress(100)
      setProgressStep(5)
      setModelLabel(data.modelUsed || "")
      setIterations(data.iterations || 0)
      if (data.geminiFailed) {
        setGeminiFallback(true)
        setGeminiErrorMsg(data.geminiError || "")
        const isQuota = (data.geminiError || "").toLowerCase().includes("quota")
        if (isQuota) {
          addToast(`Free tier quota reached. Using local engine.`, "info")
        } else {
          const suffix = data.geminiError ? ` (${data.geminiError})` : ""
          addToast(`Gemini failed${suffix}. Using local humanizer.`, "info")
        }
      } else {
        addToast("Text humanized successfully!", "success")
      }
    } catch {
      addToast("Failed to humanize text. Please try again.", "error")
    } finally {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      setTimeout(() => { setLoading(false); setProgress(0); setProgressStep(0) }, 1000)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      addToast("Copied to clipboard!", "success")
      setTimeout(() => setCopied(false), 2000)
    } catch { addToast("Failed to copy", "error") }
  }

  function handleDownload(format: string) {
    if (!output) return
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `humanized-text.${format}`
    a.click(); URL.revokeObjectURL(url)
    addToast(`Downloaded as ${format.toUpperCase()}`, "success")
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setInput(text); textHistory.push(text)
      addToast("File loaded successfully", "success")
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        setInput(text); textHistory.push(text)
      }
      reader.readAsText(file)
    }
  }

  function handleRegenerate() { handleHumanize() }

  function handleShare() {
    if (!output) return
    if (navigator.share) navigator.share({ text: output })
    else handleCopy()
  }

  const hasAnalysis = result?.analysis?.before && result?.analysis?.after

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {geminiFallback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl animate-border-glow",
              geminiErrorMsg.toLowerCase().includes("quota")
                ? "border-red-500/20 bg-red-500/5"
                : "border-amber-500/20 bg-amber-500/5"
            )}
          >
            <Bot className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-xs text-amber-300/80 block truncate">
                {geminiErrorMsg.toLowerCase().includes("quota")
                  ? "Gemini quota reached. Using local engine."
                  : "Gemini unavailable. Using local humanizer."}
              </span>
              {geminiErrorMsg && (
                <span className="text-[10px] text-amber-400/60 block truncate mt-0.5">{geminiErrorMsg}</span>
              )}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {loading && (
            <LiveStages
              isVisible={true}
              currentStage={progressStep}
              progress={progress}
              model={modelOptions.find((m) => m.value === model)?.label || "Auto"}
              iterations={iterations}
            />
          )}
        </AnimatePresence>

        {hasAnalysis && result?.analysis && (
          <BeforeAfterCards
            before={result.analysis.before}
            after={result.analysis.after}
          />
        )}

        {hasAnalysis && result?.analysis && (
          <AnalysisExplanation
            before={result.analysis.before}
            after={result.analysis.after}
          />
        )}

        <AnimatePresence>
          {showDiff && (
            <DiffViewer
              original={input}
              humanized={output}
              open={showDiff}
              onClose={() => setShowDiff(false)}
            />
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Input Panel */}
          <motion.div layout className="flex-1 flex flex-col rounded-2xl glass-border-glow overflow-hidden hover-lift">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Tabs value={inputTab} onValueChange={(v) => setInputTab(v as "write" | "preview")} className="h-8">
                  <TabsList className="h-8">
                    <TabsTrigger value="write" className="text-xs px-3">Write</TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs px-3">Preview</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { const prev = textHistory.undo(); if (prev !== null) setInput(prev) }}
                  disabled={!textHistory.canUndo}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 disabled:opacity-20 transition-all">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { const next = textHistory.redo(); if (next !== null) setInput(next) }}
                  disabled={!textHistory.canRedo}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 disabled:opacity-20 transition-all">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1" />
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-all">
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <input ref={fileInputRef} type="file" accept=".txt,.docx,.pdf" onChange={handleFileUpload} className="hidden" />
              </div>
            </div>

            <div className="flex-1 relative min-h-[200px]" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
              {inputTab === "write" ? (
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Paste your text here, or drag & drop a file..."
                  className="w-full h-full min-h-[200px] bg-transparent text-white/80 placeholder:text-white/15 p-5 resize-y focus:outline-none text-sm leading-relaxed"
                />
              ) : (
                <ScrollArea className="h-full max-h-[400px]">
                  <div className="p-5 text-sm leading-relaxed text-white/80 whitespace-pre-wrap">{input || "Nothing to preview"}</div>
                </ScrollArea>
              )}

              {!input && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-sm text-white/20">Type, paste, or drop your text here</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div layout className="flex-1 flex flex-col rounded-2xl glass-border-glow overflow-hidden hover-lift">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white/40">Humanized Output</span>
                {iterations > 0 && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-white/40 border-white/10">
                    {iterations} pass{iterations > 1 ? "es" : ""}
                  </Badge>
                )}
                {modelLabel && (
                  <Badge variant="outline" className={cn(
                    "text-[9px] px-1.5 py-0",
                    modelLabel === "gemini" ? "text-blue-400 border-blue-500/20" : "text-emerald-400 border-emerald-500/20"
                  )}>
                    {modelLabel === "gemini" ? <Zap className="w-2.5 h-2.5 mr-0.5" /> : <Cpu className="w-2.5 h-2.5 mr-0.5" />}
                    {modelLabel}
                  </Badge>
                )}
              </div>
              {output && (
                <Badge variant="success" className="text-[10px] px-2 py-0">Enhanced</Badge>
              )}
            </div>

            <div className="flex-1 relative min-h-[200px]">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-full max-w-sm space-y-4">
                    <Progress value={progress} className="h-1.5" />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={progressStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <Sparkles className="w-4 h-4 text-[#6C63FF] animate-pulse" />
                        <span className="text-sm text-white/50">
                          {["Analyzing text...", "Understanding context...", "Detecting AI patterns...", "Improving readability...", `Humanizing${iterations > 0 ? ` (pass ${iterations})` : "..."}`, "Finalizing..."][progressStep] || "Processing..."}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ) : output ? (
                <ScrollArea className="h-full max-h-[400px]">
                  <div className="p-5 text-sm leading-relaxed text-white/80 whitespace-pre-wrap">{output}</div>
                </ScrollArea>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-sm text-white/20">Your enhanced text will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats + Actions */}
            {output && result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="border-t border-white/5 p-3">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Human Score", value: `${result.analysis?.after?.humanScore || 0}%`, icon: Sparkles, color: "text-emerald-400" },
                      { label: "AI Prob.", value: `${result.aiProbability ?? 0}%`, icon: Bot, color: (result.aiProbability ?? 0) === 0 ? "text-emerald-400" : "text-amber-400" },
                      { label: "Readability", value: result.readability, icon: BarChart3, color: result.readability > 60 ? "text-emerald-400" : "text-amber-400" },
                      { label: "Words", value: result.wordCount, icon: Type, color: "text-blue-400" },
                      { label: "Read Time", value: `${result.readingTime} min`, icon: Clock, color: "text-cyan-400" },
                      { label: "Vocabulary", value: `${result.vocabularyDiversity}%`, icon: BookOpen, color: "text-emerald-400" },
                      { label: "Passive", value: `${result.passiveVoice}%`, icon: AlertTriangle, color: result.passiveVoice > 30 ? "text-red-400" : "text-green-400" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5">
                        <s.icon className={`w-3 h-3 ${s.color}`} />
                        <span className="text-[10px] text-white/40">{s.label}</span>
                        <span className="text-[10px] font-medium text-white/70">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 p-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="ghost" onClick={handleCopy} className="h-8 text-xs">
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowDiff(!showDiff)} className="h-8 text-xs">
                    <GitCompare className="w-3 h-3 mr-1" />Compare
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDownload("txt")} className="h-8 text-xs">
                    <Download className="w-3 h-3 mr-1" />TXT
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleShare} className="h-8 text-xs">
                    <Share2 className="w-3 h-3 mr-1" />Share
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs">
                    <Save className="w-3 h-3 mr-1" />Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleRegenerate} className="h-8 text-xs ml-auto">
                    <RefreshCw className="w-3 h-3 mr-1" />Regenerate
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Controls - Sticky */}
      <div className="border-t border-white/5 bg-gradient-to-r from-[#000000]/95 via-[#0a0a1a]/95 to-[#000000]/95 backdrop-blur-2xl p-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-white/40 whitespace-nowrap">Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as WritingMode)}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {writingModes.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="text-xs">
                      <span className="mr-1.5">{m.icon}</span>{m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs text-white/40 whitespace-nowrap">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as ToneOption)}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-xs">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs text-white/40 whitespace-nowrap">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="h-8 w-[130px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <m.icon className="w-3 h-3" />
                        {m.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6 hidden xl:block" />

            <div className="flex items-center gap-3">
              <Label className="text-xs text-white/40 whitespace-nowrap">Intensity</Label>
              <Slider value={[intensity]} onValueChange={([v]) => setIntensity(v)} min={0} max={100} step={1} className="w-20" />
              <span className="text-[10px] text-white/30 w-6">{intensity}</span>
            </div>

            <div className="flex items-center gap-3">
              <Label className="text-xs text-white/40 whitespace-nowrap">Creativity</Label>
              <Slider value={[creativity]} onValueChange={([v]) => setCreativity(v)} min={0} max={100} step={1} className="w-20" />
              <span className="text-[10px] text-white/30 w-6">{creativity}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch id="keywords" checked={preserveKeywords} onCheckedChange={setPreserveKeywords} />
              <Label htmlFor="keywords" className="text-xs text-white/40">Keywords</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="formatting" checked={preserveFormatting} onCheckedChange={setPreserveFormatting} />
              <Label htmlFor="formatting" className="text-xs text-white/40">Formatting</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="paragraphs" checked={keepParagraphStructure} onCheckedChange={setKeepParagraphStructure} />
              <Label htmlFor="paragraphs" className="text-xs text-white/40">Paragraphs</Label>
            </div>

            <Button
              size="sm"
              variant="gradient"
              onClick={handleHumanize}
              disabled={loading || !input.trim()}
              className="h-8 ml-auto animate-glow-pulse"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {loading ? "Humanizing..." : "Humanize"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
