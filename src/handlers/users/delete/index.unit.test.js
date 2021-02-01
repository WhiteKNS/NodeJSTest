/*import deleteUser from "./";

const generateCreateStubs = {
    success: () => stub().resolves({ _id: USER_ID }),
    genericError: () => stub().rejects(new Error()),
    validationError: () => stub().rejects(new ValidationError(VALIDATION_ERROR_MESSAGE)),
};

describe('delete', function () {
    // ...
    describe('When delete rejects with an instance of Error', function () {
        beforeEach(function () {
            delete_user = generateCreateStubs.genericError();
            return deleteUser(req, res, db, delete_user, validator, ValidationError);
        });
        describe('should call res.status()', function () {
            it('once', function () {
                assert(res.status.calledOnce);
            });
            it('with the argument 403', function () {
                assert(res.status.calledWithExactly(403));
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
                console.log(res.json);
                //assert(res.json.calledWithExactly({ message: 'Internal Server Error' }));
            });
        });
    });
});*/

