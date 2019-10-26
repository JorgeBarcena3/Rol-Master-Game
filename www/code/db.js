    // Your web app's Firebase configuration
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
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();


    // Get a reference to the database service
    var database = firebase.database();

    var currentGameId = new Date().valueOf();