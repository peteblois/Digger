#!/bin/bash
rm -r ../Build
mkdir ../Build
mkdir ../Build/Debug
mkdir ../Build/Release
cd ../Source
cp Default.html ../Build/Debug/default.html
cp Default.html ../Build/Release/default.html
echo Building \'Debug/digger.js\'
target=../Build/Debug/digger.js
cat	Base64Reader.js \
	Direction.js \
	Player.js \
	Ghost.js \
	Sprite.js \
	Key.js \
	Sound.js \
	Position.js \
	Level.js \
	Display.js \
	Loader.js \
	Input.js \
	Function.js \
	Digger.js \
	LevelData.js \
	> $target
echo 'Digger.prototype.imageData = [ "'$(openssl base64 -in Sprite.png | tr -d '\n')'","'$(openssl base64 -in Font.png | tr -d '\n')'" ];' >> $target  
echo 'Digger.prototype.soundData = [ "'$(openssl base64 -in Diamond.wav | tr -d '\n')'","'$(openssl base64 -in Stone.wav | tr -d '\n')'","'$(openssl base64 -in Step.wav | tr -d '\n')'" ];' >> $target  
echo Building \'Release/digger.js\'
cd ../Tools
java -jar compiler.jar --js ../Build/Debug/digger.js > ../Build/Release/digger.js
echo Done.
