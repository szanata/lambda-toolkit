#!/bin/bash
set -e

cmd=$1

infra_image=meltwater/node-terraform-aws:chromium-2026-10-22
node_image=node:24.22.1-alpine3.24

print_title() {
  printf "\n\e[1;34m$1\n"
  printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\e[0m\n"
}

if [[ $cmd == "node" ]]; then
  print_title "Node dev"
  docker run --rm -it \
    --entrypoint=sh \
    -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    -e NODE_ENV=development \
    -v `pwd`:/app/ \
    -w /app/ "$node_image" \
    -c "corepack enable && exec sh"
else
  printf "\n\e[1;31mInvalid command \"$cmd\". Try again :(\e[0m\n"
fi
