import assert from 'assert';
import sinon from 'sinon';
import { spy } from 'sinon';
import { stub} from 'sinon'
import ValidationError from '../../../validators/errors/validation-error/index.js';
import create from '../create';

describe('User Create Engine', function () {
    let req;
    let db;
    let validator;
    const dbIndexResult = {};
    beforeEach(function () {
        req = {};
        db = {
            index: sinon.stub().resolves(dbIndexResult),
        };
    });
    describe('When invoked and validator returns with undefined', function () {
        let promise;
        beforeEach(function () {
            validator =  stub().returns(undefined);
            promise = create(req, db, validator, ValidationError);
            return promise;
        });
        describe('should call the validator', function () {
            it('once', function () {
                assert(validator.calledOnce);
            });
            it('with req as the only argument', function () {
                assert(validator.calledWithExactly(req));
            });
        });
        it('should relay the promise returned by db.index()', function ()
        {
            //promise.then(res => assert.strictEqual(res, dbIndexResult));
        });

        it('should return the correct string when error.keyword is "pattern"', function () {
            const errors = [{
                keyword: 'pattern',
                dataPath: '.test.path',
            }];
            //const actualErrorMessage = generateValidationErrorMessage(errors);
            //const expectedErrorMessage = "The '.test.path' field should be a valid bcrypt digest";
            //assert.equal(actualErrorMessage, expectedErrorMessage);
        });
    });
    describe('When validator returns with an instance of ValidationError', function () {
        it('should reject with the ValidationError returned from validator', function () {
            const validationError = new ValidationError();
            validator =  sinon.stub().returns(validationError);
            return create(req, db, validator, ValidationError)
            .catch(err => assert.strictEqual(err, validationError));
        });
    });
});
