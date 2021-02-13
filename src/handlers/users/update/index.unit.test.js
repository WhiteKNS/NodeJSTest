import { stub} from 'sinon'
import {assert} from 'sinon';

import updateUser from '../update'
import ValidationError from '../../../validators/errors/validation-error'

let VALIDATION_ERROR_MESSAGE = 'TEST_ERROR';

const generateCreateStubs = {
    success: () => stub().resolves({ _id: USER_ID }),
    genericError: () => stub().rejects(new Error()),
    validationError: () => stub().rejects(new ValidationError(VALIDATION_ERROR_MESSAGE)),
    status: () => stub().resolves({statusCode: 200})
};

describe('updateUser', function () {
    // ...
    let req = {};
    let res = {};
    let resJsonReturnValue;

    let dbIndexResult = {};
    let dbDeleteesult = {};
    let dbUpdateResult = {};
    let validator;
    let db = {
        index: stub().resolves(dbIndexResult),
        delete: stub().resolves(dbDeleteesult),
        update: stub().resolves(dbUpdateResult)
    };

    describe('When create rejects with an instance of Error', function () {
        beforeEach(function () {
            res.status = stub();
            res.set = stub();
            res.json = stub().returns(resJsonReturnValue);

            let salt = genSaltSync(10);
            let password = crypto.randomBytes(32).toString('hex');
            let digest_ = hashSync(password, salt);

            req.params = {};
            req.body = {};
            req.body.email = "email@gmail.com";
            req.body.digest = digest_;
            req.body.profile = {};
            req.body.bio = {};
            req.body.name = {};
            req.params.id = '12345';

            return updateUser(req, res, db);
        });
        describe('should call res.status()', function () {
            it('once', function () {
                assert.calledOnce(res.status);
            });
            it('with the argument 200', function () {
                assert.calledWithExactly(res.status, 200);
            });
        });
        describe('should call res.set()', function () {
            it('once', function () {
                assert.calledOnce(res.set);
            });
            it('with the arguments "Content-Type" and "application/json"', function () {
                assert.calledWithExactly(res.set, 'Content-Type', 'application/json');
            });
        });
        describe('should call res.json()', function () {
            it('once', function () {
                assert.calledOnce(res.json);
            });
            it('with a validation error object', function () {
                assert.calledWithExactly(res.json, { message: {} });
            });
        });
    });
});

