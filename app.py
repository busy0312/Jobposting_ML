# import necessary libraries
import os
import pandas as pd
import re
# from config import postgres_password
postgres_password=os.environ.get("postgres_password")
from sqlalchemy import create_engine
from bs4 import BeautifulSoup
import requests
import tensorflow as tf
import tensorflow_hub as hub
from tensorflow.keras import datasets, layers, models
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect,
    url_for,
    session)
# from config import SQL_key, Local_SQL_URI

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.secret_key='asdf'
#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or f'postgres://opwdphsvqznbup:{postgres_password}@ec2-52-23-14-156.compute-1.amazonaws.com:5432/df38j5m3da0igq'
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or Local_SQL_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
db = SQLAlchemy(app)
print(db.Model.metadata)
db.Model.metadata.reflect(bind=db.engine)


# results = db.session.query(Animal.Name).all()
# print(results)
job_postings = []
# from .models import Pet
# create route that renders index.html template
@app.route("/",  methods=["GET", "POST"])
def home():
    session['prediction']=""
    if request.method == "POST":
        # grab posted data 
        job_title = request.form['user_input']
        jobsite = request.form['jobsite']
        print(jobsite)
        # scrape using posted data
        job_postings = scrape_indeed(job_title)

        if jobsite == "indeed":
            job_postings = scrape_indeed(job_title)

        else:
            job_postings = scrape_craigslist(job_title)
            # job_postings = scrape_indeed(job_title)
        return render_template('index.html', job_postings=job_postings)

    else:
        return render_template("index.html")

def format_string(string):
    formatted_string = string.replace("\n", " ")
    formatted_string = re.sub("\s\s+", " ", formatted_string)
    return formatted_string

    
def scrape_indeed(job_title):
    # scraping logic here
    url=f'https://www.indeed.com/jobs?q={job_title}'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    results = soup.find_all('div', class_="jobsearch-SerpJobCard")
    # create list of dictionaries (job postings)
    global job_postings
    job_postings=[]
    base_url = 'https://www.indeed.com'
    for result in results:
    
        # Retrieve the thread title
        #1. grab the url
        try:
            title = result.find('h2', class_='title')
            titles = title.a.text.replace("\n", "")
            des= result.find('div', class_='summary').ul.li.text
            des_url=title.a['href']
            
            
            new_url = base_url + des_url
            #2. visit  the new page/ #3. scrape the results
            job_response = requests.get(new_url)
            job_soup = BeautifulSoup(job_response.text, 'html.parser')
            job_results = job_soup.find('div', class_='jobsearch-jobDescriptionText')            
            full_des = job_results.text
            d = {
                'title': titles,
                'description': des,
                'full description': full_des,
                'des_url':new_url
            }
            job_postings.append(d)
        except:
            pass
        
        #4. save the result

        
    # create dataframe from list of dictionaries
    table_ready = pd.DataFrame(job_postings)
    # insert dataframe into db
    engine = create_engine(f'postgres://opwdphsvqznbup:{postgres_password}@ec2-52-23-14-156.compute-1.amazonaws.com:5432/df38j5m3da0igq')
    table_ready.to_sql('scraped jobs', engine, if_exists='append', index=False)
    # return to template
    return job_postings[:10]
#     return table_ready

def scrape_craigslist(job_title):
    # scraping logic here
    url=f'https://austin.craigslist.org/search/jjj?query={job_title}&lang=da'    
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    results = soup.find_all("a",{"class": "result-title"}) # ideed = card, cgraislist = string \
#    print(results)
    # create list of dictionaries (job postings)
    global job_postings
    job_postings=[]
    
    for result in results[:10]:
    
#         # Retrieve the thread title
#         #1. grab the url
        try:
            title = result.text #how to extract same thing from cl text
    
           
            new_url = result['href']
            #2. visit  the new page/ #3. scrape the results
            job_response = requests.get(new_url)
            job_soup = BeautifulSoup(job_response.text, 'html.parser')
            job_results = job_soup.find("section",{"id":"postingbody"})            
            full_des = job_results.text
            d = {
                'title': title,
                'full description': format_string(full_des),
                'des_url':new_url
            }
#             print(d)
#             print("----------")
            job_postings.append(d)
        except:
            pass
        
        #4. save the result
        
#     # create dataframe from list of dictionaries
    table_ready = pd.DataFrame(job_postings)
#     #insert dataframe into db
    engine = create_engine(f'postgres://opwdphsvqznbup:{postgres_password}@ec2-52-23-14-156.compute-1.amazonaws.com:5432/df38j5m3da0igq')
    table_ready.to_sql('scraped_cl', engine, if_exists='append')
#     return to template
    return job_postings[:10]
#     return table_ready
     
@app.route("/Analysis")
def Analysis():
    return render_template("Analysis.html") 

@app.route("/model",methods=["POST"])

def predict():
    global job_postings
    description=request.form['user_inputs']
    model = tf.compat.v1.keras.experimental.load_from_saved_model("model.h5", custom_objects={'KerasLayer':hub.KerasLayer})
    predict=model.predict_classes([description])
    # search_title = request.form['user_input']
    # del(session['prediction'])

    if predict[0][0] == 0:   
        print('Real')
        session['prediction']='Real'
    else:
        print('fake')
        session['prediction']='Fake'
    print(job_postings)
    return render_template('index.html',description=description,job_postings=job_postings)

if __name__ == "__main__":
    app.run(debug=True)
