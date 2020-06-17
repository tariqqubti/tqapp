# TQAPP

Quickly start using Express, Mongoose and WS with reasonable defaults.

Checkout [example](example/index.js) inside

## Quickly use routers from a root directory

To do an `app.use('/entity_name', entity_router)` for multiple entities residing in the same root folder e.g.
```
entity
  todo
    router.js
  comment
    router.js
```
Just use `server.app.use('/api/v1', api.root('./entity'));`
This will make all paths under the router available under `/api/v1`
e.g. `/api/v1/todo/...` and `/api/v1/comment`.

## Quickly create routers which already have RESTful CRUD endpoints

```javascript
const {api} = require('tqapp');
const Model = require('./MongooseModel');
const router = api.router.create(Model, 'read create update remove');
```

## Authentication

```javascript
const {auth} = require('tqapp');
// ...
server.app.use(auth.middleware.parse);
server.app.use('/auth', auth.router);
// ...
```
TODO: Add documentation

## Testing a way for handling multiple queries in the same http request

```javascript
const {pub} = require('tqapp');
// ...
server.app.use('/pub', pub.root('./entity')); 
// ...
```
TODO: Add documentation