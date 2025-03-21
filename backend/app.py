# venv\Scripts\activate -> 가상화 항상 켜기

from generate_cover_letter import generate_cover_letter
from extract_gpt_keywords import extract_gpt_keywords
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pdf2image import convert_from_path
from PIL import Image
import os
import fitz  # PyMuPDF for PDFs
import docx

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

UPLOAD_FOLDER = "uploads"
IMAGE_FOLDER = "images"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(IMAGE_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["IMAGE_FOLDER"] = IMAGE_FOLDER

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text") + "\n"
    return text.strip()

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text.strip()

def convert_pdf_to_images(pdf_path):
    poppler_path = r"C:\\poppler-24.08.0\\Library\\bin"  # Windows Poppler 경로
    images = convert_from_path(pdf_path, dpi=200, poppler_path=poppler_path)
    image_paths = []
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    for i, img in enumerate(images):
        img_path = os.path.join(app.config["IMAGE_FOLDER"], f"{base_name}_{i}.png")
        img.save(img_path, "PNG")
        image_paths.append(f"http://127.0.0.1:5000/images/{os.path.basename(img_path)}")
    return image_paths

@app.route("/")
def home():
    return "Flask server is running!"

@app.route("/upload", methods=["POST"])
def upload_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)

    extracted_text = ""
    image_urls = []

    if file.filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file_path)
        image_urls = convert_pdf_to_images(file_path)
    elif file.filename.endswith(".docx"):
        extracted_text = extract_text_from_docx(file_path)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    return jsonify({
        "images": image_urls,
        "resume_text": extracted_text,
        "message": "Text and preview images extracted successfully!"
    })

@app.route("/images/<filename>")
def get_image(filename):
    return send_from_directory(app.config["IMAGE_FOLDER"], filename)

@app.route("/extract_gpt_keywords", methods=["POST"])
def extract_gpt_keywords_api():
    data = request.get_json()
    resume_text = data.get("resume_text", "")
    job_description = data.get("job_description", "")
    if not resume_text or not job_description:
        return jsonify({"error": "Resume text and job description are required."}), 400
    keywords = extract_gpt_keywords(resume_text, job_description)
    return jsonify({"gpt_keywords": keywords})

@app.route("/generate_cover_letter", methods=["POST"])
def generate_cover_letter_api():
    """
    OpenAI를 사용하여 커버 레터를 생성하는 API
    """
    data = request.get_json()
    resume_text = data.get("resume_text", "")
    job_description = data.get("job_description", "")

    if not resume_text or not job_description:
        return jsonify({"error": "Resume text and job description are required."}), 400

    keywords_data = extract_gpt_keywords(resume_text, job_description)
    keywords = keywords_data.get("keywords", [])

    # Check the extracted keywords
    print(f"[DEBUG] Extracted Keywords: {keywords}")

    cover_letter_data = generate_cover_letter(resume_text, job_description, keywords)

    return jsonify({
        "cover_letter": cover_letter_data.get("cover_letter",""),
        "keywords": keywords
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
