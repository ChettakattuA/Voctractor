"""
Copyright 2023 AIT Austrian Institute of Technology GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
from keybert import KeyBERT
from PyPDF2 import PdfReader
import pandas as pd


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

global Final_stopwords, FinalKeywordsFromCandidates
Final_stopwords= []
FinalKeywordsFromCandidates = []
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_stopwords')
def get_stopwords():
    global Final_stopwords
    Final_stopwords = []
    file_path = os.path.join(app.root_path, 'static', 'stopwords.txt')
    with open(file_path, 'r') as file:
        for line in file:
            Final_stopwords.append(line.strip())  # Remove newline characters                
    Final_stopwords = list(set(Final_stopwords))  
    Final_stopwords = sorted(Final_stopwords)    
    return jsonify(stopwords=Final_stopwords)

# New route to process documents and extract keywords
@app.route('/process_documents', methods=['POST'])
def process_documents():
    global Final_stopwords
    Final_stopwords = list(filter(None, Final_stopwords))
    stopwordsFromUser = request.form.get("StopwordsByUser")
    stopwordsFromUser = stopwordsFromUser.split(",")
    for word in stopwordsFromUser:
        Final_stopwords.append(word)
    add_stopwordToFile(Final_stopwords)
    topN = request.form.get("TopNByUser")
    Diversity = request.form.get("DiversityByUser")
    ExcelFile = request.form.get("excelfile")
    if ExcelFile:
        df = pd.read_excel(ExcelFile)
        # Ensure that the DataFrame has the 'keywords' column
        if 'keywords' in df.columns:
            # Extract the 'keywords' column and convert it to a list
            candidate_keywords = df.iloc[:, 0].tolist()
            candidate_keywords = [word.lower() for word in candidate_keywords] 
        else:
            print("The 'keywords' column does not exist in the Excel file.")

    for file in request.files.getlist('file_paths'):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            pdfText = extract_text(file_path)
            Results = FindKeywords(pdfText,Final_stopwords,candidate_keywords,int(topN),float(Diversity))

    return jsonify(Results)
def extract_text(file_path):
        text=""
        pdf_reader = PdfReader(file_path)
        for page in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page].extract_text()
        return text
    
def FindKeywords(pdfText,Final_stopwords,candidate_keywords,topN,Diversity): 
        global FinalKeywordsFromCandidates
        candidate_keywords = list(set(candidate_keywords)-set(Final_stopwords))
        results=[]
        kw_model = KeyBERT()
        # #################################FIND KEYWORDS############################################
        keywords = kw_model.extract_keywords(pdfText, keyphrase_ngram_range=(1, 1), top_n=topN, use_mmr=True, diversity=Diversity, stop_words=Final_stopwords)
        # #################################FIND KEY PHRASES ############################################
        keyphrases = kw_model.extract_keywords(pdfText, keyphrase_ngram_range=(1, 3), top_n=topN, use_mmr=True, diversity=Diversity, stop_words=Final_stopwords)
        # #################################FIND KEYWORDS FROM TAXONOMY OR EXCEL############################################
        KeywordsFromCandidates = []
        if len(candidate_keywords)>100:
            split_candidates = [candidate_keywords[i:i + 100] for i in range(0, len(candidate_keywords), 100)]
            for candidate in split_candidates:
                CandidateKeywords = kw_model.extract_keywords(pdfText,  keyphrase_ngram_range=(1,4),top_n=topN,candidates=candidate)
                if not CandidateKeywords == []:
                    KeywordsFromCandidates.append(CandidateKeywords)
            for sublist in KeywordsFromCandidates:
                for word, score in sublist:
                    if score >=0.1:
                        FinalKeywordsFromCandidates.append((word, score))
        else:
            KeywordsFromCandidates = kw_model.extract_keywords(pdfText,  keyphrase_ngram_range=(1,10),top_n=topN,candidates=candidate_keywords,stop_words=Final_stopwords)
            for sublist in KeywordsFromCandidates:
                word, score = sublist
                if score >=0.1:
                    FinalKeywordsFromCandidates.append((word, score))
        FinalKeywordsFromCandidates = list(set(FinalKeywordsFromCandidates))
        FinalKeywordsFromCandidates = sorted(FinalKeywordsFromCandidates, key=lambda x: float(x[1]), reverse=True)
        # add_candidatesToFile(FinalKeywordsFromCandidates)
        keyphrases= list(set(keyphrases)-set(Final_stopwords))
        results.append({
                'keywords' : keywords,
                'keyphrases': keyphrases,
                'KeywordsFromCandidates': FinalKeywordsFromCandidates[:topN],
                'pdftext' : pdfText
            })
        
        return results

def add_stopwordToFile(Final_stopwords):
    with open('static/stopwords.txt', 'w') as file:
        pass
    
        # Write the string to a text file
    with open('static/stopwords.txt', 'w') as file:
        for word in Final_stopwords:
            if word != "":
                file.write(word+ "\n")

def add_candidatesToFile(CandidateKeys):
    with open('static/candidate.txt', 'a') as file:
            file.write(CandidateKeys+ "\n")
        # for word in CandidateKeys:
            
        #     if isinstance(word, str):
        #         file.write(word+ "\n")
        #     else: 
        #         file.write(word[0]+ "\n")
           

@app.route('/add_stopword', methods=['POST'])
def add_stopword():
    global Final_stopwords
    if request.method == 'POST':
        data = request.get_json()
        keyword = data.get('keyword')

        if keyword:
            # Add the keyword to the list of stopwords
            keyword = keyword.split(",")[0]
            Final_stopwords.append(keyword)
            add_stopwordToFile(Final_stopwords)
            return jsonify(success=True,message="Keyword Added To Stopwords Successfully")
        else:
            return jsonify(success=False, error="Keyword Not Found")

@app.route('/add_candidate', methods=['POST'])
def add_candidate():
    if request.method == 'POST':
        data = request.get_json()
        keyword = data.get('keyword')

        if keyword:
            # Add the keyword to the list of stopwords
            keyword = keyword.split(",")[0]
            add_candidatesToFile(keyword)
            return jsonify(success=True,message="Keyword Added To Candidate.txt Successfully")
        else:
            return jsonify(success=False, error="Keyword Not Found")
        
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
