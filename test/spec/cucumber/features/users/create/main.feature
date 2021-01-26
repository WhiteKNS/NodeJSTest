
Feature: the client sends a POST request to users with an payload that is not JSON
    Scenario Outline:: Payload using Unsupported Media Type
    #If the client sends a POST request to /users with an payload that is not JSON,
    #it should receive a response with a 415 Unsupported Media Type HTTP status code.
    When the client creates a POST request to users
    And attaches a generic <payloadType> payload
    And sends the request
    Then our API should respond with a <statusCode> HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says <message>

    Examples:
    | payloadType   | statusCode    | message|
    | non-JSON      | 415           | 'The "Content-Type" header must always be "application/json"' |

    Scenario Outline:: Malformed JSON Payload
    #If the client sends a POST request to /users with an payload that is malformed,
    #it should receive a response with a 400 Unsupported Media Type HTTP status code.
    When the client creates a POST request to users
    And attaches a generic malformed payload
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Payload should be in JSON format"

    Examples:
    | payloadType   | statusCode    | message|
    | malformed     | 400           | "Payload should be in JSON format"|