# Voctractor
<center><a href="https://www.ait.ac.at/en/" ><img src="https://github.com/ChettakattuA/Voctractor/blob/main/static/Documents/logos/ait.jpg?raw=true" alt="Sample Image" width="300" height="150"></a></center>

**Copyright 2023 AIT Austrian Institute of Technology GmbH**

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Keyword Extraction using KeyBERT

Keyword Extraction is crucial for document analysis and information retrieval, providing concise representation of context and topics within textual data. Manually finding relevant keywords for numerous extensive documents is arduous, error-prone, and time-consuming. To address this challenge, we've developed a prototype leveraging KeyBERT to automate the process, utilizing BERT embeddings to efficiently extract and identify relevant terms for each document, streamlining the keyword extraction workflow.

## What is KeyBERT?

KeyBERT is a minimal and user-friendly keyword extraction technique that utilizes BERT embeddings to generate keywords and key phrases most similar to a document.
#### FYI : KeyBERT is developed by Maarten Grootendorst : https://github.com/MaartenGr/KeyBERT 

### Useful Parameters of KeyBERT

- **candidates**: Candidate keywords/keyphrases to use instead of extracting them from the document(s).
- **keyphrase_ngram_range**: Length, in words, of the extracted keywords/keyphrases.
- **stop_words**: Stopwords to remove from the document.
- **top_n**: Return the top n keywords/keyphrases.
- **min_df**: Minimum document frequency of a word across all documents.
- **use_mmr**: Whether to use Maximal Marginal Relevance (MMR) for the selection of keywords/keyphrases.
- **diversity**: The diversity of the results between 0 and 1 if `use_mmr` is set to True.

## Voctractor

We've created a prototype that processes multiple documents and a candidate list of terms for keyword extraction, resulting in three lists: 
1. Suggested Keywords 
2. Suggested Key Phrases 
3. Keywords extracted from candidates
4. Keywords from several matched custom candidate list


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

## References
- **KeyBERT** - https://maartengr.github.io/KeyBERT/
- **KeyBERT GITHUB** - https://github.com/MaartenGr/keyBERT

## Acknowledgements
<a href="https://www.ait.ac.at/en/" ><img src="https://github.com/ChettakattuA/Voctractor/blob/main/static/Documents/logos/ait.jpg?raw=true" alt="Sample Image" width="250" height="125"></a>
<a href="https://maia-project.eu/" ><img src="https://github.com/ChettakattuA/Voctractor/blob/main/static/Documents/logos/MAIA.PNG?raw=true" alt="Sample Image" width="250" height="125"></a>
<a href="https://european-union.europa.eu/index_en" ><img src="https://github.com/ChettakattuA/Voctractor/blob/main/static/Documents/logos/eu.png?raw=true" alt="Sample Image" width="250" height="125"></a>

Voctractor has been designed and developed in the MAIA project which has funding from European Union's Horizon Europe Research and Innovation programme under grant agreement No 101056935 and facilitated by numerous discussions with Kate Williamson and Sukaina Bharwani from the Stockholm Environment Institute, Andrea Geyer-Scholz from Smart Cities Consulting and Marcelo Rita-Pias from the Federal University of Rio Grande -FURG, Brazil. 

## Contact Details
- The project is developed by 
**Aradina Chettakattu Msc,**
**Austrian Institute of Technology**
email: aradina.chettakattu@ait.ac.at

- Under the supervision of 
**Dr Denis Havlik,**
**Austrian Institute of Technology**
email: denis.havlik@ait.ac.at
