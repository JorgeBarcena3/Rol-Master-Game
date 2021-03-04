/*
 * Gamemode base class
 */
class Gamemode {

    /*
     * Constructor por defecto, donde se inicializan los parametros
     */
    constructor(_name = "", _description = "", _options = [], _players = 0) {
        this.name = _name;
        this.description = _description;
        this.options = _options;
        this.roomId = undefined;
        this.isInRoom = false;
        this.maxPlayers = _players;
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
            gameManager: this.getRoomInfo()
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
    
   /* 
    * Determina si se debe o puede unir a una sala 
    */
    setGameMenu()
    {
         $("#Game-menu").animate({ left: '0vw' });
         $("#game-menu-info-text").text(this.description);
         $('#GM-btn_1').text(this.options[0]);
         $('#GM-btn_2').text(this.options[1]);
         $("#exampleModalLongTitle").text("Introduce el ID de una sala")
         $("#enterInRoom").text("Entrar en la sala")
         $("#closeModal").text("Cerrar")
         $("#UserContainerMainMenu").css("display", "none");

    }

    /*
    * Entra en el preámbito de una sala
    */
    changeToLobby() {


        getInfoRoom().then(function(data) {

            console.log(data);

            $("#Game-menu").animate({ left: '-100vw' }, function() {
                $("#Game-menu").css("left", "100vw");
            });
            $("#Game-player").animate({ left: '0' });
            setGameLobby();
            pageIndex = 3;


        });
    }

    /* 
    * Determina si se debe o puede unir a una sala 
    */
    instanciateRoom()
    {    
        this.createRoom();
        $("#GP-btn_2").text("Eliminar sala")
        $("#GP-btn_1").css("display", "block");
        this.changeToLobby();    
    }

    setMainMenu()
    {
        $("#Main-menu").animate({ left: '0vw' });
    }

    
    /*
     * Hace un update de los cambios en la sala
     */
    applyChanges(value) {

        if (value) {
            if (value.isInGame) {
                if (value.game) {
                    currentGamemode.startMiniGame(value);
                } else {
                    showLoading();

                }
            } else {
                this.printUsers(value);
            }
        } else {
            $("#Game-player").animate({ left: '100vw' });
            this.setMainMenu();
            hideLoading();

        }

    }

    /*
     * Pinta los usuarios actuales
     */
    printUsers(value) {

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
        
        for (let variable in value.users) {

            if (value.users[variable].user.Id == currentUser.Id)
                str += '<div class="userInfo myAlias">' + value.users[variable].user.alias + ' </div>';
            else
                str += '<div class="userInfo">' + value.users[variable].user.alias + ' </div>';

        }

        container.append(str);
        hideLoading();

    }

    /*
    * Quita el main menu
    */
    removeMainMenu() {
       
       $("#Main-menu").animate({ left: '-100vw' }, function() {
           $("#Main-menu").css("left", "100vw");
       });
    }

    /*
    * Pone el main menu
    */
    closeGameMenuToMenu() {

        // $("#Game-menu").animate({ left: '100vw' });
        // $("#Main-menu").animate({ left: '0vw' });
        pageIndex = 1;
        app.goToPage("Main-menu");
    }
    
   /* 
    * Determina si se debe o puede unir a una sala 
    */
    entrarEnLaSala()
    {
         let roomId = $("#RoomIdInput").val();
         roomId = roomId.toUpperCase();

         $("#exampleModalLongTitle").text("Introduce el ID de una sala");

         showLoading();

         firebase.database().ref('rooms/' + roomId).once("value").then(function(snapshot) {
            
             var data = snapshot.val();
            
             if (data && data.gamemode == currentGamemode.name && !data.isInGame && ((Object.keys(data.users).length < currentGamemode.maxPlayers) || currentGamemode.maxPlayers == 0)) {
                
                 currentGamemode = gameModes[data.gamemode];
                 currentGamemode.roomId = roomId;
                 currentGamemode.addToRoom(currentGamemode.roomId);
                
                 setGameLobby();
                 $("#GP-btn_2").text("Salir de la sala")
                 $("#GP-btn_1").css("display", "none");
                 subscribeToEvent(roomId);
                 currentGamemode.changeToLobby();
                 $("#closeModal").click();
                
                
             } else {
                
                 sendAlert("No existe ninguna sala con ese identificador en este modo de juego.", "Error", "Ok");
                 hideLoading();
             }
            
         });
    }
    
}