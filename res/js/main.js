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
const joinCreatorName = document.querySelector('.join .info__bx.infoBxCreator .info__name');
const joinJoinerName = document.querySelector('.join .info__bx.infoBxJoiner .info__name');
const joinJoinerStatus = document.querySelector('.join .info__bx.infoBxJoiner .info__status');

const waitTitle = document.querySelector('.wait__title');
const waitPlayerName = document.querySelector('.wait__playerName');
const waitFirName = document.querySelector('.wait .infoBxCreator .info__name');
const waitSecName = document.querySelector('.wait .infoBxJoiner .info__name');

const roomIdInput = document.querySelector('.room__input');


// SOCKET ROUTING
const socket = io();

socket.on('roomCreated', (data) => {
    // FOR CREATOR AFTER CREATING THE ROOM
    // Show join section and insert id to page info
    nameSection.style.display = "none";
    loaderSection.style.display = "none";
    joinSection.style.display = "flex";

    joinRoomIdText.innerText = data.roomId;
    joinCreatorName.innerText = data.playerName;
})

socket.on('playerJoined', (data) => {
    // FOR JOINED USER
    // Show create section
    roomSection.style.display = "none";
    loaderSection.style.display = "none";
    joinSection.style.display = "flex";

    joinCreatorName.innerText = data.creatorName;

    joinJoinerStatus.innerText = "Joined";
    joinRoomIdText.innerText = data.roomId;
    joinJoinerName.innerText = data.joinerName;
    joinSection.classList.add('playerJoined', 'textActive');
})

socket.on('joinedPlayer', (data) => {
    // FOR CREATOR AFTER PLAYER IS JOINED
    joinJoinerStatus.innerText = "Joined";
    joinJoinerName.innerText = data.joinerName;
    joinSection.classList.add('playerJoined', 'buttonActive');
})


socket.on('move-create', () => {
    joinSection.style.display = "none";
    createSection.classList.add('activeCreate');
})


socket.on('move-wait', (data) => {
    createSection.classList.remove('activeCreate');
    waitSection.style.display = "flex";

    waitPlayerName.innerText = data.secondName;
    waitFirName.innerText = data.playerName;
    waitSecName.innerText = data.secondName;
})

socket.on('wait-startScene', (data) => {
    waitSection.classList.add('playerReady');

    waitTitle.innerText = `Waiting for player ${data.creatorName} to Start the game`;
})

socket.on('wait-startCreator', () => {
    waitSection.classList.add('buttonActive');
})

socket.on('move-game', () => {
    waitSection.style.display = "none";
    gameSection.style.display = "flex";
})


// Join room input error
socket.on('joinRoomError', () => {
    roomIdInput.classList.add('idInputErr');
})


// SECTION SWAPING
// Welcome section
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


// Join section
const joinContinueBtn = document.querySelector('.join__btn');

joinContinueBtn.addEventListener('click', () => {
    socket.emit('movePlayers-create');
})

// Create Section
const createContinueBtn = document.querySelector('.create__fieldBtn.fieldContinue');

createContinueBtn.addEventListener('click', () => {
    socket.emit('movePlayers-wait');
})

// Wait section
const waitStartBtn = document.querySelector('.wait__startBtn');

waitStartBtn.addEventListener('click', () => {
    socket.emit('movePlayers-game');
})