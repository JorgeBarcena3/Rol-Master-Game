//Modo de juegos por defecto
var espia_palabra_gm = new espia_gm("espia_palabra_gm",
    "El objetivo del juego es encontrar a los espias entre los jugadores. A cada jugador de la sala se le dirá una palabra, exceptuando a un cierto número de jugadores que se denominarán espias. Se establecerá un orden, y todos los jugadores deberan decir una palabra por turno, relacionada con la palabra clave que se os ha proporcionado (incluido los espias). No podrán ser muy especificas porque los espias adivinaran cual es la palabra y ganaran ellos.", ["Crear una sala", "Unete a una sala existente"],
    0);

//Modo de juego por defecto
var tres_en_raya_gm = new tresEnRaya_gm("tres_en_raya_gm",
    "Las reglas del clásico 3 en raya, pero con una vuelta de tuerca. Ahora podrás predecir el movimiento de tu adversario, si lo aciertas, el no podrá colocar su ficha perderá tu turno; si no el colocorá su ficha de manera habitual.", ["Crear una sesión", "Unete a una sesion existente"],
    2);

//Modo de juego por de juegos de catch
var catch_de_impro_libre_gm = new catchDeImproLibre_gm("catch_de_impro_libre_gm",
"En el siguiente juego te apareceran una serie de juegos de improvasación teatral al azar. Deberas añadir a los usuarios que vais a jugar y disfrutar de la improvisacion", ["Empezar a improvisar", "Añadir jugadores"],
10);

//Almacenamos todos los modos de juego
var gameModes = { espia_palabra_gm, tres_en_raya_gm, catch_de_impro_libre_gm};

//El modo de juego actual
var currentGamemode = new Gamemode();

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