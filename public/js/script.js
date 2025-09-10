let selectWard = document.querySelector('#ward')
const eventSelect = document.querySelector("#event");

let att_list = document.querySelector('#att_list')

const wards = ["Meiran", "Abule-egba", "Alakuko", "Sango", "Oju-Ore", "Iyana-paja", "Ijoko", "Iyana-iyesi", "Orile-agege"];

const attendanceForm = document.querySelector('#attendanceForm')

wards.forEach(element => {
    const optionElement = document.createElement('option')
    optionElement.value = element
    optionElement.textContent = element
    selectWard.append(optionElement)
})

const url = '/event/getEventType/'
fetchSelectOptions(url)

//code to enable names to show in the div for the user input value in the participant-attendance form
const nameInput = document.querySelector('#nameInput');

const parNames = document.querySelector('#par_names');
const statusMessage = document.querySelector("#statusMessage");

nameInput.addEventListener("click", function () {
    // the line below is to hide the status message when the input for the name is clicked
    statusMessage.style.display = "none"
    submitButton.style.display = 'none'
    proceedToSubmit.style.display = 'none'
})

nameInput.addEventListener("input", function () {

    markAttendance.style.display = 'none';

    // this code was added to remove the master label and pasword if it is displayed
    // the label and password will be removed when the nameInput form element is clicked 
    masterPasswordLabel.classList.remove('show')
    masterPassword.classList.remove('show')
    masterPassword.value = ""

    if (nameInput.value.length > 2) {
        let url = "/participant/getNames/"
        fetchDataWithUrl(url, parNames, nameInput, markAttendance)
    }
    else {
        parNames.innerHTML = ""
    }
})

function fetchDataWithUrl(url, parentDiv, nameInput, actionField, actionFunction) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            populateDiv(data, parentDiv, nameInput, actionField, actionFunction)
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}

// populateDiv function is called inside the fetchDataWithUrl function
//it populate the div with matching names according to the user input in the nameInput form component
function populateDiv(dataList, parentDiv, nameInput, actionField, actionFunction) {
    parentDiv.innerHTML = '';

    parentDiv.style.display = "block"
    dataList.forEach(element => {

        // this line below is to check if the item in the dataList contains the characters the user has entered
        // in the nameInput form component
        // nameInput is defined outside of this function scope, it is defined in the local scope
        // so it can still be accessed by this function
        const isFound = ((element.par_name).toLowerCase()).includes((nameInput.value).toLowerCase()); // true

        if (isFound) {
            const nameLine = document.createElement('p')

            // I set the textContent of the nameLine variable that will be created for each iteration
            // in the list and the textContent of the variable "nameLine" is the value of the list item
            // in the dataList array

            //par_name represent participant_name
            nameLine.textContent = element.par_name

            nameLine.addEventListener("click", () => {
                parentDiv.style.display = "none"
                nameInput.value = nameLine.textContent
                actionField.style.display = 'block';
                if (actionFunction) {
                    let url2 = `/participant/getNameInfo/${nameInput.value}`
                    actionFunction(url2)
                }
            })

            parentDiv.append(nameLine)
        }
    });

    if (parentDiv.innerHTML == '') {
        parentDiv.innerHTML = "No matching name found, please register this user"
    }
}


let skillAttendanceList = JSON.parse(localStorage.getItem('skillAttendance')) || [];
let instituteAttendanceList = JSON.parse(localStorage.getItem('instituteAttendance')) || [];
let familyhistoryAttendanceList = JSON.parse(localStorage.getItem('familyhistoryAttendance')) || [];

const markAttendance = document.querySelector("#markAttendance");

markAttendance.style.display = 'none';

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

const showAttendanceList = document.querySelector('#showAttendanceList');
const masterPasswordLabel = document.querySelector('#master_password_label');
const masterPassword = document.querySelector('#master_password');

const participantDisplay = document.querySelector('#participantDisplay');
participantDisplay.style.display = 'none'

const proceedToSubmit = document.querySelector('#proceed_to_submit');
proceedToSubmit.style.display = 'none'

masterPassword.addEventListener("input", () => {
    if (masterPassword.value == 'nicework') {
        participantDisplay.style.display = 'block'
        proceedToSubmit.style.display = 'block'
        submitButton.style.display = 'none'
    }
})

eventSelect.addEventListener("click", function () {
    participantDisplay.style.display = 'none'

    // this code was added to remove the master label and pasword if it is displayed
    // the label and password will be removed when the eventSelect form element is clicked 
    masterPasswordLabel.classList.remove('show')
    masterPassword.classList.remove('show')
    masterPassword.value = ""

})

const showAttendanceCaution = document.querySelector('#showAttendanceCaution');
showAttendanceCaution.style.display = 'none'

showAttendanceList.addEventListener("click", () => {

    if (eventSelect.value != "") {

        // the two lines of code below are to toggle the class "show" to the label and password
        //to display the label and input element for the master password
        //when showAttendanceList is clicked
        masterPasswordLabel.classList.toggle('show')
        masterPassword.classList.toggle('show')
        masterPassword.value = ""
        proceedToSubmit.style.display = 'none'
        submitButton.style.display = 'none'

        // participant display is representing the div that display the attendance list

        // code to hide the attendance list any time the showAttendanceList is clicked
        // so that the user can enter the master password before seeing the attendance list
        participantDisplay.style.display = 'none'

        // code to remove the caution message when the user selects an event if the caution message
        // was already displayed
        showAttendanceCaution.style.display = 'none'
    }
    else {
        //code to display showAttendanceCaution if no event is selected
        showAttendanceCaution.style.display = 'block'
    }

    const optionElement = eventSelect.options[eventSelect.selectedIndex]; // Get the selected option
    if (optionElement.value == 'skillAcquisition') {
        participantDisplay.innerHTML = ""

        const displayHeading = document.createElement('h2')
        displayHeading.textContent = `${optionElement.value} Attendance`

        participantDisplay.append(displayHeading)
        populateDivWithList(skillAttendanceList, participantDisplay)
    }
    else if (optionElement.value == 'institute') {
        participantDisplay.innerHTML = ""

        const displayHeading = document.createElement('h3')
        displayHeading.textContent = `${optionElement.value} Attendance`

        participantDisplay.append(displayHeading)
        populateDivWithList(instituteAttendanceList, participantDisplay)
    }
    else if (optionElement.value == 'family-history-and-temple') {
        participantDisplay.innerHTML = ""

        const displayHeading = document.createElement('h2')
        displayHeading.textContent = `${optionElement.value} Attendance`

        participantDisplay.append(displayHeading)
        populateDivWithList(familyhistoryAttendanceList, participantDisplay)
    }
})

function populateDivWithList(list, parentDiv) {

    list.forEach(element => {
        const para = document.createElement('p')
        const span = document.createElement('span')
        span.textContent = '✖'
        span.addEventListener('click', () => {

            submitButton.style.display = 'none'
            Array.from(participantDisplay.children).forEach(childElement => {

                if (childElement.textContent == `${element}✖`) {

                    // notice the style of programming. I added the event listener for the yes and no
                    // buttons inside the same scope that they were created. I also did that for the 
                    // 'X' in the attendance list. So that I can access the appropriate value
                    // in the list
                    const confirmDeleteDiv = document.createElement('div')
                    confirmDeleteDiv.setAttribute('class', 'confirmDelete')

                    const confirmDeleteMessage = document.createElement('p')
                    confirmDeleteMessage.textContent = `are you sure you want to delete "${element}"`

                    const yesButton = document.createElement('span')
                    yesButton.textContent = 'YES'
                    yesButton.addEventListener('click', () => {
                        participantDisplay.removeChild(childElement)

                        //this code is to remove the delete confirm message when the user clicks on 'yes'
                        attendanceForm.removeChild(attendanceForm.lastChild)

                        const optionElement = eventSelect.options[eventSelect.selectedIndex]; // Get the selected option
                        if (optionElement.value == 'skillAcquisition') {
                            skillAttendanceList = skillAttendanceList.filter(item => item !== element)
                            localStorage.setItem('skillAttendance', JSON.stringify(skillAttendanceList))
                        }
                        else if (optionElement.value == 'institute') {
                            instituteAttendanceList = instituteAttendanceList.filter(item => item !== element)
                            localStorage.setItem('instituteAttendance', JSON.stringify(instituteAttendanceList))
                        }
                        else if (optionElement.value == 'family-history-and-temple') {
                            familyhistoryAttendanceList = familyhistoryAttendanceList.filter(item => item !== element)
                            localStorage.setItem('familyhistoryAttendance', JSON.stringify(familyhistoryAttendanceList))
                        }
                    });

                    const noButton = document.createElement('span')
                    noButton.textContent = 'NO'
                    noButton.addEventListener('click', () => {
                        attendanceForm.removeChild(attendanceForm.lastChild)
                    })

                    confirmDeleteDiv.append(confirmDeleteMessage)
                    confirmDeleteDiv.append(yesButton)
                    confirmDeleteDiv.append(noButton)

                    attendanceForm.append(confirmDeleteDiv)

                }
            })

        });
        para.textContent = element
        para.append(span)

        parentDiv.append(para)

    })

}

const submitButton = document.querySelector('#submitAttendance')
submitButton.style.display = 'none'

proceedToSubmit.addEventListener('click', () => {

    if (eventSelect.value == 'skillAcquisition') {
        att_list.setAttribute('value', skillAttendanceList)
    }
    else if (eventSelect.value == 'institute') {
        att_list.setAttribute('value', instituteAttendanceList)
    }
    else if (eventSelect.value == 'family-history-and-temple') {
        att_list.setAttribute('value', familyhistoryAttendanceList)
    }

    submitButton.style.display = 'block'
})

// script for the update form starts here


const name_updated = document.querySelector('#name_updated')
const par_names_div = document.querySelector('#par_names_div')

const user_info_fieldset = document.querySelector('#user_info_fieldset')
user_info_fieldset.style.display = 'none'

const number_updated = document.querySelector('#number_updated')
const ward_updated = document.querySelector('#ward_updated')
const mrn_updated = document.querySelector('#mrn_updated')
const agegroup_updated = document.querySelector('#agegroup_updated')
const par_id = document.querySelector('#par_id')

name_updated.addEventListener('input', () => {
    if (name_updated.value.length > 2) {

        let url = "/participant/getNames/"
        fetchDataWithUrl(url, par_names_div, name_updated, user_info_fieldset, fetchNameInfo)
    }
    else {
        par_names_div.innerHTML = ""
    }
})

// this function fetches the user information using the name and also stores the info to the 
// values of the other form inputs in the update participant form
function fetchNameInfo(url) {

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            number_updated.value = data.par_number
            ward_updated.value = data.par_ward
            mrn_updated.value = data.par_mrn
            agegroup_updated.value = data.par_agegroup
            par_id.value = data.par_id
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}

function fetchSelectOptions(url) {

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {

            data.forEach(par => {
                const categories = par.values_list.split(',')
                categories.forEach(element => {
                    let newString = element.replace('[', '')
                    newString = newString.replace(']', '')

                    const option = document.createElement('option')
                    option.value = par.category_type
                    option.textContent = newString

                    // I added the newly created option element to the event select form component with the
                    // line below
                    eventSelect.append(option)
                });
            });
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}

const analyticsSelect = document.querySelector('#analyticsSelect')
const analyticsDiv = document.querySelector('#analyticsDiv')

analyticsSelect.addEventListener('input', () => {
    if (analyticsSelect.value == 'gpAttendanceTotal') {
        showAttendanceTotal()
    }
})

function showAttendanceTotal() {
    analyticsDiv.innerHTML = ''
    const select = document.createElement('select')
    select.setAttribute('class', 'selectMonth')
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
        'october', 'november', 'december']

    const optionDisabled = document.createElement('option')
    optionDisabled.textContent = 'select month'
    select.append(optionDisabled)

    months.forEach(element => {
        const option = document.createElement('option')
        option.textContent = element
        option.value = element
        select.append(option)
    });

    analyticsDiv.append(select)

    let url = 'participant/getAttendanceTotal'

    const attendanceTotalDiv = document.createElement('div')

    select.addEventListener('input', () => {
        let url = `/participant/getAttendanceData/${select.value}`

        attendanceTotalDiv.innerHTML = ''
        getAttendanceTotal(url, attendanceTotalDiv, analyticsDiv)
    })
}

function getAttendanceTotal(url, attendanceTotalDiv, parentDiv) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            dataList = []
            data.forEach(element => {
                element.rows.forEach(item => {
                    dataList.push(item)
                });
            })
            console.log(dataList)
            createDataTable(dataList)
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}

function createDataTable(dataList) {
    fetch("/participant/getNames/")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            console.log(data)
            stringList = []
            dataList.forEach(element => {
                let newString = element.att_list
                data.forEach(item => {
                    newString = newString.replace(item.par_name, '')
                });

                let newStringList = newString.split(',')
                newStringList.forEach(item => {
                    if (!stringList.includes(item)) {
                        stringList.push(item)
                    }
                });
            });

            console.log(stringList)
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}
