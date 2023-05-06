import { shipPositions } from "./gameSetting.js";
import { generateShipPosition } from "./genRandomPos.js";


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

    // Delete ships
    createShipContainers.forEach(ship => {
        ship.style.display = "none";
    })

    // Reset background
    eachCreateFields.forEach(field => {
        field.style.backgroundColor = "#0093ff45";
    })

    // Change background of ship positions
    let allShipCoords = [];

    shipPositions.forEach(shipInfo => {
        if(!shipInfo.coords.length) return;

        shipInfo.coords.map(coords => allShipCoords.push(coords));
    })

    if(!allShipCoords.length) return;

    allShipCoords.forEach((coord) => {
        createFields[coord.y][coord.x].style.backgroundColor = "orange";
    })
})