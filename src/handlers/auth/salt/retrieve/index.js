

function retrieveSalt(req, res, db, engine, _validator, getSalt, generateFakeSalt) {
    return engine(req, db, getSalt).then((result) => {
        res.status(200);
        res.set('Content-Type', 'text/plain');
        return res.send(result);
    }, (err) => {
        console.log(err.message);
        if (err.message === 'Email not specified') {
            res.status(400);
            res.set('Content-Type', 'application/json');
            return res.json({ message: 'The email field must be specified'});
        }
        console.log(err);
        throw err;
    }).catch((err) => {
        if (err.message === NO_RESULTS_ERROR_MESSAGE) {
            return generateFakeSalt(req.query.email);
        }
        return Promise.reject(new Error('Internal Server Error'));
    });
}

export default retrieveSalt;
