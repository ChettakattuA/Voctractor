const SubmitButton = document.getElementById('processBtn');

const pdfUpload = document.getElementById('pdfUpload');
const stopwordsInput = document.getElementById('stopwordsInput');
const newCandidateName = document.getElementById('CandidateListName');
const newCandidateOrg = document.getElementById('CandidateListOrg');
// const ExcelFile = document.getElementById('excelUpload');
// Validation for PDF FILE UPLOAD

pdfUpload.addEventListener('input', validateInputs);
stopwordsInput.addEventListener('input', validateInputs);
newCandidateName.addEventListener('input', validateInputs);
newCandidateOrg.addEventListener('input', validateInputs);


function validateInputPDF(){
    const files = pdfUpload.files;
    let validInput = false;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('.pdf')) {
            validInput = true;
        } else {
            validInput = false;
            break;
        }
    }

    if (!validInput) {
        displayValidationError('You can only upload PDF file with the ".pdf" extension.','ValidationAlertPDF');
        document.getElementById("ValidationAlertDetails").style.display = "none";
        document.getElementById("ValidationAlertstopword").style.display = "none";
        // Clear the file input to reset the selection
        pdfUpload.value = '';
    }
    else{
        document.getElementById("ValidationAlertPDF").style.display = "none";
    }

    return validInput;
}

function validateInputStopwords(){
    const inputValue = stopwordsInput.value;
    const validInput = /^[a-zA-Z0-9,\s]*$/.test(inputValue);

    if (!validInput) {
        // If the input is not valid, clear the input field
        displayValidationError("Only Alphabets a-z and A-Z, numbers 0-9 and comma symbol allowed!!","ValidationAlertstopword");
        document.getElementById("ValidationAlertPDF").style.display = "none";
        document.getElementById("ValidationAlertDetails").style.display = "none";
        // You can also display an error message or take other actions as needed
    }
    else{
        document.getElementById("ValidationAlertstopword").style.display = "none";
    }

    return validInput;

}

function validateInputCandidateName(){
    const inputValue = newCandidateName.value;
    const validInput = /^[a-zA-Z_]*$/.test(inputValue);

    if (!validInput) {
        // If the input is not valid, clear the input field
        displayValidationError("Only Alphabets a-z, A-Z and White Space are allowed!!","ValidationAlertDetails");
        // You can also display an error message or take other actions as needed
    }
    else{
        document.getElementById("ValidationAlertDetails").style.display = "none";
    }

    return validInput;
}
function validateInputCandidateOrg(){
    const inputValue = newCandidateOrg.value;
    const validInput = /^[a-zA-Z_]*$/.test(inputValue);

    if (!validInput) {
        // If the input is not valid, clear the input field
        displayValidationError("Only Alphabets a-z, A-Z and White Space are allowed!!","ValidationAlertDetails");
        document.getElementById("ValidationAlertPDF").style.display = "none";
        document.getElementById("ValidationAlertstopword").style.display = "none";
        // You can also display an error message or take other actions as needed
    }
    else{
        document.getElementById("ValidationAlertDetails").style.display = "none";
    }

    return validInput;
}


function validateInputs() {
    const isInput1Valid = validateInputPDF();
    const isInput2Valid = validateInputStopwords();
    // const isInput3Valid = validateInputEXCEL();

    // Enable the submit button if all validations pass
    if (isInput1Valid && isInput2Valid ) {
        SubmitButton.removeAttribute('disabled');
    } else {
        SubmitButton.setAttribute('disabled', 'disabled');
    }
}

// Function to display validation error alert
function displayValidationError(message,element) {
    const validationAlert = document.getElementById(element);
    validationAlert.innerHTML = ` <p>${message}</p> `;
    validationAlert.classList.add = "alert-danger";
    validationAlert.style.display = "block"; // Show the alert
}