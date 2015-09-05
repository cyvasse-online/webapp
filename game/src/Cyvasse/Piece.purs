module Cyvasse.Piece
( PieceType(..)
, Piece(..)
) where

import Prelude
import Data.Foldable (elem)
import Data.Generic
import Data.Maybe

import Cyvasse.Color
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

baseTier :: PieceType -> Maybe Int
baseTier Mountains  = Nothing
baseTier Rabble     = Just 1
baseTier King       = Just 1
baseTier Crossbows  = Just 2
baseTier Spears     = Just 2
baseTier LightHorse = Just 2
baseTier Trebuchet  = Just 3
baseTier Elephant   = Just 3
baseTier HeavyHorse = Just 3
baseTier Dragon     = Just 4

homeTerrain :: PieceType -> Maybe Terrain
homeTerrain Crossbows  = Just Hill
homeTerrain Trebuchet  = Just Hill
homeTerrain Spears     = Just Forest
homeTerrain Elephant   = Just Forest
homeTerrain LightHorse = Just Grassland
homeTerrain HeavyHorse = Just Grassland
homeTerrain _          = Nothing
