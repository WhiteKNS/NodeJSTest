function updateUser(req, res, db) {
    db.update({
      index: 'nodejstrainingproject',
      type: 'user',
      id: req.params.id,
      body: {
        email: req.body.email,
        password:  req.body.password,
        profile: req.body.profile,
        bio: req.body.bio,
        name: req.body.name
      },
    }).then(function (response) {
      var hits = response;
      res.set('Content-Type', 'application/json');
      res.json({ message: hits });
      res.status(200).send(hits);
    }, function (error) {
        res.status(500).send("Elasticsearch ERROR - data not updated");
        console.trace(error.message)
    }).catch((err) => {
        console.log("Elasticsearch ERROR - data not updated");
        //res.status(500).send("Elasticsearch ERROR - data not updated");
    }) 
}

export default updateUser;