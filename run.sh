#!/bin/bash
set -e

cmd=$1

infra_image=meltwater/node-terraform-aws:titanium-2024-12-07
node_image=node:22.17.0-alpine3.21

print_title() {
  printf "\n\e[1;34m$1\n"
  printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\e[0m\n"
}

if [[ $cmd == "node" ]]; then
  print_title "Node dev"
  docker run --rm -it -e NODE_ENV=development -v `pwd`:/app/ -w /app/ "$node_image" /bin/sh

# elif [[ $cmd == "pack" ]]; then
#   type=$2
#   print_title "Packing new $type version"
#   docker run --rm -it -v `pwd`:/app/ -w /app/ "$node_image" /bin/sh -c "npm version $type"

# elif [[ $cmd == "publish" ]]; then
#   print_title "Publishing"
#   docker run --rm -it -e NPM_TOKEN=$LAMBDA_TOOLKIT_NPM_TOKEN -v `pwd`:/app/ -w /app/ "$node_image" /bin/sh -c "./ops/publish.sh"

elif [[ $cmd = "aws" ]]; then
  print_title "AWS dev"
  docker run --rm -it -v `pwd`:/app/:cached -w /app/ "$infra_image" /bin/bash
else
  printf "\n\e[1;31mInvalid command \"$cmd\". Try again :(\e[0m\n"
fi
