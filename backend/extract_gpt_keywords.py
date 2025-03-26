# extract_gpt_keywords.py

import openai
import os
import json
from dotenv import load_dotenv


# ✅ 올바른 경로로 `.env.local` 로드
env_path = os.path.join(os.path.dirname(__file__), ".env.local")
load_dotenv(dotenv_path=env_path)

openai.api_key = os.getenv("OPENAI_API_KEY")

# ✅ 디버깅용 출력 (API 키가 제대로 불러와지는지 확인)
print(f"🔍 Loaded API Key: {openai.api_key}")


def extract_gpt_keywords(resume_text, job_description_text):
    prompt = f"""
    You are an AI specialized in resume and job description analysis.
    Extract a total of **20 most relevant keywords** from the given resume and job description.

    **Keyword Types and Ratio:**
    - Extract **13 technical skills** (e.g., programming languages, tools, certifications)
    - Extract **7 transferable skills** (e.g., leadership, time management, communication)
    - Separate them clearly in the JSON output

    **Output Format (JSON):**
    {{
      "technical_skills": ["Python", "Docker", "AWS", ...],
      "transferable_skills": ["Teamwork", "Adaptability", "Communication", ...]
    }}

    **Resume:**
    {resume_text}

    **Job Description:**
    {job_description_text}
    """

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert in job market analysis and resume optimization."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    try:
        raw_text = response.choices[0].message.content.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        parsed_data = json.loads(raw_text)

        # ✅ 합쳐서 하나의 키워드 배열로 반환
        all_keywords = parsed_data["technical_skills"] + parsed_data["transferable_skills"]

        # ✅ 로그 확인
        print(f"🛠️ Technical: {parsed_data['technical_skills']}")
        print(f"🧠 Transferable: {parsed_data['transferable_skills']}")

        return {"keywords": all_keywords}
    except Exception as e:
        print(f"❌ GPT API 호출 실패: {e}")
        return {"error": "GPT API 호출 실패"}
