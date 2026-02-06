#!/bin/sh

set -eu

cd "${0%/*}/.."

echo -en "\e[0;35m"
echo -e "╭─────────╮"
echo -en "│ \e[0;35m"
echo -en "Publish"
echo -e "\e[0;35m │"
echo -e "╰─────────╯\e[0m"

echo -e "\e[0;35m(Resolving Versions)\e[0m"

pkg_name=$(node -p "require('./package.json').name")
local_version=$(node -p "require('./package.json').version")
remote_version=$(npm view "$pkg_name@$local_version" version 2>/dev/null || echo "unpublished")
package="$pkg_name@$local_version"

echo "Local Version is $local_version"

if [[ "$local_version" = "$remote_version" ]]; then
  echo "Version $local_version is already published, no actions necessary"
else
  echo -e "\e[0;35m(Publishing...)\e[0m"
  npm publish
  echo -e "$package published"
fi

echo -e "\e[0;35m(Done)\e[0m\n"
