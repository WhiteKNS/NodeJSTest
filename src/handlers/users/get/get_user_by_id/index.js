function getUserByID (req, res, db) {
    db.get({
        type: 'user',
        index: 'nodejstrainingproject',
        id: req.params.id,
        _source_excludes: 'digest'
      }).then(function (response) {
        res.status(200).send(response);
      }, function (error) {
        console.log(error.message);
        res.status(400).send('No such user!');
      }).catch(err => {
        console.log("Elasticsearch ERROR - data not fetched");
      });
  }

  export default getUserByID;