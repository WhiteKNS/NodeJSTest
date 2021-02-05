
import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import errorHandler from './middlewares/error-handler';

import createUser from '../src/handlers/users/create';

import deleteUser from '../src/handlers/users/delete';
import forbiddenRequest from '../src/handlers/forbidden';

import getAllUsers from './handlers/users/get/get_all_users';
import getUserByID from './handlers/users/get/get_user_by_id';
import getHomePage from './handlers/users/get/get_home_page';

import updateUser from '../src//handlers/users/update';

import ValidationError from '../src/validators/errors/validation-error'
import injectHandlerDependencies from '../src/utils/inject-handler-dependencies'
import deleteUpdateHandlerDependencies from '../src/utils/delete-update-handler-dependencies'

import createUserHandler from '../src/handlers/users/create';
import createUserEngine from '../src/engines/users/create'
import createUserValidator from '../src/validators/users/create';

import deleteUserHandler from '../src/handlers/users/delete';
import deleteUserEngine from '../src/engines/users/delete'
import deleteUserValidator from '../src/validators/users/delete';

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
    'http://localhost:9200',
    //`http://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

const app = express();

app.use(bodyParser.json({ limit: 1e6 }));
app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);
app.use(errorHandler);


// Home page route.
app.get('/', getHomePage);

app.get('/users', deleteUpdateHandlerDependencies(getAllUsers, client));
app.get('/users/:id', deleteUpdateHandlerDependencies(getUserByID, client));

app.put('/users/:id', deleteUpdateHandlerDependencies(updateUser, client));


app.post('/users', injectHandlerDependencies(createUser, client, handlerToEngineMap, handlerToValidatorMap, ValidationError));

app.delete('/', forbiddenRequest);
app.delete('/users', forbiddenRequest);
app.delete('/users/:id', injectHandlerDependencies(deleteUser, client, handlerToDeleteEngineMap, handlerToDeleteValidatorMap, ValidationError));

let server_port = '8088';
app.listen(server_port, () => {
  // allows to initiate the process as root using sudo
  /*const sudoGid = parseInt(process.env.SUDO_GID);
  const sudoUid = parseInt(process.env.SUDO_UID);
  if (sudoGid) { process.setuid(sudoGid) }
  if (sudoUid) { process.setuid(sudoUid) }*/
  // eslint-disable-next-line no-console
  console.log(`nodejstestserver API server listening on port ${server_port}!`);
});

