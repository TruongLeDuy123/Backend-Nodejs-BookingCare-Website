import db from "../models/index"
import bcrypt from 'bcryptjs';

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try
        {
            let userData= {}

            let isExist = await checkUserEmail(email)
            if (isExist)
            {
                // user already exist
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: {email: email},
                    raw: true
                })
                if (user)
                {
                    // compare password
                    let check = await bcrypt.compareSync(password, user.password); // false
                    if (check)
                    {
                        userData.errCode = 0
                        userData.errMessage = 'Ok',
                        delete user.password,
                        userData.user = user
                    }
                    else
                    {
                        userData.errCode = 3
                        userData.errMessage = 'Wrong password'
                    }
                }
                else
                {
                    userData.errCode = 2
                    userData.errMessage = `User's not found`
                }
            }
            else
            {
                // return error
                userData.errCode = 1
                userData.errMessage = `Your Email isn't exist in your system.`
            }
            resolve(userData)

        }
        catch(e)
        {
            reject(e)
        }
    })
}

let checkUserEmail = (useremail) => {
    return new Promise(async(resolve, reject) => {
        try
        {
        
            let user = await db.User.findOne({
                where: {email: useremail}
            }) 
            if (user)
            {
                resolve(true)
            }
            else
            {
                resolve(false)
            }
        }
        catch(e)
        {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try
        {
            let users = ''
            if (userId === 'ALL')
            {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL')
            {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }
        catch(e)
        {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers
}