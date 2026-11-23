#!/bin/sh
# Prints "tag=<npm dist-tag>" for the version about to be published.
#
# "latest" when the local version is newer than what npm currently has as latest,
# otherwise "release-<major>.<minor>" so hotfixes for older lines never move "latest".

set -eu

cd "${0%/*}/.."

name=$(node -p "require('./package.json').name")
local_version=$(node -p "require('./package.json').version")
published_version=$(pnpm view "$name" version 2>/dev/null || echo "0.0.0")

tag=$(node -e '
  const [local, published] = process.argv.slice(1).map((v) => v.split(/[.-]/, 3).map(Number));
  const newer = local[0] !== published[0] ? local[0] > published[0]
    : local[1] !== published[1] ? local[1] > published[1]
    : local[2] > published[2];
  console.log(newer ? "latest" : `release-${local[0]}.${local[1]}`);
' "$local_version" "$published_version")

echo "tag=$tag"
