import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import errorHandler from './middlewares/error-handler';
import createUser from './handlers/users/create';
//import injectHandlerDependencies from './utils/inject-handler-dependencies'

function injectHandlerDependencies(handler, db) {
  return (req, res) => { handler(req, res, db); };
}

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
  res.send('Wiki home page');
});


app.post('/users', injectHandlerDependencies(createUser, client));

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`nodejstestserver API server listening on port ${process.env.SERVER_PORT}!`);
});

