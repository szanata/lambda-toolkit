# Integration environment

Creates a local AWS infrastructure with an emulator and Terraform, then runs the integration tests against it. Everything runs in Docker, and no AWS account is needed.

## How it works

[docker-compose.yml](./docker-compose.yml) starts three services:

| Service | Role |
|---|---|
| `ministack` | [MiniStack](https://ministack.org), the AWS emulator on `localhost:4566`. It starts empty on every `up`. |
| `terraform` | One-shot job: applies [infra/](./infra/) to MiniStack, then writes the outputs to `infra/env/outputs.json`. |
| `node` | Installs the dependencies, then stays up. The tests run inside it. |

Each service waits for the previous one: MiniStack must be healthy, Terraform must succeed, then `node` starts.

The tests build the library first, then import the built package (`dist/`), the same one users install.

## Commands

```sh
./ops/integration/run.sh <command>
```

| Command | What it does |
|---|---|
| `up` | Starts a fresh environment: empty MiniStack, Terraform apply, dependency install |
| `test` | Builds the library and runs the integration tests. Needs `up` first. |
| `sync` | Applies `.tf` changes to the running environment (incremental) |
| `output` | Prints the Terraform outputs |
| `down` | Stops everything and removes the local Terraform state |
| `ci` | `up` + `test` + `down`. Always tears down and exits with the tests' status. |

Typical loop: `up` once, then `test` after each change. Run `sync` after editing `.tf` files.

## Adding resources

Each AWS service is a module in `infra/modules/<service>/`, wired in [infra/env/local.tf](./infra/env/local.tf). Expose the names the tests need as root outputs. The tests read them by name.

## CI

The [Integration](../../.github/workflows/integration.yml) workflow runs `ci`. For now it only runs when started manually from the Actions tab.
