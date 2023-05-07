import { createHtmlFields } from "./createField.js";
import { shipPositions } from "./gameSetting.js";
import { generateShipPosition } from "./generatePos.js";


const startGameBtn = document.querySelector('.create__fieldBtn.fieldContinue');


startGameBtn.addEventListener('click', () => {
    console.log('Just started the game');
    console.log(shipPositions);
    console.log('---------------');
})


// Enable game functions
const gameFieldEach = document.querySelectorAll('.gameBotField.fieldBx');
const gameShipCovers = document.querySelectorAll('.gameShip__cover');

const gameBotFieldContainers = document.querySelectorAll('.gameBot__fieldContainer');
const gameBotFieldBxs = [];

gameBotFieldContainers.forEach(container => {
    gameBotFieldBxs.push(container.querySelectorAll('.gameBotField.fieldBx'));
})

function gameFunctions(){
    gameFieldEach.forEach(field => {
        field.addEventListener('click', () => {
            field.style.backgroundColor = "red";
        })
    })

    gameShipCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            cover.classList.add('disabled');

            console.log('hit');
        })
    })
}

gameFunctions();