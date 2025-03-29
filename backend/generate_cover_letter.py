import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_style_instructions(style):
    """Return tone and structure instructions based on selected style."""
    style = (style or "Professional").lower()

    if style == "casual":
        return (
            "Use a casual and approachable tone. Keep the language friendly and natural. "
            "You can use contractions and a relaxed voice. Structure the letter into 4–5 natural-sounding paragraphs."
        )
    elif style == "friendly":
        return (
            "Use a warm, personable, and empathetic tone. Be expressive and supportive without being too formal. "
            "Structure the letter into 5–6 short and engaging paragraphs."
        )
    else:  # Default to professional
        return (
            "Use a professional and confident tone. Be clear and concise with formal language. "
            "Structure the letter into 3–4 well-organized paragraphs."
        )

def generate_cover_letter(resume_text, job_description, keywords=None, style="Professional"):
    """Generate a tailored cover letter using OpenAI."""

    keyword_text = ""
    if keywords:
        keyword_text = f"\nThe following keywords are relevant to this role:\n{', '.join(keywords)}\nPlease incorporate them naturally."

    tone_instruction = get_style_instructions(style)

    prompt = f"""
You are a skilled career coach and professional writer.
Generate a compelling cover letter based on the resume and job description below.

{tone_instruction}

{keyword_text}

Resume:
{resume_text}

Job Description:
{job_description}

Return Format (Valid JSON):
{{
  "cover_letter": "Generated cover letter here..."
}}
"""

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful and talented job application assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        raw_text = response.choices[0].message.content.strip()

        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()

        return json.loads(raw_text)

    except Exception as e:
        print(f"❌ OpenAI API call failed: {e}")
        return {"error": "Failed to generate cover letter"}
