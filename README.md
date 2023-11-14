# Keyword Extraction using KeyBERT

⚠️**Project Rights: This project is the intellectual property of AIT and was developed within the context of the EU funded climate project MAIA+.**

Keyword Extraction is crucial for document analysis and information retrieval, providing concise representation of context and topics within textual data. Manually finding relevant keywords for numerous extensive documents is arduous, error-prone, and time-consuming. To address this challenge, we've developed a prototype leveraging KeyBERT to automate the process, utilizing BERT embeddings to efficiently extract and identify relevant terms for each document, streamlining the keyword extraction workflow.

## What is KeyBERT?

KeyBERT is a minimal and user-friendly keyword extraction technique that utilizes BERT embeddings to generate keywords and key phrases most similar to a document.

### Useful Parameters of KeyBERT

- **candidates**: Candidate keywords/keyphrases to use instead of extracting them from the document(s).
- **keyphrase_ngram_range**: Length, in words, of the extracted keywords/keyphrases.
- **stop_words**: Stopwords to remove from the document.
- **top_n**: Return the top n keywords/keyphrases.
- **min_df**: Minimum document frequency of a word across all documents.
- **use_mmr**: Whether to use Maximal Marginal Relevance (MMR) for the selection of keywords/keyphrases.
- **diversity**: The diversity of the results between 0 and 1 if `use_mmr` is set to True.

## Voctractor?

We've created a prototype that processes multiple documents and a candidate list of terms for keyword extraction, resulting in three lists: 
1. Suggested Keywords 
2. Suggested Key Phrases 
3. Keywords extracted from candidates

Additionally, the extracted keywords are highlighted within the document text for easy reference.

### User Interaction

For user convenience, there are cross and check buttons against each list. 
- Clicking the cross button adds the term to the `stopword.txt` file, indicating it as a term to ignore in future extractions.
- Clicking the check button adds the term to a `candidates.txt` file for potential future use.

## Important Terms

1. **Stopword Text File**: Contains terms to be ignored in future keyword searches across all documents.
2. **Candidate Text File**: Stores relevant terms for efficient keyword retrieval and production of relevant keyword lists.
3. **Diversity**: Utilized in KeyBERT using Maximal Marginal Relevance (MMR) for varied keyword selection.

## Inputs

1. A pdf document (mandatory)
2. A stop word list (optional)
3. Candidate keywords (mandatory)

## Results

The output will consist of:

1. Suggested keywords
2. Suggested key phrases
3. Keywords from candidates
4. Highlighted text representation of keywords in the document

## Calculation of Results

- **Suggested Keywords**: Calculated using cosine similarity between word embeddings and document embeddings. Words with the highest similarity scores are displayed.
- **Suggested Phrases**: Similar to suggested keywords but considers multi-word phrases.
- **Keywords from Candidates**: Cosine similarity between each word in the candidate list and document embeddings, displaying words above a score of 0.1.


## Contact Details
- The project is authored by 
Aradina Chettakattu Msc
Austrian Institute of Technology
email: aradina.chettakattu@ait.ac.at

- Under the supervision of 
