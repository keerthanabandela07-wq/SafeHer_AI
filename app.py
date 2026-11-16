from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3

app = Flask(__name__)


# Connect to database
def get_db_connection():

    conn = sqlite3.connect("safeher.db")

    conn.row_factory = sqlite3.Row

    return conn


# Create contacts table
def create_table():

    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    """)

    conn.commit()

    conn.close()


# Homepage
@app.route("/")
def home():

    return render_template("index.html")


# Dashboard
@app.route("/dashboard")
def dashboard():

    return render_template("dashboard.html")


# Trusted Contacts Page
@app.route("/contacts", methods=["GET", "POST"])
def contacts():

    conn = get_db_connection()

    if request.method == "POST":

        name = request.form["name"].strip()

        phone = request.form["phone"].strip()

        if name and phone:

            conn.execute(
                "INSERT INTO contacts (name, phone) VALUES (?, ?)",
                (name, phone)
            )

            conn.commit()

        conn.close()

        return redirect(url_for("contacts"))

    saved_contacts = conn.execute(
        "SELECT * FROM contacts"
    ).fetchall()

    conn.close()

    return render_template(
        "contacts.html",
        contacts=saved_contacts
    )


# Delete Contact
@app.route("/delete/<int:contact_id>", methods=["POST"])
def delete_contact(contact_id):

    conn = get_db_connection()

    conn.execute(
        "DELETE FROM contacts WHERE id = ?",
        (contact_id,)
    )

    conn.commit()

    conn.close()

    return redirect(url_for("contacts"))
# SOS Emergency Route
@app.route("/send_sos", methods=["POST"])
def send_sos():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "message": "Invalid request!"
        }), 400

    latitude = data.get("latitude")
    longitude = data.get("longitude")

    # Check whether location is available
    if latitude is None or longitude is None:
        return jsonify({
            "message": "Location is missing!"
        }), 400

    # Validate coordinates
    if not isinstance(latitude, (int, float)) or not isinstance(longitude, (int, float)):
        return jsonify({
            "message": "Invalid location coordinates!"
        }), 400

    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        return jsonify({
            "message": "Invalid location coordinates!"
        }), 400

    # Create Google Maps location link
    location_link = "https://www.google.com/maps?q={},{}".format(
        latitude, longitude
    )

    # Get trusted contacts from database
    conn = get_db_connection()

    contacts = conn.execute(
        "SELECT name, phone FROM contacts"
    ).fetchall()

    conn.close()

    # Prepare emergency message
    emergency_message = (
        "EMERGENCY! I need help. "
        "My current location is: " + location_link
    )

    return jsonify({
        "message": "SOS alert prepared successfully!",
        "location": location_link,
        "emergency_message": emergency_message,
        "contacts": [
            {
                "name": contact["name"],
                "phone": contact["phone"]
            }
            for contact in contacts
        ]
    })


  create_table()

# Start Application
if __name__ == "__main__":

    app.run(debug=True)