import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import errorHandler from './middlewares/error-handler';

import createUser from './handlers/users/create';
import createUserHandler from './handlers/users/create';
import createUserEngine from './engines/users/create'
import createUserValidator from './validators/users/create';

import deleteUser from './handlers/users/delete';
import deleteUserHandler from './handlers/users/delete';
import deleteUserEngine from './engines/users/delete'
import deleteUserValidator from './validators/users/delete';
import forbiddenRequest from './handlers/forbidden';

import ValidationError from './validators/errors/validation-error'
import injectHandlerDependencies from './utils/inject-handler-dependencies'


const handlerToEngineMap = new Map([
  [createUserHandler, createUserEngine],
]);

const handlerToValidatorMap = new Map([
  [createUserHandler, createUserValidator],
]);

const handlerToDeleteEngineMap = new Map([
  [deleteUserHandler, deleteUserEngine],
]);

const handlerToDeleteValidatorMap = new Map([
  [deleteUserHandler, deleteUserValidator],
]);

const client = new elasticsearch.Client({
  host:
    `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});


const app = express();

app.use(bodyParser.json({ limit: 1e6 }));
app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);
app.use(errorHandler);


// Home page route.
app.get('/', function (req, res) {
    res.status(200);
    res.set('Content-Type', 'text/plain');
    res.send('Nataliia\'s home page');
});


app.post('/users', injectHandlerDependencies(createUser, client, handlerToEngineMap, handlerToValidatorMap, ValidationError));

app.delete('/', forbiddenRequest);

app.delete('/users', forbiddenRequest);

app.delete('/users/:id', injectHandlerDependencies(deleteUser, client, handlerToDeleteEngineMap, handlerToDeleteValidatorMap, ValidationError));


/*app.delete('/users/:id', (req, res) => {
    let req_index = req.params.index;
    console.log(index);
    client.indices.delete({
        index: req_index
    }, function(err, res) {
        if (err) {
          res.status(400);
          res.set('Content-Type', 'application/json');
          return res.json({ message: 'indices are not present' });
        } else {
          res.status(200);
          res.set('Content-Type', 'application/json');
          return res.json({ message: 'indices were deleted' });
        }
      });
})*/

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`nodejstestserver API server listening on port ${process.env.SERVER_PORT}!`);
});

