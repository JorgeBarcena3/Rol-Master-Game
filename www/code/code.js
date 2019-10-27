/*
 * Quita el main menu
 */
function removeMainMenu() {
    $("#Main-menu").animate({ left: '-100vw' }, function() {
        $("#Main-menu").css("left", "100vw");
    });
}

/*
 * Pone el main menu
 */
function setMainMenu() {
    $("#Main-menu").animate({ left: '0vw' });
}


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
 * Quita la sala de juego
 */
function removeGameMenu() {
    $("#Game-menu").animate({ left: '100vw' });
}

/*
 * Pone el menu del juego
 */
function setGameMenu() {
    $("#Game-menu").animate({ left: '0vw' });
    $("#game-menu-info-text").text(this.currentGamemode.description);
    $('#GM-btn_1').text(this.currentGamemode.options[0]);
    $('#GM-btn_2').text(this.currentGamemode.options[1]);
}

/*
 * Abre un determinado modo de juego
 */
function openGamemode(_name) {

    this.currentGamemode = this.gameModes[_name];
    removeMainMenu();
    setGameMenu();
    pageIndex = 2;
}

/*
 * Pone el main menu
 */
function closeGameMenuToMenu() {

    removeGameMenu();
    setMainMenu();
    pageIndex = 1;
}

/*
 * Creamos una sala, el admin, es el unico que puede empezar la partida
 */
function createRoom() {

    this.currentGamemode.createRoom();
    $("#GP-btn_2").text("Eliminar sala")
    $("#GP-btn_1").css("display", "block");

    changeToLobby();

}

/*
 * Entra en el preámbito de una sala
 */
function changeToLobby() {

    getInfoRoom().then(function(data) {

        $("#Game-menu").animate({ left: '-100vw' }, function() {
            $("#Game-menu").css("left", "100vw");
        });
        $("#Game-player").animate({ left: '0' });
        setGameLobby();
        pageIndex = 3;


    });
}

/*
 * Eliminamos la sala, y volvemos al menu principal
 */
function removeRoom() {

    this.currentGamemode.removeRoom();
    setMainMenu();
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
 * Entramos en la sala introducida por el jugador
 */
function entrarEnLaSala() {

    let roomId = $("#RoomIdInput").val();
    roomId = roomId.toUpperCase();

    showLoading();

    firebase.database().ref('rooms/' + roomId).once("value").then(function(snapshot) {

        var data = snapshot.val();

        if (data && data.gamemode == this.currentGamemode.name && !data.isInGame) {

            this.currentGamemode = this.gameModes[data.gamemode];
            this.currentGamemode.roomId = roomId;
            this.currentGamemode.addToRoom(this.currentGamemode.roomId);

            setGameLobby();
            $("#GP-btn_2").text("Salir de la sala")
            subscribeToEvent(roomId);
            changeToLobby();
            $("#closeModal").click();


        } else {

            sendAlert("No existe ninguna sala con ese identificador en este modo de juego.", "Error", "Ok");
            hideLoading();
        }

    });

}

/*
 * Nos subscribimos al evento por el cual cambian cosas en la sala
 */
function subscribeToEvent(roomId) {

    this.currentGamemode.isInRoom = true;
    var starCountRef = firebase.database().ref('rooms/' + roomId);
    starCountRef.on('value', function(snapshot) {
        applyChanges(snapshot.val());
    });
}

/*
 * Hace un update de los cambios en la sala
 */
function applyChanges(value) {

    if (value) {
        if (value.isInGame) {
            if (value.game) {
                startMiniGame(value);
            } else {
                showLoading();

            }
        } else {
            printUsers(value);
        }
    } else {
        $("#Game-player").animate({ left: '100vw' });
        setMainMenu();
        hideLoading();

    }

}

/*
 * Comienza la mini partida
 */
function startMiniGame(data) {

    for (Id in data.game) {

        let str = "";
        if (Id == currentUser.Id) {

            str += data.game[Id].palabra;

            if (data.game[Id].rol == "EMPEZAR")
                str += '<br> <span style="font-size: 0.5em;"> (Empiezas tu) </span>';

            $("#rol_player_lbl").html(str);

        }

    }



    if (data["admin"] == currentUser.Id) {
        $("#GPL-btn_1").css("display", "block");
    } else {
        $("#GPL-btn_1").css("display", "none");
    }

    $("#Game-playing").animate({ left: '0' });
    $("#Game-player").animate({ left: '100vw' });
    pageIndex = 4;

    hideLoading();
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
 * Pinta los usuarios actuales
 */
function printUsers(value) {

    if (pageIndex == 4) {
        $("#Game-playing").animate({ left: '100vw' });
        $("#Game-player").animate({ left: '0' });
        pageIndex = 3;
    }


    if (value["admin"] == currentUser.Id) {
        $("#GP-btn_1").css("display", "block");
    } else {
        $("#GP-btn_1").css("display", "none");
    }

    let container = $("#userContainer");
    container.empty();
    let str = "";
    for (variable in value.users) {

        if (value.users[variable].user.Id == currentUser.Id)
            str += '<div class="userInfo myAlias">' + value.users[variable].user.alias + ' </div>';
        else
            str += '<div class="userInfo">' + value.users[variable].user.alias + ' </div>';

    }

    container.append(str);
    hideLoading();


}

/*
 * Esta funcion empieza una partida, reparte los roles y da por empezada la partida
 */
function startGame() {

    getInfoRoom().then(function(data) {

        data.isInGame = true;
        firebase.database().ref('rooms/' + currentGamemode.roomId).update(data);

        //Update de que se esta creando la partida -- Enviar a firebase, para que todos se queden bloquedados (TODO)

        //Obtengo los datos segun mi modo de juego
        firebase.database().ref('data/gamemode/' + this.currentGamemode.name).once("value").then(function(snapshot) {

            var GamemodeInfo = snapshot.val();

            var keys = Object.keys(GamemodeInfo.palabra)
            let palabraComun = GamemodeInfo.palabra[keys[keys.length * Math.random() << 0]];
            let palabraEspia = GamemodeInfo.espia;

            let juego = {};

            //Update de que se esta creando la partida -- Enviar a firebase, para que todos se queden bloquedados (TODO)

            let numJugadores = Object.keys(data.users).length;

            //El minimo de espias siempre es 1;
            let numeroEspias = Math.floor(numJugadores * 10 / 100) < 1 ? 1 : Math.floor(numJugadores * 10 / 100);
            let espiasOrganitation = new Array(numJugadores);

            for (let i = 0; i < numeroEspias; i++) {

                let changed;
                do {
                    changed = false;
                    let position = Math.floor(Math.random() * numJugadores);
                    if (espiasOrganitation[position] != "ESPIA") {
                        espiasOrganitation[position] = "ESPIA";
                        changed = true;
                    }

                } while (!changed);
            }
            let index = 0;
            let firstToStart = false;
            let positionToStart;


            do {
                positionToStart = Math.floor(Math.random() * numJugadores);
                if (espiasOrganitation[positionToStart] != "ESPIA")
                    espiasOrganitation[positionToStart] = "EMPEZAR";

            } while (numJugadores > 1 && espiasOrganitation[positionToStart] == "ESPIA");

            for (userID in data.users) {

                if (espiasOrganitation[index] != "ESPIA" && espiasOrganitation[index] != "EMPEZAR") {
                    espiasOrganitation[index] = 0;
                }
                let word = (espiasOrganitation[index] == 0 || espiasOrganitation[index] == "EMPEZAR") ? palabraComun : palabraEspia;
                let key = data.users[userID].user.Id;

                juego[key] = { "rol": espiasOrganitation[index], "palabra": word };
                index++;

            }



            //Eliminamos las partidas anteriores
            firebase.database().ref('rooms/' + currentGamemode.roomId + '/game').remove();
            //Añadimos la nueva partida
            firebase.database().ref('rooms/' + currentGamemode.roomId + '/game').set(juego);
        });

    });

}