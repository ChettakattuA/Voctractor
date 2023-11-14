/*
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
*/

const SubmitButton = document.getElementById('processBtn');

const pdfUpload = document.getElementById('pdfUpload');
const stopwordsInput = document.getElementById('stopwordsInput');
// const ExcelFile = document.getElementById('excelUpload');
// Validation for PDF FILE UPLOAD

pdfUpload.addEventListener('change', validateInputs);
stopwordsInput.addEventListener('keyup', validateInputs);
// ExcelFile.addEventListener('change', validateInputs);

function validateInputPDF(){
    const files = pdfUpload.files;
    let valid = false;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('.pdf')) {
            valid = true;
        } else {
            valid = false;
            break;
        }
    }

    if (!valid) {
        displayValidationError('You can only upload PDF file with the ".pdf" extension.','ValidationAlertPDF');
        // Clear the file input to reset the selection
        pdfUpload.value = '';
    }
    else{
        document.getElementById("ValidationAlertPDF").style.display = "none";
    }

    return valid;
}

function validateInputStopwords(){
    const inputValue = stopwordsInput.value;
    const validInput = /^[a-zA-Z0-9,]*$/.test(inputValue);

    if (!validInput) {
        // If the input is not valid, clear the input field
        displayValidationError("Only Alphabets a-z and A-Z, numbers 0-9 and comma symbol allowed!!","ValidationAlertstopword");
        // You can also display an error message or take other actions as needed
    }
    else{
        document.getElementById("ValidationAlertstopword").style.display = "none";
    }

    return validInput;

}

// function validateInputEXCEL(){
//     console.log("Hello");
//     const filesx = ExcelFile.files;
//     let validx = false;
//     for (let i = 0; i < filesx.length; i++) {
//         const file = filesx[i];
//         if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
//             validx = true;
//         } else {
//             validx = false;
//             break;
//         }
//     }

//     if (!validx) {
//         displayValidationError('You can only upload Excel file with the ".xlxs" or "xls" extension.','ValidationAlertExcel');
//         // Clear the file input to reset the selection
//         ExcelFile.value = '';
//     }
//     else{
//         document.getElementById("ValidationAlertExcel").style.display = "none";
//     }

//     return validx;
// }

function validateInputs() {
    const isInput1Valid = validateInputPDF();
    const isInput2Valid = validateInputStopwords();
    // const isInput3Valid = validateInputEXCEL();

    // Enable the submit button if all validations pass
    if (isInput1Valid && isInput2Valid) {
        SubmitButton.removeAttribute('disabled');
    } else {
        SubmitButton.setAttribute('disabled', 'disabled');
    }
}

// Function to display validation error alert
function displayValidationError(message,element) {
    const validationAlert = document.getElementById(element);
    validationAlert.innerHTML = ` <p>${message}</p> `;
    validationAlert.style.display = "block"; // Show the alert
}
