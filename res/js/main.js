import { shipPositions } from "./gameSetting.js";
import { startOnlineGame } from "./onlineGame.js";
import { botPrepare } from "./prepareGame.js";

// REFRESH SECTION
const refresh = document.querySelector('.refresh');
const refreshBtn = document.querySelector('.refresh__btn');

window.addEventListener('resize', () => {
    // refresh.style.display = "flex";
})

refreshBtn.addEventListener('click', () => {
    windowlocation.reload();
})

// WIN SECTION
const winBtn = document.querySelector('.win__btn');

winBtn.addEventListener('click', () => {
    window.location.reload();
})



// INDEX ELEMENTS
const welcomeSection = document.querySelector('.welcome');
const botNameSection = document.querySelector('.botName');
const nameSection = document.querySelector('.name');
const roomSection = document.querySelector('.room');
const joinSection = document.querySelector('.join');
const waitSection = document.querySelector('.wait');
const createSection = document.querySelector('.create');
const gameSection = document.querySelector('.game');
const winSection = document.querySelector('.win');
const loaderSection = document.querySelector('.loader');

const joinRoomIdText = document.querySelector('.join__roomId');
const joinCreatorName = document.querySelector('.join .info__bx.infoBxCreator .info__name');
const joinJoinerName = document.querySelector('.join .info__bx.infoBxJoiner .info__name');
const joinJoinerStatus = document.querySelector('.join .info__bx.infoBxJoiner .info__status');
const joinSubtitleName = document.querySelector('.joinSubtitle__name');
const joinTitleName = document.querySelector('.joinTitle__name');

const waitTitle = document.querySelector('.wait__title');
const waitPlayerName = document.querySelector('.wait__playerName');
const waitFirName = document.querySelector('.wait .infoBxCreator .info__name');
const waitSecName = document.querySelector('.wait .infoBxJoiner .info__name');

const createBotBtn = document.querySelector('.create__fieldBtn.fieldContinue.createBot');
const createOnlineBtn = document.querySelector('.create__fieldBtn.fieldContinue.createOnline');

const roomIdInput = document.querySelector('.room__input');

const gamePlayerName = document.querySelector('.game__name.gamePlayerName');
const gameBotName = document.querySelector('.game__name.gameBotName');
const gameTurnText = document.querySelector('.game__turn');
const gameTurnName = document.querySelector('.gameTurn__name');

const winTitle = document.querySelector('.win__title');


// SOCKET ROUTING
export const socket = io();
let playerId;

socket.on('roomCreated', (data) => {
    // FOR CREATOR AFTER CREATING THE ROOM
    // Show join section and insert id to page info
    nameSection.style.display = "none";
    loaderSection.style.display = "none";
    joinSection.style.display = "flex";

    joinRoomIdText.innerText = data.roomId;
    joinCreatorName.innerText = data.playerName;

    playerId = data.playerId;
})

socket.on('playerJoined', (data) => {
    // FOR JOINED USER
    // Show create section
    roomSection.style.display = "none";
    loaderSection.style.display = "none";
    joinSection.style.display = "flex";

    joinCreatorName.innerText = data.creatorName;
    joinSubtitleName.innerText = data.creatorName;
    joinTitleName.innerText = data.creatorName;

    joinJoinerStatus.innerText = "Joined";
    joinRoomIdText.innerText = data.roomId;
    joinJoinerName.innerText = data.joinerName;
    joinSection.classList.add('playerJoined', 'textActive');

    playerId = data.playerId;
})

socket.on('joinedPlayer', (data) => {
    // FOR CREATOR AFTER PLAYER IS JOINED
    joinJoinerStatus.innerText = "Joined";
    joinJoinerName.innerText = data.joinerName;
    joinTitleName.innerText = data.creatorName;
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

    waitTitle.innerText = `Waiting for ${data.creatorName} to Start the game`;
})

socket.on('wait-startCreator', () => {
    waitSection.classList.add('buttonActive');
})

socket.on('move-game', (data) => {
    const dataClone = {...data.ships};

    const updatedInfo = {
        playerInfo: data.ships[playerId],
        isCreator: data.creatorId == playerId ? true : false
    }

    delete dataClone[playerId];
    
    updatedInfo.enemyInfo = Object.values(dataClone)[0];

    const namesClone = {...data.playerNames};
    delete namesClone[playerId];

    startOnlineGame({...updatedInfo, playerName: data.playerNames[playerId], enemyName: Object.values(namesClone)[0]});

    gameTurnText.classList.add('turnActive');
    gameTurnName.innerText = data.playerNames[data.creatorId];

    gamePlayerName.innerText = data.playerNames[playerId];
    gameBotName.innerText = Object.values(namesClone)[0];
    updatedInfo.isCreator ? gamePlayerName.classList.add('playerMove') : gameBotName.classList.add('playerMove');

    waitSection.style.display = "none";
    gameSection.classList.add('activeGame');
})

socket.on('over-win', (enemyName) => {
    // You win
    winSection.style.display = "flex";

    winTitle.innerText = `Congratulations, you won! Player ${enemyName} unfortunately lost.`;
})

socket.on('over-lose', (enemyName) => {
    // You lose
    winSection.style.display = "flex";

    winTitle.innerText = `Unfortunately you lost, player ${enemyName} won!`;
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

    createBotBtn.style.display = "none";
})

welcomeBotBtn.addEventListener('click', () => {
    welcomeSection.style.display = "none";
    botNameSection.style.display = "flex";
    
    createOnlineBtn.style.display = "none";

    botPrepare();
})

// BotName Section
const botNameInput = document.querySelector('.botName__input');
const botNameBtn = document.querySelector('.botName__btn');

let botName;

botNameBtn.addEventListener('click', () => {
    if(botNameInput.value.length <= 3){
        botNameInput.classList.add('noName');

        return;
    }

    botNameInput.classList.remove('noName');

    botName = botNameInput.value;
    gamePlayerName.innerText = botName;
    gameTurnName.innerText = botName;

    botNameSection.style.display = "none";
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

let roomIdLength = 6;

roomBtn.addEventListener('click', () => {
    if(roomIdInput.value.length < roomIdLength){
        roomIdInput.classList.add('idInputErr');

        return;
    }

    roomIdInput.classList.remove('idInputErr');

    loaderSection.style.display = "none";

    const data = {
        userName: nameInput.value,
        roomId: roomIdInput.value
    }

    socket.emit('joinPlayer', data);
})


// Join section
const joinContinueBtn = document.querySelector('.join__btn');

joinContinueBtn.addEventListener('click', () => {
    socket.emit('movePlayers-create');
})

// Create Section
createOnlineBtn.addEventListener('click', () => {
    // let playerShipPositions = [];
    // shipPositions.map(info => playerShipPositions.push({x: info.x, y: info.y, rotated: info.rotated}));

    // let playerShipCoords = [];
    // shipPositions.map(info => info.coords.map(coord => playerShipCoords.push(coord)));

    socket.emit('movePlayers-wait', shipPositions);
})

// Wait section
const waitStartBtn = document.querySelector('.wait__startBtn');

waitStartBtn.addEventListener('click', () => {
    socket.emit('movePlayers-game');
})