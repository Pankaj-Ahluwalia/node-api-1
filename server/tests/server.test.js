/*
* Mocha allows you to use any assertion library you wish  - https://mochajs.org/
* 
* 
*/

const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

 
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let text = '';
const todos = [ {
        _id: new ObjectId('5b885cc68f18d443349b988a'),
        text: "Test todo task in MogoDb"
        }, {
        _id: new ObjectId('5b8857554a56ca3cbc243ff6'),
        text: "Another todo in MogoDb"
    }]

describe('Get/todos/id',()=>{ 
    it('should return todo doc',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) =>{
                // expect(res.body.todo.text).toBe(todos[0].text);
            },e=> done(e))
            .end(done);
    });
    it('should return 404 if todo  not found',(done)=>{
        const hexId= new ObjectId().toHexString();
        
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids',(done)=>{               
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });


});



// //this code removes all data in mongoDB Collection: Todo
// beforeEach((done)=> {
//     Todo.remove({}).then(()=>done());
// });

// beforeEach((done)=> {

//     Todo.remove({})
//     .then(()=>{
//         return Todo.insertMany(todos);
//     })
//     .then(()=>done());
// });


// describe('Andrew Course', ()=> {
//     it ('should pass test by Andrew', (done)=>{
//         text = 'Test by Andrew'
//         request(app)
//             .post('/todos')
//             .send({text})
//             .expect(200)
//             .expect((res)=>{
//                 expect(res.body.text).toBe(text);          
//             })
//             .end((err,res)=>{
//                 if (err)  return done(err);
                
//                 Todo.find().then((todos)=>{
//                     expect(todos.length).toBe(1);
//                     expect(todos[0].text).toBe(text);
//                     expect(todos[0].text).toBe(text);
//                     done();
//                 });                 
//             } );
//     });
// });







describe ('Post/toos/Pankaj', ()=>{
    it('should pass this dummy test',()=>{        
        
    });

    it('should post a todo',(done)=>{

        text = 'Test todo - simple post';   //define document data
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);          
            })
            .end(done);
    });
    
    it('should post and check todo in database',(done)=>{

        text = 'Test todo task in MogoDb'   //define document data
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((todos)=>{
               
                Todo.find({text: "Test todo task in MogoDb"}).then((todos)=>{
                    // expect(todos.length).toBe(1);
                    // expect(todos[0].text).toBe(text);   
                    expect(todos.length).toBeGreaterThan(0);
                });
            }, e => done(e))
            .end(done);
    });
});

