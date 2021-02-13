import specialEscape from 'special-escape';

// delete it after adding the .env file
const PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIICCgKCAgEAzyvuoSFQYaPGsC5ePFrvNKIHDbSXyGffvfwnp10Z8bLnORWD4UU/\nwgHXy1/8WDqx9lAGcKy83X+7jVGUDuHN19sU+QrSRbCadCgG9yiIwol7QYXUJvFW\nmNW+uI3aOR+oUyAFbig6WieBMnC/4fZ7kqai7rt+fcQ6gozkAKkjrUDaipM8rdqD\n8NuZQa6Aje+DiWGf4c7mZBFzx5+RnU4g/5Ig6sqZXJu1sUbnO5sJW7eZjeqCj+/W\nODby4cmu/OV1LJQvAgnMpDXN4SGYs8oOOq8BeeBpo38p7LHlsqHCYBZ2JyHWRZJC\n/89QSZQBd82FxHm1c2BEfqtX8sIOKrRh7Khlu5HhsYcYApDQiWj5nuc4KNRgPScp\ntgMXFmK5zKq8qh8DlYMqpadlXm19oo/3/7tq8pY1uvE2T1kL12kPbwitAOxdIdVO\n62Z8mZ3QJm0Ava3UNX1/cR2CT2ni/0VFka+ZGo7aJ6opd6sodWD2nY+6PpPdI5Rp\nijsnI2WscDYlDEdgXwZWnQLac/JNST/8mStlTOUi9SgKuGvPE2F5CVIM4ZGjZJQy\nqC1JXgS2md81HDO3i2529y3EwcH/LPv0dR5PUtb/tdVRdrIQ6T0bXHfiaNimT1mb\ns0REoqLf+iukRgU/CQ7RfqoPMThPJPt5M8onBjYVOO7qXY+tNaVQee8CAwEAAQ==\n-----END RSA PRIVATE KEY-----"


const specialChars = ['+', '-', '=', '&&', '||', '>', '<', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', '/'];

function loginUser(req, db, validator, ValidationError, sign) {
    const validationResults = validator(req);
    if (validationResults instanceof ValidationError) {
        return Promise.reject(validationResults);
    }
    return db.search({
        index: 'nodejstrainingproject',
        type: 'user',
        q: `(email:${specialEscape(req.body.email, specialChars)}) AND (digest:${specialEscape(req.body.digest, specialChars)})`,
        defaultOperator: 'AND',
    }).then((res) => {
        if (res.hits.total > 0) {
            const payload = { sub: res.hits.hits[0]._id };
            const options = { algorithm: 'RS512' };
            const token = sign(payload, PRIVATE_KEY, options);
            return token;
        }
        return Promise.reject(new Error('Not Found'));
    });
}

export default loginUser;