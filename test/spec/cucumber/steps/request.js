import { When } from 'cucumber';


When(/^set the HTTP header field (?:"|')?([\w-]+)(?:"|')? to (?:"|')?(.+)(?:"|')?$/, function (headerName, value) {
    this.request.set(headerName, value);
});

When(/^sets the Authorization header to a valid token$/, function () {
    this.request.set('Authorization', `Bearer ${this.token}`);
});

When(/^sets the Authorization header to a token with wrong signature$/, function () {
    // Appending anything to the end of the signature will invalidate it
    const tokenWithInvalidSignature = `${this.token}a`;
    this.request.set('Authorization', `Bearer ${tokenWithInvalidSignature}`);
});
