
let selectWard = document.querySelector('#ward');

let wards = ["Meiran", "Abule-egba", "Alakuko", "Sango", "Oju-Ore", "Iyana-paja", "Ijoko", "Iyana-iyesi", "Orile-agege"];


wards.forEach(element => {
    const optionElement = document.createElement('option')
    optionElement.value = element
    optionElement.textContent = element
    selectWard.append(optionElement)
});

//code to enable names to show in the div for the user input value in the participant-attendance form
const nameInput = document.querySelector('#nameInput');

const parNames = document.querySelector('#par_names');
const statusMessage = document.querySelector("#statusMessage");

nameInput.addEventListener("click", function () {
    // the line below is to hide the status message when the input for the name is clicked
    statusMessage.style.display = "none"
})

nameInput.addEventListener("input", function () {

    if (nameInput.value.length > 1) {
        let url = "/participant/getNames/"
        fetchDataWithUrl(url, parNames)
    }
    else {
        parNames.innerHTML = ""
    }
})

function fetchDataWithUrl(url, parentDiv) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            populateDiv(data, parentDiv)
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}

function populateDiv(dataList, parentDiv) {
    parentDiv.innerHTML = '';

    dataList.forEach(element => {
        const isFound = ((element.par_name).toLowerCase()).includes((nameInput.value).toLowerCase()); // true
        if (isFound) {
            const option = document.createElement('option')
            option.value = element.par_name
            option.textContent = element.par_name
            parentDiv.append(option)
        }
    });

    if (parentDiv.innerHTML == '') {
        parentDiv.innerHTML = "No matching name found, please register this user"
    }
}

let skillAttendanceList = JSON.parse(localStorage.getItem('skillAttendance')) || [];
let instituteAttendanceList = JSON.parse(localStorage.getItem('instituteAttendance')) || [];
let familyhistoryAttendanceList = JSON.parse(localStorage.getItem('familyhistoryAttendance')) || [];

const eventSelect = document.querySelector("#event");
const markAttendance = document.querySelector("#markAttendance");
const participantDisplay = document.querySelector('#participantDisplay');

// code to listen for a click in the mark attendance box and then add the generated string to the appropriate 
// list in local storage based on the event type
markAttendance.addEventListener("click", () => {

    participantDisplay.style.display = 'none'
    const optionElement = eventSelect.options[eventSelect.selectedIndex]; // Get the selected option
    const optionText = optionElement.textContent;

    const nameString = `${nameInput.value}-${optionText}`

    if (optionElement.value == 'skillAcquisition' && nameInput.value) {
        checkForCategoryAndStore(skillAttendanceList, nameInput, nameString, statusMessage, 'skillAttendance')
    }
    else if (optionElement.value == 'institute' && nameInput.value) {
        checkForCategoryAndStore(instituteAttendanceList, nameInput, nameString, statusMessage, 'instituteAttendance')
    }
    else if (optionElement.value == 'family-history-and-temple' && nameInput.value) {
        checkForCategoryAndStore(familyhistoryAttendanceList, nameInput, nameString, statusMessage, 'familyhistoryAttendance')
    }
})

function checkForCategoryAndStore(attendanceList, nameInput, nameString, statusMessage, localStorageKey) {

    if (!attendanceList.includes(nameString)) {
        let result = '';
        attendanceList.forEach(element => {
            if (element.includes(nameInput.value)) {
                result = 'found'
            }
        });
        if (result != 'found') {
            attendanceList.push(nameString)

            statusMessage.textContent = "participant added successfully to attendance"
            statusMessage.style.display = "block"

            localStorage.setItem(localStorageKey, JSON.stringify(attendanceList))
        }
        else {
            statusMessage.textContent = "participant already in attendance"
            statusMessage.style.display = "block"
        }
    }
    else {
        statusMessage.textContent = "participant already in attendance"
        statusMessage.style.display = "block"
    }
}

const submitTotal = document.querySelector('#submitTotal');

submitTotal.addEventListener("click", () => {
    participantDisplay.style.display = 'block'

    const optionElement = eventSelect.options[eventSelect.selectedIndex]; // Get the selected option
    if (optionElement.value == 'skillAcquisition') {
        let skillAttendanceList = JSON.parse(localStorage.getItem('skillAttendance')) || [];
        populateDivWithList(skillAttendanceList, participantDisplay)
    }
    else if (optionElement.value == 'institute') {
        let instituteAttendanceList = JSON.parse(localStorage.getItem('instituteAttendance')) || [];
        populateDivWithList(instituteAttendanceList, participantDisplay)
    }
    else if (optionElement.value == 'family-history-and-temple') {
        let familyhistoryAttendanceList = JSON.parse(localStorage.getItem('familyhistoryAttendance')) || [];
        populateDivWithList(familyhistoryAttendanceList, participantDisplay)
    }
})

function populateDivWithList(list, parentDiv) {
    parentDiv.innerHTML = ""
    list.forEach(element => {
        const para = document.createElement('p')
        para.textContent = element

        parentDiv.append(para)
    });
}