//import "@babel/polyfill";

import assert from 'assert';
import elasticsearch from 'elasticsearch';
import ValidationError from '../../../validators/errors/validation-error';
import createUserValidator from '../../../validators/users/create';
import deleteUserValidator from '../../../validators/users/delete'
import create from '../create';
import delete_user from '../delete';

import { genSaltSync, hashSync } from 'bcryptjs';
import crypto from 'crypto';


const db = new elasticsearch.Client({
host:
    'http://localhost:9200',
    //`${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

describe('User Create Engine', function () {
     describe('When invoked with invalid req', function () {
         it('should return promise that rejects with an instance of ValidationError', function () {
             const req = {};
            create(req, db, createUserValidator, ValidationError)
              .catch(err => assert(err instanceof ValidationError));
        });
     });
    describe('When invoked with valid req', function () {
        it('should return a success object containing the user ID', function () {
            let salt = genSaltSync(10);
            let password = crypto.randomBytes(32).toString('hex');
            let digest_ = hashSync(password, salt);

            const req = {
                id: '1234567890',
                index: 'nodetest',
                type: 'test',
                body: {
                    email: 'e@gmail.com',
                    digest: digest_,
                    profile: {},
                },
            };
            create(req, db, createUserValidator, ValidationError)
            .then((result) => {
                assert.equal(result.result, 'created');
                assert.equal(typeof result._id, 'string');
            });
        });
    });
});

describe('User Delete  Engine', function () {
    describe('When invoked with invalid req', function () {
        it('should return promise that rejects with an instance of ValidationError', function () {
            const req = {
                id: '12345',
                index: 'nodetest',
                type: 'test',
                body: null
            };
            delete_user(req, db, req.id, req.index, req.type, deleteUserValidator, ValidationError)
             .catch(err => assert(err instanceof ValidationError));
       });
    });
   describe('When invoked with valid req', function () {
       it('should return a success object containing the user ID', function () {
        let salt = genSaltSync(10);
        let password = crypto.randomBytes(32).toString('hex');
        let digest_ = hashSync(password, salt);
           const req = {
               id: '12345',
               index: 'nodetest',
               type: 'test',
               body: {
                   email: 'e@gmail.com',
                   digest: digest_,
                   profile: {},
               },
               params: {
                index: null
            } 
           };
           create(req, db, deleteUserValidator, ValidationError);
           delete_user(req, db, req.id, req.index, req.type, deleteUserValidator, ValidationError)
           .then((result) => {
               assert.equal(result.result, 'deleted');
               assert.equal(typeof result._id, 'string');
           });
       });
   });
});