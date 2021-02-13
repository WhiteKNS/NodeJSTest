

function deleteUser(req, res, db, delete_user, validator, ValidationError) {
    return delete_user(req, db, validator, ValidationError).then((result) => {
        res.status(201);
        res.set('Content-Type', 'text/plain');
        return res.send('The user was deleted');
    }, (err) => {
        console.log(err);
        if (err instanceof ValidationError) {
            res.status(400);
            res.set('Content-Type', 'application/json');
            return res.json({ message: err.message });
        } else if (err.message === 'Not Found') { 
            res.status(401);
            res.set('Content-Type', 'application/json');
            return res.json({ message: err.message });
         } else if (err.message === 'Forbidden') {
            res.status(403);
            res.set('Content-Type', 'application/json');
            res.json({ message: 'Permission Denied. Can only delete yourself, not other users.' });
            return err;
        } else {
            res.status(500);
            res.set('Content-Type', 'application/json');
            return res.json({ message: 'Internal Server Error' });
        }
       // throw err;
    }).catch(() => {
        res.status(500);
        res.set('Content-Type', 'application/json');
        return res.json({ message: 'Internal Server Error' });
    });
}

export default deleteUser;
