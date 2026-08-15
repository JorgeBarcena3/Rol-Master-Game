/*
 * Lleva a cabo la logica del catch de impro
 */
class catchDeImproLibre_gm extends Gamemode
{

    /*
     * Constructor predeterminado del juego del tres en raya
     */
    constructor(_name = "", _description = "", _options = [], _players = 0)
    {

        super(_name, _description, _options, _players);
        this.players = [];

    }

    /* 
     * Determina si se debe o puede unir a una sala 
     */
    setGameMenu()
    {

        this.players = [];
        this.addPlayer(new Player(currentUser.alias));
        $("#Game-menu").animate(
        {
            left: '0vw'
        });
        $("#game-menu-info-text").text(this.description);
        $('#GM-btn_1').text(this.options[0]);
        $('#GM-btn_2').text(this.options[1]);
        $("#exampleModalLongTitle").text("Introduce el nombre de un jugador");
        $("#enterInRoom").text("Añadir jugador");
        $("#closeModal").text("Cerrar");
        $("#UserContainerMainMenu").css("display", "block");

        this.refreshPanel();
    }

    /* 
     * Determina si se debe o puede unir a una sala 
     */
    entrarEnLaSala()
    {
        let playerName = $("#RoomIdInput").val();
        playerName = playerName.toUpperCase();

        this.addPlayer(new Player(playerName));

        this.refreshPanel();

        $("#RoomIdInput").val("");
        $("#closeModal").click();


    }

    addPlayer(player)
    {
        for (let i = 0; i < this.players.length; i++)
            if (this.players[i].getName() === player.getName())
                player.setName(player.getName() + " (2)")

        this.players.push(player);
    }

    refreshPanel()
    {
        $("#UserContainerMainMenu").html("");
        let names = "";

        for (let i = 0; i < this.players.length; i++)
        {
            names += (i + 1) + ". ";
            names += this.players[i].getName();
            names += "<br>";
        }

        $("#UserContainerMainMenu").html(names);

    }

    /* 
    * Determina si se debe o puede unir a una sala 
    */
     instanciateRoom()
     {    
         //this.createRoom();
         $("#GP-btn_2").text("Eliminar sala")
         $("#GP-btn_1").css("display", "block");
         pageIndex = 4;
         app.goToPage("Game-Roulete");
     }

     tirarRuleta()
     {
          var option = {
               speed : 10,
               duration : 3,
               stopImageNumber : 0,
               startCallback : function() {
                    console.log('start');
               },
               slowDownCallback : function() {
                    console.log('slowDown');
               },
               stopCallback : function($stopElm) {
                    console.log('stop');
               }
          }

          $('div.roulette').roulette(option);
     }


}