// Crete fields
const createFields = document.querySelector('.create__fields');

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        let newField = document.createElement('div');
        newField.classList.add('create__field', 'createField');
        createFields.appendChild(newField);
    }
}

// MOVE WITH SHIP
const createShips = document.querySelectorAll('.create__shipBx');

let shipMove = false;
let currentShipIndex = 0,
    currentShipInfo,
    currShipHalfWidth,
    currShipHalfHeight;

let isShipInField = false;

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

            let fixedFieldShipPos = {
                x: Math.max(Math.min((Math.floor(fieldShipPos.x / 60) * 60), (createFieldsInfo.width - currentShipInfo.width)), 0),
                y: Math.max(Math.min((Math.floor(fieldShipPos.y / 60) * 60), (createFieldsInfo.height - currentShipInfo.height)), 0)
            }

            let finalFieldsShipPos = {
                x: fixedFieldShipPos.x + createFieldsInfo.left,
                y: fixedFieldShipPos.y + createFieldsInfo.top
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
    }
})


// Move with ships
createShips.forEach((ship, index) => {
    ship.addEventListener('mousedown', () => {
        shipMove = true;

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
        currShipHalfWidth = currentShipInfo.width / 2;
        currShipHalfHeight = currentShipInfo.height / 2;
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

            // Move with ship back to their original position
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
    })
})




// ROTATE BUTTON
const createRotateBtn = document.querySelector('.create__rotateBtn');

createRotateBtn.addEventListener('click', () => {
    if(!isShipInField) return;
    
    createShips[currentShipIndex].classList.toggle('rotatedShip');
})