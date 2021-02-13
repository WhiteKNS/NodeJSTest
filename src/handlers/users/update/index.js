
function updateUser(req, res, db) {
    if (req.params.userId !== req.user.id) {
      res.status(403);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Permission Denied. Can only update yourself, not other users.' });
      return 'Forbidden';
    }

    db.update({
      index: 'nodejstrainingproject',
      type: 'user',
      id: req.params.id,
      body: {
        email: req.body.email,
        digest:  req.body.digest,
        profile: req.body.profile,
        bio: req.body.bio,
        name: req.body.name
      },
    }).then(function (response) {
      var hits = response;
      res.set('Content-Type', 'application/json');
      res.status(200).send(hits);
      return res.json({ message: hits });
    }, function (err) {
      if (err.message === 'Not Found') { 
        res.status(401);
        res.set('Content-Type', 'application/json');
        return res.json({ message: err.message });
      } else {
        res.status(500).send("Elasticsearch ERROR - data not updated");
        console.trace(err.message)
      }
    }).catch((err) => {
        console.log("Elasticsearch ERROR catch- data not updated");
        //res.status(500).send("Elasticsearch ERROR - data not updated");
    }) 
}

export default updateUser;