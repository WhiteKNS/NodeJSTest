
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
import deleteUserValidator from './validators/users/delete';

import { getSalt } from 'bcryptjs';
import retrieveSaltHandler from './handlers/auth/salt/retrieve'
import retrieveSaltEngine from './engines/auth/salt/retrieve';
import generateFakeSalt from './utils/generate-fake-salt';

import loginValidator from './validators/auth/login';
import loginHandler from './handlers/auth/login';
import loginEngine from './engines/auth/login';

import authenticate from './middlewares/authenticate';

import sign from 'jsonwebtoken';
import fs from 'fs';

const handlerToEngineMap = new Map([
    [createUserHandler, createUserEngine],
    [loginHandler, loginEngine],

    [deleteUserHandler, deleteUserEngine],
    [retrieveSaltHandler, retrieveSaltEngine],
  ]);
  
  const handlerToValidatorMap = new Map([
    [createUserHandler, createUserValidator],
    [loginHandler, loginValidator],

    [deleteUserHandler, deleteUserValidator],
    [retrieveSaltHandler, createUserValidator],
  ]);
  
  //const handlerToDeleteEngineMap = new Map([
  //  [deleteUserHandler, deleteUserEngine],
  //]);
  
  //const handlerToDeleteValidatorMap = new Map([
  //  [deleteUserHandler, deleteUserValidator],
  //]);

 // const handlerSalt = new Map([
 //   [retrieveSaltHandler, retrieveSaltEngine],
 // ]);

  //const handlerToSaltMap = new Map([
  //  [retrieveSaltHandler, createUserValidator],
  //]);

const SWAGGER_UI_PROTOCOL='http'
const SWAGGER_UI_HOSTNAME='127.0.0.1'
const SWAGGER_UI_PORT='8000'

const SERVER_EXTERNAL_PROTOCOL='http'
const SERVER_EXTERNAL_HOSTNAME='api.hobnob.jenkins'
const SERVER_EXTERNAL_PORT='80'

const CLIENT_PROTOCOL='http'
const CLIENT_HOSTNAME='127.0.0.1'
const CLIENT_PORT='8200'

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

app.use(authenticate);

app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8000"); // update to match the domain you will make the request from
  // `${process.env.SWAGGER_UI_PROTOCOL}://${process.env.SWAGGER_UI_HOSTNAME}:${process.env.SWAGGER_UI_PORT}`
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  /*const {
    SWAGGER_UI_PROTOCOL, SWAGGER_UI_HOSTNAME, SWAGGER_UI_PORT,
    CLIENT_PROTOCOL, CLIENT_HOSTNAME, CLIENT_PORT,
    } = process.env;*/
    const allowedOrigins = [
      `${SWAGGER_UI_PROTOCOL}://${SWAGGER_UI_HOSTNAME}`,
      `${SWAGGER_UI_PROTOCOL}://${SWAGGER_UI_HOSTNAME}:${SWAGGER_UI_PORT}`,
      `${CLIENT_PROTOCOL}://${CLIENT_HOSTNAME}`,
      `${CLIENT_PROTOCOL}://${CLIENT_HOSTNAME}:${CLIENT_PORT}`,
    ];

    if (allowedOrigins.includes(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.get('/openapi.yaml', (req, res, next) => {
    fs.readFile(`${__dirname}/openapi.yaml`, (err, file) => {
      if (err) {
        res.status(500);
        res.end();
        return next();
      }
      res.write(file);
      res.end();
      return next();
    });
});

// Home page route.
app.get('/', getHomePage);

app.get('/users', deleteUpdateHandlerDependencies(getAllUsers, client));
app.get('/users/:id', deleteUpdateHandlerDependencies(getUserByID, client));

app.get('/salt', injectHandlerDependencies(retrieveSaltHandler, client, handlerToEngineMap, handlerToValidatorMap,/*handlerSalt, handlerToSaltMap,*/ ValidationError, getSalt, generateFakeSalt));

app.put('/users/:id', deleteUpdateHandlerDependencies(updateUser, client));


app.post('/users', injectHandlerDependencies(createUser, client, handlerToEngineMap, handlerToValidatorMap, ValidationError));
app.post('/login', injectHandlerDependencies(loginHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError, sign));

app.delete('/', forbiddenRequest);
app.delete('/users', forbiddenRequest);
app.delete('/users/:id', injectHandlerDependencies(deleteUser, client, handlerToEngineMap, handlerToValidatorMap,/*handlerToDeleteEngineMap, handlerToDeleteValidatorMap,*/ ValidationError));

let server_port = '8088';
app.listen(server_port, () => {
  // allows to initiate the process as root using sudo
  /*const sudoGid = parseInt(process.env.SUDO_GID);
  const sudoUid = parseInt(process.env.SUDO_UID);
  if (sudoGid) { process.setuid(sudoGid) }
  if (sudoUid) { process.setuid(sudoUid) }*/
  // eslint-disable-next-line no-console
  console.log(`nodejstestserver API server listening on port ${server_port}!`);
  console.log(`nodejstestserver API server listening on port(env file log)${process.env.SERVER_PORT}!`);
});

