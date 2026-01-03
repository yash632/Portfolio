import os
import token
from altair import Description
from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, request, render_template_string, session, send_from_directory

from flask_cors import CORS
from flask_pymongo import PyMongo
from pymongo.errors import PyMongoError
import cloudinary, cloudinary.uploader

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import ssl
import threading
from itsdangerous import URLSafeTimedSerializer

from datetime import datetime, timedelta
import re
from PIL import Image
import io

# --- Load Config ---

load_dotenv("config.env")

cloudinary.config(
  cloud_name=os.getenv("CLOUD_NAME"),
  api_key=os.getenv("API_KEY"),
  api_secret=os.getenv("API_SECRET")
)

app = Flask(
    __name__,
    static_folder="frontend/build/static",
    template_folder="frontend/build"
)
CORS(app)

app.secret_key = os.getenv("SECRET_KEY")  # already hai 👍
    
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = None

def connect_db():
    global mongo
    try:
        mongo = PyMongo(app)
        print("✅ MongoDB connected")
    except PyMongoError as e:
        mongo = None
        print("⚠️ MongoDB connection failed:", e)


connect_db()

# Email Configuration
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = int(os.getenv("MAIL_PORT", 465))
ADMIN_EMAIL = "yashveers138@gmail.com"

# Token Serializer
serializer = URLSafeTimedSerializer(app.secret_key)

EMAIL_REGEX = r"^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"

#-------------------------------------------------------
#----------- Helper Functions -----------------------
#-------------------------------------------------------

def require_admin_login():
    return session.get("admin_logged_in") is True

def send_async_email(to_email, subject, html_content):
    """Sends an email asynchronously to avoid blocking the request."""
    def _send():
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = MAIL_USERNAME
            msg["To"] = to_email
            msg.attach(MIMEText(html_content, "html"))

            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT, context=context) as server:
                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.sendmail(MAIL_USERNAME, to_email, msg.as_string())
            print(f"Email sent to {to_email}")
        except Exception as e:
            print(f"Failed to send email to {to_email}: {e}")

    thread = threading.Thread(target=_send)
    thread.start()

def get_template_content(template_name):
    """Reads template file from templates directory."""
    try:
        title_path = os.path.join("templates", template_name)
        # Handle absolute/relative path correctness
        if not os.path.exists(title_path):
             # Try absolute path if valid, or relative to current script
             title_path = os.path.join(os.getcwd(), "templates", template_name)
        
        with open(title_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"Template not found: {template_name}")
        return ""

def generate_block_token(email):
    return serializer.dumps(email, salt='block-email')

def verify_block_token(token, expiration=86400*30): # 30 days valid
    try:
        return serializer.loads(token, salt='block-email', max_age=expiration)
    except Exception:
        return None

def is_rate_limited(ip):
    window = datetime.utcnow() - timedelta(minutes=10)

    count = mongo.db.message.count_documents({
        "ip": ip,
        "created_at": {"$gte": window}
    })

    return count >= 1

def check_db():
    global mongo
    if not mongo:
        connect_db()
        return {"message": "Can't connect to database, please refresh"}, 500
    
def optimize_image(file):
    img = Image.open(file)
    img.load()

    if img.mode != "RGB":
        img = img.convert("RGB")

    # ✅ SAFE resolution (no blur)
    MAX_SIDE = 2048   # 👈 ye key hai
    w, h = img.size

    if max(w, h) > MAX_SIDE:
        scale = MAX_SIDE / max(w, h)
        img = img.resize(
            (int(w * scale), int(h * scale)),
            Image.LANCZOS
        )

    buffer = io.BytesIO()
    img.save(
        buffer,
        format="WEBP",
        quality=82,     # 👈 sharp & safe
        optimize=True
    )

    buffer.seek(0)
    return buffer

#-------------------------------------------------------
#----------- Public Routes -----------------------
#-------------------------------------------------------

@app.route("/messages", methods=["POST"])
def messages():
    check_db()
    data = request.json

    email = data.get("email")
    name = data.get("name")
    message_content = data.get("description")

    if not email or not message_content:
        return {"message": "Email and Message are required."}, 400
    
    if not re.match(EMAIL_REGEX, data["email"].lower()):
        return {"message": "Invalid email format."}, 400

    # -----------------------------
    # RATE LIMIT (TOP PRIORITY)
    # -----------------------------
    # ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    ip = ip.split(",")[0].strip()

    if is_rate_limited(ip):
        return {"message": "Too many messages sent. Please try again later."}, 429

    # -----------------------------
    # 1. BLOCKED USER CHECK
    # -----------------------------
    blocked_user = mongo.db.message.find_one({
        "email": email,
        "status": "blocked"
    })
    if blocked_user:
        return {"message": "You have blocked emails from us. No message sent."}, 403

    # -----------------------------
    # 2. PENDING CHECK
    # -----------------------------
    mpending = mongo.db.message.find_one({
        "email": email,
        "status": "pending"
    })
    if mpending:
        return {"message": "You have a pending message. Please wait for a response."}, 400

    # -----------------------------
    # 3. RESPONDED → APPEND MESSAGE
    # -----------------------------
    mresponded = mongo.db.message.find_one({
        "email": email,
        "status": "responded"
    })

    if mresponded:
        mongo.db.message.update_one(
            {"_id": mresponded["_id"]},
            {"$set": {
                "message": mresponded["message"] + "\n\n---\n\n" + message_content,
                "status": "pending",
                "created_at": datetime.utcnow()
            }}
        )

        admin_html = get_template_content("admin_notification.html")
        if admin_html:
            admin_html = admin_html.replace("{{ status }}", "RESPONDED (Updated)")
            admin_html = admin_html.replace("{{ status_class }}", "status-responded")
            admin_html = admin_html.replace("{{ name }}", name)
            admin_html = admin_html.replace("{{ email }}", email)
            admin_html = admin_html.replace("{{ message_content }}", message_content)

            send_async_email(
                ADMIN_EMAIL,
                f"Portfolio: Reply from {name}",
                admin_html
            )

        return {"message": "Message sent successfully!"}, 200

    # -----------------------------
    # 4. NEW MESSAGE
    # -----------------------------
    mongo.db.message.insert_one({
        "name": name,
        "email": email,
        "message": message_content,
        "status": "pending",
        "ip": ip,
        "created_at": datetime.utcnow()
    })

    # -----------------------------
    # USER AUTO-REPLY
    # -----------------------------
    token = generate_block_token(email)
    block_url = f"{request.host_url}block_user/{token}"
    # block_url = f"https://ft65mrt2-5000.inc1.devtunnels.ms/block_user/{token}"
    user_html = get_template_content("user_auto_reply.html")
    if user_html:
        user_html = user_html.replace("{{ name }}", name)
        # user_html = user_html.replace("{{ message_content }}", message_content)
        user_html = user_html.replace("{{ block_url }}", block_url)
        user_html = user_html.replace("{{ portfolio_url }}", request.host_url)

        send_async_email(
            email,
            "Message Received - Yash Rathore",
            user_html
        )

    # -----------------------------
    # ADMIN NOTIFICATION
    # -----------------------------
    admin_html = get_template_content("admin_notification.html")
    if admin_html:
        admin_html = admin_html.replace("{{ status }}", "NEW")
        admin_html = admin_html.replace("{{ status_class }}", "status-new")
        admin_html = admin_html.replace("{{ name }}", name)
        admin_html = admin_html.replace("{{ email }}", email)
        admin_html = admin_html.replace("{{ message_content }}", message_content)

        send_async_email(
            ADMIN_EMAIL,
            f"Portfolio: New Message from {name}",
            admin_html
        )

    return {"message": "Message sent successfully!"}, 200

@app.route("/block_user/<token>", methods=["GET"])
def block_user(token):
    email = verify_block_token(token)
    if not email:
        return "Invalid or expired link. Please try sending a new message to get a fresh link.", 400
    
    mongo.db.message.update_many(
        {"email": email},
        {"$set": {"status": "blocked"}}
    )
    
    # If no record exists (e.g. they somehow deleted all messages but still have link), insert one to track block
    if mongo.db.message.count_documents({"email": email}) == 0:
        mongo.db.message.insert_one({"email": email, "status": "blocked"})

    return get_template_content("block_success.html")

@app.route("/fetch/media", methods=["GET"])
def fetch_media():
    check_db()
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    media_type = request.args.get("type", "all")  # all | video | photo

    skip = (page - 1) * limit

    # 🔑 Conditional filter
    query = {}
    if media_type != "all":
        query["file_type"] = media_type   # "video" or "photo"

    cursor = (
        mongo.db.media.find(query)
        .sort("_id", -1)
        .skip(skip)
        .limit(limit)
    )

    media = []
    for m in cursor:
        media.append({
            "id": str(m["_id"]),
            "title": m["title"],
            "file_type": m["file_type"],
            "description": m["description"],
            "skills": m["skills"],
            "url": m["url"]
        })

    return {
        "page": page,
        "limit": limit,
        "count": len(media),
        "data": media
    }

#-------------------------------------------------------
#----------- Admin Routes -----------------------
#-------------------------------------------------------

@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"message": "Email and password required"}, 400

    if email == os.getenv("ADMIN_EMAIL") and password == os.getenv("ADMIN_PASSWORD"):
        session["admin_logged_in"] = True
        session["admin_email"] = email

        return {"message": "Login successful"}, 200

    return {"message": "Invalid credentials"}, 401

@app.route("/admin/logout", methods=["POST"])
def admin_logout():
    session.clear()
    return {"message": "Logged out Successfully"}, 200

@app.route("/admin/check-auth")
def admin_check_auth():
    if require_admin_login():
        return {"admin": True}
    return {"admin": False}, 401

@app.route("/admin/messages", methods=["GET"])
def get_messages():
    check_db()
    if not require_admin_login():
        return {"message": "unauthorized access"}, 403      

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    skip = (page - 1) * limit

    cursor = mongo.db.message.find() \
        .sort("created_at", -1) \
        .skip(skip) \
        .limit(limit)

    messages = []
    for m in cursor:
        messages.append({
            "id": str(m["_id"]),
            "name": m["name"],
            "email": m["email"],
            "message": m["message"],
            "status": m["status"],
            "created_at": m.get("created_at"),
            "ip": m.get("ip")

        })

    return {
        "page": page,
        "limit": limit,
        "count": len(messages),
        "data": messages
    }

@app.route("/admin/upload", methods=["POST"])
def upload_media():
    check_db()
    if not require_admin_login():
        return {"message": "unauthorized access"}, 403
    
    file = request.files.get("file")
    # file = ""
    file_type = request.form.get("type", "photo")
    title = request.form.get("title", "")
    description = request.form.get("description", "")
    raw_skills = request.form.get("skills", "")
    skills = [s.strip() for s in raw_skills.split(",") if s.strip()]
    
    if not file or not file_type or not title or not description or not skills:
        return {"message": "Enter The Complete Data."}, 400
    
    # Optimize image before upload
    if file_type == "photo":
        file = optimize_image(file)
    elif file_type == "video":
        result = cloudinary.uploader.upload(
            file,
            resource_type="video"
    )

    # result = cloudinary.uploader.upload(file)

    mongo.db.media.insert_one({
        "title": title,
        "file_type": file_type,
        "description": description,
        "skills": skills,
        "url": result["secure_url"],
        "id": result["public_id"]
    })

    return {"message": "Media uploaded successfully!"}, 200

@app.route("/admin/respond", methods=["POST"])
def respond_to_message():
    check_db()
    if not require_admin_login():
        return {"message": "unauthorized access"}, 403

    data = request.json
    message_id = data.get("_id")
    response_text = data.get("status")

    if not message_id or not response_text:
        return {"message": "Message ID and Response required"}, 400

    # Update the message with the response
    result = mongo.db.message.update_one(
        {"_id": ObjectId(message_id)},
        {
            "$set": {
                "status": response_text            }
        }
    )

    if result.modified_count == 0:
        return {"message": "Message not found or already responded to"}, 404

    return {"message": "Response sent successfully!"}, 200

@app.route("/admin/block", methods=["POST"])
def block_to_message():
    check_db()
    if not require_admin_login():
        return {"message": "unauthorized access"}, 403

    data = request.json
    message_id = data.get("_id")


    if not message_id:
        return {"message": "Message ID required"}, 400

    result = mongo.db.message.update_one(
        {"_id": ObjectId(message_id)},
        {
            "$set": {
                "status": data.get("status")
            }
        }
    )

    if result.modified_count == 0:
        return {"message": "Message not found or already responded to"}, 404

    return {"message": "Status Updated successfully!"}, 200

@app.route("/admin/delete_media", methods=["POST"])
def delete_media():
    check_db()
    if not require_admin_login():
        return {"message": "unauthorized access"}, 403

    data = request.json
    media_id = data.get("_id")

    if not media_id:
        return {"message": "Media ID required"}, 400

    media = mongo.db.media.find_one({"_id": ObjectId(media_id)})
    if not media:
        return {"message": "Media not found"}, 404

    try:
        cloudinary.uploader.destroy(media["id"])
    except Exception as e:
        print(f"Error deleting from Cloudinary: {e}")

    mongo.db.media.delete_one({"_id": ObjectId(media_id)})


    return {"message": "Media deleted successfully!"}, 200

@app.route("/admin/delete_message", methods=["POST"])
def delete_message():
    check_db()
    if not require_admin_login():
        return {"message": "unauthorized access"}, 403

    data = request.json
    message_id = data.get("_id")

    if not message_id:
        return {"message": "Message ID required"}, 400

    result = mongo.db.message.delete_one({"_id": ObjectId(message_id)})

    if result.deleted_count == 0:
        return {"message": "Message not found"}, 404

    return {"message": "Message deleted successfully!"}, 200

@app.route("/admin/edit_media", methods=["POST"])
def edit_media():
    check_db()
    if not require_admin_login():
        return {"message": "unauthorized access"}, 403

    data = request.json
    media_id = data.get("_id")
    
    if not media_id:
        return {"message": "Media ID required"}, 400

    update_fields = {
        "title": data.get("title"),
        "description": data.get("description"),
        "skills": data.get("skills")
    }

    result = mongo.db.media.update_one(
        {"_id": ObjectId(media_id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
         return {"message": "Media not found"}, 404

    return {"message": "Media updated successfully!"}, 200

#-------------------------------------------------------
#----------- React Serving Route -----------------------
#-------------------------------------------------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    full_path = os.path.join(app.template_folder, path)

    # agar koi actual file hai (js, css, image)
    if path != "" and os.path.exists(full_path):
        return send_from_directory(app.template_folder, path)

    # warna React ka index.html
    return send_from_directory(app.template_folder, "index.html")

#--------------------------------------------------------
#----------- Setup Indexes ------------------------------
#--------------------------------------------------------

def setup_indexes():
    db = mongo.cx.get_database()

    db.message.create_index([("email", 1), ("status", 1)])
    db.message.create_index([("ip", 1), ("created_at", -1)])

    print("Indexes setup completed.")


if __name__ == "__main__":
    setup_indexes()

    print("Flask server started at http://localhost:5000")
    app.run(host="0.0.0.0", port="5000", debug=True)