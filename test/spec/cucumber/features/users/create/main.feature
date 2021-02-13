
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
    | non-JSON      | 415           | 'The "Content-Type" header must always be application/json' |

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
    And contains a message property which says "<message>"

    Examples:
    | missingFields | message                           |
    | email         | The '.email' field is missing     |
    | digest      | The '.digest' field is missing  |


    Scenario Outline: Request Payload with invalid email format
    When the client creates a POST request to users
    And attaches a Create User payload where the email field is exactly <email>
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "The '/email' field must be a valid email"

    Examples:
    | email     |
    | a238juqy2 |
    | a@1.2.3.4 |
    | a,b,c@!!  |

    Scenario: Minimal Valid User
    When the client creates a POST request to users
    And attaches a valid Create User payload
    And sends the request
    Then our API should respond with a 201 HTTP status code
    And the payload of the response should be a string
    And the payload object should be added to the database, grouped under the "user" type
    And the newly-created user should be deleted


    Scenario Outline: Invalid Profile
    When the client creates a POST request to users
    And attaches <payload> as the payload
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "<message>"

    Examples:
    | payload                                                                                                                                   | message                                                   |
    | {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{"foo":"bar"}}                       | The '/profile' object does not support the field 'foo'    |
    | {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{"name":{"first":"Jane", "a":"b"}}}  | The '/profile/name' object does not support the field 'a' |
    | {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{"summary":0}}                       | The '/profile/summary' field must be of type string       |
    | {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{"bio":0}}                            | The '/profile/bio' field must be of type string           |


    Scenario Outline: Valid Profile
    When the client creates a POST request to users
    And attaches <payload> as the payload
    And sends the request
    Then our API should respond with a 201 HTTP status code
    And the payload of the response should be a string
    And the payload object should be added to the database, grouped under the "user" type
    And the newly-created user should be deleted

    Examples:
    | payload                                                                           |
    | {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{}}                            |
    | {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{"name":{}}}                   |
    | {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{"name":{"first":"Daniel"}}}   |
    #| {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{"bio":"bio"}}                 |
    #| {"email":"e@ma.il","digest":"$2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm","profile":{"summary":"summary"}}         |