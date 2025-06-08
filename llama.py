from langchain_community.llms import Ollama
llm = Ollama(model="llama3")
print("Hi! I'm your local AI assistant. Ask me anything about tech!")
while True:
    user_input = input("You: ")
    if user_input.lower() in ("quit", "exit", "bye"):
        break
    response = llm(user_input)
    print("AI:", response)
