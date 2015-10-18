module Cyvasse.Utils
( const2
, stringify
) where

import           Prelude

import           Data.Array (init, last)
import qualified Data.Char as C
import           Data.Foldable (elem, foldl)
import           Data.Maybe
import           Data.String (joinWith, toLower, fromChar, toCharArray)

const2 :: forall a b c. a -> b -> c -> a
const2 = const >>> const

stringify :: forall a. (Show a) => a -> String
stringify = show >>> splitWhen isUpper >>> joinWith " "

splitWhen :: (Char -> Boolean) -> String -> Array String
splitWhen f = toCharArray >>> foldl g []
    where g acc x | f x = acc ++ [fromChar x]
          g acc x       = case last acc of
              Just lastWord -> fromMaybe [] (init acc) ++ [lastWord ++ fromChar x]
              Nothing       -> [fromChar x]

-- ASCII is enough for my use cases and proper unicode-aware isLetter,
-- isUpper, isLower, ... functions don't exist for PureScript yet.
isUpper :: Char -> Boolean
isUpper c = c `elem`
    ['A','B','C','D','E','F','G','H','I','J'
    ,'K','L','M','N','O','P','Q','R','S','T'
    ,'U','V','W','X','Y','Z']
