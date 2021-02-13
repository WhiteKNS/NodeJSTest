import assert, { AssertionError } from 'assert';
import { decode } from 'jsonwebtoken';
import { Then } from 'cucumber';

Then(/^the JWT payload should have a claim with name (\w+) equal to context.([\w-]+)$/, function (claimName, contextPath) {
    const decodedTokenPayload = decode(this.responsePayload);

    if (decodedTokenPayload === null) {
        throw new AssertionError();
    }
    assert.equal(decodedTokenPayload[claimName], objectPath.get(this, contextPath));
});
