# Endpoints


## Friends
### GET /friends/user/ids
* Required parameters
 * user_id: twitter id of current user
 * screen_name: twitter handle name

## Auth
### POST /auth/login/init
  * This is the enpoint that needs to be hit after logging in, it will:
   * Check if the user is logged in
   * Find or Create a user profile reference in the database
   * Generate a idp for the user
   * Add user to redis cache while logged in
  * Required header
    * id_token from Auth0 login in header as Authorization
