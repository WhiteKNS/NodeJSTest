import { stub} from 'sinon'
import {assert} from 'sinon';
import createUser from '../create'
import ValidationError from '../../../validators/errors/validation-error'

let VALIDATION_ERROR_MESSAGE = 'TEST_ERROR';

const generateCreateStubs = {
    success: () => stub().resolves({ _id: USER_ID }),
    genericError: () => stub().rejects(new Error()),
    validationError: () => stub().rejects(new ValidationError(VALIDATION_ERROR_MESSAGE)),
    status: () => stub().resolves({statusCode: 200})
};

describe('createUser', function () {
    // ...
    let req = {};
    let res = {};
    let db = {};
    let resJsonReturnValue;

    describe('When create rejects with an instance of Error', function () {
        beforeEach(function () {
            res.status = stub();
            res.set = stub();
            res.json = stub().returns(resJsonReturnValue);

            let validator = stub();
            let create = generateCreateStubs.genericError();
            let ValidationError = generateCreateStubs.validationError();

            return createUser(req, res, db, create, validator, ValidationError);
        });
        describe('should call res.status()', function () {
            it('once', function () {
                assert.calledOnce(res.status);
            });
            it('with the argument 500', function () {
                assert.calledWithExactly(res.status, 500);
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
                assert.calledWithExactly(res.json, { message: 'Internal Server Error' });
            });
        });
    });
});

