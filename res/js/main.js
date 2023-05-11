// REFRESH SECTION
const refresh = document.querySelector('.refresh');
const refreshBtn = document.querySelector('.refresh__btn');

window.addEventListener('resize', () => {
    // refresh.style.display = "flex";
})

refreshBtn.addEventListener('click', () => {
    location.reload();
})



// INDEX ELEMENTS
const welcomeSection = document.querySelector('.welcome');
const nameSection = document.querySelector('.name');
const roomSection = document.querySelector('.room');
const joinSection = document.querySelector('.join');
const waitSection = document.querySelector('.wait');
const createSection = document.querySelector('.create');
const gameSection = document.querySelector('.game');
const loaderSection = document.querySelector('.loader');

const joinRoomIdText = document.querySelector('.join__roomId');

const roomIdInput = document.querySelector('.room__input');


// SOCKET ROUTING
const socket = io();

socket.on('roomCreated', (uuid) => {
    // Show join section and insert id to page info
    nameSection.style.display = "none";
    loaderSection.style.display = "none";
    joinSection.style.display = "flex";

    joinRoomIdText.innerText = uuid;
})

socket.on('playerJoined', () => {
    // Show create section
    roomSection.style.display = "none";
    loaderSection.style.display = "none";

    createSection.classList.add('activeCreate');
})

socket.on('allPlayersIn', () => {
    // Show create section
    joinSection.style.display = "none";

    createSection.classList.add('activeCreate');
})

socket.on('joinRoomError', () => {
    roomIdInput.classList.add('idInputErr');
})


// SECTION SWAPING
// Welcome
const welcomeOnlineBtn = document.querySelector('.welcome__btn.welcomeOnline');
const welcomeBotBtn = document.querySelector('.welcome__btn.welcomeBot');

welcomeOnlineBtn.addEventListener('click', () => {
    welcomeSection.style.display = "none";
    nameSection.style.display = "flex";
})

welcomeBotBtn.addEventListener('click', () => {
    welcomeSection.style.display = "none";
    createSection.classList.add('activeCreate');
})

// Name section
const nameInput = document.querySelector('.name__input');
const nameCreateBtn = document.querySelector('.type__btn.typeCreate');
const nameJoinBtn = document.querySelector('.type__btn.typeJoin');

nameCreateBtn.addEventListener('click', () => {
    if(nameInput.value.length <= 3){
        nameInput.classList.add('noName');

        return;
    }

    nameInput.classList.remove('noName');

    loaderSection.style.display = "flex";

    socket.emit('createRoom', nameInput.value);
})

nameJoinBtn.addEventListener('click', () => {
    if(nameInput.value.length <= 3){
        nameInput.classList.add('noName');

        return;
    }

    nameInput.classList.remove('noName');

    nameSection.style.display = "none";
    roomSection.style.display = "flex";
})

// Room Id Section
const roomBtn = document.querySelector('.room__btn');

let roomIdLength = 5; // TODO - CHANGE ID TO ROOM ID LENGTH

roomBtn.addEventListener('click', () => {
    if(roomIdInput.value.length < roomIdLength){
        roomIdInput.classList.add('idInputErr');

        return;
    }

    roomIdInput.classList.remove('idInputErr');

    // TODO - Check if id is valid
    if(true){
        loaderSection.style.display = "none";

        const data = {
            userName: nameInput.value,
            roomId: roomIdInput.value
        }

        socket.emit('joinPlayer', data);
    }
})