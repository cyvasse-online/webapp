module Cyvasse.Moves
( Moves()
--, moves
) where

import Prelude

import Cyvasse.Board
import Cyvasse.Piece
import Cyvasse.Square
import Cyvasse.Utils

type Moves = Square -> Board -> Array (Array Square)

-- moves :: Piece -> Moves
-- TODO

relMoves :: PieceType -> Moves
relMoves Mountains  = const2 $ []
relMoves Rabble     = const2 $ adjacentSquares
relMoves Crossbows  = const2 $ orthogonalSquares 2
relMoves Spears     = const2 $ diagonalSquares 2
relMoves LightHorse = const2 $ [] -- TODO
relMoves Trebuchet  = const2 $ orthogonalSquares 10
relMoves Elephant   = const2 $ diagonalSquares 5
relMoves HeavyHorse = const2 $ [] -- TODO
relMoves Dragon     = const2 $ squaresInRange 4
relMoves King       = const2 $ adjacentSquares
