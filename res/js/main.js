// Crete fields
const createFields = document.querySelector('.create__fields');
let createFieldBxs = Array.from(Array(9), () => []);
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

let mousePos = {x: undefined, y: undefined},
    fieldShipPos = {x: undefined, y: undefined},
    fieldShipFinalPos = {x: undefined, y: undefined};
let createFieldsInfo = createFields.getBoundingClientRect();


let shipPositions = [
    {
        x: 0,
        y: 0,
        coords: [],
        name: "battleship"
    },
    {
        x: 0,
        y: 0,
        coords: [],
        name: "carrier"
    },
    {
        x: 0,
        y: 0,
        coords: [],
        name: "cruiser"
    },
    {
        x: 0,
        y: 0,
        coords: [],
        name: "destroyer"
    },
    {
        x: 0,
        y: 0,
        coords: [],
        name: "rescuership"
    },
    {
        x: 0,
        y: 0,
        coords: [],
        name: "submarine"
    }
]

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
            helpShipSize = 30;
        }

        let finalFieldsShipPos = {
            x: fixedFieldShipPos.x + createFieldsInfo.left - helpShipSize,
            y: fixedFieldShipPos.y + createFieldsInfo.top + helpShipSize
        }

        
        if(
            finalFieldsShipPos.x !== currentShipInfo.left ||
            finalFieldsShipPos.y !== currentShipInfo.top
        ){
            let isCollision = checkBorderCollision();

            if(isCollision) return;
        }

        shipPositions[currentShipIndex].x = shipPosInGrid.x;
        shipPositions[currentShipIndex].y = shipPosInGrid.y;

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
        isShipInField = false;

        createShips[currentShipIndex].animate(
            {
                left: `${mousePos.x - currShipHalfWidth}px`,
                top: `${mousePos.y - currShipHalfHeight}px`
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

    if(
        createFieldsInfo.left <= mousePos.x &&
        createFieldsInfo.right >= mousePos.x &&
        createFieldsInfo.top <= mousePos.y &&
        createFieldsInfo.bottom >= mousePos.y
    ){
        isShipInField = true;

        createShips[currentShipIndex].classList.add('activeSelection');
    }
    else{
        isShipInField = false;

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

    checkBorders();
})



// ROTATE BUTTON
const createRotateBtn = document.querySelector('.create__rotateBtn');

let disabledRotateBtn = false;

createRotateBtn.addEventListener('click', () => {
    if(!isShipInField || disabledRotateBtn) return;
    deleteCurrentBorder = true;
    checkBorders();

    disabledRotateBtn = true;

    createShips[currentShipIndex].classList.toggle('rotatedShip');

    let rotateAniDuration = 250;
    let moveAniDuration = 150;

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
            
        helpShipSize = 0;
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
            
        // helpShipSize = 90 -> 2
        // helpShipSize = 30 -> 1
        if(createShips[currentShipIndex].clientHeight === 120){
            helpShipSize = 30;
        }
        else if(createShips[currentShipIndex].clientHeight === 240){
            helpShipSize = 90;
        }
    }

    setTimeout(() => {
        currentShipInfo = createShips[currentShipIndex].getBoundingClientRect();
        currShipHalfWidth = Math.min(currentShipInfo.width / 2, currentShipInfo.height / 2);
        currShipHalfHeight = Math.max(currentShipInfo.width / 2, currentShipInfo.height / 2);
    
    
        let currentHalfCount = Math.floor((Math.max(currentShipInfo.height, currentShipInfo.width) / 60) / 2);
        let currentHalfSize = currentHalfCount * 60;
    
        let isOdd = (Math.max(createShips[currentShipIndex].clientWidth, createShips[currentShipIndex].clientHeight) / 4) % 2 === 0 ? 30 : 0;

        if(
            currentShipInfo.left < createFieldsInfo.left ||
            currentShipInfo.right > createFieldsInfo.right ||
            currentShipInfo.top < createFieldsInfo.top ||
            currentShipInfo.bottom > createFieldsInfo.bottom ||
            isOdd !== 0
        ){
            if(createShips[currentShipIndex].classList.contains('rotatedShip')){
                // Rotated
                let newRotatedPos = {
                    x: Math.max(currentShipInfo.left, (createFieldsInfo.left + currentHalfSize - isOdd)), // Left border
                    y: currentShipInfo.top
                }
                
                createShips[currentShipIndex].animate(
                    {
                        left: `${newRotatedPos.x}px`,
                        top: `${newRotatedPos.y}px`
                    },
                    {
                        duration: moveAniDuration,
                        fill: "forwards"
                    }
                )
            }
            else{
                // Original
                let newRotatedPos = {
                    x: currentShipInfo.left + currentHalfSize - isOdd,
                    y: Math.max((currentShipInfo.top - currentHalfSize + isOdd), createFieldsInfo.top)
                }
        
                createShips[currentShipIndex].animate(
                    {
                        left: `${newRotatedPos.x}px`,
                        top: `${newRotatedPos.y}px`
                    },
                    {
                        duration: moveAniDuration,
                        fill: "forwards"
                    }
                )
            }


            setTimeout(() => {
                rotateBorders();
            }, (moveAniDuration + 50));
        }
        else{
            rotateBorders();
        }
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
    
    
        deleteCurrentBorder = false;
        checkBorders();
    
        disabledRotateBtn = false;
    }, 50);
}



// Check border collision
function checkBorderCollision(){
    let currentCoords = {x: [], y: []};

    shipPositions.forEach((ship, index) => {
        if(currentShipIndex === index || !ship.coords.length) return;

        // ship.coords.map(coord => currentCoords.push(coord));
        ship.coords.map(coord => {if(currentCoords.x.indexOf(coord.x) === -1) currentCoords.x.push(coord.x)});
        ship.coords.map(coord => {if(currentCoords.y.indexOf(coord.y) === -1) currentCoords.y.push(coord.y)});
    })

    if(!currentCoords.x.length || !currentCoords.y.length) return;

    let shipWidthCount = Math.floor(currentShipInfo.width / 60);
    let shipHeightCount = Math.floor(currentShipInfo.height / 60);

    if(
        // Check top only
        mouseShipPos[currentShipIndex].y + shipHeightCount >= currentCoords.y[0] &&

        // Check bottom only
        mouseShipPos[currentShipIndex].y <= (currentCoords.y[currentCoords.y.length - 1] + 1) &&

        // Check left only
        (mouseShipPos[currentShipIndex].x + shipWidthCount) >= currentCoords.x[0] &&

        // Check right only
        mouseShipPos[currentShipIndex].x <= currentCoords.x[0] + currentCoords.x.length
    ){
        return true;
    }
    else{
        return false;
    }
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
                            field.setAttribute('data-ship-id', newDataShipId);
                            let newDataShipId = newArr.join(' ');
                        }
                    }
                })
            }
        })
    }
    else{
        let shipWidthCount = Math.floor(currentShipInfo.width / 60);
        let shipHeightCount = Math.floor(currentShipInfo.height / 60);
    
        let currentHalfCount;
            currentShipInfo.width === 60 ? currentHalfCount = 0 : currentHalfCount = Math.floor((Math.max(currentShipInfo.height, currentShipInfo.width) / 60) / 2);
        
        
        if(activeMoveShip){
            await new Promise(r => setTimeout(r, 200));
        }
    
        if(shipHeightCount > 1){
            // Non-Rotated
            // Top and bottom side of non-rotated
            if(shipPositions[currentShipIndex].y !== 0){
                let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y - 1][shipPositions[currentShipIndex].x].getAttribute('data-ship-id');

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

            if(shipPositions[currentShipIndex].y !== (9 - shipHeightCount)){
                let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y + shipHeightCount][shipPositions[currentShipIndex].x].getAttribute('data-ship-id');

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

    
            // Left and right side of non-rotated
            if(shipPositions[currentShipIndex].x !== 0){
                for (let i = 0; i < (shipHeightCount + 2); i++) {
                    if(
                        (i === 0 && shipPositions[currentShipIndex].y === 0) ||
                        (i === (shipHeightCount + 1) && shipPositions[currentShipIndex].y === (9 - shipHeightCount))
                    ) continue;

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

            if(shipPositions[currentShipIndex].x !== (9 - shipWidthCount)){
                for (let i = 0; i < (shipHeightCount + 2); i++) {
                    if(
                        (i === 0 && shipPositions[currentShipIndex].y === 0) ||
                        (i === (shipHeightCount + 1) && shipPositions[currentShipIndex].y === (9 - shipHeightCount))
                    ) continue;

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
        else{
            // Rotated
            // Left and right side of rotated
            if(shipPositions[currentShipIndex].x !== 0){
                let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y][shipPositions[currentShipIndex].x - 1].getAttribute('data-ship-id');

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

            if(shipPositions[currentShipIndex].x !== (9 - shipWidthCount)){
                let oldAttribute = createFieldBxs[shipPositions[currentShipIndex].y][shipPositions[currentShipIndex].x + shipWidthCount].getAttribute('data-ship-id');

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

            // Top and bottom side of rotated
            if(shipPositions[currentShipIndex].y !== 0){
                for (let i = 0; i < (shipWidthCount + 2); i++) {
                    if(
                        (i === 0 && shipPositions[currentShipIndex].x === 0) ||
                        (i === (shipWidthCount + 1) && shipPositions[currentShipIndex].x === (9 - shipWidthCount))
                    ) continue

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

            if(shipPositions[currentShipIndex].y !== (9 - shipHeightCount)){
                for (let i = 0; i < (shipWidthCount + 2); i++) {
                    if(
                        (i === 0 && shipPositions[currentShipIndex].x === 0) ||
                        (i === (shipWidthCount + 1) && shipPositions[currentShipIndex].x === (9 - shipWidthCount))
                    ) continue

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


        shipPositions[currentShipIndex].coords = [];

        for (let i = 0; i < Math.max(shipWidthCount, shipHeightCount); i++) {
            if(shipWidthCount < shipHeightCount){
                shipPositions[currentShipIndex].coords.push({
                    x: shipPositions[currentShipIndex].x,
                    y: shipPositions[currentShipIndex].y + i
                })
            }
            else{
                shipPositions[currentShipIndex].coords.push({
                    x: shipPositions[currentShipIndex].x + i,
                    y: shipPositions[currentShipIndex].y
                })
            }
        }
    }
}





// REFRESH SECTION
const refresh = document.querySelector('.refresh');
const refreshBtn = document.querySelector('.refresh__btn');

window.addEventListener('resize', () => {
    // refresh.style.display = "flex";
})

refreshBtn.addEventListener('click', () => {
    location.reload();
})