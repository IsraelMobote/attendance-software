
require("dotenv").config()

// function to supply the options element for select element
function populateSelect(list, parentElement) {
    parentElement.innerHTML = " "
    list.forEach(element => {
        const optionElement = document.createElement('option')
        optionElement.value = element
        parentElement.append(optionElement)
    });
}

module.exports = { populateSelect }