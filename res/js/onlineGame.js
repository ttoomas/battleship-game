import { setShipPositions } from "./prepareGame.js";


export function startOnlineGame(data){
    console.log(data);

    gameHandler(data);
}

function gameHandler(data){
    setShipPositions(data.enemyInfo, 0);
    setShipPositions(data.playerInfo, 1);
}