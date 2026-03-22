#!/bin/sh

set -eu

cd "${0%/*}/.."

printf "\e[0;36m"
printf "╭───────╮\n"
printf "│ \e[0;36mBuild\e[0;36m │\n"
printf "╰───────╯\e[0m\n"

printf "\e[0;36m(Installing)\e[0m\n"
npm i

printf "\e[0;36m(Linting)\e[0m\n"
npm run lint

printf "\e[0;36m(Testing)\e[0m\n"
npm run test

printf "\e[0;36m(Bundling)\e[0m\n"
npm run build

printf "\e[0;36m(Generating types)\e[0m\n"

npx -p typescript tsc \
  --allowJs --checkJs false --strict false \
  --module nodenext --target ES2024 \
  --skipLibCheck --declaration --emitDeclarationOnly \
  --declarationDir ./dts-out \
  src/index.js

echo '{
  "compilerOptions": {
    "target": "ES2024",
    "typeRoots": []
  }
}' > ./dts-out/tsconfig.json

npx dts-bundle-generator \
  --out-file dist/index.d.ts \
  --project ./dts-out/tsconfig.json \
  ./dts-out/index.d.ts

rm -rf ./dts-out

printf "\e[0;36m(Done)\e[0m\n"
