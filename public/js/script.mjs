import showAttendanceTotal from "./attendanceTotal.mjs"

const home = document.querySelector('#home')
const statistics = document.querySelector('#statistics')
const formContainer = document.querySelector('#formContainer')
const analyticsSection = document.querySelector('#analyticsSection')

home.style.display = "none"
analyticsSection.style.display = "none"

statistics.addEventListener('click', () => {
    home.style.display = "block"
    statistics.style.display = "none"
    formContainer.style.display = "none"
    analyticsSection.style.display = "block"
})

home.addEventListener('click', () => {
    statistics.style.display = "block"
    home.style.display = "none"
    formContainer.style.display = "grid"
    analyticsSection.style.display = "none"
})

let selectWard = document.querySelector('#ward')
const eventSelect = document.querySelector("#event");

let att_list = document.querySelector('#att_list')

const wards = ["Meiran", "Abule-egba", "Alakuko", "Sango", "Oju-Ore", "Iyana-paja", "Ijoko", "Iyana-iyesi", "Orile-agege"];

const attendanceForm = document.querySelector('#attendanceForm')

attendanceForm.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') { // Check if the pressed key is Enter
        event.preventDefault(); // Prevent the default form submission
        // Optional: You can add custom logic here, like focusing on the next input field
    }
});

wards.forEach(element => {
    const optionElement = document.createElement('option')
    optionElement.value = element
    optionElement.textContent = element
    selectWard.append(optionElement)
})

const url = '/event/getEventType/'
fetchSelectOptions(url)


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
                    option.value = newString.split(' ').join('')
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


let attendanceList;
const markAttendance = document.querySelector("#markAttendance");

markAttendance.style.display = 'none';

// code to listen for a click in the mark attendance box and then add the generated string to the appropriate 
// list in local storage based on the event type
markAttendance.addEventListener("click", () => {

    participantDisplay.style.display = 'none'
    const optionElement = eventSelect.options[eventSelect.selectedIndex]; // Get the selected option
    const optionText = optionElement.textContent;

    const nameString = `${nameInput.value}`

    attendanceList = JSON.parse(localStorage.getItem(optionElement.value)) || [];

    if (nameInput.value) {
        checkForCategoryAndStore(attendanceList, nameInput, nameString, statusMessage, optionElement.value)
    }
})

function checkForCategoryAndStore(attendanceList, nameInput, nameString, statusMessage, localStorageKey) {

    if (!attendanceList.includes(nameString)) {
        let result = '';
        attendanceList.forEach(element => {
            // this second if statement is to make sure that the same person does not appear in the attendance list
            // twice
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
    proceedToSubmit.style.display = 'none'
    submitButton.style.display = 'none'

    // this code was added to remove the master label and pasword if it is displayed
    // the label and password will be removed when the eventSelect form element is clicked 
    masterPasswordLabel.classList.remove('show')
    masterPassword.classList.remove('show')
    masterPassword.value = ""

})

const optionElement = eventSelect.options[eventSelect.selectedIndex]; // Get the selected option

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

    participantDisplay.innerHTML = ""

    const option = eventSelect.options[eventSelect.selectedIndex];

    const displayHeading = document.createElement('h2')
    displayHeading.textContent = `${option.value} Attendance`

    participantDisplay.append(displayHeading)
    const attendance = JSON.parse(localStorage.getItem(option.value))
    populateDivWithList(attendance, participantDisplay)
}
)

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

                        let attendance = JSON.parse(localStorage.getItem(optionElement.value))

                        attendance = attendance.filter(item => item !== element)
                        localStorage.setItem(optionElement.value, JSON.stringify(attendance))
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

    const optionElement = eventSelect.options[eventSelect.selectedIndex]; // Get the selected option
    let attendance = JSON.parse(localStorage.getItem(optionElement.value))

    att_list.setAttribute('value', attendance)
    submitButton.style.display = 'block'
})

// code to set the value of the corresponding local storage list to be empty list when the submit button
// is clicked
submitButton.addEventListener('click', () => {
    const optionElement = eventSelect.options[eventSelect.selectedIndex]; // Get the selected option
    localStorage.setItem(optionElement.value, JSON.stringify([]))
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

const analyticsSelect = document.querySelector('#analyticsSelect')
const analyticsDiv = document.querySelector('#analyticsDiv')
const studentMonthlyAttendance = document.querySelector('#studentMonthlyAttendance')

const select = document.querySelector('.selectMonth')

analyticsSelect.addEventListener('input', () => {

    select.innerHTML = ''
    const optionDisabled = document.createElement('option')
    optionDisabled.textContent = 'select month'
    optionDisabled.disabled = true
    optionDisabled.selected = true
    select.append(optionDisabled)

    //line of code to hide the print button
    printButton.style.display = 'none'

    if (analyticsSelect.value == 'gpAttendanceTotal') {
        showAttendanceTotal()
        myChart.style.display = 'none'
        attendanceByWardDiv.style.display = 'none'
        studentMonthlyAttendance.style.display = 'none'
        analyticsDiv.style.display = 'block'
    }
    else if (analyticsSelect.value == 'attendanceByWard') {
        myChart.style.display = 'none'
        analyticsDiv.style.display = 'none'
        studentMonthlyAttendance.style.display = 'none'
        attendanceByWardDiv.style.display = 'block'
        showAttendanceByWard()
    }
    else if (analyticsSelect.value == 'attendanceByStudent') {
        myChart.style.display = 'none'
        analyticsDiv.style.display = 'none'
        attendanceByWardDiv.style.display = 'none'
        studentMonthlyAttendance.style.display = 'block'
        showStudentMonthlyAttendance()
    }
})

// attendance by ward lines of code

let attendanceByWardDiv = document.querySelector('#attendanceByWard');
function showAttendanceByWard() {

    fieldset.style.display = 'grid'

    const optionDisabled = document.createElement('option')
    optionDisabled.textContent = 'select month'
    optionDisabled.disabled = true
    select.append(optionDisabled)

    months.forEach(element => {
        const option = document.createElement('option')
        option.textContent = element
        option.value = element
        select.append(option)
    });

    select.addEventListener('input', () => {
        // this line of code is to show the print button
        printButton.style.display = 'block'

        attendanceByWardDiv.innerHTML = ''

        selectWard = document.createElement('select')
        const disabledOption = document.createElement('option')
        disabledOption.textContent = 'select ward'
        disabledOption.disabled = true
        disabledOption.selected = true

        selectWard.append(disabledOption)

        wards.forEach(ward => {
            const option = document.createElement('option')
            option.textContent = ward
            option.value = ward
            selectWard.append(option)
        });

        const p = document.createElement('p')
        p.textContent = 'show analysis'
        p.style.display = 'none'

        selectWard.addEventListener('input', () => {
            p.style.display = 'block'
            if (wardTableExists) {
                if (attendanceByWardDiv.lastElementChild.tagName === 'TABLE') {
                    attendanceByWardDiv.removeChild(attendanceByWardDiv.lastElementChild)
                    wardTableExists = false
                }
            }
        })

        let attendanceByWardTable = document.createElement('table')
        attendanceByWardTable.setAttribute('id', 'attendanceByWardTable')
        attendanceByWardTable.style.display = 'none'

        p.addEventListener('click', () => {
            const url = `/participant/getParNameByWard/${selectWard.value}`
            getParticipantsByWard(url, selectWard, select)
        })
        attendanceByWardDiv.append(selectWard)
        attendanceByWardDiv.append(p)
        attendanceByWardDiv.append(attendanceByWardTable)
    })
}

let wardData
function getParticipantsByWard(url, selectElement, selectMonth) {
    let dataList = []

    wardData = [[`Participant in ${selectElement.value}`, `No of days attended in ${selectMonth.value}`]]
    fetch(`/participant/getAttendanceData/${select.value}`)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            data.forEach(element => {
                element.rows.forEach(item => {
                    dataList.push(item)
                });
            })
            console.log(dataList)
            fetch(url)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                    throw Error("Network response was not OK");
                })
                .then(function (data) {

                    const attendanceByWardTable = document.querySelector('#attendanceByWardTable')
                    attendanceByWardTable.style.display = 'block'
                    attendanceByWardTable.innerHTML = ''

                    data.forEach(string => {
                        let counter = 0;

                        let attendedDay
                        for (let num = 1; num < 32; num++) {

                            attendedDay = 0
                            dataList.forEach(dataItem => {

                                if (dataItem.att_dayofmonth == num) {

                                    const list = dataItem.att_list.split(',')
                                    list.forEach(item => {
                                        console.log(string.par_name)
                                        if (item.includes(`${string.par_name}-`)) {
                                            attendedDay = 1
                                        }
                                    });
                                }
                            })

                            if (attendedDay == 1) {
                                counter += 1
                            }
                        }
                        const participantAttendance = [`${string.par_name}`, counter]
                        wardData.push(participantAttendance)
                    })

                    let averageTable = '<table class="averageTable">'

                    // dataSet list variable is declared in the local scope
                    wardData.forEach(element => {
                        averageTable += '<tr><td>' + element[0] + '</td><td>' + element[1] + '</td></tr>'
                    });

                    averageTable += '</table>'
                    attendanceByWardTable.insertAdjacentHTML('beforeend', averageTable)

                    google.charts.load('current', { packages: ['corechart'] });
                    google.charts.setOnLoadCallback(drawWardChart);
                })
        })
}

let wardTableExists = false


// this is the function to draw the google chart for the ward attendance
function drawWardChart() {
    myChart.style.display = 'block'

    // Set Options
    const options = {
        title: 'Participants in Ward'
    };

    // Draw
    const chart = new google.visualization.BarChart(myChart);

    // this line of code is used to turn the array to a data table
    const dataTable = google.visualization.arrayToDataTable(wardData);
    chart.draw(dataTable, options);

    // wardData list variable has been populated in the function above
}


function showStudentMonthlyAttendance() {
    fieldset.style.display = 'grid'

    const optionDisabled = document.createElement('option')
    optionDisabled.textContent = 'select month'
    optionDisabled.disabled = true
    select.append(optionDisabled)

    months.forEach(element => {
        const option = document.createElement('option')
        option.textContent = element
        option.value = element
        select.append(option)
    });

    select.addEventListener('input', () => {
        // this line of code is to show the print button
        printButton.style.display = 'block'

        studentMonthlyAttendance.innerHTML = ''

        let input_label = document.createElement('label')
        input_label.text = 'enter your name'

        let par_name_input = document.createElement('input')
        par_name_input.setAttribute('type', 'text')
        par_name_input.setAttribute('id', 'par_name_input')

        let namesDiv = document.createElement('div')
        namesDiv.setAttribute('id', 'namesDiv')

        let showStudentAttendance = document.createElement('p')
        showStudentAttendance.setAttribute('id', 'showStudentAttendance')
        showStudentAttendance.textContent = 'show attendance'

        let studentTable = document.createElement('table')
        studentTable.setAttribute('id', 'studentTable')

        studentMonthlyAttendance.append(input_label)
        studentMonthlyAttendance.append(par_name_input)
        studentMonthlyAttendance.append(namesDiv)
        studentMonthlyAttendance.append(showStudentAttendance)
        studentMonthlyAttendance.append(studentTable)

        par_name_input.addEventListener('input', () => {
            namesDiv.style.display = 'none'
            showStudentAttendance.style.display = 'none'
            studentTable.style.display = 'none'

            if (par_name_input.value.length > 2) {
                let url = "/participant/getNames/"
                fetchDataWithUrl(url, namesDiv, par_name_input, showStudentAttendance)
            }
        })

        showStudentAttendance.addEventListener('click', () => {
            studentTable.style.display = 'block'
            fetchStudentAttendanceTable(par_name_input, select, studentMonthlyAttendance)
        })
    })
}

function fetchStudentAttendanceTable(name_input, selectMonth, parentDiv) {
    let dataList = []

    wardData = [[`Days ${name_input.value} attended in ${selectMonth.value}`, 'Classes Attended']]
    fetch(`/participant/getAttendanceData/${selectMonth.value}`)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            let dataList = []
            data.forEach(element => {
                element.rows.forEach(item => {
                    dataList.push(item)
                });
            })
            console.log(dataList)

            let studentTable = document.querySelector('#studentTable')
            studentTable.innerHTML = ''

            if (dataList.length !== 0) {
                for (let num = 1; num < 32; num++) {
                    let classesString = ''
                    dataList.forEach(dataItem => {
                        if (dataItem.att_dayofmonth == num) {

                            const list = dataItem.att_list.split(',')
                            list.forEach(item => {
                                if (item.includes(`${name_input.value}-`)) {
                                    console.log(item)
                                    let newString = item.replace(`${name_input.value}-`, '')
                                    newString = newString.replace(/"/g, '')
                                    newString = newString.replace(/'/g, '')
                                    if (!classesString.includes(newString)) {
                                        classesString += ` ${newString},`
                                    }
                                }
                            });
                        }
                    })

                    if (classesString !== '') {
                        const participantAttendance = [`${selectMonth.value} ${num}`, classesString]
                        wardData.push(participantAttendance)
                    }
                }
                const total = ['Total Number of Days Attended', (wardData.length - 1)]
                wardData.push(total)

                let averageTable = '<table class="averageTable">'

                // dataSet list variable is declared in the local scope
                wardData.forEach(element => {
                    averageTable += '<tr><td>' + element[0] + '</td><td>' + element[1] + '</td></tr>'
                });

                averageTable += '</table>'
                studentTable.insertAdjacentHTML('beforeend', averageTable)
            }
            else {
                studentTable.insertAdjacentHTML('beforeend', `<tr><td>No data found!! for ${selectMonth.value}</td></tr>`)
            }
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}

// print button
const printButton = document.querySelector('#print');
printButton.style.display = 'none'

printButton.addEventListener('click', () => {
    window.print()
})