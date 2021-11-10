# GSBook API

> Guestbook simple API, included JWT authenticate and authorization.

## Demo

At [http://147.139.164.109:80/](http://147.139.164.109:80/)

API:

+ `/api/`

Swagger UI:

+ `/api/docs/`

Main endpoint:

+ `/api/auth`
+ `/api/users`
+ `/api/guestbooks`

## What do the API use?

+ Nodejs
+ Express
+ Postgres
+ JWT - for authenticate
+ Joi - for request data validation
+ Swagger UI - for API documentation

## Express API setup

The Express API is located in [./src/api](./src/api).

Applications routes for resources are defined in [./src/api/index.js](./src/api/index.js).

API documentation with Swagger are defined in [./docs](./docs). The doc use `yaml` format.

Global concerns like security, cookie parsing, body parsing and request logging are handled in [./server.js](./server.js).

- Presentation is dealt with in the `./src/api` folder
- Data is dealt with in the `./src/persistence` folder

## Database setup + management

`npm run migrate up` will run the migrations.

`npm run migrate down` will roll back the migrations.

`npm run migrate:create <migration-name>`  will create a new migration file in [./src/migrations](./src/migrations).

## User authentication

The authentication is done through `/api/auth/` endpoints (see [./src/api/auth.js](./src/api/auth.js)).



