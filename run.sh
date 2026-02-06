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
  docker run --rm -it --env-file="./.env" -e NODE_ENV=development -v `pwd`:/app/ -w /app/ "$node_image" /bin/sh

elif [[ $cmd == "publish" ]]; then
  print_title "Publishing"
  docker run --rm -it --env-file="./.env" -v `pwd`:/app/ -w /app/ "$node_image" /bin/sh -c "./ops/build.sh && ./ops/publish.sh"

elif [[ $cmd = "aws" ]]; then
  print_title "AWS dev"
  docker run --rm -it -v `pwd`:/app/:cached -w /app/ "$infra_image" /bin/bash
else
  printf "\n\e[1;31mInvalid command \"$cmd\". Try again :(\e[0m\n"
fi
