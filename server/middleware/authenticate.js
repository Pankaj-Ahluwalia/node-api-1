// NOTE: authenticate middeleware puts up Uer & Token onto Request object
// by extracting same from x-Auth Headder inside Request-object
var {User } = require('../models/user');    //get reference to User model

const authenticate = (req,res, next)=>{
    // captre token from request-header
    const token = req.header('x-Auth');
  
    User.findByToken(token)
    .then((user)=>{
      if (!user){
        // the token is valid, but for some reasons query could not find a document
        // that matched the params we specified
        // res.status(401).send();  //or

        console.log('authenticate middleware --- Promise.reject()', );

        return Promise.reject();  //Failing to return Promises generates Error-500
      }
       
      //assign to request: user+ token
      req.user = user;  
      req.token = token;  
  
      // console.log('authenticate middleware --- ends', user);
      next(); //invoke next
    }).catch((e)=>{
    // 401 - authentication required
    res.status(401).send();
    });
  
  };


  module.exports = {authenticate};
