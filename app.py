from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    jsonify
)

from supabase import create_client, Client
from datetime import datetime
import uuid

app = Flask(__name__)

# ==========================
# SUPABASE
# ==========================
SUPABASE_URL = "https://hfeevbknxtniuuqfhsov.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWV2YmtueHRuaXV1cWZoc292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODM3ODcsImV4cCI6MjA5Nzc1OTc4N30.NMmkNhq1sUZVhKC0pMrk6m32EKUEz8jimwFv3EDylxQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ==========================
# HOME
# ==========================
@app.route("/")
def home():
    return render_template("index.html")


# ==========================
# CONTACT PAGE
# ==========================
@app.route("/contact")
def contact():
    response = supabase.table("contact_us").select("*").execute()
    records = response.data
    return render_template("contact.html", records=records)


# ==========================
# CONTACT FORM
# ==========================
@app.route("/submit", methods=["POST"])
def submit():
    record_id = request.form.get("id")
    data = {
        "first_name": request.form["first_name"],
        "last_name": request.form["last_name"],
        "gender": request.form["gender"],
        "age": int(request.form["age"]),
        "address": request.form["address"],
        "mobile_number": request.form["mobile_number"],
        "email": request.form["email"],
        "description": request.form["description"],
        "submitted_time": datetime.now().isoformat()
    }
    if record_id:
        supabase.table("contact_us").update(data).eq("id", record_id).execute()
    else:
        supabase.table("contact_us").insert(data).execute()
    return redirect(url_for("contact"))


# ==========================
# REGISTER USER
# ==========================
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data["email"]
    existing = supabase.table("users").select("*").eq("email", email).execute()
    if existing.data:
        return jsonify({
            "status": "existing",
            "user": existing.data[0],
            "token": existing.data[0]["token"]
        })
    token = str(uuid.uuid4())
    user = {
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "email": email,
        "token": token,
        "created_at": datetime.now().isoformat()
    }
    response = supabase.table("users").insert(user).execute()
    return jsonify({
        "status": "new",
        "user": response.data[0],
        "token": token
    })


# ==========================
# LOGIN
# ==========================
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    response = supabase.table("users").select("*").eq("email", email).execute()
    if response.data:
        return jsonify({"status": "success", "user": response.data[0]})
    return jsonify({"status": "not_found"})


# ==========================
# CHECK TOKEN
# ==========================
@app.route("/check-user", methods=["POST"])
def check_user():
    data = request.get_json()
    token = data["token"]
    response = supabase.table("users").select("*").eq("token", token).execute()
    if response.data:
        return jsonify({"status": "existing", "user": response.data[0]})
    return jsonify({"status": "new"})


# ==========================
# GET USER NOTES
# ==========================
@app.route("/get-notes", methods=["POST"])
def get_notes():
    data = request.get_json()
    user_id = data["user_id"]
    response = (
        supabase
        .table("notes_history")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return jsonify({"notes": response.data})


# ==========================
# SAVE NOTE
# ==========================
@app.route("/save-note", methods=["POST"])
def save_note():
    data = request.get_json()
    save_data = {
        "user_id": data["user_id"],
        "note": data["note"],
        "created_at": datetime.now().isoformat()
    }
    response = supabase.table("notes_history").insert(save_data).execute()
    return jsonify({"message": "Note Saved Successfully", "note": response.data[0]})


# ==========================
# UPDATE NOTE
# ==========================
@app.route("/update-note", methods=["POST"])
def update_note():
    data = request.get_json()
    supabase.table("notes_history").update({"note": data["note"]}).eq("id", data["id"]).execute()
    return jsonify({"message": "Note Updated Successfully"})


# ==========================
# DELETE NOTE
# ==========================
@app.route("/delete-note", methods=["POST"])
def delete_note():
    data = request.get_json()
    supabase.table("notes_history").delete().eq("id", data["id"]).execute()
    return jsonify({"message": "Note Deleted Successfully"})


# ==========================
# ALL NOTES PAGE
# ==========================
@app.route("/notes")
def notes():
    notes_response = (
        supabase.table("notes_history").select("*").order("created_at", desc=True).execute()
    )
    users_response = supabase.table("users").select("*").execute()
    notes = notes_response.data
    users = users_response.data
    total_notes = len(notes)
    total_users = len(users)
    today = datetime.now().date()
    notes_today = 0
    final_notes = []
    for item in notes:
        user_name = "Unknown User"
        user = supabase.table("users").select("*").eq("id", item["user_id"]).execute()
        if user.data:
            user_name = user.data[0]["first_name"] + " " + user.data[0]["last_name"]
        try:
            created = datetime.fromisoformat(item["created_at"].replace("+00:00", "")).date()
            if created == today:
                notes_today += 1
        except:
            pass
        final_notes.append({
            "name": user_name,
            "note": item["note"],
            "time": item["created_at"][:10],
            "tag": "General"
        })
    return render_template(
        "notes.html",
        notes=final_notes,
        total_notes=total_notes,
        total_users=total_users,
        notes_today=notes_today,
        total_categories=1
    )


# ==========================
# RUN APP
# ==========================
if __name__ == "__main__":
    app.run(debug=True)