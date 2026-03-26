#!/bin/sh

set -eu

cd "${0%/*}/.."

printf "\e[0;35m"
printf "╭─────────╮\n"
printf "│ \e[0;35mPublish\e[0;35m │\n"
printf "╰─────────╯\e[0m\n"

pnpm publish -r --no-git-checks --verbose

printf "\e[0;35m(Done)\e[0m\n"
