#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
CHANGELOG_RELATIVE="database/liquibase/changelog/db.changelog-master.xml"
CHANGELOG_FILE="$REPO_ROOT/$CHANGELOG_RELATIVE"
DRIVER_DIR="$SCRIPT_DIR/liquibase/lib"

usage() {
  cat <<'USAGE'
Usage: ./database/script.sh <command>

Commands:
  validate  Check Liquibase changelog structure and referenced files.
  preview   Show SQL Liquibase plans to run; does not modify the database.
  update    Validate, preview, then apply pending changesets.
  status    Show pending changesets; does not modify the database.
USAGE
}

command_name="${1:-}"
case "$command_name" in
  validate|preview|update|status) ;;
  -h|--help|help) usage; exit 0 ;;
  *)
    usage >&2
    exit 2
    ;;
esac

if (( $# > 1 )); then
  echo "Only one command may be provided." >&2
  usage >&2
  exit 2
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Database settings file not found: $ENV_FILE" >&2
  echo "Copy database/.env.example to database/.env and fill in the connection values." >&2
  exit 1
fi

if [[ ! -f "$CHANGELOG_FILE" ]]; then
  echo "Liquibase changelog not found: $CHANGELOG_FILE" >&2
  exit 1
fi

if ! command -v liquibase >/dev/null 2>&1; then
  echo "Liquibase CLI was not found. Install Liquibase and MySQL Connector/J, then retry." >&2
  exit 1
fi

cd "$REPO_ROOT"

# The env file must contain shell-compatible KEY=value entries. Never enable
# shell tracing here; it could print the database password.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

required_vars=(DB_HOST DB_PORT DB_NAME DB_USER DB_PASS)
missing_vars=()
for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    missing_vars+=("$var_name")
  fi
done

if (( ${#missing_vars[@]} > 0 )); then
  printf 'Missing required values in database/.env: %s\n' "${missing_vars[*]}" >&2
  exit 1
fi

export LIQUIBASE_COMMAND_URL="jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
export LIQUIBASE_COMMAND_USERNAME="$DB_USER"
export LIQUIBASE_COMMAND_PASSWORD="$DB_PASS"

driver_jars=("$DRIVER_DIR"/mysql-connector-j-*.jar)
if [[ ! -f "${driver_jars[0]}" ]]; then
  echo "MySQL Connector/J was not found in $DRIVER_DIR." >&2
  echo "Download the Connector/J platform-independent archive, extract its .jar file there, and rerun." >&2
  exit 1
fi

liquibase_args=(
  --changelog-file="$CHANGELOG_RELATIVE"
  --classpath="${driver_jars[0]}"
  --driver=com.mysql.cj.jdbc.Driver
)

target="${DB_HOST}:${DB_PORT}/${DB_NAME}"

run_validate() {
  echo "Validating changelog for $target..."
  liquibase "${liquibase_args[@]}" validate
}

run_preview() {
  echo "Previewing pending SQL for $target (no changes will be applied)..."
  liquibase "${liquibase_args[@]}" update-sql
}

case "$command_name" in
  validate)
    run_validate
    ;;
  preview)
    run_validate
    run_preview
    ;;
  update)
    echo "Target database: $target"
    run_validate
    run_preview
    echo "Applying pending changesets to $target..."
    liquibase "${liquibase_args[@]}" update
    ;;
  status)
    echo "Checking pending changesets for $target..."
    liquibase "${liquibase_args[@]}" status --verbose
    ;;
esac
