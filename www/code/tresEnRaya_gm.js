/*
 * Lleva a cabo la logica del tres en raya
 */
class tresEnRaya_gm extends Gamemode {

    /*
     * Constructor predeterminado del juego del tres en raya
     */
    constructor(_name = "", _description = "", _options = [], _players = 0) {

        super(_name, _description, _options, _players);

        this.turn = 0; // Comienzan las X
        this.values = [-1, -1, -1, -1, -1, -1, -1, -1, -1]; // Valores iniciales
        this.winPosition = [ // Posiciones de victorias
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [7, 4, 1],
            [8, 5, 2],
            [0, 4, 8],
            [6, 4, 2]
        ];
    }

    /*
     * Refresca el tablero
     */
    refreshBoard() {

        this.values = [-1, -1, -1, -1, -1, -1, -1, -1, -1]; // Valores iniciales
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
            "<span class='box' id='cell_0' data-field='0' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "<span class='box' id='cell_1' data-field='1' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "<span class='box' id='cell_2' data-field='2' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "<span class='box' id='cell_3' data-field='3' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "<span class='box' id='cell_4' data-field='4' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "<span class='box' id='cell_5' data-field='5' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "<span class='box' id='cell_6' data-field='6' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "<span class='box' id='cell_7' data-field='7' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "<span class='box' id='cell_8' data-field='8' onclick='currentGamemode.manager.clickOnCell(this);'></span>" +
            "</div>");


        $("#rol_player_container").css("width", "90vw");
        $("#rol_player_container").css("height", "46vh");

        $("#rol_player_container").html(htmlString);
    }

    /**
     * Determina las imagenes que tienen que ir en cada posicion
     */
    setBackgroundImages() {

        for (let i = 0; i < this.values; i++) {
            if (this.values[i] != -1)
                $("#cell_" + i).css("background-image", "url('./media/" + this.values[i] + ".png')");

        }
    }

    /**
     * Actualiza el trablero local con el de firebase
     */
    async mergeBoardFirebase() {

        let data = setCustomPath('rooms/' + currentGamemode.roomId + '/gameManager', this.getRoomInfo());

        let info = await getCustomPath('rooms/' + currentGamemode.roomId + '/gameManager');

        console.log(info);

        this.values = info.board;
        this.turn = info.turn;

        this.setBackgroundImages();

        hideLoading();

    }

    /**
     * Devuelve la informacion relevante para firebase de la sala
     */
    getRoomInfo() {

        let info = {
            board: this.values,
            turn: this.turn
        };

        return info;
    }

    /*
     * Realizamos un click en una celda
     */
    clickOnCell(cellinfo) {

        let pos = cellinfo.dataset.field;

        if (this.values[pos] === -1) {
            $("#cell_" + pos).css("background-image", "url('./media/" + this.turn + ".png')");
            this.values[pos] = this.turn;
            if (!this.checkFinalBoard())
                this.turn = this.turn == 0 ? 1 : 0;
            else
                this.finishGame();

            this.mergeBoardFirebase();
        }


    }

    /**
     * Se ejecuta cuando se termina el juego
     */
    finishGame() {

        alert("El ganador del juego ha sido " + this.turn);
        finishMiniGame();

    }

    /**
     * Determina si la partida ha acabado o no
     */
    checkFinalBoard() {

        for (let i = 0; i < this.winPosition.length; i++) {

            if (
                (this.values[this.winPosition[i][0]] == this.turn) &&
                (this.values[this.winPosition[i][1]] == this.turn) &&
                (this.values[this.winPosition[i][2]] == this.turn)
            )
                return true;

        }

        return false;
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