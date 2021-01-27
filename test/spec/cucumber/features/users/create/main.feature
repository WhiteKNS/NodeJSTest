
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


    Scenario Outline: Bad Request Payload

    When the client creates a POST request to users
    And attaches a Create User payload which is missing the <missingFields> fields
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Payload must contain at least the email and password fields"

    Examples:
    | missingFields |
    | email |
    | password |


    Scenario Outline: Request Payload with invalid email format
    When the client creates a POST request to users
    And attaches a Create User payload where the email field is exactly <email>
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "The email field must be a valid email"

    Examples:
    | email     |
    | a238juqy2 |
    | a@1.2.3.4 |
    | a,b,c@!!  |