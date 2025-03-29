import openai
import os
import json
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), ".env.local")
load_dotenv(dotenv_path=env_path)

openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_keywords(prompt_context):
    """Call OpenAI API with a given prompt and return parsed JSON response."""
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert in resume and job analysis."},
                {"role": "user", "content": prompt_context}
            ],
            temperature=0.3
        )

        raw_text = response.choices[0].message.content.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()

        return json.loads(raw_text)
    except Exception as e:
        print(f"❌ OpenAI call failed: {e}")
        return {"technical_skills": [], "transferable_skills": []}

def extract_gpt_keywords(resume_text, job_description_text):
    # Extract resume-based keywords
    resume_prompt = f"""
    Analyze the following resume text and extract:
    - 13 technical skills (e.g., tools, programming, certifications)
    - 7 transferable skills (e.g., communication, teamwork, leadership)

    Return format:
    {{
      "technical_skills": [...],
      "transferable_skills": [...]
    }}

    Resume:
    {resume_text}
    """
    resume_keywords = extract_keywords(resume_prompt)

    # Extract job description-based keywords
    jd_prompt = f"""
    Analyze the following job description and extract:
    - 13 technical skills
    - 7 transferable skills

    Return format:
    {{
      "technical_skills": [...],
      "transferable_skills": [...]
    }}

    Job Description:
    {job_description_text}
    """
    job_keywords = extract_keywords(jd_prompt)

    # Extract matched keywords from both
    match_prompt = f"""
    Compare the following resume and job description. Extract overlapping or similar keywords:
    - Up to 13 matched technical skills
    - Up to 7 matched transferable skills

    Return format:
    {{
      "technical_skills": [...],
      "transferable_skills": [...]
    }}

    Resume:
    {resume_text}

    Job Description:
    {job_description_text}
    """
    matched_keywords = extract_keywords(match_prompt)

    return {
        "resume_keywords": resume_keywords,
        "job_keywords": job_keywords,
        "matched_keywords": matched_keywords
    }
