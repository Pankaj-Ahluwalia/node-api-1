var {User } = require('../models/user');    //get reference to User model

const authenticate = (req,res, next)=>{
    console.log('authenticate middleware --- start');

    // captre token from request-header
    const token = req.header('x-Auth');
  
    User.findByToken(token)
    .then((user)=>{
      if (!user){
        // the token is valid, but for some reasons query could not find a document
        // that matched the params we specified
        // res.status(401).send();  //or

        console.log('authenticate middleware --- Promise.reject()', );

        Promise.reject();
      }
       
      //assign to request: user+ token
      req.user = user;  
      req.token = token;  
  
      console.log('authenticate middleware --- ends', );
      next(); //invoke next
    }).catch((e)=>{
    // 401 - authentication required
    res.status(401).send();
    });
  
  };


  module.exports = {authenticate};
