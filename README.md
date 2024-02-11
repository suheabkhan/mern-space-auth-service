## **Migration commands**

#### Migration Script Creation

1. Generate the migration file, basically auto generates the migration file with all the sql queries depending on your changes to the entitie
2. Here RenameTable is the fileName to be generated inside the migrations folder

npm run migration:create -- src/migration/RenameTable

#### Migration Script Generation

1. Generate the migration file, basically auto generates the migration file with all the sql queries depending on your changes to the entities
2. Here RenameTable is the fileName to be generated inside the migrations folder

npm run migration:generate -- src/migration/RenameTable -d src/config/data-source.ts

#### Migration Script Run

1. Run the migration file, basically runs all the migration scripts inside the migration file (which are either created or generated)

npm run migration:run -- -d src/config/data-source.ts

## Docker Commands

1. start the application using docker commands
2. Run this command to dockerize the express application
3. [https://codersgyan.notion.site/Containerisation-Express-app-ecd8f3c5acf446629acdc67cff4ca55f](https://codersgyan.notion.site/Containerisation-Express-app-ecd8f3c5acf446629acdc67cff4ca55f 'express app containersation')

docker run --rm -it -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules --env-file ${PWD}/.env -p 5501:5501 -e NODE_ENV=development auth-service

4. Run this command to dockerize the postgress application and let our express application use this
5. [https://codersgyan.notion.site/Setting-up-PostgreSQL-in-a-Docker-Container-with-Persistent-Volume-58711388eb244c9fa1597d87783e3f92](https://codersgyan.notion.site/Setting-up-PostgreSQL-in-a-Docker-Container-with-Persistent-Volume-58711388eb244c9fa1597d87783e3f92 'postgres in docker')

docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres

6. build docker image after writing Dockerfile
7. Here mernstack_test_prod_image is the name of the image docker build -t mernstack_test_prod_image -f .\docker\prod\Dockerfile .

## Build application

npm run build

1. run the compiled js

cd dist

node src/server.js

//password supabase
mernspace@123

//sonarcloud token
342480465c755eef2490acb345212f5637d4baad

//docker hub token
docker login -u khansuheab236290
dckr_pat_DLYprGH0JKtW54QI6eqSg0ZBQe0
