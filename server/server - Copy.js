/*
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
*/

// A. Configure Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;  //use built-in Promise library

const dbHost = "localhost";
const port = 27017;
const dbName = 'TodoApp';
const colName = 'Todos'; //Todos , Users

// B. Connection String: Build
let url= `mongodb://${dbHost}:${port}/${dbName}`;  

// C. Connect to DB:
mongoose.connect(url, { useNewUrlParser: true });

// D. Create mongoose model:
var Todo = mongoose.model('Todo', {
    text:{
        type: String,
        required: true
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    } 
});

// E. Create new instance of Model
var newTodo = new Todo({
    text: 'Cook dinner',
    completed: false
});

console.log('Saving...');

// F. Save to DB: using model instance
newTodo.save().then((doc)=>{
    console.log(JSON.stringify(doc,undefined, 2) );
}, e=>{
    console.log('Unable to save Todo', e);
});


var otherTodo = new Todo({
    text: 'Feed the cat',
    completed: true,
    completedAt: 123
});


otherTodo.save().then((doc)=>{
    console.log(JSON.stringify(doc,undefined, 2) );
}, e=>{
    console.log('Unable to save Todo', e);
});





 


