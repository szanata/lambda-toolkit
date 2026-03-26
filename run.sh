#!/bin/bash
set -e

cmd=$1

infra_image=meltwater/node-terraform-aws:latest
node_image=node:24.13.0-alpine3.22

print_title() {
  printf "\n\e[1;34m$1\n"
  printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\e[0m\n"
}

if [[ $cmd == "node" ]]; then
  print_title "Node dev"
  docker run --rm -it \
    --env-file="./.env" \
    --entrypoint=sh \
    -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    -e NODE_ENV=development \
    -v `pwd`:/app/ \
    -w /app/ "$node_image" \
    -c "corepack enable && exec sh"

elif [[ $cmd == "publish" ]]; then
  print_title "Publishing"
  docker run --rm -it \
    --env-file="./.env" \
    --entrypoint=sh \
    -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    -v `pwd`:/app/ \
    -w /app/ "$node_image" \
    -c "corepack enable && ./ops/build.sh && ./ops/publish.sh"

elif [[ $cmd = "aws" ]]; then
  print_title "AWS dev"
  docker run --rm -it \
    --entrypoint=bash \
    -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    -v `pwd`:/app/:cached \
    -w /app/ "$infra_image" \
    -c "corepack enable && exec bash"
else
  printf "\n\e[1;31mInvalid command \"$cmd\". Try again :(\e[0m\n"
fi
