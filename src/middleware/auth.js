const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'secret')
         
        const user=await User.findById(decoded._id)
        //const user=await User.findByIdAndDelete(decoded._id)
       // const user = await User.findOne({ _id: decoded._id })
        //const user1=await User.find({})
        if (!user) {
            throw new Error()
        }
        req.token=token
        req.user = user
        next()
    } catch (e) {
        //res.status(401).send({error: ' please authenticate '})
        console.log(e)
        res.send('not authenticated').status(401)
    }
}

module.exports = auth

