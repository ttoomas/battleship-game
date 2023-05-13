import { shipPositions } from "./gameSetting.js";
import { setPlayerShips } from "./prepareGame.js";


const startGameBtn = document.querySelector('.create__fieldBtn.fieldContinue.createBot');

const createSection = document.querySelector('.create');
const gameSection = document.querySelector('.game');
const winSection = document.querySelector('.win');
const winTitle = document.querySelector('.win__title');

startGameBtn.addEventListener('click', () => {
    console.log('Just started the game');
    console.log(shipPositions);
    console.log('---------------');

    startBotGame();
})


// Function to start the game
function startBotGame(){
    createSection.classList.remove('activeCreate');
    gameSection.classList.add('activeGame');

    setPlayerShips();

    gameFunctions();

    shipPositions.map(info => {
        info.coords.map(coord => playerShipCoords.push(coord));
    })
}


// Game variables
const botFieldEach = document.querySelectorAll('.gameBotField.fieldBx');
const botShipCovers = Array.from(document.querySelectorAll('.botShip__cover'));

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



// Enable game functions
let playerHitFields = [];

function gameFunctions(){
    botFieldEach.forEach(field => {
        field.addEventListener('click', () => {
            // if(playerHitFields.indexOf(field) !== -1) return;

            field.style.backgroundColor = "red";

            playerHitFields.push(field);

            botPlay();
        })
    })

    botShipCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            let hitCoverIndex = botShipCovers.indexOf(cover);

            if(hitCoverIndex === -1) return;
            
            cover.classList.add('disabled');
            
            botShipCovers.splice(hitCoverIndex, 1);
            
            if(botShipCovers.length <= 0){
                console.log('player win :)');
                winSection.style.display = "flex";
                
                return;
            }
            
            botPlay();
        })
    })
}

// Bot generate random coords
let playerShipCoords = [];

let hitted = false,
    secondHit = false;
let sides = ['top', 'right', 'bottom', 'left'];
let generatedCoords;
let currSide;

let oldCoords = {x: undefined, y: undefined};
const botAllCoords = [];


function botPlay(){
    if(hitted){
        if(
            !secondHit ||
            (currSide === 'left' && generatedCoords.x <= 0) ||
            (currSide === 'right' && generatedCoords.x >= 8) ||
            (currSide === 'top' && generatedCoords.y <= 0) ||
            (currSide === 'bottom' && generatedCoords.y >= 8)
        ){

            if(generatedCoords.x >= 8){
                let delSideIndex = sides.indexOf('right');

                if(delSideIndex >= 0) sides.splice(delSideIndex, 1);
            }

            if(generatedCoords.x <= 0){
                let delSideIndex = sides.indexOf('left');

                if(delSideIndex >= 0) sides.splice(delSideIndex, 1);
            }

            if(generatedCoords.y >= 8){
                let delSideIndex = sides.indexOf('bottom');

                if(delSideIndex >= 0) sides.splice(delSideIndex, 1);
            }

            if(generatedCoords.y <= 0){
                let delSideIndex = sides.indexOf('top');

                if(delSideIndex >= 0) sides.splice(delSideIndex, 1);
            }


            let sideIndex = randomNum(0, (sides.length - 1));
    
            currSide = sides[sideIndex];
    
            sides.splice(sideIndex, 1);

            generatedCoords.x = oldCoords.x;
            generatedCoords.y = oldCoords.y;
        }
        
        switchSide(1);
    }
    else{
        do {
            generatedCoords = {
                x: randomNum(0, 8),
                y: randomNum(0, 8)
            };
        } while (botAllCoords.some(coord => coord.x === generatedCoords.x && coord.y === generatedCoords.y))

        oldCoords.x = generatedCoords.x;
        oldCoords.y = generatedCoords.y;
    }

    botAllCoords[botAllCoords.length] = {};
    botAllCoords[botAllCoords.length - 1].x = generatedCoords.x;
    botAllCoords[botAllCoords.length - 1].y = generatedCoords.y;

    let hit = playerShipCoords.some(shipCoord => shipCoord.x === generatedCoords.x && shipCoord.y === generatedCoords.y);
    let hitShipCoord = playerShipCoords.findIndex(shipCoord => shipCoord.x === generatedCoords.x && shipCoord.y === generatedCoords.y)

    if(hit && hitShipCoord !== -1){
        // Hitted
        playerShipCoords.splice(hitShipCoord, 1);

        let shipCover = Array.from(playerShipCovers).find(x => x.getAttribute('data-ship-coord') == JSON.stringify(generatedCoords));

        shipCover.classList.add('disabled');

        if(hitted) secondHit = true;
        hitted = true;

        let destroyed = true;
        Array.from(shipCover.parentNode.querySelectorAll('.playerShip__cover')).map(cover => {if(!cover.classList.contains('disabled')) destroyed = false});

        if(destroyed){
            hitted = false;
            secondHit = false;
            sides = ['top', 'right', 'bottom', 'left'];
            generatedCoords;
            currSide;

            oldCoords = {x: undefined, y: undefined};
        }

        if(playerShipCoords.length <= 0){
            console.log('Bot win :)');
            winSection.style.display = "flex";
            winTitle.innerText = "unfortunately, the bot won";
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