import streamlit as st
import google.generativeai as genai
import json
import os
import time
from datetime import datetime, timedelta

# Configure the Gemini API Key
api_key = None
if "GEMINI_API_KEY" in st.secrets:
    api_key = st.secrets["GEMINI_API_KEY"]
elif "GEMINI_API_KEY" in os.environ:
    api_key = os.environ["GEMINI_API_KEY"]

if api_key:
    genai.configure(api_key=api_key)
else:
    st.error("Please set GEMINI_API_KEY in your Streamlit secrets or environment variables.")

SYSTEM_INSTRUCTION = """You are an Expert Nursing and Clinical Educator. Your goal is to build the student's knowledge, understanding, and clinical judgment. 
Act as a Socratic coach, making the student do the thinking first. Tailor your guidance to the student's varying levels (from novice to advanced).
Keep learning modes strictly separated. Use ONLY the provided source materials. 
Always maintain a professional, encouraging, and clinical tone."""

COURSES = [
    "Foundations of Nursing",
    "Professional Communication",
    "Pharmacology for Nursing 1",
    "LPN to ADN Transition",
    "Paramedic to ADN Transition",
    "Nursing 1",
    "Pharmacology for Nursing 2",
    "Mental Health Nursing",
    "Child and Family Nursing",
    "Nursing 2",
    "Nursing 3",
    "Transition to Nursing Practice"
]

COURSE_MODULES = {
    "Nursing 2": ["Module 1 - Cardiac Part 1", "Module 1 - Cardiac Part 2", "Module 2 - Diabetes", "Module 3 - Respiratory", "Module 4 - Cancer", "Comprehensive Final Exam"],
    "Pharmacology for Nursing 2": ["Module 1 - Endocrine Drug Therapy", "Module 2 - Neuro/Neuromuscular Drug Therapy", "Module 3 - Cardiovascular Drug Therapy", "Module 4 - Respiratory/EENT Drug Therapy", "Module 5 - Antibiotic Drug Therapy", "Module 6 - Cancer Drug Therapy", "Comprehensive Final Exam"],
    "Mental Health Nursing": ["Module 1 - Mental Health Nursing & MSA", "Module 2 - Psychopharmacology & Psychotherapeutic Interventions", "Module 3 - Neurocognitive, Somatic, Anxiety, & Stressor-Related Disorders", "Module 4 - Depressive, Bipolar, & Personality Disorders", "Module 5 - Schizophrenia Spectrum & Dissociative Disorders", "Module 6 - Substance Use, Eating, & Gender Disorders", "Comprehensive Final Exam"],
    "LPN to ADN Transition": ["Module 1 - Role Transition", "Module 2 - Advanced Assessment", "Comprehensive Final Exam"],
    "Paramedic to ADN Transition": ["Module 1 - Clinical Reasoning", "Module 2 - Nursing Process", "Comprehensive Final Exam"],
    "Nursing 3": ["Module 1 - Complex Cardiac", "Module 2 - Multi-System Failure", "Comprehensive Final Exam"]
}

PROFILE_ICONS = ["Stethoscope", "Syringe", "Heart", "Activity", "Thermometer", "Pill", "Microscope", "Dna", "Brain", "Baby", "Eye", "Ear", "Hand", "BookOpen", "ClipboardCheck", "AlertCircle", "CheckCircle2", "FileText", "UserIcon", "Flame"]
PROFILE_COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#F97316", "#EF4444", "#EC4899"]

ICON_MAP = {
    "Stethoscope": "🩺",
    "Syringe": "💉",
    "Heart": "❤️",
    "Activity": "📈",
    "Thermometer": "🌡️",
    "Pill": "💊",
    "Microscope": "🔬",
    "Dna": "🧬",
    "Brain": "🧠",
    "Baby": "👶",
    "Eye": "👁️",
    "Ear": "👂",
    "Hand": "✋",
    "BookOpen": "📖",
    "ClipboardCheck": "📋",
    "AlertCircle": "⚠️",
    "CheckCircle2": "✅",
    "FileText": "📄",
    "UserIcon": "👤",
    "Flame": "🔥"
}

def check_badges(user):
    types = ["Bedside Report", "MAR Check", "Stat Page", "Study Session"]
    
    new_badges = []
    icon_map = {
        "Bedside Report": "🛏️",
        "MAR Check": "💉",
        "Stat Page": "🚨",
        "Study Session": "📖"
    }
    
    for t in types:
        count = user['activityCounts'].get(t, 0)
        # Retrospective check: Ensure all levels up to current count are awarded
        for level in range(1, count + 1):
            badge_id = f"{t}-Level-{level}"
            if not any(b['id'] == badge_id for b in user['badges']):
                new_badge = {
                    "id": badge_id,
                    "title": f"{t} Badge - Level {level}",
                    "description": f"Achieved Level {level} in {t}",
                    "count": level,
                    "dateEarned": datetime.now().strftime("%Y-%m-%d"),
                    "icon": icon_map.get(t, "🏅")
                }
                new_badges.append(new_badge)
    
    if new_badges:
        user['badges'].extend(new_badges)
        return new_badges
    return []

def main():
    st.set_page_config(page_title="OnCall: Nursing Study Assistant", page_icon="🩺", layout="wide", initial_sidebar_state="auto")
    
    # Custom CSS
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;600&display=swap');
    
    .stApp { background-color: #F5F5F0; font-family: 'Inter', sans-serif; }
    .stSidebar { background-color: white !important; border-right: 1px solid rgba(20, 20, 20, 0.1); }
    
    /* Fixed Header for Progress Bar */
    div[data-testid="stProgress"] {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background-color: #F5F5F0;
        padding: 15px 20px;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    /* Adjust main content to not be hidden by fixed header */
    .main .block-container {
        padding-top: 80px !important;
    }
    
    h1, h2, h3, .serif { font-family: 'Cormorant Garamond', serif !important; }
    .fancy-italic { font-family: 'Cormorant Garamond', serif !important; font-style: italic !important; }
    
    /* Target the primary button to make it black with white text */
    div.stButton > button[kind="primary"] {
        background-color: #141414 !important;
        color: white !important;
        border-radius: 12px !important;
        border: none !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 700 !important;
    }
    
    div.stButton > button:hover {
        opacity: 0.9 !important;
    }

    .streak-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
    .streak-card { background: white; padding: 12px; border-radius: 16px; border: 1px solid #eee; text-align: center; }
    .streak-label { font-size: 10px; text-transform: uppercase; color: #888; font-weight: bold; margin-bottom: 4px; }
    .streak-val { font-size: 16px; font-weight: bold; color: #141414; display: flex; align-items: center; justify-content: center; gap: 4px; }
    .badge-card { background: #F5F5F0; padding: 10px; border-radius: 12px; text-align: center; border: 1px solid #eee; margin-bottom: 10px; }
    
    .profile-area {
        background: white;
        padding: 24px;
        border-radius: 28px;
        border: 1px solid rgba(20, 20, 20, 0.05);
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        margin-bottom: 25px;
    }
    </style>
    """, unsafe_allow_html=True)

    # Initialize session state
    if "user_db" not in st.session_state:
        if os.path.exists("users.json"):
            try:
                with open("users.json", "r") as f:
                    st.session_state.user_db = json.load(f)
            except:
                st.session_state.user_db = {}
        else:
            st.session_state.user_db = {}

    if "user" not in st.session_state: st.session_state.user = None
    if "auth_mode" not in st.session_state: st.session_state.auth_mode = "login"
    if "messages" not in st.session_state: st.session_state.messages = []
    if "clocked_in" not in st.session_state: st.session_state.clocked_in = False
    if "output_count" not in st.session_state: st.session_state.output_count = 0
    if "start_time" not in st.session_state: st.session_state.start_time = None
    if "active_quiz" not in st.session_state: st.session_state.active_quiz = None
    if "quiz_step" not in st.session_state: st.session_state.quiz_step = 0
    if "quiz_data" not in st.session_state: st.session_state.quiz_data = None
    if "quiz_score" not in st.session_state: st.session_state.quiz_score = 0
    if "quiz_results" not in st.session_state: st.session_state.quiz_results = []
    if "last_trigger_check" not in st.session_state: st.session_state.last_trigger_check = -1
    if "stat_times" not in st.session_state: st.session_state.stat_times = []

    def save_users():
        with open("users.json", "w") as f:
            json.dump(st.session_state.user_db, f)

    @st.dialog("🧮 Clinical Calculator")
    def show_calculator():
        st.write("Basic Dosage Calculator")
        if "calc_val" not in st.session_state: st.session_state.calc_val = "0"
        
        st.markdown(f"""
        <div style="background: #eee; padding: 20px; border-radius: 10px; text-align: right; font-size: 24px; font-family: monospace; margin-bottom: 10px;">
            {st.session_state.calc_val}
        </div>
        """, unsafe_allow_html=True)
        
        cols = st.columns(4)
        buttons = [
            "7", "8", "9", "/",
            "4", "5", "6", "*",
            "1", "2", "3", "-",
            "C", "0", "=", "+"
        ]
        
        for i, btn in enumerate(buttons):
            with cols[i % 4]:
                if st.button(btn, key=f"calc_{btn}", use_container_width=True):
                    if btn == "C": st.session_state.calc_val = "0"
                    elif btn == "=":
                        try: st.session_state.calc_val = str(eval(st.session_state.calc_val))
                        except: st.session_state.calc_val = "Error"
                    else:
                        if st.session_state.calc_val == "0": st.session_state.calc_val = btn
                        else: st.session_state.calc_val += btn
                    st.rerun()
        
        if st.button("Close", use_container_width=True):
            st.rerun()

    @st.dialog("🏅 Your Achievements")
    def show_achievements_dialog():
        user = st.session_state.user
        if not user['badges']:
            st.write("No badges earned yet. Keep studying!")
        else:
            cols = st.columns(3)
            for i, b in enumerate(user['badges']):
                with cols[i % 3]:
                    st.markdown(f"""
                    <div class="badge-card">
                        <div style="font-size: 30px;">{b['icon']}</div>
                        <div style="font-weight: bold; font-size: 14px;">{b['title']}</div>
                        <div style="font-size: 10px; color: #888;">{b['dateEarned']}</div>
                    </div>
                    """, unsafe_allow_html=True)
        if st.button("Close", use_container_width=True):
            st.rerun()

    @st.dialog("👤 My Account")
    def show_account_dialog():
        user = st.session_state.user
        st.subheader("Edit Profile")
        new_name = st.text_input("Full Name", value=user['name'])
        st.text_input("Email Address", value=user['email'], disabled=True)
        
        st.write("Choose Your Icon")
        icon_cols = st.columns(5)
        for i, icon_name in enumerate(PROFILE_ICONS[:10]):
            with icon_cols[i % 5]:
                if st.button(ICON_MAP[icon_name], key=f"dialog_icon_{icon_name}"):
                    user['profileIcon'] = icon_name
                    st.rerun()
        st.info(f"Current Icon: {ICON_MAP[user['profileIcon']]} {user['profileIcon']}")

        st.write("Choose Your Color")
        color_cols = st.columns(len(PROFILE_COLORS))
        for i, color_hex in enumerate(PROFILE_COLORS):
            with color_cols[i]:
                if st.button(" ", key=f"dialog_color_{color_hex}"):
                    user['profileColor'] = color_hex
                    st.rerun()
                st.markdown(f'<div style="width: 20px; height: 20px; background: {color_hex}; border-radius: 4px; margin-top: -35px; pointer-events: none;"></div>', unsafe_allow_html=True)
        
        if st.button("Save Changes", use_container_width=True, type="primary"):
            user['name'] = new_name
            st.success("Profile updated!")
            st.rerun()

    @st.dialog("Clinical Quiz", width="large")
    def show_quiz_dialog(quiz_type):
        # Quiz UI Config
        quiz_configs = {
            "Bedside Report": {"icon": "🛏️", "color": "#3B82F6", "scenario": False},
            "MAR Check": {"icon": "💉", "color": "#F59E0B", "scenario": True},
            "Stat Page": {"icon": "🚨", "color": "#EF4444", "scenario": True}
        }
        config = quiz_configs.get(quiz_type, {"icon": "🩺", "color": "#141414", "scenario": True})

        st.markdown(f"""
            <div style="background: {config['color']}; padding: 15px; border-radius: 12px; color: white; display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                <span style="font-size: 24px;">{config['icon']}</span>
                <h2 style="margin: 0; color: white; font-family: 'Cormorant Garamond', serif;">{quiz_type}</h2>
            </div>
        """, unsafe_allow_html=True)

        # Calculator only for MAR Check
        if quiz_type == "MAR Check":
            if st.button("🧮 Open Calculator"):
                show_calculator()

        if not st.session_state.quiz_data:
            with st.spinner("Generating clinical scenario..."):
                context = "\n".join([m["content"] for m in st.session_state.messages[-5:]])
                # Bedside Report: 2 comprehension level NCLEX MCQs.
                # MAR Check: 1 dosage calculation (fill in the blank) + 1 NCLEX MCQ on patient education.
                # STAT Page: A small patient scenario followed by 1 application level NCLEX MCQ/SATA and 1 analysis level NCLEX MCQ/SATA.
                
                prompt = f"""Generate a {quiz_type} for a nursing student. 
                Context of current study: {context}
                
                Requirements for {quiz_type}:
                {"- Bedside Report: 2 comprehension level NCLEX MCQs. No patient scenario." if quiz_type == "Bedside Report" else ""}
                {"- MAR Check: 1 dosage calculation (fill in the blank) + 1 NCLEX MCQ on patient education. Include a patient scenario." if quiz_type == "MAR Check" else ""}
                {"- Stat Page: A small patient scenario followed by 1 application level NCLEX MCQ/SATA and 1 analysis level NCLEX MCQ/SATA." if quiz_type == "Stat Page" else ""}
                
                CRITICAL: The 'answer' field MUST be the EXACT string (including any prefix like 'A.') from the 'options' list for MCQ.
                For SATA, 'answer' MUST be a list of EXACT strings from 'options'.
                For 'Fill', the 'answer' should be a string representing the numerical value or the exact expected text.
                
                Return JSON format:
                {{
                    "scenario": "string (required if specified)",
                    "questions": [
                        {{
                            "type": "MCQ" or "SATA" or "Fill",
                            "question": "string",
                            "options": ["A", "B", "C", "D"],
                            "answer": "string or list",
                            "rationale": "string"
                        }}
                    ]
                }}"""
                
                try:
                    model = genai.GenerativeModel('gemini-3-flash-preview')
                    response = model.generate_content(prompt)
                    json_str = response.text.strip()
                    if "```json" in json_str:
                        json_str = json_str.split("```json")[1].split("```")[0].strip()
                    st.session_state.quiz_data = json.loads(json_str)
                    st.session_state.quiz_step = 0
                    st.session_state.quiz_score = 0
                    st.session_state.quiz_results = []
                    st.session_state.quiz_answered = False
                except Exception as e:
                    st.error(f"Failed to generate quiz: {e}")
                    if st.button("Close"): st.session_state.active_quiz = None; st.rerun()
                    return

        data = st.session_state.quiz_data
        step = st.session_state.quiz_step
        
        if step < len(data["questions"]):
            q = data["questions"][step]
            st.markdown(f"**Question {step + 1} of {len(data['questions'])}**")
            
            if config['scenario'] and data.get("scenario") and step == 0:
                st.info(f"**Scenario:** {data['scenario']}")
            
            st.markdown(f"### {q['question']}")
            
            user_ans = None
            if q["type"] == "MCQ":
                user_ans = st.radio("Select the best option:", q["options"], key=f"q_{step}_{st.session_state.active_quiz}")
            elif q["type"] == "SATA":
                user_ans = []
                for opt in q["options"]:
                    if st.checkbox(opt, key=f"q_{step}_{opt}_{st.session_state.active_quiz}"):
                        user_ans.append(opt)
            elif q["type"] == "Fill":
                user_ans = st.text_input("Enter your calculation:", key=f"q_{step}_{st.session_state.active_quiz}")

            if not st.session_state.quiz_answered:
                if st.button("Submit Answer"):
                    is_correct = False
                    if q["type"] == "MCQ": 
                        is_correct = (str(user_ans).strip().lower() == str(q["answer"]).strip().lower())
                    elif q["type"] == "SATA": 
                        is_correct = (set([str(a).strip().lower() for a in user_ans]) == set([str(a).strip().lower() for a in q["answer"]]))
                    elif q["type"] == "Fill": 
                        is_correct = (str(user_ans).strip().lower() == str(q["answer"]).strip().lower())
                    
                    st.session_state.quiz_answered = True
                    if is_correct:
                        st.session_state.quiz_score += 1
                        st.session_state.last_ans_correct = True
                    else:
                        st.session_state.last_ans_correct = False
                    st.rerun()
            else:
                if st.session_state.last_ans_correct:
                    st.success("✅ Correct!")
                else:
                    st.error(f"❌ Incorrect. The correct answer was: {q['answer']}")
                
                st.markdown(f"**Rationale:** {q['rationale']}")
                
                if step < len(data["questions"]) - 1:
                    if st.button("Next Question"):
                        st.session_state.quiz_step += 1
                        st.session_state.quiz_answered = False
                        st.rerun()
                else:
                    if st.button("View Final Results"):
                        st.session_state.quiz_step = 99 # Final screen
                        st.rerun()
        else:
            total_q = len(data["questions"])
            st.markdown(f"## Quiz Complete!")
            st.markdown(f"### Final Score: {st.session_state.quiz_score} / {total_q}")
            
            # Update user stats: Only 100% quizzes count
            if st.session_state.quiz_score == total_q:
                st.balloons()
                st.session_state.user['activityCounts'][quiz_type] = st.session_state.user['activityCounts'].get(quiz_type, 0) + 1
                st.session_state.user_db[st.session_state.user['email']] = st.session_state.user
                save_users()
                st.success(f"Perfect score! Progress recorded for {quiz_type}.")
                
                # Check for new badges
                new_badges = check_badges(st.session_state.user)
                for b in new_badges:
                    st.toast(f"🏆 New Badge: {b['title']}!", icon="🎉")
            else:
                st.warning("Only 100% correct quizzes are added to your total count. Keep practicing!")
            
            if st.button("Return to Shift", use_container_width=True, type="primary"):
                st.session_state.active_quiz = None
                st.session_state.quiz_data = None
                st.session_state.quiz_answered = False
                st.rerun()

    # --- AUTHENTICATION FLOW ---
    if not st.session_state.user:
        col1, col2, col3 = st.columns([1, 6, 1])
        with col2:
            st.markdown("""
                <div style="text-align: center; margin-bottom: 2rem; padding-top: 40px;">
                    <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 4rem; line-height: 1; margin-bottom: 1rem; font-weight: 400;">
                        🩺 <i>OnCall</i>: <span class="fancy-italic">Nursing Study Assistant</span>
                    </h1>
                    <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: #666; margin-top: 0; font-style: italic; font-weight: 300;">
                        Study & Learn with your <i>OnCall</i> Assistant
                    </p>
                </div>
            """, unsafe_allow_html=True)
            
            auth_col1, auth_col2, auth_col3 = st.columns([1, 2, 1])
            with auth_col2:
                if st.session_state.auth_mode == "login":
                    st.markdown("### Welcome Back")
                    email = st.text_input("Email")
                    password = st.text_input("Password", type="password")
                    if st.button("Sign In", use_container_width=True, type="primary"):
                        if email in st.session_state.user_db:
                            stored_user = st.session_state.user_db[email]
                            # Check password (simple check for now, can be hashed later)
                            if stored_user.get("password") == password:
                                st.session_state.user = stored_user
                                # Ensure badges are up to date on login
                                check_badges(st.session_state.user)
                                st.success("Welcome back!")
                                st.rerun()
                            else:
                                st.error("Incorrect password. Please try again.")
                        else:
                            st.error("User not found. Please create an account.")
                    if st.button("Create an Account", use_container_width=True):
                        st.session_state.auth_mode = "signup"
                        st.rerun()
                else:
                    st.markdown("### Create Account")
                    name = st.text_input("Full Name", placeholder="Florence Nightingale")
                    email = st.text_input("Email")
                    password = st.text_input("Password", type="password")
                    
                    st.markdown("### Build Your Profile")
                    
                    # Visual Icon Selection
                    st.write("Choose Your Icon")
                    icon_cols = st.columns(5)
                    selected_icon = st.session_state.get("temp_icon", "Stethoscope")
                    for i, icon_name in enumerate(PROFILE_ICONS[:10]): # Show first 10 for brevity
                        with icon_cols[i % 5]:
                            if st.button(ICON_MAP[icon_name], key=f"icon_{icon_name}"):
                                st.session_state.temp_icon = icon_name
                                st.rerun()
                    st.info(f"Selected Icon: {ICON_MAP[selected_icon]} {selected_icon}")
                    
                    # Visual Color Selection
                    st.write("Choose Your Color")
                    color_cols = st.columns(len(PROFILE_COLORS))
                    selected_color = st.session_state.get("temp_color", "#10B981")
                    for i, color_hex in enumerate(PROFILE_COLORS):
                        with color_cols[i]:
                            if st.button(" ", key=f"color_{color_hex}", help=color_hex):
                                st.session_state.temp_color = color_hex
                                st.rerun()
                            st.markdown(f'<div style="width: 20px; height: 20px; background: {color_hex}; border-radius: 4px; margin-top: -35px; pointer-events: none;"></div>', unsafe_allow_html=True)
                    st.markdown(f'Selected Color: <span style="color: {selected_color}; font-weight: bold;">{selected_color}</span>', unsafe_allow_html=True)
                    
                    if st.button("Sign Up", use_container_width=True, type="primary"):
                        if not email or not password:
                            st.error("Email and Password are required.")
                        else:
                            st.session_state.user = {
                                "name": name if name else "Florence Nightingale",
                                "email": email,
                                "password": password, # Store password
                                "profileIcon": selected_icon,
                                "profileColor": selected_color,
                                "dailyStreak": 1,
                                "activityCounts": {"Study Session": 0, "Bedside Report": 0, "MAR Check": 0, "Stat Page": 0},
                                "badges": [],
                                "points": {"Learn/Study": 0, "Drill/Quiz": 0, "Evaluate/Exam": 0, "Simulation/Case": 0}
                            }
                            st.session_state.user_db[email] = st.session_state.user
                            save_users()
                            st.rerun()
                    if st.button("Already have an account? Sign In", key="switch_to_login", use_container_width=True):
                        st.session_state.auth_mode = "login"
                        st.rerun()
            st.markdown("</div>", unsafe_allow_html=True)
        return

    # --- MAIN APP FLOW ---
    user = st.session_state.user
    user_icon_emoji = ICON_MAP.get(user['profileIcon'], "👤")

    # Sidebar
    with st.sidebar:
        st.markdown("""
            <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; line-height: 1.1; margin-bottom: 1rem; font-weight: 400; font-style: italic;">
                <i>OnCall</i>: Nursing Study Assistant
            </h1>
        """, unsafe_allow_html=True)
        
        # Profile Area
        st.markdown(f"""
        <div style="background: white; padding: 20px; border-radius: 24px; border: 1px solid #eee; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: {user['profileColor']}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; border: 2px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    {user_icon_emoji}
                </div>
                <div>
                    <div style="font-weight: 800; font-size: 16px; color: #141414;">{user['name']}</div>
                    <div style="font-size: 11px; color: #F97316; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">🔥 {user['dailyStreak']} Day Streak</div>
                </div>
            </div>
            <div class="streak-grid">
                <div class="streak-card">
                    <div class="streak-label">Bedside Report</div>
                    <div class="streak-val">🛏️ {user['activityCounts'].get("Bedside Report", 0)}</div>
                </div>
                <div class="streak-card">
                    <div class="streak-label">Study Sessions</div>
                    <div class="streak-val">📖 {user['activityCounts'].get("Study Session", 0)}</div>
                </div>
                <div class="streak-card">
                    <div class="streak-label">MAR Checks</div>
                    <div class="streak-val">💉 {user['activityCounts'].get("MAR Check", 0)}</div>
                </div>
                <div class="streak-card">
                    <div class="streak-label">STAT Pages</div>
                    <div class="streak-val">🚨 {user['activityCounts'].get("Stat Page", 0)}</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        if st.button("🏆 Achievements", use_container_width=True):
            show_achievements_dialog()
        
        st.subheader("Leaderboard")
        l_mode = st.selectbox("Rank by", ["Daily Streak", "Learn/Study", "Drill/Quiz", "Evaluate/Exam", "Simulation/Case"])
        
        # Mock leaderboard data based on mode
        l_data = [
            {"name": "Nurse Joy", "val": 15 if l_mode == "Daily Streak" else 150},
            {"name": "Clinical Chris", "val": 12 if l_mode == "Daily Streak" else 120},
            {"name": "Student Sam", "val": 8 if l_mode == "Daily Streak" else 95},
        ]
        
        st.markdown('<div style="font-size: 12px; background: #f9f9f9; padding: 10px; border-radius: 12px;">', unsafe_allow_html=True)
        for entry in l_data:
            st.markdown(f"""
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee;">
                <span>{entry['name']}</span> 
                <span>{'🔥' if l_mode == 'Daily Streak' else '🏆'} {entry['val']}</span>
            </div>
            """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.divider()
        st.header("Shift Settings")
        course = st.selectbox("Nursing Course", COURSES)
        modules = COURSE_MODULES.get(course, [])
        module = st.selectbox("Course Module", modules) if modules else "General Study"
        mode = st.selectbox("Learning Mode", ["Learn/Study", "Drill/Quiz", "Evaluate/Exam", "Simulation/Case"])
        level = st.selectbox("Learner Level", ["Beginner", "Intermediate", "Advanced"])

        st.divider()
        # File Upload Area
        st.header("Study Materials")
        uploaded_files = st.file_uploader("Upload Lecture Notes (PDF/TXT)", accept_multiple_files=True)
        if uploaded_files:
            st.success(f"{len(uploaded_files)} files ready for session.")

        st.divider()
        
        if st.button("👤 My Account", use_container_width=True):
            show_account_dialog()
            
        if st.button("🚪 Sign Out", use_container_width=True):
            st.session_state.user = None
            st.session_state.clocked_in = False
            st.session_state.messages = []
            st.rerun()

    # --- MAIN INTERFACE ---
    # Title and Subtitle always visible
    st.markdown("""
        <div style="margin-bottom: 2rem; text-align: center;">
            <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 3.5rem; line-height: 1; margin-bottom: 0.5rem; font-weight: 400;">
                🩺 <i>OnCall</i>: <span class="fancy-italic">Nursing Study Assistant</span>
            </h1>
            <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: #666; margin-top: 0; font-style: italic; font-weight: 300;">
                Study & Learn with your <i>OnCall</i> Assistant
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    # Progress Tracking (Always at the top)
    if st.session_state.clocked_in:
        elapsed_total = time.time() - st.session_state.start_time
        mins_total = int(elapsed_total // 60)
        
        # Timer Logic for Quizzes
        if mode == "Learn/Study":
            # Bedside: 5, 15, 25
            # MAR: 10, 20, 30
            # STAT: 3 random times
            import random
            if not st.session_state.stat_times:
                st.session_state.stat_times = sorted([random.randint(1, 29) for _ in range(3)])
            
            current_min = mins_total
            if current_min > st.session_state.last_trigger_check:
                st.session_state.last_trigger_check = current_min
                
                trigger = None
                if current_min in [10, 20, 30]: trigger = "MAR Check"
                elif current_min in [5, 15, 25]: trigger = "Bedside Report"
                elif current_min in st.session_state.stat_times: trigger = "Stat Page"
                
                if trigger:
                    st.session_state.active_quiz = trigger
                    st.rerun()

        if mode == "Learn/Study":
            total_time = 30 * 60
            remaining = max(0, total_time - elapsed_total)
            
            # Check for session completion (30 mins)
            if remaining == 0 and not st.session_state.get("session_completed", False):
                st.session_state.session_completed = True
                st.session_state.user['activityCounts']["Study Session"] = st.session_state.user['activityCounts'].get("Study Session", 0) + 1
                save_users()
                new_badges = check_badges(st.session_state.user)
                for b in new_badges:
                    st.toast(f"🏆 New Badge: {b['title']}!", icon="🎉")
                st.success("Congratulations! You've completed a 30-minute study session and earned a badge!")

            mins, secs = divmod(int(remaining), 60)
            st.progress(min(1.0, elapsed_total / total_time), text=f"⏱️ Session Time Remaining: {mins}:{secs:02d}")
        else:
            progress = min(st.session_state.output_count * 10, 100)
            st.progress(progress / 100, text=f"📊 Session Progress: {progress}%")
    else:
        st.progress(0, text="📊 Shift Not Started")

    if not st.session_state.clocked_in:
        st.markdown("<br>", unsafe_allow_html=True)
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            st.markdown("""
            <div style="text-align: center; padding: 40px; background: white; border-radius: 32px; border: 1px solid #eee; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="font-size: 60px; margin-bottom: 20px;">🩺</div>
                <h2 style="font-style: italic; font-size: 28px;">Ready to begin your clinical study session?</h2>
                <p style="color: #666; margin-bottom: 20px; font-size: 16px;">
                    Choose your shift settings. To make our session even more effective, you can upload your own lecture notes or information in the sidebar.
                </p>
                <p style="color: #141414; font-weight: bold; margin-bottom: 30px; font-size: 16px;">
                    Clock-in to start tracking your progress and streaks.
                </p>
            </div>
            """, unsafe_allow_html=True)
            
            if st.button("🕒 Time to Clock-in", use_container_width=True, type="primary"):
                st.session_state.clocked_in = True
                st.session_state.start_time = time.time()
                
                # Automatic Start based on settings
                with st.spinner("Initializing shift..."):
                    try:
                        model = genai.GenerativeModel('gemini-3-flash-preview')
                        init_prompt = f"""The nursing student has clocked in for:
                        Course: {course}
                        Module: {module}
                        Mode: {mode}
                        Level: {level}
                        
                        As their OnCall Assistant, provide a brief, professional clinical greeting and get started with the first learning objective or question based on these settings."""
                        response = model.generate_content(init_prompt)
                        st.session_state.messages.append({"role": "assistant", "content": response.text})
                    except Exception as e:
                        st.session_state.messages.append({"role": "assistant", "content": f"Clocked-in for {course} - {module}. How can I help you today?"})
                st.rerun()
    else:
        # Handle Pop-up Quizzes (Only in Learn/Study)
        if st.session_state.active_quiz:
            show_quiz_dialog(st.session_state.active_quiz)

        # Chat Display
        for message in st.session_state.messages:
            avatar = "📖" if message["role"] == "assistant" else "👤"
            with st.chat_message(message["role"], avatar=avatar):
                st.markdown(message["content"])

        # Chat Input
        if prompt := st.chat_input("Enter your clinical query..."):
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user", avatar="👤"):
                st.markdown(prompt)

            with st.chat_message("assistant", avatar="📖"):
                try:
                    model = genai.GenerativeModel(
                        model_name='gemini-3-flash-preview',
                        system_instruction=f"{SYSTEM_INSTRUCTION}\nCOURSE: {course}\nMODULE: {module}\nMODE: {mode}\nLEVEL: {level}"
                    )
                    history = [{"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]} for m in st.session_state.messages[:-1]]
                    chat = model.start_chat(history=history)
                    response = chat.send_message(prompt)
                    
                    st.markdown(response.text)
                    st.session_state.messages.append({"role": "assistant", "content": response.text})
                    st.session_state.output_count += 1
                    
                    # Update Stats (Inputs only, badges now use correct answers from quizzes)
                    # user['activityCounts'][mode] = user['activityCounts'].get(mode, 0) + 1
                    # new_badges = check_badges(user)
                    # for b in new_badges:
                    #     st.toast(f"🏆 New Badge: {b['title']}!", icon="🎉")
                    
                    # Trigger Pop-ups (Only in Learn/Study)
                    if mode == "Learn/Study":
                        if st.session_state.output_count % 10 == 0:
                            st.session_state.active_quiz = "MAR Check"
                            st.rerun()
                        elif st.session_state.output_count % 5 == 0:
                            st.session_state.active_quiz = "Bedside Report"
                            st.rerun()
                            
                except Exception as e:
                    st.error(f"Error: {e}")

if __name__ == "__main__":
    main()
