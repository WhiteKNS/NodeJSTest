
Feature: the client creates a POST request to /users
    Scenario: Empty Payload
    When the client creates a POST request to /users
    And attaches a generic empty payload
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Payload should not be empty"