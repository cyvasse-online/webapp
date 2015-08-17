module Cyvasse.Color ( Color(..) ) where

import Prelude
import Data.Generic

data Color = Black
           | White

derive instance genericColor :: Generic Color
instance showColor :: Show Color where
    show = gShow
