function getValidPayload(type) {
    const lowercaseType = type.toLowerCase();
    switch (lowercaseType) {
        case 'create user':
            return {
                email: 'some_email@gmail.com',
                password: 'password',
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

export {
    getValidPayload,
    convertStringToArray,
};