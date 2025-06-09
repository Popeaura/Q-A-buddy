from flask import Flask, request
from flask_cors import CORS, cross_origin
from chatterbot import ChatBot
from chatterbot.storage import SQLStorageAdapter
from chatterbot.trainers import ListTrainer
import re

app = Flask(__name__)
CORS(app)

chatbot = ChatBot(
    "TechBuddy",
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    database_uri='sqlite:///db.sqlite3'
)
trainer = ListTrainer(chatbot)

# Q&A Training Data
trainer.train([
    # AI Basics
    "What is AI?",
    "AI stands for Artificial Intelligence. It's when computers learn to think and act like humans!",
    "How does AI work?",
    "AI works by learning from lots of data and examples. It can recognize patterns, make decisions, and even create things!",
    "Can AI play games?",
    "Yes! AI can play games like chess, Go, and even video games. Some AI learns by playing games thousands of times.",
    "What are examples of AI?",
    "Examples of AI include voice assistants like Siri or Alexa, recommendation systems on YouTube, and self-driving cars!",

    # Scratch (Game Development)
    "What is Scratch?",
    "Scratch is a fun way to make games and animations by snapping together colorful blocks. It's perfect for kids to learn coding!",
    "How do I make a game in Scratch?",
    "To make a game in Scratch, you choose sprites (characters), add code blocks to make them move, and use events like 'when green flag clicked' to start your game.",
    "What are sprites in Scratch?",
    "Sprites are the characters or objects in your Scratch project. You can add, draw, or import sprites to use in your games!",
    "Can I share my Scratch projects?",
    "Yes! You can share your projects on the Scratch website so friends and others can play and remix them.",
    "How do I make a sprite move in Scratch?",
    "Use the 'move' block in the Motion category. Drag it to your script and set how many steps you want your sprite to move!",
    "What is a script in Scratch?",
    "A script in Scratch is a set of blocks that tell your sprite what to do. You snap blocks together to create scripts.",
    "How do I add sound to my game in Scratch?",
    "Use the 'play sound' block in the Sound category. You can pick from existing sounds or record your own!",

    # Web Development
    "What is web development?",
    "Web development is the process of making websites and web apps. It includes designing, building, and maintaining websites.",
    "How do I make my own website?",
    "You can make your own website by learning HTML and CSS. Start with a simple page and add more features as you learn!",
    "What are HTML and CSS?",
    "HTML is used to structure your web page, and CSS is used to style it. Together, they help you create beautiful websites!",
    "Can kids build websites?",
    "Yes! Kids can build websites using easy tools like Scratch, or by learning HTML and CSS with help from tutorials.",
    "What is a web browser?",
    "A web browser is a program like Chrome, Firefox, or Safari that lets you visit and view websites.",
    "How do I publish my website?",
    "You can publish your website using free services like GitHub Pages, Netlify, or by uploading your files to a web host.",

    # Robotics
    "What is a robot?",
    "A robot is a machine that can do tasks automatically. Some robots look like humans, but many are just machines with moving parts.",
    "How do robots move?",
    "Robots move using motors, wheels, or legs. They get instructions from a computer or a person to tell them what to do.",
    "What can robots do?",
    "Robots can do many things, like cleaning floors, building cars, exploring space, or playing soccer!",
    "How can I build a simple robot?",
    "You can build a simple robot using kits like LEGO Mindstorms, or by using a microcontroller like Arduino or Raspberry Pi.",
    "What is programming a robot?",
    "Programming a robot means writing code that tells the robot what actions to perform, like moving, sensing, or responding to its environment.",

    # EA Sports
    "What are EA Sports games?",
    "EA Sports games are video games made by Electronic Arts that let you play sports like soccer, basketball, and football.",
    "How do video games work?",
    "Video games work by using code to create graphics, sounds, and rules. Players interact with the game using controllers or keyboards.",
    "Can I make my own sports game?",
    "Yes! You can make your own sports game using Scratch or other game-making tools. Start with a simple idea and add more features as you learn!",
    "Why are sports games popular?",
    "Sports games are popular because they let you play your favorite sports, compete with friends, and feel like a real athlete!",
    "What is FIFA?",
    "FIFA is a popular EA Sports game where you can play soccer with real teams and players from around the world.",

    # App Making (MIT App Inventor)
    "What is MIT App Inventor?",
    "MIT App Inventor is a tool that lets you build your own apps for Android devices using colorful blocks, similar to Scratch.",
    "How do I make an app with MIT App Inventor?",
    "You can make an app by dragging and dropping blocks to design the app's look and logic. You can test your app on your phone or computer!",
    "Can kids use MIT App Inventor?",
    "Yes! MIT App Inventor is designed for beginners and kids. It's a great way to learn how to make real apps.",
    "What kind of apps can I make with MIT App Inventor?",
    "You can make games, quizzes, drawing apps, and more! The possibilities are almost endless.",
    "How do I share my app made with MIT App Inventor?",
    "You can share your app by downloading it to your phone, or by sending the app file to friends and family.",
])

# List of known questions for strict answering (normalized, case-insensitive)
trained_questions = [
    "what is ai", "how does ai work", "can ai play games", "what are examples of ai",
    "what is scratch", "how do i make a game in scratch", "what are sprites in scratch",
    "can i share my scratch projects", "how do i make a sprite move in scratch", "what is a script in scratch",
    "how do i add sound to my game in scratch",
    "what is web development", "how do i make my own website", "what are html and css",
    "can kids build websites", "what is a web browser", "how do i publish my website",
    "what is a robot", "how do robots move", "what can robots do",
    "how can i build a simple robot", "what is programming a robot",
    "what are ea sports games", "how do video games work", "can i make my own sports game",
    "why are sports games popular", "what is fifa",
    "what is mit app inventor", "how do i make an app with mit app inventor",
    "can kids use mit app inventor", "what kind of apps can i make with mit app inventor",
    "how do i share my app made with mit app inventor"
]

def normalize(text):
    # Lowercase, remove punctuation, and strip spaces
    return re.sub(r'[^a-z0-9\s]', '', text.lower()).strip()

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
@cross_origin()
def chat():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    user_input = data.get('text', '').strip()
    norm_input = normalize(user_input)

    if norm_input in ["quit", "exit", "bye"]:
        return "Goodbye! Thanks for chatting with TechBuddy. Have a great day!"

    if norm_input in trained_questions:
        bot_response = str(chatbot.get_response(user_input))
        return bot_response
    else:
        return "Sorry, I don't know the answer to that. Try searching online or asking an expert!"

if __name__ == "__main__":
    app.run(port=5000, debug=True)
