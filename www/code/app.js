var app = {

    /*
     * En funcion de donde se ejecute, se activan los eventos o no
     */
    initialize: function() {

        showLoading();

        var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        if (app) {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } else {
            this.onDeviceReady();
        }


    },

    /*
     * Inicializamos la base de datos, si hay conexion
     */
    onDeviceReady: function() {

        if (this.checkIfConection()) {
            sendAlert("Necesitas tener una conexion a internet", "Error");
        } else {

            //Añadimos los eventos
            document.addEventListener("offline", this.pauseOnline.bind(this), false);
            document.addEventListener("online", this.resumeOnline.bind(this), false);
            document.addEventListener("backbutton", this.onBackKeyDown.bind(this), false);

            /*
             * Inicializacion de firebase y las analiticas
             */
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
            database = firebase.database(); //Objeto que guarda la referencia a la base de datos

            hideLoading();
        }
    },

    /*
     * Comprobamos si hay conexion
     */
    checkIfConection: function() {

        var networkState = navigator.connection.type;

        return (networkState == "none");
    },


    /*
     * Paramos la conexion
     */
    pauseOnline: function() {

        showLoading();
        sendAlert("Has perdido la conexion", "Error");

    },

    /*
     * Retomamos la conexion
     */
    resumeOnline: function() {

        if (!database) {
            /*
             * Inicializacion de firebase y las analiticas
             */
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
            database = firebase.database(); //Objeto que guarda la referencia a la base de datos  
        }

        hideLoading();
    },

    /*
     * Si pulsamos el boton de atras
     */
    onBackKeyDown: function() {
        switch (pageIndex) {

            case 0:
                MOForceAppClose.forceAppClose();

                break;
            case 1:
                this.goToPage("Login");
                pageIndex--;
                break;
            case 2:
                this.goToPage("Main-menu");
                pageIndex--;
                break;
            case 3:
                removeRoom();
                break;
            default:
                break;
        }

    },


    /*
     * Ir a una pagina en concreto
     */
    goToPage: function(pagina_id) {

        let pages = [
            "Login",
            "Main-menu",
            "Game-menu",
            "Game-player"
        ];

        for (let i = 0; i < pages.length; i++) {
            if (pages[i] === pagina_id) {
                $("#" + pages[i]).animate({ left: '0vw' });
            } else {
                $("#" + pages[i]).animate({ left: '100vw' });
            }
        }

    }


};

app.initialize();



/**
 * Sube un archivo a la bbdd de las palabras
 */