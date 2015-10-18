module Cyvasse.Square
( Square(..)
, adjacentSquares
, orthogonalSquares
, diagonalSquares
, squaresInRange
) where

import Prelude
import Data.Array
import Data.Generic

newtype Square = Square { x :: Int, y :: Int }

derive instance genericSquare :: Generic Square
instance showSquare :: Show Square where show = gShow
instance eqSquare   :: Eq   Square where eq   = gEq

instance semiringSquare :: Semiring Square where
    one = Square { x: 1, y: 1 }
    zero = Square { x: 0, y: 0 }
    add (Square a) (Square b) = Square { x: a.x + b.x, y: a.y + b.y }
    -- doesn't really make sense, but add and mul are in the same typeclass
    mul (Square a) (Square b) = Square { x: a.x * b.x, y: a.y * b.y }

instance ringSquare :: Ring Square where
    sub (Square a) (Square b) = Square { x: a.x - b.x, y: a.y - b.y }

getZ :: Square -> Int
getZ (Square sq) = -(sq.x + sq.y)

sqMul :: Int -> Square -> Square
sqMul n (Square sq) = Square { x: n * sq.x, y: n * sq.y }

adjacentSquares :: Array (Array Square)
adjacentSquares = singleton <<< Square <$>
    [ { x: 0, y: 1 },  { x: 1, y: 0 },  { x: 1, y: -1 }
    , { x: 0, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 } ]

orthogonalSquares :: Int -> Array (Array Square)
orthogonalSquares maxDistance = adjacentSquares <#> apply (sqMul <$> 1 .. maxDistance)

-- diagonally "adjacent"
dAdjacentSquares :: Array (Array Square)
dAdjacentSquares = singleton <<< Square <$>
    [ { x: -1, y: 2 }, { x: 1, y: 1 },   { x: 2, y: -1 }
    , { x: 1, y: -2 }, { x: -1, y: -1 }, { x: -2, y: 1 } ]

diagonalSquares :: Int -> Array (Array Square)
diagonalSquares maxDistance = dAdjacentSquares <#> apply (sqMul <$> 1 .. maxDistance)

squaresInRange :: Int -> Array (Array Square)
squaresInRange n
    | n < 1     = []
    | n == 1    = [[Square { x: 0, y: 1 }]]
    | otherwise = squaresInRange (n - 1)
                  <#> apply (add <$> concat adjacentSquares)
                  <#> (\\ [zero])
                  <#> nub
