class espia_gm {

    /*
     * Comienza la mini partida
     */
    startMiniGame(data) {

        for (let Id in data.game) {

            let str = "";
            if (Id == currentUser.Id) {

                str += data.game[Id].palabra.split('*')[0];


                if (data.game[Id].rol.includes("EMPEZAR"))
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


    /*
     * Logica del modo de juego del espia
     */
    logic(data) {

        firebase.database().ref('data/gamemode/' + currentGamemode.name).once("value").then(function(snapshot) {

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
            let positionToStart;


            if (numJugadores > 1) {

                positionToStart = Math.floor(Math.random() * numJugadores);
                espiasOrganitation[positionToStart] += "*EMPEZAR";
            }

            for (let userID in data.users) {

                if (espiasOrganitation[index] == undefined || !espiasOrganitation[index].includes("ESPIA")) {
                    espiasOrganitation[index] = "APALABRADO";
                }
                let word = (espiasOrganitation[index] == "APALABRADO") ? palabraComun : palabraEspia;
                let key = data.users[userID].user.Id;

                juego[key] = { "rol": espiasOrganitation[index], "palabra": word };
                index++;

            }

            //Eliminamos las partidas anteriores
            firebase.database().ref('rooms/' + currentGamemode.roomId + '/game').remove();
            //Añadimos la nueva partida
            firebase.database().ref('rooms/' + currentGamemode.roomId + '/game').set(juego);
        });

    }
}