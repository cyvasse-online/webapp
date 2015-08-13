module Cyvasse.Color ( Color(..) ) where

import Prelude

data Color = Black
           | White

instance showColor :: Show Color where
    show Black = "Black"
    show White = "White"
