
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

nameInput.addEventListener("input", function () {
    if (nameInput.value.length > 1) {
        let url = "/participant/getNames/"
        fetch(url)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw Error("Network response was not OK");
            })
            .then(function (data) {
                populateDiv(data, parNames);
            })
            .catch(function (error) {
                console.log('There was a problem: ', error.message)
            })

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
                parentDiv.style.display = 'block'
            }
        }
    }
    else {
        parNames.innerHTML = ""
    }
})

