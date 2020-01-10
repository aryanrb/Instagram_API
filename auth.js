const jwt = require('jsonwebtoken');

const User = require("./models/users");


module.exports.verifyUser = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if(!authHeader){
        let err = new Error('Auth header not set');
        res.setHeader("WWW-Authenticate", "Bearer")
        err.status = 401;
        return next(err);
    }

    let token = authHeader.split(' ')[1];
    let data;
    try{
        data = jwt.verify(token, 'secretKey');
    }catch(err) {
        throw new Error('Token could not be verified');
    }

    User.findById(data._id)
        .then((user) => {
            req.user = user;
            next();
        })
}