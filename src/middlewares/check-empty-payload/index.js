function checkEmptyPayload(req, res, next) {
    if (['POST', 'PATCH', 'PUT'].includes(req.method) && req.headers['content-length'] === '0' || req.body == null) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      res.json({message: 'Payload should not be empty' });

      return;
    }

    next();
}

export default checkEmptyPayload;