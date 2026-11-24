#!/bin/sh
# Fails when "version" in package.json differs from the base ref.
#
# Versions are bumped only by the changesets release PR. A version edited by hand is
# published as soon as it reaches the branch, without a CHANGELOG entry or GitHub release.
#
# Usage: ./ops/check_version.sh <base-ref>

set -eu

cd "${0%/*}/.."

base_ref=$1

base_package=$(git show "$base_ref:package.json")
base_version=$(printf '%s' "$base_package" | node -p "JSON.parse(require('fs').readFileSync(0)).version")
head_version=$(node -p "require('./package.json').version")

if [ "$base_version" != "$head_version" ]; then
  printf "\e[31mpackage.json version changed from %s to %s.\e[0m\n" "$base_version" "$head_version"
  printf "\e[31mDo not bump the version by hand; add a changeset instead (see .changeset/README.md).\e[0m\n"
  exit 1
fi

printf "\e[0;36mpackage.json version unchanged (%s)\e[0m\n" "$head_version"
