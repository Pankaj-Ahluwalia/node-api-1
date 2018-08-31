/* References
 * https://httpstatuses.com/
 * 
 * Heroku App:
 * aqueous-bayou-91044
 * 
 */


const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


// set port to handle dynmic port setup by Heroku
const port = process.env.PORT || 3000;


const app = express();
//add middleware: body-parser ...????
app.use(bodyParser.json());     // ??????????????????Why, what for?


app.get('/',(req,res)=>{
    res.send('<h1>Hello World.</h1>');
});

// create Endpoints
app.post('/todos', (req,res)=>{
    // console.log(req.body);

    // capture data from request object
    const todo = new Todo({
        text: req.body.text
    });

    // save to DB:    
    todo.save().then(doc=>{
        res.status(200).send(doc);
    },e=>{
        res.status(400).send(e);
    } );
});

app.get('/todos', (req,res)=>{
    Todo.find().then(todos=>{
        res.send(todos);
    },e=>{
        res.status(400).send(e);
    })
});

app.get('/todos/:id',(req,res)=>{
    //  res.send(req.params);
    const paramID = req.params.id;
    const blnInvalidID = !ObjectId.isValid(paramID);

    // validate ID: UDF
    if (blnInvalidID){
        res.status(404).send();
    }

    // find by id
    Todo.findById(paramID).then(todo=>{
        if (!todo) res.status(404).send('Record not found...');

        res.send({todo});   //send response to client

    }).catch(e=>{
        res.status(400).send();
    });

});

app.listen(port, ()=>{
    console.log('Server started on Port: ' + port);
});
 

module.exports = {app};
