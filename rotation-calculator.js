const sebis_rotation = {
    1: "Push",
    2: "Pull",
    3: "Rest1/Legs",
    4: "Rest2"
}

var rotation = {
}

function setRotation(newRotation) {
    rotation = newRotation
}

function onLoad() {
    rotation = sebis_rotation
    displayOptions(rotation)
}

function getElement(elementId) {
    return document.getElementById(elementId)
}

function getElementValue(elementId) {
    return document.getElementById(elementId).value
}

function filterText(text) {
    var splitTextArea = text.replace(/(\r\n|\n|\r)/gm, " ").split(" ")
    return splitTextArea.filter(value => {
        return value != ""
    })
}

function handleSubmit() {

    const inputType = document.getElementById("input-type").value
    console.log(inputType)
    if (inputType == 1)
        getTextArea(getElementValue("typed-rotation"))
    else if (inputType == 2)
        readFile(getElement("file-upload"))
}

function getTextArea(textArea) {

    newRotation = {}
    filterText(textArea).forEach((element, index) => {
        newRotation[index + 1] = element
    })
    displayOptions(newRotation)
}

function readFile(input) {

    var file = input.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {

        var lines = this.result.split(/\r\n|\n/);
        for (var line = 0; line < lines.length; line++) {
            rotation[line + 1] = lines[line]
        }
        displayOptions(rotation)
    };
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function addOptions(selectElement, options) {
    Object.keys(options).forEach((option) => {
        var newOption = document.createElement("option");
        newOption.text = options[option];
        newOption.value = option
        selectElement.options.add(newOption, null)
    })
}

function displayOptions(options) {
    var select = document.getElementById("select");
    removeOptions(select)
    addOptions(select, options)
}

function getSelectedOption(elementId) {
    return Number(document.getElementById(elementId).value);
}

function calculate() {

    try {
        console.log(sebis_rotation)
        const today = new Date();
        const inputDay = document.getElementById("input-day").valueAsDate
        const differenceInMs = inputDay.getTime() - today.getTime();
        const differenceInDays = Math.ceil(differenceInMs / (1000 * 3600 * 24));
        const dayTypeSelected = getSelectedOption("select")

        var theDay = dayTypeSelected

        for (var i = 0; i < differenceInDays; i++) {
            if (theDay === Object.keys(rotation).length)
                theDay = 0
            theDay = theDay + 1
        }

        document.getElementById("result").innerHTML = formatDate(inputDay) + " will be a " + rotation[theDay] + " day.";

    }
    catch (err) {
        if (err instanceof TypeError)
            document.getElementById("result").innerHTML = "You must specify a date to be calculated."
    }
}

function checkMode() {
    const mode = getSelectedOption("mode")
    var fileInput = document.getElementById("custom")
    if (mode === 2)
        fileInput.style.display = "block";
    else if (mode === 1) {
        fileInput.style.display = "none";
        setRotation(sebis_rotation)
    }
}

function checkInputType() {

    const mode = getSelectedOption("input-type")
    const manual = getElement("typed-rotation")
    const file = getElement("file-upload")

    if (mode === 1)
    {
        manual.style.display = "block";
        file.style.display = "none";
    }
    else if (mode === 2) {
        file.style.display = "block";
        manual.style.display = "none";
    }
}


function formatDate(date) {
    return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}