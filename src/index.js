import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import errorHandler from './middlewares/error-handler';

const client = new elasticsearch.Client({
  host:
    `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});


const app = express();

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);
app.use(bodyParser.json({ limit: 1e6 }));
app.use(errorHandler);

app.post('/', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.json({ message: 'Hello, Nataliia, Dear!',});
});

// Inside the app.post('/users') callback
app.post('/users', (req, res, next) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'email')|| !Object.prototype.hasOwnProperty.call(req.body, 'password')) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Payload must contain at least the email and password fields' });
    }
    next();
});

app.post('/users', (req, res) => {
  if (req.headers['content-length'] === '0') {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({message: 'Payload should not be empty'});
    return;
  }

  if (req.headers['content-type'] !== 'application/json') {
    res.status(415);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'The "Content-Type" header must always be "application/json"',});
    return;
  }

  if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'The email and password fields must be of type string' });
    return;
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'The email field must be a valid email',});
    return;
  }
  // add a data to the index that has already been created
  client.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: req.body,
  }, function(error, response, status) {
    if (error) {
        console.log(error);
        res.status(500);
        res.set('Content-Type', 'application/json');
        res.json({ message: 'Internal Server Error' });
    } else {
      res.status(201);
      res.set('Content-Type', 'text/plain');
      res.send(res._id);
    }
  });

});

app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`nodejstestserver API server listening on port ${process.env.SERVER_PORT}!`);
});

