import { createHtmlFields } from "./createField.js";
import { shipPositions } from "./gameSetting.js";
import { generateShipPosition } from "./generatePos.js";

const gamePlayerField = document.querySelector('.player__field');
const gameBotField = document.querySelector('.bot__field');

// Generate game fields
createHtmlFields(gamePlayerField, "gamePlayer");
createHtmlFields(gameBotField, "gameBot");


// Generate ship positions
let generatedPos = generateShipPosition();

// Set bot and player ships transform origin
const botShipContainers = Array.from(document.querySelectorAll('.botShip__container'));
const playerShipContainers = Array.from(document.querySelectorAll('.playerShip__container'));

let shipContainers = botShipContainers.concat(playerShipContainers);

shipContainers.forEach(container => {
    let size = parseInt(getComputedStyle(container).getPropertyValue('--game-ship-size'));

    let origin = `${size / 2 * 60}px ${size / 2 * 60}px`;

    container.style.transformOrigin = origin;
})

// Place bot ships to bot field
const botFieldInfo = gameBotField.getBoundingClientRect();

generatedPos.forEach((info, index) => {
    const shipPos = {
        x: botFieldInfo.left + ((info.position.x + 1) * 60),
        y: botFieldInfo.top + ((info.position.y + 1) * 60),
        rotated: info.rotated ? "90deg" : "0deg"
    }

    botShipContainers[index].style.left = `${shipPos.x}px`;
    botShipContainers[index].style.top = `${shipPos.y}px`;
    botShipContainers[index].style.rotate = shipPos.rotated;
})



// Place player ships to player field
function setPlayerShips(){
    const playerFieldInfo = gamePlayerField.getBoundingClientRect();

    shipPositions.forEach((info, index) => {
        const shipPos = {
            x: playerFieldInfo.left + ((info.x + 1) * 60),
            y: playerFieldInfo.top + ((info.y + 1) * 60),
            rotated: info.rotated ? "90deg" : "0deg"
        }

        playerShipContainers[index].style.left = `${shipPos.x}px`;
        playerShipContainers[index].style.top = `${shipPos.y}px`;
        playerShipContainers[index].style.rotate = `${shipPos.rotated}`;

        let playerShipCovers = Array.from(playerShipContainers[index].querySelectorAll('.playerShip__cover'));
        if(info.rotated) playerShipCovers.reverse();

        info.coords.forEach((coord, coordIndex) => {
            playerShipCovers[coordIndex].setAttribute('data-ship-coord', JSON.stringify(coord))
        })
    })
}

setPlayerShips();