

const pool = require('./mysql')

// get the password of the user from the database to compare
async function getUserPassword(user){
    const connection = await pool
    const [results] = await connection.execute(
        'SELECT userPassword FROM users WHERE userName = ?',
        [user]
    )
    // result is entire result object
    return results[0].userPassword
}

// check user name before login/register
async function checkUserName(user){
    const connection = await pool
    const [results] = await connection.execute(
        'SELECT userName FROM users WHERE userName = ?', 
        [user]
    )
    if (results.length === 0){
        // userName not exist
        return false;
    } else {
        // userName exists
        return true
    }
}

// add new user to database
async function addUser(user){
    const connection = await pool
    const [results] = await connection.execute(
        'INSERT INTO users (userName, userPassword) VALUES (?, ?)',
        [user.userName, user.userPassword]
    )
    return results.userName

}


module.exports = {
    getUserPassword,
    checkUserName,
    addUser
}