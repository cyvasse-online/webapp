module Cyvasse.Piece
( PieceType(..)
, Piece(..)
) where

import Prelude
import Data.Generic

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

derive instance genericPieceType :: Generic PieceType
instance showPieceType :: Show PieceType where
    show = gShow

data Piece = Piece { color :: Color
                   , type  :: PieceType
                   }
