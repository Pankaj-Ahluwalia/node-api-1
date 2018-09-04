/* References
 * https://httpstatuses.com/
 * 
 * Heroku App:
 * aqueous-bayou-91044
 * 
 */

var _ = require('lodash');


require('./config/config');


const express = require("express");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");

const{authenticate} = require('./middleware/authenticate');


// set port to handle dynmic port setup by Heroku
const port = process.env.PORT || 3000;

const app = express();
//add middleware: body-parser ...????
app.use(bodyParser.json()); // ??????????????????Why, what for?


// Private Functions area:
let ValidateUserId = (req, res) => {
  const paramID = req.params.id;
   if ( !ObjectId.isValid(paramID)) {
    res.status(404).send();
   }
   return paramID;
  }
  
 

// create Endpoints: POST

// Post: single Docoumnent/Record
app.post("/todos", (req, res) => {
  // console.log(req.body);

  // capture data from request object
  const todo = new Todo({
    text: req.body.text
  });

  // save to DB:
  todo.save().then(
    doc => {
      res.status(200).send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// Post: Multiple Docoumnent/Record
app.post("/todos-many", (req, res) => {
  // res.send(req.body.data);

  // // or, for inserting large batches of documents : https://mongoosejs.com/docs/models.html
  // Tank.insertMany([{ size: 'small' }], function(err) {

  // capture data from request object
  const todoArr = req.body.data;

  /* Deprecatied:
        // save to DB: this code saves data to mogoDB but is now deprecated
        Todo.collection.insert(todoArr).then( (docs)=>{
            res.status(200).send(docs);
        } );

        //   (node:15912) DeprecationWarning: collection.insert is deprecated. 
        //   Use insertOne, insertMany or bulkWrite instead.
    */
    Todo.insertMany(todoArr).then ((docs)=>{
        // console.log(JSON.stringify(docs,null,2));
        res.status(200).send(docs);
    }, (e)=>{
        res.status(400).send(e);
    }); 
    

});


// create Endpoints: GET/


app.get("/", (req, res) => {
    let welcomeMsg = '<h1>Hello World</h1><h2>This is todo-api</h2>';
    res.status(200).send(welcomeMsg);
});

app.get("/todos", (req, res) => {
  Todo.find().then(todos => {
      res.send(todos); //Sucesss:return objects fund to client
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos/:id", (req, res) => {
  
  const paramID  = ValidateUserId(req, res);

  // // find by id
  Todo.findById(paramID)
    .then(todo => {
      if (!todo) res.status(404).send("Record not found...");

      res.send({ todo }); //Sucesss:return object fund to client
    })
    .catch(e => {
      res.status(400).send(); //error
    });
});


// create Endpoints: DELETE/
app.delete("/todos/:id", (req, res) => {
  //validate userId
  const paramID = ValidateUserId(req, res);

  Todo.findByIdAndDelete(paramID).then( (todo) => {
      res.send({ todo }); //Sucesss:return object deleted to client
    },
    e => {
      res.status(400).send(); //error
    }
  );
  // //Deprecated
  // Todo.findByIdAndRemove(paramID).then( (todo) => {
  //     res.send({ todo }); //Sucesss:return object deleted to client
  //   },
  //   e => {
  //     res.status(400).send(); //error
  //   }
  // );


});


/************************************************************
 * User End-points
 */

//  Patch
app.patch ('/todos/:id',(req,res)=>{
  const paramID  = ValidateUserId(req, res);
  const body = {
    'text': req.body.text,
    'completed': req.body.completed
  }
  
  if (typeof body.completed === 'boolean' && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed=false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body},{new: true })
  .then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send(todo);
  }).catch((e)=> {
    res.status(400).send();
  });

});

 
// First private route:
app.get('/users/me', authenticate, (req,res)=>{
  // send back authenticated-user now available on request
    res.send(req.user);
});

//  POST /user
app.post('/users', (req,res)=>{
  const body = _.pick(req.body,['email','password']);
  const user = new User(body);

    // 1. Save user to DB
  user.save().then( ()=>{
    //2. Generate new token & Save token to for user's Document
    return user.generateAuthToken();  //generateAuthToken - returns a promises with a token
  })
  .then((token)=> {
    // 3. Send back response: a) token in response header
      res.header('x-Auth', token).send(user);
  })
  .catch((err)=>res.status(400).send(err));

});

// POST users/login {email, password}: Dedicated route for LogIn
app.post('/users/login', (req,res)=>{ 
  const body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email, body.password)
    .then((user)=>{
      // generate a new token for each login
      return user.generateAuthToken()
      .then((token)=>{
        res.header('x-Auth', token).send(user)
        //generateAuthToken - returns a promise with a token
      });
       
    }).catch((e)=>{
      res.status(400).send('Authenticatiing Failed....');
  });
  
});

app.listen(port, () => {
  console.log("Server started on Port: " + port);
});

module.exports = { app };
