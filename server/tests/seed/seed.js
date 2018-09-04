
const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo');


let todos = [ {
    _id: new ObjectId('5b885cc68f18d443349b988a'),
    text: "Test todo task in MogoDb"
    }, {
    _id: new ObjectId('5b8857554a56ca3cbc243ff6'),
    text: "Another todo in MogoDb"
}]


const populateTodos =(done) =>{
    Todo.deleteMany().then(()=>{
        return Todo.insertMany(todos);
    })
    .then(()=>done())
}

// beforeEach((done)=> {
//     Todo.remove({})
//     .then(()=>{
//         return Todo.insertMany(todos);
//     })
//     .then(()=>done());
// });

module.exports = {todos, populateTodos};

