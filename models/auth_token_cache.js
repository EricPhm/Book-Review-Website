


// when the authToken in cookie expire, 
// go back to login and add new token to that userId
// create dictionary to hold token
const userIdsByAuthToken = {}

// add token to dictionary, then put authToken to cookie
// authToken as key
function addAuthToken(authToken, userId){
    userIdsByAuthToken[authToken] = userId
}

// from authToken in cookie, give out userId
function getUserId(authToken){
    return userIdsByAuthToken[authToken]
}

// delete token from dictionary when log out
// but keep userId in dictionary for next time
function deleteAuthToken(authToken){
    delete userIdsByAuthToken[authToken]
}

module.exports = {
    addAuthToken,
    getUserId,
    deleteAuthToken
}

