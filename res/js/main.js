// Crete fields
const createFields = document.querySelector('.create__fields');
let createFieldBxs = Array.from(Array(9), () => []);

for (let i = 0; i < 9; i++) {
    let newFieldBx = document.createElement('div');
    newFieldBx.classList.add('create__fieldContainer');
    createFields.appendChild(newFieldBx);

    for (let j = 0; j < 9; j++) {
        let newField = document.createElement('div');
        newField.classList.add('create__field', 'createField');
        newFieldBx.appendChild(newField);

        createFieldBxs[i].push(newField);
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
    activeMoveShip = false;

let mousePos = {x: undefined, y: undefined},
    fieldShipPos = {x: undefined, y: undefined},
    fieldShipFinalPos = {x: undefined, y: undefined};
let createFieldsInfo = createFields.getBoundingClientRect();
    
// Get current mouse position
window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    if(shipMove){
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
            

            let helpShipSize = 0;

            if(createShips[currentShipIndex].classList.contains('rotatedShip') && (Math.max(currentShipInfo.width, currentShipInfo.height) / 4) % 2 === 0){
                helpShipSize = 30;
            }

            let finalFieldsShipPos = {
                x: fixedFieldShipPos.x + createFieldsInfo.left - helpShipSize,
                y: fixedFieldShipPos.y + createFieldsInfo.top + helpShipSize
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

            createShips[currentShipIndex].style.left = finalFieldsShipPos.y + "px";

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
    }
})


// Move with ships
createShips.forEach((ship, index) => {
    ship.addEventListener('mousedown', () => {
        shipMove = true;

        checkBorders();

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

    ship.addEventListener('mouseup', () => {
        shipMove = false;

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
        }

        checkBorders();
    })
})




// ROTATE BUTTON
const createRotateBtn = document.querySelector('.create__rotateBtn');

let disabledRotateBtn = false;

createRotateBtn.addEventListener('click', () => {
    if(!isShipInField || disabledRotateBtn) return;

    disabledRotateBtn = true;

    createShips[currentShipIndex].classList.toggle('rotatedShip');

    let helpShipSize = 0;
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
                disabledRotateBtn = false;
    
                currentShipInfo = createShips[currentShipIndex].getBoundingClientRect();
            }, (moveAniDuration + 50));
        }
        else{
            disabledRotateBtn = false;
        }
    }, rotateAniDuration);
})



// Borders function
async function checkBorders(){
    if(!isShipInField) return;

    let gridBackColor = shipMove ? "#0093ff45" : "#ff000045";

    let shipWidthCount = Math.floor(currentShipInfo.width / 60);
    let shipHeightCount = Math.floor(currentShipInfo.height / 60);

    if(activeMoveShip){
        await new Promise(r => setTimeout(r, 200));
    }

    let shipPosGrid = {
        x: Math.abs(Math.round((currentShipInfo.left - createFieldsInfo.left) / 60) * 60) / 60,
        y: Math.abs(Math.round((currentShipInfo.top - createFieldsInfo.top) / 60) * 60) / 60
    }

    if(shipHeightCount > 1){
        // Non-Rotated
        // Top and bottom side of non-rotated
        createFieldBxs[shipPosGrid.y - 1][shipPosGrid.x].style.backgroundColor = gridBackColor;
        createFieldBxs[shipPosGrid.y + shipHeightCount][shipPosGrid.x].style.backgroundColor = gridBackColor;

        // Left and right side of non-rotated
        for (let i = 0; i < (shipHeightCount + 2); i++) {
            createFieldBxs[shipPosGrid.y - 1 + i][shipPosGrid.x - shipWidthCount].style.backgroundColor = gridBackColor;
            createFieldBxs[shipPosGrid.y - 1 + i][shipPosGrid.x + shipWidthCount].style.backgroundColor = gridBackColor;
        }
    }
    else{
        // Rotated
        // Left and right side of rotated
        createFieldBxs[shipPosGrid.y][shipPosGrid.x - 1].style.backgroundColor = gridBackColor;
        createFieldBxs[shipPosGrid.y][shipPosGrid.x + shipWidthCount].style.backgroundColor = gridBackColor;
        
        // Top and bottom side of rotated
        for (let i = 0; i < (shipWidthCount + 2); i++) {
            createFieldBxs[shipPosGrid.y - 1][shipPosGrid.x - 1 + i].style.backgroundColor = gridBackColor;
            createFieldBxs[shipPosGrid.y + 1][shipPosGrid.x - 1 + i].style.backgroundColor = gridBackColor;
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