import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();


function checkEmptyPayload(req, res, next) {
    if (['POST', 'PATCH', 'PUT'].includes(req.method) && req.headers['content-length'] === '0') {
      res.status(400);
      res.set('Content-Type', 'application/json');
      res.json({message: 'Payload should not be empty', });
    }
    next();
}

function checkContentTypeIsSet(req, res, next) {
    if (req.headers['content-length'] && req.headers['content-length'] !== '0'&& !req.headers['content-type']) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'The "Content-Type" header must be set for requests with a non-empty payload' });
    }
    next();
}

function checkContentTypeIsJson(req, res, next) {
    if (!req.headers['content-type'].includes('application/json')) {
      res.status(415);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'The "Content-Type" header must always be "application/json"' });
    }
    next();
}

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);
app.use(bodyParser.json({ limit: 1e6 }));

app.post('/', (req, res) => {
    res.status(200);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'Hello, Nataliia, Dear!',});
});

app.post('/users', (req, res, next) => { next(); });

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

  res.status(200);
  res.set('Content-Type', 'application/json');
  res.json({
    message: 'Hello, Nataliia, Dear!(From users)'
  });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
      res.status(400);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Payload should be in JSON format' });
      return;
    }
    next();
});


app.listen(process.env.SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Hobnob API server listening on port ${process.env.SERVER_PORT}!`);
});

