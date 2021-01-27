function getValidPayload(type) {
    const lowercaseType = type.toLowerCase();
    switch (lowercaseType) {
        case 'create user':
            return {
                email: "e@gmail.com",
                password: "1"
                //"password": "Content for key two",
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