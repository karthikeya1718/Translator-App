from flask import Flask, request, jsonify
from pygooglenews import GoogleNews
from textblob import TextBlob
import pandas as pd
import numpy as np
from googletrans import Translator
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins="*")
translator = Translator()

def get_titles(keyword, language, max_articles=5):
    gn = GoogleNews(lang=language, country='IN')
    search = gn.search(keyword)
    articles = search['entries'][:max_articles]
    news = [{'title': i.title, 'link': i.link, "published": i.published} for i in articles]
    return news

def translation(text, language, target='en'):
    try:
        return translator.translate(text, src=language, dest=target).text
    except Exception as e:
        return f"Translation error: {str(e)}"

def sentiment(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity

def analyze_news(keyword, language, target):
    lang_code = {
        'Telugu': 'te',
        'Hindi': 'hi',
        'Tamil': 'ta',
        'Malayalam': 'ml',
        'Kannada': 'kn',
    }
    articles = get_titles(keyword, lang_code[language], 10)

    if isinstance(articles, str):
        return [{"title": articles}]

    if len(articles) == 0:
        return [{"title": "No articles found"}]

    df = pd.DataFrame(articles)
    # eng_sent = df['title'].apply(lambda x: translation(x, lang_code[language], 'en'))
    df['eng_translation'] = df['title'].apply(lambda x: translation(x, lang_code[language], 'en'))
    df['sentiment'] = df['eng_translation'].apply(sentiment)
    df['translation'] = df['title'].apply(lambda x: translation(x, lang_code[language], target))
    # df['sentiment'] = df['translation'].apply(sentiment)
    df['Sentiment Class'] = np.where(df['sentiment'] < 0, "negative", np.where(df['sentiment'] > 0, "positive", "neutral"))
    return df[['title', 'translation', 'link', 'sentiment', 'Sentiment Class']].to_dict(orient='records')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    keyword = data['keyword']
    language = data['language']
    target = data['target']
    result = analyze_news(keyword, language, target)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)