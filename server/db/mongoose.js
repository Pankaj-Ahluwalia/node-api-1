
var mongoose = require('mongoose');


// const dbHost = "localhost";
// const port = 27017;
// const dbName = 'TodoApp';
// let url= `mongodb://${dbHost}:${port}/${dbName}`;  

// url= process.env.MONGODB_URI || `mongodb://${dbHost}:${port}/${dbName}`;  
url= process.env.MONGODB_URI;  

// configure mongoose:
 mongoose.Promise = global.Promise;  //use built-in Promise library
 
// Connect DB
mongoose.connect(url, { useNewUrlParser: true }, (err, client) =>{
    if(err){
        return console.log('unable to connect to MongoDB server');
    }
    // console.log('Connected to MongoDB server (inside mongoose.js): ' + dbName);
        
    //close connection
    // client.close();

});


module.exports = { mongoose };


