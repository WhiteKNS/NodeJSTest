
Feature: the client creates a POST request to users
    Scenario: Empty Payload
    When the client creates a POST request to users
    And attaches a generic <payloadType> payload
    And sends the request
    Then our API should respond with a <statusCode> HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says <message>

    Examples:
    | payloadType   | statusCode    | message|
    | empty         | 400           | "Payload should not be empty"|