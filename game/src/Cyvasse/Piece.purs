module Cyvasse.Piece
( PieceType(..)
, Piece(..)
) where

import Prelude

import Cyvasse.Color

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

instance showPieceType :: Show PieceType where
    show Mountains  = "Mountains"
    show Rabble     = "Rabble"
    show Crossbows  = "Crossbows"
    show Spears     = "Spears"
    show LightHorse = "LightHorse"
    show Trebuchet  = "Trebuchet"
    show Elephant   = "Elephant"
    show HeavyHorse = "HeavyHorse"
    show Dragon     = "Dragon"
    show King       = "King"

data Piece = Piece { pcColor :: Color
                   , pcType  :: PieceType
                   }
