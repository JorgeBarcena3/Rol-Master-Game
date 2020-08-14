/*
 * Configuracion de la conexion con firebase
 */
var firebaseConfig = {
    apiKey: "AIzaSyDgVLYiht2MwP8brcmgnu1wmu950_bdK50",
    authDomain: "rol-game-master.firebaseapp.com",
    databaseURL: "https://rol-game-master.firebaseio.com",
    projectId: "rol-game-master",
    storageBucket: "rol-game-master.appspot.com",
    messagingSenderId: "1041891411321",
    appId: "1:1041891411321:web:0e832c76599cde61439ba8",
    measurementId: "G-NRNT0QCCN0"
};


var database;

/*
 * Configuracion la informacion de la room a la que estamos conectados
 */
async function getInfoRoom() {

    if (this.currentGamemode.roomId) {

        let promise = firebase.database().ref('rooms/' + this.currentGamemode.roomId).once("value").then(function(snapshot) {

            return snapshot.val();

        });

        let result = await promise;

        return result;

    } else {

        return null;

    }

}

/*
 * Observamos los datos de una room
 */
async function getCustomPath(path) {

    if (this.currentGamemode.roomId) {

        let promise = await firebase.database().ref(path).once("value").then(function(snapshot) {

            return snapshot.val();

        });

        let result = await promise;

        return result;



    } else {

        return null;

    }

}

/*
 * Observamos los datos de una room
 */
async function setCustomPath(path, obj) {

    firebase.database().ref(path).set(
        obj,
        function(error) {
            if (error)
                return error;
            else {
                return false;
            }
        }
    );

}

/*
 * Eliminamos a un jugador de la room que viene contenida en data
 */
function removePlayer(data) {

    for (variable in data.users) {

        if (data.users[variable].user.Id == this.currentUser.Id) {
            //Eliminamos esta referencia
            firebase.database().ref('rooms/' + data.roomId + "/users/" + variable).remove();
            hideLoading();
        }

    }

}

var alias;

/*
 * Autenticacion anónima
 */
function registroAnonimo() {

    let alias = $("#Alais_lbl").val();
    showLoading();
    if (alias == "") {
        var nombres = ["Mike", "Nick", "Slagathor", "Banana", "Rick", "Astley", "Rock", "Apple", "Hamilton", "Carnox", "Pronax"];
        alias = nombres[Math.floor(Math.random() * (nombres.length - 1))];
    }


    firebase.auth().signInAnonymously().catch(function(error) {
        hideLoading();
        sendAlert("Error con los servidores. Intentelo mas tarde", "Error", "Ok");
        console.log(error);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user.uid);
            currentUser = new User(user.uid, alias, user.isAnonymous, user);
            localStorage.setItem('userKey', JSON.stringify(currentUser.getDataToFirebase()));
            pageIndex++;
            hideLoading();
        } else {

        }
    });



    setMainMenu();
    $("#Login").animate({ left: '-100vw' }, function() {
        $("#Login").css("left", "100vw");
    });

}


/*
 * Autenticacion con google
 */
function registroGoogle() {

    showLoading();

    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider).then(function() {
        return firebase.auth().getRedirectResult();
    }).then(function(result) {
        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        currentUser = new User(user.uid, user.displayName, user.isAnonymous, user);
        console.log(currentUser);

        setMainMenu();
        $("#Login").animate({ left: '-100vw' }, function() {
            $("#Login").css("left", "100vw");
        });
        hideLoading();
        pageIndex++;
        // ...
    }).catch(function(error) {

        sendAlert("Error al iniciar sesion con Google. Intentelo mas tarde", "Error", "Ok");
        hideLoading();
    });


}