import Ajv from 'ajv';
import profileSchema from '../../../schema/users/profile.json';//'../../schema/users/profile.json';
import createUserSchema from '../../../schema/users/create.json';
import ValidationError from '../../../validators/errors/validation-error';
import generateValidationErrorMessage from '../../errors/messages/messages.js';


function validate(req) {
    const ajvValidate = new Ajv()
        .addFormat('email', /^[\w.+]+@\w+\.\w+$/)
        .addSchema([profileSchema, createUserSchema])
        .compile(createUserSchema);

    const valid = ajvValidate(req.body);
    if (!valid) {
        return new ValidationError(generateValidationErrorMessage(ajvValidate.errors));
    }
    return true;
}

export default validate;