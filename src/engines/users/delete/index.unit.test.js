import {assert} from 'sinon';
import sinon from 'sinon';
import {stub} from 'sinon';
import ValidationError from '../../../validators/errors/validation-error/index.js';
import delete_user from './index.js';

describe('User Delete Engine', function () {
    //let req;
    let res = {};
    let req = {};
    let resJsonReturnValue = {};
    let dbIndexResult = {};
    let dbDeleteesult = {};
    let dbUpdateResult = {};
    let validator;
    let db = {
        index: sinon.stub().resolves(dbIndexResult),
        delete: sinon.stub().resolves(dbDeleteesult),
        unpeate: sinon.stub().resolves(dbUpdateResult)
    };
    let mock = {
        index: 'test',
        type: 'user',
        id: '12345',
        body: {
            email: 'e@gmail.com',
            password: 'p',
            name: {
                first: 'Steve',
                last: 'Li'
            }
        }
    };

    describe('When invoked and validator returns with undefined', function () {
        let promise;
        beforeEach(function () {
            res.status = stub();
            res.set = stub();
            res.json = stub().returns(resJsonReturnValue);

            validator = stub();
            validator =  sinon.stub().returns(undefined);
            promise = delete_user(req, db, mock.id, mock.index, mock.type, validator, ValidationError);
            return promise;
        });
        describe('should call the validator', function () {
            it('once', function () {
                assert.calledOnce(validator);
            });
            it('with req as the only argument', function () {
                assert.calledWithExactly(validator, req);
            });
        });
        it('should relay the promise returned by db.delete()', function ()
        {
            //promise.then(res => assert.strictEqual(res, dbIndexResult));
        });
    });
    describe('When validator returns with an instance of ValidationError', function () {
        it('should reject with the ValidationError returned from validator', function () {
            const validationError = new ValidationError();
            let validator = stub();
            validator =  stub().returns(undefined);
            return delete_user(req, db, mock.id, mock.index, mock.type, validator, ValidationError)
            .catch(err => assert.strictEqual(err, validationError));
        });
    });
});
