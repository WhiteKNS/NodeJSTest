function createUser(req, res, db) {
    let json = {
        email: "academic13forte@gmail.com",
        password: "pass"
      };
    
      if (req.body != null)
        json = req.body;
    
        if (!Object.prototype.hasOwnProperty.call(req.body, 'email') || !Object.prototype.hasOwnProperty.call(req.body, 'password')) {
          res.status(400);
          res.set('Content-Type', 'application/json');
          res.json({
              message: 'Payload must contain at least the email and password fields'
          });
    
          return;
      }
    
    
      if (req.headers['content-length'] === '0') {
        res.status(400);
        res.set('Content-Type', 'application/json');
        res.json({message: 'Payload should not be empty'});
        return;
      }
    
      if (req.headers['content-type'] !== 'application/json') {
        res.status(415);
        res.set('Content-Type', 'application/json');
        res.json({ message: 'The "Content-Type" header must always be application/json' });
        return;
      }
    
      if (req.body == null || typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
        res.status(400);
        res.set('Content-Type', 'application/json');
        res.json({ message: 'The email and password fields must be of type string' });
        return;
      }
    
      if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
        res.status(400);
        res.set('Content-Type', 'application/json');
        res.json({ message: 'The email field must be a valid email'});
        return;
      }
      // add a data to the index that has already been created
      db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        body: json
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
}

export default createUser;
