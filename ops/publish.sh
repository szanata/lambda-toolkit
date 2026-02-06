#!/bin/sh

set -eu

cd "${0%/*}/.."

printf "\e[0;35m"
printf "╭─────────╮\n"
printf "│ \e[0;35mPublish\e[0;35m │\n"
printf "╰─────────╯\e[0m\n"

printf "\e[0;35m(Resolving Versions)\e[0m\n"

pkg_name=$(node -p "require('./package.json').name")
local_version=$(node -p "require('./package.json').version")
remote_version=$(npm view "$pkg_name@$local_version" version 2>/dev/null || echo "unpublished")
package="$pkg_name@$local_version"

printf "Local Version is $local_version\n"

if [ "$local_version" = "$remote_version" ]; then
  printf "Version $local_version is already published, no actions necessary\n"
else
  printf "\e[0;35m(Publishing...)\e[0m\n"
  npm publish
  printf "$package published"
fi

printf "\e[0;35m(Done)\e[0m\n"
