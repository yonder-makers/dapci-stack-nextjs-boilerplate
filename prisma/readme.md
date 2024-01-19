# generate a migration file

mkdir prisma/migrations/0005_clean_dummy_field
npx prisma migrate diff \
--from-migrations ./prisma/migrations \
--to-schema-datamodel ./prisma/schema.prisma \
--shadow-database-url postgresql://postgres:postgres@postgres-db/postgres?schema=shadow \
--script > ./prisma/migrations/0005_clean_dummy_field/migration.sql

# another way

npx prisma migrate dev --name "the_migration_name" --create-only

# deploy to production db

npx prisma migrate deploy
