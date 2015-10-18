module Cyvasse.Piece
( PieceType(..)
, Piece(..)
, baseTier
, homeTerrain
, startingPieces
) where

import Prelude
import Data.Array
import Data.Foldable (elem)
import Data.Generic
import Data.Maybe

import Cyvasse.Color
import Cyvasse.Square
import Cyvasse.Terrain

data PieceType = Mountains
               | Rabble
               | Crossbows
               | Spears
               | LightHorse
               | Trebuchet
               | Elephant
               | HeavyHorse
               | Dragon
               | King

derive instance genericPieceType :: Generic PieceType
instance showPieceType :: Show PieceType where
    show = gShow

newtype Piece = Piece { color :: Color
                      , type  :: PieceType
                      }

instance showPiece :: Show Piece where
    show (Piece obj) = "Piece { color: " ++ show obj.color ++
                       ", type: " ++ show obj.type ++ " }"

piece :: Color -> PieceType -> Piece
piece c t = Piece { color: c, type: t }

baseTier :: PieceType -> Maybe Int
baseTier Mountains  = Nothing
baseTier Rabble     = Just 1
baseTier Crossbows  = Just 2
baseTier Spears     = Just 2
baseTier LightHorse = Just 2
baseTier Trebuchet  = Just 3
baseTier Elephant   = Just 3
baseTier HeavyHorse = Just 3
baseTier Dragon     = Just 4
baseTier King       = Just 1

homeTerrain :: PieceType -> Maybe Terrain
homeTerrain Crossbows  = Just Hill
homeTerrain Trebuchet  = Just Hill
homeTerrain Spears     = Just Forest
homeTerrain Elephant   = Just Forest
homeTerrain LightHorse = Just Grassland
homeTerrain HeavyHorse = Just Grassland
homeTerrain _          = Nothing

startingPieces :: Color -> Array Piece
startingPieces c = map (piece c) <<< concat $
    [ r 6 Mountains
    , r 6 Rabble
    , r 2 Crossbows, r 2 Spears, r 2 LightHorse
    , r 2 Trebuchet, r 2 Elephant, r 2 HeavyHorse
    , r 1 Dragon
    , r 1 King ]
    where r = replicate
