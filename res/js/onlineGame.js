import { socket } from "./main.js";
import { setShipPositions } from "./prepareGame.js";



let canClick = false;


export function startOnlineGame(data){
    console.log(data);

    canClick = data.isCreator;

    gameHandler(data);
}

function gameHandler(data){
    setShipPositions(data.enemyInfo, 0);
    setShipPositions(data.playerInfo, 1);

    eventHandler();
}


// Event handler
const enemyFieldBxs = document.querySelectorAll('.gameBotField.fieldBx');
const enemyFieldCovers = document.querySelectorAll('.botShip__cover');

function eventHandler(){
    enemyFieldBxs.forEach(bx => {
        bx.addEventListener('click', () => {
            if(!canClick) return;
            canClick = false;

            bx.style.backgroundColor = "red";

            let bxCoord = JSON.parse(bx.getAttribute('data-field-coord'));

            socket.emit('ship-miss', bxCoord);
        })
    })

    enemyFieldCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            if(!canClick) return;
            canClick = false;

            cover.style.opacity = "0";

            let coverCoord = JSON.parse(cover.getAttribute('data-ship-coord'));

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
        console.log('got something');
        fieldBxs[bxCoord.y][bxCoord.x].style.backgroundColor = "red";

        canClick = true;
    })

    // Get hit
    socket.on('get-ship-hit', (coverCoord) => {
        console.log('got something');
        const coverCoordString = JSON.stringify(coverCoord);

        fieldCovers.map(cover => {if(cover.getAttribute('data-ship-coord') === coverCoordString) cover.style.opacity = 0; return});

        canClick = true;
    })
})