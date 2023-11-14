# Voctractor
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

## References
- **KeyBERT** - https://maartengr.github.io/KeyBERT/
- **KeyBERT GITHUB** - https://github.com/MaartenGr/keyBERT

## Acknowledgements
![Sample Image](data:image/png;base64,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)
Voctractor has been designed and developed in the MAIA project which has funding from European Union's Horizon Europe Research and Innovation programme under grant agreement No 101056935 and facilitated by numerous discussions with Kate Williamson and Sukaina Bharwani from the Stockholm Environment Institute, Andrea Geyer-Scholz from Smart Cities Consulting and Marcelo Rita-Pias from the Federal University of Rio Grande -FURG, Brazil. 

## Contact Details
- The project is authored by 
**Aradina Chettakattu Msc,**
**Austrian Institute of Technology**
email: aradina.chettakattu@ait.ac.at

- Under the supervision of 
**Dr Denis Havlik,**
**Austrian Institute of Technology**
email: denis.havlik@ait.ac.at
