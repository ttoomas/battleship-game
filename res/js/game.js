import { createFieldBxs } from "./create.js";
import { shipPositions } from "./gameSetting.js";


const startGameBtn = document.querySelector('.create__continueBtn');
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



// Randomly generate ship positions
let shipCount = shipPositions.length;
// let shipCount = 2;
let shipRandomCoords = Array.from(Array(shipCount), () => []);


function generateShipPosition(){
    let breaked = false;

    do {
        breaked = false;

        for (let index = 0; index < shipCount; index++) {
            let rotated = Math.random() > 0.5 ? true : false;
            let shipSize = shipPositions[index].size; // 3
    
            let rotX = rotated ? shipSize : 1;
            let rotY = !rotated ? shipSize : 1;
    
            let genShipPos = {
                x: undefined,
                y: undefined
            };
    
            let isColl = false;
    
            let currentAttempt = 0;
    
            do {
                currentAttempt++;
    
                do {
                    genShipPos = {
                        x: randomNum(0, 8),
                        y: randomNum(0, 8)
                    };
                } while (genShipPos.x + rotX > 9 || genShipPos.y + rotY > 9);
    
                shipRandomCoords[index] = [];
        
                if(rotated){
                    // Increase x
        
                    for (let i = 0; i < shipSize; i++) {
                        let currGenPos = {
                            x: genShipPos.x + i,
                            y: genShipPos.y
                        }
        
                        shipRandomCoords[index].push(currGenPos);
                    }
                }
                else{
                    // Increase y
        
                    for (let i = 0; i < shipSize; i++) {
                        let currGenPos = {
                            x: genShipPos.x,
                            y: genShipPos.y + i
                        }
        
                        shipRandomCoords[index].push(currGenPos);
                    }
                }
    
                setBordersAndPos(rotated, rotX, rotY, genShipPos, index);
                isColl = checkBorderCollision(rotated, rotX, rotY, genShipPos, index);
    
                if(currentAttempt >= 10){
                    breaked = true;
                    break;
                }
            } while (isColl);
        }
    } while (breaked)

    
    // Show it on field
    shipRandomCoords.forEach((coords, index) => {
        coords.forEach(coord => {
            createFields[coord.y][coord.x].style.backgroundColor = `hsl(${index * 80}, 100%, 50%)`;
        })
    })
}



// Check border collision
let currentShipPosition = [],
    currShipAllPos = [];

function checkBorderCollision(rotated, rotX, rotY, position, currentShipIndex){
    let currentCoords = [];
    currentShipPosition = [];

    shipRandomCoords.forEach((ship, index) => {
        if(!ship.length || currentShipIndex === index) return;

        ship.map(coord => currentCoords.push(coord));
    })

    if(!currentCoords.length) return false;

    setBordersAndPos(rotated, rotX, rotY, position, currentShipIndex);

    currShipAllPos = shipRandomCoords[currentShipIndex];
    currShipAllPos.map(coord => currentShipPosition.push(coord));

    let isColl = false;

    currentShipPosition.forEach(shipPos => {
        if(isColl) return;

        let is = currentCoords.filter(e => JSON.stringify(e) === JSON.stringify(shipPos));

        if(is.length){
            isColl = true;
            return;
        }
    })

    if(isColl) return true;
    else return false;
}

// Set borders
function setBordersAndPos(rotated, rotX, rotY, position, currentShipIndex, type){
    currentShipPosition = [];

    let shipWidthCount = rotX;
    let shipHeightCount = rotY;

    if(!rotated){
        // Non-Rotated
        // Top and bottom side of non-rotated
        if(position.y !== 0){
            let oldAttribute = createFieldBxs[position.y - 1][position.x].getAttribute('data-ship-id');

            currentShipPosition.push({x: position.x, y: position.y - 1});

            if(type === "borders"){
                if(oldAttribute !== null){
                    let splitedAttr = oldAttribute.split(' ');
    
                    if(!splitedAttr.includes(currentShipIndex.toString())){
                        createFieldBxs[position.y - 1][position.x].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                    }
                }
                else{
                    createFieldBxs[position.y - 1][position.x].setAttribute(`data-ship-id`, (currentShipIndex));
                }
            }
        }

        if(position.y !== (9 - shipHeightCount)){
            let oldAttribute = createFieldBxs[position.y + shipHeightCount][position.x].getAttribute('data-ship-id');

            currentShipPosition.push({x: position.x, y: position.y + shipHeightCount});

            if(type === "borders"){
                if(oldAttribute !== null){
                    let splitedAttr = oldAttribute.split(' ');
    
                    if(!splitedAttr.includes(currentShipIndex.toString())){
                        createFieldBxs[position.y + shipHeightCount][position.x].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                    }
                }
                else{
                    createFieldBxs[position.y + shipHeightCount][position.x].setAttribute(`data-ship-id`, (currentShipIndex));
                }
            }
        }


        // Left and right side of non-rotated
        if(position.x !== 0){
            for (let i = 0; i < (shipHeightCount + 2); i++) {
                if(
                    (i === 0 && position.y === 0) ||
                    (i === (shipHeightCount + 1) && position.y === (9 - shipHeightCount))
                ) continue;

                currentShipPosition.push({x: position.x - shipWidthCount, y: position.y - 1 + i});
                
                if(type === "borders"){
                    let oldAttribute = createFieldBxs[position.y - 1 + i][position.x - shipWidthCount].getAttribute('data-ship-id');
    
                    if(oldAttribute !== null){
                        let splitedAttr = oldAttribute.split(' ');
    
                        if(!splitedAttr.includes(currentShipIndex.toString())){
                            createFieldBxs[position.y - 1 + i][position.x - shipWidthCount].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                        }
                    }
                    else{
                        createFieldBxs[position.y - 1 + i][position.x - shipWidthCount].setAttribute(`data-ship-id`, (currentShipIndex));
                    }
                }
            }
        }

        if(position.x !== (9 - shipWidthCount)){
            for (let i = 0; i < (shipHeightCount + 2); i++) {
                if(
                    (i === 0 && position.y === 0) ||
                    (i === (shipHeightCount + 1) && position.y === (9 - shipHeightCount))
                ) continue;

                currentShipPosition.push({x: position.x + shipWidthCount, y: position.y - 1 + i});
                
                if(type === "borders"){
                    let oldAttribute = createFieldBxs[position.y - 1 + i][position.x + shipWidthCount].getAttribute('data-ship-id');
    
                    if(oldAttribute !== null){
                        let splitedAttr = oldAttribute.split(' ');
    
                        if(!splitedAttr.includes(currentShipIndex.toString())){
                            createFieldBxs[position.y - 1 + i][position.x + shipWidthCount].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                        }
                    }
                    else{
                        createFieldBxs[position.y - 1 + i][position.x + shipWidthCount].setAttribute(`data-ship-id`, (currentShipIndex));
                    }
                }
            }
        }
    }
    else{
        // Rotated
        // Left and right side of rotated
        if(position.x !== 0){
            let oldAttribute = createFieldBxs[position.y][position.x - 1].getAttribute('data-ship-id');

            currentShipPosition.push({x: position.x - 1, y: position.y});
            
            if(type === "borders"){
                if(oldAttribute !== null){
                    let splitedAttr = oldAttribute.split(' ');
    
                    if(!splitedAttr.includes(currentShipIndex.toString())){
                        createFieldBxs[position.y][position.x - 1].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                    }
                }
                else{
                    createFieldBxs[position.y][position.x - 1].setAttribute(`data-ship-id`, (currentShipIndex));
                }
            }
        }

        if(position.x !== (9 - shipWidthCount)){
            let oldAttribute = createFieldBxs[position.y][position.x + shipWidthCount].getAttribute('data-ship-id');

            currentShipPosition.push({x: position.x + shipWidthCount, y: position.y});
            
            if(type === "borders"){
                if(oldAttribute !== null){
                    let splitedAttr = oldAttribute.split(' ');
    
                    if(!splitedAttr.includes(currentShipIndex.toString())){
                        createFieldBxs[position.y][position.x + shipWidthCount].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                    }
                }
                else{
                    createFieldBxs[position.y][position.x + shipWidthCount].setAttribute(`data-ship-id`, (currentShipIndex));
                }
            }
        }

        // Top and bottom side of rotated
        if(position.y !== 0){
            for (let i = 0; i < (shipWidthCount + 2); i++) {
                if(
                    (i === 0 && position.x === 0) ||
                    (i === (shipWidthCount + 1) && position.x === (9 - shipWidthCount))
                ) continue;

                currentShipPosition.push({x: position.x - 1 + i, y: position.y - 1});
                
                if(type === "borders"){
                    let oldAttribute = createFieldBxs[position.y - 1][position.x - 1 + i].getAttribute('data-ship-id');
    
                    if(oldAttribute !== null){
                        let splitedAttr = oldAttribute.split(' ');
    
                        if(!splitedAttr.includes(currentShipIndex.toString())){
                            createFieldBxs[position.y - 1][position.x - 1 + i].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                        }
                    }
                    else{
                        createFieldBxs[position.y - 1][position.x - 1 + i].setAttribute(`data-ship-id`, (currentShipIndex));
                    }
                }
            }
        }

        if(position.y !== (9 - shipHeightCount)){
            for (let i = 0; i < (shipWidthCount + 2); i++) {
                if(
                    (i === 0 && position.x === 0) ||
                    (i === (shipWidthCount + 1) && position.x === (9 - shipWidthCount))
                ) continue;

                currentShipPosition.push({x: position.x - 1 + i, y: position.y + 1});
                
                if(type === "borders"){
                    let oldAttribute = createFieldBxs[position.y + 1][position.x - 1 + i].getAttribute('data-ship-id');
    
                    if(oldAttribute !== null){
                        let splitedAttr = oldAttribute.split(' ');
    
                        if(!splitedAttr.includes(currentShipIndex.toString())){
                            createFieldBxs[position.y + 1][position.x - 1 + i].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                        }
                    }
                    else{
                        createFieldBxs[position.y + 1][position.x - 1 + i].setAttribute(`data-ship-id`, (currentShipIndex));
                    }
                }
            }
        }
    }
}



generateShipPosition();



// Helper function to generate random num
function randomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}