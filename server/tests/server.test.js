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
const {todos, populateTodos} = require('./seed/seed');

let text = '';

//  seed data
// beforeEach(populateTodos)
 
describe('Get/todos/',()=>{
it('should fetach all todos', (done)=> {
    request(app)
    .get('/todos')
    .expect(200)
    .end(done);
});
})



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


describe ('DELETE/toos/:id', ()=>{
    // let hexId = todos[0]._id;
    // let hexId = todos[0]._id.toHexString();
     let hexId ="5b89d2c2468f5a2dfc4fe53c";

    it('should remove a todo', (done)=>{
        request(app)
            .delete(`/todos/${hexId}`)                 
            .expect(200) 

            .end((err, res) =>{
                if (err) {
                    return done(err);
                }

                //check item in db
                Todo.findById(hexId).then( (todo)=>{
                    expect(todo).toNotExist();
                    done(); //wrap up tes: SUCCESS
                })
                .catch( (err)=> done(err));
            });

            // .expect((res)=>{
            //     expect(res.body._id).toBe(hexId);
            // })

    });

    // it('should remove a todo', (done)=>{
                 
    // });

    // it('should remove a todo', (done)=>{
                 
    // });

    

});




describe('Get/todos/id',()=>{ 
    // let  hexID = `${todos[0]._id.toHexString()}`;
    let  hexID = '5b8dfe3bc6f0e0187861659f';

     

    // it('should return todo doc',(done)=>{
    //     request(app)
    //         .get(`/todos/${hexID}`)
    //         .expect(200)
    //         .expect((res) =>{
    //             // expect(res.body.todo.text).toBe(todos[0].text);
    //         },e=> done(e))
    //         .end(done);
    // });

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
