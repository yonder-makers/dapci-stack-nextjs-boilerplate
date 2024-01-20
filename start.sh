echo "Running migrations"
npx prisma migrate deploy || exit 1

echo "Running seed"
npx prisma db seed || exit 1

echo "Starting the NextJS server"
npm run start