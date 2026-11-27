#!/bin/sh
# Local AWS infra on MiniStack, provisioned with Terraform. Everything runs in Docker.
#
# Usage: ./ops/integration/run.sh <command>
#   up      Start a fresh (empty) MiniStack, apply Terraform, export its outputs and start the node container
#   sync    Apply the .tf changes to the running MiniStack (incremental) and re-export the outputs
#   output  Print the Terraform outputs as JSON
#   test    Build the library and run the integration tests in the running node container
#   down    Stop everything and remove the local Terraform state
#   ci      up + test + down, always tearing down; exits with the tests' status

set -eu

cd "${0%/*}"

printf "\e[0;35m"
printf "╭───────╮\n"
printf "│ \e[0;33mInfra\e[0;35m │\n"
printf "╰───────╯\e[0m\n"

compose="docker compose"

# The terraform and node containers run as the host user, so files they write in the repo stay owned by it
HOST_UID=$(id -u)
HOST_GID=$(id -g)
export HOST_UID HOST_GID

rm_tf_state() {
  rm -rf infra/env/terraform.tfstate infra/env/terraform.tfstate.backup infra/env/outputs.json
}

print_title() {
  printf "\e[0;36m(%s)\e[0m\n" "$1"
}

start_infra() {
  # A new MiniStack starts empty (state is in-memory), so the fresh Terraform state always matches it
  rm_tf_state
  print_title "Starting MiniStack, applying Terraform"
  $compose up -d --wait --force-recreate
}

run_tests() {
  print_title "Integration tests"
  $compose exec node sh -ec "corepack pnpm run build && corepack pnpm run test:integration"
}

stop_infra() {
  print_title "Stopping"
  $compose down --remove-orphans
  rm_tf_state
}

case "${1:-}" in
  up) start_infra ;;

  sync)
    print_title "Syncing Terraform"
    $compose up --no-deps --exit-code-from terraform terraform
    ;;

  output) cat infra/env/outputs.json ;;

  test) run_tests ;;

  down) stop_infra ;;

  ci)
    # Tear down even when up or the tests fail; the trap keeps the failing exit status
    trap stop_infra EXIT
    start_infra
    run_tests
    ;;

  *)
    printf "\e[31mUsage: %s up|sync|output|test|down|ci\e[0m\n" "$0"
    exit 1
    ;;
esac
