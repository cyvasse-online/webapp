module Cyvasse.Board
( Board(..)
) where

import Prelude

import           Data.Map (Map())
import qualified Data.Map as M

import Cyvasse.Piece
import Cyvasse.Square
import Cyvasse.Terrain

newtype Board = Board { terrain :: Map Square Terrain
                      , pieces  :: Map Square Piece
                      }
