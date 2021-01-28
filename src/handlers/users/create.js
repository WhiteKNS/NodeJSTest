import ValidationError from '../../validators/errors/validation-error';
import validate from '../../validators/users/create';

function createUser(req, res, db) {
    const validationResults = validate(req);
    if (validationResults instanceof ValidationError) {
        res.status(400);
        res.set('Content-Type', 'application/json');
        return res.json({ message: validationResults.message });
    }

    let json = {
        email: "academic13forte@gmail.com",
        password: "pass"
      };
    
      if (req.body != null)
        json = req.body;

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
