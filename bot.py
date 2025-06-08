from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

chatbot = ChatBot("TechBuddy")

trainer = ListTrainer(chatbot)
# Add your own Q&A pairs here
trainer.train([
    "What is AI?",
    "AI stands for Artificial Intelligence. It's when computers learn to think and act like humans!",
    "What is Scratch?",
    "Scratch is a fun way to make games and animations by snapping together colorful blocks.",
    # Add more Q&A for your topics
])

print("Hi! I'm TechBuddy. Ask me about AI, Scratch, web development, robotics, or EA Sports!")
while True:
    try:
        user_input = input("You: ")
        if user_input.lower() in ("quit", "exit", "bye"):
            break
        response = chatbot.get_response(user_input)
        print("TechBuddy:", response)
    except (KeyboardInterrupt, EOFError):
        break
