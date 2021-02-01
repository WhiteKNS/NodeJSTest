

function delete_user(req, db, validate, ValidationError) {
    const validationResults = validate(req);
    if (validationResults instanceof ValidationError) {
        return Promise.reject(validationResults);
    }

    // delete user's data
    return db.indices.delete({
        index: req.params.index
    });
}

export default delete_user;
