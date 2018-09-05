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
app.post("/todos",authenticate, (req, res) => {
  // console.log(req.body);

  // capture data from request object
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id  //set the creteror to current-user-ID
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
app.post("/todos-many",authenticate, (req, res) => {
  // res.send(req.body.data);

  // // or, for inserting large batches of documents : https://mongoosejs.com/docs/models.html
  // Tank.insertMany([{ size: 'small' }], function(err) {

  // capture data from request object
  const todoArr = req.body.data;
  todoArr.array.forEach(todo => {
    todo._creator= req.user._id ; //set the creteror to current-user-ID
  });

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

app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    _creator:req.user._id
  }).then(todos => {
      res.send(todos); //Sucesss:return objects fund to client
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos/:id",authenticate, (req, res) => {
  
  const paramID  = ValidateUserId(req, res);

  // // find by id
  // Todo.findById(paramID) -- replaced after addiing authentication

  Todo.findOne({
    _id: paramID,
    _creator: req.user._id  
  })
  .then(todo => {
    if (!todo) res.status(404).send("Record not found...");

    res.send({ todo }); //Sucesss:return object fund to client
  })
  .catch(e => {
    res.status(400).send(); //error
  });
});


// create Endpoints: DELETE/
app.delete("/todos/:id", authenticate, (req, res) => {
  //validate userId
  const paramID = ValidateUserId(req, res);

  /*
  // commented after adding authentication
  Todo.findByIdAndDelete(paramID).then( (todo) => {
      res.send({ todo }); //Sucesss:return object deleted to client
    },
    e => {
      res.status(400).send(); //error
    }
  );

*/


  Todo.findOneAndRemove({
    _id:paramID,
    _creator: req.user.id
  }).then( (todo) => {
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
app.patch ('/todos/:id',authenticate,(req,res)=>{
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

  // Todo.findByIdAndUpdate(id, {$set: body},{new: true })

  Todo.findOneAndUpdate({
    _id: paramID,
    _creator: req.user._id
  }, {$set: body},{new: true })
  
  .then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send(todo);
  }).catch((e)=> {
    res.status(400).send();
  });



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

// First private route:
app.get('/users/me', authenticate, (req,res)=>{
  // send back authenticated-user now available on request
    res.send(req.user);
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

// Second private route: -- To delete  token when user logs out
app.delete('/users/me/token', authenticate, (req,res)=>{
// NOTE: authenticate middeleware puts up Uer & Token onto Request object
// by extracting same from x-Auth Headder inside Request-object
  req.user.RemoveToken(req.token).then(()=>{
    res.status(200).send('Done');
  }, ()=>{
    res.status(400).send();
  }).catch ((e)=>{
    res.send(e);
  });
});

app.listen(port, () => {
  console.log("Server started on Port: " + port);
});

module.exports = { app };
