from flask import Flask, render_template, request, jsonify, redirect, session, url_for
import sqlite3, os, bcrypt

app = Flask(__name__)
app.secret_key = "f97a0f81df83b97e6b3f5bda8e214cfb89c8b26d3a1d0f89f72f59d4a58e3f1b"
DB_PATH = "champion_progress.db"
def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=10, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            champion TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()


@app.route("/")
def index():
    if "user_id" not in session:
        return redirect(url_for("login"))

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT username FROM users WHERE id = ?", (session["user_id"],))
    user = c.fetchone()
    conn.close()

    username = user[0] if user else "Summoner"
    return render_template("index.html", username=username)

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"].strip()
        password = request.form["password"].strip()

        if not username or not password:
            return render_template("register.html", error="Please fill in all fields")

        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed))
            conn.commit()

            session["user_id"] = c.lastrowid
            session["username"] = username

            conn.close()
            return redirect(url_for("index"))
        except sqlite3.IntegrityError:
            return render_template("register.html", error="Username already exists")

    return render_template("register.html")



@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db_connection()
        c = conn.cursor()
        c.execute("SELECT id, password FROM users WHERE username = ?", (username,))
        user = c.fetchone()
        conn.close()

        if user and bcrypt.checkpw(password.encode("utf-8"), user[1]):
            session["user_id"] = user[0]
            return redirect(url_for("index"))
        else:
            return render_template("login.html", error="Invalid username or password")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/api/load_progress", methods=["GET"])
def load_progress():
    if "user_id" not in session:
        return jsonify({"champions": []})

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT champion FROM progress WHERE user_id = ?", (session["user_id"],))
    champions = [row[0] for row in c.fetchall()]
    conn.close()
    return jsonify({"champions": champions})


@app.route("/api/save_progress", methods=["POST"])
def save_progress():
    if "user_id" not in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    champions = data.get("champions", [])

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM progress WHERE user_id = ?", (session["user_id"],))
    for champ in champions:
        c.execute("INSERT INTO progress (user_id, champion) VALUES (?, ?)", (session["user_id"], champ))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "count": len(champions)})

@app.route("/api/reset_progress", methods=["POST"])
def reset_progress():
    if "user_id" not in session:
        return jsonify({"error": "Not logged in"}), 401

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM progress WHERE user_id = ?", (session["user_id"],))
    conn.commit()
    conn.close()
    return jsonify({"status": "reset"})


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
