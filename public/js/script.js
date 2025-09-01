
let selectWard = document.querySelector('#ward');

let wards = ["Meiran", "Abule-egba", "Alakuko","Sango", "Oju-Ore", "Iyana-paja", "Ijoko", "Iyana-iyesi", "Orile-agege"];


    wards.forEach(element => {
        const optionElement = document.createElement('option')
        optionElement.value = element
        optionElement.textContent = element
        selectWard.append(optionElement)
    });