function getAllUsers (req, res, db) {
    db.search({
      index: "nodejstrainingproject"
    }).then(function (response) {
      let hits_array = [];
  
      for (let i = response.hits.hits.length - 1, count = 0; i >= 0 && count < 10; i--, count++) {
        hits_array.push(response.hits.hits[i]);
      }
  
      res.status(200).send(hits_array);
    }, function (error) {
      console.trace(error.message);
    }).catch(err => {
      console.log("Elasticsearch ERROR - data not fetched");
    });
  }


  export default getAllUsers;