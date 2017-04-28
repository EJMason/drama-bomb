# Endpoints


## Friends
---
### /friends/ping
* Used to indicate if a user is logged in and active on a client.
  * Updates Redis expiry if user is still active, 5 mins

* Required header
  * id_token from Auth0 login in header as Authorization



## Auth
---
### POST /auth/login/init
  * This is the enpoint that needs to be hit after logging in, it will:
    * Check if the user is logged in
    * Find or Create a user profile reference in the database
    * Generate a idp for the user
    * Add user to redis cache while logged in

  * Required header
    * id_token from Auth0 login in header as Authorization
