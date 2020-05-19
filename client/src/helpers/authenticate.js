/**
 * In this helper class, i want to check if there is a stored jwt token. 
 * If no token exists - user is not logged in, return false as not authenticated.
 * If token exists and is still valid - return true as authenticated.
 * If token exists but is expired - send refresh token to api and get a new authentication token, then return true as authenticated.
 * - if refresh token is invalid, return false
 */
function authenticate() {
    
}