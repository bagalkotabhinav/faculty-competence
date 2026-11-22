# Liquibase schema setup

This changelog is separate from the API and Helm chart. Run it manually from a machine that can reach the MySQL database. It creates the application tables inside an already-created database; it does not create the RDS instance or the database itself.

## Prerequisites

- Liquibase CLI installed.
- MySQL Connector/J JAR placed in `database/liquibase/lib/` (the script discovers it there).
- Network access from your machine to the RDS endpoint. For RDS in private subnets, connect from a permitted network such as a VPN or a temporary bastion; do not make the database publicly accessible just to run Liquibase.
- A database created on RDS (for example, `faculty_db`) and credentials allowed to create tables and constraints in it.

## Script commands

Copy `database/.env.example` to `database/.env` and fill in the connection values. This file is ignored by Git and read by the Liquibase script. The API does not load `.env` files; to run the API locally, export these settings into your shell first. From the repository root, choose a command:

```bash
./database/script.sh validate  # Check the changelog and referenced files.
./database/script.sh preview   # Validate, then display pending SQL; makes no changes.
./database/script.sh status    # List changesets Liquibase considers pending.
./database/script.sh update    # Validate, display the SQL preview, then apply changes.
```

`update` is the only command that changes the database. Review the displayed target and SQL before using it, especially before the first run. The initial changeset is intended for an empty application database.

Download the **Platform Independent** Connector/J archive from MySQL, extract it, and copy its `mysql-connector-j-<version>.jar` into `database/liquibase/lib/`. The script adds that JAR to Liquibase's classpath and selects the modern `com.mysql.cj.jdbc.Driver` class. The driver is a local Liquibase tool dependency; it is not an RDS setting or a secret. In CI, install or download the same dependency into the runner before invoking the script.

Liquibase records the applied changeset in its `DATABASECHANGELOG` table and uses `DATABASECHANGELOGLOCK` while applying changes. Re-running `update` does not recreate tables for an already-applied changeset.

The backend does not execute Liquibase. Its pods only connect to the database and use the tables. For future schema changes, add a new changeset instead of editing the already-applied initial changeset. In EKS, keep `NODE_ENV=production` and provide the API's runtime environment variables through the AWS Secrets Manager integration; do not deploy this local `.env` file.
