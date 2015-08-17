module Cyvasse.Terrain ( TerrainType(..) ) where

import Prelude
import Data.Generic

data TerrainType = Hill
                 | Forest
                 | Grassland

derive instance genericTerrainType :: Generic TerrainType
instance showTerrainType :: Show TerrainType where
    show = gShow
