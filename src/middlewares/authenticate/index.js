import test from 'jsonwebtoken';
import { JsonWebTokenError, verify } from 'jsonwebtoken';

const PUBLIC_KEY = '-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAzyvuoSFQYaPGsC5ePFrvNKIHDbSXyGffvfwnp10Z8bLnORWD4UU/\nwgHXy1/8WDqx9lAGcKy83X+7jVGUDuHN19sU+QrSRbCadCgG9yiIwol7QYXUJvFW\nmNW+uI3aOR+oUyAFbig6WieBMnC/4fZ7kqai7rt+fcQ6gozkAKkjrUDaipM8rdqD\n8NuZQa6Aje+DiWGf4c7mZBFzx5+RnU4g/5Ig6sqZXJu1sUbnO5sJW7eZjeqCj+/W\nODby4cmu/OV1LJQvAgnMpDXN4SGYs8oOOq8BeeBpo38p7LHlsqHCYBZ2JyHWRZJC\n/89QSZQBd82FxHm1c2BEfqtX8sIOKrRh7Khlu5HhsYcYApDQiWj5nuc4KNRgPScp\ntgMXFmK5zKq8qh8DlYMqpadlXm19oo/3/7tq8pY1uvE2T1kL12kPbwitAOxdIdVO\n62Z8mZ3QJm0Ava3UNX1/cR2CT2ni/0VFka+ZGo7aJ6opd6sodWD2nY+6PpPdI5Rp\nijsnI2WscDYlDEdgXwZWnQLac/JNST/8mStlTOUi9SgKuGvPE2F5CVIM4ZGjZJQy\nqC1JXgS2md81HDO3i2529y3EwcH/LPv0dR5PUtb/tdVRdrIQ6T0bXHfiaNimT1mb\ns0REoqLf+iukRgU/CQ7RfqoPMThPJPt5M8onBjYVOO7qXY+tNaVQee8CAwEAAQ==\n-----END RSA PUBLIC KEY-----';

function authenticate (req, res, next) {
    if (req.method === 'GET' || req.method === 'OPTIONS')   { return next(); }

    if (req.method === 'POST' && req.path === '/users')     { return next(); }

    if (req.method === 'POST' && req.path === '/login')     { return next(); }
    
    const authorization = req.get('Authorization');

    if (authorization === undefined) {
        res.status(401);
        res.set('Content-Type', 'application/json');
        return res.json({ message: 'The Authorization header must be set'});
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer') {
        res.status(400);
        res.set('Content-Type', 'application/json');
        return res.json({ message: 'The Authorization header should use the Bearer scheme' });
    }

    const jwtRegEx = /^[\w-]+\.[\w-]+\.[\w-.+/=]*$/;

    // If no token was provided, or the token is not a valid JWT token, return with a 400
    if (!token || !jwtRegEx.test(token)) {
        res.status(400);
        res.set('Content-Type', 'application/json');
        return res.json({ message: 'The credentials used in the Authorization header should be a valid bcrypt digest' });
    }

    verify(token, PUBLIC_KEY, { algorithms: ['RS512'] }, (err, decodedToken) => {
        if (err) {
            if (err instanceof JsonWebTokenError && err.message === 'invalid signature') {
                res.status(400);
                res.set('Content-Type', 'application/json');
                return res.json({ message: 'Invalid signature in token' });
            }

            res.status(500);
            res.set('Content-Type', 'application/json');
            return res.json({ message: 'Internal Server Error' });
        }

        req.user = Object.assign({}, req.user, { id: decodedToken.sub });
        return next();
    });

}

export default authenticate;