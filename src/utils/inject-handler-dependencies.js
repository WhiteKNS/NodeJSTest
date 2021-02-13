function injectHandlerDependencies(handler, db, handlerToEngineMap, handlerToValidatorMap, ValidationError, getSalt, generateFakeSalt) {
    const engine = handlerToEngineMap.get(handler);
    const validator = handlerToValidatorMap.get(handler);
    return (req, res) => { handler(req, res, db, engine, validator, ValidationError, getSalt, generateFakeSalt); };
}

export default injectHandlerDependencies;
