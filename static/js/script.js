$(document).ready(function () {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'none';

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();

        
        const pdfFiles = document.getElementById('pdfUpload').files;
        const model = document.getElementById('EmbedModel').value;
        const stopwords= document.getElementById('stopwordsInput').value;
        const stopwordsDelete= document.getElementById('stopwordsDelete').value;
        const ExcelFile= document.querySelector('input[name="excelUpload"]:checked').value;
        const newCandidateName= document.getElementById('CandidateListName').value;
        const newCandidateOrg= document.getElementById('CandidateListOrg').value;
        const No_of_Words= document.getElementById('numberOfKeywords').value;
        const Diversity= document.getElementById('diversityBetweenWords').value;
               
        loadingDiv.style.display = 'block';
        sendFilesAndUrlsToServer(pdfFiles,model, stopwords,stopwordsDelete, ExcelFile,newCandidateName,newCandidateOrg,No_of_Words,Diversity);
    })

    function sendFilesAndUrlsToServer(pdfFiles, model, stopwords,stopwordsDelete, ExcelFile,newCandidateName,newCandidateOrg,No_of_Words,Diversity) {
        const formData = new FormData();
        for (const file of pdfFiles) {
            formData.append('file_paths', file);
        }

        formData.append("model", model);
        formData.append("StopwordsByUser", stopwords);
        formData.append("StopwordsDelete", stopwordsDelete);
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
        // FinalResults = document.getElementById("content");
        // // FinalResults = document.getElementById("accordionResults");
        // FinalResults.style.display = "block";
        

        const contentDiv = document.getElementById('content');


        const buttonClearAll =  document.createElement('button');
        buttonClearAll.textContent = 'Clear all results';
        buttonClearAll.classList.add('btn', 'btn-warning','mr-2');

        // Positioning the button in the top-right corner
        // buttonClearAll.style.position = 'absolute';
        buttonClearAll.style.width = '100%'; // Adjust as needed

        buttonClearAll.addEventListener('click', function() {
            const confirmation = window.confirm(`Do you want to clear all results from screen. This action cannot be undone`);
            if (confirmation){
                contentDiv.remove();
                document.getElementById("gettingStartedContainer").style.display = "block";
            }
        });

        // contentDiv.appendChild(buttonClearAll);


        results.forEach(result => {
            createCard(result, contentDiv);
          });

        
    }

    function createCard(result, contentDiv) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = result.filename;
      
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center');
      
        const text = document.createElement('h5');
        text.textContent = `File: ${result.filename}`;
        text.style.fontWeight = 'bold';

        const HeaderbuttonsContainer = document.createElement('div');
        HeaderbuttonsContainer.classList.add('d-flex', 'align-items-center');

        const buttonDltRes = document.createElement('button');
        buttonDltRes.textContent = 'x';
        buttonDltRes.classList.add('btn', 'btn-danger','mr-2');

        buttonDltRes.addEventListener('mouseenter', function() {
            buttonDltRes.textContent = 'Clear result from screen';
        });
        buttonDltRes.addEventListener('mouseleave', function() {
            buttonDltRes.textContent = 'x';
        });

        buttonDltRes.addEventListener('click', function() {
            const confirmation = window.confirm(`Do you want to remove result "${result.filename}" from screen. This action cannot be undone`);
            if (confirmation){
                DltCard = document.getElementById(result.filename);
                DltCard.remove();
            }
        });
      
        const buttonExpand = document.createElement('button');
        buttonExpand.textContent = '+';
        buttonExpand.classList.add('btn', 'btn-secondary');
        buttonExpand.setAttribute('aria-expanded', 'false');
        buttonExpand.setAttribute('aria-controls', `definition_${result.filename.replace(/\s/g, '_')}`);
        
                 
        const definition = document.createElement('p');
        definition.style.display = 'none';
        definition.setAttribute('id', `definition_${result.filename.replace(/\s/g, '_')}`);
        
        const keywordList = document.createElement('ul');
        keywordList.classList.add('list-group', 'list-group-flush');
        const keyPhrasesList = document.createElement('ul');
        keyPhrasesList.classList.add('list-group', 'list-group-flush');
        const candidateList = document.createElement('ul');
        candidateList.classList.add('list-group', 'list-group-flush');

        
        const staticKeyword = document.createElement('li');
        staticKeyword.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        staticKeyword.innerHTML = '<h5><b>Suggested Keywords</b></h5>';
    
        const staticKeyPhrases = document.createElement('li');
        staticKeyPhrases.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        staticKeyPhrases.innerHTML = '<h5><b>Suggested Keyphrases</b></h5>';
    
        const staticCandidateKeyword = document.createElement('li');
        staticCandidateKeyword.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        staticCandidateKeyword.innerHTML = '<h5><b>Keywords from selected taxonomy</b></h5>';

        keywordList.appendChild(staticKeyword);
        keyPhrasesList.appendChild(staticKeyPhrases);
        candidateList.appendChild(staticCandidateKeyword);

        var randomNumber = Math.floor(Math.random() * 100) + 1;
    

        createListItem(result.keywords, keywordList, result.CandidateFiles,false,undefined,randomNumber);
        createListItem(result.keyphrases, keyPhrasesList,result.CandidateFiles,false,undefined,randomNumber);
        createListItem(result.FinalKeywordsFromTaxonomy, candidateList,result.CandidateFiles,false,undefined,randomNumber);

        
        definition.appendChild(keywordList);
        definition.appendChild(keyPhrasesList);
        definition.appendChild(candidateList);

        // Dynamically create lists based on CandidateMatchedKeywords
        const CandidateFiles = result.CandidateFiles.slice(1)
        CandidateFiles.forEach((file,index) => {
            const dynamicList = document.createElement('ul');
            dynamicList.classList.add('list-group', 'list-group-flush');

            const staticListItem = document.createElement('li');
            staticListItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            staticListItem.innerHTML = `<h5><b>Keywords from ${file}</b></h5>`;
            dynamicList.appendChild(staticListItem);
            createListItem(result.CandidateMatchedKeywords[index], dynamicList ,result.CandidateFiles,true,file,randomNumber);
            definition.appendChild(dynamicList);
        });

        buttonExpand.addEventListener('click', () => {
            const expanded = buttonExpand.getAttribute('aria-expanded') === 'true';
            buttonExpand .setAttribute('aria-expanded', String(!expanded));
            definition.style.display = expanded ? 'none' : 'block';
            buttonExpand .textContent = expanded ? '+' : '-';
        });
    
        HeaderbuttonsContainer.append(buttonDltRes);
        HeaderbuttonsContainer.append(buttonExpand);
        cardHeader.appendChild(text);
        cardHeader.appendChild(HeaderbuttonsContainer);
        card.appendChild(cardHeader);
        card.appendChild(definition);

    
      
        contentDiv.appendChild(card);
        updateStopwords();
    }
    
    function createListItem(data, listContainer,CandidateFiles, newButton,Cfile,randomNumber) {
        const hr = document.createElement('hr');
        hr.style.border = '1px solid black'
        if (data.length === 0) {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            const itemText = document.createTextNode("No keyowrds from the list matched to the document");
            li.appendChild(itemText);
            listContainer.appendChild(li);
        }
        else{
            data.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                li.id = item[0]+randomNumber;
                const itemText = document.createTextNode(item[0] + " : " + item[1]);
                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('d-flex', 'align-items-center');
        
                if (newButton==true){
                    const button0 = document.createElement('button');
                    button0.textContent = 'REMOVE FROM LIST';
                    button0.classList.add('btn', 'btn-primary', 'mr-2');
                    button0.addEventListener('click', function(){
                        DltKeywordsFromList(item[0],Cfile,randomNumber);
                      });
                    buttonsContainer.appendChild(button0);
                }

                const button1 = document.createElement('button');
                button1.textContent = 'ADD TO STOPWORDS LIST';
                button1.classList.add('btn', 'btn-danger', 'mr-2'); // Add margin to the right
    
                // Add change event listener to the dropdown
                button1.addEventListener('click', function(){
                    AddKeywordsToStopwords(item[0],randomNumber);
                  });
        
                // Create select element
                const button2 = document.createElement('select');
                button2.id = 'button2';
        
                // Define custom styles for the select element
                button2.style.marginLeft = '5px';
                button2.style.height = '40px';
                button2.style.borderRadius = '5px';
                button2.style.color = '#fff';
                button2.style.backgroundColor = '#125909';
                button2.style.borderColor = '#125909';
                button2.style.transition = 'background-color 0.3s ease';
        
                // Define hover effect styles
                button2.addEventListener('mouseenter', function () {
                    button2.style.backgroundColor = '#125909'; // Change background color on hover
                    button2.style.borderColor = '#125909'; // Change border color on hover
                });
        
                button2.addEventListener('mouseleave', function () {
                    button2.style.backgroundColor = '#125909'; // Reset background color on mouse leave
                    button2.style.borderColor = '#125909'; // Reset border color on mouse leave
                });
        
                // Populate the dropdown with file names
                CandidateFiles.forEach(fileName => {
                    const filename = fileName.replace(/\.[^/.]+$/, "")
                      const option = document.createElement('option');
                      option.value = filename;
                      option.text = filename;
                      button2.appendChild(option);
                });
        
                // Add change event listener to the dropdown
                button2.addEventListener('change', function(){
                    AddKeywordsToCandidate(item[0],button2.value);
                  });
        
                // Append the elements to the list item
                buttonsContainer.appendChild(button1);
                buttonsContainer.appendChild(button2);
        
                li.appendChild(itemText);
                li.appendChild(buttonsContainer);
                listContainer.appendChild(li);
            });
        }
        listContainer.appendChild(hr);
        
    }

    function AddKeywordsToStopwords(keyword,randomNumber){
        
        // Send an HTTP POST request to your Python backend
        fetch('/add_stopword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword: keyword}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const Alert = document.getElementById('alertSuccess');
                Alert.innerText = data.message;
                Alert.style.display = 'block';
                updateStopwords();
                const liToRemove = document.getElementById(keyword+randomNumber);
                if (liToRemove) {
                    liToRemove.remove();
                }
            } else {
                // Handle errors and display the error message in the Bootstrap alert
                const Alert = document.getElementById('alertDanger');
                Alert.innerText = data.error;
                Alert.style.display = 'block';
            }
        })
            
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function AddKeywordsToCandidate(keyword,file){
       
            // Send an HTTP POST request to your Python backend
            fetch('/add_candidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword: keyword, file: file}),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const Alert = document.getElementById('alertSuccess');
                    Alert.innerText = data.message;
                    Alert.style.display = 'block';
                } else {
                    // Handle errors and display the error message in the Bootstrap alert
                    const Alert = document.getElementById('alertDanger');
                    Alert.innerText = data.error;
                    Alert.style.display = 'block';
                }
            })
            
            .catch(error => {
                console.error('Error:', error);
            });
    }
    function DltKeywordsFromList(keyword,file,randomNumber){
            // Send an HTTP POST request to your Python backend
            fetch('/rm_candidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword: keyword, file: file}),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const Alert = document.getElementById('alertSuccess');
                    Alert.innerText = data.message;
                    Alert.style.display = 'block';
                    const liToRemove = document.getElementById(keyword+randomNumber);
                    if (liToRemove) {
                        liToRemove.remove();
                    }
                } else {
                    // Handle errors and display the error message in the Bootstrap alert
                    const Alert = document.getElementById('alertDanger');
                    Alert.innerText = data.error;
                    Alert.style.display = 'block';
                }
            })
            
            .catch(error => {
                console.error('Error:', error);
            });
    }

    
});
