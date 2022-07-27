class cards
{
    parameters;
    activate()
    {
        //
    }
    canUse()
    {
        return true;
    }
}
//cards

class tile
{
    Name;//name for the tile identifier as string by default
    Id; //unique identifier for the tile 0 by default
    Type; //allows grouping of tyles by a type “” by default
    pieces = []; //array of pieces on this tile [] by default
    Adjacencies = []; //array of tiles adjacent to this tile [] by default
 
    //possibly functions to make the scripters life easier like:
    
}
class piece
{
    Id; //unique id for a piece 0 by default
    Type; //grouping information for the piece “” by default
    Player; //the player this piece belongs to
    Tile; //the tile this piece is on

}
class game_state
{
    board = []
    constructor()
    {
        //State


        
        //tiles

        
    }
//state accessors
    getTileByID(id)
    {
        for(let i = 0; i<this.board.length;i++)
        {
            if(this.board[i].Id == id)
                return this.board[i]
        }
        return null
    }

    getTilesByType(type)
    {
        results = []
        for(let i = 0; i<this.board.length;i++)
        {
            if(this.board[i].Type == type)
                results.push(this.board[i])
        }
        return results
    }
}






class player
{
    State = new game_state();
    chooseAction()
    {
        //
    }
    turn()
    {
        //redefined in subclasses
    }
}
//players


//functions
function endgame()
{
    //end_game


}

function console_Input(message)
{
    
    input = prompt(message);
    return input;
}

//
class script
{
    game = new game_state();
    players = [
        //add players
    ];
    
    

    play()
    {

        
        console.log("script-execution begins");
        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].State = this.game
        }

        for(let i =0;i< this.players.length;i++)
        {
            this.players[i].turn();
        }



    }
}

(new script()).play();