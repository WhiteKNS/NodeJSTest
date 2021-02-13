Feature: Login User Test that we can create a user using a digest and then perform a login that returns successfully
Background: Create User with email and password digest
Given 1 new user is created with random password and email

Scenario Outline: Bad Client Requests
    When the client creates a POST request to users
    And attaches a Create User payload which is missing the <missingFields> fields
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "<message>"

    Examples:
    | missingFields | message                          |
    | email         | The '.email' field is missing     |
    | digest        | The '.digest' field is missing    |


Scenario Outline: Bad Request Payload

    When the client creates a POST request to users
    And attaches a Create User payload which is missing the <missingFields> fields
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "<message>"

    Examples:
    | missingFields | message                           |
    | email         | The '.email' field is missing      |
    | digest        | The '.digest' field is missing     |

Scenario Outline: Request Payload with Properties of Unsupported Type
    When the client creates a POST request to users
    And attaches a generic <payloadType> payload
    And sends the request
    Then our API should respond with a <statusCode> HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says <message>

    Examples:
    | payloadType   | statusCode    | message                                                       |
    | non-JSON      | 415           | 'The "Content-Type" header must always be application/json'   |

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


Scenario Outline: Request Payload with invalid digest format
    When the client creates a POST request to users
    And attaches a Create User payload where the digest field is exactly <digest>
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "The '/digest' field must be a valid digest"

    Examples:
    | digest                                                    |
    | a238juqy2                                                 |
    | a2$hkd$njkdvjnkjdvjkbdkasdv.sdbvjzdbvobaoeuyvdlzdv        |
    | !gh$vnfjkls$vfnjKSJNFV;kJSFn;vkjnfd;jkvnzd;kjfn;zdfjbn    |

Scenario: Login without supplying credentials
    When the client creates a POST request to login
    And sends the request
    Then our API should respond with a 400 HTTP status code

Scenario: Login attaching a well-formed payload
    When the client creates a POST request to login
    And attaches a valid Login payload
    And sends the request
    # this client doesn't exist, so we'll send 401 response back(200 in the book)
    Then our API should respond with a 401 HTTP status code
    And the payload of the response should be a JSON object
    And the response string should satisfy the regular expression /^[\w-]+\.[\w-]+\.[\w-.+\/=]*$/
    And the JWT payload should have a claim with name sub equal to context.userId

Scenario Outline: Login attaching a well-formed payload but invalid credentials
    When the client creates a POST request to login
    And attaches a Login payload where the <field> field is exactly <value>
    And sends the request
    Then our API should respond with a 401 HTTP status code
    And the payload of the response should be a JSON object

    Examples:
    | field     | value                                                         |
    | email     | non@existent.email                                            |
    | digest    | $2a$10$enCaroMp4gMvEmvCe4EuP.0d5FZ6yc0yUuSJ0pQTt4EO5MXvonUTm  |