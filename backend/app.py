from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Import your chatbot logic here
from bot import chatbot

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    response = chatbot.get_response(user_message)
    return jsonify({"response": str(response)})

if __name__ == '__main__':
    app.run(debug=True)
