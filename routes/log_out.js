
var express = require('express');
var router = express.Router();
const { deleteAuthToken, getUserId } = require('../models/auth_token_cache');

// logout - clear cookies and Auth token cache
router.post('/', (req,res) => {
    if (!req.cookies.AuthToken){
        res.sendStatus(404).send({ message: 'AuthToken not found to log out' })
        return
    }
    const userName = getUserId(req.cookies.AuthToken)
    if (!userName) {
        res.sendStatus(404, { message: 'User not found to log out'})
        return
    }
    res.clearCookie('AuthToken')
    deleteAuthToken(req.cookies.AuthToken)
    res.sendStatus(200, { message: 'logged out' })
})

module.exports = router
