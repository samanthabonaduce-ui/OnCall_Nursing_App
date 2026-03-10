import streamlit as st
import google.generativeai as genai
import json
import os
import time
from datetime import datetime

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
}

def main():
    st.set_page_config(page_title="OnCall: Nursing Study Assistant", page_icon="🩺", layout="wide")
    
    # Custom CSS for colors and styling
    st.markdown("""
    <style>
    .stApp {
        background-color: #F5F5F0;
    }
    .stChatMessage {
        border-radius: 1rem;
        margin-bottom: 1rem;
    }
    .stSidebar {
        background-color: white !important;
        border-right: 1px solid rgba(20, 20, 20, 0.1);
    }
    .streak-container {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    .streak-box {
        background: white;
        padding: 10px;
        border-radius: 12px;
        border: 1px solid #eee;
        text-align: center;
        flex: 1;
    }
    .streak-label {
        font-size: 10px;
        text-transform: uppercase;
        color: #888;
        font-weight: bold;
    }
    .streak-value {
        font-size: 16px;
        font-weight: bold;
        color: #141414;
    }
    </style>
    """, unsafe_allow_html=True)

    # Initialize session state
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "clocked_in" not in st.session_state:
        st.session_state.clocked_in = False
    if "start_time" not in st.session_state:
        st.session_state.start_time = None
    if "output_count" not in st.session_state:
        st.session_state.output_count = 0
    if "eli5" not in st.session_state:
        st.session_state.eli5 = False
    if "user_streak" not in st.session_state:
        st.session_state.user_streak = 1

    # Sidebar
    with st.sidebar:
        st.markdown("<h1 style='font-family: Georgia; font-style: italic;'>OnCall Assistant</h1>", unsafe_allow_html=True)
        
        # User Profile Section
        st.markdown(f"""
        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f9f9f9; border-radius: 12px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; background: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                ME
            </div>
            <div>
                <div style="font-weight: bold; font-size: 14px;">Nursing Student</div>
                <div style="font-size: 10px; color: #F97316; font-weight: bold;">🔥 {st.session_state.user_streak} Day Streak</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Streaks Grid
        st.markdown("""
        <div class="streak-container">
            <div class="streak-box"><div class="streak-label">Study</div><div class="streak-value">0</div></div>
            <div class="streak-box"><div class="streak-label">Quiz</div><div class="streak-value">0</div></div>
        </div>
        <div class="streak-container">
            <div class="streak-box"><div class="streak-label">MAR</div><div class="streak-value">0</div></div>
            <div class="streak-box"><div class="streak-label">Stat</div><div class="streak-value">0</div></div>
        </div>
        """, unsafe_allow_html=True)

        st.divider()
        
        st.header("Shift Settings")
        course = st.selectbox("Nursing Course", COURSES)
        modules = COURSE_MODULES.get(course, [])
        module = st.selectbox("Course Module", modules) if modules else "General Study"
        mode = st.selectbox("Learning Mode", ["Learn/Study", "Drill/Quiz", "Evaluate/Exam", "Simulation/Case"])
        level = st.selectbox("Learner Level", ["Beginner", "Intermediate", "Advanced"])
        
        st.session_state.eli5 = st.toggle("Explain it like I'm 5", value=st.session_state.eli5)
        
        st.divider()
        st.subheader("Leaderboard")
        st.markdown("""
        <div style="font-size: 12px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>1. Nurse Joy</span> <span>🔥 15</span></div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>2. Clinical Chris</span> <span>🔥 12</span></div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>3. Student Sam</span> <span>🔥 8</span></div>
        </div>
        """, unsafe_allow_html=True)
        
        st.divider()
        if st.button("Sign Out / Reset", use_container_width=True):
            st.session_state.messages = []
            st.session_state.clocked_in = False
            st.session_state.output_count = 0
            st.rerun()

    # Main Interface
    if not st.session_state.clocked_in:
        st.markdown("<br><br>", unsafe_allow_html=True)
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            st.markdown("""
            <div style="text-align: center; padding: 40px; background: white; border-radius: 24px; border: 1px solid #eee; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                <div style="font-size: 48px; margin-bottom: 20px;">🩺</div>
                <h2 style="font-family: Georgia; font-style: italic;">Your Shift Awaits...</h2>
                <p style="color: #666; margin-bottom: 30px;">Ready to begin your clinical study session? Clock-in to start tracking your progress and streaks.</p>
            </div>
            """, unsafe_allow_html=True)
            if st.button("Time to Clock-in", use_container_width=True, type="primary"):
                st.session_state.clocked_in = True
                st.session_state.start_time = time.time()
                st.session_state.messages.append({"role": "assistant", "content": f"Clocked-in for {course} - {module}. How can I help you today?"})
                st.rerun()
    else:
        # Progress Bar
        progress = min(st.session_state.output_count * 10, 100)
        st.progress(progress / 100, text=f"Session Progress: {progress}%")
        
        # Display chat messages
        for message in st.session_state.messages:
            avatar = "📖" if message["role"] == "assistant" else "👤"
            with st.chat_message(message["role"], avatar=avatar):
                st.markdown(message["content"])

        # Chat input
        if prompt := st.chat_input("Enter your clinical query..."):
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user", avatar="👤"):
                st.markdown(prompt)

            # Generate response
            with st.chat_message("assistant", avatar="📖"):
                try:
                    eli5_instruction = "Explain it like I'm 5 years old." if st.session_state.eli5 else ""
                    model = genai.GenerativeModel(
                        model_name='gemini-3-flash-preview',
                        system_instruction=f"{SYSTEM_INSTRUCTION}\nCOURSE: {course}\nMODULE: {module}\nMODE: {mode}\nLEVEL: {level}\n{eli5_instruction}"
                    )
                    
                    history = []
                    for m in st.session_state.messages[:-1]:
                        history.append({"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]})
                    
                    chat = model.start_chat(history=history)
                    response = chat.send_message(prompt)
                    
                    st.markdown(response.text)
                    st.session_state.messages.append({"role": "assistant", "content": response.text})
                    st.session_state.output_count += 1
                    
                    # Mock Pop-up Trigger
                    if st.session_state.output_count % 5 == 0:
                        st.toast("🔔 Clinical Alert: Time for a Bedside Quiz!", icon="🩺")
                    
                except Exception as e:
                    st.error(f"Error: {e}")

if __name__ == "__main__":
    main()
