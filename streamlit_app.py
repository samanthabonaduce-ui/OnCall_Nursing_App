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

SYSTEM_INSTRUCTION = """You are a Structured Learning Assistant operating under intentional instructional design.
Make the student do the thinking first. Keep modes strictly separated. 
Use ONLY the provided source materials. Act as a Socratic coach."""

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
    badge_criteria = [
        {"type": "Learn/Study", "threshold": 5, "title": "Study Scholar", "icon": "📖"},
        {"type": "Drill/Quiz", "threshold": 5, "title": "Quiz Master", "icon": "📋"},
        {"type": "Evaluate/Exam", "threshold": 5, "title": "Exam Expert", "icon": "📄"},
        {"type": "Simulation/Case", "threshold": 5, "title": "Clinical Pro", "icon": "🩺"},
        {"type": "Bedside Quiz", "threshold": 5, "title": "Bedside Ace", "icon": "⚡"},
        {"type": "MAR Check", "threshold": 5, "title": "Safety First", "icon": "💊"},
        {"type": "Stat Page", "threshold": 5, "title": "Rapid Responder", "icon": "🔥"},
    ]
    
    new_badges = []
    for criteria in badge_criteria:
        count = user['activityCounts'].get(criteria['type'], 0)
        if count > 0 and count % criteria['threshold'] == 0:
            badge_id = f"{criteria['type']}-{count}"
            if not any(b['id'] == badge_id for b in user['badges']):
                new_badge = {
                    "id": badge_id,
                    "title": criteria['title'],
                    "description": f"Completed {count} {criteria['type']} activities",
                    "count": count,
                    "dateEarned": datetime.now().strftime("%Y-%m-%d"),
                    "icon": criteria['icon']
                }
                new_badges.append(new_badge)
    
    if new_badges:
        user['badges'].extend(new_badges)
        return new_badges
    return []

def main():
    st.set_page_config(page_title="OnCall: Nursing Study Assistant", page_icon="🩺", layout="wide")
    
    # Custom CSS
    st.markdown("""
    <style>
    .stApp { background-color: #F5F5F0; }
    .stSidebar { background-color: white !important; border-right: 1px solid rgba(20, 20, 20, 0.1); }
    
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
    if "user" not in st.session_state: st.session_state.user = None
    if "auth_mode" not in st.session_state: st.session_state.auth_mode = "login"
    if "messages" not in st.session_state: st.session_state.messages = []
    if "clocked_in" not in st.session_state: st.session_state.clocked_in = False
    if "output_count" not in st.session_state: st.session_state.output_count = 0
    if "start_time" not in st.session_state: st.session_state.start_time = None
    if "active_quiz" not in st.session_state: st.session_state.active_quiz = None

    # --- AUTHENTICATION FLOW ---
    if not st.session_state.user:
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            st.markdown("<div style='text-align: center; padding: 40px;'>", unsafe_allow_html=True)
            st.title("🩺 OnCall")
            st.subheader("Your Nursing Study Assistant")
            
            if st.session_state.auth_mode == "login":
                st.markdown("### Welcome Back")
                email = st.text_input("Email")
                password = st.text_input("Password", type="password")
                if st.button("Sign In", use_container_width=True, type="primary"):
                    # Simple mock auth
                    st.session_state.user = {
                        "name": email.split("@")[0].capitalize(),
                        "email": email,
                        "profileIcon": "Stethoscope",
                        "profileColor": "#10B981",
                        "dailyStreak": 5,
                        "activityCounts": {"Learn/Study": 12, "Drill/Quiz": 8, "MAR Check": 3, "Stat Page": 2},
                        "badges": [],
                        "points": {"Learn/Study": 120, "Drill/Quiz": 85, "Evaluate/Exam": 40, "Simulation/Case": 30}
                    }
                    st.rerun()
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
                    st.session_state.user = {
                        "name": name if name else "Florence Nightingale",
                        "email": email,
                        "profileIcon": selected_icon,
                        "profileColor": selected_color,
                        "dailyStreak": 1,
                        "activityCounts": {"Learn/Study": 0, "Drill/Quiz": 0, "Evaluate/Exam": 0, "Simulation/Case": 0, "Bedside Quiz": 0, "MAR Check": 0, "Stat Page": 0},
                        "badges": [],
                        "points": {"Learn/Study": 0, "Drill/Quiz": 0, "Evaluate/Exam": 0, "Simulation/Case": 0}
                    }
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
        st.markdown(f"<h1 style='font-family: Georgia; font-style: italic;'>OnCall Assistant</h1>", unsafe_allow_html=True)
        
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
                    <div class="streak-label">Study</div>
                    <div class="streak-val">📖 {user['activityCounts'].get("Learn/Study", 0)}</div>
                </div>
                <div class="streak-card">
                    <div class="streak-label">Quiz</div>
                    <div class="streak-val">📋 {user['activityCounts'].get("Drill/Quiz", 0)}</div>
                </div>
                <div class="streak-card">
                    <div class="streak-label">MAR</div>
                    <div class="streak-val">💊 {user['activityCounts'].get("MAR Check", 0)}</div>
                </div>
                <div class="streak-card">
                    <div class="streak-label">Stat</div>
                    <div class="streak-val">🔥 {user['activityCounts'].get("Stat Page", 0)}</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.divider()
        
        # File Upload Area
        st.header("Study Materials")
        uploaded_files = st.file_uploader("Upload Lecture Notes (PDF/TXT)", accept_multiple_files=True)
        if uploaded_files:
            st.success(f"{len(uploaded_files)} files ready for session.")

        st.divider()
        st.header("Shift Settings")
        course = st.selectbox("Nursing Course", COURSES)
        modules = COURSE_MODULES.get(course, [])
        module = st.selectbox("Course Module", modules) if modules else "General Study"
        mode = st.selectbox("Learning Mode", ["Learn/Study", "Drill/Quiz", "Evaluate/Exam", "Simulation/Case"])
        level = st.selectbox("Learner Level", ["Beginner", "Intermediate", "Advanced"])
        
        st.divider()
        
        # Enterprise API Key Option
        with st.expander("Enterprise / University Settings"):
            st.info("If you have a university Gemini API key, enter it here to bypass shared limits.")
            st.session_state.custom_api_key = st.text_input("University API Key", value=st.session_state.custom_api_key, type="password")
            if st.session_state.custom_api_key:
                genai.configure(api_key=st.session_state.custom_api_key)
        
        if st.button("Achievements", use_container_width=True):
            st.session_state.show_badges = True
            st.rerun()
        
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
        if st.button("Sign Out", use_container_width=True):
            st.session_state.user = None
            st.session_state.clocked_in = False
            st.session_state.messages = []
            st.rerun()

    # --- MAIN INTERFACE ---
    # Title and Subtitle always visible
    st.title("🩺 OnCall")
    st.markdown("### Your Nursing Study Assistant")
    
    if not st.session_state.clocked_in:
        st.markdown("<br>", unsafe_allow_html=True)
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            st.markdown("""
            <div style="text-align: center; padding: 40px; background: white; border-radius: 32px; border: 1px solid #eee; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="font-size: 60px; margin-bottom: 20px;">🩺</div>
                <h2 style="font-family: Georgia; font-style: italic; font-size: 28px;">Ready to begin your clinical study session?</h2>
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
                st.session_state.messages.append({"role": "assistant", "content": f"Clocked-in for {course} - {module}. How can I help you today?"})
                st.rerun()
    else:
        # Progress Tracking
        if mode == "Learn/Study":
            total_time = 30 * 60
            elapsed = time.time() - st.session_state.start_time
            remaining = max(0, total_time - elapsed)
            mins, secs = divmod(int(remaining), 60)
            st.progress(min(1.0, elapsed / total_time), text=f"⏱️ Session Time Remaining: {mins}:{secs:02d}")
        else:
            progress = min(st.session_state.output_count * 10, 100)
            st.progress(progress / 100, text=f"📊 Session Progress: {progress}%")

        # Handle Pop-up Quizzes (Only in Learn/Study)
        if st.session_state.active_quiz:
            with st.container(border=True):
                st.warning(f"🚨 Clinical Alert: {st.session_state.active_quiz}")
                st.write("The patient requires immediate attention. Please answer the following:")
                st.text_input("Your response...")
                if st.button("Submit Clinical Action"):
                    st.session_state.active_quiz = None
                    st.success("Action recorded. Continuing session.")
                    st.rerun()

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
                    
                    # Update Stats & Check Badges
                    user['activityCounts'][mode] = user['activityCounts'].get(mode, 0) + 1
                    new_badges = check_badges(user)
                    for b in new_badges:
                        st.toast(f"🏆 New Badge: {b['title']}!", icon="🎉")
                    
                    # Trigger Pop-ups (Only in Learn/Study)
                    if mode == "Learn/Study":
                        if st.session_state.output_count % 10 == 0:
                            st.session_state.active_quiz = "MAR Check Required"
                            st.rerun()
                        elif st.session_state.output_count % 5 == 0:
                            st.session_state.active_quiz = "Bedside Quiz Triggered"
                            st.rerun()
                            
                except Exception as e:
                    st.error(f"Error: {e}")

    # Achievement Modal Simulation
    if st.session_state.get("show_badges"):
        with st.container(border=True):
            st.subheader("🏅 Your Achievements")
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
            if st.button("Close Achievements"):
                st.session_state.show_badges = False
                st.rerun()

if __name__ == "__main__":
    main()
