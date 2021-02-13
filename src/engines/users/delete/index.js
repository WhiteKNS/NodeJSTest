

function delete_user(req, db, id, index, type, validate, ValidationError) {
    if (req.params.userId !== req.user.id) {
        return Promise.reject(new Error('Forbidden'));
    }

    const validationResults = validate(req);
    if (validationResults instanceof ValidationError) {
        return Promise.reject(validationResults);
    }

    // delete user's data
    return db.delete({
        index: index,
		type: type,
        id: id
    });
}

module.exports = delete_user;
