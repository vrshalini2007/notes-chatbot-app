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
# SUPABASE CONFIGURATION
# ==========================
SUPABASE_URL = "https://hfeevbknxtniuuqfhsov.supabase.co"

SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

# ==========================
# HOME PAGE
# ==========================
@app.route("/")
def home():
    return render_template("index.html")


# ==========================
# CONTACT PAGE
# ==========================
@app.route("/contact")
def contact():

    response = (
        supabase
        .table("contact_us")
        .select("*")
        .execute()
    )

    records = response.data

    return render_template(
        "contact.html",
        records=records
    )


# ==========================
# CONTACT FORM SUBMIT
# ==========================
@app.route("/submit", methods=["POST"])
def submit():

    record_id = request.form.get("id")

    data = {
        "first_name":
            request.form["first_name"],

        "last_name":
            request.form["last_name"],

        "gender":
            request.form["gender"],

        "age":
            int(request.form["age"]),

        "address":
            request.form["address"],

        "mobile_number":
            request.form["mobile_number"],

        "email":
            request.form["email"],

        "description":
            request.form["description"],

        "submitted_time":
            datetime.now().isoformat()
    }

    if record_id:

        (
            supabase
            .table("contact_us")
            .update(data)
            .eq("id", record_id)
            .execute()
        )

    else:

        (
            supabase
            .table("contact_us")
            .insert(data)
            .execute()
        )

    return redirect(
        url_for("contact")
    )


# ==========================
# REGISTER USER
# ==========================
@app.route("/register", methods=["POST"])
def register():

    try:

        data = request.get_json()

        email = data["email"]

        # Check existing user
        existing = (
            supabase
            .table("users")
            .select("*")
            .eq("email", email)
            .execute()
        )

        if existing.data:

            return jsonify({
                "token":
                    existing.data[0]["token"],
                "user":
                    existing.data[0]
            })

        # New user
        token = str(uuid.uuid4())

        user = {
            "first_name":
                data["first_name"],

            "last_name":
                data["last_name"],

            "email":
                email,

            "token":
                token,

            "created_at":
                datetime.now().isoformat()
        }

        response = (
            supabase
            .table("users")
            .insert(user)
            .execute()
        )

        return jsonify({
            "token":
                token,

            "user":
                response.data[0]
        })

    except Exception as e:

        print("REGISTER ERROR:", e)

        return jsonify({
            "error":
                str(e)
        }), 500


# ==========================
# CHECK USER
# ==========================
@app.route("/check-user", methods=["POST"])
def check_user():

    try:

        data = request.get_json()

        token = data["token"]

        response = (
            supabase
            .table("users")
            .select("*")
            .eq("token", token)
            .execute()
        )

        if response.data:

            return jsonify({
                "status":
                    "existing",

                "user":
                    response.data[0]
            })

        return jsonify({
            "status":
                "new"
        })

    except Exception as e:

        print("CHECK USER ERROR:", e)

        return jsonify({
            "error":
                str(e)
        }), 500


# ==========================
# SAVE NOTE
# ==========================
@app.route("/save-note", methods=["POST"])
def save_note():

    try:

        data = request.get_json()

        save_data = {
            "user_id":
                data["user_id"],

            "message":
                data["message"],

            "created_at":
                datetime.now().isoformat()
        }

        (
            supabase
            .table("notes_history")
            .insert(save_data)
            .execute()
        )

        return jsonify({
            "message":
                "Note Saved Successfully"
        })

    except Exception as e:

        print("SAVE NOTE ERROR:", e)

        return jsonify({
            "error":
                str(e)
        }), 500


# ==========================
# RUN APP
# ==========================
if __name__ == "__main__":
    app.run(debug=True)