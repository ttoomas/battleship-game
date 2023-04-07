const createFields = document.querySelector('.create__fields');
const createShips = document.querySelectorAll('.create__shipBx');

let mousePos = {x: undefined, y: undefined};
let fieldPos = {x: undefined, y: undefined};
let newShipPos = {x: undefined, y: undefined};
let newShipCoords = {x: undefined, y: undefined};

let shipHolding = false;
let currentShip;
let fieldsPosition;
let inFields = false;

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        let newField = document.createElement('div');
        newField.classList.add('create__field');

        createFields.appendChild(newField);
    }
}

fieldsPosition = createFields.getBoundingClientRect();


window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    if(shipHolding){
        createShips[currentShip].style.left = `${mousePos.x}px`;
        createShips[currentShip].style.top = `${mousePos.y}px`;

        if(
            mousePos.x - createShips[currentShip].clientWidth / 2 >= fieldsPosition.left &&
            mousePos.y + createShips[currentShip].clientHeight / 2 <= fieldsPosition.bottom
        ){
            inFields = true;

            fieldPos.x = (mousePos.x - createShips[currentShip].clientWidth / 2) - fieldsPosition.left;
            fieldPos.y = (mousePos.y - createShips[currentShip].clientHeight / 2) - fieldsPosition.top;

            newShipPos.x = fieldsPosition.left + (Math.round(fieldPos.x / 100) * 100) + (createShips[currentShip].clientWidth / 2);
            newShipPos.y = fieldsPosition.top + (Math.round(fieldPos.y / 100) * 100) + (createShips[currentShip].clientHeight / 2);

            createShips[currentShip].style.left = `${newShipPos.x}px`;
            createShips[currentShip].style.top = `${newShipPos.y}px`;

            newShipCoords.x = (newShipPos.x - fieldsPosition.left - createShips[currentShip].clientWidth / 2) / 100;
            newShipCoords.y = (newShipPos.y - fieldsPosition.top - createShips[currentShip].clientHeight / 2) / 100;

            console.log(newShipCoords);
        }
        else{
            inFields = false;
        }
    }
})

createShips.forEach((ship, index) => {
    ship.addEventListener('mousedown', () => {
        shipHolding = true;
        currentShip = index;

        if(
            mousePos.x - createShips[currentShip].clientWidth / 2 >= fieldsPosition.left &&
            mousePos.y + createShips[currentShip].clientHeight / 2 <= fieldsPosition.bottom
        ){
            inFields = true;
        }
    })

    ship.addEventListener('mouseup', () => {
        shipHolding = false;

        if(!inFields){
            createShips[currentShip].style.left = `unset`;
            createShips[currentShip].style.top = `unset`;
        }

        inFields = false;
    })
})




// width: 900
// height : 900

// top: 0
// bottom : 900

// left: 539
// right: 1439

// x: 539
// y: 0