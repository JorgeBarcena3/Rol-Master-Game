/*
* Jugador en el modo offline
*/
class Player
{

    constructor(_name, _points = 0)
    {
        this.name = _name;
        this.points = _points;
    }

    getName()
    {
        return this.name;
    }

    setName(newName)
    {
        this.name = newName;
    }
}