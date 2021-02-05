
  function getHomePage(req, res) {
    res.status(200);
    res.set('Content-Type', 'text/plain');
    res.send('Nataliia\'s home page');
  }

  export default getHomePage;