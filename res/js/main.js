import { shipPositions } from "./gameSetting.js";
import { startOnlineGame } from "./onlineGame.js";
import { botPrepare } from "./prepareGame.js";

// REFRESH SECTION
const refresh = document.querySelector('.refresh');
const refreshBtn = document.querySelector('.refresh__btn');

let oldWidth = window.innerWidth;

window.addEventListener('resize', () => {
    if(window.innerWidth === oldWidth) return;

    refresh.style.display = "flex";
})

refreshBtn.addEventListener('click', () => {
    window.location.reload();
})

// WIN SECTION
const winBtn = document.querySelector('.win__btn');

winBtn.addEventListener('click', () => {
    window.location.reload();
})



// INDEX ELEMENTS
const welcomeSection = document.querySelector('.welcome');
const nameSection = document.querySelector('.name');
const botNameSection = document.querySelector('.botName');
const linkNameSection = document.querySelector('.nameLink');
const roomSection = document.querySelector('.room');
const joinSection = document.querySelector('.join');
const waitSection = document.querySelector('.wait');
const createSection = document.querySelector('.create');
const gameSection = document.querySelector('.game');
const winSection = document.querySelector('.win');
const loaderSection = document.querySelector('.loader');
const dissSection = document.querySelector('.diss');

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

const joinRoomCopyBtn = document.querySelector('.join__roomIconBx');

const gamePlayerName = document.querySelector('.game__name.gamePlayerName');
const gameBotName = document.querySelector('.game__name.gameBotName');
const gameTurnText = document.querySelector('.game__turn');
const gameTurnName = document.querySelector('.gameTurn__name');

const nameLinkRoomId = document.querySelector('.nameLink__roomId');

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

    joinCopyBtnHandler(data.roomId);
})

socket.on('playerJoined', (data) => {
    // FOR JOINED USER
    // Show create section
    roomSection.style.display = "none";
    loaderSection.style.display = "none";
    joinSection.style.display = "flex";

    joinRoomCopyBtn.style.display = "none";

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
    joinRoomCopyBtn.style.display = "none";

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

    socket.emit('gameEnded');
})

socket.on('over-lose', (enemyName) => {
    // You lose
    winSection.style.display = "flex";

    winTitle.innerText = `Unfortunately you lost, player ${enemyName} won!`;
    
    socket.emit('gameEnded');
})


socket.on('link-join-room-init', (data) => {
    welcomeSection.style.display = "none";
    linkNameSection.style.display = "flex";

    nameLinkRoomId.innerText = data.roomId;

    createBotBtn.style.display = "none";
})

socket.on('link-joinedPlayer', (data) => {
    // FOR JOINED USER USING LINK JOIN METHOD
    // Show create section
    linkNameSection.style.display = "none";
    joinSection.style.display = "flex";

    joinRoomCopyBtn.style.display = "none";

    joinCreatorName.innerText = data.creatorName;
    joinSubtitleName.innerText = data.creatorName;
    joinTitleName.innerText = data.creatorName;

    joinJoinerStatus.innerText = "Joined";
    joinRoomIdText.innerText = data.roomId;
    joinJoinerName.innerText = data.joinerName;
    joinSection.classList.add('playerJoined', 'textActive');

    playerId = data.playerId;
})


// Join room input error
socket.on('joinRoomError', () => {
    roomSection.classList.add('roomConnectErr');
})

socket.on('room-deleted', () => {
    // To all users when the room was deleted
    dissSection.style.display = "flex";
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
    if(botNameInput.value.length <= 2 || botNameInput.value.length > 8){
        botNameSection.classList.add('inputErr');

        return;
    }

    botNameSection.classList.remove('inputErr');

    botName = botNameInput.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();;
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
    if(nameInput.value.length <= 2 || nameInput.value.length > 8){
        nameInput.classList.add('noName');

        return;
    }

    nameInput.classList.remove('noName');

    loaderSection.style.display = "flex";

    let playerName = nameInput.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    socket.emit('createRoom', playerName);
})

nameJoinBtn.addEventListener('click', () => {
    if(nameInput.value.length <= 2 || nameInput.value.length > 8){
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
        roomSection.classList.add('roomLengthErr');

        return;
    }

    roomSection.classList.remove('roomLengthErr');
    roomSection.classList.remove('roomConnectErr');

    loaderSection.style.display = "none";

    let userName = nameInput.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const data = {
        userName: userName,
        roomId: roomIdInput.value
    }

    socket.emit('joinPlayer', data);
})


// Join section
const joinContinueBtn = document.querySelector('.join__btn');

joinContinueBtn.addEventListener('click', () => {
    socket.emit('movePlayers-create');
})

function joinCopyBtnHandler(roomId){
    joinRoomCopyBtn.addEventListener('click', () => {
        let originUrl = window.location.origin;
        let finalUrl = `${originUrl}/game/?id=${roomId}`;
        let finalText = `Play Battleship Game with me: ${finalUrl}`;

        navigator.clipboard.writeText(finalText);
    })
}

// Create Section
createOnlineBtn.addEventListener('click', () => {
    // let playerShipPositions = [];
    // shipPositions.map(info => playerShipPositions.push({x: info.x, y: info.y, rotated: info.rotated}));

    // let playerShipCoords = [];
    // shipPositions.map(info => info.coords.map(coord => playerShipCoords.push(coord)));

    let isEmpty = false;

    shipPositions.map(info => {if(info.coords.length === 0) isEmpty = true});

    if(isEmpty){
        return;
    }

    socket.emit('movePlayers-wait', shipPositions);
})

// Wait section
const waitStartBtn = document.querySelector('.wait__startBtn');

waitStartBtn.addEventListener('click', () => {
    socket.emit('movePlayers-game');
})


// NameLink Section
const nameLinkInput = document.querySelector('.nameLink__input');
const nameLinkBtn = document.querySelector('.nameLink__btn');

nameLinkBtn.addEventListener('click', () => {
    if(nameLinkInput.value.length <= 2 || nameLinkInput.value.length > 8){
        linkNameSection.classList.add('inputErr');

        return;
    }

    linkNameSection.classList.remove('inputErr');

    let userName = nameLinkInput.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    socket.emit('link-joined-send', {userName: userName});
})