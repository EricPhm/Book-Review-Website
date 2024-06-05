var express = require('express');
var router = express.Router();
// bcrypt password
const bcrypt = require('bcrypt');
// generate rand token
const { v4: uuidv4 } = require('uuid');
const log_inDao = require('../log_in_sql')

// get function addAuthToken from another path
const { addAuthToken } = require('../models/auth_token_cache')

// user login
router.post('/', async (req,res) => {
    const user_name = req.body.userName

    // check userName if it exists
    let bool = await log_inDao.checkUserName(user_name)
    if (bool === false) {
        return res.status(404).send("UserName not found")
    }
    
    const user_password = await log_inDao.getUserPassword(user_name)
    try {
        const match = await bcrypt.compare(req.body.userPassword, user_password) // compare return promise
        if (match){
            //uuidv4 generate random token 
            const token = uuidv4();
            // add token to dictionary in auth_token_cache.js
            addAuthToken(token, user_name)
            // if AuthToke expired, does it automatically log out?
            // put token to cookie
            res.cookie('AuthToken', token, {maxAge: 1000 * 60 * 60 * 24}) // keep token for 1 day
            
            // console.log(req.cookies.AuthToken)
            // const user = getUserId(req.cookies.AuthToken)
            // console.log(user)

            // add redirect to another page
            res.send("login success")
        } else {
            res.send("wrong password")
        }
        
    } catch(error) {
        console.error('Error:', error);
        res.status(500).send("Something bad happened")
    }
})

// register user
router.post('/register', async (req,res) => {
    // the name in body need to match req.body.name
    const userName = req.body.userName
    const password = req.body.userPassword
    
    // check userName
    let bool = await log_inDao.checkUserName(userName)
    if (bool === true) {
        return res.status(404).send("User name existed")
    }

    try{
        const salt = await bcrypt.genSalt() // generate random salt, return promise
        // generate salt + password 
        const userPassword = await bcrypt.hash(password, salt)
        // add userName and hashedPassword to database
        // the parameter name need to match with the name in log_in_sql.js
        const id = await log_inDao.addUser({userName, userPassword})

        //generate token
        const token = uuidv4()
        addAuthToken(token, userName)
        res.cookie("AuthToken", token, { maxAge: 1000 * 60 * 60 * 24 })
        // send response if succeeded
        res.status(200).send(id)
    } catch {
        res.status(500).send("Something bad happened")
    }

})


module.exports = router;