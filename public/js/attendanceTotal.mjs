// this file contains the code for showing the attendance total in the analytics section

const select = document.querySelector('.selectMonth')

// print button
const printButton = document.querySelector('#print');
printButton.style.display = 'none'

const fieldset = document.querySelector('.fieldset')

const myChart = document.querySelector('#myChart')

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
    'october', 'november', 'december']

export default function showAttendanceTotal() {
    analyticsDiv.innerHTML = ''

    fieldset.style.display = 'grid'

    months.forEach(element => {
        const option = document.createElement('option')
        option.textContent = element
        option.value = element
        select.append(option)
    });

    let url = 'participant/getAttendanceTotal'

    const attendanceTotalDiv = document.createElement('div')
    attendanceTotalDiv.setAttribute('class', 'attendanceTotalDiv')

    select.addEventListener('input', () => {
        // this line of code is to show the print button
        printButton.style.display = 'block'

        let url = `/participant/getAttendanceData/${select.value}`
        averageTableExists = false

        analyticsDiv.innerHTML = ''
        myChart.innerHTML = ''

        getAttendanceTotal(url, attendanceTotalDiv, analyticsDiv, select)
    })
}

function getAttendanceTotal(url, attendanceTotalDiv, parentDiv, selectElement) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            let dataList = []
            data.forEach(element => {
                dataList.push(element)
            })

            attendanceTotalDiv.innerHTML = ''

            if (dataList.length !== 0) {
                createDataTable(dataList, selectElement, attendanceTotalDiv, parentDiv)
            }
            else {
                analyticsDiv.innerHTML = `<p>No data found!! for ${selectElement.value}</p>`
            }

        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
}

function createDataTable(dataList, selectElement, attendanceTotalDiv, parentDiv) {
    // this is the empty list that will contain the event for the table heading
    let stringList = []

    // I ran this forEach loop to clean the data from the database and get the events
    //for the table heading
    dataList.forEach(element => {
        let newString = element.att_event
        newString = newString.trim()
        if (!stringList.includes(newString)) {
            stringList.push(newString)
        }
    });

    stringList.push('Daily-Total')

    let table = '<table id=dataTable ><tr>'
    table += '<th>' + 'Day' + '</th>'
    stringList.forEach(element => {
        table += '<th>' + element + '</th>'
    });
    // table += '<th>Daily Total</th></tr>'

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const listOfDayOfMonth = dataList.map(item => item.att_dayofmonth)

    let dayOfWeek = ''

    for (let num = 1; num < 32; num++) {

        dataList.forEach(item => {
            if (item.att_dayofmonth == num) {
                dayOfWeek = daysOfWeek[parseInt(item.att_day, 10)]
            }
        })

        // the if statement below is to make sure that days of the month not recorded in the attendance
        // are not shown in the table
        if (listOfDayOfMonth.includes(num.toString())) {
            table += '<tr><td>' + `(${dayOfWeek}) ${selectElement.value} ${num}` + '</td>'
        }

        // this loop selects the events one by one so that the number of occurence can be calculated
        // for each of them
        stringList.forEach(string => {
            let counter = 0

            let eventParticipantList = []
            let allParticipantList = []

            // this loop go through the attendance list for that day of the month and 
            // find the number of occurence for the event
            dataList.forEach(dataItem => {
                if (dataItem.att_dayofmonth == num) {
                    if (dataItem.att_event == string) {
                        const list = dataItem.att_list.split(',')
                        list.forEach(item => {
                            if (!eventParticipantList.includes(item)) {
                                eventParticipantList.push(item)
                                counter += 1
                            }
                        })
                    }
                    else if (string == 'Daily-Total') {
                        const list = dataItem.att_list.split(',')
                        list.forEach(item => {
                            if (!allParticipantList.includes(item)) {
                                allParticipantList.push(item)
                            }
                        })
                    }
                }
            })

            // the if statement below is to make sure that days of the month not recorded in the attendance
            // are not shown in the table
            if (listOfDayOfMonth.includes(num.toString())) {
                if (string !== 'Daily-Total') {
                    table += `<td class='${dayOfWeek} ${string}'>` + counter + '</td>'
                }
                else if (string == 'Daily-Total') {
                    table += `<td class='${dayOfWeek} ${string}'>` + allParticipantList.length + '</td>'
                }
            }
        });

        // the if statement below is to make sure that days of the month not recorded in the attendance
        // are not shown in the table
        if (listOfDayOfMonth.includes(num.toString())) {
            table += '</tr>'
        }
    }


    table += '</table>'

    attendanceTotalDiv.insertAdjacentHTML("beforeend", table)

    // to clear the parent div before adding the child element
    parentDiv.innerHTML = ''

    parentDiv.append(attendanceTotalDiv)

    eventList = stringList

    // the showGraphButton will be used to display the averages and graph of the data
    parentDiv.insertAdjacentHTML("beforeend", `<p class="showGraphButton">show average</p>`)

    let showGraphButton = document.querySelector('.showGraphButton')
    getEventsAverageList(showGraphButton)
}

let eventList = [];
let eventsAverageList;

let dataSet;

function getEventsAverageList(eventTriggerButton) {
    dataSet = [['Class', `Average no of participants in ${select.value}`]];

    eventTriggerButton.addEventListener('click', () => {

        eventsAverageList = []
        eventList.forEach(element => {
            let total = 0
            const nodes = document.querySelectorAll(`.${element}`)
            let nodesEdited = Array.from(nodes).filter(node => parseInt(node.textContent) > 0)

            nodesEdited.forEach(element => {
                total += parseInt(element.textContent)
            });
            let average = total / nodesEdited.length
            eventsAverageList.push(average)
        })

        // organising the data in the eventList and the eventsAverageList into the 
        // dataSet list

        if (dataSet.length == 1) {
            for (let index = 0; index < eventList.length; index++) {
                const element = [`${eventList[index]}`, parseInt(eventsAverageList[index])]
                dataSet.push(element)
            }
        }

        if (!averageTableExists) {
            addAverageTable(dataSet, analyticsDiv)
        }

        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

    })
}

// this is the function to draw the google chart in the analytics for the total attendance
function drawChart() {
    myChart.style.display = 'block'

    // Set Options
    const options = {
        title: `Average no of participants in ${select.value}`
    };

    // Draw
    const chart = new google.visualization.BarChart(myChart);

    // this line of code is used to turn the array to a data table
    const dataTable = google.visualization.arrayToDataTable(dataSet);
    chart.draw(dataTable, options);

    // dataSet list variable has been populated in the function above
}

let averageTableExists = false


function addAverageTable(dataList, parentDiv) {
    let averageTable = '<table class="averageTable">'

    // dataSet list variable is declared in the local scope
    dataList.forEach(element => {
        averageTable += '<tr><td>' + element[0] + '</td><td>' + element[1] + '</td></tr>'
    });

    averageTable += '</table>'
    parentDiv.insertAdjacentHTML('beforeend', averageTable)

    averageTableExists = true
}
