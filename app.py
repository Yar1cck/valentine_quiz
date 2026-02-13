import os
import uuid
from werkzeug.utils import secure_filename

from flask import Flask, render_template, send_from_directory, url_for, request, jsonify


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")
CUSTOM_QUIZ_IMAGES_DIR = os.path.join(BASE_DIR, "static", "quiz-images")
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder="static",
        template_folder="templates",
    )
    
    # Создаём директории, если они не существуют
    os.makedirs(IMAGES_DIR, exist_ok=True)
    os.makedirs(CUSTOM_QUIZ_IMAGES_DIR, exist_ok=True)

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/quiz")
    def quiz():
        return render_template("quiz.html")

    @app.route("/valentine")
    def valentine():
        return render_template("valentine.html")

    @app.route("/couple-quiz")
    def couple_quiz():
        return render_template("couple-quiz.html")

    @app.route("/images/<path:filename>")
    def serve_image(filename: str):
        return send_from_directory(IMAGES_DIR, filename)

    @app.route("/quiz-images/<path:filename>")
    def serve_quiz_image(filename: str):
        return send_from_directory(CUSTOM_QUIZ_IMAGES_DIR, filename)

    @app.route("/api/upload-quiz-image", methods=["POST"])
    def upload_quiz_image():
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files["file"]
        
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400
        
        # Проверяем размер
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({"error": "File too large"}), 400
        
        # Генерируем уникальное имя файла
        ext = secure_filename(file.filename).rsplit(".", 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        
        file_path = os.path.join(CUSTOM_QUIZ_IMAGES_DIR, unique_filename)
        file.save(file_path)
        
        return jsonify({
            "success": True,
            "filename": unique_filename,
            "url": url_for("serve_quiz_image", filename=unique_filename)
        })

    return app


    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5009))
    app.run(debug=True, port=port)

