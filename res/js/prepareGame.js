import { createHtmlFields } from "./createField.js";
import { generateShipPosition } from "./generatePos.js";

const gamePlayerField = document.querySelector('.player__field');
const gameBotField = document.querySelector('.bot__field');

createHtmlFields(gamePlayerField, "gamePlayer");
createHtmlFields(gameBotField, "gameBot");

let generatedPos = generateShipPosition();

console.log(generatedPos);

// Set ships transform origin
const gameShipContainers = document.querySelectorAll('.gameShip__container');

gameShipContainers.forEach(container => {
    let size = parseInt(getComputedStyle(container).getPropertyValue('--game-ship-size'));

    let centerOrigin = size % 2 !== 0 ? true : false;

    let origin = centerOrigin ? "center center" : `${size / 2 * 60}px ${size / 2 * 60}px`;

    container.style.transformOrigin = origin;
})

// Place ships to bot field
const botFieldInfo = gameBotField.getBoundingClientRect();

generatedPos.forEach((info, index) => {
    console.log(info.position.x, info.position.y);

    if(index !== 0) return;

    const shipPos = {
        x: botFieldInfo.left + ((info.position.x + 1) * 60),
        y: botFieldInfo.top + ((info.position.y + 1) * 60),
        rotated: info.rotated ? "90deg" : "0deg"
    }

    gameShipContainers[index].style.left = `${shipPos.x}px`;
    gameShipContainers[index].style.top = `${shipPos.y}px`;
    gameShipContainers[index].style.rotate = shipPos.rotated;
})