Mikelepage's Cyvasse v5.1
=========================

Object of play
--------------

You win by capturing your opponent's king and preventing them from replacing it on the very next turn.

Gameplay
--------

For the initial setup you have 40 "home" squares on the lower part
of the board in which you have to place all of your 26 pieces.

Each player also has a fortress and 6 terrain tiles which are placed automatically when placing the pieces.
These tiles are different from the pieces: while no two pieces can occupy the same space, pieces can stand
on tiles, which can have an effect on the piece. The fortress is always located at the king's starting position,
and each terrain tile is located at the starting position of a specific tier 2 piece.

White starts. Players take turns making moves.

Pieces
------

There are 10 types of piece in the game. All pieces except the mountains have a
tier level which is used to determine whether a piece can capture another piece.

Each player has

<div class='piece-list'>
	<div> <div>6</div> <div>Mountains</div>    <img alt='' src='/img/icons/black/mountains.png' />   </div>
	<div> <div>6</div> <div>Rabble</div>       <img alt='' src='/img/icons/black/rabble.png' />      </div>
	<div> <div>1</div> <div>King</div>         <img alt='' src='/img/icons/black/king.png' />        </div>
	<div> <div>2</div> <div>Crossbows</div>    <img alt='' src='/img/icons/black/crossbows.png' />   </div>
	<div> <div>2</div> <div>Spears</div>       <img alt='' src='/img/icons/black/spears.png' />      </div>
	<div> <div>2</div> <div>Light Horses</div> <img alt='' src='/img/icons/black/light_horse.png' /> </div>
	<div> <div>2</div> <div>Trebuchets</div>   <img alt='' src='/img/icons/black/trebuchet.png' />   </div>
	<div> <div>2</div> <div>Elephants</div>    <img alt='' src='/img/icons/black/elephant.png' />    </div>
	<div> <div>2</div> <div>Heavy Horses</div> <img alt='' src='/img/icons/black/heavy_horse.png' /> </div>
	<div> <div>1</div> <div>Dragon</div>       <img alt='' src='/img/icons/black/dragon.png' />      </div>
</div>

Piece movement
--------------

<div class='picture-grid'>
	<figure>
		<figcaption>Rabble move 1 square orthogonally</figcaption>
		<img src='/img/rule_sets/mikelepage/rabble.png' alt='Rabble' />
	</figure>

	<figure>
		<figcaption>The king also moves 1 square orthogonally</figcaption>
		<img src='/img/rule_sets/mikelepage/king.png' alt='King' />
	</figure>

	<figure>
		<figcaption>Crossbows move up to 3 squares orthogonally</figcaption>
		<img src='/img/rule_sets/mikelepage/crossbows.png' alt='Crossbows' />
	</figure>

	<figure>
		<figcaption>Spears move up to 2 squares diagonally</figcaption>
		<img src='/img/rule_sets/mikelepage/spears.png' alt='Spears' />
	</figure>

	<figure>
		<figcaption>Light Horses move up to 3 squares hexagonally around either fortress</figcaption>
		<img src='/img/rule_sets/mikelepage/light_horse.png' alt='Light Horse' />
	</figure>

	<figure>
		<figcaption>Trebuchets move orthogonally as far as possible</figcaption>
		<img src='/img/rule_sets/mikelepage/trebuchet.png' alt='Trebuchet' />
	</figure>

	<figure>
		<figcaption>Elephants move diagonally as far as possible</figcaption>
		<img src='/img/rule_sets/mikelepage/elephant.png' alt='Elephant' />
	</figure>

	<figure>
		<figcaption>Heavy Horses move as far as possible hexagonally around either fortress</figcaption>
		<img src='/img/rule_sets/mikelepage/heavy_horse.png' alt='Heavy Horse' />
	</figure>

	<figure>
		<figcaption>The dragon moves up to a range of 4 spaces (must be contiguous, no "jumping" of other pieces)</figcaption>
		<img src='/img/rule_sets/mikelepage/dragon.png' alt='Dragon' />
	</figure>
</div>

### Mountains

Mountains are completely passive. They can't be captured and don't belong to either player.
They are placed during setup and are used to block the movement of other pieces.
Dragons can fly over mountains, but no piece can be on the same tile as one.

Movement interference
---------------------

The following graphics illustrate the basic movement possibilites when other pieces are in the way.

<div class='movement-interference-grid'>
	<img alt='' src='/img/rule_sets/mikelepage/movement_interference_1.png' />
	<img alt='' src='/img/rule_sets/mikelepage/movement_interference_1x.png' />
	<img alt='' src='/img/rule_sets/mikelepage/movement_interference_2.png' />
	<img alt='' src='/img/rule_sets/mikelepage/movement_interference_2x.png' />
	<img alt='' src='/img/rule_sets/mikelepage/movement_interference_3.png' />
	<img alt='' src='/img/rule_sets/mikelepage/movement_interference_3x.png' />
</div>

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

Each tier 2 or tier 3 piece has a "home terrain" type that gives them an increased defense tier, meaning a tier 2
piece – while on its home terrain – can't be taken by another tier 2 piece but only by a tier 3 or 4 piece, or by
flanking pieces with an equally high combined tier.

Each terrain type is the home terrain for one tier 2 and one tier 3 piece type. Pieces with the same movement
style also have the same home terrain. The following list shows which terrain belongs to which pieces:

<div class='terrain-list'>
	<div>
		<div class='icon'><img alt='' src='/img/icons/hill.png' /><img alt='' class='piece' src='/img/icons/black/crossbows.png' /></div>
		<div><strong>Hill:</strong><br /> Crossbows,<br /> Trebuchets</div>
		<div class='icon'><img alt='' src='/img/icons/hill.png' /><img alt='' class='piece' src='/img/icons/black/trebuchet.png' /></div>
	</div>

	<div>
		<div class='icon'><img alt='' src='/img/icons/forest.png' /><img alt='' class='piece' src='/img/icons/black/spears.png' /></div>
		<div><strong>Forest:</strong><br /> Spears,<br /> Elephants</div>
		<div class='icon'><img alt='' src='/img/icons/forest.png' /><img alt='' class='piece' src='/img/icons/black/elephant.png' /></div>
	</div>

	<div>
		<div class='icon'><img alt='' src='/img/icons/grassland.png' /><img alt='' class='piece' src='/img/icons/black/light_horse.png' /></div>
		<div><strong>Grassland:</strong><br /> Light Horses,<br /> Heavy Horses</div>
		<div class='icon'><img alt='' src='/img/icons/grassland.png' /><img alt='' class='piece' src='/img/icons/black/heavy_horse.png' /></div>
	</div>
</div>

During setup, the terrain tiles are automatically placed under the tier 2 pieces they give an advantage
to, meaning that when beginning the match, all tier 2 and tier 3 pieces are equally hard to capture.
Terrain, as well as Mountains, does not belong to either player.

Fortresses
----------

Fortresses, like terrain, provide a +1 increase of the defense tier of pieces standing in them.
As opposed to terrain, this works for all pieces of the player owning the fortress, except the
dragon (which is already tier 4), but not for pieces of the other player.

A fortress can also be ruined: This happens immediately when it is occupied by an opponent's piece,
and the icon changes to indicate that the fortress is ruined. Horse movement remains as shown above.

Fortresses that have not been ruined can promote the pieces standing on them.
There are two types of piece promotions: The first one is an ordinary "piece improvement" promotion.
This type of promotion only happens at the beginning of the turn of the player whose fortress it is,
and only where that player has already lost a piece of the type the promotion is replacing.

The following piece promotions are possible:

| Original piece | Promoted to |
|----------------|-------------|
| Rabble         | Crossbows   |
| Rabble         | Spears      |
| Rabble         | Light Horse |
| Crossbows      | Trebuchet   |
| Spears         | Elephant    |
| Light Horse    | Heavy Horse |

When a rabble occupies the fortress and there are multiple piece types to
which it could be promoted, the player can then choose which piece it becomes.

The second type of promotion becomes possible when the king is captured. In order for that player to continue, they must
immediately promote one of their tier 3 pieces to King. This can happen at the beginning of the turn (if a tier 3 piece
already occupies the fortress) or the end of the turn (if they move a tier 3 piece to the fortress). If the King cannot
be replaced the turn immediately after the king was captured, the game is over and the player who captured the King wins.

Notes on Changes from previous version
--------------------------------------

1) "Bringing out" the Dragon - a closer reading of the books has revealed that the Dragon has been
said to be "brought out" even when it was already stated to be on the board. We have revised our
rules such that a Dragon must be placed on the board during setup, and that "bringing it out" simply
means bringing it into the fray. Because of our play testing, we think this also makes the game more
tactically interesting, although we can re-add it as an option in later builds if people request it.

2) Ruining the fortress is now instant to encourage people to mount a better defence of
their King/Fortress combination. We have also included a "ruined fortress" icon, and
the horse movement remains unchanged when a fortress is ruined.
