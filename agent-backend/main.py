from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import uvicorn
from pydantic import BaseModel
import os
import requests

app = FastAPI()

# ---- CORS for React Frontend ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Request Model ----
class ButtonRequest(BaseModel):
    traveler_id: int
    mode: str  # "itinerary", "activity", "restaurant", or "packing"

# ---- Endpoint ----
@app.post("/agent-button")
async def agent_button_handler(req: ButtonRequest):
    traveler_id = req.traveler_id
    mode = req.mode

    # Step 1: Fetch traveler profile from your Express backend
    try:
        res = requests.get(f"http://localhost:5001/api/travelers/{traveler_id}")
        traveler = res.json()
    except Exception as e:
        return {"success": False, "error": f"Failed to fetch traveler info: {str(e)}"}

    # Debug: check what we received
    print("Traveler data fetched:", traveler)

    # Extract traveler info safely
    about_me = traveler.get("aboutMe", "No description provided.")
    city = traveler.get("city", "unspecified location")

    # Step 2: Define prompt templates for each button
    prompt_map = {
        "itinerary": (
            "You are a travel concierge. Based on this traveler: {about_me}, "
            "Generate a concise, emoji-enhanced 3-day itinerary in {city} for this traveler: {about_me}. "
            "Each day should be structured as:\n\n"
            "📅 Day 1\n🌅 Morning\n[activity]\n🍽️ Lunch\n[activity]\n🌆 Afternoon\n[activity]\n🌙 Evening\n[activity]\n\n"
            "Use 1–2 lines per activity, include fun emojis, and break into clear blocks. Make it scannable, friendly, and fun to read."
        ),
        "activity": (
            "You are a travel expert. Based on this traveler: {about_me}, "
            "recommend 3‑5 fun activities near {city}. For each, include a title, address, "
            "tags, and whether it’s child‑ or wheelchair‑friendly."
            "Structure each of them in a separate paragraph and in activity card style. Make it easy and fun to read. You can use emojis to enrich the response."
        ),
        "restaurant": (
            "You are a culinary travel guide. Based on this traveler: {about_me}, "
            "suggest several restaurants in {city} that fit their dietary preferences. "
            "If they mention being vegan, vegetarian, or having dietary restrictions, make sure to respect that."
            "Structure each of them in a separate paragraph and in restaurant card style. Make it easy and fun to read.You can use emojis to enrich the response."
        ),
        "packing": (
            "You are a packing assistant. Based on this traveler: {about_me}, "
            "generate a weather‑aware packing checklist for a 3‑day trip to {city}."
            "Structure your response as a list, make it easy to read. You can use emojis to enrich the response."
        ),
    }

    if mode not in prompt_map:
        return {"success": False, "error": f"Invalid mode '{mode}'."}

    # Step 3: Create LangChain components
    llm = ChatOpenAI(
        model="gpt-4",
        temperature=0.7,
        api_key=os.getenv("OPENAI_API_KEY")
    )
    prompt = PromptTemplate.from_template(prompt_map[mode])
    parser = StrOutputParser()

    # Step 4: Run chain (Prompt → LLM → Parser)
    chain = prompt | llm | parser

    try:
        reply = chain.invoke({
            "about_me": about_me,
            "city": city
        })
    except Exception as e:
        return {"success": False, "error": f"OpenAI call failed: {str(e)}"}

    # Step 5: Return structured result
    return {"success": True, "reply": reply.strip()}

# ---- Run locally ----
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5005)