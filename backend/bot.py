from flask import Flask, request
from flask_cors import CORS, cross_origin
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
import re

app = Flask(__name__)
CORS(app)

chatbot = ChatBot("TechBuddy")
trainer = ListTrainer(chatbot)
trainer.train([
    # ... your Q&A pairs ...
])

trained_questions = [
    # ... your normalized questions ...
]

def normalize(text):
    return re.sub(r'[^a-z0-9\s]', '', text.lower()).strip()

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
@cross_origin()
def chat():
    if request.method == 'OPTIONS':
        return '', 200  # CORS preflight response

    data = request.json
    user_input = data.get('text', '').strip()
    norm_input = normalize(user_input)

    if norm_input in ["quit", "exit", "bye"]:
        return "quit"

    if norm_input in trained_questions:
        bot_response = str(chatbot.get_response(user_input))
        return bot_response
    else:
        return "Sorry, I don't know the answer to that. Try searching online or asking an expert!"

if __name__ == "__main__":
    app.run(port=5000, debug=True)
