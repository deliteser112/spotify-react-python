import datetime
from flask import Flask, jsonify

app = Flask(__name__, static_folder="../build",static_url_path="/")

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/message')
def get_current_time():
    return {'message' : "Hello from Flask!" }