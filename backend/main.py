from flask import Flask, request, jsonify
from pygooglenews import GoogleNews
from textblob import TextBlob
import pandas as pd
import numpy as np
from googletrans import Translator
from flask_cors import CORS
import pyttsx3
import speech_recognition as sr

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
translator = Translator()

# Initialize text-to-speech engine
tts_engine = pyttsx3.init()


# Function to speak text
def speak_text(text):
    tts_engine.say(text)
    tts_engine.runAndWait()


# Function to process voice input
def process_voice_input():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        try:
            print("Listening for input...")
            audio = recognizer.listen(source, timeout=5)
            return recognizer.recognize_google(audio)
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError as e:
            return f"Error with the speech recognition service: {str(e)}"


def get_titles(keyword, language, max_articles=6):
    gn = GoogleNews(lang=language, country="IN")
    search = gn.search(keyword)
    articles = search.get("entries", [])[:max_articles]
    news = [
        {"title": i.title, "link": i.link, "published": i.published} for i in articles
    ]
    return news


def translation(text, language, target="en"):
    try:
        return translator.translate(text, src=language, dest=target).text
    except Exception as e:
        print(f"Translation error: {str(e)}")  # Log the error
        return f"Translation error: {str(e)}"


def sentiment(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity


def analyze_news(keyword, language, target):
    lang_code = {
        "English": "en",
        "Telugu": "te",
        "Hindi": "hi",
        "Tamil": "ta",
        "Malayalam": "ml",
        "Kannada": "kn",
    }

    if language not in lang_code:
        return [{"title": "Unsupported language"}]

    articles = get_titles(keyword, lang_code[language], 6)

    if isinstance(articles, str):
        return [{"title": articles}]

    if len(articles) == 0:
        return [{"title": "No articles found"}]

    df = pd.DataFrame(articles)
    df["eng_translation"] = df["title"].apply(
        lambda x: translation(x, lang_code[language], "en")
    )
    df["sentiment"] = df["eng_translation"].apply(sentiment)
    df["translation"] = df["title"].apply(
        lambda x: translation(x, lang_code[language], target)
    )
    df["Sentiment Class"] = np.where(
        df["sentiment"] < 0,
        "Negative",
        np.where(df["sentiment"] > 0, "Positive", "Neutral"),
    )
    return df[["title", "translation", "link", "sentiment", "Sentiment Class"]].to_dict(
        orient="records"
    )


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    keyword = data.get("keyword")
    language = data.get("language")
    target = data.get("target")

    if not keyword or not language or not target:
        return jsonify({"error": "Invalid input"}), 400

    result = analyze_news(keyword, language, target)
    return jsonify(result)


@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.get_json()
    text = data.get("text")
    target_language = data.get("target_language")
    if not text or not target_language:
        return jsonify({"error": "Invalid input"}), 400
    translated_text = translation(text, "auto", target_language)
    return jsonify({"translated_text": translated_text})


@app.route("/voice-input", methods=["GET"])
def voice_input():
    voice_result = process_voice_input()
    return jsonify({"voice_input": voice_result})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
