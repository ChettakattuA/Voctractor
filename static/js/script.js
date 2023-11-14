$(document).ready(function () {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'none';
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();

        
        const pdfFiles= document.getElementById('pdfUpload').files;
        const stopwords= document.getElementById('stopwordsInput').value;
        const ExcelFile= document.querySelector('input[name="excelUpload"]:checked').value;
        const No_of_Words= document.getElementById('numberOfKeywords').value;
        const Diversity= document.getElementById('diversityBetweenWords').value;
        
        loadingDiv.style.display = 'block';
        sendFilesAndUrlsToServer(pdfFiles, stopwords, ExcelFile,No_of_Words,Diversity);
    })

    function sendFilesAndUrlsToServer(pdfFiles, stopwords, ExcelFile,No_of_Words,Diversity) {
        const formData = new FormData();
        for (const file of pdfFiles) {
            formData.append('file_paths', file);
        }

        formData.append("StopwordsByUser", stopwords);
        formData.append("TopNByUser", No_of_Words);
        formData.append("DiversityByUser", Diversity);
        formData.append('excelfile', ExcelFile);
        // Send a POST request to the server
        fetch('/process_documents', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the processing results
            displayResults(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }


    function displayResults(results) {
        loadingDiv.style.display = 'none';
        // Get the results container element
        document.getElementById("gettingStartedContainer").style.display = "none";
        document.getElementById("accordionResults").style.display = "block";
        const SuggestedKeywordsCard = document.getElementById('SuggestedKeywords');
        SuggestedKeywordsCard.style.display = "block";
        SuggestedKeywordsCard.innerHTML = '';
        const suggestedKeywordsHeader = document.createElement('div');
        suggestedKeywordsHeader.classList.add('card-header');
        suggestedKeywordsHeader.innerHTML = 'Suggested Keywords';
        SuggestedKeywordsCard.appendChild(suggestedKeywordsHeader);

        const suggestedKeywordslist = document.createElement('ul');
        suggestedKeywordslist.classList.add('list-group','list-group-flush');
        SuggestedKeywordsCard.appendChild(suggestedKeywordslist);

        
        for (const result of results){
            
            for (const keyword of result.keywords) {
                
                const suggestedKeywordssublist = document.createElement('li');
                suggestedKeywordssublist.classList.add('list-group-item','d-flex', 'justify-content-between', 'align-items-center');
                const keywordText = document.createTextNode(keyword[0]+" : "+keyword[1]);

                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('d-flex', 'align-items-center');

                const button1 = document.createElement('button');
                button1.textContent = '✘';
                button1.classList.add('btn', 'btn-danger', 'mr-2'); // Add margin to the right

                const button2 = document.createElement('button');
                button2.textContent = '✓';
                button2.classList.add('btn', 'btn-success');

                // Append the elements to the list item
                buttonsContainer.appendChild(button1);
                buttonsContainer.appendChild(button2);

                suggestedKeywordssublist.appendChild(keywordText);
                suggestedKeywordssublist.appendChild(buttonsContainer);

                suggestedKeywordslist.appendChild(suggestedKeywordssublist);

                
                
            }
        }
        
        const SuggestedKeyPhrasesCard = document.getElementById('SuggestedKeyphrases');
        SuggestedKeyPhrasesCard.style.display = "block";
        SuggestedKeyPhrasesCard.innerHTML = "";
        const suggestedKeyPhrasesheader = document.createElement('div');
        suggestedKeyPhrasesheader.classList.add('card-header');
        suggestedKeyPhrasesheader.innerHTML = 'Suggested Key Phrases';
        SuggestedKeyPhrasesCard.appendChild(suggestedKeyPhrasesheader);

        const SuggestedKeyPhraseslist = document.createElement('ul');
        SuggestedKeyPhraseslist.classList.add('list-group','list-group-flush');
        SuggestedKeyPhrasesCard.appendChild(SuggestedKeyPhraseslist);

        
        for (const result of results){
            for (const keyword of result.keyphrases) {
                
                const SuggestedKeyPhrasessublist = document.createElement('li');
                SuggestedKeyPhrasessublist.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                const keywordText = document.createTextNode(keyword[0]+" : "+keyword[1]);

                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('d-flex', 'align-items-center');

                const button1 = document.createElement('button');
                button1.textContent = '✘';
                button1.classList.add('btn', 'btn-danger', 'mr-2'); // Add margin to the right

                const button2 = document.createElement('button');
                button2.textContent = '✓';
                button2.classList.add('btn', 'btn-success');

                // Append the elements to the list item
                buttonsContainer.appendChild(button1);
                buttonsContainer.appendChild(button2);

                SuggestedKeyPhrasessublist.appendChild(keywordText);
                SuggestedKeyPhrasessublist.appendChild(buttonsContainer);

                SuggestedKeyPhraseslist.appendChild(SuggestedKeyPhrasessublist);
                
            }
        }

        const CandidateKeywordsCard = document.getElementById('CandidateKeywords');
        CandidateKeywordsCard.style.display = "block";
        CandidateKeywordsCard.innerHTML = "";
        const CandidateKeywordsHeader = document.createElement('div');
        CandidateKeywordsHeader.classList.add('card-header');
        CandidateKeywordsHeader.innerHTML = 'Keywords from Candidates';
        CandidateKeywordsCard.appendChild(CandidateKeywordsHeader);

        const CandidateKeywordslist = document.createElement('ul');
        CandidateKeywordslist.classList.add('list-group','list-group-flush');
        CandidateKeywordsCard.appendChild(CandidateKeywordslist);

        
        for (const result of results){
            for (const keyword of result.KeywordsFromCandidates) {
                
                const CandidateKeywordssublist = document.createElement('li');
                CandidateKeywordssublist.classList.add('list-group-item','d-flex', 'justify-content-between', 'align-items-center');
                const keywordText = document.createTextNode(keyword[0]+" : "+keyword[1]);

                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('d-flex', 'align-items-center');

                const button1 = document.createElement('button');
                button1.textContent = '✘';
                button1.classList.add('btn', 'btn-danger', 'mr-2'); // Add margin to the right

                const button2 = document.createElement('button');
                button2.textContent = '✓';
                button2.classList.add('btn', 'btn-success');

                // Append the elements to the list item
                buttonsContainer.appendChild(button1);
                buttonsContainer.appendChild(button2);

                CandidateKeywordssublist.appendChild(keywordText);
                CandidateKeywordssublist.appendChild(buttonsContainer);

                CandidateKeywordslist.appendChild(CandidateKeywordssublist);
                
            }
        }


        //Highlight Text 
        const TextCard = document.getElementById('HighlightedText');
        TextCard.style.display = "block";
        for (const result of results){
            var textContent = result.pdftext;
            var allkeywords = result.AllKeywordstoHighlight;
            // Iterate through the keywords list
            for (const keywordarray of result.keywords){
                const keyword = keywordarray[0];
                // Create a regular expression to find the keyword with word boundaries
                var regex = new RegExp("\\b" + keyword + "\\b", "gi");

                // Replace the keyword with the same keyword wrapped in a <span> for highlighting
                textContent = textContent.replace(regex, '<span class="highlightedG">' + keyword + '</span>');
            }
            for (const keywordarray of result.keyphrases){
                const keyword = keywordarray[0];
                // Create a regular expression to find the keyword with word boundaries
                var regex = new RegExp("\\b" + keyword + "\\b", "gi");

                // Replace the keyword with the same keyword wrapped in a <span> for highlighting
                textContent = textContent.replace(regex, '<span class="highlightedB">' + keyword + '</span>');
            }
            for (const keywordarray of result.KeywordsFromCandidates){
                const keyword = keywordarray[0];
                // Create a regular expression to find the keyword with word boundaries
                var regex = new RegExp("\\b" + keyword + "\\b", "gi");

                // Replace the keyword with the same keyword wrapped in a <span> for highlighting
                textContent = textContent.replace(regex, '<span class="highlightedP">' + keyword + '</span>');
            }
            // Update the element's content with the highlighted text
            TextCard.innerHTML = "<h3>Highlighted Keywords on text</h3> <b>(<span class='highlightedG'>Green: Suggested Keywords</span>,<span class='highlightedB'> Blue: Suggested KeyPhrases</span>, <span class='highlightedP'> Pink: Candidate Keywords</span>)</b><br><br>"+textContent;

        }

        //Highlight Text 
        // const TextCard = document.getElementById('HighlightedText');
        // TextCard.style.display = "block";
        // const Heading = document.createElement("h3");
        // Heading.innerHTML = "HighLighted Keyowrds on Text"
        // TextCard.appendChild(Heading)
        // const options = ["Suggested Keywords", "Suggested Keyphrases", "Keywords from Candidate"];

        // options.forEach((option, index) => {
        //     const radioButton = document.createElement("input");
        //     radioButton.type = "radio";
        //     radioButton.id = "option" + (index + 1);
        //     radioButton.name = "options";
        //     radioButton.value = option;
        //     TextCard.appendChild(radioButton);

        //     const label = document.createElement("label");
        //     label.htmlFor = "option" + (index + 1);
        //     label.textContent = " "+option+" ";
        //     TextCard.appendChild(label);
            
        //     const body = document.createElement("div");
        //     TextCard.appendChild(body)
        //     // Add click event listener to each radio button
        //     radioButton.addEventListener("click", () => {
        //         const clickedId = radioButton.id;
        //         console.log(clickedId)
        //         switch (clickedId){
        //             case "option1":
        //                 for (const result of results){
        //                     var textContent = result.pdftext;
        //                     for (const keywordarray of result.keywords){
        //                         const keyword = keywordarray[0];
        //                         // Create a regular expression to find the keyword with word boundaries
        //                         var regex = new RegExp("\\b" + keyword + "\\b", "gi");
                
        //                         // Replace the keyword with the same keyword wrapped in a <span> for highlighting
        //                         textContent = textContent.replace(regex, '<span class="highlightedG">' + keyword + '</span>');
        //                         body.innerHTML = textContent;
        //                     }
        //                 }
                        
        //                 break;
        //             case "option2":

        //                 for (const result of results){
        //                     var textContent = result.pdftext;
        //                     for (const keywordarray of result.keyphrases){
        //                         const keyword = keywordarray[0];
        //                         // Create a regular expression to find the keyword with word boundaries
        //                         var regex = new RegExp("\\b" + keyword + "\\b", "gi");
                
        //                         // Replace the keyword with the same keyword wrapped in a <span> for highlighting
        //                         textContent = textContent.replace(regex, '<span class="highlightedB">' + keyword + '</span>');
        //                         body.innerHTML = textContent;
        //                     }
        //                 }
        //                 break;

        //             case "option3":

        //                 for (const result of results){
        //                     var textContent = result.pdftext;
        //                     for (const keywordarray of result.KeywordsFromCandidates){
        //                         const keyword = keywordarray[0];
        //                         // Create a regular expression to find the keyword with word boundaries
        //                         var regex = new RegExp("\\b" + keyword + "\\b", "gi");
                
        //                         // Replace the keyword with the same keyword wrapped in a <span> for highlighting
        //                         textContent = textContent.replace(regex, '<span class="highlightedP">' + keyword + '</span>');
        //                         body.innerHTML = textContent;
        //                     }
        //                 }
        //                 break;
        //             default:
        //                 for (const result of results){
        //                     var textContent = result.pdftext;
        //                     body.innerHTML = textContent;
        //                 }
        //         }
        //     });
        // });



    }

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-danger')) {
            // Get the <li> element containing the keyword
            const listItem = event.target.closest('li');

            if (listItem) {
                // Extract the keyword from the text content of the <li> element
                var keyword = listItem.textContent.trim();
                keywordSplit = keyword.split(":");
                keyword = keywordSplit[0];
                // Send an HTTP POST request to your Python backend
                fetch('/add_stopword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ keyword: keyword }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const Alert = document.getElementById('alert');
                        Alert.innerText = data.message;
                        Alert.classList.add('alert-success');
                        Alert.style.display = 'block';
                        updateStopwords();
                    } else {
                        // Handle errors and display the error message in the Bootstrap alert
                        const Alert = document.getElementById('alert');
                        Alert.innerText = data.error;
                        Alert.classList.add('alert-danger');
                        Alert.style.display = 'block';
                    }
                })
                
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-success')) {
            // Get the <li> element containing the keyword
            const listItem = event.target.closest('li');

            if (listItem) {
                // Extract the keyword from the text content of the <li> element
                var keyword = listItem.textContent.trim();
                keywordSplit = keyword.split(":");
                keyword = keywordSplit[0];
                // Send an HTTP POST request to your Python backend
                fetch('/add_candidate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ keyword: keyword }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const Alert = document.getElementById('alert');
                        Alert.innerText = data.message;
                        Alert.classList.add('alert-success');
                        Alert.style.display = 'block';
                        updateStopwords();
                    } else {
                        // Handle errors and display the error message in the Bootstrap alert
                        const Alert = document.getElementById('alert');
                        Alert.innerText = data.error;
                        Alert.classList.add('alert-danger');
                        Alert.style.display = 'block';
                    }
                })
                
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    });
});
