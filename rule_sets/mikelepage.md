Mikelepage's Cyvasse v5.0
=========================

Object of play
--------------

You win by capturing your opponent's king and preventing them from replacing it on the very next turn.

Gameplay
--------

For the initial setup you have 40 "home" squares on your site of the board in which you have to place your king and
6x rabble (your tier 1 pieces), 6x tier 2 pieces and 6x tier 3 pieces, as well as 6x mountains. You can place out
your dragon (your only tier 4 piece) during setup, but you can also hold it back and "bring it out" later.

Each player also has a fortress and 6x terrain tiles that are placed automatically when you place the pieces.
Tiles are different from pieces: while no two pieces can occupy the same space, tiles have an effect on the pieces
standing on them. The fortress is always located at the king's starting position, and each of the terrain tiles are
located at the starting positions of specific tier 2 pieces.

White starts. Players take turns making moves. The move with which you bring out the dragon must be within
a range of 4 spaces (the dragon's range for normal moves) from the fortress, including the fortress itself.
Capturing an opponent piece on this move is allowed.

Pieces
------

There are 10 types of piece in the game. All pieces except the mountains have a
tier level which is used to determine whether a piece can capture another piece.

Each player has

* 6 Mountains
* 6 Rabble
* 1 King
* 2 Crossbows
* 2 Spears
* 2 Light Horses
* 2 Trebuchets
* 2 Elephants
* 2 Heavy Horses
* 1 Dragon

![All pieces](/img/rule_sets/mikelepage/all_pieces.png)

Piece movement
--------------

### Mountains (passive)

![Mountains](/img/rule_sets/mikelepage/mountains.png)

Mountains are completely passive. They can't be captured and don't belong to either player.
They are placed during setup and are used to block the movement of opponent's pieces.
Dragons can fly over mountains, but no piece can be on the same tile as one.

### Active pieces

#### Tier 1

**Rabble pieces move 1 square orthogonally:**

![Rabble](/img/rule_sets/mikelepage/rabble.png)

**The King piece also moves one square orthogonally:**

![King](/img/rule_sets/mikelepage/king.png)

#### Tier 2

**Crossbows pieces move up to 3 squares orthogonally:**

![Crossbows](/img/rule_sets/mikelepage/crossbows.png)

**Spears pieces move up to 2 squares diagonally:**

![Spears](/img/rule_sets/mikelepage/spears.png)

**Light Horse pieces move up to 3 squares hexagonally (around either fortress):**

![Light Horse](/img/rule_sets/mikelepage/light_horse.png)

#### Tier 3

**Trebuchet pieces move orthogonally as far as possible:**

![Trebuchet](/img/rule_sets/mikelepage/trebuchet.png)

**Elephant pieces move diagonally as far as possible:**

![Elephant](/img/rule_sets/mikelepage/elephant.png)

**Heavy Horse pieces move as far as possible hexagonally (around either fortress):**

![Heavy Horse](/img/rule_sets/mikelepage/heavy_horse.png)

#### Tier 4

**The Dragon moves up to a range of 4 spaces (must be contiguous, no "jumping" of other pieces):**

![Dragon](/img/rule_sets/mikelepage/dragon.png)

### Interference

The following graphics illustrate the basic movement possibilites when other pieces are in the way.

![Movement interference example: Trebuchet](/img/rule_sets/mikelepage/movement_interference_1.png)
![Movement interference example: Elephant](/img/rule_sets/mikelepage/movement_interference_2.png)
![Movement interference example: Dragon](/img/rule_sets/mikelepage/movement_interference_3.png)

Capturing
---------

A piece can always capture another piece of the same or lower tier.
There is a way to capture pieces of higher tier though, it is called *flanking*.

Flanking can happen when multiple lower ranked pieces have a bearing on an opponents piece of higher rank.
When the "combined" tier of your flanking pieces is equal or higher to that of the target piece, the highest-tier
piece / one of the highest-tier pieces can capture the target piece.

In the "combined" tier of your flanking pieces, every 2 or more pieces of a lower tier count the same as n - 1 pieces
of the next higher tier, where n is the count of pieces of that tier. The king doesn't count as tier 1 piece though
when flanking. It counts as the same tier as the highest other flanking piece.

To illustrate, here are some basic examples:

* Two tier 1 pieces count as tier 2
* Two tier 2 pieces count as tier 3
* Three tier 1 pieces count as tier 3
* Three tier 2 pieces count as tier 4
* Four tier 1 pieces count as tier 4

These advanced examples show how different ranked piece can flank together:

* One tier 1 piece and one piece tier 2 can't flank
* Two tier 1 pieces and one tier 2 piece count as tier 3
* Two tier 1 pieces and one tier 3 piece can't flank
* Two tier 1 pieces and two tier 2 pieces count as tier 4
* Three tier 1 pieces and one tier 3 piece count as tier 4

Not all pieces that have a bearing on a certain target piece have to be flanking pieces. If there are two tier 2
pieces and one tier 2 piece that all have a bearing on a tier 2 piece, you can either directly capture it with
your tier 2 piece or capture it with one of your tier 1 pieces through flanking.

Terrain
-------

Tier 2 and tier 3 pieces that have the same movement style are also advantaged on the same kind of terrain.

Terrain increases the effective tier of those pieces by 1, but only when one of those pieces stands on them
and is being attacked. During setup, the terrain tiles are automatically placed at the tier 2 piece starting
positions, so that at the beginning the match, all tier 2 and tier 3 pieces are equally hard to capture.
Terrain, as well as Mountains, does not belong to either player.

| Type      | Placed via  | "Home terrain" for       |
|-----------|-------------|--------------------------|
| Hill      | Crossbows   | Crossbows, Trebuchet     |
| Forest    | Spears      | Spears, Elephant         |
| Grassland | Light Horse | Light Horse, Heavy Horse |

**All tier 2 and 3 pieces on their home terrain**

![Terrain Tiles](/img/rule_sets/mikelepage/terrain.png)

Fortresses
----------

Fortresses, like terrain, provide a +1 increase of the defense tier of pieces standing in them.
As opposed to terrain, this works for all pieces of the player owning the fortress, except the dragon
(which is already tier 4), but not for pieces of the other player.

Fortresses can also promote pieces standing on them. There are two types of piece promotions: The first one is an
ordinary "piece improvement" promotion. This type of promotion only happens at the beginning of the turn of the player
whose fortress it is, and only where that player has already lost a piece of the type the promotion is replacing.

The following piece promotions are possible:

| Original piece | Promoted to |
|----------------|-------------|
| Rabble         | Crossbows   |
| Rabble         | Spears      |
| Rabble         | Light Horse |
| Crossbows      | Trebuchet   |
| Spears         | Elephant    |
| Light Horse    | Heavy Horse |

When a rabble occupies the fortress and there are multiple piece types to which
it could be promoted, the player can then choose which piece it becomes.

The second type of promotion becomes possible when the king is captured. In order for that player to continue, they
must immediately promote one of their tier 3 pieces to King. This can happen at the beginning of the turn (if a tier 3
piece already occupies the fortress) or the end of the turn (if they move a tier 3 piece to the fortress).
If the King cannot be replaced the turn immediately after the king was captured, the game is over.

A fortress can also be ruined as a strategy to stop the opponent promoting more pieces. This happens when it is
occupied by an opponent's piece and cannot be retaken on the move immediately following the occupation. When a fortress
is ruined, it is removed from the board. The player who ruined the fortress then has to select one of the six corner
tiles of the board to be used as alternative center for the hexagonal movement of Light Horse and Heavy Horse pieces.
