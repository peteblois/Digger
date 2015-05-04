@echo off

pushd %~dp0

rd /s /q ..\build
md ..\build\debug
md ..\build\release

copy ..\src\Default.html ..\build\debug\default.html
copy ..\src\Default.html ..\build\release\default.html

echo Building 'debug/digger.js'

set Source=
for %%i in ("../src/*.ts") do call set Source=%%Source%% ../src/%%i
node tsc.js -target ES5 -out ..\build\debug\digger.js lib.d.ts libex.d.ts %Source%

node base64.js ../build/debug/digger.js Digger.Game.prototype.imageData ../src/Sprite.png ../src/Font.png
node base64.js ../build/debug/digger.js Digger.Game.prototype.soundData ../src/Diamond.wav ../src/Stone.wav ../src/Step.wav

echo Building 'release/digger.js'

node minify.js ../build/debug/digger.js ../build/release/digger.js

popd

echo Done.
