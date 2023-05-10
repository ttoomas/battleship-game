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

let hitted = false,
    secondHit = false;
let sides = ['top', 'right', 'bottom', 'left'];
let generatedCoords;
let currSide;

let oldCoords = {x: undefined, y: undefined};


function botPlay(){
    if(hitted){
        if(
            !secondHit ||
            (currSide === 'left' && generatedCoords.x <= 0) ||
            (currSide === 'right' && generatedCoords.x >= 8) ||
            (currSide === 'top' && generatedCoords.y <= 0) ||
            (currSide === 'bottom' && generatedCoords.y >= 8)
        ){
            let sideIndex = randomNum(0, (sides.length - 1));
    
            currSide = sides[sideIndex];
    
            sides.splice(sideIndex, 1);

            generatedCoords.x = oldCoords.x;
            generatedCoords.y = oldCoords.y;
        }
        
        switchSide(1);
    }
    else{
        generatedCoords = {
            x: randomNum(0, 8),
            y: randomNum(0, 8)
        };

        oldCoords.x = generatedCoords.x;
        oldCoords.y = generatedCoords.y;
    }

    let hit = playerShipCoords.some(shipCoord => shipCoord.x === generatedCoords.x && shipCoord.y === generatedCoords.y);

    if(hit){
        // Hitted
        let shipCover = Array.from(playerShipCovers).find(x => x.getAttribute('data-ship-coord') == JSON.stringify(generatedCoords));

        shipCover.classList.add('disabled');

        if(hitted) secondHit = true;
        hitted = true;

        let destroyed = true;
        Array.from(shipCover.parentNode.querySelectorAll('.playerShip__cover')).map(cover => {if(!cover.classList.contains('disabled')) destroyed = false});

        console.log(destroyed);
        if(destroyed){
            hitted = false;
            secondHit = false;
            sides = ['top', 'right', 'bottom', 'left'];
            generatedCoords;
            currSide;

            oldCoords = {x: undefined, y: undefined};
        }
    }
    else{
        // Missed
        playerFieldBxs[generatedCoords.y][generatedCoords.x].style.backgroundColor = "red";

        if(hitted) secondHit = false;

        if(!currSide) return;

        switchSide(-1);
    }
}

function switchSide(add){
    switch(currSide){
        case 'top': {
            generatedCoords.y -= add;
            
            break;
        }
        case 'bottom': {
            generatedCoords.y += add;
            
            break;
        }
        case 'right': {
            generatedCoords.x += add;

            break;
        }
        case 'left': {
            generatedCoords.x -= add;

            break;
        }
        default: {
            console.error('No side')
        }
    }
}


// Helper function to generate random num
function randomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}