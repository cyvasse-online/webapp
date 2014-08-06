<style scoped>
    img {
        width: 350px;
        height: auto;
    }
</style>

Mikelepage's Cyvasse v5.0
=========================

Pieces
------

| Type        | Tier | Movement type | Range limit | Can be promoted to             |
|-------------|------|---------------|-------------|--------------------------------|
| Mountains   | -    | -             | -           | -                              |
| Rabble      | 1    | orthogonally  | 1           | Crossbows, Spears, Light Horse |
| King        | 1    | orthogonally  | 1           | -                              |
| Crossbows   | 2    | orthogonally  | 3           | Trebuchet                      |
| Spears      | 2    | diagonally    | 2           | Elephant                       |
| Light Horse | 2    | hexagonal     | 3           | Heavy Horse                    |
| Trebuchet   | 3    | orthogonally  | -           | King                           |
| Elephant    | 3    | diagonally    | -           | King                           |
| Heavy Horse | 3    | hexagonal     | -           | King                           |
| Dragon      | 4    | range-based   | 4           | -                              |

### Properties limited to a certain piece type

**Mountains:** Can't be captured, don't belong to either player

**King:** In flanking, acts as being of the same tier as the best other involved piece

**Dragon**: Can fly over mountains, can stay off the board when leaving the setup

Piece movements
---------------

**Orthogonal movement**

![Rabble and King](/img/tutorial/mikelepage/movement_orthogonal_1.png)
![Crossbows](/img/tutorial/mikelepage/movement_orthogonal_3.png)
![Trebuchet](/img/tutorial/mikelepage/movement_orthogonal_n.png)

**Diagonal movement**

![Spears](/img/tutorial/mikelepage/movement_diagonal_2.png)
![Elephant](/img/tutorial/mikelepage/movement_diagonal_n.png)

**Hexagonal movement ("around" fortresses)**

![Light Horse](/img/tutorial/mikelepage/movement_hexagonal_3.png)
![Heavy Horse](/img/tutorial/mikelepage/movement_hexagonal_n.png)

**Range-based movement (move anywhere within a range)**

![Dragon](/img/tutorial/mikelepage/movement_range_4.png)

Terrain (coloured tiles placed on the board at the beginning of the game)
-------

Terrain increases the effective tier of certain pieces when defending by 1 when one of those pieces stands on them.
Every terrain type has one advantaged tier 2 piece type and one advantaged tier 3 piece type.
During setup, the terrain tiles are bound to their advantaged tier 2 pieces, so that when
beginning the match, all tier 2 and tier 3 pieces are equally hard to capture.
Terrain, as well as Mountains, doesn't belong to either player.

| Type      | Placed via  | "Home terrain" for       |
|-----------|-------------|--------------------------|
| Hill      | Crossbows   | Crossbows, Trebuchet     |
| Forest    | Spears      | Spears, Elephant         |
| Grassland | Light Horse | Light Horse, Heavy Horse |

**Crossbows and Trebuchet pieces on their home terrain**

![Hill](/img/tutorial/mikelepage/hill.png)

**Spears and Elephant pieces on their home terrain**

![Forest](/img/tutorial/mikelepage/forest.png)

**Light Horse and Heavy Horse pieces on their home terrain**

![Grassland](/img/tutorial/mikelepage/grassland.png)

Fortresses
----------

Fortresses, as well as terrain, provide a +1 increase of the defense tier of pieces standing in them. For fortresses
though, this works for all pieces of the player owning the fortress, except the dragon.

Fortresses can also promote pieces standing on them. There are two types of piece promotions: The first one is ordinary
"piece improving" promotion. This type of promotion only happens when it's the beginning of the turn of the player who
owns the fortress and a players piece of the type the original piece should be promoted to was captured before.

The following ordinary piece promotions are possible:

| Original piece | Promoted to |
|----------------|-------------|
| Rabble         | Crossbows   |
| Rabble         | Spears      |
| Rabble         | Light Horse |
| Crossbows      | Trebuchet   |
| Spears         | Elephant    |
| Light Horse    | Heavy Horse |

When the piece in the fortress is a rabble and there are multiple piece types it could be promoted to, the player can
choose which of those piece types it will be promoted to.

The second type of promotion is the promotion of a tier 3 piece to king. This can happen both at the beginning and the
end of a players turn and only during the turn immediately after the king was captured.

A fortress can also be ruined. This happens when it is occupied by an opponent piece and cannot be retaken on the move
immediately following the occupation. When a fortress is ruined, it is removed from the board. The player who ruined the
fortress then has to select one of the six corner tiles of the board to be used as alternative center for the hexagonal
movement of Light Horse and Heavy Horse pieces.

Capturing
---------

A piece can always capture another piece of the same or lesser tier level.

### Flanking

<!-- TODO -->

Gameplay
--------

For the initial setup you have 40 "home" squares on your site of the board in which you have to place your 19 tier 1 to
tier 3 pieces and 6 mountains. You can also place the dragon inside this area, but you don't have to.

The fortress is always placed on the tile the king is placed on, and the
terrain tiles are placed where their advantaged tier 2 pieces are placed.

If dragon is not placed on the board initially, it can be "brought out" as a seperate move later.
This move can have the fortress and all tiles in a range of 4 (the dragons range for normal moves) as target, as long
as there is no mountains piece or any own piece on them. Capture an opponent piece on this move is allowed.

Object of play
--------------

A player wins when capturing the opponents king and preventing the opponent from promoting a new king within his / her
following turn. This can be accomplished by ruining the opponents fortress before capturing his king, but also by
capturing all of the opponents tier 3 pieces that are within one move of his / her fortress.
