/*
 * Muestra el icono de loading
 */
function showLoading() {
    $("#LoadingPage").css("display", "block");
    $("#LoadingPage").animate({ opacity: '1' }, 250);
}

/*
 * Muestra el icono de loading
 */
function hideLoading() {

    $("#LoadingPage").animate({ opacity: '0' }, 250, function() {
        $("#LoadingPage").css("display", "none");
    });
}



/*
 * Pone el menu del juego
 */
function setGameMenu() {

    this.currentGamemode.setGameMenu();
}

/*
 * Abre un determinado modo de juego
 */
function openGamemode(_name) {

    this.currentGamemode = this.gameModes[_name];
    this.currentGamemode.removeMainMenu();
    setGameMenu();
    pageIndex = 2;
}

/*
 * Eliminamos la sala, y volvemos al menu principal
 */
function removeRoom() {

    this.currentGamemode.removeRoom();
    this.currentGamemode.setMainMenu();
    $("#Game-player").animate({ left: '100vw' });
    pageIndex = 1;

}

/*
 * Mostramos el roomId dentro de la sala
 */
function setGameLobby() {

    $("#roomId").html('Id de habitacion <br> <span style="font-size: 2em;line-height: 5vh;letter-spacing: 5px;">' + this.currentGamemode.roomId + "</span>");
}

/*
 * Nos subscribimos al evento por el cual cambian cosas en la sala
 */
function subscribeToEvent(roomId) {

    this.currentGamemode.isInRoom = true;
    var starCountRef = firebase.database().ref('rooms/' + roomId);
    starCountRef.on('value', function(snapshot) {
        this.currentGamemode.applyChanges(snapshot.val());
    });
}

function finishMiniGame() {
    //Eliminamos las partidas anteriores
    getInfoRoom().then(function(data) {

        data.isInGame = false;
        firebase.database().ref('rooms/' + currentGamemode.roomId).update(data);
        firebase.database().ref('rooms/' + currentGamemode.roomId + '/game').remove();

    });

}

/*
 * Esta funcion empieza una partida, reparte los roles y da por empezada la partida
 */
function startGame() {

    getInfoRoom().then(function(data) {

        data.isInGame = true;
        firebase.database().ref('rooms/' + currentGamemode.roomId).update(data);

        //Update de que se esta creando la partida -- Enviar a firebase, para que todos se queden bloquedados (TODO)

        currentGamemode.startMiniGame(data);
        currentGamemode.logic(data);


    });
}