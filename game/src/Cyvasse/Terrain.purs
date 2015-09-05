module Cyvasse.Terrain ( Terrain(..) ) where

import Prelude
import Data.Generic

data Terrain = Hill
             | Forest
             | Grassland

derive instance genericTerrain :: Generic Terrain
instance showTerrain :: Show Terrain where
    show = gShow
