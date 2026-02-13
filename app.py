import os

from flask import Flask, render_template, send_from_directory, url_for


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder="static",
        template_folder="templates",
    )

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/quiz")
    def quiz():
        return render_template("quiz.html")

    @app.route("/valentine")
    def valentine():
        return render_template("valentine.html")

    @app.route("/gallery")
    def gallery():
        if not os.path.isdir(IMAGES_DIR):
            images = []
        else:
            images = sorted(
                [
                    filename
                    for filename in os.listdir(IMAGES_DIR)
                    if filename.lower().endswith(
                        (".jpg", ".jpeg", ".png", ".gif", ".webp")
                    )
                ]
            )
        image_urls = [url_for("serve_image", filename=name) for name in images]
        return render_template("gallery.html", images=image_urls)

    @app.route("/images/<path:filename>")
    def serve_image(filename: str):
        return send_from_directory(IMAGES_DIR, filename)

    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5004))
    app.run(debug=True, port=port)

