var currentGamemode = null;

function removeMainMenu() {
    $("#Main-menu").animate({ left: '-100vw' });
}

function setMainMenu() {
    $("#Main-menu").animate({ left: '0vw' });
}

function removeGameMenu() {
    $("#Game-menu").animate({ left: '100vw' });
}

function setGameMenu() {
    $("#Game-menu").animate({ left: '0vw' });
    $("#game-menu-info-text").text(this.currentGamemode.description);
    $('#GM-btn_1').text(this.currentGamemode.options[0]);
    $('#GM-btn_2').text(this.currentGamemode.options[1]);
}


function openGamemode(_name) {

    this.currentGamemode = this.gameModes[_name];
    removeMainMenu();
    setGameMenu();
}

function closeGameMenuToMenu() {

    removeGameMenu();
    setMainMenu();
}

function createRoom() {

    this.currentGamemode.createRoom();
    changeToLobby();

}

function changeToLobby() {
    $("#Game-menu").animate({ left: '-100vw' }, function() {
        $("#Game-menu").css("left", "100vw");
    });
    $("#Game-player").animate({ left: '0' });
    setGameLobby();
}

function removeRoom() {

    this.currentGamemode.removeRoom();
    setMainMenu();
    $("#Game-player").animate({ left: '100vw' });
}

function setGameLobby() {

    $("#roomId").text("Id de habitacion: " + this.currentGamemode.roomId);
}

function entrarEnLaSala() {
    let roomId = $("#RoomIdInput").val();
    roomId = roomId.toUpperCase();

    var starCountRef = firebase.database().ref('rooms/' + roomId);
    starCountRef.on('value', function(snapshot) {
        this.currentGamemode = this.gameModes[snapshot.val().gamemode];
        this.currentGamemode.roomId = roomId;
        setGameLobby();
        //   this.currentGamemode.addToRoom(this.currentGamemode.roomId);
        updateUsers(snapshot.val());
    });

    changeToLobby();
    $("#closeModal").click();
}

function updateUsers(value) {

    printUsers(value);

}

function printUsers(value) {

    let container = $("userContainer");
    for (variable in value.users) {
        console.log(value.users[variable].currentGameId);
    }


}