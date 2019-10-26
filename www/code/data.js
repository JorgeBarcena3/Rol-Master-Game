class Gamemode {
    constructor(_name = "", _description = "", _options = []) {
        this.name = _name;
        this.description = _description;
        this.options = _options;
        this.roomId = undefined;
        this.isInRoom = false;
    }


    //Se le da formato a la fecha
    fechaModificada = function() {
        var today = new Date();
        let date = '' + today.getDate() + today.getMonth() + today.getFullYear();
        date += ' ' + today.getHours() + today.getMinutes() + today.getSeconds();

        return date;

    };

    createRoom = function() {

        let string = ('' + new Date().valueOf());
        this.roomId = 'R' + string.substr(string.length - 5, 4);
        firebase.database().ref('rooms/' + this.roomId).set({
            users: { admin: { "currentGameId": currentGameId } },
            admin: currentGameId,
            roomId: this.roomId,
            gamemode: this.name,
            fechaCreacion: this.fechaModificada()
        }, function(error) {

            if (error) {
                console.log(error);
            } else {

                console.log("Habitacion creada con satisfaccion");

            }

        });

        this.isInRoom = true;


    }

    addToRoom = function(RoomId) {

        if (!this.isInRoom) {
            this.roomId = RoomId;
            firebase.database().ref('rooms/' + this.roomId + '/users').push({
                currentGameId
            });
            this.isInRoom = true;
        }
    }

    removeRoom = function() {

        firebase.database().ref('rooms/' + this.roomId).once("value").then(function(snapshot) {

            var data = snapshot.val();
            console.log("Admin: " + data.admin + " - RoomId: " + data.roomId);
            if (data.admin = currentGameId)
                firebase.database().ref('rooms/' + data.roomId).remove();

        });

        this.isInRoom = false;

    }

}

var espia_palabra_gm = new Gamemode("espia_palabra_gm",
    "El objetivo del juego es encontrar a los espias entre los jugadores. A cada jugador de la sala se le dirá una palabra, exceptuando a un cierto número de jugadores que se denominarán espias. Se establecerá un orden, y todos los jugadores deberan decir una palabra por turno, relacionada con la palabra clave que se os ha proporcionado (incluido los espias). No podrán ser muy especificas porque los espias adivinaran cual es la palabra y ganaran ellos.", ["Crear una sala", "Unete a una sala existente"]);


var espia_situacion_gm = new Gamemode("espia_situacion_gm",
    "El objetivo del juego es encontrar a los espias entre los jugadores. A cada jugador de la sala se le asignará un personaje en una situacion aleatoria, exceptuando a un cierto número de jugadores que se denominarán espias. A continuación, los jugadores podran hacer preguntas entre si, con el fin de descubrir quienes son los espias del grupo. Los espias deberan adivinar en que situacion se encuentran. No podrán ser muy especificas porque los espias adivinaran cual es la situacion y ganaran ellos.", ["Crear una sala", "Unete a una sala existente"]);

var gameModes = { espia_palabra_gm, espia_situacion_gm };