export type Message = {
  role: "user" | "model";
  content: string;
  simpleContent?: string;
};

export type AppMode = "Learn/Study" | "Drill/Quiz" | "Evaluate/Exam" | "Simulation/Case";

export type LearnerLevel = "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";

export type Module = 
  | "Module 1 - Cardiac Part 1"
  | "Module 1 - Cardiac Part 2"
  | "Module 2 - Diabetes"
  | "Module 3 - Respiratory"
  | "Module 4 - Cancer"
  | "Comprehensive Final Exam";

export type SourceFile = {
  id: string;
  name: string;
  content: string;
  isEmbedded?: boolean;
  moduleId?: Module;
};

export type PopUpType = "Bedside Quiz" | "MAR Check" | "Stat Page" | null;

export type QuizOption = {
  text: string;
  isCorrect: boolean;
  rationale: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export type UserStats = {
  modes: Record<string, number>;
  modules: Record<string, number>;
};

export type User = {
  id: string;
  email: string;
  name: string;
  profileIcon: string;
  profileColor: string;
  dailyStreak: number;
  lastLogin: string;
  studyStreak: number;
  quizStreak: number;
  marStreak: number;
  statStreak: number;
  totalStudyMinutes: number;
  pointsStudy: number;
  pointsQuiz: number;
  pointsExam: number;
  pointsCase: number;
  isCreator?: boolean;
  stats: UserStats;
};

export type SessionState = {
  user: User | null;
  messages: Message[];
  mode: AppMode;
  level: LearnerLevel;
  module: Module;
  sources: SourceFile[];
  isThinking: boolean;
  sessionEnded: boolean;
  report: string | null;
  progress: number;
  outputCount: number;
  activePopUp: PopUpType;
  quizQuestions: QuizQuestion[];
  currentQuizIndex: number;
  sessionStartTime: number | null;
  statPagesTriggered: number;
  deteriorationCount: number;
  sessionStarted: boolean;
};
