Cyvasse Online Webapp
=====================

This repository contains the webapp powering the Cyvasse Online website.

For the game itself (cyvasse.js) to be playable through this webapp, you need
to copy the file `cyvasse.js` ([cyvasse-game][] built with emscripten).

Building:

    autoreconf -i
    cd build
    ../configure
    make

[cyvasse-game]: https://github.com/cyvasse-online/cyvasse-game
