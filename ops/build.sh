#!/bin/sh

set -eu

cd "${0%/*}/.."

echo -en "\e[0;36m"
echo -e "╭───────╮"
echo -en "│ \e[0;36m"
echo -en "Build"
echo -e "\e[0;36m │"
echo -e "╰───────╯\e[0m"

echo -e "\e[0;36m(Installing)\e[0m"
npm i

echo -e "\e[0;36m(Linting)\e[0m"
npm run lint

echo -e "\e[0;36m(Testing)\e[0m"
npm run test

echo -e "\e[0;36m(Bundling)\e[0m"
npm run build

echo -e "\e[0;36m(Done)\e[0m\n"
