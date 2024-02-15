from flask import Flask, render_template, request, jsonify,g
from werkzeug.utils import secure_filename
import os
from keybert import KeyBERT
from keyphrase_vectorizers import KeyphraseCountVectorizer
from PyPDF2 import PdfReader
import pandas as pd
from pdfquery import PDFQuery


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['CANDIDATE_FOLDER'] = 'static/Candidates'

global Final_stopwords
Final_stopwords= []

@app.route('/')
def index():
    files = [f for f in os.listdir(app.config['CANDIDATE_FOLDER']) if os.path.isfile(os.path.join(app.config['CANDIDATE_FOLDER'], f))]
    files.sort()
    
    return render_template('index.html',files=files)

# @app.route('/candidates_management')
# def candidatespage():
#     files = [f for f in os.listdir(app.config['CANDIDATE_FOLDER']) if os.path.isfile(os.path.join(app.config['CANDIDATE_FOLDER'], f))]
#     first_file = files[0]
#     return render_template('candidates.html',files=files,first_file = first_file)

@app.route('/create_candidates_list', methods=['POST'])
def create_candidates_list():
######  NEW CANDIDATE FILE ######
    newCandidateName = request.form.get("newCandidateName")
    newCandidateOrg = request.form.get("newCandidateOrg")
    if len(newCandidateName) != 0 and len(newCandidateOrg) != 0:
        NewCandidateListFile = f"{newCandidateName}_({newCandidateOrg})"
        NewCandidateListFile = NewCandidateListFile.replace(" ", "_")
        candidatefilename = f"{NewCandidateListFile}.txt"
        file_path = os.path.join(app.config['CANDIDATE_FOLDER'], candidatefilename)
        with open(file_path, 'w'):
            pass  

        files = [f for f in os.listdir(app.config['CANDIDATE_FOLDER']) if os.path.isfile(os.path.join(app.config['CANDIDATE_FOLDER'], f))]
        files.sort()
        return jsonify(success=True, message=f"{candidatefilename} added to candidate list successfully",files=files)
    else:
        return jsonify(success=False, error="New candidate name or organization is missing",files=files)

@app.route('/get_stopwords')
def get_stopwords():
    global Final_stopwords
    Final_stopwords = load_stopwords() 
    return jsonify(stopwords=Final_stopwords)

# New route to process documents and extract keywords
@app.route('/process_documents', methods=['POST'])
def process_documents():
    global Final_stopwords
    results = []
    Final_stopwords = list(filter(None, Final_stopwords))

    model = request.form.get("model")

    #####   ADD NEW STOP WORDS #####
    stopwordsFromUser = request.form.get("StopwordsByUser")
    stopwordsFromUser = stopwordsFromUser.split(",")
    if stopwordsFromUser[0]!='':
        for word in stopwordsFromUser:
            Final_stopwords.append(word)

    #####   DELETE STOP WORDS #####
    stopwordsDelete = request.form.get("StopwordsDelete")
    stopwordsDelete = stopwordsDelete.split(",")
    if stopwordsDelete[0]!='':
        for word in stopwordsDelete:
            Final_stopwords.remove(word)
    editStopwordFile(Final_stopwords)

    ######  TOTAL NUMBER ABD DIVERSITY BETWEEN WORDS ######
    topN = request.form.get("TopNByUser")
    Diversity = request.form.get("DiversityByUser")
    # Frequency = request.form.get("FrequencyByUser")
   
    folder_path = "static/Candidates"  # Update this with your folder path
    CandidateFiles = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    
    #####   Taxonomy Processing ######
    ExcelFile = request.form.get("excelfile")
    if ExcelFile:
        df = pd.read_excel(ExcelFile)
        # Ensure that the DataFrame has the 'keywords' column
        if 'keywords' in df.columns:
            # Extract the 'keywords' column and convert it to a list
            taxonomy_keywords = df.iloc[:, 0].tolist()
            taxonomy_keywords = [word.lower() for word in taxonomy_keywords] 
            taxonomy_keywords = list(set(taxonomy_keywords)-set(Final_stopwords))
        else:
            print("The 'keywords' column does not exist in the Excel file.")

    
    #kw_model = KeyBERT(model="multi-qa-mpnet-base-cos-v1")
    kw_model = KeyBERT(model=model)
    for file in request.files.getlist('file_paths'):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            pdfText = extract_text(file_path)
            Results = FindKeywords(filename,results,pdfText,Final_stopwords,taxonomy_keywords,int(topN),float(Diversity),CandidateFiles, kw_model)

    return jsonify(Results)

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
            editStopwordFile(Final_stopwords)
            return jsonify(success=True,message=f"{keyword} Added To Stopwords Successfully")
        else:
            return jsonify(success=False, error="Keyword Not Found")

@app.route('/add_candidate', methods=['POST'])
def add_candidate():
    if request.method == 'POST':
        data = request.get_json()
        keyword = data.get('keyword')
        file = data.get('file')

       
        if keyword and file:
            add_candidatesToFile(keyword,file)
            return jsonify(success=True,message=f"{keyword} Added To {file} list Successfully")
        else:
            return jsonify(success=False, error="Keyword Not Found")
        
@app.route('/rm_candidate', methods=['POST'])
def rm_candidatesFromFile():
    if request.method == 'POST':
        data = request.get_json()
        keyword = data.get('keyword')
        file = data.get('file')

        if keyword and file:
            rm_candidatesFromFile(keyword,file)
            return jsonify(success=True,message=f"{keyword} removed from {file} list Successfully")
        else:
            return jsonify(success=False, error="Keyword Not Found")
        
def load_stopwords():
    global Final_stopwords
    Final_stopwords = []
    file_path = os.path.join(app.root_path, 'static', 'stopwords.txt')
    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        with open(file_path, 'r') as file:
            for line in file:
                Final_stopwords.append(line.strip())  # Remove newline characters                
        Final_stopwords = list(set(Final_stopwords))  
        Final_stopwords = sorted(Final_stopwords)    
    else:
        Final_stopwords = ['the','and','of','to','in','a','is','that','it','for']

    return Final_stopwords

def extract_text(file_path):
        pdf = PDFQuery(file_path)
        pdf.load()

        # Use CSS-like selectors to locate the elements
        text_elements = pdf.pq('LTTextLineHorizontal')

        # Extract the text from the elements
        text = [t.text.strip() for t in text_elements if t.text.strip()]
        result_string = ' '.join(text)
        return result_string
    
def FindKeywords(filename,results,pdfText,Final_stopwords,taxonomy_keywords,topN,Diversity,CandidateFiles,  kw_model): 

        # #################################FIND KEY WORDS FROM CANDIDATE LISTS ############################################
        CandidateStopwords=[]
        CandidateMatchedKeywords = []
        if CandidateFiles[0] == "----------- Select --------------" :
            CandidateFiles.pop(0)
        for file in CandidateFiles:
            file_path = os.path.join(app.config['CANDIDATE_FOLDER'], file)
            with open(file_path, 'r') as file:
                CandidatesFromTxt = [line.strip() for line in file]
                CandidateStopwords.append(CandidatesFromTxt)
            KeywordsFromCandidatesTXT = kw_model.extract_keywords(pdfText,  keyphrase_ngram_range=(1,10),top_n=topN,candidates=CandidatesFromTxt,stop_words=Final_stopwords)
            CandidateMatchedKeywords.append(KeywordsFromCandidatesTXT)

        # #################################FIND KEYWORDS FROM TAXONOMY OR EXCEL############################################
        CandidateStopwords = [word for sublist in CandidateStopwords for word in sublist]
        Stopwords = Final_stopwords + CandidateStopwords
        Stopwords = list(set(Stopwords))
        FinalKeywordsFromTaxonomy=[]
        MatchedKeywordsFromTaxonomy = []
        taxonomyCandidates = [item for item in taxonomy_keywords if item not in Stopwords]
        if len(taxonomyCandidates)>100:
            split_candidates = [taxonomyCandidates[i:i + 100] for i in range(0, len(taxonomyCandidates), 100)]
            for candidate in split_candidates:
                CandidateKeywords = kw_model.extract_keywords(pdfText,  keyphrase_ngram_range=(1,10),top_n=topN,candidates=candidate)
                if not CandidateKeywords == []:
                    MatchedKeywordsFromTaxonomy.append(CandidateKeywords)
            for sublist in MatchedKeywordsFromTaxonomy:
                for word, score in sublist:
                    if score >=0.1:
                        FinalKeywordsFromTaxonomy.append((word, score))            
        else:
            MatchedKeywordsFromTaxonomy = kw_model.extract_keywords(pdfText,  keyphrase_ngram_range=(1,10),top_n=topN,candidates=taxonomyCandidates)
            for sublist in MatchedKeywordsFromTaxonomy:
                word, score = sublist
                if score >=0.1:
                    FinalKeywordsFromTaxonomy.append((word, score))
        FinalKeywordsFromTaxonomy = list(set(FinalKeywordsFromTaxonomy))
        FinalKeywordsFromTaxonomy = sorted(FinalKeywordsFromTaxonomy, key=lambda x: float(x[1]), reverse=True)

        # #################################  FIND KEYWORDS #################################################################
        StopwordsFromTaxonomy = [word for sublist in FinalKeywordsFromTaxonomy for word in sublist  if isinstance(word, str)]
        Stopwords = Final_stopwords + CandidateStopwords + StopwordsFromTaxonomy
        Stopwords = list(set(Stopwords))
        keywords = kw_model.extract_keywords(pdfText, keyphrase_ngram_range=(1, 1), top_n=topN, use_mmr=True, diversity=Diversity, stop_words = Stopwords)
        
        # #################################FIND KEY PHRASES ################################################################
        keyphrases = kw_model.extract_keywords(pdfText, vectorizer=KeyphraseCountVectorizer() , top_n=topN, use_mmr=True, diversity=Diversity, stop_words=Stopwords)    ### check it out!!!
        
        

        CandidateFiles.insert(0,"----------- Select --------------")
        results.append({
                'filename' : filename,
                'keywords' : keywords,
                'keyphrases': keyphrases,
                'FinalKeywordsFromTaxonomy': FinalKeywordsFromTaxonomy[:topN],
                'CandidateMatchedKeywords' : CandidateMatchedKeywords,
                'pdftext' : pdfText,
                'CandidateFiles' : CandidateFiles
            })
        
        return results

def editStopwordFile(Final_stopwords):
    Final_stopwords = sorted(list(set(Final_stopwords)))
    with open('static/stopwords.txt', 'w') as file:
        pass
    
        # Write the string to a text file
    with open('static/stopwords.txt', 'w') as file:
        for word in Final_stopwords:
            if word != "":
                file.write(word+ "\n")

def add_candidatesToFile(keyword,file):
    candidatefilename = file+".txt"
    file_path = os.path.join(app.config['CANDIDATE_FOLDER'], candidatefilename)
    with open(file_path, 'r') as file:
        words = [line.strip() for line in file]
    words.append(keyword)  
    words = list(set(words))   
           
    with open(file_path, 'w') as txtfile:
        for word in words:
            txtfile.write(word + '\n')

def rm_candidatesFromFile(keyword,file):
    file_path = os.path.join(app.config['CANDIDATE_FOLDER'], file)

    with open(file_path, 'r') as file:
        words = [line.strip() for line in file]

    if keyword in words:
        words.remove(keyword)
    words = list(set(words))   

    with open(file_path, 'w') as txtfile:
        for word in words:
            txtfile.write(word + '\n')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
