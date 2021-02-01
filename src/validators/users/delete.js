
import ValidationError from '../errors/validation-error';

function validate(req) {
    if (req.body === null) {
        return new ValidationError('The request body is empty');
    } else if(req.params.index === null) {
        return new ValidationError('The request params index is equal to null');
    }
    return true;
}

export default validate;