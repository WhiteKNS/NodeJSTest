
function forbiddenRequest(res) {
    res.status(403);
    res.set('Content-Type', 'text/plain');
    res.send('Forbidden request');
}

export default forbiddenRequest;
