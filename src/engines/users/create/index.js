

function create(req, db, validate, ValidationError) {
    const validationResults = validate(req);
    if (validationResults instanceof ValidationError) {
        return Promise.reject(validationResults);
    }

    // add a data to the index that has already been created
    return db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        body: req.body
    });
}

export default create;