/*
 * Lleva a cabo la logica del tres en raya
 */
class tresEnRaya_gm {

    /*
     * Constructor predeterminado del juego del tres en raya
     */
    constructor() {

    }

    /*
     * Refresca el tablero
     */
    refreshBoard() {


        let htmlString = new String(
            "<div Id='tres_info_game'> Esto es un test </div>" +
            "<div Id='rol_player_container'> </div>" +
            "<div class='row' id='game-menu-buttons'>" +
            "   <div class='col-12'>" +
            "        <button class='btn btn-primary red' id='GPL-btn_1' onclick='finishMiniGame()' style='width: 100%;'>" +
            "              Acabar la partida<br> " +
            "        </button>" +
            "   </div>" +
            "</div>");

        $("#Game-playing").html(htmlString);

        htmlString = new String(
            "<div id='tablero'>" +
            "<span class='box' data-field='1'></span>" +
            "<span class='box' data-field='2'></span>" +
            "<span class='box' data-field='3'></span>" +
            "<span class='box' data-field='4'></span>" +
            "<span class='box' data-field='5'></span>" +
            "<span class='box' data-field='6'></span>" +
            "<span class='box' data-field='7'></span>" +
            "<span class='box' data-field='8'></span>" +
            "<span class='box' data-field='9'></span>" +
            "</div>");


        $("#rol_player_container").css("width", "90vw");
        $("#rol_player_container").css("height", "46vh");

        $("#rol_player_container").html(htmlString);
    }

    /*
     * Comienza la mini partida
     */
    startMiniGame(data) {

        this.refreshBoard();

        $("#Game-playing").animate({ left: '0' });
        $("#Game-player").animate({ left: '100vw' });
        pageIndex = 4;

        hideLoading();
    }


    /*
     * Logica del modo de juego del espia
     */
    logic(data) {

    }
}