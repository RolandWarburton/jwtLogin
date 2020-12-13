# JWT Single Sign-on System

Playing around with JWT and Oauth2. bootstrapped with [ankur-anand/simple-sso](https://github.com/ankur-anand/simple-sso).

~~I have modified the provided boilerplate to use mongoDB as a database for caching tokens, sessions, users, and clients.~~
I have re-written the entire application from the ground up and better implemented mongodb and have a better understanding of the [openid authentication process](https://openid.net/specs/openid-connect-basic-1_0.html#CodeFlow) etc.

## How it works (openid connect basics)

The code flow and authentication explained below follows the steps from the "openid connect basic" client implementers guide (section 2.1), it describes the process generically as follows.

1. Client prepares an Authentication Request containing the desired request parameters.
2. Client sends the request to the Authorization Server.
3. Authorization Server authenticates the End-User.
4. Authorization Server obtains End-User Consent/Authorization.
5. Authorization Server sends the End-User back to the Client with code.
6. Client sends the code to the Token Endpoint to receive an Access Token and ID Token in the response.
7. Client validates the tokens and retrieves the End-User's Subject Identifier.

## How it works (more specifically)

Specifically the flow (as explained by me) follows this slightly more specific process/breakdown.

Using express on the client, two sets of middleware are implemented, `isAuthenticated` and `checkReceivingToken`.

### isAuthenticated client middleware

isAuthenticated is required to be run on routes that restricted access is desired, ie through `req.get("/", [isAuthenticated], controller)`. The purpose of this middleware is to check the [express-session](https://www.npmjs.com/package/express-session) for a `user` cookie provided by the *sso-server* and assigned by the *client*.

### checkReceivingToken client middleware

checkReceivingToken is required to be run on every route, ie through `app.use(checkReceivingToken)`. The purpose of this middleware is to look for a url based *query* `?token=encoded_jwt_token` where encoded_jwt_token is a cacheToken with the form:

```json
{
	"_id": "String",
	"client": "String",
	"user": "String",
};
```

The cacheToken is encoded as a JWT token and appended to the responding url. An example of the responding url that the browser is redirected to after the user has provided their details on the sso-server login page.

IE. this url is encoded in `ProcessLogin.js` after `promptLogin` (on the server).

```none
http://exampleClient.com?token=encoded_jwt_token&serviceURL=http://exampleCLient.com/originalPage
```

### Code flow

* Client is [http://client.com](http://example.com).
* Server is [http://sso.com](http://sso.com).

1. Browser loads route that is authenticated. Client runs the `isAuthenticated` middleware and looks for `req.session.user`.
2. No user us found so the browser is redirected to `http://sso.com/auth/promptLogin?serviceURL=http://client.com`.
3. SSO server presents a login form for the users credentials at *GET* `auth/promptLogin?serviceURL=...`.
4. On *POST* to `auth/promptLogin?serviceURL=...` the following steps happen.
   1. The client is retrieved based on the serviceURL query.
   2. The user is retrieved based on the submitted form username/password.
   3. If **user** and **client** both exist then the following steps happen.
      1. A cacheToken is generated for this request containing - the user and client \_id, and a random unique token \_id.
      2. A JWT token is signed using the clients secret with the full cacheToken payload.
      3. The browser is redirected to the client with both the `serviceURL` and `token` query attached. For example `http://client.com?serviceURL=http://client.com&token=encoded_jwt_token`.
5. The client intercepts the `?token=encoded_jwt_token` query through the use of `checkReceivingToken` middleware. The following steps are then taken withing the `checkReceivingToken` middleware.
   1. The `?token` query value is verified for authenticity using the clients pre-shared secret.
   2. The client prepares a response payload to the sso server with the decoded _id field from the authorized JWT token.
      1. The response must contain a header with the value `Authorization: Bearer decoded_jwt_token_id`.
      2. The response should be a GET request.
      3. The url should be `http://sso.com/auth/verifyToken`. The authorization is provided in the headers Authorization field.
   3. The client then sends this request to the sso server with the **decoded jtw token id** authorization header.
6. The sso server receives the **decoded jtw token id** and retrieves the **cacheToken** from its own database.
7. The sso server matches the bearer id from the clients request against the cacheToken from the database and if they match a response is made.
   1. The sso server first creates a session entry in the database for logging purposes.
   2. The response is then created containing - the user and client id, the users policy for this app, and the newly created sessions id.
   3. The cacheToken for the authentication is now deleted as its no longer required (the client has been verified) by via the validation of the provided JWT that was signed using the clients secret.
   4. The sso server responds to the client using a json payload containing the signed (with the clients secret) token with: the user, client, and session id.
8. the client then verifies the payload based on its signature and sets the `req.session.user` object to the payload from sso.

TLDR:

1. GET  http://client.com -> redirect to
2. GET  http://sso.com/auth/promptLogin?serviceURL=http://client.com -> submit login form
3. POST http://sso.com/auth/promptLogin?serviceURL=http://client.com -> process login
4. GET  http://client.com?token=jwt_token&serviceURL=http://client.com -> redirect to
5. GET  http://sso.com/auth/verifyToken -> get user details
6. GET  http://client.com -> redirect to

TODO:

* Document stuff
  * UI for adding clients
  * Explanation on how to implement new clients
  * etc...
* Make implementation easier for clients
* Build statistics and tracking stuff

Refer to setup.md for further instruction and configuration.
