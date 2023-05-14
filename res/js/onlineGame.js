import { socket } from "./main.js";
import { setShipPositions } from "./prepareGame.js";



const gamePlayerName = document.querySelector('.game__name.gamePlayerName');
const gameBotName = document.querySelector('.game__name.gameBotName');
const gameTurnName = document.querySelector('.gameTurn__name');

let canClick = false;

let playerName,
    enemyName;


export function startOnlineGame(data){
    console.log(data);

    playerName = data.playerName;
    enemyName = data.enemyName;

    canClick = data.isCreator;

    gameHandler(data);
}

function gameHandler(data){
    setShipPositions(data.enemyInfo, 0);
    setShipPositions(data.playerInfo, 1);

    eventHandler();

    console.log('you: ' + playerName);
    console.log('enemy: ' + enemyName);
}


// Event handler
const enemyFieldBxs = Array.from(document.querySelectorAll('.gameBotField.fieldBx'));
const enemyFieldCovers = Array.from(document.querySelectorAll('.botShip__cover'));

let hittedBxs = [],
    hittedCovers = [];

function eventHandler(){
    enemyFieldBxs.forEach(bx => {
        bx.addEventListener('click', () => {
            if(!canClick || hittedBxs.indexOf(bx) !== -1) return;
            canClick = false;

            bx.style.backgroundColor = "#ff5858";
            let bxCoord = JSON.parse(bx.getAttribute('data-field-coord'));

            hittedBxs.push(bx);
            changeTurnText();
            
            socket.emit('ship-miss', bxCoord);
        })
    })

    enemyFieldCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            if(!canClick || hittedCovers.indexOf(cover) !== -1) return;
            canClick = false;

            cover.style.opacity = "0";

            let coverCoord = JSON.parse(cover.getAttribute('data-ship-coord'));

            hittedCovers.push(cover);

            if(hittedCovers.length === enemyFieldCovers.length){
                socket.emit('playerWin');
            }

            changeTurnText();
            
            socket.emit('ship-hit', coverCoord);
        })
    })
}

// Get hits
const fieldContainers = document.querySelectorAll('.gamePlayer__fieldContainer');
const fieldBxs = [];

fieldContainers.forEach(container => {
    fieldBxs.push(container.querySelectorAll('.gamePlayerField.fieldBx'));
})

const fieldCovers = Array.from(document.querySelectorAll('.playerShip__cover'));

window.addEventListener('load', () => {
    // Get miss-hit
    socket.on('get-ship-miss', (bxCoord) => {
        console.log('missed something');
        fieldBxs[bxCoord.y][bxCoord.x].style.backgroundColor = "#ff5858";

        canClick = true;

        changeTurnText();
    })

    // Get hit
    socket.on('get-ship-hit', (coverCoord) => {
        console.log('got something');
        const coverCoordString = JSON.stringify(coverCoord);

        fieldCovers.map(cover => {if(cover.getAttribute('data-ship-coord') === coverCoordString) cover.style.opacity = 0; return});

        canClick = true;

        changeTurnText();
    })
})


// Function to change turn texts
function changeTurnText(){
    if(canClick){
        // Your turn
        gamePlayerName.classList.add('playerMove');
        gameBotName.classList.remove('playerMove');

        gameTurnName.innerText = playerName;
    }
    else{
        // Enemy turn
        gamePlayerName.classList.remove('playerMove');
        gameBotName.classList.add('playerMove');

        gameTurnName.innerText = enemyName;
    }
}