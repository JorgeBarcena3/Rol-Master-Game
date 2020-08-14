/*
 * Clase que maneja las conexiones a la lobby
 */
class Gamemode {

    /*
     * Constructor por defecto, donde se inicializan los parametros
     */
    constructor(_name = "", _description = "", _options = [], _players = 0, _manager = 0) {
        this.name = _name;
        this.description = _description;
        this.options = _options;
        this.roomId = undefined;
        this.isInRoom = false;
        this.maxPlayers = _players;
        this.manager = _manager;
    }


    /*
     * Formateamos la fecha, y la devolvemos
     */
    fechaModificada = function() {
        var today = new Date();
        let date = '' + today.getDate() + today.getMonth() + today.getFullYear();
        date += ' ' + today.getHours() + today.getMinutes() + today.getSeconds() + today.getMilliseconds();

        return date;

    };

    /*
     * Creamos una habitacion con un ID unico
     */
    createRoom = function() {

        this.roomId = this.generateUniqueId();

        let room = {
            isInGame: false,
            users: { admin: { "user": currentUser.getDataToFirebase() } },
            admin: currentUser.Id,
            roomId: this.roomId,
            gamemode: this.name,
            fechaCreacion: this.fechaModificada(),
            gameManager: this.manager.getRoomInfo()
        }

        showLoading();

        firebase.database().ref('rooms/' + this.roomId).set(
            room,
            function(error) {

                if (error) {
                    sendAlert("Ha habido un problema al crear la sala. Intentelo mas adelante.", "Error", "Ok");

                } else {

                    getInfoRoom().then(function(data) {
                        subscribeToEvent(data.roomId);
                        hideLoading();
                    });

                }

            });

    }

    /*
     * Generamos un ID unico basado en el dia, hora, segundos y milisegundos (TODO: Mejorar sistema)
     */
    generateUniqueId = function() {

        let string = ('' + new Date().valueOf());
        return 'R' + string.substr(string.length - 5, 4);

    }

    /*
     * Añadimos el jugado actual a la habitacion deseada
     */
    addToRoom = function(RoomId) {

        showLoading();

        if (!this.isInRoom) {
            this.roomId = RoomId;
            firebase.database().ref('rooms/' + this.roomId + '/users').push({
                "user": currentUser.getDataToFirebase()
            }, function() {
                hideLoading();
            });
            this.isInRoom = true;

        }
    }

    /*
     * Eliminamos la sala o eliminamos al jugador de la sala, en funcion de los permisos que tenga
     */
    removeRoom = function() {

        showLoading();

        firebase.database().ref('rooms/' + this.roomId).once("value").then(function(snapshot) {

            var data = snapshot.val();

            var starCountRef = firebase.database().ref('rooms/' + data.roomId);
            starCountRef.off();

            if (data.admin == currentUser.Id) {
                firebase.database().ref('rooms/' + data.roomId).remove();
                hideLoading();
            } else {

                removePlayer(data);
            }
        });

        this.isInRoom = false;

    }


}


//Modo de juegos por defecto
var espia_palabra_gm = new Gamemode("espia_palabra_gm",
    "El objetivo del juego es encontrar a los espias entre los jugadores. A cada jugador de la sala se le dirá una palabra, exceptuando a un cierto número de jugadores que se denominarán espias. Se establecerá un orden, y todos los jugadores deberan decir una palabra por turno, relacionada con la palabra clave que se os ha proporcionado (incluido los espias). No podrán ser muy especificas porque los espias adivinaran cual es la palabra y ganaran ellos.", ["Crear una sala", "Unete a una sala existente"],
    0,
    new espia_gm());

//Modo de juego por defecto
var tres_en_raya_gm = new Gamemode("tres_en_raya_gm",
    "Las reglas del clásico 3 en raya, pero con una vuelta de tuerca. Ahora podrás predecir el movimiento de tu adversario, si lo aciertas, el no podrá colocar su ficha perderá tu turno; si no el colocorá su ficha de manera habitual.", ["Crear una sesión", "Unete a una sesion existente"],
    2,
    new tresEnRaya_gm());

//Almacenamos todos los modos de juego
var gameModes = { espia_palabra_gm, tres_en_raya_gm };

//El modo de juego actual
var currentGamemode = null;

/*
 * Manda una notificacion al usuario con un mensaje seleccionable
 */
function sendAlert(message = "", title = "Titulo", button = "Ok", _function = function() {}) {

    try {

        navigator.notification.alert(
            message, // message
            _function, // callback
            title, // title
            button // buttonName
        );

    } catch {
        alert(message);
    }
}

/*
 * Índice de la pagina en la que estamos, para volver atrás 
 */
var pageIndex = 0;