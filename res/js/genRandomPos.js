import { shipPositions } from "./gameSetting.js";


// Randomly generate ship positions
let shipCount = shipPositions.length;
let shipRandomCoords = Array.from(Array(shipCount), () => ({position: {x: undefined, y: undefined}, coords: [], rotated: false}));

export function generateShipPosition(){

    let breaked = false;

    do {
        breaked = false;

        for (let index = 0; index < shipCount; index++) {
            shipRandomCoords[index] = {position: {x: undefined, y: undefined}, coords: [], rotated: false};

            let rotated = Math.random() > 0.5 ? true : false;
            let shipSize = shipPositions[index].size; // 3
    
            let rotX = rotated ? shipSize : 1;
            let rotY = !rotated ? shipSize : 1;

            shipRandomCoords[index].rotated = rotated;

            let genShipPos = {
                x: undefined,
                y: undefined
            };
    
            let isColl = false;
    
            let currentAttempt = 0;
    
            do {
                currentAttempt++;

                shipRandomCoords[index].position = {x: undefined, y: undefined};
                shipRandomCoords[index].coords = [];
    
                do {
                    genShipPos = {
                        x: randomNum(0, 8),
                        y: randomNum(0, 8)
                    };
                } while (genShipPos.x + rotX > 9 || genShipPos.y + rotY > 9);

                shipRandomCoords[index].position = genShipPos;
        
                if(rotated){
                    // Increase x
        
                    for (let i = 0; i < shipSize; i++) {
                        let currGenPos = {
                            x: genShipPos.x + i,
                            y: genShipPos.y
                        }
        
                        shipRandomCoords[index].coords.push(currGenPos);
                    }
                }
                else{
                    // Increase y
        
                    for (let i = 0; i < shipSize; i++) {
                        let currGenPos = {
                            x: genShipPos.x,
                            y: genShipPos.y + i
                        }
        
                        shipRandomCoords[index].coords.push(currGenPos);
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
    return shipRandomCoords;
}



// Check border collision
let currentShipPosition = [],
    currShipAllPos = [];

function checkBorderCollision(rotated, rotX, rotY, position, currentShipIndex){
    let currentCoords = [];
    currentShipPosition = [];

    shipRandomCoords.forEach((ship, index) => {
        if(!ship.coords.length || currentShipIndex === index) return;

        ship.coords.map(coord => currentCoords.push(coord));
    })

    if(!currentCoords.length) return false;

    setBordersAndPos(rotated, rotX, rotY, position, currentShipIndex);

    currShipAllPos = shipRandomCoords[currentShipIndex].coords;
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
            currentShipPosition.push({x: position.x, y: position.y - 1});
        }

        if(position.y !== (9 - shipHeightCount)){
            currentShipPosition.push({x: position.x, y: position.y + shipHeightCount});
        }


        // Left and right side of non-rotated
        if(position.x !== 0){
            for (let i = 0; i < (shipHeightCount + 2); i++) {
                if(
                    (i === 0 && position.y === 0) ||
                    (i === (shipHeightCount + 1) && position.y === (9 - shipHeightCount))
                ) continue;

                currentShipPosition.push({x: position.x - shipWidthCount, y: position.y - 1 + i});
            }
        }

        if(position.x !== (9 - shipWidthCount)){
            for (let i = 0; i < (shipHeightCount + 2); i++) {
                if(
                    (i === 0 && position.y === 0) ||
                    (i === (shipHeightCount + 1) && position.y === (9 - shipHeightCount))
                ) continue;

                currentShipPosition.push({x: position.x + shipWidthCount, y: position.y - 1 + i});
            }
        }
    }
    else{
        // Rotated
        // Left and right side of rotated
        if(position.x !== 0){
            currentShipPosition.push({x: position.x - 1, y: position.y});
        }

        if(position.x !== (9 - shipWidthCount)){
            currentShipPosition.push({x: position.x + shipWidthCount, y: position.y});
        }

        // Top and bottom side of rotated
        if(position.y !== 0){
            for (let i = 0; i < (shipWidthCount + 2); i++) {
                if(
                    (i === 0 && position.x === 0) ||
                    (i === (shipWidthCount + 1) && position.x === (9 - shipWidthCount))
                ) continue;

                currentShipPosition.push({x: position.x - 1 + i, y: position.y - 1});
            }
        }

        if(position.y !== (9 - shipHeightCount)){
            for (let i = 0; i < (shipWidthCount + 2); i++) {
                if(
                    (i === 0 && position.x === 0) ||
                    (i === (shipWidthCount + 1) && position.x === (9 - shipWidthCount))
                ) continue;

                currentShipPosition.push({x: position.x - 1 + i, y: position.y + 1});
            }
        }
    }
}



// Helper function to generate random num
function randomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}