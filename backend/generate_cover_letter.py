import openai
import os
import json
from dotenv import load_dotenv

# ✅ .env 파일에서 API 키 로드
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_cover_letter(resume_text, job_description, keywords=None):
    """
    OpenAI를 사용하여 맞춤형 커버 레터를 생성하는 함수
    """

    keyword_text = ""
    if keywords:
        keyword_text = f"\nThe following keywords are considered highly relevant for this role:\n{', '.join(keywords)}\nUse them appropriately in the letter."


    prompt = f"""
    You are a professional career consultant and an expert in writing cover letters.
    Based on the provided resume and job description, generate a professional and persuasive cover letter.

    **Guidelines:**
    - Use a formal tone but keep it engaging and natural.
    - Structure the cover letter as follows:
      1. **Introduction**: Briefly introduce the applicant and express enthusiasm for the role.
      2. **Body**: Highlight key skills and experiences that match the job requirements.
      3. **Conclusion**: Politely request an opportunity to discuss further and express gratitude.

    {keyword_text}
    **Resume:**
    {resume_text}

    **Job Description:**
    {job_description}

    **Return Format (Valid JSON)**:
    {{
      "cover_letter": "Generated cover letter text here..."
    }}
    """

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",  
        messages=[
            {"role": "system", "content": "You are an expert in writing professional cover letters."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7  
    )

    try:
        raw_text = response.choices[0].message.content.strip()
        
        # ✅ 코드 블록(````json ... `````) 제거
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()  

        # ✅ JSON 변환 (불필요한 `"` 문제 해결)
        parsed_data = json.loads(raw_text)
        return parsed_data  
    except Exception as e:
        print(f"❌ OpenAI API 호출 실패: {e}")
        return {"error": "Failed to generate cover letter"}
