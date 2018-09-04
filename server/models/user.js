const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema( {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value)=>{
                return validator.isEmail(value);
            },
            message: '{value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    } ]
}

);

UserSchema.statics.findByToken = function(token){
    const User = this;
    let decoded;

    console.log('verifying token: ' , token);

    try{
        decoded = jwt.verify(token, 'myKey');
    }catch(e){
        // throw error if user is not verified
        // return new Promise( (resolve,reject)=>{
        //     reject();
        // });

        return Promise.reject();

    }

    console.log('decoded: ' , decoded);

    
    return User.findOne({
        '_id': decoded._id,
        'tokens.token' :token,
        'tokens.access': 'auth'
    });
}

UserSchema.statics.findByCredentials = function(challangeEmail,challengePassword){
     
    console.log('verifying Email & password: ' , challangeEmail, ', ', challengePassword);

    const User = this;
  
    ///////////////////////////////////////////
    // 1. fetch user with matching email

   //password in database - Already Hashed
//    let userFound={};

    return User.findOne({
        'email': challangeEmail
    }).then( (user)  => {
        if(!user){
            return Promise.reject();
        }

        // userFound = new Object(user);
        console.log('user found - SUCCESS!', user);
               
        const origHash = user.password; 
        
        return new Promise ((resolve, reject)=>{
            bcrypt.compare( challengePassword, origHash, (err, res)=>{
                if (res){
                    console.log('Success in comparing hash: ', res);   
                }else{
                    console.log('Error while comparing hash: ', err);
                    reject()                                     
                }
                resolve(user);            
            });
        });
 
    })
    .catch((e)=>{
        console.log('Errro in user.js: ', e);
        throw new Error(e);
    });

};



 

 





UserSchema.pre('save', function(next){
    // console.log('Pre save');
    const user = this;

 
    if (user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt, (e,hash)=>{
                user.password = hash;
                // console.log('Hashed: ' , hash);
                next();
            });
        });
    }else{
        next();
    }
});


// Over-ride methods
UserSchema.methods.toJSON = function () {
    const user = this;
    // const userObject = user.toObject();
    const userObject = {
        _id: user._id,
        email: user.email
    };
    
    return userObject;
};



// Schema Instance methods
UserSchema.methods.generateAuthToken = function(){
    
    const user = this;
    const access = 'auth';
   
    // generate Token: (Next update user tokens array)
    // const token = jwt.sign({_id: user._id.toHexString(), access}, 'myKey').toString();
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'myKey').toString();
  
    // user.tokens.concat([{access,token}]);
    user.tokens.push({access,token});

    console.log("Inside generateAuthToken: ", JSON.stringify(user.tokens,null,2));
    
    //save user again and return the token
    return user.save().then(()=>token);
};

// Create mongoose model: User
const User = mongoose.model('User', UserSchema );

console.log("Exporting Model: User");


module.exports = {User, UserSchema};