//import createUser from "../../../../src/handlers/users/create";
import { genSaltSync, hashSync } from 'bcryptjs';
import crypto from 'crypto';

function getValidPayload(type, db) {
    const lowercaseType = type.toLowerCase();
    switch (lowercaseType) {
        case 'create user':
        case 'login':
           // return createUser(db);
           let salt = genSaltSync(10);
           let password = crypto.randomBytes(32).toString('hex');
           let digest_ = hashSync(password, salt);
            return {
                email: "e@gmail.com",
                digest: digest_,
            };
        default:
            return undefined;
    }
}

function convertStringToArray(string) {
    return string
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');
}

async function createUser(db) {
    let user = {
        password: null,
        salt: null,
        email: "e@gmail.com",
        digest: null
    };

    user.salt = genSaltSync(10);
    user.password = crypto.randomBytes(32).toString('hex');
    user.digest = hashSync(user.password, user.salt);

    const result = await db.index({
        index: 'nodejstrainingproject',
        type: 'user',
        body: {
            email: user.email,
            digest: user.digest
        }
    });
    return result;
}

export {
    getValidPayload,
    convertStringToArray,
};