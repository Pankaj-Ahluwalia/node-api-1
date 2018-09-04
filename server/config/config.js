var env = process.env.NODE_ENV || 'development';
 console.log ('env ************' , env);

// let url= 'mongodb://localhost:27017/'+dbName;  



const dbHost = "localhost";
const portDB = 27017;
const dbName = 'TodoApp';

let urlStart= `mongodb://${dbHost}:${portDB}`; 

// let url= `mongodb://${dbHost}:${portDB}/${dbName}`;  
 
// set up applicatio environment
if (env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = `${urlStart}/${dbName}`;  
}else if (env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = `${urlStart}/${dbName}Test`;  
}

 


 