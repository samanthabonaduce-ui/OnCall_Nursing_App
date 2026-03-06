import streamlit as st
import google.generativeai as genai
import json
import os

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
    "Pharmacology for Nursing 2",
    "Mental Health Nursing",
    "LPN to ADN Transition",
    "Paramedic to ADN Transition",
    "Nursing 2",
    "Nursing 3"
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
    
    st.title("🩺 OnCall: Nursing Study Assistant")
    st.subheader("Study & Learn with your OnCall Assistant")
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("Shift Settings")
        course = st.selectbox("Nursing Course", COURSES)
        module = st.selectbox("Course Module", COURSE_MODULES[course])
        mode = st.selectbox("Learning Mode", ["Learn/Study", "Drill/Quiz", "Evaluate/Exam", "Simulation/Case"])
        level = st.selectbox("Learner Level", ["Beginner", "Intermediate", "Advanced"])
        
        st.divider()
        uploaded_files = st.file_uploader("Upload Lecture Notes (PDF/Text)", accept_multiple_files=True)
        
        if st.button("End Shift / Clear Session"):
            st.session_state.messages = []
            st.rerun()

    # Initialize session state for messages
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": f"Your shift for {course} awaits. I have the {module} materials ready. How can I help you study today?"}
        ]

    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Chat input
    if prompt := st.chat_input("Enter your clinical query..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        # Generate response using Gemini
        with st.chat_message("assistant"):
            try:
                # Prepare context from uploaded files if any
                context = ""
                if uploaded_files:
                    context = "SOURCE MATERIALS:\n"
                    for f in uploaded_files:
                        context += f"--- {f.name} ---\n{f.getvalue().decode('utf-8', errors='ignore')}\n"

                model = genai.GenerativeModel(
                    model_name='gemini-1.5-flash',
                    system_instruction=f"{SYSTEM_INSTRUCTION}\nCOURSE: {course}\nMODULE: {module}\nMODE: {mode}\nLEVEL: {level}\n{context}"
                )
                
                # Convert history to Gemini format
                history = []
                for m in st.session_state.messages[:-1]:
                    history.append({"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]})
                
                chat = model.start_chat(history=history)
                response = chat.send_message(prompt)
                
                st.markdown(response.text)
                st.session_state.messages.append({"role": "assistant", "content": response.text})
            except Exception as e:
                st.error(f"Error: {e}")

if __name__ == "__main__":
    main()
