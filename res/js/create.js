import { botShipPositions, shipPositions } from "./gameSetting.js";
import { genSetBordersAndPos, generateShipPosition } from "./generatePos.js";

// Crete fields
const fieldContinueBtn = document.querySelector('.create__fieldBtn.fieldContinue');

const createFields = document.querySelector('.create__fields');
export let createFieldBxs = Array.from(Array(9), () => []);
let createFieldEach = [];

for (let i = 0; i < 9; i++) {
    let newFieldBx = document.createElement('div');
    newFieldBx.classList.add('create__fieldContainer');
    createFields.appendChild(newFieldBx);

    for (let j = 0; j < 9; j++) {
        let newField = document.createElement('div');
        newField.classList.add('create__field', 'createField');
        newFieldBx.appendChild(newField);

        createFieldBxs[i].push(newField);
        createFieldEach.push(newField);
    }
}

// SET SHIP TRANSFORM ORIGIN
const shipBxs = document.querySelectorAll('.create__shipBx');

shipBxs.forEach(bx => {
    let size = parseInt(getComputedStyle(bx).getPropertyValue('--create-size-count'));

    let centerOrigin = size % 2 !== 0 ? true : false;

    let origin = centerOrigin ? "center center" : `${size / 2 * 60}px ${size / 2 * 60}px`;

    bx.style.transformOrigin = origin;
})


// MOVE WITH SHIP
const createShips = document.querySelectorAll('.create__shipBx');

let shipMove = false;
let currentShipIndex = 0,
    currentShipInfo,
    currShipHalfWidth,
    currShipHalfHeight;

let isShipInField = false,
    activeMoveShip = false,
    activeBorderDel = false,
    deleteCurrentBorder = false;

let mousePos = {x: undefined, y: undefined};
let createFieldsInfo = createFields.getBoundingClientRect();




let mouseShipPos = [
    {
        x: 0,
        y: 0
    },
    {
        x: 0,
        y: 0
    },
    {
        x: 0,
        y: 0
    },
    {
        x: 0,
        y: 0
    },
    {
        x: 0,
        y: 0
    },
    {
        x: 0,
        y: 0
    }
]


let currShipAllPos = {};


// Get current mouse position
window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    if(!shipMove) return;


    // Check if a ship is inside create field - left right top bottom
    if(
        createFieldsInfo.left <= mousePos.x &&
        createFieldsInfo.right >= mousePos.x &&
        createFieldsInfo.top <= mousePos.y &&
        createFieldsInfo.bottom >= mousePos.y
    ){
        let isFirst = false;
        
        if(!isShipInField) isFirst = true;

        isShipInField = true;

        // Stick it to the grid
        let fieldShipPos = {
            x: mousePos.x - createFieldsInfo.left - Math.floor(currShipHalfWidth / 60) * 60,
            y: mousePos.y - createFieldsInfo.top - Math.floor(currShipHalfHeight / 60) * 60
        }

        let currentHalfCount;
            currentShipInfo.width === 60 ? currentHalfCount = 0 : currentHalfCount = Math.floor((Math.max(currentShipInfo.height, currentShipInfo.width) / 60) / 2);
        let currentHalfSize = currentHalfCount * 60;

        let fixedFieldShipPos = {
            x: Math.max(Math.min((Math.floor(fieldShipPos.x / 60) * 60), (createFieldsInfo.width - currentShipInfo.width + currentHalfSize)), (0 + currentHalfSize)),
            y: Math.max(Math.min((Math.floor(fieldShipPos.y / 60) * 60), (createFieldsInfo.height - currentShipInfo.height)), (0 - currentHalfSize))
        }


        let shipPosInGrid = {
            x: (fixedFieldShipPos.x / 60) - currentHalfCount,
            y: (fixedFieldShipPos.y / 60) + currentHalfCount
        }
        
        mouseShipPos[currentShipIndex].x = shipPosInGrid.x;
        mouseShipPos[currentShipIndex].y = shipPosInGrid.y;


        let helpShipSize = 0;
        
        if(createShips[currentShipIndex].classList.contains('rotatedShip') && (Math.max(currentShipInfo.width, currentShipInfo.height) / 4) % 2 === 0){
            helpShipSize = currentHalfCount * 60;
        }

        let finalFieldsShipPos = {
            x: fixedFieldShipPos.x + createFieldsInfo.left - helpShipSize,
            y: fixedFieldShipPos.y + createFieldsInfo.top + helpShipSize
        }

        let oldShipPos = {
            x: shipPositions[currentShipIndex].x,
            y: shipPositions[currentShipIndex].y,
        }

        shipPositions[currentShipIndex].x = shipPosInGrid.x;
        shipPositions[currentShipIndex].y = shipPosInGrid.y;

        if(
            finalFieldsShipPos.x !== currentShipInfo.left ||
            finalFieldsShipPos.y !== currentShipInfo.top
        ){
            updateShipCoords();

            let isCollision = checkBorderCollision();


            if(isCollision){
                if(!isFirst){
                    shipPositions[currentShipIndex].x = oldShipPos.x
                    shipPositions[currentShipIndex].y = oldShipPos.y
                }

                return;
            }
        }

        shipPositions[currentShipIndex].coords = currShipAllPos;

        if(
            (finalFieldsShipPos.x !== currentShipInfo.left && activeBorderDel) ||
            (finalFieldsShipPos.y !== currentShipInfo.top && activeBorderDel)
        ){
            activeBorderDel = false;

            checkBorders();
        }

        createShips[currentShipIndex].animate(
            {
                left: `${finalFieldsShipPos.x}px`,
                top: `${finalFieldsShipPos.y}px`
            },
            {
                duration: 200,
                fill: "forwards"
            }
        )

        activeMoveShip = true;

        setTimeout(() => {
            activeMoveShip = false;
        }, 200);

        createShips[currentShipIndex].classList.add('activeSelection');
    }
    else{
        if(isShipInField){
            deleteBorders();

            shipPositions[currentShipIndex].x = null;
            shipPositions[currentShipIndex].y = null;
            shipPositions[currentShipIndex].coords = [];
        }
        
        isShipInField = false;

        let currentCount;
            currentShipInfo.width === 60 ? currentCount = 0 : currentCount = Math.max(currentShipInfo.height, currentShipInfo.width) / 60;
        let currentHalfCount = Math.floor(currentCount / 2);

        let rotatedHalf = (currentShipInfo.height < currentShipInfo.width && currentCount % 2 === 0) ? currentHalfCount * 60 - 30 : 0;


        createShips[currentShipIndex].animate(
            {
                left: `${mousePos.x - currShipHalfWidth - rotatedHalf}px`,
                top: `${mousePos.y - currShipHalfHeight + rotatedHalf}px`
            },
            {
                duration: 100,
                fill: "forwards"
            }
        )

        createShips[currentShipIndex].classList.remove('activeSelection');
    }

    currentShipInfo = createShips[currentShipIndex].getBoundingClientRect();
})

// Move with ships
createShips.forEach((ship, index) => {
    ship.addEventListener('mousedown', () => {
        shipMove = true;
        activeBorderDel = true;

        if(currentShipIndex !== index){
            createShips[currentShipIndex].classList.remove('activeSelection');

        }
        
        currentShipIndex = index;

        currShipAllPos = shipPositions[currentShipIndex].coords;
        
        if(
            createFieldsInfo.left <= mousePos.x &&
            createFieldsInfo.right >= mousePos.x &&
            createFieldsInfo.top <= mousePos.y &&
            createFieldsInfo.bottom >= mousePos.y
        ){
            createShips[currentShipIndex].classList.add('activeSelection');
        }
        
        currentShipInfo = ship.getBoundingClientRect();
        currShipHalfWidth = Math.min(currentShipInfo.width / 2, currentShipInfo.height / 2);
        currShipHalfHeight = Math.max(currentShipInfo.width / 2, currentShipInfo.height / 2);
    })

})

window.addEventListener('mouseup', () => {
    if(!shipMove) return;

    shipMove = false;
    activeBorderDel = false;

    // Check if there is every ship in field
    let posCount = false;
    
    shipPositions.map(pos => {if(pos.coords.length === 0) posCount = true});

    if(!posCount){
        // Show continue btn
        fieldContinueBtn.classList.add('fade-in');
        fieldContinueBtn.classList.remove('fade-fix');
        fieldContinueBtn.classList.remove('fade-out');
    }
    else{
        // Disable continue btb
        fieldContinueBtn.classList.remove('fade-in');
        fieldContinueBtn.classList.add('fade-out');
    }
    
    if(shipPositions[currentShipIndex].coords.length === 0){
        resetShipPosition();
        deleteBorders();

        return;
    }

    if(
        createFieldsInfo.left <= mousePos.x &&
        createFieldsInfo.right >= mousePos.x &&
        createFieldsInfo.top <= mousePos.y &&
        createFieldsInfo.bottom >= mousePos.y
    ){
        isShipInField = true;

        createShips[currentShipIndex].classList.add('activeSelection');
    }
    else resetShipPosition();

    checkBorders();
})



// Function to update shiPositions.coords
function updateShipCoords(){
    currShipAllPos = [];

    let shipWidthCount = Math.floor(currentShipInfo.width / 60);
    let shipHeightCount = Math.floor(currentShipInfo.height / 60);

    for (let i = 0; i < Math.max(shipWidthCount, shipHeightCount); i++) {
        if(shipWidthCount < shipHeightCount){
            currShipAllPos.push({
                x: shipPositions[currentShipIndex].x,
                y: shipPositions[currentShipIndex].y + i
            })
        }
        else{
            currShipAllPos.push({
                x: shipPositions[currentShipIndex].x + i,
                y: shipPositions[currentShipIndex].y
            })
        }
    }
}



// ROTATE BUTTON
const createRotateBtn = document.querySelector('.create__fieldBtn.fieldRotate');

let disabledRotateBtn = false;

createRotateBtn.addEventListener('click', () => {
    if(!isShipInField || disabledRotateBtn) return;
    deleteCurrentBorder = true;
    checkBorders();

    disabledRotateBtn = true;

    createShips[currentShipIndex].classList.toggle('rotatedShip');

    let rotateAniDuration = 250;

    if(createShips[currentShipIndex].classList.contains('rotatedShip')){
        // Rotate
        createShips[currentShipIndex].animate(
            {
                rotate: "90deg"
            },
            {
                duration: rotateAniDuration,
                fill: "forwards"
            }
        )
    }
    else{
        // Return
        createShips[currentShipIndex].animate(
            {
                rotate: "0deg"
            },
            {
                duration: rotateAniDuration,
                fill: "forwards"
            }
        )
    }

    setTimeout(() => {
        rotateBorders();
    }, rotateAniDuration);
})


function rotateBorders(){
    setTimeout(() => {
        currentShipInfo = createShips[currentShipIndex].getBoundingClientRect();
    
        let currPos = {
            x: Math.floor((currentShipInfo.left - createFieldsInfo.left) / 60),
            y: Math.floor((currentShipInfo.top - createFieldsInfo.top) / 60)
        }
    
        shipPositions[currentShipIndex].x = currPos.x;
        shipPositions[currentShipIndex].y = currPos.y;
        
        mouseShipPos[currentShipIndex].x = currPos.x;
        mouseShipPos[currentShipIndex].y = currPos.y;

        
        if(
            currentShipInfo.left < createFieldsInfo.left ||
            currentShipInfo.right > createFieldsInfo.right|
            currentShipInfo.top < createFieldsInfo.top ||
            currentShipInfo.bottom > createFieldsInfo.bottom
        ){
            resetShipPosition();

            deleteCurrentBorder = false;
            disabledRotateBtn = false;

            return;
        }

        let isCollision = checkBorderCollision();

        updateShipCoords();
        shipPositions[currentShipIndex].coords = currShipAllPos;

        deleteCurrentBorder = false;

        if(isCollision) resetShipPosition();
        else checkBorders();

        disabledRotateBtn = false;
    }, 50);
}


let currentShipPosition = [];

// Check border collision
function checkBorderCollision(){
    let currentCoords = [];
    currentShipPosition = [];

    shipPositions.forEach((ship, index) => {
        if(!ship.coords.length || currentShipIndex === index) return;

        ship.coords.map(coord => currentCoords.push(coord));
    })

    if(!currentCoords.length) return false;

    setBordersAndPos();

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


// Borders function
async function checkBorders(){
    if(!isShipInField) return;

    
    if(shipMove || deleteCurrentBorder){
        createFieldEach.forEach(field => {
            let currentShipData = field.getAttribute('data-ship-id');
            
            if(!currentShipData) return;

            let currentShipSplited = currentShipData.split(' ');

            if(currentShipSplited.length === 1){
                let currentShipId = parseInt(currentShipData);

                if(currentShipId === currentShipIndex){
                    field.removeAttribute('data-ship-id');
                }
            }
            else{
                currentShipSplited.forEach(currentShipIdData => {
                    let currentShipId = parseInt(currentShipIdData);

                    if(currentShipId === currentShipIndex){
                        let newArr = currentShipSplited.slice();
                        let delIndex = newArr.indexOf(currentShipId.toString());
                        newArr.splice(delIndex, 1);

                        if(newArr.length === 1){
                            field.setAttribute('data-ship-id', newArr[0]);
                        }
                        else{
                            let newDataShipId = newArr.join(' ');
                            field.setAttribute('data-ship-id', newDataShipId);
                        }
                    }
                })
            }
        })
    }
    else{
        if(activeMoveShip){
            await new Promise(r => setTimeout(r, 200));
        }

        setBordersAndPos("borders");
    }
}


// Set borders and update current ship positions
function setBordersAndPos(type){
    currentShipPosition = [];

    let shipWidthCount = Math.floor(currentShipInfo.width / 60);
    let shipHeightCount = Math.floor(currentShipInfo.height / 60);

    if(shipHeightCount > 1){
        // Non-Rotated
        // Top and bottom side of non-rotated
        if(shipPositions[currentShipIndex].y !== 0){
            let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y - 1][shipPositions[currentShipIndex].x].getAttribute('data-ship-id');

            currentShipPosition.push({x: shipPositions[currentShipIndex].x, y: shipPositions[currentShipIndex].y - 1});

            if(type === "borders"){
                if(oldAttribute !== null){
                    let splitedAttr = oldAttribute.split(' ');
    
                    if(!splitedAttr.includes(currentShipIndex.toString())){
                        createFieldBxs[shipPositions[currentShipIndex].y - 1][shipPositions[currentShipIndex].x].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                    }
                }
                else{
                    createFieldBxs[shipPositions[currentShipIndex].y - 1][shipPositions[currentShipIndex].x].setAttribute(`data-ship-id`, (currentShipIndex));
                }
            }
        }

        if(shipPositions[currentShipIndex].y !== (9 - shipHeightCount)){
            let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y + shipHeightCount][shipPositions[currentShipIndex].x].getAttribute('data-ship-id');

            currentShipPosition.push({x: shipPositions[currentShipIndex].x, y: shipPositions[currentShipIndex].y + shipHeightCount});

            if(type === "borders"){
                if(oldAttribute !== null){
                    let splitedAttr = oldAttribute.split(' ');
    
                    if(!splitedAttr.includes(currentShipIndex.toString())){
                        createFieldBxs[shipPositions[currentShipIndex].y + shipHeightCount][shipPositions[currentShipIndex].x].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                    }
                }
                else{
                    createFieldBxs[shipPositions[currentShipIndex].y + shipHeightCount][shipPositions[currentShipIndex].x].setAttribute(`data-ship-id`, (currentShipIndex));
                }
            }
        }


        // Left and right side of non-rotated
        if(shipPositions[currentShipIndex].x !== 0){
            for (let i = 0; i < (shipHeightCount + 2); i++) {
                if(
                    (i === 0 && shipPositions[currentShipIndex].y === 0) ||
                    (i === (shipHeightCount + 1) && shipPositions[currentShipIndex].y === (9 - shipHeightCount))
                ) continue;

                currentShipPosition.push({x: shipPositions[currentShipIndex].x - shipWidthCount, y: shipPositions[currentShipIndex].y - 1 + i});
                
                if(type === "borders"){
                    let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y - 1 + i][shipPositions[currentShipIndex].x - shipWidthCount].getAttribute('data-ship-id');
    
                    if(oldAttribute !== null){
                        let splitedAttr = oldAttribute.split(' ');
    
                        if(!splitedAttr.includes(currentShipIndex.toString())){
                            createFieldBxs[shipPositions[currentShipIndex].y - 1 + i][shipPositions[currentShipIndex].x - shipWidthCount].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                        }
                    }
                    else{
                        createFieldBxs[shipPositions[currentShipIndex].y - 1 + i][shipPositions[currentShipIndex].x - shipWidthCount].setAttribute(`data-ship-id`, (currentShipIndex));
                    }
                }
            }
        }

        if(shipPositions[currentShipIndex].x !== (9 - shipWidthCount)){
            for (let i = 0; i < (shipHeightCount + 2); i++) {
                if(
                    (i === 0 && shipPositions[currentShipIndex].y === 0) ||
                    (i === (shipHeightCount + 1) && shipPositions[currentShipIndex].y === (9 - shipHeightCount))
                ) continue;

                currentShipPosition.push({x: shipPositions[currentShipIndex].x + shipWidthCount, y: shipPositions[currentShipIndex].y - 1 + i});
                
                if(type === "borders"){
                    let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y - 1 + i][shipPositions[currentShipIndex].x + shipWidthCount].getAttribute('data-ship-id');
    
                    if(oldAttribute !== null){
                        let splitedAttr = oldAttribute.split(' ');
    
                        if(!splitedAttr.includes(currentShipIndex.toString())){
                            createFieldBxs[shipPositions[currentShipIndex].y - 1 + i][shipPositions[currentShipIndex].x + shipWidthCount].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                        }
                    }
                    else{
                        createFieldBxs[shipPositions[currentShipIndex].y - 1 + i][shipPositions[currentShipIndex].x + shipWidthCount].setAttribute(`data-ship-id`, (currentShipIndex));
                    }
                }
            }
        }
    }
    else{
        // Rotated
        // Left and right side of rotated
        if(shipPositions[currentShipIndex].x !== 0){
            let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y][shipPositions[currentShipIndex].x - 1].getAttribute('data-ship-id');

            currentShipPosition.push({x: shipPositions[currentShipIndex].x - 1, y: shipPositions[currentShipIndex].y});
            
            if(type === "borders"){
                if(oldAttribute !== null){
                    let splitedAttr = oldAttribute.split(' ');
    
                    if(!splitedAttr.includes(currentShipIndex.toString())){
                        createFieldBxs[shipPositions[currentShipIndex].y][shipPositions[currentShipIndex].x - 1].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                    }
                }
                else{
                    createFieldBxs[shipPositions[currentShipIndex].y][shipPositions[currentShipIndex].x - 1].setAttribute(`data-ship-id`, (currentShipIndex));
                }
            }
        }

        if(shipPositions[currentShipIndex].x !== (9 - shipWidthCount)){
            let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y][shipPositions[currentShipIndex].x + shipWidthCount].getAttribute('data-ship-id');

            currentShipPosition.push({x: shipPositions[currentShipIndex].x + shipWidthCount, y: shipPositions[currentShipIndex].y});
            
            if(type === "borders"){
                if(oldAttribute !== null){
                    let splitedAttr = oldAttribute.split(' ');
    
                    if(!splitedAttr.includes(currentShipIndex.toString())){
                        createFieldBxs[shipPositions[currentShipIndex].y][shipPositions[currentShipIndex].x + shipWidthCount].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                    }
                }
                else{
                    createFieldBxs[shipPositions[currentShipIndex].y][shipPositions[currentShipIndex].x + shipWidthCount].setAttribute(`data-ship-id`, (currentShipIndex));
                }
            }
        }

        // Top and bottom side of rotated
        if(shipPositions[currentShipIndex].y !== 0){
            for (let i = 0; i < (shipWidthCount + 2); i++) {
                if(
                    (i === 0 && shipPositions[currentShipIndex].x === 0) ||
                    (i === (shipWidthCount + 1) && shipPositions[currentShipIndex].x === (9 - shipWidthCount))
                ) continue;

                currentShipPosition.push({x: shipPositions[currentShipIndex].x - 1 + i, y: shipPositions[currentShipIndex].y - 1});
                
                if(type === "borders"){
                    let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y - 1][shipPositions[currentShipIndex].x - 1 + i].getAttribute('data-ship-id');
    
                    if(oldAttribute !== null){
                        let splitedAttr = oldAttribute.split(' ');
    
                        if(!splitedAttr.includes(currentShipIndex.toString())){
                            createFieldBxs[shipPositions[currentShipIndex].y - 1][shipPositions[currentShipIndex].x - 1 + i].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                        }
                    }
                    else{
                        createFieldBxs[shipPositions[currentShipIndex].y - 1][shipPositions[currentShipIndex].x - 1 + i].setAttribute(`data-ship-id`, (currentShipIndex));
                    }
                }
            }
        }

        if(shipPositions[currentShipIndex].y !== (9 - shipHeightCount)){
            for (let i = 0; i < (shipWidthCount + 2); i++) {
                if(
                    (i === 0 && shipPositions[currentShipIndex].x === 0) ||
                    (i === (shipWidthCount + 1) && shipPositions[currentShipIndex].x === (9 - shipWidthCount))
                ) continue;

                currentShipPosition.push({x: shipPositions[currentShipIndex].x - 1 + i, y: shipPositions[currentShipIndex].y + 1});
                
                if(type === "borders"){
                    let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y + 1][shipPositions[currentShipIndex].x - 1 + i].getAttribute('data-ship-id');
    
                    if(oldAttribute !== null){
                        let splitedAttr = oldAttribute.split(' ');
    
                        if(!splitedAttr.includes(currentShipIndex.toString())){
                            createFieldBxs[shipPositions[currentShipIndex].y + 1][shipPositions[currentShipIndex].x - 1 + i].setAttribute(`data-ship-id`, (`${oldAttribute} ${currentShipIndex}`));
                        }
                    }
                    else{
                        createFieldBxs[shipPositions[currentShipIndex].y + 1][shipPositions[currentShipIndex].x - 1 + i].setAttribute(`data-ship-id`, (currentShipIndex));
                    }
                }
            }
        }
    }
}


// Delete all current borders
function deleteBorders(){
    let dataFields = [];

    createFieldEach.forEach(field => {
        let currentShipData = field.getAttribute('data-ship-id');

        if(currentShipData) dataFields.push({field: field, data: currentShipData});
    })

    if(!dataFields.length) return;

    dataFields.forEach(fieldData => {
        let currentShipSplited = fieldData.data.split(' ');
    
        if(currentShipSplited.length === 1){
            let currentShipId = parseInt(fieldData.data);
    
            if(currentShipId === currentShipIndex){
                fieldData.field.removeAttribute('data-ship-id');
            }
        }
        else{
            currentShipSplited.forEach(currentShipIdData => {
                let currentShipId = parseInt(currentShipIdData);
    
                if(currentShipId === currentShipIndex){
                    let newArr = currentShipSplited.slice();
                    let delIndex = newArr.indexOf(currentShipId.toString());
                    newArr.splice(delIndex, 1);
    
                    if(newArr.length === 1){
                        fieldData.field.setAttribute('data-ship-id', newArr[0]);
                    }
                    else{
                        let newDataShipId = newArr.join(' ');
                        fieldData.field.setAttribute('data-ship-id', newDataShipId);
                    }
                }
            })
        }
    })
}


// Reset ship position to its original position out of field
function resetShipPosition(){
    shipMove = false;
    activeBorderDel = false;
    isShipInField = false;

    createShips[currentShipIndex].classList.remove('activeSelection');

    shipPositions[currentShipIndex].coords = [];

    // Move with ship back to their original position and reset rotation
    createShips[currentShipIndex].classList.remove('rotatedShip');

    createShips[currentShipIndex].animate(
        {
            left: `unset`,
            top: `unset`
        },
        {
            duration: 0,
            fill: "forwards"
        }
    )

    createShips[currentShipIndex].animate(
        {
            rotate: "0deg"
        },
        {
            duration: 0,
            fill: "forwards"
        }
    )
}


// GENERATE RANDOM PLAYER POSITION AFTER CLICKING ON BUTTON
const randomPosBtn = document.querySelector('.create__fieldBtn.fieldRandom');

randomPosBtn.addEventListener('click', () => {
    // Delete old borders
    createFieldEach.forEach(field => {
        field.removeAttribute('data-ship-id');
    })

    // Generate random position
    let generatedShipPos = generateShipPosition();

    generatedShipPos.forEach((info, index) => {
        // Set ship positions
        shipPositions[index].x = info.position.x;
        shipPositions[index].y = info.position.y;
        shipPositions[index].coords = info.coords;

        // Set borders and place ship
        let shipSize = shipPositions[index].size;
        let rotX = info.rotated ? shipSize : 1;
        let rotY = !info.rotated ? shipSize : 1;

        genSetBordersAndPos(info.rotated, rotX, rotY, info.position, index, "borders");
        
        if(info.rotated) createShips[index].classList.add('rotatedShip');

        let currentHalfCount = Math.floor(botShipPositions[index].size / 2);
        let currentAdd = botShipPositions[index].size % 2 !== 0 && info.rotated ? (currentHalfCount * 60) : 0;

        let shipPos = {
            x: (info.position.x * 60) + createFieldsInfo.x + currentAdd,
            y: (info.position.y * 60) + createFieldsInfo.y - currentAdd,
            rotate: info.rotated * 90
        };
        
        createShips[index].animate(
            {
                left: `${shipPos.x}px`,
                top: `${shipPos.y}px`,
                rotate: `${shipPos.rotate}deg`
            },
            {
                duration: 0,
                fill: "forwards"
            }
        )
    })

    fieldContinueBtn.classList.add('fade-in');
    fieldContinueBtn.classList.remove('fade-out');
    fieldContinueBtn.classList.remove('fade-fix');
})


// CLEAR GAME FIELD
const fieldClearBtn = document.querySelector('.create__fieldBtn.fieldClear');

fieldClearBtn.addEventListener('click', () => {
    for (let i = 0; i < shipPositions.length; i++) {
        currentShipIndex = i;

        resetShipPosition();
        deleteBorders();
    }

    fieldContinueBtn.classList.remove('fade-in');
    fieldContinueBtn.classList.add('fade-out');
})