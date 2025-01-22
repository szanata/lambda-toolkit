#!/bin/bash

set -e

dry_run=$1

cd "${0%/*}/.."

echo -en "\e[0;35m"
echo -e "╭─────────────────╮"
echo -en "│ \e[0;33m"
echo -en "Publish package"
echo -e "\e[0;34m │"
echo -e "╰─────────────────╯\e[0m"


echo -e "\e[0;33m(Installing)\e[0m"
npm i --silent --prefix

echo -e "\e[0;33m(Linting)\e[0m"
npm run lint --silent --prefix 

echo -e "\e[0;33m(Testing)\e[0m"
npm run test --silent --prefix -- --silent

echo -e "\e[0;33m(Bundling)\e[0m"
npm run build --silent --prefix

if [[ $dry_run == 1 ]]; then
  exit 0;
fi

echo -e "\e[0;33m(Publishing)\e[0m"

pkg_name=$(node -p "require('./package.json').name")
local_version=$(node -p "require('./package.json').version")
remote_version=$(npm view $pkg_name version)
package="$pkg_name@$local_version"

if [[ $local_version == $remote_version ]]; then
  echo -e "\e[2;37m$package is up to date, skipping\e[0m"
else
  echo -e "\e[2;37mLocal version $local_version differs from remote $remote_version, will publish\e[0m"
  npm publish
  echo -e "$package published"
fi

echo -e "\e[0;33m(Done)\e[0m\n"
