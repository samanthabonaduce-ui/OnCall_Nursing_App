import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "users.json");

// Helper to read/write users
const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading users file", e);
    return [];
  }
};

const saveUsers = (users: any[]) => {
  console.log(`Saving ${users.length} users to ${USERS_FILE}`);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

async function startServer() {
  console.log("Starting server...");
  const app = express();
  app.use(express.json());
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", usersCount: getUsers().length });
  });

  app.post("/api/debug/reset-data", (req, res) => {
    if (fs.existsSync(USERS_FILE)) {
      fs.unlinkSync(USERS_FILE);
    }
    res.json({ success: true });
  });

  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  const PORT = 3000;

  // Auth Routes
  app.post("/api/auth/signup", (req, res) => {
    try {
      const { email, name, password } = req.body;
      console.log(`Signup attempt: ${email}`);
      
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const users = getUsers();
      if (users.find((u: any) => u.email === email)) {
        return res.status(400).json({ error: "User already exists" });
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        password,
        profileIcon: req.body.profileIcon || "Stethoscope",
        profileColor: req.body.profileColor || "#10B981",
        dailyStreak: 1,
        lastLogin: new Date().toISOString(),
        studyStreak: 0,
        quizStreak: 0,
        marStreak: 0,
        statStreak: 0,
        totalStudyMinutes: 0,
        pointsStudy: 0,
        pointsQuiz: 0,
        pointsExam: 0,
        pointsCase: 0,
        isCreator: email === "creator@oncall.edu",
        stats: {
          modes: {},
          modules: {}
        }
      };

      users.push(newUser);
      saveUsers(users);
      
      const { password: _, ...userWithoutPassword } = newUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error during signup" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`Login attempt: ${email}`);

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const users = getUsers();
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update daily streak
      const now = new Date();
      const lastLogin = new Date(user.lastLogin);
      const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.dailyStreak += 1;
      } else if (diffDays > 1) {
        user.dailyStreak = 1;
      }
      user.lastLogin = now.toISOString();
      user.isCreator = email === "creator@oncall.edu";
      saveUsers(users);

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error during login" });
    }
  });

  // Stats & Streaks Routes
  app.post("/api/user/update-stats", (req, res) => {
    const { userId, mode, module, minutes } = req.body;
    const users = getUsers();
    const user = users.find((u: any) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update usage
    user.stats.modes[mode] = (user.stats.modes[mode] || 0) + 1;
    user.stats.modules[module] = (user.stats.modules[module] || 0) + 1;
    if (minutes) user.totalStudyMinutes += minutes;

    saveUsers(users);
    res.json({ success: true, totalStudyMinutes: user.totalStudyMinutes });
  });

  app.get("/api/creator/users", (req, res) => {
    const { creatorId } = req.query;
    const users = getUsers();
    const creator = users.find((u: any) => u.id === creatorId && u.isCreator);
    if (!creator) return res.status(403).json({ error: "Unauthorized" });

    const userList = users.map((u: any) => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
    res.json(userList);
  });

  app.post("/api/user/update-streak", (req, res) => {
    const { userId, type, increment } = req.body;
    const users = getUsers();
    const user = users.find((u: any) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (type === "study") user.studyStreak = increment ? user.studyStreak + 1 : 0;
    if (type === "quiz") user.quizStreak = increment ? user.quizStreak + 1 : 0;
    if (type === "mar") user.marStreak = increment ? user.marStreak + 1 : 0;
    if (type === "stat") user.statStreak = increment ? user.statStreak + 1 : 0;

    saveUsers(users);
    res.json(user);
  });

  app.post("/api/user/update-points", (req, res) => {
    const { userId, mode, points } = req.body;
    const users = getUsers();
    const user = users.find((u: any) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (mode === "Learn/Study") user.pointsStudy = (user.pointsStudy || 0) + points;
    if (mode === "Drill/Quiz") user.pointsQuiz = (user.pointsQuiz || 0) + points;
    if (mode === "Evaluate/Exam") user.pointsExam = (user.pointsExam || 0) + points;
    if (mode === "Simulation/Case") user.pointsCase = (user.pointsCase || 0) + points;

    saveUsers(users);
    res.json(user);
  });

  app.post("/api/user/update-settings", (req, res) => {
    const { userId, name, email, password, profileIcon, profileColor } = req.body;
    const users = getUsers();
    const user = users.find((u: any) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (profileIcon) user.profileIcon = profileIcon;
    if (profileColor) user.profileColor = profileColor;

    saveUsers(users);
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.get("/api/leaderboard", (req, res) => {
    const { mode } = req.query;
    const users = getUsers();
    
    let leaderboard = users.map((u: any) => ({
      name: u.name,
      dailyStreak: u.dailyStreak,
      profileIcon: u.profileIcon,
      profileColor: u.profileColor,
      pointsStudy: u.pointsStudy || 0,
      pointsQuiz: u.pointsQuiz || 0,
      pointsExam: u.pointsExam || 0,
      pointsCase: u.pointsCase || 0,
      totalPoints: (u.pointsStudy || 0) + (u.pointsQuiz || 0) + (u.pointsExam || 0) + (u.pointsCase || 0)
    }));

    if (mode === "Learn/Study") leaderboard.sort((a, b) => b.pointsStudy - a.pointsStudy);
    else if (mode === "Drill/Quiz") leaderboard.sort((a, b) => b.pointsQuiz - a.pointsQuiz);
    else if (mode === "Evaluate/Exam") leaderboard.sort((a, b) => b.pointsExam - a.pointsExam);
    else if (mode === "Simulation/Case") leaderboard.sort((a, b) => b.pointsCase - a.pointsCase);
    else leaderboard.sort((a, b) => b.dailyStreak - a.dailyStreak);

    res.json(leaderboard.slice(0, 10));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
