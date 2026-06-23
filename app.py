from flask import Flask, render_template, request, redirect, url_for
from supabase import create_client, Client
from datetime import datetime

app = Flask(__name__)

SUPABASE_URL = "https://hfeevbknxtniuuqfhsov.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWV2YmtueHRuaXV1cWZoc292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODM3ODcsImV4cCI6MjA5Nzc1OTc4N30.NMmkNhq1sUZVhKC0pMrk6m32EKUEz8jimwFv3EDylxQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# Home
@app.route("/")
def home():
    return render_template("index.html")


# Contact page (SHOW FORM + TABLE)
@app.route("/contact")
def contact():
    response = supabase.table("contact_us").select("*").execute()
    records = response.data
    return render_template("contact.html", records=records)


# INSERT OR UPDATE
@app.route("/submit", methods=["POST"])
def submit():

    record_id = request.form.get("id")  # hidden field

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

    # 🔥 IF ID EXISTS → UPDATE
    if record_id:
        supabase.table("contact_us").update(data).eq("id", record_id).execute()
    else:
        # 🔥 ELSE → INSERT NEW
        supabase.table("contact_us").insert(data).execute()

    return redirect(url_for("contact"))


if __name__ == "__main__":
    app.run(debug=True)