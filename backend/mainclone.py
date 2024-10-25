# -*- coding: utf-8 -*-
"""MajorProduct.ipynb

Original file is located at
    https://colab.research.google.com/drive/1aDFvEWsQtoNa54gP0kZ2KLZbawuSMKq-
"""

import gradio as gr
from pygooglenews import GoogleNews
from textblob import TextBlob
import pandas as pd
import numpy as np
from googletrans import Translator


#lets create a function that allows us to enter the keyword we want to search
def get_titles(keyword, language, max_articles=5):
  gn=GoogleNews(lang=language,country='IN')
  search = gn.search(keyword)
  articles = search['entries'][:max_articles]
  # new code
  news = []
  for i in articles:
  #  print(i.title)
    article = {'title': i.title, 'link': i.link, "published": i.published}
    news.append(article)

  return news

translator = Translator()

# let's create a function that bring back sentiment and translations
def translation(text, language, target='en'):
  # blob = TextBlob(text)
  try:
      # return str(blob.translate(from_lang=language, to=target))
      return translator.translate(text, src=language, dest=target).text
  except Exception as e:
      return f"Translation error: {str(e)}"

def sentiment(text):
  blob=TextBlob(text)
  return blob.sentiment.polarity

def analyze_news(keyword, language, target):
   # Map language code to TextBlob's expected language code
    lang_code = {
        'Telugu': 'te',  # Telugu
        'Hindi': 'hi',  # Hindi
        'Tamil': 'ta',  # Tamil
        'Malayalam': 'ml',  # Malayalam
        'Kannada': 'kn',  # Kannada
    }
    # Get titles based on the keyword
    articles = get_titles(keyword, lang_code[language], 5)

    if isinstance(articles, str):  # Handle case where articles fetching failed
        return pd.DataFrame([{"title": articles}])

    if len(articles) == 0:
        return pd.DataFrame([{"title": "No articles found"}])

    # Create a DataFrame to hold the titles
    df = pd.DataFrame(articles)

    # Translate and analyze sentiment
    eng_sent = df['title'].apply(lambda x: translation(x, lang_code[language], 'en'))
    df['translation'] = df['title'].apply(lambda x: translation(x, lang_code[language], target))
    df['sentiment'] = eng_sent.apply(sentiment)
    # df['sentiment'] = df['translation'].apply(sentiment)
    df['Sentiment Class'] = np.where(df['sentiment'] < 0, "negative", np.where(df['sentiment'] > 0, "positive", "neutral"))

    return df[['title', 'translation', 'link' , 'sentiment', 'Sentiment Class']]


languages = [
    ('Telugu', 'te'),
    ('Hindi', 'hi'),
    ('Tamil', 'ta'),
    ('Malayalam', 'ml'),
    ('Kannada', 'kn')
]

# Create the Gradio interface
# interface = gr.Interface(
#                          fn=analyze_news,
#                          inputs=[
#                              gr.Textbox(label="Enter Keyword"),
#                              gr.Dropdown(label="Select Language", choices=[lang[0] for lang in languages], value="Telugu")
#                          ],
#                          outputs=gr.Dataframe(label="News Analysis"),
#                          title="News Sentiment Analysis",
#                          description="Analyze news articles based on sentiment."
#                         )

# with gr.Blocks() as interface:
#   inputs=[
#       gr.Textbox(label="Enter Keyword"),
#       gr.Dropdown(label="Select Language", choices=[lang[0] for lang in languages], value="Telugu")
#   ]
#   outputs=gr.Dataframe(label="News Analysis")
#   btn = gr.Button("Show Results")
#   btn.click(fn=analyze_news, inputs=inputs, outputs=outputs)
#   title="News Sentiment Analysis"
#   description="Analyze news articles based on sentiment."



with gr.Blocks() as interface:
  inputs=[
      gr.Textbox(label="Enter Keyword"),
      gr.Dropdown(label="Select Language", choices=[lang[0] for lang in languages], value="Telugu"),
      gr.Dropdown(label="Select Target Language", choices=['en', 'te', 'hi', 'ta', 'ml', 'kn'], value='en')
  ]
  outputs=gr.Dataframe(label="News Analysis")
  btn = gr.Button("Show Results")
  btn.click(fn=analyze_news, inputs=inputs, outputs=outputs)
  title="News Sentiment Analysis"
  description="Analyze news articles based on sentiment."

# Launch the interface
interface.launch()