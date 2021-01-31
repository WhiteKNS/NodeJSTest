
const generateCreateStubs = {
    success: () => stub().resolves({ _id: USER_ID }),
    genericError: () => stub().rejects(new Error()),
    validationError: () => stub().rejects(new ValidationError(VALIDATION_ERROR_MESSAGE)),
};

describe('createUser', function () {
    // ...
    describe('When create rejects with an instance of Error', function () {
        beforeEach(function () {
            create = generateCreateStubs.genericError();
            return createUser(req, res, db, create, validator, ValidationError);
        });
        describe('should call res.status()', function () {
            it('once', function () {
                assert(res.status.calledOnce);
            });
            it('with the argument 500', function () {
                assert(res.status.calledWithExactly(500));
            });
        });
        describe('should call res.set()', function () {
            it('once', function () {
                assert(res.set.calledOnce);
            });
            it('with the arguments "Content-Type" and "application/json"', function () {
                assert(res.set.calledWithExactly('Content-Type', 'application/json'));
            });
        });
        describe('should call res.json()', function () {
            it('once', function () {
                assert(res.json.calledOnce);
            });
            it('with a validation error object', function () {
                assert(res.json.calledWithExactly({ message: 'Internal Server Error' }));
            });
        });
    });
});

