#!/bin/sh
# Closes the open changesets release PR for a branch when it has no pending changesets.
#
# changesets/action does not close its release PR when the changesets it was built from
# leave the branch (e.g. a revert). Merging that stale PR would still publish.
#
# Usage: ./ops/close_stale_release_pr.sh <branch>
# Requires GH_TOKEN with pull-requests: write.

set -eu

branch=$1
head="changeset-release/$branch"

numbers=$(gh pr list --head "$head" --base "$branch" --state open --json number --jq '.[].number')

if [ -z "$numbers" ]; then
  printf "\e[0;36mNo open release PR for %s\e[0m\n" "$branch"
  exit 0
fi

for number in $numbers; do
  printf "\e[0;33mClosing stale release PR #%s\e[0m\n" "$number"
  gh pr close "$number" --delete-branch \
    --comment "Closed automatically: \`$branch\` has no pending changesets, so this release PR is stale. A new one opens when a changeset lands."
done
