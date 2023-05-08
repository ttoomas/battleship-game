import { createHtmlFields } from "./createField.js";
import { shipPositions } from "./gameSetting.js";
import { generateShipPosition } from "./generatePos.js";


const startGameBtn = document.querySelector('.create__fieldBtn.fieldContinue');


startGameBtn.addEventListener('click', () => {
    console.log('Just started the game');
    console.log(shipPositions);
    console.log('---------------');
})


// Game variables
const botFieldEach = document.querySelectorAll('.gameBotField.fieldBx');
const botShipCovers = document.querySelectorAll('.botShip__cover');

const botFieldContainers = document.querySelectorAll('.gameBot__fieldContainer');
const botFieldBxs = [];

botFieldContainers.forEach(container => {
    botFieldBxs.push(container.querySelectorAll('.gameBotField.fieldBx'));
})

const playerFieldEach = document.querySelectorAll('.gamePlayerField.fieldBx');
const playerShipCovers = document.querySelectorAll('.playerShip__cover');

const playerFieldContainers = document.querySelectorAll('.gamePlayer__fieldContainer');
const playerFieldBxs = [];

playerFieldContainers.forEach(container => {
    playerFieldBxs.push(container.querySelectorAll('.gamePlayerField.fieldBx'));
})



// After clicking on start game button
gameFunctions();
// setPlayerShips();


// Enable game functions
function gameFunctions(){
    botFieldEach.forEach(field => {
        field.addEventListener('click', () => {
            field.style.backgroundColor = "red";

            botPlay();
        })
    })

    botShipCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            cover.classList.add('disabled');

            console.log('hit');

            botPlay();
        })
    })
}

// Bot generate random coords
// console.log(shipPositions);
let playerShipCoords = [];

shipPositions.map(info => {
    info.coords.map(coord => playerShipCoords.push(coord));
})

// console.log(playerShipCoords);

function botPlay(){
    const generatedCoords = {
        x: randomNum(0, 8),
        y: randomNum(0, 8)
    }

    console.log(generatedCoords);

    let hit = playerShipCoords.some(shipCoord => shipCoord.x === generatedCoords.x && shipCoord.y === generatedCoords.y);

    if(hit){
        // Hitted
        let shipCover = Array.from(playerShipCovers).find(x => x.getAttribute('data-ship-coord') == JSON.stringify(generatedCoords));

        shipCover.classList.add('disabled');
    }
    else{
        // Missed
    }
}


// Helper function to generate random num
function randomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}