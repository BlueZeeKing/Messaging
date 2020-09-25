#!/bin/bash

rm -rf build
cp -r src build

npx tailwindcss build build/src/styles.css -o build/src/tailwind.css
purgecss --css build/src/tailwind.css --content build/views/index.ejs --output build/src/tailwind.css
cleancss build/src/tailwind.css -o build/static/styles.min.css
terser build/static/main.js -o build/static/main.min.js -m -c

sed -i '.bak' 's/styles.css/styles.min.css/g' build/views/index.ejs

rm -rf build/src
rm build/static/main.js
rm build/static/styles.css
rm build/views/index.ejs.bak