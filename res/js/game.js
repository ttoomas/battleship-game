import { createHtmlFields } from "./createField.js";
import { shipPositions } from "./gameSetting.js";
import { generateShipPosition } from "./generatePos.js";


const startGameBtn = document.querySelector('.create__fieldBtn.fieldContinue');
const createShipContainers = document.querySelectorAll('.create__shipContainer');
const createFieldContainers = document.querySelectorAll('.create__fieldContainer');
const eachCreateFields = document.querySelectorAll('.createField');

let createFields = [];

createFieldContainers.forEach(createContainer => {
    createFields.push(createContainer.querySelectorAll('.createField'));
})


startGameBtn.addEventListener('click', () => {
    console.log('Just started the game');
    console.log(shipPositions);
    console.log('---------------');
})