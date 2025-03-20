import openai
import os
import json
from dotenv import load_dotenv

# ✅ .env 파일에서 API 키 로드
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_gpt_keywords(resume_text, job_description_text):
    prompt = f"""
    You are an AI specialized in resume and job description analysis.
    Extract the **most relevant** technical skills and industry keywords from the given resume and job description.
    Ensure that the keywords directly match the required skills in the job description.

    **Guidelines:**
    - Extract up to **15 most relevant** keywords.
    - Return results in a **valid JSON format** like this:
    {{
      "keywords": ["Python", "AWS", "Machine Learning", "Data Science"]
    }}
    - Focus on technical skills, industry terms, and certifications only.
    - Do not include general words like "team player", "communication", "detail-oriented".

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
        
        # ✅ 코드 블록(````json ... `````) 제거
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()  # ```json\n{ ... }\n``` 제거

        # ✅ JSON 변환
        parsed_data = json.loads(raw_text)
        return parsed_data  # ✅ JSON으로 반환
    except Exception as e:
        print(f"❌ GPT API 호출 실패: {e}")
        return {"error": "GPT API 호출 실패"}
