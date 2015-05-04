#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

rm -f -r ../build
mkdir -p ../build/debug
mkdir -p ../build/release

cp ../src/Default.html ../build/debug/default.html
cp ../src/Default.html ../build/release/default.html

echo Building \'debug/digger.js\'

node tsc.js -target ES5 -out ../build/debug/digger.js lib.d.ts libex.d.ts ../src/*.ts

node base64.js ../build/debug/digger.js Digger.Game.prototype.imageData ../src/Sprite.png ../src/Font.png
node base64.js ../build/debug/digger.js Digger.Game.prototype.soundData ../src/Diamond.wav ../src/Stone.wav ../src/Step.wav

echo Building \'release/digger.js\'

node minify.js ../build/debug/digger.js ../build/release/digger.js

echo Done.
