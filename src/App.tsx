import React, { useState, useRef, useEffect } from "react";
import { 
  BookOpen, 
  Upload, 
  Send, 
  FileText, 
  X, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Menu,
  Flame,
  Trophy,
  ClipboardCheck,
  Syringe,
  Stethoscope,
  Calculator,
  User as UserIcon,
  LogOut,
  Clock,
  ChevronDown,
  ChevronUp,
  Heart,
  Activity,
  Thermometer,
  Pill,
  Microscope,
  Dna,
  Brain,
  Baby,
  Eye,
  Ear,
  Hand,
  Settings,
  Edit2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";

import { cn } from "./lib/utils";
import { Message, AppMode, SourceFile, SessionState, NursingCourse } from "./types";
import { chatWithGemini, generateSessionReport, generatePopUpContent } from "./services/gemini";
import { DEFAULT_SOURCES } from "./data/defaultSources";



const PROFILE_ICONS = [
  { name: "Stethoscope", icon: Stethoscope },
  { name: "Syringe", icon: Syringe },
  { name: "Heart", icon: Heart },
  { name: "Activity", icon: Activity },
  { name: "Thermometer", icon: Thermometer },
  { name: "Pill", icon: Pill },
  { name: "Microscope", icon: Microscope },
  { name: "Dna", icon: Dna },
  { name: "Brain", icon: Brain },
  { name: "Baby", icon: Baby },
  { name: "Eye", icon: Eye },
  { name: "Ear", icon: Ear },
  { name: "Hand", icon: Hand },
  { name: "BookOpen", icon: BookOpen },
  { name: "ClipboardCheck", icon: ClipboardCheck },
  { name: "AlertCircle", icon: AlertCircle },
  { name: "CheckCircle2", icon: CheckCircle2 },
  { name: "FileText", icon: FileText },
  { name: "UserIcon", icon: UserIcon },
  { name: "Flame", icon: Flame },
];

const PROFILE_COLORS = [
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#F97316", // Orange
  "#EF4444", // Red
  "#EC4899", // Pink
];

const COURSES: NursingCourse[] = [
  "Pharmacology for Nursing 2",
  "Mental Health Nursing",
  "LPN to ADN Transition",
  "Paramedic to ADN Transition",
  "Nursing 2",
  "Nursing 3"
];

const COURSE_MODULES: Record<NursingCourse, string[]> = {
  "Nursing 2": [
    "Module 1 - Cardiac Part 1",
    "Module 1 - Cardiac Part 2",
    "Module 2 - Diabetes",
    "Module 3 - Respiratory",
    "Module 4 - Cancer",
    "Comprehensive Final Exam"
  ],
  "Pharmacology for Nursing 2": [
    "Module 1 - Endocrine Drug Therapy",
    "Module 2 - Neuro/Neuromuscular Drug Therapy",
    "Module 3 - Cardiovascular Drug Therapy",
    "Module 4 - Respiratory/EENT Drug Therapy",
    "Module 5 - Antibiotic Drug Therapy",
    "Module 6 - Cancer Drug Therapy",
    "Comprehensive Final Exam"
  ],
  "Mental Health Nursing": [
    "Module 1 - Mental Health Nursing & MSA",
    "Module 2 - Psychopharmacology & Psychotherapeutic Interventions",
    "Module 3 - Neurocognitive, Somatic, Anxiety, & Stressor-Related Disorders",
    "Module 4 - Depressive, Bipolar, & Personality Disorders",
    "Module 5 - Schizophrenia Spectrum & Dissociative Disorders",
    "Module 6 - Substance Use, Eating, & Gender Disorders",
    "Comprehensive Final Exam"
  ],
  "LPN to ADN Transition": [
    "Module 1 - Role Transition", 
    "Module 2 - Advanced Assessment",
    "Comprehensive Final Exam"
  ],
  "Paramedic to ADN Transition": [
    "Module 1 - Clinical Reasoning", 
    "Module 2 - Nursing Process",
    "Comprehensive Final Exam"
  ],
  "Nursing 3": [
    "Module 1 - Complex Cardiac", 
    "Module 2 - Multi-System Failure",
    "Comprehensive Final Exam"
  ]
};

const MODULE_COLOR_SEQUENCE = [
  "bg-[#F97316]", // Orange
  "bg-[#EF4444]", // Red
  "bg-[#A855F7]", // Purple
  "bg-[#3B82F6]", // Blue
  "bg-[#22C55E]", // Green
  "bg-[#EC4899]", // Pink
  "bg-[#06B6D4]", // Light Blue (Cyan)
  "bg-[#F59E0B]", // Amber
  "bg-[#6366F1]", // Indigo
  "bg-[#8B5CF6]", // Violet
];

const getModuleColor = (moduleName: string, index: number) => {
  if (moduleName === "Comprehensive Final Exam") return "bg-[#FEF019]"; // Yellow
  return MODULE_COLOR_SEQUENCE[index % MODULE_COLOR_SEQUENCE.length];
};

export default function App() {
  const [state, setState] = useState<SessionState>({
    user: null,
    course: "Nursing 2",
    messages: [],
    mode: "Learn/Study",
    level: "Analyze", // Defaulting to Analyze internally for NCLEX focus
    module: "Module 2 - Diabetes",
    sources: DEFAULT_SOURCES,
    isThinking: false,
    sessionEnded: false,
    report: null,
    progress: 0,
    outputCount: 0,
    activePopUp: null,
    quizQuestions: [],
    currentQuizIndex: 0,
    sessionStartTime: null,
    statPagesTriggered: 0,
    deteriorationCount: 0,
    sessionStarted: false,
  });
  const [input, setInput] = useState("");
  const [showSimple, setShowSimple] = useState<Record<number, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [popUpContent, setPopUpContent] = useState<any>(null);
  const [expandedOption, setExpandedOption] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardMode, setLeaderboardMode] = useState<AppMode | "Daily Streak">("Daily Streak");
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>("login");
  const [authForm, setAuthForm] = useState({ 
    email: "", 
    password: "", 
    name: "",
    profileIcon: "Stethoscope",
    profileColor: "#8B5CF6"
  });
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const logout = () => {
    localStorage.removeItem("oncall_user");
    setState(prev => ({ 
      ...prev, 
      user: null, 
      sessionStarted: false, 
      sessionStartTime: null,
      messages: [],
      progress: 0,
      outputCount: 0,
      activePopUp: null,
      quizQuestions: [],
      currentQuizIndex: 0
    }));
    setAuthMode("login");
  };

  const [calcValue, setCalcValue] = useState("0");
  const [creatorUsers, setCreatorUsers] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");

  // Check for saved login and server health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health");
        if (res.ok) setServerStatus("online");
        else setServerStatus("offline");
      } catch (e) {
        setServerStatus("offline");
      }
    };
    checkHealth();

    const saved = localStorage.getItem("oncall_user");
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        setState(prev => ({ ...prev, user: userData }));
        setAuthMode(null);
      } catch (e) {
        localStorage.removeItem("oncall_user");
      }
    }
  }, []);

  // Timer logic for 30-minute session
  useEffect(() => {
    if (!state.user || state.sessionEnded || !state.sessionStartTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - state.sessionStartTime!;
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (state.mode === "Learn/Study") {
        const progress = Math.min((elapsed / thirtyMinutes) * 100, 100);
        setState(prev => ({ ...prev, progress }));
      }

      if (elapsed >= thirtyMinutes) {
        clearInterval(timer);
        handleSessionComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state.user, state.sessionEnded, state.sessionStartTime, state.mode]);

  const handleSessionComplete = async () => {
    if (!state.user) return;
    try {
      // Update study streak on server (1 session = 1 streak)
      await updateStreak("study", true);
      // Update total minutes
      await fetch("/api/user/update-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: state.user.id, 
          mode: state.mode, 
          module: state.module,
          minutes: 30 
        }),
      });
      console.log("Congratulations! You've completed a 30-minute study session.");
      setState(prev => ({ ...prev, sessionStartTime: null, progress: 0 })); // Reset for next session
    } catch (e) {
      console.error("Session complete error", e);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, state.isThinking]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(leaderboardMode);
  }, [leaderboardMode]);

  const fetchLeaderboard = async (mode: string) => {
    try {
      const res = await fetch(`/api/leaderboard?mode=${mode}`);
      const data = await res.json();
      setLeaderboard(data);
    } catch (e) {
      console.error("Leaderboard fetch error", e);
    }
  };

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthLoading) return;
    setIsAuthLoading(true);
    
    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`${errorData.error || 'Auth failed'} (Status: ${res.status})`);
      }

      const data = await res.json();
      setState(prev => ({ ...prev, user: data, sessionStartTime: null }));
      localStorage.setItem("oncall_user", JSON.stringify(data));
      setAuthMode(null);
      fetchLeaderboard(leaderboardMode);
    } catch (e: any) {
      console.error("Auth error", e.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const updateStreak = async (type: "study" | "quiz" | "mar" | "stat", increment: boolean) => {
    if (!state.user) return;
    try {
      const res = await fetch("/api/user/update-streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: state.user.id, type, increment }),
      });
      const data = await res.json();
      setState(prev => ({ ...prev, user: data }));
    } catch (e) {
      console.error("Streak update error", e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newSources: SourceFile[] = [];

    for (const file of Array.from(files)) {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += `[Page ${i}] ${pageText}\n\n`;
        }
        newSources.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          content: fullText,
        });
      } else if (file.type === "text/plain") {
        const text = await file.text();
        newSources.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          content: text,
        });
      }
    }

    setState(prev => ({
      ...prev,
      sources: [...prev.sources, ...newSources],
    }));
  };

  const removeSource = (id: string) => {
    setState(prev => ({
      ...prev,
      sources: prev.sources.filter(s => s.id !== id),
    }));
  };

  const handleCorrectAnswer = async (difficulty: number = 1) => {
    if (!state.user) return;
    const points = Math.min(Math.max(difficulty, 1), 6);
    try {
      const res = await fetch("/api/user/update-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: state.user.id, mode: state.mode, points }),
      });
      const data = await res.json();
      setState(prev => ({ ...prev, user: data }));
      fetchLeaderboard(leaderboardMode);
    } catch (e) {
      console.error("Points update error", e);
    }
  };

  const triggerPopUp = async (type: "Bedside Quiz" | "MAR Check" | "Stat Page") => {
    setState(prev => ({ ...prev, isThinking: true, activePopUp: type, currentQuizIndex: 0 }));
    setExpandedOption(null);
    try {
      const moduleSources = state.sources.filter(s => 
        !s.moduleId || s.moduleId === state.module || state.module === "Comprehensive Final Exam"
      );
      // Get recent context (last 4 messages)
      const recentContext = state.messages.slice(-4).map(m => `${m.role}: ${m.content}`).join("\n");
      const content = await generatePopUpContent(type, moduleSources, recentContext);
      setState(prev => ({ ...prev, quizQuestions: content.questions }));
    } catch (error) {
      console.error("Pop-up error:", error);
    } finally {
      setState(prev => ({ ...prev, isThinking: false }));
    }
  };

  const sendMessage = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || state.isThinking || state.sessionEnded) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const newMessages = [...state.messages, userMessage];

    setState(prev => ({
      ...prev,
      messages: newMessages,
      isThinking: true,
      sessionStarted: true,
      sessionStartTime: prev.sessionStartTime,
    }));
    if (!overrideInput) setInput("");

    try {
      // Filter sources for the current module + any user uploaded notes
      const moduleSources = state.sources.filter(s => 
        !s.moduleId || s.moduleId === state.module || state.module === "Comprehensive Final Exam"
      );
      
      const result = await chatWithGemini(newMessages, state.mode, state.level, moduleSources, state.course);
      const newOutputCount = state.outputCount + 1;

      // Update stats on server (usage only, streak is now session-based)
      if (state.user) {
        fetch("/api/user/update-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: state.user.id, 
            mode: state.mode, 
            module: state.module 
          }),
        });
      }

      setState(prev => ({
        ...prev,
        messages: [...newMessages, { 
          role: "model", 
          content: result.text || "I'm sorry, I couldn't generate a response.",
          simpleContent: result.simpleContent
        }],
        progress: result.progress ?? prev.progress,
        isThinking: false,
        outputCount: newOutputCount,
      }));

      // Check for pop-up triggers
      if (state.mode === "Learn/Study") {
        // Bedside @ 5, 15, 25... MAR @ 10, 20, 30...
        if (newOutputCount % 10 === 0) {
          triggerPopUp("MAR Check");
        } else if (newOutputCount % 5 === 0) {
          triggerPopUp("Bedside Quiz");
        } 
        
        // Random STAT Page (3 per 30m session)
        // Probability increases if we haven't triggered enough yet
        const remainingStatPages = 3 - state.statPagesTriggered;
        if (remainingStatPages > 0) {
          const chance = 0.08; // Base chance per message
          if (Math.random() < chance) {
            triggerPopUp("Stat Page");
            setState(prev => ({ ...prev, statPagesTriggered: prev.statPagesTriggered + 1 }));
          }
        }
      } else if (state.mode === "Simulation/Case") {
        // Simulation logic: CJMM pattern
        const progressPerStep = 100 / 6;
        const nextProgress = Math.min(state.progress + progressPerStep, 100);
        
        if (result.text.toLowerCase().includes("deteriorate") || result.text.toLowerCase().includes("worsen")) {
          setState(prev => ({ ...prev, deteriorationCount: prev.deteriorationCount + 1 }));
        }
        
        setState(prev => ({ ...prev, progress: nextProgress }));
        
        if (nextProgress >= 100) {
          endSession();
        }
      } else if (state.mode === "Drill/Quiz" || state.mode === "Evaluate/Exam") {
        // Progress is #/total questions
        const totalQuestions = state.mode === "Evaluate/Exam" 
          ? (state.module === "Comprehensive Final Exam" ? 50 : 20) 
          : 10;
        const nextProgress = Math.min(state.progress + (100 / totalQuestions), 100);
        setState(prev => ({ ...prev, progress: nextProgress }));
        
        if (nextProgress >= 100) {
          endSession();
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setState(prev => ({
        ...prev,
        isThinking: false,
        messages: [...newMessages, { role: "model", content: "Error: Failed to connect to the learning assistant. Please check your API key." }],
      }));
    }
  };

  const endSession = async () => {
    if (state.messages.length === 0) return;
    
    setState(prev => ({ ...prev, isThinking: true }));
    try {
      const report = await generateSessionReport(state.messages);
      setState(prev => ({
        ...prev,
        sessionEnded: true,
        report,
        isThinking: false,
      }));
    } catch (error) {
      console.error("Report error:", error);
      setState(prev => ({ ...prev, isThinking: false, sessionEnded: true, report: "Failed to generate report." }));
    }
  };

  const resetSession = () => {
    setState(prev => ({
      ...prev,
      messages: [],
      mode: "Learn/Study",
      level: "Analyze",
      module: "Module 2 - Diabetes",
      sources: DEFAULT_SOURCES,
      isThinking: false,
      sessionEnded: false,
      report: null,
      progress: 0,
      outputCount: 0,
      activePopUp: null,
      quizQuestions: [],
      currentQuizIndex: 0,
      sessionStartTime: null,
      statPagesTriggered: 0,
      deteriorationCount: 0,
      sessionStarted: false,
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-[#F5F5F0] text-[#141414] font-sans overflow-hidden"
    >
      {/* Pinned Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#141414]/10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#141414]/5 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-serif italic font-bold leading-tight">
              OnCall: Nursing Study Assistant
            </h1>
            <p className="text-[10px] md:text-[11px] text-[#141414]/40 font-medium uppercase tracking-widest mt-0.5">
              Study & Learn with your OnCall Assistant
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className={cn(
          "h-full bg-white flex flex-col transition-all duration-300 ease-in-out z-40 overflow-hidden",
          "absolute md:relative",
          isSidebarOpen 
            ? "w-80 border-r border-[#141414]/10 translate-x-0" 
            : "w-0 opacity-0 pointer-events-none -translate-x-full md:translate-x-0"
        )}>
          <div className="w-80 flex-1 overflow-y-auto p-6 space-y-8">
            {/* User Profile & Streaks */}
            {state.user && (
              <section 
                className="p-4 rounded-2xl border transition-all"
                style={{ backgroundColor: `${state.user.profileColor}15`, borderColor: `${state.user.profileColor}30` }}
              >
                <div 
                  className="flex items-center justify-between mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowAccountSettings(true)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: state.user.profileColor }}
                    >
                      {(() => {
                        const IconComp = PROFILE_ICONS.find(pi => pi.name === state.user?.profileIcon)?.icon || UserIcon;
                        return <IconComp className="w-4 h-4" />;
                      })()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#141414]">{state.user.name}</p>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                        <span className="text-[10px] font-bold text-orange-600">{state.user.dailyStreak} Day Streak</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); logout(); }}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors text-[#141414]/40 hover:text-red-500"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded-xl border border-[#141414]/5 flex flex-col items-center text-center">
                    <BookOpen className="w-4 h-4 text-emerald-600 mb-1" />
                    <p className="text-[8px] uppercase tracking-tighter font-bold text-[#141414]/40">Study</p>
                    <p className="text-xs font-bold text-[#141414]">{state.user.studyStreak}</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#141414]/5 flex flex-col items-center text-center">
                    <ClipboardCheck className="w-4 h-4 text-blue-600 mb-1" />
                    <p className="text-[8px] uppercase tracking-tighter font-bold text-[#141414]/40">Quiz</p>
                    <p className="text-xs font-bold text-[#141414]">{state.user.quizStreak}</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#141414]/5 flex flex-col items-center text-center">
                    <Syringe className="w-4 h-4 text-purple-600 mb-1" />
                    <p className="text-[8px] uppercase tracking-tighter font-bold text-[#141414]/40">MAR</p>
                    <p className="text-xs font-bold text-[#141414]">{state.user.marStreak}</p>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#141414]/5 flex flex-col items-center text-center">
                    <Stethoscope className="w-4 h-4 text-red-600 mb-1" />
                    <p className="text-[8px] uppercase tracking-tighter font-bold text-[#141414]/40">Stat</p>
                    <p className="text-xs font-bold text-[#141414]">{state.user.statStreak}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Leaderboard */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#141414]/40 flex items-center gap-2">
                  <Trophy className="w-3 h-3" />
                  Leaderboard
                </h2>
                <select 
                  value={leaderboardMode}
                  onChange={(e) => setLeaderboardMode(e.target.value as any)}
                  className="text-[9px] font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-[#141414]/60"
                >
                  <option value="Daily Streak">Daily Streak</option>
                  <option value="Learn/Study">Study Points</option>
                  <option value="Drill/Quiz">Quiz Points</option>
                  <option value="Evaluate/Exam">Exam Points</option>
                  <option value="Simulation/Case">Case Points</option>
                </select>
              </div>
              <div className="space-y-2">
                {leaderboard.map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[#F7F7F7] rounded-xl border border-transparent">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] font-bold text-[#141414]/30 w-4">{i + 1}</span>
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: u.profileColor || "#10B981" }}
                      >
                        {(() => {
                          const IconComp = PROFILE_ICONS.find(pi => pi.name === u.profileIcon)?.icon || Stethoscope;
                          return <IconComp className="w-3 h-3" />;
                        })()}
                      </div>
                      <span className="text-xs font-medium truncate text-[#141414]">{u.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {leaderboardMode === "Daily Streak" ? (
                        <>
                          <span className="text-[10px] font-bold text-orange-600">{u.dailyStreak}</span>
                          <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600">
                          {leaderboardMode === "Learn/Study" ? u.pointsStudy :
                           leaderboardMode === "Drill/Quiz" ? u.pointsQuiz :
                           leaderboardMode === "Evaluate/Exam" ? u.pointsExam :
                           u.pointsCase} pts
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Creator View */}
            {state.user?.isCreator && (
              <section className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                  <UserIcon className="w-3 h-3" />
                  Creator Dashboard
                </h2>
                <button 
                  onClick={async () => {
                    const res = await fetch(`/api/creator/users?creatorId=${state.user?.id}`);
                    const data = await res.json();
                    setCreatorUsers(data);
                  }}
                  className="w-full py-2 bg-blue-500 text-white rounded-xl text-[10px] font-bold mb-3 hover:bg-blue-600 transition-colors"
                >
                  Fetch All Accounts
                </button>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {creatorUsers.map((u, i) => (
                    <div key={i} className="p-2 bg-white rounded-lg border border-blue-100 text-[9px]">
                      <p className="font-bold truncate">{u.name}</p>
                      <p className="text-[#141414]/40 truncate">{u.email}</p>
                      <div className="flex justify-between mt-1 text-blue-600 font-bold">
                        <span>{u.totalStudyMinutes}m</span>
                        <span>{u.dailyStreak}d</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Course Selection */}
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#141414]/40 mb-3">
              Nursing Course
            </h2>
            <div className="relative">
              <select
                value={state.course}
                onChange={(e) => {
                  const newCourse = e.target.value as NursingCourse;
                  const firstModule = COURSE_MODULES[newCourse][0];
                  setState(prev => ({ 
                    ...prev, 
                    course: newCourse, 
                    module: firstModule,
                    sessionStartTime: null,
                    progress: 0,
                    messages: [] // Reset session on course change
                  }));
                }}
                className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-3 text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-[#141414]/10"
              >
                {COURSES.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/40 pointer-events-none" />
            </div>
          </section>

          {/* Mode Selection */}
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#141414]/40 mb-3">
              Learning Mode
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {(["Learn/Study", "Drill/Quiz", "Evaluate/Exam", "Simulation/Case"] as const).map((mode) => {
                const modeColors: Record<string, string> = {
                  "Learn/Study": "from-[#A855F7] to-[#3B82F6]",
                  "Drill/Quiz": "from-[#60A5FA] to-[#22C55E]",
                  "Evaluate/Exam": "from-[#22C55E] to-[#FEF019]",
                  "Simulation/Case": "from-[#FEF019] via-[#F97316] to-[#EF4444]"
                };
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      setState(prev => ({ ...prev, mode }));
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl border transition-all",
                      state.mode === mode 
                        ? `bg-gradient-to-br ${modeColors[mode]} text-white border-transparent shadow-md scale-[1.02]` 
                        : "bg-white border-[#141414]/10 hover:border-[#141414]/30"
                    )}
                  >
                    <span className="text-[10px] font-bold text-center leading-tight">{mode}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Module Selection */}
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#141414]/40 mb-3">
              Course Modules
            </h2>
            <div className="space-y-1.5">
              {COURSE_MODULES[state.course].map((mod, index) => {
                const colorClass = getModuleColor(mod, index);
                return (
                  <button
                    key={mod}
                    onClick={() => {
                      setState(prev => ({ ...prev, module: mod, sessionStartTime: null, progress: 0 }));
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full text-left py-2 px-3 rounded-xl border text-[10px] font-bold transition-all",
                      state.module === mod 
                        ? `${colorClass} ${mod === "Comprehensive Final Exam" ? "text-black" : "text-white"} border-transparent shadow-sm scale-[1.01]` 
                        : "bg-white border-[#141414]/10 hover:border-[#141414]/30 text-[#141414]/60"
                    )}
                  >
                    {mod}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Study Notes */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#141414]/40">
                Your Study Notes
              </h2>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1 hover:bg-[#141414]/5 rounded-full transition-colors"
                title="Upload Notes"
              >
                <Upload className="w-4 h-4 text-[#141414]/60" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                multiple 
                accept=".pdf,.txt" 
                className="hidden" 
              />
            </div>
            
            <div className="space-y-2">
              {state.sources.filter(s => !s.isEmbedded).length === 0 ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 border border-dashed border-[#141414]/10 rounded-xl text-center cursor-pointer hover:border-[#141414]/20 transition-all group"
                >
                  <p className="text-[10px] text-[#141414]/40 font-medium group-hover:text-[#141414]/60 transition-colors">
                    Upload your lecture notes or information to help me understand your specific curriculum.
                  </p>
                </div>
              ) : (
                state.sources.filter(s => !s.isEmbedded).map(source => (
                  <div key={source.id} className="group flex items-center justify-between p-2 bg-[#F5F5F0] rounded-lg border border-transparent hover:border-[#141414]/10 transition-all">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 shrink-0 text-[#141414]/60" />
                      <span className="text-xs truncate font-medium">{source.name}</span>
                    </div>
                    <button 
                      onClick={() => removeSource(source.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Session Controls */}
          {!state.sessionEnded && state.messages.length > 0 && (
            <section className="pt-4 border-t border-[#141414]/10">
              <button
                onClick={endSession}
                className="w-full py-2 px-4 bg-white border border-[#141414] text-[#141414] rounded-xl text-xs font-semibold hover:bg-[#141414] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                End Session & Report
              </button>
            </section>
          )}
          
          {state.user && (
            <section className="pt-4 border-t border-[#141414]/10">
              <button 
                onClick={() => {
                  setState(prev => ({ ...prev, user: null, sessionStartTime: null }));
                  localStorage.removeItem("oncall_user");
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </section>
          )}
        </div>
      </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative">
        {/* Progress Bar & Timer */}
        {!state.sessionEnded && (
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="h-1.5 w-full bg-white">
              <div 
                className={cn(
                  "h-full transition-all duration-1000 ease-out",
                  state.mode === "Learn/Study" 
                    ? (state.sessionStartTime && (30 * 60 * 1000 - (Date.now() - state.sessionStartTime) < 5 * 60 * 1000) ? "bg-emerald-500" : "bg-blue-500")
                    : "bg-[#141414]"
                )}
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <div className="px-6 py-2 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-[#141414]/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/40">
                {state.mode === "Learn/Study" ? "Session Time Remaining" : "Session Progress"}
              </span>
              <span className="text-[10px] font-bold text-[#141414]">
                {state.mode === "Learn/Study" ? (
                  (() => {
                    const totalTime = 30 * 60 * 1000;
                    const elapsed = state.sessionStartTime ? Math.min(totalTime, Date.now() - state.sessionStartTime) : 0;
                    const remaining = totalTime - elapsed;
                    const mins = Math.floor(remaining / 60000);
                    const secs = Math.floor((remaining % 60000) / 1000);
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                  })()
                ) : (state.mode === "Drill/Quiz" || state.mode === "Evaluate/Exam") ? (
                  (() => {
                    const total = state.mode === "Evaluate/Exam" 
                      ? (state.module === "Comprehensive Final Exam" ? 50 : 20) 
                      : 10;
                    return `${Math.round((state.progress / 100) * total)}/${total} Questions`;
                  })()
                ) : (
                  `${Math.round(state.progress)}%`
                )}
              </span>
            </div>
          </div>
        )}

        {state.sessionEnded ? (
          <div className="flex-1 overflow-y-auto p-12 bg-white">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#141414] text-white rounded-2xl flex items-center justify-center">
                  <FileDown className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic font-bold">End-of-Session Report</h2>
                  <p className="text-sm text-[#141414]/50">Final assessment and learning path</p>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none bg-[#F5F5F0] p-8 rounded-3xl border border-[#141414]/5">
                <Markdown>{state.report || ""}</Markdown>
              </div>

              <button
                onClick={resetSession}
                className="mt-8 py-3 px-6 bg-[#141414] text-white rounded-2xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Start New Session
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 pt-20 space-y-6 scroll-smooth"
            >
              {state.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto pt-10">
                  <div className="w-16 h-16 bg-[#141414]/5 rounded-3xl flex items-center justify-center mb-6">
                    <Stethoscope className="w-8 h-8 text-[#141414]/20" />
                  </div>
                  <h3 className="text-lg font-serif italic font-semibold mb-2">Your Shift Awaits...</h3>
                  <p className="text-sm text-[#141414]/60 leading-relaxed mb-8">
                    I have the core {state.module} materials ready for your {state.course} session. To make our session even more effective, you can upload your own lecture notes or information in the sidebar.
                  </p>
                  <button
                    onClick={() => {
                      setState(prev => ({ ...prev, sessionStartTime: Date.now() }));
                      sendMessage("I am ready to clock-in and begin the session.");
                    }}
                    className="py-4 px-8 bg-[#141414] text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-white" />
                    Time to Clock-in
                  </button>
                </div>
              ) : (
                state.messages.map((msg, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex gap-4 max-w-3xl mx-auto",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
                      msg.role === "user" ? "bg-[#9CA3AF] text-white" : "bg-white border border-[#141414]/10"
                    )}>
                      {msg.role === "user" ? <span className="text-[10px] font-bold">ME</span> : <BookOpen className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "flex-1 p-4 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user" 
                        ? "bg-[#F3F4F6] text-[#374151] border border-[#141414]/5" 
                        : "bg-white border border-[#141414]/5 shadow-sm"
                    )}>
                      <div className={cn("markdown-body", msg.role === "user" ? "text-[#374151]" : "text-[#141414]")}>
                        <Markdown>{showSimple[i] && msg.simpleContent ? msg.simpleContent : msg.content}</Markdown>
                      </div>
                      
                      {msg.role === "model" && msg.simpleContent && state.mode === "Learn/Study" && (
                        <button
                          onClick={() => setShowSimple(prev => ({ ...prev, [i]: !prev[i] }))}
                          className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 hover:text-[#141414] transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          {showSimple[i] ? "Back to Full Details" : "Explain it like I'm 5"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
              {state.isThinking && (
                <div className="flex gap-4 max-w-3xl mx-auto">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#141414]/10 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin text-[#141414]/40" />
                  </div>
                  <div className="flex-1 p-4 rounded-2xl bg-white border border-[#141414]/5 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#141414]/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#141414]/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#141414]/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-[#F5F5F0] border-t border-[#141414]/10">
              <div className="max-w-3xl mx-auto relative">
                <textarea
                  value={input || ""}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={state.sources.length === 0 ? "Upload sources to start..." : "Ask a question or explain a concept..."}
                  disabled={state.sources.length === 0 || state.isThinking}
                  className="w-full bg-white border border-[#141414]/5 rounded-2xl py-4 pl-4 pr-14 text-sm text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#141414]/10 resize-none h-14 max-h-32 disabled:opacity-50"
                  rows={1}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || state.isThinking || state.sources.length === 0}
                  className="absolute right-2 top-2 w-10 h-10 bg-[#141414] text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-[#141414] mt-3 uppercase tracking-widest font-semibold">
                {state.mode} Mode
              </p>
            </div>
          </>
        )}
      </main>

      {/* Gamified Pop-up Screen */}
      {state.activePopUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-[#141414]/80 backdrop-blur-md"
            onClick={() => {
              if (!state.isThinking && state.activePopUp !== "Bedside Quiz") {
                setState(prev => ({ ...prev, activePopUp: null }));
                setPopUpContent(null);
              }
            }}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className={cn(
              "px-6 py-4 flex items-center justify-between border-b border-[#141414]/5",
              state.activePopUp === "Stat Page" ? "bg-red-50" : 
              state.activePopUp === "MAR Check" ? "bg-blue-50" : "bg-emerald-50"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  state.activePopUp === "Stat Page" ? "bg-red-500 text-white animate-pulse" : 
                  state.activePopUp === "MAR Check" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"
                )}>
                  {state.activePopUp === "Stat Page" ? <Stethoscope className="w-6 h-6" /> : 
                   state.activePopUp === "MAR Check" ? <Syringe className="w-6 h-6" /> : <ClipboardCheck className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-lg font-serif italic font-bold leading-tight">
                    {state.activePopUp}
                  </h2>
                  <p className="text-[10px] text-[#141414]/40 font-medium uppercase tracking-widest">
                    {state.activePopUp === "Stat Page" ? "High Priority NCLEX Question" : 
                     state.activePopUp === "MAR Check" ? `Medication Check ${state.currentQuizIndex + 1} of 2` : `Question ${state.currentQuizIndex + 1} of 3`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {state.activePopUp === "MAR Check" && (
                  <button 
                    onClick={() => setShowCalculator(true)}
                    className="p-2 hover:bg-[#141414]/5 rounded-lg transition-colors text-[#141414]/60 hover:text-[#141414]"
                    title="Open Calculator"
                  >
                    <Calculator className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setState(prev => ({ ...prev, activePopUp: null }));
                    setPopUpContent(null);
                  }}
                  className="p-2 hover:bg-[#141414]/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {state.isThinking || state.quizQuestions.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#141414]/20" />
                  <p className="text-sm text-[#141414]/40 font-medium animate-pulse italic">
                    {state.activePopUp === "Stat Page" ? "Paging the on-call nurse..." : 
                     state.activePopUp === "MAR Check" ? "Verifying medication orders..." : "Preparing bedside quiz..."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif italic font-bold leading-snug question-font">
                    {state.quizQuestions[state.currentQuizIndex].question}
                  </h3>
                  <div className="space-y-3">
                    {state.quizQuestions[state.currentQuizIndex].options.map((opt, idx) => (
                      <div key={idx} className="overflow-hidden">
                        <button
                          onClick={() => {
                            setExpandedOption(expandedOption === idx ? null : idx);
                            if (opt.isCorrect && expandedOption !== idx) {
                              // Award points based on difficulty (default 3 for pop-ups)
                              handleCorrectAnswer(3);
                            }
                          }}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group",
                            expandedOption === idx 
                              ? "bg-[#141414] text-white border-transparent shadow-lg" 
                              : "bg-white border-[#141414]/10 hover:border-[#141414]/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold",
                              expandedOption === idx ? "bg-white/20" : "bg-[#141414]/5"
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm font-medium">{opt.text}</span>
                          </div>
                          {expandedOption === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </button>
                        <AnimatePresence>
                          {expandedOption === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-[#F5F5F0] border-x border-b border-[#141414]/5 rounded-b-2xl -mt-2 pt-4 p-4"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {opt.isCorrect ? (
                                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                    <CheckCircle2 className="w-3 h-3" /> Correct
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-red-600 font-bold text-[10px] uppercase tracking-widest">
                                    <AlertCircle className="w-3 h-3" /> Incorrect
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-[#141414]/70 leading-relaxed italic">
                                {opt.rationale}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-[#F5F5F0] border-t border-[#141414]/5 flex justify-end gap-3">
              <button
                onClick={() => {
                  if (state.currentQuizIndex < state.quizQuestions.length - 1) {
                    setState(prev => ({ ...prev, currentQuizIndex: prev.currentQuizIndex + 1 }));
                    setExpandedOption(null);
                  } else {
                    const type = state.activePopUp;
                    setState(prev => ({ ...prev, activePopUp: null, quizQuestions: [] }));
                    setPopUpContent(null);
                    if (type === "Bedside Quiz") updateStreak("quiz", true);
                    if (type === "MAR Check") updateStreak("mar", true);
                    if (type === "Stat Page") updateStreak("stat", true);
                  }
                }}
                className="py-3 px-8 bg-[#141414] text-white rounded-2xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
              >
                {state.currentQuizIndex < state.quizQuestions.length - 1 ? "Next Question" : 
                 state.activePopUp === "MAR Check" ? "Administer Meds" : "Finish Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#141414] text-white w-64 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Calculator</span>
                </div>
                <button 
                  onClick={() => setShowCalculator(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-white/5 rounded-2xl p-4 mb-4 text-right">
                  <div className="text-2xl font-mono truncate">{calcValue}</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C"].map((btn) => (
                    <button
                      key={btn}
                      onClick={() => {
                        if (btn === "C") setCalcValue("0");
                        else if (btn === "=") {
                          try {
                            // Simple eval-like logic for basic calc
                            // eslint-disable-next-line no-eval
                            setCalcValue(String(eval(calcValue)));
                          } catch {
                            setCalcValue("Error");
                          }
                        } else {
                          setCalcValue(prev => prev === "0" ? btn : prev + btn);
                        }
                      }}
                      className={cn(
                        "h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all",
                        ["/", "*", "-", "+", "="].includes(btn) 
                          ? "bg-white/20 hover:bg-white/30" 
                          : btn === "C" ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-white/5 hover:bg-white/10"
                      )}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Overlay */}
      {authMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#F5F5F0] overflow-y-auto">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-[#141414]/5 my-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#141414] text-white rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-serif italic font-bold">
                {authMode === "login" ? "Welcome Back" : "Join OnCall"}
              </h1>
              <p className="text-sm text-[#141414]/40">
                {authMode === "login" ? "Sign in to continue your nursing journey" : "Create an account to track your progress"}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  serverStatus === "online" ? "bg-emerald-500" : serverStatus === "offline" ? "bg-red-500" : "bg-orange-500 animate-pulse"
                )} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#141414]/40">
                  Server: {serverStatus}
                </span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "signup" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-1.5 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authForm.name || ""}
                      onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full bg-[#F5F5F0] border border-[#141414]/5 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#141414]/10"
                      placeholder="Florence Nightingale"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-1.5 ml-1">Choose Your Icon</label>
                    <div className="grid grid-cols-5 gap-2 p-2 bg-[#F5F5F0] rounded-2xl border border-[#141414]/5 max-h-32 overflow-y-auto">
                      {PROFILE_ICONS.map(pi => (
                        <button
                          key={pi.name}
                          type="button"
                          onClick={() => setAuthForm({ ...authForm, profileIcon: pi.name })}
                          className={cn(
                            "p-2 rounded-xl flex items-center justify-center transition-all",
                            authForm.profileIcon === pi.name ? "bg-white shadow-md ring-2 ring-[#141414]/10" : "hover:bg-white/50"
                          )}
                        >
                          <pi.icon className={cn("w-4 h-4", authForm.profileIcon === pi.name ? "text-[#141414]" : "text-[#141414]/40")} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-1.5 ml-1">Choose Your Color</label>
                    <div className="flex flex-wrap gap-2">
                      {PROFILE_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setAuthForm({ ...authForm, profileColor: color })}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all",
                            authForm.profileColor === color ? "border-[#141414]" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authForm.email || ""}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-[#141414]/5 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#141414]/10"
                  placeholder="nurse@hospital.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={authForm.password || ""}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-[#141414]/5 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#141414]/10"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-4 bg-[#141414] text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <button
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                className="text-xs font-bold text-[#141414]/40 hover:text-[#141414] transition-colors block w-full"
              >
                {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
              <button
                onClick={async () => {
                  if (confirm("This will delete ALL user accounts on the server. Are you sure?")) {
                    await fetch("/api/debug/reset-data", { method: "POST" });
                    localStorage.removeItem("oncall_user");
                    window.location.reload();
                  }
                }}
                className="text-[10px] font-bold text-red-500/20 hover:text-red-500 transition-colors uppercase tracking-widest block w-full mt-2"
              >
                Reset Server Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings Modal */}
      <AnimatePresence>
        {showAccountSettings && state.user && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[210] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl border border-[#141414]/10 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-[#141414]/5 flex items-center justify-between bg-[#F5F5F0]/50">
                <h2 className="text-lg font-serif italic font-bold">Account Settings</h2>
                <button 
                  onClick={() => setShowAccountSettings(false)}
                  className="p-2 hover:bg-[#141414]/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-2 block">Profile Icon</label>
                  <div className="grid grid-cols-5 gap-2 p-3 bg-[#F5F5F0] rounded-2xl border border-[#141414]/5">
                    {PROFILE_ICONS.map(pi => (
                      <button
                        key={pi.name}
                        onClick={async () => {
                          const res = await fetch("/api/user/update-settings", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: state.user?.id, profileIcon: pi.name }),
                          });
                          const data = await res.json();
                          setState(prev => ({ ...prev, user: data }));
                        }}
                        className={cn(
                          "p-2 rounded-xl flex items-center justify-center transition-all",
                          state.user?.profileIcon === pi.name ? "bg-white shadow-md scale-110" : "hover:bg-white/50"
                        )}
                      >
                        <pi.icon className={cn("w-5 h-5", state.user?.profileIcon === pi.name ? "text-[#141414]" : "text-[#141414]/40")} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-2 block">Profile Color</label>
                  <div className="flex flex-wrap gap-3">
                    {PROFILE_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={async () => {
                          const res = await fetch("/api/user/update-settings", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: state.user?.id, profileColor: color }),
                          });
                          const data = await res.json();
                          setState(prev => ({ ...prev, user: data }));
                        }}
                        className={cn(
                          "w-8 h-8 rounded-full border-4 transition-all",
                          state.user?.profileColor === color ? "border-[#141414] scale-110 shadow-lg" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-[#141414]/5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-1.5 block">Name</label>
                    <input 
                      type="text" 
                      defaultValue={state.user.name}
                      onBlur={async (e) => {
                        if (e.target.value === state.user?.name) return;
                        const res = await fetch("/api/user/update-settings", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: state.user?.id, name: e.target.value }),
                        });
                        const data = await res.json();
                        setState(prev => ({ ...prev, user: data }));
                      }}
                      className="w-full bg-[#F5F5F0] border border-[#141414]/5 rounded-xl py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#141414]/10"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 mb-1.5 block">Email</label>
                    <input 
                      type="email" 
                      disabled
                      value={state.user.email || ""}
                      className="w-full bg-[#F5F5F0]/50 border border-[#141414]/5 rounded-xl py-2 px-4 text-sm text-[#141414]/40 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[#F5F5F0]/50 border-t border-[#141414]/5">
                <button 
                  onClick={() => setShowAccountSettings(false)}
                  className="w-full py-3 bg-[#141414] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}
