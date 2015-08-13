module Cyvasse.Terrain ( TerrainType(..) ) where

import Prelude

data TerrainType = Hill
                 | Forest
                 | Grassland

instance showTerrainType :: Show TerrainType where
    show Hill      = "Hill"
    show Forest    = "Forest"
    show Grassland = "Grassland"
